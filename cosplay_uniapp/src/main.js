import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

// 全局调试：捕获所有页面的 onLoad 参数与路由对象状态（仅日志，不更改逻辑）
Vue.mixin({
  mounted(options) {
    try {
      const name = (this.$options && (this.$options.name || this.$options.__file)) || 'unknown';
      // 打印调用来源与当前路由对象状态
      console.log('[Debug:mounted]', {
        name,
        options,
        hasRoute: !!this.$route,
        route: this.$route
      });
    } catch (e) {
      console.warn('[Debug:mounted] 记录日志失败:', e && e.message);
    }
  }
})

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
