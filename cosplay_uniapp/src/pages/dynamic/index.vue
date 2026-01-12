<template>
  <view class="content">
    动态
    <button @tap="toPDF">跳转并签订协议demo</button>
  </view>
</template>
<script setup>
const toPDF = () => {
  uni.navigateTo({
    url: '/pages/demo/index',
  })
}

const onTapJumpMiniProgram = () => {
  wx.openEmbeddedMiniProgram({
    appId: 'wxa023b292fd19d41d',
    path: 'pages/home/home-index',
    extraData: {
      foo: 'bar',
    },
    envVersion: 'release',
    success() {},
    fail() {},
  })
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
