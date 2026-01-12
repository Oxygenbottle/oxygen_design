<template>
  <view class="content">
    <!-- 画布容器 -->
    <view class="canvas-container">
      <canvas
        canvas-id="pdfCanvas"
        :style="{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
          border: '1px solid #ddd',
          backgroundColor: '#f5f5f5',
        }"
      >
      </canvas>

      <!-- 分页指示器 -->
      <view class="pagination">
        <text>{{ currentPage }} / {{ totalPages }}</text>
        <view class="page-controls">
          <button size="mini" @tap="prevPage" :disabled="currentPage <= 1">上一页</button>
          <button size="mini" @tap="nextPage" v-if="currentPage < totalPages">下一页</button>
          <button
            v-else-if="!isSigned"
            size="mini"
            @tap="openSignatureModal"
            :class="{ 'sign-btn-animation': showAnimation }"
          >
            签署
          </button>
          <button v-else size="mini" @tap="openSignatureModal" class="resign-btn">重新签署</button>
          <button v-if="isSigned" size="mini" @tap="confirmSignature" class="confirm-btn">
            确认
          </button>
        </view>
      </view>
    </view>

    <!-- 签名弹窗 (小程序原生modal) -->
    <view
      class="signature-modal"
      v-if="showSignatureModal"
      :class="{ 'modal-show': showSignatureModal }"
    >
      <view class="modal-mask" @tap="closeSignatureModal"></view>
      <view class="modal-content">
        <signature-component @signatureComplete="handleSignatureComplete" />
      </view>
    </view>

    <!-- 签名展示 -->
    <image
      v-if="signaturePath && currentPage === totalPages"
      :src="signaturePath"
      :style="{
        position: 'absolute',
        left: signatureX + 'px',
        top: signatureY + 'px',
        width: signatureWidth + 'px',
        height: signatureHeight + 'px',
        zIndex: 100,
      }"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import signatureComponent from '@/pages/demo/components/signature.vue'

const imgs = ref([
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong1.jpeg',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong2.jpeg',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong3.jpeg',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong4.jpeg',
])

const currentPage = ref(1)
const totalPages = ref(0)
const ctx = ref(null)
const canvasWidth = ref(300)
const canvasHeight = ref(500)
const imagesPerPage = ref(1)
const loadedImages = ref([])
const showSignatureModal = ref(false)
const isSigned = ref(false)
const signaturePath = ref('')
const signatureX = ref(0)
const signatureY = ref(0)
const signatureWidth = ref(120)
const signatureHeight = ref(60)
const showAnimation = ref(false)

onLoad(() => {
  totalPages.value = Math.ceil(imgs.value.length / imagesPerPage.value)
  console.log('onLoad: 总页数计算为', totalPages.value)
})

onReady(() => {
  console.log('onReady: 开始初始化画布')
  initCanvas()
})

const initCanvas = () => {
  try {
    const sysInfo = uni.getSystemInfoSync()
    const windowWidth = sysInfo.windowWidth
    canvasWidth.value = windowWidth - 40
    canvasHeight.value = canvasWidth.value * 1.415
    console.log('initCanvas: 系统信息', sysInfo)
    console.log('initCanvas: 画布尺寸设置为', canvasWidth.value, '×', canvasHeight.value)
  } catch (e) {
    console.error('获取系统信息失败:', e)
    canvasWidth.value = 300
    canvasHeight.value = 425
    console.log('initCanvas: 使用默认画布尺寸', canvasWidth.value, '×', canvasHeight.value)
  }

  ctx.value = uni.createCanvasContext('pdfCanvas')
  console.log('initCanvas: 成功获取canvas上下文')

  loadImages()
}

const loadImages = () => {
  loadedImages.value = []
  let loadedCount = 0

  console.log('loadImages: 开始加载图片，总数', imgs.value.length)

  if (imgs.value.length === 0) {
    console.log('loadImages: 没有图片需要加载')
    drawCurrentPage()
    return
  }

  imgs.value.forEach((imgUrl, index) => {
    console.log('遍历获取图片地址', imgUrl)
    uni.getImageInfo({
      src: imgUrl,
      success: (res) => {
        console.log('图片加载成功:', res)
        loadedImages.value[index] = res
        loadedCount++

        console.log('loadedCount', loadedCount)
        console.log('imgs.length', imgs.value.length)
        if (loadedCount === imgs.value.length) {
          console.log('所有图片Loaded完毕,开始加载当前渲染第一页')
          drawCurrentPage()
        }
      },
      fail: (err) => {
        console.error(`图片加载失败: ${imgUrl}`, err)
        loadedImages.value[index] = {
          width: 1240,
          height: 1755,
          type: 'jpeg',
          path: '',
        }
        loadedCount++

        if (loadedCount === imgs.value.length) {
          console.log('所有图片处理完毕(包含失败),开始渲染页面')
          drawCurrentPage()
        }
      },
    })
  })
}

const drawCurrentPage = () => {
  if (!ctx.value) {
    console.log('没有canvas 实例 直接打回')
    return
  }

  console.log('drawCurrentPage: 开始绘制页面', currentPage.value)
  console.log('drawCurrentPage: 当前画布尺寸', canvasWidth.value, '×', canvasHeight.value)

  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  ctx.value.setFillStyle('#f5f5f5')
  ctx.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value)

  const imgIndex = currentPage.value - 1
  const imgInfo = loadedImages.value[imgIndex]

  if (imgInfo && imgInfo.path) {
    console.log('drawCurrentPage: 准备绘制图片', imgIndex, '信息:', imgInfo)

    const imgRatio = imgInfo.width / imgInfo.height
    const availableWidth = canvasWidth.value - 40
    const availableHeight = canvasHeight.value - 40

    let drawWidth
    let drawHeight

    if (availableWidth / availableHeight > imgRatio) {
      drawHeight = availableHeight
      drawWidth = drawHeight * imgRatio
    } else {
      drawWidth = availableWidth
      drawHeight = drawWidth / imgRatio
    }

    const drawX = (canvasWidth.value - drawWidth) / 2
    const drawY = (canvasHeight.value - drawHeight) / 2

    console.log('drawCurrentPage: 图片绘制参数', drawX, drawY, drawWidth, drawHeight)
    ctx.value.drawImage(imgInfo.path, drawX, drawY, drawWidth, drawHeight)

    if (currentPage.value === totalPages.value && signaturePath.value) {
      ctx.value.drawImage(
        signaturePath.value,
        signatureX.value,
        signatureY.value,
        signatureWidth.value,
        signatureHeight.value,
      )
    }
  } else {
    console.log('drawCurrentPage: 图片加载失败，绘制占位符')
    ctx.value.setFillStyle('#cccccc')
    ctx.value.fillRect(20, 20, canvasWidth.value - 40, canvasHeight.value - 40)
    ctx.value.setFillStyle('#666666')
    ctx.value.setFontSize(14)
    ctx.value.setTextAlign('center')
    ctx.value.fillText('图片加载失败', canvasWidth.value / 2, canvasHeight.value / 2)
  }

  ctx.value.draw(false)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    drawCurrentPage()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    drawCurrentPage()
  }
}

const openSignatureModal = () => {
  showSignatureModal.value = true
  showAnimation.value = true
  setTimeout(() => {
    showAnimation.value = false
  }, 500)
}

const closeSignatureModal = () => {
  showSignatureModal.value = false
}

const handleSignatureComplete = (nextSignaturePath) => {
  console.log('触发父组件回调 ==== >', nextSignaturePath)
  signaturePath.value = nextSignaturePath
  isSigned.value = true
  showSignatureModal.value = false
  console.log('showSignatureModal', showSignatureModal.value)

  uni.getImageInfo({
    src: nextSignaturePath,
    success: (res) => {
      const signatureRatio = res.width / res.height
      signatureWidth.value = 120
      signatureHeight.value = 120 / signatureRatio

      signatureX.value = (canvasWidth.value - signatureWidth.value) / 2
      signatureY.value = (canvasHeight.value - signatureHeight.value) / 2

      drawCurrentPage()
    },
    fail: (err) => {
      console.error('获取签名图片信息失败:', err)
      signatureX.value = (canvasWidth.value - signatureWidth.value) / 2
      signatureY.value = (canvasHeight.value - signatureHeight.value) / 2
      drawCurrentPage()
    },
  })

  uni.showToast({
    title: '签名已添加',
    icon: 'success',
    duration: 1500,
  })
}

const confirmSignature = () => {
  uni.showModal({
    title: '确认签署',
    content: '确定要确认签署吗？',
    success: (res) => {
      if (res.confirm) {
        openPDF()
      }
    },
  })
}

const openPDF = () => {
  uni.canvasToTempFilePath({
    canvasId: 'pdfCanvas',
    destWidth: canvasWidth.value * 2,
    destHeight: canvasHeight.value * 2,
    success: (res) => {
      console.log('生成的临时图片路径:', res.tempFilePath)
      uni.showToast({
        title: '协议确认成功',
        icon: 'success',
      })
    },
    fail: (err) => {
      console.error('生成图片失败:', err)
      uni.showToast({
        title: '操作失败',
        icon: 'none',
      })
    },
  })
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.canvas-container {
  margin-bottom: 30rpx;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  width: 100%;
  max-width: 300px;
}

.page-controls {
  display: flex;
  gap: 10rpx;
  align-items: center;
}

button {
  margin-top: 20rpx;
  transition: all 0.3s ease;
}

.sign-btn-animation {
  animation: pulse 0.5s ease-in-out;
  background-color: #4caf50 !important;
  color: white !important;
}

.resign-btn {
  background-color: #ff9800 !important;
  color: white !important;
}

.confirm-btn {
  background-color: #2196f3 !important;
  color: white !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 签名弹窗样式 */
.signature-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.signature-modal.modal-show {
  opacity: 1;
  transform: scale(1);
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 40rpx;
  border-radius: 16rpx;
  width: 80vw;
  max-width: 600rpx;
  position: relative;
  z-index: 10000;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  display: block;
  text-align: center;
  color: #333;
}

.modal-buttons {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}
</style>
