export async function getMiniProgramSystemInfo() {
  // 尝试从缓存读取
  const cachedInfo = uni.getStorageSync('navBarInfo');
  if (cachedInfo) return cachedInfo;

  // 缓存不存在则重新获取
  const systemInfo = uni.getWindowInfo();
  const menuBarInfo = uni.getMenuButtonBoundingClientRect();
  const statusBarHeight = systemInfo.statusBarHeight;
  const navBarHeight = menuBarInfo.height + (menuBarInfo.top - statusBarHeight) * 2;

  // 组装完整信息（包含胶囊按钮信息）
  const navBarInfo = {
    statusBarHeight,
    navBarHeight,
    navBarIconDistance: statusBarHeight + navBarHeight,
    // 胶囊按钮信息
    menuButton: {
      height: menuBarInfo.height,
      width: menuBarInfo.width,
      top: menuBarInfo.top,
      right: menuBarInfo.right,
      bottom: menuBarInfo.bottom,
      left: menuBarInfo.left
    },
    // 安全区域信息
    safeAreaInsets: {
      top: systemInfo.safeAreaInsets.top,
      bottom: systemInfo.safeAreaInsets.bottom,
      left: systemInfo.safeAreaInsets.left,
      right: systemInfo.safeAreaInsets.right
    }
  };
  console.log('systemInfo ======> ',systemInfo)
  // 存入缓存（设置1小时过期时间）
  uni.setStorageSync('navBarInfo', navBarInfo);
  uni.setStorageSync('windowWidth', systemInfo.windowWidth);
  uni.setStorageSync('navBarInfoExpire', Date.now() + 3600000);

  return navBarInfo;
}

// 添加缓存过期检查函数
export function checkNavBarInfoExpire() {
  const expireTime = uni.getStorageSync('navBarInfoExpire');
  if (expireTime && Date.now() > expireTime) {
    uni.removeStorageSync('navBarInfo');
    uni.removeStorageSync('navBarInfoExpire');
    return true;
  }
  return false;
}