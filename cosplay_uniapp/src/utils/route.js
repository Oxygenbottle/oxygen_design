// 路由与页面路径工具：在独立开发与集成到主小程序分包两种模式下，生成正确的跳转路径
// - 独立开发（npm run dev:mp-weixin）：返回 '/pages/xxx/index'
// - 集成分包（build 并同步到 main_miniprogram）：返回 '/subpackages/cosplay/pages/xxx/index'

// 规范化页面路径，统一加前导斜杠
export function normalizePagePath(p) {
  if (!p) return '';
  const s = String(p).trim().replace(/^\/+/, '');
  return '/' + s;
}

// 根据环境变量生成最终跳转 URL
export function resolvePageUrl(pagePath) {
  const root = process.env.VUE_APP_SUBPACKAGE_ROOT || '';
  const norm = normalizePagePath(pagePath).replace(/^\//, '');
  return root ? `${root}/${norm}` : `/${norm}`;
}

export const isSubpackageMode = !!(process.env.VUE_APP_SUBPACKAGE_ROOT);