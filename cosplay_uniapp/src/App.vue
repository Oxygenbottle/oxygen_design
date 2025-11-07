<script>
import { getMiniProgramSystemInfo } from '@/utils/getSystemInfo.js';
export default {
  onLaunch: async function () {
    // console.log('App Launch',import.meta.env.VUE_APP_VERSION);
    await getMiniProgramSystemInfo();
  },
  onShow: async function () {
    // console.log('App Show');
  },
  methods: {},

  onHide: function () {
    console.log('App Hide');
  }
};
</script>

<style></style>
