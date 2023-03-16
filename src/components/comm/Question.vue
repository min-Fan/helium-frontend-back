<template>
  <div class="CommQuestion" :class="hock ? 'CommQuestion_hock' : ''">
    <van-dialog v-model="show" :showConfirmButton="false" close-on-click-overlay :before-close="close">
      <div class="question_box">
        <div class="close_box">
          <img v-if="!hock" src="../../assets/v2img/cha_icon.png" alt="" @click="close">
          <img v-else src="../../assets/v2img/cha_icon_hock.png" alt="" @click="close">
        </div>
        <div class="content_title">
          {{title}}
        </div>
        <slot class="content"></slot>
        <div class="footer_btn" @click="close">{{i18n.Components.Confirm}}</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
  name: 'Question',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    getContainer: {
      type: String,
      default: '.body'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  computed: {
    ...mapState(["address", "ethNetWork", "isLink", "hock"]),
    ...web3MapState(["vuex_web3", "vuex_myContract", "vuex_network", "money"]),
    i18n() {
      return this.$t("message");
    },
  },
  methods: {
    close() {
      this.$emit('closeFunName', false)
    }
  },
}
</script>
<style lang="scss" scoped>
.CommQuestion {
  .question_box {
    padding: 40px 50px 70px;
    position: relative;

    .close_box {
      position: absolute;
      top: 30px;
      right: 30px;

      img {
        width: 40px;
      }
    }

    .content_title {
      text-align: center;
      font-size: 36px;
      margin-bottom: 42px;
    }

    .footer_btn {
      width: 322px;
      height: 72px;
      margin: auto;
      margin-top: 50px;
      background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
      text-align: center;
      line-height: 72px;
      color: #fff;
      font-weight: bold;
      border-radius: 16px;
    }
  }
}
.CommQuestion_hock {
  /deep/ .van-dialog {
    background-color: #172320;
  }
}
</style>
