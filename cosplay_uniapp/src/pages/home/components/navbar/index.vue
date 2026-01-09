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
    <img class="game-icon" src="../../../../assets/imgs/nav_menu_more.png" />
  </div>
</template>

<script>
export default {
  name: 'SafeAreaTabbar',
  props: {
    navList: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    currentIndex(newVal) {
      this.pickedTab = newVal
      this.scrollToTab(newVal)
    },
    navList: {
      handler() {
        this.resetRetryState()
        this.cacheTabPositions()
      },
      deep: true,
      immediate: false,
    },
  },
  data() {
    return {
      navBarStyle: {},
      pickedTab: 0,
      scrollLeft: 0,
      tabPositions: [],
      viewportCenter: 0,
      systemInfo: {},
      retryCount: 0,
      maxRetryCount: 3,
      baseRetryDelay: 500,
      retryTimeout: null,
    }
  },
  created() {
    this.getSystemInfo()
    let navBarInfo = uni.getStorageSync('navBarInfo')
    if (navBarInfo) {
      this.navBarStyle = `height: ${navBarInfo.navBarHeight}px;`
      this.navBarStyle += `width: calc(100vw - ${navBarInfo.menuButton.width || 75}px - 40px)`
    }
  },
  mounted() {
    this.cacheTabPositions()
    this.scrollToTab(this.currentIndex)
  },
  beforeUnmount() {
    this.clearRetryTimeout()
  },
  methods: {
    resetRetryState() {
      this.clearRetryTimeout()
      this.retryCount = 0
    },

    clearRetryTimeout() {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout)
        this.retryTimeout = null
      }
    },

    getSystemInfo() {
      try {
        const res = uni.getStorageSync('navBarInfo')
        const windowWidth = uni.getStorageSync('windowWidth') || 375
        this.systemInfo = res || {}
        this.viewportCenter = (windowWidth - (res?.menuButton?.width || 75) - 40) / 2 || 187.5
      } catch (e) {
        console.error('获取系统信息失败', e)
        this.systemInfo = { windowWidth: 375 }
        this.viewportCenter = 187.5
      }
    },

    cacheTabPositions() {
      if (!this.navList || this.navList.length === 0) {
        this.scheduleRetry(this.cacheTabPositions)
        return
      }

      const query = uni.createSelectorQuery().in(this)
      query.selectAll('.game-tab').boundingClientRect()
      query.exec((res) => {
        if (res && res[0] && res[0].length > 0) {
          this.tabPositions = res[0]
          this.resetRetryState()
          if (this.pickedTab !== undefined) {
            this.scrollToTab(this.pickedTab)
          }
        } else {
          this.scheduleRetry(this.cacheTabPositions)
        }
      })
    },

    scrollToTab(index) {
      this.pickedTab = index

      if (!this.tabPositions || !this.tabPositions[index]) {
        if (this.retryCount === 0) {
          this.cacheTabPositions()
        }
        this.scheduleRetry(() => this.scrollToTab(index))
        return
      }

      const rect = this.tabPositions[index]
      const tabCenter = rect.left + rect.width / 2
      const newScrollLeft = Math.max(0, tabCenter - this.viewportCenter)
      this.scrollLeft = newScrollLeft
    },

    scheduleRetry(callback) {
      if (this.retryCount >= this.maxRetryCount) {
        console.warn(`已达到最大重试次数(${this.maxRetryCount})，停止重试`)
        this.resetRetryState()
        return
      }

      this.retryCount++
      this.clearRetryTimeout()

      const retryDelay = this.baseRetryDelay * Math.pow(2, this.retryCount - 1)
      console.log(`计划在${retryDelay}ms后重试，当前重试次数：${this.retryCount}`)

      this.retryTimeout = setTimeout(() => {
        callback.call(this)
      }, retryDelay)
    },

    handleTabClick(index) {
      this.pickedTab = index
      this.$emit('changeTab', index)
      this.scrollToTab(index)
    },
  },
}
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
        transform: scale(1);
        transform-origin: center;
        &.active {
          font-weight: 600;
          transform: scale(1.15);
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
