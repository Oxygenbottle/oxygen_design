/**
 * 将 UniApp 的 mp-weixin 构建产物同步到原生壳分包
 * 运行：node scripts/sync-cosplay.js
 */
const fs = require('fs');
const path = require('path');

const isDevArg = process.argv.includes('--dev');
const isWatchArg = process.argv.includes('--watch');

const projectArgIndex = process.argv.indexOf('--project');
const projectName =
  projectArgIndex >= 0 && process.argv[projectArgIndex + 1]
    ? process.argv[projectArgIndex + 1]
    : 'cosplay_uniapp';

function pickBuildDir(projectDir) {
  const mode = isDevArg ? 'dev' : 'build';
  const candidates = [
    path.join(projectDir, 'unpackage', 'dist', mode, 'mp-weixin'),
    path.join(projectDir, 'dist', mode, 'mp-weixin'),
    path.join(projectDir, 'dist')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const projectDir = path.resolve(__dirname, '..', projectName);
const source = pickBuildDir(projectDir) || path.resolve(
  __dirname,
  isDevArg ? '../cosplay_uniapp/dist/dev/mp-weixin' : '../cosplay_uniapp/dist/build/mp-weixin'
);
const target = path.resolve(__dirname, '../main_miniprogram/subpackages/cosplay');

function copyDir(src, dst) {
  if (!fs.existsSync(src)) {
    console.error('未找到 UniApp 构建产物：', src, 'project =', projectName);
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
  const srcMain = path.join(pkgRootAbs, 'common', 'main.js'); // 新增：复制 main.js
  const mainCommonDir = path.join(mainRoot, 'common');
  if (!fs.existsSync(mainCommonDir)) fs.mkdirSync(mainCommonDir, { recursive: true });
  const dstRuntime = path.join(mainCommonDir, 'uni_runtime.js');
  const dstVendor = path.join(mainCommonDir, 'uni_vendor.js');
  const dstMain = path.join(mainCommonDir, 'uni_main.js');    // 新增：目标文件
  try {
    if (fs.existsSync(srcRuntime)) {
      let runtimeContent = fs.readFileSync(srcRuntime, 'utf8');
      
      // 在runtime.js开头添加cosplaySubpackage初始化
      const initialization = `
// ===== 分包全局变量初始化 =====
var cosplaySubpackage = cosplaySubpackage || {};
if (typeof global !== 'undefined' && !global.cosplaySubpackage) {
  global.cosplaySubpackage = cosplaySubpackage;
}
// ===== 初始化结束 =====

`;
      
      runtimeContent = initialization + runtimeContent;
      fs.writeFileSync(dstRuntime, runtimeContent, 'utf8');
      console.log('已为runtime.js添加cosplaySubpackage初始化并复制到主包 common/');
    }
    
    // 修复vendor.js中的onLoad冲突问题
    if (fs.existsSync(srcVendor)) {
      let vendorContent = fs.readFileSync(srcVendor, 'utf8');
      
      // 在文件开头添加全局this保护
      const globalProtection = `
// ===== 分包安全保护 - 防止this上下文丢失 =====
(function() {
  const originalDefineProperty = Object.defineProperty;
  const protectedProperties = ['query', '$page', 'data'];
  
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj && protectedProperties.includes(prop)) {
      try {
        // 如果对象未定义，跳过设置
        if (!obj || obj === undefined || obj === null) {
          console.warn('[UniVendor:Protection] 尝试在无效对象上设置属性: ' + prop);
          return obj;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
      } catch (e) {
        console.warn('[UniVendor:Protection] 属性设置失败: ' + prop, e && e.message);
        return obj;
      }
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // 重写直接属性赋值保护
  const originalDefineProperty2 = Object.defineProperty;
  Object.defineProperty = function(obj, prop, attrs) {
    if (!obj || obj === undefined || obj === null) {
      console.warn('[UniVendor:Protection] 尝试在无效对象上定义属性: ' + prop);
      return;
    }
    try {
      return originalDefineProperty2.call(Object, obj, prop, attrs);
    } catch (e) {
      console.warn('[UniVendor:Protection] 定义属性失败: ' + prop, e && e.message);
    }
  };
})();
// ===== 分包安全保护结束 =====

`;
      
      // 查找并修复可能导致this上下文丢失的onLoad方法
      // 适配压缩后的代码格式，更灵活的正则表达式
      let modifiedContent = vendorContent.replace(
        /onLoad:function\([a-zA-Z_$][a-zA-Z0-9_$]*\)\{([^}]*\.[a-zA-Z_$][a-zA-Z0-9_$]*\.query\s*=\s*[^}]+)\}/g,
        function(match, body) {
          // 如果body中包含设置query的代码，添加安全检查
          if (body.includes('query') && !body.includes('this===undefined')) {
            return `onLoad:function(e){try{if(!this||null===this||void 0===this)return void console.warn("[UniVendor:onLoad] this上下文丢失，跳过执行");${body}}catch(n){console.warn("[UniVendor:onLoad] 执行失败:",n&&n.message)}}`;
          }
          return match;
        }
      );
      
      // 同时处理另一种可能的格式：onLoad:function(t){...}
      modifiedContent = modifiedContent.replace(
        /onLoad:function\([a-zA-Z_$][a-zA-Z0-9_$]*\)\{([^}]*\$page\.query\s*=\s*[^}]+)\}/g,
        function(match, body) {
          // 如果body中包含设置query的代码，添加安全检查
          if (body.includes('query') && !body.includes('this===undefined')) {
            return `onLoad:function(e){try{if(!this||null===this||void 0===this)return void console.warn("[UniVendor:onLoad] this上下文丢失，跳过执行");${body}}catch(n){console.warn("[UniVendor:onLoad] 执行失败:",n&&n.message)}}`;
          }
          return match;
        }
      );
      
      // 在文件开头添加全局保护
      vendorContent = globalProtection + modifiedContent;
      
      fs.writeFileSync(dstVendor, vendorContent, 'utf8');
      console.log('已修复vendor.js中的onLoad冲突并复制到主包 common/');
    }
    
    if (fs.existsSync(srcMain)) {
      let mainContent = fs.readFileSync(srcMain, 'utf8');
      
      // 在main.js开头添加cosplaySubpackage初始化
      const initialization = `
// ===== 分包全局变量初始化 =====
var cosplaySubpackage = cosplaySubpackage || {};
if (typeof global !== 'undefined' && !global.cosplaySubpackage) {
  global.cosplaySubpackage = cosplaySubpackage;
}
// ===== 初始化结束 =====

`;
      
      mainContent = initialization + mainContent;
      fs.writeFileSync(dstMain, mainContent, 'utf8');
      console.log('已为main.js添加cosplaySubpackage初始化并复制到主包 common/');
    }
  } catch (e) {
    console.warn('复制 runtime/vendor/main 失败：', e && e.message);
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

// 修复空的routerView组件，注入完整逻辑
function fixEmptyRouterView(pkgRoot) {
  const mainRoot = path.resolve(__dirname, '../main_miniprogram');
  const routerViewJs = path.join(mainRoot, pkgRoot, 'components', 'routerView', 'index.js');
  if (!fs.existsSync(routerViewJs)) return;
  try {
    let code = fs.readFileSync(routerViewJs, 'utf8');
    if (code.trim() === 'Component({});') {
      console.log('发现空的routerView组件，注入完整逻辑');
      const fullComponentLogic = `Component({
  properties: {
    router: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        console.log('[RouterView: router属性变化]', {
          newVal: newVal,
          oldVal: oldVal
        });
      }
    }
  },
  data: {
    opacity: 0,
    currentPath: ''
  },
  methods: {
    updatePath() {
      const router = this.data.router;
      if (router && router.pagePath) {
        // 保持原始路径格式，模板中检查的是带斜杠的路径
        const originalPath = router.pagePath;
        this.setData({
          currentPath: originalPath
        });
        console.log('[RouterView: 更新路径]', {
          originalPath: originalPath,
          currentPath: originalPath
        });
      }
    }
  },
  observers: {
    'router': function(router) {
      console.log('[RouterView: 组件数据变化]', router);
      this.updatePath();
    }
  },
  lifetimes: {
    attached() {
      console.log('[RouterView: 组件attached生命周期]');
      console.log('[RouterView: 初始数据]', {
        router: this.data.router,
        currentPath: this.data.currentPath,
        opacity: this.data.opacity
      });
      this.updatePath();
      setTimeout(() => {
        this.setData({ opacity: 1 });
        console.log('[RouterView: 透明度已设置为1]');
      }, 100);
    }
  }
});`;
      fs.writeFileSync(routerViewJs, fullComponentLogic, 'utf8');
      console.log('已修复空的routerView组件');
    }
  } catch (e) {
    console.warn('修复routerView组件失败：', e && e.message);
  }
}

function syncAll() {
  console.log('同步 UniApp 构建产物到壳分包...', isDevArg ? '(dev 模式)' : '(build 模式)');
  copyDir(source, target);
  fixUsingComponentsPaths('subpackages/cosplay');
  markRouterPagesAsComponents('subpackages/cosplay');
  copyCommonRuntimeVendorToMain('subpackages/cosplay');
  instrumentIndexEntry('subpackages/cosplay');
  fixEmptyRouterView('subpackages/cosplay');  // 修复空的routerView组件
  console.log('完成：', target);
}

if (isWatchArg) {
  syncAll();
  let timer = null;
  try {
    fs.watch(source, { recursive: true }, () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        syncAll();
      }, 200);
    });
    console.log('监听：', source);
  } catch (e) {
    console.warn('监听失败，改为定时同步');
    setInterval(syncAll, 1000);
  }
} else {
  syncAll();
}
