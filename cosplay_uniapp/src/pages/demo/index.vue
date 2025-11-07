<template>
  <view class="content">
    <!-- 画布容器 -->
    <view class="canvas-container">
      <canvas 
        canvas-id="pdfCanvas" 
        :style="{ 
          width: canvasWidth + 'px', 
          height: canvasHeight + 'px',
          border: '1px solid #ddd',
          backgroundColor: '#f5f5f5'
        }">
      </canvas>

      <!-- 分页指示器 -->
      <view class="pagination">
        <text>{{ currentPage }} / {{ totalPages }}</text>
        <view class="page-controls">
          <button size="mini" @click="prevPage" :disabled="currentPage <= 1">
            上一页
          </button>
          <button
            size="mini"
            @click="nextPage"
            v-if="currentPage < totalPages"
          >
            下一页
          </button>
          <button
            v-else-if="!isSigned"
            size="mini" 
            @click="openSignatureModal"
            :class="{ 'sign-btn-animation': showAnimation }">
            签署
          </button>
          <button
            v-else
            size="mini" 
            @click="openSignatureModal"
            class="resign-btn">
            重新签署
          </button>
          <button
            v-if="isSigned"
            size="mini" 
            @click="confirmSignature"
            class="confirm-btn">
            确认
          </button>
        </view>
      </view>
    </view>

    <!-- 签名弹窗 (小程序原生modal) -->
    <view 
      class="signature-modal" 
      v-if="showSignatureModal" 
      :class="{ 'modal-show': showSignatureModal }">
      <view class="modal-mask" @click="closeSignatureModal"></view>
      <view class="modal-content">
        <signature-component @signatureComplete="handleSignatureComplete" />
      </view>
    </view>

    <!-- 签名展示 -->
    <image 
      v-if="signaturePath && currentPage === totalPages" 
      :src="signaturePath" 
      :style="{
        position: 'absolute',
        left: signatureX + 'px',
        top: signatureY + 'px',
        width: signatureWidth + 'px',
        height: signatureHeight + 'px',
        zIndex: 100
      }"
    />
  </view>
</template>

<script>
import signatureComponent from '@/pages/demo/components/signature.vue';

export default {
  components: {
    signatureComponent
  },
  data() {
    return {
      title: 'Hello',
      imgs: [
        'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong1.jpeg',
        'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong2.jpeg',
        'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong3.jpeg',
        'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/temp/monihetong4.jpeg'
      ],
      currentPage: 1, // 当前页码
      totalPages: 0, // 总页数
      ctx: null, // 画布上下文
      canvasWidth: 300, // 画布宽度
      canvasHeight: 500, // 画布高度
      imagesPerPage: 1, // 每页显示的图片数量
      loadedImages: [], // 已加载的图片
      showSignatureModal: false, // 签名弹窗显示状态
      isSigned: false, // 是否已签署
      signaturePath: '', // 签名图片路径
      signatureX: 0, // 签名X坐标
      signatureY: 0, // 签名Y坐标
      signatureWidth: 120, // 签名宽度
      signatureHeight: 60, // 签名高度
      showAnimation: false // 动画效果
    };
  },
  computed: {
    canvasStyle() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`,
        border: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
      };
    }
  },
  onLoad() {
    // 计算总页数
    this.totalPages = Math.ceil(this.imgs.length / this.imagesPerPage);
    console.log('onLoad: 总页数计算为', this.totalPages);
  },
  onReady() {
    // 页面渲染完成后初始化画布
    console.log('onReady: 开始初始化画布');
    this.initCanvas();
  },
  methods: {
    // 初始化画布 - 使用小程序原生API
    initCanvas() {
      // 获取系统信息以适配不同屏幕
      try {
        const sysInfo = uni.getSystemInfoSync();
        const windowWidth = sysInfo.windowWidth;
        // 根据屏幕宽度调整画布大小，保持比例
        this.canvasWidth = windowWidth - 40; // 左右各留20px边距
        this.canvasHeight = this.canvasWidth * 1.415; // 保持1240×1755的比例
        console.log('initCanvas: 系统信息', sysInfo);
        console.log('initCanvas: 画布尺寸设置为', this.canvasWidth, '×', this.canvasHeight);
      } catch (e) {
        console.error('获取系统信息失败:', e);
        // 出错时设置默认值
        this.canvasWidth = 300;
        this.canvasHeight = 425;
        console.log('initCanvas: 使用默认画布尺寸', this.canvasWidth, '×', this.canvasHeight);
      }
      
      // 直接使用小程序原生API获取canvas上下文（移除type="2d"后使用旧版API）
      this.ctx = uni.createCanvasContext('pdfCanvas');
      console.log('initCanvas: 成功获取canvas上下文');
      
      // 加载图片并绘制第一页
      this.loadImages();
    },
    
    // 加载所有图片 - 使用小程序的图片API
    loadImages() {
      this.loadedImages = [];
      let loadedCount = 0;
      const that = this;
      
      console.log('loadImages: 开始加载图片，总数', this.imgs.length);
      
      if (this.imgs.length === 0) {
        console.log('loadImages: 没有图片需要加载');
        this.drawCurrentPage();
        return;
      }

      this.imgs.forEach((imgUrl, index) => {
        console.log('遍历获取图片地址', imgUrl);
        // 使用小程序的getImageInfo来获取图片信息
        uni.getImageInfo({
          src: imgUrl,
          success: (res) => {
            console.log('图片加载成功:', res);
            // 存储图片信息用于绘制
            that.loadedImages[index] = res;
            loadedCount++;

            console.log('loadedCount', loadedCount);
            console.log('this.imgs.length', that.imgs.length);
            // 所有图片加载完成后绘制当前页
            if (loadedCount === that.imgs.length) {
              console.log('所有图片Loaded完毕,开始加载当前渲染第一页');
              that.drawCurrentPage();
            }
          },
          fail: (err) => {
            console.error(`图片加载失败: ${imgUrl}`, err);
            // 提供默认的占位图尺寸以确保页面能正常渲染
            that.loadedImages[index] = {
              width: 1240,
              height: 1755,
              type: 'jpeg',
              path: '' // 留空表示加载失败
            };
            loadedCount++;

            if (loadedCount === that.imgs.length) {
              console.log('所有图片处理完毕(包含失败),开始渲染页面');
              that.drawCurrentPage();
            }
          }
        });
      });
    },
    
    // 绘制当前页 - 修复比例计算逻辑
    drawCurrentPage() {
      if (!this.ctx) {
        console.log('没有canvas 实例 直接打回');
        return;
      }
      
      console.log('drawCurrentPage: 开始绘制页面', this.currentPage);
      console.log('drawCurrentPage: 当前画布尺寸', this.canvasWidth, '×', this.canvasHeight);

      // 清空画布
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 设置背景色为灰色
      this.ctx.setFillStyle('#f5f5f5');
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 计算当前页的图片索引
      const imgIndex = this.currentPage - 1;
      const imgInfo = this.loadedImages[imgIndex];
      
      if (imgInfo && imgInfo.path) {
        console.log('drawCurrentPage: 准备绘制图片', imgIndex, '信息:', imgInfo);
        
        // 计算图片绘制尺寸（保持原比例）
        const imgRatio = imgInfo.width / imgInfo.height; // 图片实际宽高比
        const availableWidth = this.canvasWidth - 40; // 左右边距
        const availableHeight = this.canvasHeight - 40; // 上下边距
        
        let drawWidth, drawHeight;
        
        // 正确的比例判断逻辑
        if (availableWidth / availableHeight > imgRatio) {
          // 可用区域更宽，按高度缩放
          drawHeight = availableHeight;
          drawWidth = drawHeight * imgRatio;
        } else {
          // 可用区域更高，按宽度缩放
          drawWidth = availableWidth;
          drawHeight = drawWidth / imgRatio;
        }
        
        // 居中显示
        const drawX = (this.canvasWidth - drawWidth) / 2;
        const drawY = (this.canvasHeight - drawHeight) / 2;

        console.log('drawCurrentPage: 图片绘制参数', drawX, drawY, drawWidth, drawHeight);
        
        // 绘制图片
        this.ctx.drawImage(imgInfo.path, drawX, drawY, drawWidth, drawHeight);

        // 如果是最后一页且已签名，绘制签名
        if (this.currentPage === this.totalPages && this.signaturePath) {
          this.ctx.drawImage(
            this.signaturePath, 
            this.signatureX, 
            this.signatureY, 
            this.signatureWidth, 
            this.signatureHeight
          );
        }
      } else {
        // 图片加载失败，绘制占位符
        console.log('drawCurrentPage: 图片加载失败，绘制占位符');
        this.ctx.setFillStyle('#cccccc');
        this.ctx.fillRect(20, 20, this.canvasWidth - 40, this.canvasHeight - 40);
        this.ctx.setFillStyle('#666666');
        this.ctx.setFontSize(14);
        this.ctx.setTextAlign('center');
        this.ctx.fillText('图片加载失败', this.canvasWidth / 2, this.canvasHeight / 2);
      }

      // 调用draw方法使绘制生效
      this.ctx.draw(false);
    },

    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.drawCurrentPage();
      }
    },

    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.drawCurrentPage();
      }
    },

    // 打开签名弹窗
    openSignatureModal() {
      this.showSignatureModal = true;
      // 添加动画效果
      this.showAnimation = true;
      setTimeout(() => {
        this.showAnimation = false;
      }, 500);
    },

    // 关闭签名弹窗
    closeSignatureModal() {
      this.showSignatureModal = false;
    },

    // 处理签名完成
    handleSignatureComplete(signaturePath) {
      console.log('触发父组件回调 ==== >', signaturePath)
      this.signaturePath = signaturePath;
      this.isSigned = true;
      this.showSignatureModal = false;
      console.log('this.showSignatureModal', this.showSignatureModal)
      
      // 获取签名图片的实际尺寸以保持比例
      uni.getImageInfo({
        src: signaturePath,
        success: (res) => {
          const signatureRatio = res.width / res.height;
          // 设置合适的显示尺寸，保持原始比例
          this.signatureWidth = 120; // 保持宽度不变
          this.signatureHeight = 120 / signatureRatio; // 根据比例计算高度
          
          // 计算签名在最后一页的居中位置
          this.signatureX = (this.canvasWidth - this.signatureWidth) / 2;
          this.signatureY = (this.canvasHeight - this.signatureHeight) / 2;
          
          // 重新绘制当前页以显示签名
          this.drawCurrentPage();
        },
        fail: (err) => {
          console.error('获取签名图片信息失败:', err);
          // 失败时使用默认尺寸
          this.signatureX = (this.canvasWidth - this.signatureWidth) / 2;
          this.signatureY = (this.canvasHeight - this.signatureHeight) / 2;
          this.drawCurrentPage();
        }
      });
      
      uni.showToast({
        title: '签名已添加',
        icon: 'success',
        duration: 1500
      });
    },

    // 确认签名
    confirmSignature() {
      uni.showModal({
        title: '确认签署',
        content: '确定要确认签署吗？',
        success: (res) => {
          if (res.confirm) {
            this.openPDF();
          }
        }
      });
    },

    // 生成PDF文件
    openPDF() {
      uni.canvasToTempFilePath({
        canvasId: 'pdfCanvas',
        destWidth: this.canvasWidth * 2, // 提高输出质量
        destHeight: this.canvasHeight * 2,
        success: (res) => {
          console.log('生成的临时图片路径:', res.tempFilePath);
          uni.showToast({
            title: '协议确认成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('生成图片失败:', err);
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.canvas-container {
  margin-bottom: 30rpx;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  width: 100%;
  max-width: 300px;
}

.page-controls {
  display: flex;
  gap: 10rpx;
  align-items: center;
}

button {
  margin-top: 20rpx;
  transition: all 0.3s ease;
}

.sign-btn-animation {
  animation: pulse 0.5s ease-in-out;
  background-color: #4CAF50 !important;
  color: white !important;
}

.resign-btn {
  background-color: #FF9800 !important;
  color: white !important;
}

.confirm-btn {
  background-color: #2196F3 !important;
  color: white !important;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 签名弹窗样式 */
.signature-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.signature-modal.modal-show {
  opacity: 1;
  transform: scale(1);
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 40rpx;
  border-radius: 16rpx;
  width: 80vw;
  max-width: 600rpx;
  position: relative;
  z-index: 10000;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  display: block;
  text-align: center;
  color: #333;
}

.modal-buttons {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}
</style>
