<template>
  <div class="dd_list" v-if="pop_show">
    <div class="list" :class="[animationShow ? 'upIn' : 'downOut']">
      <div class="list_item" v-for="(item, index) of materialsList" :key="index">
        <img class="material_icon" :src="item.icon" alt="" />
        {{ item.label }}
      </div>
    </div>
    <div class="shadow_box" :class="[
    animationShow ? 'fadeIn' : 'fadeOut',
    shadowShow ? 'shadow_box_on' : ''
  ]" @click="close"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pop_show: false,
      shadowShow: false,
      animationShow: false,

      materialsList: [
        {
          label: '存护',
          icon: require('@/assets/icons/materials/2star-ch.png')
        },
        {
          label: '丰饶',
          icon: require('@/assets/icons/materials/2star-fr.png')
        },
        {
          label: '毁灭',
          icon: require('@/assets/icons/materials/2star-hm.png')
        },
        {
          label: '同协',
          icon: require('@/assets/icons/materials/2star-tx.png')
        },
        {
          label: '巡猎',
          icon: require('@/assets/icons/materials/2star-xl.png')
        },
        {
          label: '虚无',
          icon: require('@/assets/icons/materials/2star-xw.png')
        },
        {
          label: '智识',
          icon: require('@/assets/icons/materials/2star-zs.png')
        }
      ]
    };
  },
  methods: {
    open() {
      this.pop_show = true;
      this.animationShow = true;
      setTimeout(() => {
        this.shadowShow = true;
      }, 300);
    },
    close() {
      this.shadowShow = false;
      this.animationShow = false;
      setTimeout(() => {
        this.pop_show = false;
      }, 290);
    }
  }
};
</script>

<style lang="scss" scoped>
.dd_list {
  width: 100vw;
  height: 100vh;
  // background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;

  .list {
    display: flex;
    flex-direction: column;
    // padding-top: 50vh;
    z-index: 10;
    position: absolute;
    bottom: 0;

    .list_item {
      // width: 100vw;
      height: 12vw;
      display: flex;
      align-items: center;
      padding: 0 0 0 10vw;

      .material_icon {
        width: 10vw;
        height: 10vw;
        margin-right: 10vw;
      }
    }
  }

  .shadow_box {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    /* background-color: #0000002b */
  }
}

.shadow_box_on {
  background-color: #ffffff5a;
  backdrop-filter: saturate(150%) contrast(50%) blur(8px);
}

.fadeIn {
  animation: fadeIn 0.3s;
}

.fadeOut {
  animation: fadeOut 0.3s;
}

.upIn {
  animation: upIn 0.3s;
}

.downOut {
  animation: downOut 0.3s;
}

@keyframes upIn {
  from {
    transform: scale(0);
    opacity: 0.1;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes downOut {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0);
    opacity: 0.1;
  }
}

@keyframes fadeIn {
  from {
    background-color: #00000000;
    clip-path: circle(0% at 10% 70%);
  }

  to {
    background-color: #ffffff5a;
    clip-path: circle(100% at 10% 70%);
    backdrop-filter: saturate(150%) contrast(50%) blur(8px);
  }
}

@keyframes fadeOut {
  from {
    background-color: #ffffff5a;
    backdrop-filter: saturate(150%) contrast(50%) blur(8px);
  }

  to {
    background-color: #00000000;
  }
}
</style>