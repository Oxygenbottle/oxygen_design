<template>
  <view class="tabbar-container" :style="tabbarInfoStyle">
    <view class="tabbar">
      <view
        class="tabbar-item"
        v-for="(item, index) in tabbarList"
        :key="index"
        @click="changeTab(item)"
      >
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script>
import { getTabbarInfo } from '@/api/public';
export default {
  name: 'SafeAreaTabbar',
  data() {
    return {
      safeAreaInsetsBottom: 0,
      tabbarList: [],
      tabbarInfoStyle: ''
    };
  },
  created() {
    this.getTabbarInfo();
    try {
      const navBarInfo = uni.getStorageSync('navBarInfo');
      if (navBarInfo) {
        this.tabbarInfoStyle = `padding-bottom: ${navBarInfo.safeAreaInsets.bottom}rpx`; // console.log('页面容器从缓存获取到的系统信息:', this.navBarInfo);
      } else {
        console.warn('缓存中未找到导航栏信息');
        // 提供默认值以确保页面正常显示
        this.tabbarInfoStyle += 'padding-bottom: calc(30rpx + 20vw);';
      }
    } catch (e) {
      console.error('获取缓存数据失败', e);
      // 发生错误时也提供默认值
      this.tabbarInfoStyle += 'padding-bottom: calc(30rpx + 20vw);';
    }
  },
  computed: {
    // 计算实际安全距离高度
  },
  methods: {
    // 获取menu菜单栏
    getTabbarInfo() {
      getTabbarInfo().then((res) => {
        // console.log('res', res);
        // let list = res.data;
        // this.tabbarList = list.sort((a,b) => b-a) || [];
        // console.log('tabbarList', this.tabbarList);
        this.tabbarList = res.data;
        this.changeTab(this.tabbarList[0]);
      });
    },
    changeTab(item) {
      // console.log('tabbar changeTab', item.path);
      this.$emit('change', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbar-container {
  // min-height: 140rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  // padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
}

/* tabbar主体样式 */
.tabbar {
  height: 20vw;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);

  display: flex;
  // border: 1px solid #000;
  .tabbar-item {
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
  }
}

/* 左右tab组容器 */
.tabbar-group {
  flex: 1;
  height: 100%;
  display: flex;
}

.left {
  justify-content: flex-start;
}

.right {
  justify-content: flex-end;
}
.tabbar-item {
  width: 20vw;
  height: 20vw;
}

/* 中间凸起按钮样式 */
.tabbar-center-btn {
  position: absolute;
  top: -25px; /* 向上凸起25px */
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: $uni-color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 24px;
}
</style>
