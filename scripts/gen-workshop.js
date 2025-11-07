/**
 * 生成创意工坊的展示列表（workshop-list.json）。
 * 依据 scripts/workshop.projects.json 中的配置，筛选已打包存在的项目。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const minipRoot = path.join(root, 'main_miniprogram');
const assetsJsOut = path.join(minipRoot, 'assets', 'workshop-list.js');
const configPath = path.join(__dirname, 'workshop.projects.json');
const appJsonPath = path.join(minipRoot, 'app.json');

function existsRelative(rel) {
  return fs.existsSync(path.join(minipRoot, rel));
}

function generate() {
  if (!fs.existsSync(configPath)) {
    console.error('未找到配置：', configPath);
    process.exit(1);
  }
  const projects = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const available = [];
  for (const p of projects) {
    if (!p.enabled) continue;
    // 根据类型检查构建是否存在
    if (p.type === 'subpackage') {
      if (existsRelative(p.checkPath)) {
        available.push({
          name: p.name,
          title: p.title,
          description: p.description,
          route: p.route,
          tags: ['分包', '创意'],
        });
      }
    }
    // 预留其他类型（如 h5、小程序主包页面）
  }

  // 确保 assets 目录存在
  const assetsDir = path.dirname(assetsJsOut);
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const payload = { items: available };
  // 仅写出 JS 模块（供页面以 require 引入）
  const jsModule = `module.exports = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(assetsJsOut, jsModule, 'utf8');
  console.log('已生成创意工坊列表：', assetsJsOut, `（${available.length} 项）`);

  // 同步 app.json 分包声明（保证 route 可跳转）
  try {
    if (fs.existsSync(appJsonPath)) {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      // 兼容旧写法：subPackages -> 规范：subpackages（小写）
      if (Array.isArray(appJson.subPackages) && !Array.isArray(appJson.subpackages)) {
        appJson.subpackages = appJson.subPackages;
        delete appJson.subPackages;
      }
      appJson.subpackages = appJson.subpackages || [];
      // 通用分包同步：根据每个项目的 route 解析 root 与页面
      // 例：/subpackages/<pkg>/pages/home/index => root=subpackages/<pkg>, pagePath=pages/home/index
      const routePrefix = '/subpackages/';
      // 先构建映射：root => Set(pagePath)
      const subMap = new Map();
      for (const item of available) {
        if (!item.route || !item.route.startsWith(routePrefix)) continue;
        const rel = item.route.slice(routePrefix.length); // "cosplay/pages/home/index"
        const segs = rel.split('/');
        const pkgName = segs[0];
        const pagePath = segs.slice(1).join('/');
        const pkgRoot = `subpackages/${pkgName}`;
        // 仅在页面文件存在时加入
        const relWxml = path.join(pkgRoot, pagePath + '.wxml');
        if (!existsRelative(relWxml)) continue;
        if (!subMap.has(pkgRoot)) subMap.set(pkgRoot, new Set());
        subMap.get(pkgRoot).add(pagePath);
      }

      // 额外从分包自身 app.json 读取所有页面，合并到主 app.json
      for (const item of projects) {
        if (!item.route || !item.route.startsWith(routePrefix)) continue;
        const rel = item.route.slice(routePrefix.length);
        const pkgName = rel.split('/')[0];
        const pkgRoot = `subpackages/${pkgName}`;
        const subAppPath = path.join(minipRoot, pkgRoot, 'app.json');
        if (fs.existsSync(subAppPath)) {
          try {
            const subApp = JSON.parse(fs.readFileSync(subAppPath, 'utf8'));
            const pages = Array.isArray(subApp.pages) ? subApp.pages : [];
            for (const p of pages) {
              const relWxml = path.join(pkgRoot, p + '.wxml');
              if (!existsRelative(relWxml)) continue;
              // 如果该页面 JSON 声明为组件，则不合并为主 app.json 的分包页面
              const relJson = path.join(minipRoot, pkgRoot, p + '.json');
              if (fs.existsSync(relJson)) {
                try {
                  const pj = JSON.parse(fs.readFileSync(relJson, 'utf8'));
                  if (pj.component === true) continue;
                } catch (e) { /* 忽略解析错误 */ }
              }
              if (!subMap.has(pkgRoot)) subMap.set(pkgRoot, new Set());
              subMap.get(pkgRoot).add(p);
            }
          } catch (e) {
            console.warn('读取分包 app.json 失败：', subAppPath, e.message);
          }
        }
      }

      // 写回到 app.json：为每个 root 找到或创建分包，并合并页面列表
      for (const [pkgRoot, pagesSet] of subMap.entries()) {
        let pkg = appJson.subpackages.find(sp => sp.root === pkgRoot);
        const pkgName = pkgRoot.split('/').pop();
        if (!pkg) {
          pkg = { root: pkgRoot, name: pkgName, pages: [] };
          appJson.subpackages.push(pkg);
        }
        pkg.pages = pkg.pages || [];
        const existing = new Set(pkg.pages);
        for (const pagePath of pagesSet) {
          if (!existing.has(pagePath)) {
            pkg.pages.push(pagePath);
            existing.add(pagePath);
          }
        }
      }

      // 最终过滤：移除被标记为组件的页面，避免 RouterView 组件被当作分包页面
      for (const sp of appJson.subpackages) {
        if (!Array.isArray(sp.pages)) continue;
        sp.pages = sp.pages.filter(p => {
          const relJson = path.join(minipRoot, sp.root, p + '.json');
          if (fs.existsSync(relJson)) {
            try {
              const pj = JSON.parse(fs.readFileSync(relJson, 'utf8'));
              if (pj.component === true) return false;
            } catch (e) { /* ignore */ }
          }
          return true;
        });
      }
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf8');
      console.log('已同步 app.json 分包页面：', appJson.subpackages.map(sp => ({ root: sp.root, pages: sp.pages })));
    }
  } catch (err) {
    console.warn('同步 app.json 分包声明失败：', err.message);
  }
}

generate();