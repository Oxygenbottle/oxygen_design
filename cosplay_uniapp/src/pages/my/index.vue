<template>
  <view class="content">
    <lottieCanvas></lottieCanvas>
  </view>
</template>
<script>
import lottieCanvas from "../../components/lottieCanvas/lottieCanvas.vue";
export default {
  components: { lottieCanvas },
  data() {
    return {
      title: "Hello",
      inited: false,
    };
  },
  onLoad() {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
