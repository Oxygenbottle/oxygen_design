<template>
  <view class="content">
    <canvas id="canvas" type="2d"></canvas>
    <button @tap="init" style="width: 300px">初始化</button>
    <button @tap="play" style="width: 300px">播放</button>
    <button @tap="pause" style="width: 300px">暂停</button>
  </view>
</template>
<script>
import lottie from "lottie-miniprogram";
let ani = null;
export default {
  components: "",
  data() {
    return {
      title: "Hello",
      inited: false,
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    init() {
      if (this.inited) return;
      let canvasObj = this.createSelectorQuery().select("#canvas");
      console.log("画布实例", canvasObj);
      this.createSelectorQuery()
        .select("#canvas")
        .node((res) => {
          console.log("canvas实例", res);
          const canvas = res.node;
          const context = canvas.getContext("2d");
          canvas.width = 300;
          canvas.height = 300;
          lottie.setup(canvas); // lottie 获取canvas画布？
          console.log(context, "函数内部 context");
          // console.log(that.ani2,'函数内部ani2')
          ani = lottie.loadAnimation({
            loop: true,
            autoplay: true,
            animationData: require("../../assets/lottie/cat.js"),
            // animationData: require('../../assets/lottie/icon_home.js'),
            rendererSettings: {
              context,
            },
          });

          this.inited = true;
        })
        .exec();
    },
    play() {
      ani.play();
    },
    pause() {
      ani.pause();
    },
  },
};
</script>

<style lang="scss" scoped></style>
