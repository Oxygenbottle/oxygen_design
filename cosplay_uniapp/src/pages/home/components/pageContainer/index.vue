<template>
  <div>
    <Menu :data="data.menu"></Menu>
    <Notice :data="data.recommend"></Notice>
    <Content :outerSwiperIndex="outerSwiperIndex" :classList="data.subClass"></Content>
  </div>
</template>
<script>
import Menu from '../menu/index.vue'
import Notice from '../noticeBoard/index.vue'
import Content from '../content/index.vue'
export default {
  components: { Menu, Notice, Content },
  props: {
    outerSwiperIndex: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: {},
    },
  },
}
</script>
<style scoped lang="scss"></style>

