<script setup>
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { getMiniProgramSystemInfo } from '@/utils/getSystemInfo.js'

onLaunch(async () => {
  await getMiniProgramSystemInfo()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style></style>
