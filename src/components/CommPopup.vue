<template>
  <div class="CommPopup">
    <van-dialog v-model="show" get-container=".CommPopup" className="app_dialog" :showConfirmButton="false">
      <div class="app_dialog_box">
        <div class="dialog_title">
          Hint
        </div>
        <div class="dialog_content">
          <div class="content_item">
            <p>New Partnership Announcement !</p>

            <p>We are happy to announce our strategic partnership with Cososwap,  the first aggregate transaction DEX that supports lossless Launchpad.</p>

            <p>https://www.coso.finance</p>

            <p>ESG Token will Launchpad on Cososwap!</p>
            <p>COT Token will Airdrop to ESG users!</p>

            <p>We will carry out in-depth cooperation in user traffic, NFT and ecology.</p>

            <p>Stay tuned to win MORE!</p>

            <p>2022-10-03</p>
          </div>
          <div class="contetn_item">
            <p>新合作伙伴公告！</p>
            <p>我们很高兴地宣布与 Cososwap 建立战略合作伙伴关系，Cososwap是第一个支持无损 Launchpad 的聚合交易 DEX。</p>
            <p>https://www.coso.finance</p>
            <p>ESG 代币将在 Cososwap 上公开优惠发售！</p>
            <p>COT Token将空投给ESG Meta的用户！</p>
            <p>我们双方将在用户流量、NFT、生态等方面开展深度合作。</p>
            <p>请继续关注以赢得更多！</p>
            <p>2022-10-03</p>
          </div>
        </div>
        <div class="dialog_footer">
          <div class="dialog_btn" @click="closeDialog">
            I Know
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: 'Commpopup',
  props: {

  },
  data() {
    return {
      show: false
    }
  },
  created() {

  },
  // watch: {
  //   $route(to, from) {
  //       console.log("to from ==>", to, from)
  //       if (to.fullPath == '/Trading') {
  //         this.show = true
  //       } else {
  //         this.show = false
  //       }
  //     }
  // },
  methods: {
    closeDialog() {
      this.show = false
    }
  },
}
</script>
<style lang="scss">
.CommPopup {
  .app_dialog_box {
    // max-height: 700px;
    // overflow-y: scroll;
    color: #333;
    text-align: left;
    padding-bottom: 80px;
    .dialog_title {
      font-size: 45px;
      font-weight: bold;
      text-align: center;
      padding: 30px;
      background-color: #efefef;
      position: sticky;
      top: 0;
    }
    .dialog_content {
      max-height: 500px;
      overflow-y: scroll;
      padding: 80px 40px 0 ;
      line-height: 40px;
      margin-bottom: 30px;
      p {
        margin-bottom: 25px;
      }
    }
    .dialog_footer {
      width: 100%;
      color: #fff;
      text-align: center;
      .dialog_btn {
        font-size: 38px;
        font-weight: bold;
        line-height: 80px;
        margin: auto;
        width: 590px;
        height: 80px;
        background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
        border-radius: 16px;
      }
    }
  }
}
.app_dialog {
  z-index: 9999 !important;
}
</style>
