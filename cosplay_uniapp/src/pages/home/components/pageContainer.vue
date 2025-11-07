<template>
  <div>
    <Menu :data="data.menu"></Menu>
    <!-- 资讯横幅 -->
    <Notice :data="data.recommend"></Notice>
    <!-- 内容 -->
    <Content :outerSwiperIndex="outerSwiperIndex" :classList="data.subClass"></Content>
  </div>
</template>
<script>
import Menu from './menu.vue';
import Notice from './noticeBoard.vue';
import Content from "./content.vue"
export default {
  components: { Menu, Notice, Content },
  props: {
    outerSwiperIndex: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: {},
    }
  }
};
</script>
<style scoped lang="scss"></style>
