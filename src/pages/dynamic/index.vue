<template>
  <view class="content">
    动态
    <button @click="toPDF">跳转并签订协议demo</button>
  </view>
</template>
<script>
export default {
  data() {
    return {
      title: 'Hello',
      inited: false
    };
  },
  onLoad() {},
  methods: {
    toPDF() {
      uni.navigateTo({
        url: '/pages/demo/index'
      });
    },
    onTapJumpMiniProgram: function () {
      wx.openEmbeddedMiniProgram({
        appId: 'wxa023b292fd19d41d', // 电子签appId; 联调时, 请使用demo小程序appId: 'wx371151823f6f3edf'
        path: 'pages/home/home-index', // 跳转的页面路径，可选，默认跳转到目标小程序首页; 签署时，需使用后台API返回的完整链接（类似pages/guide?id=xxx&foo=bar）
        extraData: {
          // 需要传递给目标小程序的数据，可选；签署时，腾讯电子签小程序未使用到该参数
          foo: 'bar'
        },
        envVersion: 'release', // 跳转正式或demo小程序，都需要传 'release'
        success(res) {
          // 成功跳转到目标小程序后的回调函数
        },
        fail(res) {
          // 跳转失败的回调函数
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
