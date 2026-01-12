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
          @tap="handleTabClick(index)"
        >
          {{ item.category }}
        </div>
      </div>
    </scroll-view>
    <img class="game-icon" src="../../../../assets/imgs/nav_menu_more.png" />
  </div>
</template>

<script setup>
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  navList: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['changeTab'])

const navBarStyle = ref('')
const pickedTab = ref(0)
const scrollLeft = ref(0)
const tabPositions = ref([])
const viewportCenter = ref(0)
const systemInfo = ref({})
const retryCount = ref(0)
const maxRetryCount = ref(3)
const baseRetryDelay = ref(500)
const retryTimeout = ref(null)

const instance = getCurrentInstance()
const queryContext = instance?.proxy || instance

watch(
  () => props.currentIndex,
  (newVal) => {
    pickedTab.value = newVal
    scrollToTab(newVal)
  },
)

watch(
  () => props.navList,
  () => {
    resetRetryState()
    cacheTabPositions()
  },
  { deep: true, immediate: false },
)

onMounted(() => {
  getSystemInfo()
  const navBarInfo = uni.getStorageSync('navBarInfo')
  if (navBarInfo) {
    navBarStyle.value = `height: ${navBarInfo.navBarHeight}px; width: calc(100vw - ${(navBarInfo.menuButton && navBarInfo.menuButton.width) || 75}px - 40px);`
  }
  cacheTabPositions()
  scrollToTab(props.currentIndex)
})

onBeforeUnmount(() => {
  clearRetryTimeout()
})

const resetRetryState = () => {
  clearRetryTimeout()
  retryCount.value = 0
}

const clearRetryTimeout = () => {
  if (retryTimeout.value) {
    clearTimeout(retryTimeout.value)
    retryTimeout.value = null
  }
}

const getSystemInfo = () => {
  try {
    const res = uni.getStorageSync('navBarInfo')
    const windowWidth = uni.getStorageSync('windowWidth') || 375
    systemInfo.value = res || {}
    viewportCenter.value =
      (windowWidth - ((res && res.menuButton && res.menuButton.width) || 75) - 40) / 2 || 187.5
  } catch (e) {
    console.error('获取系统信息失败', e)
    systemInfo.value = { windowWidth: 375 }
    viewportCenter.value = 187.5
  }
}

const cacheTabPositions = () => {
  if (!props.navList || props.navList.length === 0) {
    scheduleRetry(cacheTabPositions)
    return
  }

  const query = queryContext
    ? uni.createSelectorQuery().in(queryContext)
    : uni.createSelectorQuery()
  query.selectAll('.game-tab').boundingClientRect()
  query.exec((res) => {
    if (res && res[0] && res[0].length > 0) {
      tabPositions.value = res[0]
      resetRetryState()
      if (pickedTab.value !== undefined) {
        scrollToTab(pickedTab.value)
      }
    } else {
      scheduleRetry(cacheTabPositions)
    }
  })
}

const scrollToTab = (index) => {
  pickedTab.value = index

  if (!tabPositions.value || !tabPositions.value[index]) {
    if (retryCount.value === 0) {
      cacheTabPositions()
    }
    scheduleRetry(() => scrollToTab(index))
    return
  }

  const rect = tabPositions.value[index]
  const tabCenter = rect.left + rect.width / 2
  const newScrollLeft = Math.max(0, tabCenter - viewportCenter.value)
  scrollLeft.value = newScrollLeft
}

const scheduleRetry = (callback) => {
  if (retryCount.value >= maxRetryCount.value) {
    console.warn(`已达到最大重试次数(${maxRetryCount.value})，停止重试`)
    resetRetryState()
    return
  }

  retryCount.value++
  clearRetryTimeout()

  const retryDelay = baseRetryDelay.value * Math.pow(2, retryCount.value - 1)
  console.log(`计划在${retryDelay}ms后重试，当前重试次数：${retryCount.value}`)

  retryTimeout.value = setTimeout(() => {
    callback()
  }, retryDelay)
}

const handleTabClick = (index) => {
  pickedTab.value = index
  emit('changeTab', index)
  scrollToTab(index)
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
