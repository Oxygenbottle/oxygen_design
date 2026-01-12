<template>
  <div class="dd_list" v-if="pop_show">
    <div class="list" :class="[animationShow ? 'upIn' : 'downOut']">
      <div class="list_item" v-for="(item, index) of materialsList" :key="index">
        <img class="material_icon" :src="item.icon" alt="" />
        {{ item.label }}
      </div>
    </div>
    <div
      class="shadow_box"
      :class="[animationShow ? 'fadeIn' : 'fadeOut', shadowShow ? 'shadow_box_on' : '']"
      @tap="close"
    ></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import iconCh from '@/assets/icons/materials/2star-ch.png'
import iconFr from '@/assets/icons/materials/2star-fr.png'
import iconHm from '@/assets/icons/materials/2star-hm.png'
import iconTx from '@/assets/icons/materials/2star-tx.png'
import iconXl from '@/assets/icons/materials/2star-xl.png'
import iconXw from '@/assets/icons/materials/2star-xw.png'
import iconZs from '@/assets/icons/materials/2star-zs.png'

const pop_show = ref(false)
const shadowShow = ref(false)
const animationShow = ref(false)

const materialsList = [
  { label: '存护', icon: iconCh },
  { label: '丰饶', icon: iconFr },
  { label: '毁灭', icon: iconHm },
  { label: '同协', icon: iconTx },
  { label: '巡猎', icon: iconXl },
  { label: '虚无', icon: iconXw },
  { label: '智识', icon: iconZs },
]

const open = () => {
  pop_show.value = true
  animationShow.value = true
  setTimeout(() => {
    shadowShow.value = true
  }, 300)
}

const close = () => {
  shadowShow.value = false
  animationShow.value = false
  setTimeout(() => {
    pop_show.value = false
  }, 290)
}

defineExpose({ open, close })
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
