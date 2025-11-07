<template>
  <div class="main">
    <navbar
      class="navbar"
      :style="{ top: `${topPadding}rpx` }"
      :navList="dataList"
      :currentIndex="currentIndex"
      @changeTab="changeTab"
    ></navbar>
    <swiper
      class="swiper"
      style="height: 100vh"
      :indicator-dots="false"
      :autoplay="false"
      :interval="false"
      :duration="300"
      :current="currentIndex"
      @animationfinish="(e) => swiperChangeEnd(e)"
    >
      <swiper-item v-for="(item, index) in dataList" :key="index">
        <div
          :style="{ height: `calc(${topPadding}rpx + ${navBarHeight}rpx)` }"
        ></div>
        <img class="bg" :style="imgStyle" :src="item.topBg" />
        <pageContainer :outerSwiperIndex="index" :data="item"></pageContainer>
      </swiper-item>
    </swiper>
    <!-- 加载提示 -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <text>加载中...</text>
      </view>
    </view>
  </div>
</template>

<script>
import { navbar } from './components/navbar.vue';
import { pageContainer } from './components/pageContainer.vue';
import { getHomeData } from '../../../mock/homeData.js';
import { getHomeInfo } from '@/api/public.js';

export default {
  components: { navbar, pageContainer },
  data() {
    return {
      dataList: [],
      currentIndex: 0,
      topPadding: 0,
      navBarHeight: 0,
      imgStyle: '',
      loading: false
    };
  },
  created() {
    try {
      const navBarInfo = uni.getStorageSync('navBarInfo');
      if (navBarInfo) {
        this.topPadding = navBarInfo.statusBarHeight + navBarInfo.navBarHeight;
        this.navBarHeight = navBarInfo.navBarHeight;
        this.imgStyle = `margin-top: -${this.topPadding}rpx`;
      } else {
        console.warn('缓存中未找到导航栏信息');
      }
      // 加载模拟数据
      this.loadHomeData();
    } catch (e) {
      console.error('获取缓存数据失败', e);
    }
  },
  methods: {
    swiperChangeEnd(e) {
      // console.log('swiperChangeEnd ====== >', e);
      this.currentIndex = e.detail.current;
    },
    changeTab(index) {
      this.currentIndex = index;
    },
    async loadHomeData() {
      this.loading = true;
      try {
        // 调用模拟数据API
        const response = await getHomeInfo();
        if (response.success) {
          this.dataList = response.data;
          console.log('成功加载首页模拟数据:', this.dataList);
          // 这里可以根据需要处理模拟数据，比如更新导航栏列表等
        } else {
          console.error('加载模拟数据失败:', response.message);
        }
      } catch (error) {
        console.error('请求模拟数据时发生错误:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  // background-color: $uni-bg-color;
  position: relative;
  z-index: 1;
  // 隐藏滚动条
  -ms-overflow-style: none;
  scrollbar-width: none;
  .navbar {
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 10000;
  }
  .swiper {
    // border: 1px solid rebeccapurple;
  }
  .bg {
    width: 100vw;
    height: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    filter: brightness(50%) blur(1px);
    z-index: -1;
  }
}

// 加载遮罩样式
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background-color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
}
</style>
