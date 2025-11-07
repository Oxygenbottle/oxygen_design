<template>
  <div class="navbar" :style="navBarHeight">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      navBarHeight: '',
      title: '首页'
    };
  },
  created() {
    try {
      const navBarInfo = uni.getStorageSync('navBarInfo');
      if (navBarInfo) {
        this.navBarHeight = `height: ${navBarInfo.navBarHeight * 2}rpx`;
        console.log('导航栏从缓存获取到的系统信息:', navBarInfo);
      } else {
        // 缓存不存在时设置默认值
        this.navBarHeight = `height: 88rpx`; // 默认导航栏高度
        console.log('导航栏缓存不存在，使用默认值');
      }
    } catch (e) {
      // 出错时设置默认值
      console.error('获取缓存数据失败', e);
      this.navBarHeight = `height: 88rpx`; // 默认导航栏高度
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #ff8d8d;
  display: flex;
  align-items: center;
  justify-content: center;
  // position: sticky;
}
</style>
