// 创意工坊页面：根据构建生成的列表渲染卡片
// 读取构建脚本输出的 JS 模块（避免直接 require .json 造成运行时报错）
let workshopList = { items: [] };
try {
  workshopList = require('../../assets/workshop-list.js');
} catch (e) {
  console.warn('未能加载 workshop-list.js，使用空列表');
}

Page({
  data: {
    items: [], // 卡片列表数据
  },
  onLoad() {
    // 初始化加载列表
    this.setData({ items: (workshopList && workshopList.items) || [] });
  },
  onShow() {
    // 返回页面时也可刷新一次（防止热更新不同步）
    this.setData({ items: (workshopList && workshopList.items) || [] });
  },
  openRoute(e) {
    // 打开卡片对应的路由（分包或主包页面）
    const url = e.currentTarget.dataset.url;
    console.log('点击打开路由:', url);
    if (!url) return;
    // 兼容分包路由：优先使用完整路径，失败则回退去掉分包根前缀
    wx.navigateTo({
      url,
      fail(err) {
        console.warn('navigateTo 使用原路由失败，尝试兼容路径', err);
        // 将 /subpackages/<pkg>/pages/xxx/yyy 兼容为 /pages/xxx/yyy
        const compat = url.replace(/^\/subpackages\/[^/]+/, '');
        if (compat !== url) {
          wx.navigateTo({
            url: compat,
            fail(e2) {
              console.error('navigateTo 兼容路径仍失败:', compat, e2);
            }
          });
        }
      }
    });
  }
});