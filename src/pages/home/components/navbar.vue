<template>
  <div class="nav-container" :style="navBarStyle">
    <scroll-view
      class="game-tabs-scroll"
      scroll-x="true"
      scroll-with-animation
      :scroll-left="scrollLeft"
    >
      <div class="game-tabs">
        <div
          v-for="(item, index) in navList"
          :key="item.id"
          class="game-tab"
          :class="{ active: currentIndex === index }"
          @click="handleTabClick(index)"
        >
          {{ item.category }}
        </div>
      </div>
    </scroll-view>
    <img class="game-icon" src="../../../assets/imgs/nav_menu_more.png" />
  </div>
</template>

<script>
export default {
  name: 'SafeAreaTabbar',
  props: {
    navList: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentIndex(newVal) {
      this.pickedTab = newVal;
      // 当currentIndex变化时，滚动到选中的tab
      this.scrollToTab(newVal);
    },
    // 监听navList变化，重新缓存位置信息
    navList: {
      handler() {
        this.resetRetryState();
        this.cacheTabPositions();
      },
      deep: true,
      immediate: false
    }
  },
  data() {
    return {
      navBarStyle: {},
      pickedTab: 0,
      scrollLeft: 0,
      tabPositions: [], // 缓存所有tab的位置信息
      viewportCenter: 0, // 视口中心位置
      systemInfo: {}, // 系统信息
      // 重试机制状态
      retryCount: 0,
      maxRetryCount: 3,
      baseRetryDelay: 500, // 基础重试延迟(ms)
      retryTimeout: null // 重试定时器引用
    };
  },
  created() {
    // 获取系统信息
    this.getSystemInfo();
    let navBarInfo = uni.getStorageSync('navBarInfo');
    if (navBarInfo) {
      this.navBarStyle = `height: ${navBarInfo.navBarHeight}px;`;
      this.navBarStyle += `width: calc(100vw - ${navBarInfo.menuButton.width || 75}px - 40px)`;
    }
  },
  mounted() {
    // 初始化时缓存所有tab位置
    this.cacheTabPositions();
    // 初始时滚动到选中的tab
    this.scrollToTab(this.currentIndex);
  },
  beforeUnmount() {
    // 组件卸载时清理定时器
    this.clearRetryTimeout();
  },
  methods: {
    // 重置重试状态
    resetRetryState() {
      this.clearRetryTimeout();
      this.retryCount = 0;
    },
    
    // 清理重试定时器
    clearRetryTimeout() {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
    },
    
    // 获取系统信息
    getSystemInfo() {
      try {
        const res = uni.getStorageSync('navBarInfo');
        const windowWidth = uni.getStorageSync('windowWidth') || 375;
        this.systemInfo = res || {};
        this.viewportCenter = 
          (windowWidth - (res?.menuButton?.width || 75) - 40) / 2 || 187.5;
      } catch (e) {
        console.error('获取系统信息失败', e);
        // 提供默认值
        this.systemInfo = { windowWidth: 375 };
        this.viewportCenter = 187.5;
      }
    },

    // 缓存所有tab的位置信息
    cacheTabPositions() {
      // 确保navList有数据
      if (!this.navList || this.navList.length === 0) {
        // 如果没有数据，稍后重试
        this.scheduleRetry(this.cacheTabPositions);
        return;
      }
      
      const query = uni.createSelectorQuery().in(this);
      query.selectAll('.game-tab').boundingClientRect();
      query.exec((res) => {
        if (res && res[0] && res[0].length > 0) {
          this.tabPositions = res[0];
          // 成功获取位置后重置重试计数
          this.resetRetryState();
          // 如果之前有等待滚动的请求，现在执行
          if (this.pickedTab !== undefined) {
            this.scrollToTab(this.pickedTab);
          }
        } else {
          // 未获取到位置信息，安排重试
          this.scheduleRetry(this.cacheTabPositions);
        }
      });
    },

    // 滚动到指定tab
    scrollToTab(index) {
      // 更新当前选中的tab
      this.pickedTab = index;
      
      // 检查是否有位置信息
      if (!this.tabPositions || !this.tabPositions[index]) {
        // 如果没有位置信息，先尝试缓存位置，然后再滚动
        if (this.retryCount === 0) {
          this.cacheTabPositions();
        }
        // 安排重试
        this.scheduleRetry(() => this.scrollToTab(index));
        return;
      }

      // 计算滚动位置
      const rect = this.tabPositions[index];
      const tabCenter = rect.left + rect.width / 2;
      const newScrollLeft = Math.max(0, tabCenter - this.viewportCenter);

      // 使用数据绑定方式滚动scroll-view
      this.scrollLeft = newScrollLeft;
    },
    
    // 统一的重试调度方法
    scheduleRetry(callback) {
      // 如果已经达到最大重试次数，则不再重试
      if (this.retryCount >= this.maxRetryCount) {
        console.warn(`已达到最大重试次数(${this.maxRetryCount})，停止重试`);
        this.resetRetryState();
        return;
      }
      
      // 增加重试计数
      this.retryCount++;
      
      // 清除之前的定时器（如果有）
      this.clearRetryTimeout();
      
      // 指数退避算法计算重试延迟时间（500ms, 1000ms, 2000ms...）
      const retryDelay = this.baseRetryDelay * Math.pow(2, this.retryCount - 1);
      console.log(`计划在${retryDelay}ms后重试，当前重试次数：${this.retryCount}`);
      
      // 设置新的定时器
      this.retryTimeout = setTimeout(() => {
        callback.call(this);
      }, retryDelay);
    },

    handleTabClick(index) {
      this.pickedTab = index;
      this.$emit('changeTab', index);
      // 点击时滚动到选中的tab
      this.scrollToTab(index);
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-container {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: #fff;
  .game-tabs-scroll {
    flex: 1;
    height: 100%;
    // 隐藏滚动条
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .game-tabs {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 40rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 100%;
      .game-tab {
        border-radius: $uni-border-radius-base;
        font-size: $uni-font-size-lg;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transform: scale(1); // 默认缩放比例
        transform-origin: center;
        &.active {
          font-weight: 600;
          transform: scale(1.15); // 激活时放大
        }
      }
    }
  }
  .game-icon {
    min-width: 32rpx;
    height: 32rpx;
  }
}
</style>
