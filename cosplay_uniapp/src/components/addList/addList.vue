<template>
  <div class="add-content">
    <div class="text-area" @click="openDialog">
      <span class="title">{{ title }}</span>
    </div>
    <ddList ref="ddList"></ddList>
  </div>
</template>
<script>
import ddList from "../ddList/ddList.vue";
export default {
  components: { ddList },
  data() {
    return {
      title: "+",

    };
  },
  methods: {
    openDialog() {
      this.$refs.ddList.open();
    },
  },
};
</script>

<style>
.add-content {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #e6e5ea;
  color: #6d6c70;
  line-height: 80rpx;
  text-align: center;
  padding-bottom: 4rpx;
  position: fixed;
  bottom: 15vh;
  left: 10vw;
  z-index: 1000;
  /* display: flex;
  align-items: center;
  justify-content: center; */
}
</style>
