<template>
  <div class="navbar" :style="navBarHeight">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const navBarHeight = ref('')

onMounted(() => {
  try {
    const navBarInfo = uni.getStorageSync('navBarInfo')
    if (navBarInfo) {
      navBarHeight.value = `height: ${navBarInfo.navBarHeight * 2}rpx`
      console.log('导航栏从缓存获取到的系统信息:', navBarInfo)
    } else {
      navBarHeight.value = `height: 88rpx`
      console.log('导航栏缓存不存在，使用默认值')
    }
  } catch (e) {
    console.error('获取缓存数据失败', e)
    navBarHeight.value = `height: 88rpx`
  }
})
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
