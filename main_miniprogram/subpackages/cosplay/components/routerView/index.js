Component({
  properties: {
    router: {
      type: Object,
      value: {}
    }
  },
  data: {
    opacity: 0,
    currentPath: ''
  },
  methods: {
    updatePath() {
      const router = this.data.router;
      if (router && router.pagePath) {
        this.setData({
          currentPath: router.pagePath.replace(/^\\//, '')
        });
      }
    }
  },
  observers: {
    'router': function(router) {
      console.log('[RouterView: 组件数据变化]', router);
      this.updatePath();
    }
  },
  lifetimes: {
    attached() {
      console.log('[RouterView: 组件attached生命周期]');
      this.updatePath();
      setTimeout(() => {
        this.setData({ opacity: 1 });
      }, 100);
    }
  }
});