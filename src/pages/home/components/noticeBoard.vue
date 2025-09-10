<template>
  <div class="news-banner">
    <swiper
      class="news-swiper"
      :vertical="true"
      :autoplay="true"
      :indicator-dots="false"
      :interval="2000"
      :duration="300"
    >
      <swiper-item v-for="item in data" :key="item.id">
        <div class="news-content">
          <text class="news-tag">{{ item.tip }}</text>
          <text class="news-title">{{ item.title }}</text>
        </div>
      </swiper-item>
    </swiper>
    <text class="news-more" @click="handleMore">全部></text>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 处理"全部"按钮点击事件
    handleMore: () => {
      // 这里可以添加跳转到全部资讯页面的逻辑
      console.log('跳转到全部资讯页面');
      // 例如：uni.navigateTo({ url: '/pages/news/list' });
    }
  }
};
</script>

<style scoped lang="scss">
/* 资讯横幅 */
.news-banner {
  background-color: #ffffff4e;
  color: white;
  padding: 8rpx 20rpx;
  border-radius: $uni-border-radius-base;
  margin: $uni-spacing-row-base;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15rpx;
  height: 60rpx; // 固定高度以适应轮播效果
  .news-swiper {
    width: 100%;
    height: 60rpx;
  }
  .news-tag {
    background-color: #1ec3ff;
    color: #fff;
    font-size: $uni-font-size-sm;
    padding: 2px 5px;
    border-radius: $uni-border-radius-sm;
    margin-right: $uni-spacing-row-sm;
    border-radius: 15rpx;
    flex-shrink: 0;
  }

  .news-swiper {
    flex: 1;
    height: 60rpx;
  }

  .news-content {
    height: 60rpx;
    display: flex;
    align-items: center;
  }

  .news-title {
    color: #fff;
    font-size: $uni-font-size-sm;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .news-more {
    color: #fff;
    font-size: $uni-font-size-sm;
    flex-shrink: 0;
    margin-left: $uni-spacing-row-sm;
  }
}
</style>
