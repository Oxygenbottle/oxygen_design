<template>
  <view class="top-nav">
    <scroll-view class="menu-scroll" scroll-x="true" scroll-with-animation>
      <view class="menu-icons">
        <view class="icon-item" v-for="(item, index) of data" :key="index">
          <text>{{ item.name }}</text>
          <img :src="item.img" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  }
};
</script>

<style scoped lang="scss">
/* 顶部导航 */
.top-nav {
  color: $uni-text-color-inverse;
  margin-top: 20rpx;
  width: 100%;
  overflow: hidden;

  .menu-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .menu-icons {
    display: flex;
    padding: 0 20rpx;
    box-sizing: border-box;

    .icon-item {
      height: 140rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 120rpx; // 增加最小宽度确保每个图标有足够空间
      margin-right: 30rpx; // 增加间距
      font-size: $uni-font-size-sm;

      img {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: $uni-spacing-col-sm;
      }
    }
  }
}
</style>
