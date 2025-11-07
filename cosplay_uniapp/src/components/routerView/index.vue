<template>
  <div class="router-view" :style="{ opacity: opacity }">
    <Navbar v-if="router.type === 'page'">{{ router.name }}</Navbar>
    <Home v-if="currentPath === '/pages/home/index'"></Home>
    <Message v-else-if="currentPath === '/pages/message/index'"></Message>
    <Post v-else-if="currentPath === '/pages/post/index'"></Post>
    <My v-else-if="currentPath === '/pages/my/index'"></My>
    <Dynamic v-else-if="currentPath === '/pages/dynamic/index'"></Dynamic>
  </div>
</template>

<script>
import Navbar from '@/components/navbar/index.vue';
import Home from '@/pages/home/index.vue';
import Message from '@/pages/message/index.vue';
import Post from '@/pages/post/index.vue'
import My from '@/pages/my/index.vue';
import Dynamic from '@/pages/dynamic/index.vue';
import { normalizePagePath } from '@/utils/route.js';

export default {
  name: 'RouterView',
  components: { Navbar, Home, Message, My, Dynamic, Post },
  props: {
    router: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    router: {
      handler(newVal, oldVal) {
        console.log('路由变化 ======== >', newVal, oldVal);
        // 开始淡出
        this.opacity = 0;
        this.currentPath = ''
        // 等待淡出完成后，切换组件并开始淡入
        setTimeout(() => {
          // 容错：newVal 可能为空对象或未定义，避免读取 undefined 的属性
          const nextPath = (newVal && newVal.pagePath) ? normalizePagePath(newVal.pagePath) : '';
          this.currentPath = nextPath;
          this.opacity = 1;
        }, 300); // 这里的时间需要和CSS过渡时间一致
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      tabbarList: [],
      title: '首页',
      routerViewStyle: {},

      opacity: 0, // 添加透明度控制
      currentPath: '',
    };
  },
  async created() {
    // this.routerViewStyle = `height: calc(100vh - ${navBarInfo.statusBarHeight}rpx - ${navBarInfo.navBarHeight}rpx - ${navBarInfo.safeAreaInsets.bottom}rpx - 20vw)`;
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.router-view {
  background-color: #27705732;
  overflow-y: scroll;
  // 隐藏滚动条
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: opacity 0.3s ease; // 添加过渡效果
}
</style>
