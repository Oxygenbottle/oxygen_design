<template>
  <view class="page">
    <view class="panels">
      <view v-if="active === 0" class="panel active">
        <Home />
      </view>
      <view v-else-if="active === 1" class="panel active">
        <Dynamic />
      </view>
      <view v-else-if="active === 2" class="panel active">
        <Message />
      </view>
      <view v-else class="panel active">
        <My />
      </view>
    </view>

    <addList></addList>
    <tabbar :active="active" :items="tabItems" @change="onChangeTab"></tabbar>

    <view v-if="pageLoading" class="page-loading">
      <view class="loading-card">
        <view class="spinner"></view>
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import tabbar from '@/components/tabbar/index.vue'
import addList from '@/components/addList/addList.vue'
import Home from '@/pages/home/index.vue'
import Dynamic from '@/pages/dynamic/index.vue'
import Message from '@/pages/message/index.vue'
import My from '@/pages/my/index.vue'
import { getTabbarInfo } from '@/api/public'
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

const active = ref(0)
const tabItems = ref([
  { key: 'home', text: '首页' },
  { key: 'dynamic', text: '动态' },
  { key: 'message', text: '消息' },
  { key: 'my', text: '我的' },
])
const pageLoading = ref(false)
const loadingText = ref('加载中…')

let loadingTimer = null

const normalizeTabItems = (rawItems) => {
  const fallback = [
    { key: 'home', text: '首页' },
    { key: 'dynamic', text: '动态' },
    { key: 'message', text: '消息' },
    { key: 'my', text: '我的' },
  ]

  if (!Array.isArray(rawItems) || rawItems.length === 0) return fallback

  const getText = (item) => item && (item.text || item.label || item.name)
  const mapByText = new Map()
  rawItems.forEach((item) => {
    const t = getText(item)
    if (t) mapByText.set(String(t), item)
  })

  const pickByFallback = (fb) => {
    const raw = mapByText.get(fb.text) || mapByText.get(fb.key) || mapByText.get(String(fb.text))
    if (!raw) return fb
    return { ...fb, text: getText(raw) || fb.text }
  }

  return fallback.map(pickByFallback)
}

const loadTabbarItems = async () => {
  try {
    const res = await getTabbarInfo()
    const rawItems = res && res.data ? res.data : []
    tabItems.value = normalizeTabItems(rawItems)
  } catch (e) {
    tabItems.value = normalizeTabItems([])
  }
}

const showSwitchLoading = (nextIndex) => {
  const item = tabItems.value[nextIndex]
  const text = item && (item.text || item.label || item.name)
  loadingText.value = text ? `正在切换到「${text}」…` : '加载中…'
  pageLoading.value = true
  if (loadingTimer) clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    pageLoading.value = false
    loadingTimer = null
  }, 260)
}

const onChangeTab = (nextIndex) => {
  const next = Number(nextIndex)
  if (!Number.isFinite(next)) return
  if (next < 0 || next > 3) return
  if (next === active.value) return
  showSwitchLoading(next)
  active.value = next
}

onLoad(() => {
  loadTabbarItems()
})

onUnload(() => {
  if (loadingTimer) clearTimeout(loadingTimer)
  loadingTimer = null
})
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  position: relative;
}

.panels {
  position: relative;
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateY(6rpx);
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.panel.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.loading-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18rpx;
  padding: 28rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 18rpx 42rpx rgba(0, 0, 0, 0.14);
}

.spinner {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(0, 0, 0, 0.12);
  border-top-color: rgba(0, 0, 0, 0.58);
  animation: spin 0.7s linear infinite;
}

.loading-text {
  font-size: 26rpx;
  color: rgba(0, 0, 0, 0.72);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
