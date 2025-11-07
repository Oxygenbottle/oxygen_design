<template>
  <pageContainer :style="'background: #fff;'">
    <routerView :router="router"></routerView>
    <addList></addList>
    <tabbar @change="changeTab"></tabbar>
    <!-- 调试兜底：当 router 还未就绪时，提示页面已进入，便于排查白屏问题 -->
    <view v-if="!router || !router.pagePath" class="debug-tip">📢 分包首页已进入，但路由未就绪（等待 Tabbar 或兜底路由）</view>
  </pageContainer>
</template>
<script>
import tabbar from '@/components/tabbar/index.vue';
import addList from '../../components/addList/addList.vue';
import pageContainer from '../../components/pageContainer/index.vue';
import routerView from '../../components/routerView/index.vue';

export default {
  components: { addList, tabbar, pageContainer, routerView },
  data() {
    return {
      router: {}
    };
  },
  created() {
    // 页面生命周期：created - 已进入分包首页
    console.log('[Cosplay] pages/index/index.vue created');
  },
  mounted() {
    // 页面生命周期：mounted - 打印系统信息，辅助判断环境
    console.log('[Cosplay] mounted');
    try {
      const sys = uni.getSystemInfoSync();
      console.log('[Cosplay] mounted system:', sys);
    } catch (e) {
      console.warn('[Cosplay] mounted getSystemInfoSync failed:', e && e.message);
    }
    // 兜底：若 Tabbar 未能在短时间内触发 changeTab，则设置默认首页路由，避免首屏空白
    setTimeout(() => {
      if (!this.router || !this.router.pagePath) {
        console.warn('[Cosplay] router 未就绪，应用兜底默认路由 /pages/home/index');
        this.router = { type: 'page', name: '首页', pagePath: '/pages/home/index' };
        console.log('[Cosplay] 应用兜底路由:', this.router);
      }else{
        console.log('[Cosplay] this.router || this.router.pagePath:',this.router, this.router.pagePath);
      }
    }, 800);
  },
  methods: {
    changeTab(item) {
      // Tabbar 触发的路由变更事件
      console.log('[Cosplay] changeTab =>', item);
      this.router = item;
    }
  },
  onPullDownRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>

<style>
.debug-tip {
  padding: 24rpx;
  color: #888;
  font-size: 26rpx;
}
</style>
