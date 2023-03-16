<template>
  <div id="app">
    <div :class="hock ? 'hock_app_box' : ''" class="app_box" v-if="isRouterAlive">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <comm-popup></comm-popup>
  </div>
</template>

<script>
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
// 导入以太坊合约配置文件
// import { Eth } from '@eth'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import CommPopup from "./components/CommPopup.vue";

//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    provide() {
        return {
            reload: this.reload, // 重载组件
        };
    },
    computed: {
        ...mapState(["address", "ethNetWork", "hock"]),
        ...web3MapState(["vuex_web3", "vuex_myContract", "vuex_network", "money"])
    },
    watch: {

    },
    components() {
        CommPopup;
    },
    data() {
        return {
            isRouterAlive: true
        };
    },
    created() {
        // console.log(this.hock)
    },
    mounted() {
        // document.addEventListener('visibilitychange',()=>{
        //   console.log('监听页面返回----',document);
        //   if (!document.hidden) { // 页面隐藏
        //     this.reload()
        //   }
        // },false)
    },
    // watch: {
    //   hock(newValue, oldValue) {
    //     console.log(newValue)
    //   }
    // },
    methods: {
        // 不白屏 刷新组件
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
    },
    components: { CommPopup }
}
</script>

<style lang="scss">
  .el-scrollbar {
      > .el-scrollbar__bar {
          opacity: 1 !important;
      }
  }
</style>
