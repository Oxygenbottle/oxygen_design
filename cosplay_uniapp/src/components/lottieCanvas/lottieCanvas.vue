<template>
  <view class="content">
    <canvas id="canvas" class="canvas_loading" type="2d"></canvas>
    <button @tap="init" style="width: 300px">初始化</button>
    <button @tap="play" style="width: 300px">播放</button>
    <button @tap="pause" style="width: 300px">暂停</button>
  </view>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import lottie from 'lottie-miniprogram'
import catAnimation from '@/assets/lottie/cat.js'
let ani = null

const inited = ref(false)

const init = () => {
  if (inited.value) return

  const instance = getCurrentInstance()
  const queryContext = instance?.proxy || instance
  const query = queryContext
    ? uni.createSelectorQuery().in(queryContext)
    : uni.createSelectorQuery()

  query
    .select('#canvas')
    .node((res) => {
      console.log('canvas实例', res)
      const canvas = res.node
      const context = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 300
      lottie.setup(canvas)

      ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: catAnimation,
        rendererSettings: {
          context,
        },
      })

      inited.value = true
    })
    .exec()
}

const play = () => {
  ani?.play?.()
}

const pause = () => {
  ani?.pause?.()
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
  .canvas_loading{
    z-index: 99;
  }
</style>
