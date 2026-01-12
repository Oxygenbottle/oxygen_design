<template>
  <div>
    <Menu :data="data.menu"></Menu>
    <Notice :data="data.recommend"></Notice>
    <Content :outerSwiperIndex="outerSwiperIndex" :classList="data.subClass"></Content>
  </div>
</template>
<script setup>
import Menu from '../menu/index.vue'
import Notice from '../noticeBoard/index.vue'
import Content from '../content/index.vue'

defineProps({
  outerSwiperIndex: {
    type: Number,
    default: 0,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})
</script>
<style scoped lang="scss"></style>
