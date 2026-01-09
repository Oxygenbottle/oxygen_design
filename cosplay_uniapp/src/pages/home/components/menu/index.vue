<template>
  <view class="top-nav">
    <scroll-view class="menu-scroll" scroll-x="true" scroll-with-animation>
      <view class="menu-icons">
        <view class="icon-item" v-for="(item, index) of data" :key="index">
          <img class="icon" :src="item.img" />
          <text>{{ item.name }}</text>
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
      default: [],
    },
  },
}
</script>

<style scoped lang="scss">
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
      min-width: 120rpx;
      margin-right: 30rpx;
      font-size: $uni-font-size-sm;

      .icon {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: $uni-spacing-col-sm;
      }
    }
  }
}
</style>
