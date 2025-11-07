// 小程序全局入口文件
// 说明：这里只做壳的全局生命周期管理和基础配置
App({
  onLaunch() {
    // 启动时的初始化逻辑（如环境检测、版本记录等）
    console.log('OXYGEN 主体壳启动');

    // 兼容方案：预加载 Cosplay 分包的 webpack 运行时与公共模块
    // 说明：UniApp 编译产物依赖 webpack runtime/vendor 才能正常注册页面与组件。
    // 将其在主包全局一次性 require，确保后续进入分包页面时不出现空白渲染。
    try {
      // 运行时（提供 n.O / n.e 等 webpack 运行时方法）
      require('./common/uni_runtime.js');
      // 公共依赖（包含 createPage/createComponent 等 uni-app 运行时工具）
      require('./common/uni_vendor.js');
      console.log('已预加载 cosplay 分包 runtime/vendor');
    } catch (e) {
      console.warn('预加载 cosplay 分包 runtime/vendor 失败:', e && e.message);
    }
  },
  onShow() {
    // 应用展示时的逻辑
  },
  onHide() {
    // 应用隐藏时的处理
  },
  onError(err) {
    // 全局错误捕获：帮助排查分包页面初始化过程中的异常
    console.error('App 全局错误捕获:', err);
  }
});