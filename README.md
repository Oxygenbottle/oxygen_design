# oxygen_design

架构说明：

- 主体壳：`main_miniprogram`（原生微信小程序），负责导航、TabBar、分包管理与基础兼容。
- 业务功能：`cosplay_uniapp`（UniApp 项目），负责具体组件与页面的实现，构建为微信小程序分包产物。

分包约定：

- UniApp 以 `mp-weixin` 为目标平台构建，默认产物在 `dist/build/mp-weixin`。
- 同步脚本会将构建产物拷贝到壳的 `subpackages/cosplay` 下，纳入分包。

TabBar 规划：OXY（互动展示）、创意工坊（接入 Cosplay 分包）、可乐（宠物相册）、COCO（统计与个人信息）。