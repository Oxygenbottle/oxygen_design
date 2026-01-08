<template>
  <view class="tabbar-container">
    <view class="tabbar">
      <view
        v-for="(item, index) in items"
        :key="item.key || item.pagePath || item.path || index"
        class="tabbar-item"
        :class="{ active: index === active }"
        @tap="onTap(index)"
      >
        <text class="tabbar-text">{{ item.text || item.label || item.name || '' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SafeAreaTabbar',
  props: {
    active: {
      type: Number,
      default: 0,
    },
    items: {
      type: Array,
      default: () => [
        { key: 'home', text: '首页' },
        { key: 'dynamic', text: '动态' },
        { key: 'message', text: '消息' },
        { key: 'my', text: '我的' },
      ],
    },
  },
  emits: ['change'],
  methods: {
    onTap(index) {
      this.$emit('change', index)
    },
  },
}
</script>

<style lang="scss" scoped>
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.tabbar {
  height: 100rpx;
  display: flex;
}

.tabbar-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.55);
  font-size: 24rpx;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.tabbar-text {
  line-height: 1;
}

.tabbar-item.active {
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  transform: translateY(-2rpx);
}
</style>
