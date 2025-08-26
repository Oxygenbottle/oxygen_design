<template>
  <div class="page-container" :style="containerStyle + style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
  props: {
    style: {
      type: String,
      default: ''
    },
    router: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      navBarInfo: null,
      containerStyle: ''
    };
  },
  created() {
    try {
      const navBarInfo = uni.getStorageSync('navBarInfo');
      if (navBarInfo) {
        this.navBarInfo = navBarInfo;
        this.containerStyle += `padding-bottom: calc(${this.navBarInfo.safeAreaInsets.bottom}rpx + 20vw);`;
        // console.log('页面容器从缓存获取到的系统信息:', this.navBarInfo);
      } else {
        console.warn("缓存中未找到导航栏信息");
        // 提供默认值以确保页面正常显示
        this.containerStyle += 'padding-bottom: calc(30rpx + 20vw);';
      }
    } catch (e) {
      console.error("获取缓存数据失败", e);
      // 发生错误时也提供默认值
      this.containerStyle += 'padding-bottom: calc(30rpx + 20vw);';
    }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  // background-color: #fff;
}
</style>
