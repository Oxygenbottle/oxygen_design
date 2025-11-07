<template>
  <div class="content-container">
    <!-- 内容选项卡 -->
    <div class="content-tabs">
      <scroll-view
        class="scroll-view"
        scroll-x="true"
        scroll-with-animation
        :scroll-left="scrollLeft"
      >
        <div
          v-for="(tab, index) in classList"
          :key="index"
          class="tab-item"
          :class="{ active: activeIndex === index }"
          @click="handleClickTab(index)"
        >
          {{ tab.label }}
        </div>
        <!-- 移动的小蓝条 -->
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </scroll-view>
    </div>

    <swiper
      style="height: 100vh"
      class="swiper"
      :indicator-dots="false"
      :autoplay="false"
      :duration="300"
      :current="activeIndex"
      :style="'background:#fff'"
      @animationfinish="(e) => swiperChangeEnd(e)"
    >
      <swiper-item
        class="swiper-item"
        v-for="(tab, index) in classList"
        :key="index"
      >
        <post-item
          v-for="post in postList"
          :key="post.id"
          :post="post"
        ></post-item>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
// 导入模拟数据和组件
import mockData from '../mock.js';
import postItem from './postItem.vue';

export default {
  components: {
    postItem
  },
  props: {
    outerSwiperIndex: {
      type: Number,
      default: 0
    },
    classList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      tabs: [
        { name: 'COS' },
        { name: '古风' },
        { name: '谷子' },
        { name: '棚子' },
        { name: '出图' },
        { name: '咖啡馆' },
        { name: '分享' },
        { name: '讨论' }
      ],
      activeIndex: 0,
      currentTabWidth: 0,
      currentTabLeft: 0,
      tabPositions: [], // 缓存所有tab的位置信息
      isScrolling: false, // 标记是否正在滚动
      systemInfo: {}, // 系统信息
      scrollLeft: 0, // 用于控制scroll-view的滚动位置
      postList: mockData.postData, // 使用模拟数据
      _outerSwiperIndex: 0
    };
  },
  async mounted() {
    // 获取系统信息
    await this.getSystemInfo();
    // 初始化时缓存所有tab位置
    this.cacheTabPositions();
  },
  computed: {
    indicatorStyle() {
      const _pageWidth = this.systemInfo.windowWidth * this._outerSwiperIndex;
      const left =
        this.currentTabLeft + this.currentTabWidth / 2 - 24 - _pageWidth;
      return `left: ${left}px;`;
    },
    // 视口中心位置
    viewportCenter() {
      return this.systemInfo.windowWidth / 2 || 300;
    }
  },
  watch: {
    outerSwiperIndex: {
      handler(newVal, oldVal) {
        console.log('获取外层swiper的索引 ======= >', newVal);
        // this.updateTabIndicator(0);
        this._outerSwiperIndex = newVal;
      },
      immediate: true
    }
  },
  methods: {
    // 获取系统信息
    getSystemInfo() {
      try {
        const windowWidth = uni.getStorageSync('windowWidth');
        // 保留原有字段结构，确保兼容性
        this.systemInfo = {
          windowWidth
        };
      } catch (e) {
        console.error('获取系统信息失败', e);
        // 提供默认值
        this.systemInfo = { windowWidth: 375 };
      }
    },

    // 缓存所有tab的位置信息
    cacheTabPositions() {
      const query = uni.createSelectorQuery().in(this);
      console.log('获取所有tab-item的位置信息 ======= >', query);
      query.selectAll('.tab-item').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          this.tabPositions = res[0];
          this.updateTabIndicator(0);
        } else {
          // 重试机制
          setTimeout(() => {
            this.cacheTabPositions();
          }, 100);
        }
      });
    },

    // 更新指示器位置
    updateTabIndicator(index) {
      if (this.tabPositions[index]) {
        console.log('index ======= >', index);
        const rect = this.tabPositions[index];
        this.currentTabWidth = rect.width;
        this.currentTabLeft = rect.left;
      }
    },

    // 处理tab点击
    handleClickTab(index) {
      if (this.isScrolling) return;

      this.activeIndex = index;
      this.updateTabIndicator(index);

      // 滚动到选中的tab（如果需要）
      this.scrollToTab(index);
    },

    // 滚动到指定tab
    scrollToTab(index) {
      if (!this.tabPositions[index]) return;

      const rect = this.tabPositions[index];
      const tabCenter = rect.left + rect.width / 2;
      const newScrollLeft =
        tabCenter -
        this.viewportCenter -
        this.systemInfo.windowWidth * this._outerSwiperIndex;

      // 使用数据绑定方式滚动scroll-view
      this.isScrolling = true;
      this.scrollLeft = newScrollLeft;

      // 滚动动画结束后重置标记
      setTimeout(() => {
        this.isScrolling = false;
      }, 300);
    },

    // swiper滚动结束
    swiperChangeEnd(e) {
      this.activeIndex = e.detail.current;
      // 重新缓存tab位置信息
      // this.cacheTabPositions();
      // 延迟更新指示器，确保位置信息已更新
      setTimeout(() => {
        this.scrollToTab(e.detail.current);
        this.updateTabIndicator(e.detail.current);
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
/* 内容容器 */
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.swiper {
  height: 100%;
}
.swiper-item {
  padding: 0 16rpx;
  box-sizing: border-box;
  // height: 100%;
  overflow-y: scroll;
}

/* 内容选项卡 */
.content-tabs {
  display: flex;
  padding: 0 30rpx;
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  overflow-x: scroll;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 11;
  // 隐藏滚动条
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .scroll-view {
    border-radius: 30rpx 30rpx 0 0;
    white-space: nowrap;
    width: 100%;
    position: relative;

    .tab-item {
      width: auto;
      padding: 0 30rpx;
      height: 88rpx;
      line-height: 88rpx;
      display: inline-block;
      text-align: center;
      font-size: 28rpx;
      font-weight: 500;
      background: #fff;
      color: #d4d4d4;
      z-index: 10;
      position: relative;
      box-sizing: border-box;

      &.active {
        color: #000;
      }
    }

    .tab-indicator {
      width: 32rpx;
      height: 4px;
      background: #30c4ff;
      border-radius: 15rpx;
      transition: all 0.3s ease;
      position: absolute;
      top: 80rpx;
      z-index: 10;
    }
  }
}

/* 内容列表 */
.content-list {
  height: 100%;
  flex: 1;
  width: 100%;
  padding: 20rpx 30rpx;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

/* 帖子样式 */
.post-item {
  width: 100%;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    image {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-details {
      flex: 1;

      .user-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;

        .official-tag {
          display: inline-block;
          margin-left: 8rpx;
          padding: 0 10rpx;
          height: 24rpx;
          line-height: 24rpx;
          background-color: #71aff7;
          color: #fff;
          font-size: 20rpx;
          border-radius: 12rpx;
        }

        .verified-tag {
          color: #71aff7;
          margin-left: 8rpx;
        }
      }

      .post-time {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }
    }
  }

  .post-content {
    .post-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }

    .post-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 20rpx;
      display: block;
    }

    .post-media {
      width: 100%;
      height: 400rpx;
      position: relative;
      background-color: #f0f0f0;
      border-radius: 16rpx;
      overflow: hidden;

      .video-cover {
        width: 100%;
        height: 100%;
      }

      .video-duration {
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 16rpx;
      }
    }

    .post-stats {
      display: flex;
      margin-top: 16rpx;

      .play-count,
      .comment-count {
        font-size: 24rpx;
        color: #999;
        margin-right: 24rpx;
      }
    }
  }

  .post-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      text:first-child {
        font-size: 40rpx;
        margin-bottom: 6rpx;
      }
    }
  }
}
</style>
