// 首页信息模拟数据
// 从menu.vue提取的图片地址列表
const menuImages = [
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/zhu.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/guanmucong.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/muzhuang.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/yinxing.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/siyecao.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/mogu.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/sakula.png',
  'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/home_menu_icons/juhua.png'
];

// 获取随机图片地址的函数
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * menuImages.length);
  return menuImages[randomIndex];
};

export const homeData = [
  {
    id: '1',
    category: '影棚置景',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/doro_bg.png',
    menu: [
      {
        id: 0,
        key: 'studioList',
        name: '影棚列表',
        page: '/studioList',
        img: getRandomImage()
      },
      {
        id: 1,
        key: 'activity',
        name: '活动情报',
        page: '/',
        img: getRandomImage()
      },
      {
        id: 2,
        key: 'memberCenter',
        name: '会员中心',
        page: '/',
        img: getRandomImage()
      },
      {
        id: 3,
        key: 'tips',
        name: '注意事项',
        page: '/',
        img: getRandomImage()
      }
    ],
    subClass: [
      { id: '151240211', key: 'all', label: '全部' },
      { id: '151240212', key: 'doro', label: '桃乐丝' },
      { id: '151240213', key: 'jinfei', label: '今非昔比' },
      { id: '151240214', key: 'cat', label: '大橘公馆' },
      { id: '151240215', key: 'shellter', label: 'shellter' },
      { id: '151240216', key: 'xuehua', label: '雪华' },
      { id: '151240217', key: 'maoluo', label: '猫罗万象' }
    ],
    recommend: [
      {
        id: 'rec001',
        tip: '咨询',
        title: '夏日限定主题影棚',
        price: 399,
        discount: 0.85,
        image: 'https://example.com/summer_studio.jpg'
      },
      {
        id: 'rec002',
        tip: '官方',
        title: '古风汉服专属影棚',
        price: 499,
        discount: 0.9,
        image: 'https://example.com/hanfu_studio.jpg'
      }
    ]
  },
  {
    id: '2',
    category: '户外外景',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/cat_bg.png',
    menu: [
      {
        key: 'outdoorList',
        name: '外景地点',
        page: '/outdoorList',
        img: getRandomImage()
      },
      { key: 'seasons', name: '季节特辑', page: '/', img: getRandomImage() },
      { key: 'guides', name: '拍摄指南', page: '/', img: getRandomImage() }
    ],
    subClass: [
      { id: '151240221', key: 'all', label: '全部', page: '/' },
      { id: '151240222', key: 'park', label: '公园', page: '/' },
      { id: '151240223', key: 'beach', label: '海滩', page: '/' },
      { id: '151240224', key: 'mountain', label: '山林', page: '/' },
      { id: '151240225', key: 'city', label: '城市', page: '/' }
    ],
    recommend: [
      {
        id: 'out001',
        tip: '推荐',
        title: '城市天际线夜景',
        price: 599,
        rating: 4.8,
        image: 'https://example.com/skyline.jpg'
      },
      {
        id: 'out002',
        tip: '推荐',
        title: '郊外花海全景',
        price: 450,
        rating: 4.6,
        image: 'https://example.com/flower_field.jpg'
      }
    ]
  },
  {
    id: '3',
    category: 'C服&道具&周边',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/feibi_bg.png',
    menu: [
      {
        key: 'cosplayList',
        name: 'C服租赁',
        page: '/cosplayList',
        img: getRandomImage()
      },
      { key: 'props', name: '道具租赁', page: '/', img: getRandomImage() },
      {
        key: 'peripherals',
        name: '动漫周边',
        page: '/',
        img: getRandomImage()
      },
      { key: 'custom', name: '定制服务', page: '/', img: getRandomImage() }
    ],
    subClass: [
      { id: '151240231', key: 'all', label: '全部', page: '/' },
      { id: '151240232', key: 'anime', label: '动漫角色', page: '/' },
      { id: '151240233', key: 'game', label: '游戏角色', page: '/' },
      { id: '151240234', key: 'historical', label: '汉服', page: '/' },
      { id: '151240234', key: 'JK', label: 'JK', page: '/' },
      { id: '151240234', key: 'lolita', label: 'lolita', page: '/' },
      { id: '151240234', key: 'props', label: '道具', page: '/' },
      { id: '151240235', key: 'other', label: '其他', page: '/' }
    ],
    recommend: [
      {
        id: 'cos001',
        tip: '推荐',
        title: '原神-雷电将军C服',
        price: 899,
        stock: 10,
        image: 'https://example.com/raiden_cos.jpg'
      },
      {
        id: 'cos002',
        tip: '联名',
        title: '鬼灭之刃-灶门炭治郎道具套装',
        price: 299,
        stock: 15,
        image: 'https://example.com/tanjiro_props.jpg'
      }
    ]
  },
  {
    id: '4',
    category: '拼好团',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/xuehua_bg.png',
    menu: [
      {
        key: 'activeGroups',
        name: '注意事项',
        page: '/activeGroups',
        img: getRandomImage()
      }
    ],
    subClass: [
      { id: '151240241', key: 'all', label: '全部' },
      { id: '151240242', key: 'studio', label: '拼好棚' },
      { id: '151240243', key: 'cosplay', label: '拼好摄' },
      { id: '151240244', key: 'photographer', label: '拼好团（Cos）' },
      { id: '151240245', key: 'props', label: '拼道具' },
      { id: '151240246', key: 'costume', label: '拼服饰' },
      { id: '151240247', key: 'other', label: '拼其他' }
    ],
    recommend: [
      {
        id: 'group001',
        tip: '优惠',
        title: '三人同行影棚套餐',
        originalPrice: 1499,
        groupPrice: 999,
        participants: 2,
        totalNeeded: 3,
        endTime: '2025-08-30T23:59:59'
      },
      {
        id: 'group002',
        tip: '优惠',
        title: '双人C服租赁优惠',
        originalPrice: 1198,
        groupPrice: 899,
        participants: 1,
        totalNeeded: 2,
        endTime: '2025-08-25T23:59:59'
      }
    ]
  },
  {
    id: '5',
    category: '漫展快闪',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/maoluo_bg.png',
    menu: [
      {
        key: 'upcomingEvents',
        name: '即将开始',
        page: '/upcomingEvents',
        img: getRandomImage()
      },
      { key: 'pastEvents', name: '往期回顾', img: getRandomImage() },
      { key: 'tickets', name: '票务购买', img: getRandomImage() }
    ],
    subClass: [
      { id: '151240251', key: 'all', label: '全部' },
      { id: '151240252', key: 'exhibition', label: '大型展会' },
      { id: '151240253', key: 'flash', label: '快闪活动' },
      { id: '151240254', key: 'workshop', label: '主题工坊' }
    ],
    recommend: [
      {
        id: 'event001',
        tip: '官方',
        title: '2025夏季动漫嘉年华',
        date: '2025-09-15至2025-09-17',
        location: '上海新国际博览中心',
        ticketsAvailable: true
      },
      {
        id: 'event002',
        tip: '官方',
        title: '二次元文化快闪店',
        date: '2025-08-20至2025-08-30',
        location: '北京朝阳大悦城',
        ticketsAvailable: true
      }
    ]
  },
  {
    id: '6',
    category: '扒一扒',
    topBg:
      'https://oxy-1258558723.cos.ap-shanghai.myqcloud.com/oxy_mini/img/feibi_bg.png',
    menu: [
      {
        key: 'latestNews',
        name: '最新资讯',
        page: '/latestNews',
        img: getRandomImage()
      },
      { key: 'guides', name: '攻略教程', img: getRandomImage() },
      { key: 'community', name: '社区讨论', img: getRandomImage() },
      { key: 'creators', name: '创作者中心', img: getRandomImage() }
    ],
    subClass: [
      { id: '151240261', key: 'all', label: '全部' },
      { id: '151240262', key: 'news', label: '行业资讯' },
      { id: '151240263', key: 'tips', label: '拍摄技巧' },
      { id: '151240264', key: 'stories', label: '圈内故事' }
    ],
    recommend: [
      {
        id: 'article001',
        tip: '推荐',
        title: '新手coser必看！10个拍摄技巧让你的照片更专业',
        author: '资深摄影师小王',
        views: 12540,
        comments: 328
      },
      {
        id: 'article002',
        tip: '推荐',
        title: '2025年最值得期待的10部动漫新番',
        author: '动漫评论家小李',
        views: 8762,
        comments: 412
      }
    ]
  }
];

// 模拟API请求延迟
export const getHomeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: homeData,
        message: '获取成功'
      });
    }, 200); // 模拟500ms的网络延迟
  });
};

// 导出默认模块
export default {
  homeData,
  getHomeData
};
