/**
 * 将 UniApp 的 mp-weixin 构建产物同步到原生壳分包
 * 运行：node scripts/sync-cosplay.js
 */
const fs = require('fs');
const path = require('path');

// 源与目标路径（根据构建模式决定 dev/build）
const isDevArg = process.argv.includes('--dev');
const source = path.resolve(
  __dirname,
  isDevArg ? '../cosplay_uniapp/dist/dev/mp-weixin' : '../cosplay_uniapp/dist/build/mp-weixin'
);
const target = path.resolve(__dirname, '../main_miniprogram/subpackages/cosplay');

function copyDir(src, dst) {
  if (!fs.existsSync(src)) {
    console.error('未找到 UniApp 构建产物：', src);
    process.exit(1);
  }
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

// 将 usingComponents 的绝对路径（/pages/...）改为相对当前文件路径，限定在分包根内
function fixUsingComponentsPaths(pkgRoot) {
  const pkgRootAbs = path.resolve(__dirname, '../main_miniprogram', pkgRoot);
  if (!fs.existsSync(pkgRootAbs)) return;
  walk(pkgRootAbs, (file) => {
    if (!file.endsWith('.json')) return;
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(raw);
      const uc = data.usingComponents;
      if (!uc || typeof uc !== 'object') return;
      let changed = false;
      for (const k of Object.keys(uc)) {
        const val = uc[k];
        if (typeof val === 'string' && val.startsWith('/')) {
          // 目标绝对路径（在分包根内）
          const targetAbs = path.join(pkgRootAbs, val.slice(1));
          // 如果目标存在（.json 或 .wxml），则转换为相对路径
          const existsJson = fs.existsSync(targetAbs + '.json');
          const existsWxml = fs.existsSync(targetAbs + '.wxml');
          if (existsJson || existsWxml) {
            const rel = path.posix.relative(path.posix.dirname(file), targetAbs).replace(/\\/g, '/');
            uc[k] = rel.startsWith('.') ? rel : `./${rel}`;
            changed = true;
          }
        }
      }
      if (changed) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      }
    } catch (e) {
      // 忽略非法 JSON
    }
  });
}

// 将被 RouterView 以组件方式引用的 pages/*/index 标记为组件
function markRouterPagesAsComponents(pkgRoot) {
  const pkgRootAbs = path.resolve(__dirname, '../main_miniprogram', pkgRoot);
  const routerViewJson = path.join(pkgRootAbs, 'components', 'routerView', 'index.json');
  if (!fs.existsSync(routerViewJson)) return;
  try {
    const data = JSON.parse(fs.readFileSync(routerViewJson, 'utf8'));
    const uc = data.usingComponents || {};
    Object.values(uc).forEach((p) => {
      if (typeof p !== 'string') return;
      // 解析相对路径为绝对文件路径
      const baseDir = path.dirname(routerViewJson);
      const targetBase = path.resolve(baseDir, p);
      // 仅处理分包内 pages 路径
      if (!targetBase.includes(path.join(pkgRootAbs, 'pages'))) return;
      const targetJson = targetBase + '.json';
      if (!fs.existsSync(targetJson)) return;
      try {
        const pj = JSON.parse(fs.readFileSync(targetJson, 'utf8'));
        if (pj.component !== true) {
          pj.component = true;
          fs.writeFileSync(targetJson, JSON.stringify(pj, null, 2), 'utf8');
        }
      } catch (e) {
        // ignore
      }
    });
  } catch (e) {
    // ignore
  }
}

// 将分包的 runtime/vendor 复制到主包 common 目录，避免跨独立分包 require 限制
function copyCommonRuntimeVendorToMain(pkgRoot) {
  const mainRoot = path.resolve(__dirname, '../main_miniprogram');
  const pkgRootAbs = path.join(mainRoot, pkgRoot);
  const srcRuntime = path.join(pkgRootAbs, 'common', 'runtime.js');
  const srcVendor = path.join(pkgRootAbs, 'common', 'vendor.js');
  const mainCommonDir = path.join(mainRoot, 'common');
  if (!fs.existsSync(mainCommonDir)) fs.mkdirSync(mainCommonDir, { recursive: true });
  const dstRuntime = path.join(mainCommonDir, 'uni_runtime.js');
  const dstVendor = path.join(mainCommonDir, 'uni_vendor.js');
  try {
    if (fs.existsSync(srcRuntime)) fs.copyFileSync(srcRuntime, dstRuntime);
    if (fs.existsSync(srcVendor)) fs.copyFileSync(srcVendor, dstVendor);
    console.log('已复制分包 runtime/vendor 到主包 common/');
  } catch (e) {
    console.warn('复制 runtime/vendor 失败：', e && e.message);
  }
}

// 在分包首页入口页注入顶级 console 日志，辅助定位加载是否成功
function instrumentIndexEntry(pkgRoot) {
  const mainRoot = path.resolve(__dirname, '../main_miniprogram');
  const entryJs = path.join(mainRoot, pkgRoot, 'pages', 'index', 'index.js');
  if (!fs.existsSync(entryJs)) return;
  try {
    let code = fs.readFileSync(entryJs, 'utf8');
    if (!code.includes('[Cosplay] compiled index.js loaded')) {
      code = `console.log('[Cosplay] compiled index.js loaded');\n` + code;
      fs.writeFileSync(entryJs, code, 'utf8');
      console.log('已为分包首页入口注入顶级 console');
    }
  } catch (e) {
    console.warn('入口注入失败：', e && e.message);
  }
}

console.log('同步 UniApp 构建产物到壳分包...', isDevArg ? '(dev 模式)' : '(build 模式)');
copyDir(source, target);
// 同步后修正分包内组件引用路径，保证在主小程序环境正常解析
fixUsingComponentsPaths('subpackages/cosplay');
// 标记被 RouterView 作为组件使用的 pages 为组件，避免空白渲染
markRouterPagesAsComponents('subpackages/cosplay');
// 复制 runtime/vendor 到主包并注入首页入口日志
copyCommonRuntimeVendorToMain('subpackages/cosplay');
instrumentIndexEntry('subpackages/cosplay');
console.log('完成：', target);