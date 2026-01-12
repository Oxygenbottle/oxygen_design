<template>
  <view class="content">
    <canvas
      canvas-id="signatureCanvas"
      :style="{ width: width + 'px', height: height + 'px' }"
      @touchstart="catchtouchstart"
      @touchmove="catchtouchmove"
      @touchend="catchtouchend"
      @touchcancel="catchtouchend"
    ></canvas>
    <div style="display: flex; justify-content: space-between">
      <view class="btn-reset" @tap="clearCanvas">重新绘制</view>
      <view class="btn-ok" @tap="canvasToImg">确认</view>
    </div>
  </view>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'

const emit = defineEmits(['signatureComplete'])

const ctx = ref(null)
const width = ref(300)
const height = ref(400)
const isDrawing = ref(false)
const hasDrawn = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const drawState = ref('ready')

const instance = getCurrentInstance()
const ctxScope = instance?.proxy || instance

onMounted(() => {
  initCanvas()
})

const initCanvas = () => {
  const sysInfo = uni.getSystemInfoSync()
  width.value = sysInfo.windowWidth
  height.value = sysInfo.windowHeight - 100

  ctx.value = uni.createCanvasContext('signatureCanvas', ctxScope)
  clearCanvas()

  ctx.value.setStrokeStyle('#000000')
  ctx.value.setLineWidth(3)
  ctx.value.setLineCap('round')
  ctx.value.setLineJoin('round')
}

const clearCanvas = () => {
  if (!ctx.value) return

  isDrawing.value = false
  hasDrawn.value = false

  ctx.value.clearRect(0, 0, width.value, height.value)
  ctx.value.setFillStyle('#ffffff')
  ctx.value.fillRect(0, 0, width.value, height.value)

  ctx.value.setTextBaseline('top')
  ctx.value.setTextAlign('center')
  ctx.value.setFontSize(20)
  ctx.value.setFillStyle('#616165')
  ctx.value.fillText('请在灰色区域内完成签名', width.value / 2, 30)
  ctx.value.draw(true)
}

const catchtouchstart = (e) => {
  if (!ctx.value) return

  e.stopPropagation()
  e.preventDefault()
  console.log('开始绘制签名')

  const touch = e.changedTouches[0]
  const x = touch.x
  const y = touch.y

  if (!hasDrawn.value) {
    ctx.value.clearRect(0, 0, width.value, height.value)
    ctx.value.setFillStyle('#ffffff')
    ctx.value.fillRect(0, 0, width.value, height.value)
    ctx.value.draw(true)
  }

  isDrawing.value = true
  lastX.value = x
  lastY.value = y

  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

const catchtouchmove = (e) => {
  if (!ctx.value) return
  if (drawState.value === 'stop') return

  drawState.value = 'ing'
  if (e.touches.length > 1) return

  ctx.value.setStrokeStyle('#000000')
  ctx.value.setLineWidth(3)
  ctx.value.setShadow(0, 0, 0.5, '#000000')
  ctx.value.setLineCap('round')
  ctx.value.setLineJoin('round')
  ctx.value.lineTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  ctx.value.stroke()
  ctx.value.draw(true)
  ctx.value.moveTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
}

const catchtouchend = (e) => {
  if (!ctx.value) return
  if (!isDrawing.value) return

  e.stopPropagation()
  e.preventDefault()

  isDrawing.value = false
  hasDrawn.value = true

  ctx.value.draw(true)
  drawState.value = 'ready'
}

const ocrVK = () => {
  const session = wx.createVKSession({
    track: {
      OCR: { mode: 2 },
    },
  })

  session.on('updateAnchors', (anchors) => {
    console.log('anchors.text', ''.concat(anchors.map((anchor) => anchor.text)))
  })

  session.start((errno) => {
    if (errno) return
    session.runOCR({
      frameBuffer,
      width,
      height,
    })
  })
}

const canvasToImg = () => {
  if (!hasDrawn.value) {
    uni.showToast({
      title: '请先完成签名',
      icon: 'none',
    })
    return
  }

  drawState.value = 'stop'

  setTimeout(() => {
    try {
      uni.canvasToTempFilePath(
        {
          canvasId: 'signatureCanvas',
          x: 0,
          y: 0,
          width: width.value,
          height: height.value,
          destWidth: width.value * 2,
          destHeight: height.value * 2,
          fileType: 'png',
          quality: 1,
          success: (res) => {
            console.log('确认签名', res.tempFilePath)
            emit('signatureComplete', res.tempFilePath)
          },
          fail: (err) => {
            console.log('canvas转换失败', err)
            uni.showToast({
              title: '生成签名失败',
              icon: 'none',
            })
          },
        },
        ctxScope,
      )
    } catch (err) {
      console.error('生成签名图片失败:', err)
    }
  }, 100)
}
</script>

<style lang="scss" scoped>
.content {
  position: fixed; // 固定定位
  top: 0;
  left: 0;
  background-color: #f2f2f2;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

canvas {
  width: 100%;
  height: 70vh;
  background-color: #ffffff;
  border: 1px solid #ddd;
  touch-action: none; // 阻止默认触摸行为
  user-select: none; // 禁止选择
}

.btn-reset {
  width: 200rpx;
  margin: 20rpx;
  padding: 16rpx;
  text-align: center;
  border: 1rpx solid #4965b3;
  color: #4965b3;
  font-size: 28rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.btn-ok {
  width: 200rpx;
  margin: 20rpx;
  padding: 16rpx;
  text-align: center;
  background-color: #4965b3;
  border: 1rpx solid #4965b3;
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
}
</style>
