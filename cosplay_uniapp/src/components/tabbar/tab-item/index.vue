<template>
  <!-- 底部导航 -->
  <tabbar showCenterBtn :currentIndex="currentIndex">
    <template #left-items>
      <view class="tab-item active" @click="changeTab(0)">
        <view class="tab-icon">🏠</view>
        <text>首页</text>
      </view>
      <view class="tab-item" @click="changeTab(1)">
        <view class="tab-icon">📱</view>
        <text>动态</text>
      </view>
    </template>
    <template #center-btn>
      <text>+</text>
    </template>
    <template #right-items>
      <view class="tab-item" @click="changeTab(3)">
        <view class="tab-icon">💬</view>
        <text>消息</text>
        <view class="badge">163</view>
      </view>
      <view class="tab-item" @click="changeTab(4)">
        <view class="tab-icon">👤</view>
        <text>我的</text>
      </view>
    </template>
  </tabbar>
</template>
<script>

export default {
  components: '',
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.tab-item {
  flex: 1;
  text-align: center;
  padding: $uni-spacing-col-sm 0;
  &.active {
    color: $uni-color-primary;
    border-bottom: 2px solid $uni-color-primary;
  }
}
</style>
