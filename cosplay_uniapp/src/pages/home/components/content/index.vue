<template>
  <div class="content-container">
    <div class="content-tabs">
      <scroll-view
        class="scroll-view"
        scroll-x="true"
        scroll-with-animation
        :scroll-left="scrollLeft"
      >
        <div
          v-for="(tab, index) in classList"
          :key="index"
          class="tab-item"
          :class="{ active: activeIndex === index }"
          @tap="handleClickTab(index)"
        >
          {{ tab.label }}
        </div>
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </scroll-view>
    </div>

    <swiper
      style="height: 100vh"
      class="swiper"
      :indicator-dots="false"
      :autoplay="false"
      :duration="300"
      :current="activeIndex"
      :style="'background:#fff'"
      @animationfinish="(e) => swiperChangeEnd(e)"
    >
      <swiper-item class="swiper-item" v-for="(tab, index) in classList" :key="index">
        <post-item v-for="post in postList" :key="post.id" :post="post"></post-item>
      </swiper-item>
    </swiper>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import postItem from '../postItem/index.vue'

const props = defineProps({
  outerSwiperIndex: {
    type: Number,
    default: 0,
  },
  classList: {
    type: Array,
    default: () => [],
  },
})

const activeIndex = ref(0)
const currentTabWidth = ref(0)
const currentTabLeft = ref(0)
const tabPositions = ref([])
const isScrolling = ref(false)
const systemInfo = ref({})
const scrollLeft = ref(0)
const postList = ref([])
const outerSwiperIndexInner = ref(0)

const instance = getCurrentInstance()
const queryContext = instance?.proxy || instance

onMounted(async () => {
  await getSystemInfo()
  cacheTabPositions()
})

const indicatorStyle = computed(() => {
  const pageWidth = (systemInfo.value.windowWidth || 0) * outerSwiperIndexInner.value
  const left = currentTabLeft.value + currentTabWidth.value / 2 - 24 - pageWidth
  return `left: ${left}px;`
})

const viewportCenter = computed(() => {
  return (systemInfo.value.windowWidth || 0) / 2 || 300
})

watch(
  () => props.outerSwiperIndex,
  (newVal) => {
    console.log('获取外层swiper的索引 ======= >', newVal)
    outerSwiperIndexInner.value = newVal
  },
  { immediate: true },
)

const getSystemInfo = () => {
  try {
    const windowWidth = uni.getStorageSync('windowWidth')
    systemInfo.value = {
      windowWidth,
    }
  } catch (e) {
    console.error('获取系统信息失败', e)
    systemInfo.value = { windowWidth: 375 }
  }
}

const cacheTabPositions = () => {
  const query = queryContext
    ? uni.createSelectorQuery().in(queryContext)
    : uni.createSelectorQuery()
  query.selectAll('.tab-item').boundingClientRect()
  query.exec((res) => {
    if (res && res[0]) {
      tabPositions.value = res[0]
      updateTabIndicator(0)
    } else {
      setTimeout(() => {
        cacheTabPositions()
      }, 100)
    }
  })
}

const updateTabIndicator = (index) => {
  if (tabPositions.value[index]) {
    console.log('index ======= >', index)
    const rect = tabPositions.value[index]
    currentTabWidth.value = rect.width
    currentTabLeft.value = rect.left
  }
}

const handleClickTab = (index) => {
  if (isScrolling.value) return

  activeIndex.value = index
  updateTabIndicator(index)
  scrollToTab(index)
}

const scrollToTab = (index) => {
  if (!tabPositions.value[index]) return

  const rect = tabPositions.value[index]
  const tabCenter = rect.left + rect.width / 2
  const newScrollLeft =
    tabCenter -
    viewportCenter.value -
    (systemInfo.value.windowWidth || 0) * outerSwiperIndexInner.value

  isScrolling.value = true
  scrollLeft.value = newScrollLeft

  setTimeout(() => {
    isScrolling.value = false
  }, 300)
}

const swiperChangeEnd = (e) => {
  activeIndex.value = e.detail.current
  setTimeout(() => {
    scrollToTab(e.detail.current)
    updateTabIndicator(e.detail.current)
  }, 0)
}
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.swiper {
  height: 100%;
}
.swiper-item {
  padding: 0 16rpx;
  box-sizing: border-box;
  overflow-y: scroll;
}

.content-tabs {
  display: flex;
  padding: 0 30rpx;
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  overflow-x: scroll;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 11;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .scroll-view {
    border-radius: 30rpx 30rpx 0 0;
    white-space: nowrap;
    width: 100%;
    position: relative;

    .tab-item {
      width: auto;
      padding: 0 30rpx;
      height: 88rpx;
      line-height: 88rpx;
      display: inline-block;
      text-align: center;
      font-size: 28rpx;
      font-weight: 500;
      background: #fff;
      color: #d4d4d4;
      z-index: 10;
      position: relative;
      box-sizing: border-box;

      &.active {
        color: #000;
      }
    }

    .tab-indicator {
      width: 32rpx;
      height: 4px;
      background: #30c4ff;
      border-radius: 15rpx;
      transition: all 0.3s ease;
      position: absolute;
      top: 80rpx;
      z-index: 10;
    }
  }
}

.content-list {
  height: 100%;
  flex: 1;
  width: 100%;
  padding: 20rpx 30rpx;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.post-item {
  width: 100%;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    image {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-details {
      flex: 1;

      .user-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;

        .official-tag {
          display: inline-block;
          margin-left: 8rpx;
          padding: 0 10rpx;
          height: 24rpx;
          line-height: 24rpx;
          background-color: #71aff7;
          color: #fff;
          font-size: 20rpx;
          border-radius: 12rpx;
        }

        .verified-tag {
          color: #71aff7;
          margin-left: 8rpx;
        }
      }

      .post-time {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }
    }
  }

  .post-content {
    .post-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }

    .post-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 20rpx;
      display: block;
    }

    .post-media {
      width: 100%;
      height: 400rpx;
      position: relative;
      background-color: #f0f0f0;
      border-radius: 16rpx;
      overflow: hidden;

      .video-cover {
        width: 100%;
        height: 100%;
      }

      .video-duration {
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 16rpx;
      }
    }

    .post-stats {
      display: flex;
      margin-top: 16rpx;

      .play-count,
      .comment-count {
        font-size: 24rpx;
        color: #999;
        margin-right: 24rpx;
      }
    }
  }

  .post-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      text:first-child {
        font-size: 40rpx;
        margin-bottom: 6rpx;
      }
    }
  }
}
</style>
