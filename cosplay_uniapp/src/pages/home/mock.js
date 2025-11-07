// 模拟帖子数据 - 影棚COS主题
const postData = [
  {
    id: 1,
    type: 'official',
    avatar: '/static/avatars/official.png',
    username: '次元影棚',
    official: true,
    verified: false,
    postTime: '官方消息 07-20',
    title: '「幻想乡」主题影棚全新开放，限时特惠活动进行中',
    content: '全新打造的「幻想乡」主题影棚正式对外开放！包含博丽神社、红魔馆等经典场景，专业灯光设备，提供服装道具租赁服务。即迄8月10日，预约拍摄享8折优惠，转发此条消息还可获得精美COS周边！',
    media: {
      type: 'image',
      src: '/static/images/studio-fantasy.jpg',
    },
    stats: {
      playCount: '浏览量 2.5万',
      commentCount: '评论 328'
    }
  },
  {
    id: 2,
    type: 'user',
    avatar: '/static/avatars/user2.png',
    username: 'COSER小羽',
    official: false,
    verified: true,
    postTime: '07-19',
    content: '昨天在「星之海洋」影棚拍摄的最终幻想14 COS正片～感谢影棚提供的专业设备和布景，灯光效果太棒了！摄影：@光影魔术师 后期：@像素魔法师 服装：@次元衣橱大家觉得这套怎么样？欢迎留言讨论～',
    media: {
      type: 'image',
      src: '/static/images/cos-ff14.jpg',
    },
    actions: {
      commentCount: '128',
      likeCount: '2563'
    }
  },
  {
    id: 3,
    type: 'user',
    avatar: '/static/avatars/user3.png',
    username: '影棚摄影师阿杰',
    official: false,
    verified: false,
    postTime: '07-18',
    content: '分享一组在「未来都市」影棚拍摄的赛博朋克COS作品模特：@霓虹闪烁设备：索尼A7R4 + 24-70mm F2.8灯光：三灯布光，主光45度角高位，辅光侧位补光，背景光勾勒轮廓喜欢赛博朋克风格的朋友欢迎来影棚交流～',
    media: {
      type: 'image',
      src: '/static/images/cyberpunk-cos.jpg',
    },
    actions: {
      commentCount: '89',
      likeCount: '1352'
    }
  },
  {
    id: 4,
    type: 'user',
    avatar: '/static/avatars/user4.png',
    username: '古风爱好者',
    official: false,
    verified: false,
    postTime: '07-17',
    content: '「水墨江南」影棚的新场景太赞了！完全还原了古代江南水乡的韵味，青瓦白墙、小桥流水，连船坞都做得非常精致。在这里拍的古风COS超出预期，感谢影棚团队的用心打造～',
    media: {
      type: 'image',
      src: '/static/images/ancient-cos.jpg',
    },
    actions: {
      commentCount: '67',
      likeCount: '987'
    }
  },
  {
    id: 5,
    type: 'user',
    avatar: '/static/avatars/user5.png',
    username: '次元事务所',
    official: true,
    verified: false,
    postTime: '07-16',
    content: '【招募】本周五晚7点，「超时空要塞」主题影棚将举办COS拍摄活动，现招募3名志愿者参与，提供免费拍摄和精修照片服务。要求：热爱COS，有相关经验优先。有意者请在评论区留言报名～',
    media: {
      type: 'image',
      src: '/static/images/macross-studio.jpg',
    },
    actions: {
      commentCount: '203',
      likeCount: '1842'
    }
  },
  {
    id: 6,
    type: 'user',
    avatar: '/static/avatars/user6.png',
    username: 'COS道具师',
    official: false,
    verified: true,
    postTime: '07-15',
    content: '分享一个小技巧：在影棚拍摄时，利用彩色背景布和色片可以快速营造不同氛围。这组照片使用了蓝色背景布+红色色片，打造出科技感十足的场景，非常适合机甲类COS。影棚地址：XX路XX号创意园B栋501，欢迎交流～',
    media: {
      type: 'image',
      src: '/static/images/mecha-cos.jpg',
    },
    actions: {
      commentCount: '156',
      likeCount: '2135'
    }
  }
];

export default {
  postData
};