<template>
  <pageContainer :style="'background: #fff;'">
    <routerView :router="router"></routerView>
    <addList></addList>
    <tabbar @change="changeTab"></tabbar>
  </pageContainer>
</template>
<script>
import tabbar from '@/components/tabbar/index.vue';
import addList from '../../components/addList/addList.vue';
import pageContainer from '../../components/pageContainer/index.vue';
import routerView from '../../components/routerView/index.vue';

export default {
  components: { addList, tabbar, pageContainer, routerView },
  data() {
    return {
      router: {}
    };
  },
  created() {},
  onLoad() {},
  methods: {
    changeTab(item) {
      this.router = item;
    }
  },
  onPullDownRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>

<style></style>
