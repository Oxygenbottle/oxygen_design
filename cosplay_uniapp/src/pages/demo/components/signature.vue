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

<script>
export default {
  data() {
    return {
      ctx: null,
      width: 300,
      height: 400,
      isDrawing: false,
      hasDrawn: false,
      lastX: 0,
      lastY: 0
    };
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      // 使用推荐 API：获取窗口信息替代 getSystemInfoSync，避免废弃警告
      try {
        const win = uni.getWindowInfo();
        // 画布宽度设为窗口宽度；高度根据业务需要留出下方空间
        this.width = win.windowWidth;
        this.height = win.windowHeight - 100;
      } catch (e) {
        // 兜底：若获取失败，使用默认尺寸，确保功能可用
        console.warn('获取窗口信息失败，使用默认尺寸:', e && e.message);
        this.width = 300;
        this.height = 400;
      }

      this.ctx = uni.createCanvasContext('signatureCanvas', this);
      this.clearCanvas();

      // 初始化绘制样式
      this.ctx.setStrokeStyle('#000000');
      this.ctx.setLineWidth(3);
      this.ctx.setLineCap('round');
      this.ctx.setLineJoin('round');
    },

    clearCanvas() {
      this.isDrawing = false;
      this.hasDrawn = false;

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.setFillStyle('#ffffff');
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.setTextBaseline('top');
      this.ctx.setTextAlign('center');
      this.ctx.setFontSize(20);
      this.ctx.setFillStyle('#616165');
      this.ctx.fillText('请在灰色区域内完成签名', this.width / 2, 30);
      this.ctx.draw(true);
    },

    catchtouchstart(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('开始绘制签名');
      const touch = e.changedTouches[0];
      const x = touch.x;
      const y = touch.y;

      // 清除提示文字（仅在第一次触摸时）
      if (!this.hasDrawn) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.setFillStyle('#ffffff');
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.draw(true);
      }

      this.isDrawing = true;
      this.lastX = x;
      this.lastY = y;

      // 开始新路径
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    },

    catchtouchmove(e) {
      if (this.drawState == 'stop') return;
      this.drawState = 'ing';
      if (e.touches.length > 1) {
        return;
      }
      this.ctx.setStrokeStyle('#000000');
      this.ctx.setLineWidth(3);
      this.ctx.setShadow(0, 0, 0.5, '#000000');
      this.ctx.setLineCap('round');
      this.ctx.setLineJoin('round');
      this.ctx.lineTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      this.ctx.stroke();
      this.ctx.draw(true);
      this.ctx.moveTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    },

    catchtouchend(e) {
      if (!this.isDrawing) return;
      e.stopPropagation();
      e.preventDefault();

      this.isDrawing = false;
      this.hasDrawn = true;

      // 确保最终绘制
      this.ctx.draw(true);
      this.drawState = 'ready';
    },
    // OCR识别
    ocrVK() {
      const session = wx.createVKSession({
        track: {
          OCR: { mode: 2 } // mode: 1 - 使用摄像头；2 - 手动传入图像
        }
      });

      // 静态图片检测模式下，每调一次 runOCR 接口就会触发一次 updateAnchors 事件
      session.on('updateAnchors', (anchors) => {
        console.log(
          'anchors.text',
          ''.concat(anchors.map((anchor) => anchor.text))
        );
      });

      // 需要调用一次 start 以启动
      session.start((errno) => {
        if (errno) {
          // 如果失败，将返回 errno
        } else {
          // 否则，返回null，表示成功
          session.runOCR({
            frameBuffer, // 图片 ArrayBuffer 数据。待检测图像的像素点数据，每四项表示一个像素点的 RGBA
            width, // 图像宽度
            height // 图像高度
          });
        }
      });
    },
    //绘制成图片
    canvasToImg() {
      if (!this.hasDrawn) {
        uni.showToast({
          title: '请先完成签名',
          icon: 'none'
        });
        return;
      }

      this.drawState = 'stop';

      // 添加延时确保canvas绘制完成
      setTimeout(() => {
        try {
          uni.canvasToTempFilePath(
            {
              canvasId: 'signatureCanvas',
              x: 0,
              y: 0,
              width: this.width,
              height: this.height,
              destWidth: this.width * 2,
              destHeight: this.height * 2,
              fileType: 'png',
              quality: 1,
              success: (res) => {
                console.log('确认签名', res.tempFilePath);
                this.$emit('signatureComplete', res.tempFilePath);
              },
              fail: (err) => {
                console.log('canvas转换失败', err);
                uni.showToast({
                  title: '生成签名失败',
                  icon: 'none'
                });
              }
            },
            this
          );
        } catch (err) {
          console.error('生成签名图片失败:', err);
        }
      }, 100);
    }
  }
};
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
