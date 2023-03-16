<template>
  <div class="ShareDetails" :class="hock ? 'ShareDetails_hock' : ''">
    <div class="details_top">
      <van-nav-bar fixed :placeholder="true" :title="i18n.ShareDetails.FeneDetails" left-arrow safe-area-inset-top
        @click-left="back"></van-nav-bar>
    </div>
    <div></div>
    <div class="tab_hold">
      <div class="hold_total">
        <div class="text_record clearfix">
          <span class="fl">{{ i18n.ShareDetails.FenePrice }}（USDT）</span>
          <span class="fr status" v-if="isHash">{{ i18n.ShareDetails.Status }}</span>
        </div>
        <div class="total clearfix">
          <h1 class="fl">{{ Number(total).toFixed(4) | numberToCurrency }}</h1>
          <!-- <h1 class="fr status" :class="itemInfo.reward > itemInfo.usdt_amount ? '' : 'status_no'" v-if="isHash">{{ itemInfo.reward > itemInfo.usdt_amount ? i18n.ShareDetails.StatusDetails : i18n.ShareDetails.StatusDetailsNo }}</h1> -->
          <!-- <div class="team_daishi clearfix" v-if="isTeam">
            <span class="fl">{{ i18n.ShareDetails.Daishifan }}</span>
            <span class="fl">{{ Number(NoRelease).toFixed(4) }} USDT</span>
          </div> -->
        </div>
        <div class="total_get clearfix">
          <div class="total_nums fl clearfix">
            <p>{{ i18n.ShareDetails.FenNums }}（ESG）</p>
            <span class="fl">{{ Number(info.esg_amount).toFixed(4) }}</span>
            <!-- <span class="fl">239.1235</span> -->
          </div>
          <div class="revenue fl">
            <p>{{ i18n.ShareDetails.NoAndYes }}（USDT）</p>
            <div class="revenue_box clearfix">
              <span class="fl">{{ Number(info.norecieved).toFixed(4) }}</span>
              <i></i>
              <span class="fl money">{{ Number(info.reward).toFixed(4) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="record_box">
        <div>
          <div class="hold_popup " @click="showFilter = true">
            <span v-show="activeH == 1">{{ i18n.ShareDetails.NoReceived }}</span>
            <span v-show="activeH == 2">{{ i18n.ShareDetails.Received }}</span>
            <img v-show="!hock" src="../../assets/v2img/xia_icon.png" alt="">
            <img v-show="hock" src="../../assets/v2img/xia_icon_hock.png" alt="">
          </div>
        </div>
        <div class="record_item_box">
          <div class="null_box" v-show="list.length == 0">
            <span>Null</span>
          </div>
          <div class="record_item" v-for="(item, index) in list" :key="index">
            <div class="item_team" v-if="item.type == 'order' && isTeam">
              <div class="node_title" style="margin-bottom: 11px">
                <span class="node_type">Major Share</span>
                <span class="node_date">{{ item.tsY }}</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.ShareDetails.Revenue }}：</span>
                <span class="fr money">+{{ Number(item.reward_amount).toFixed(4) }} USDT</span>
              </div>
            </div>
            <div class="item_share" v-if="item.type == 'order' && !isTeam">
              <div class="node_title" style="margin-bottom: 11px">
                <span class="node_type">Position {{ itemInfo.chain_record_idx + 1 }}</span>
                <span class="node_date">{{ item.tsY }}</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.ShareDetails.Revenue }}：</span>
                <span class="fr money">+{{ Number(item.reward_amount).toFixed(4) }} USDT</span>
              </div>
            </div>
            <div class="item_node" v-if="item.type == 'node' || item.type == 'starchain'">
              <div class="node_title">
                <span class="node_type" v-if="item.type == 'node'">{{ i18n.BPoS.Node }}</span>
                <span class="node_type" v-if="item.type == 'starchain'">{{ i18n.BPoS.StarLink }}</span>
                <span class="node_date">{{ item.ts }}</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.ShareDetails.Revenue }}：</span>
                <span class="fr money">+{{ Number(item.reward_amount).toFixed(4) }} USDT</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.ShareDetails.RevenueRatio }}：</span>
                <div class="detail_box fr">
                  <span>{{ item.percent * 100 }}%</span>
                  <div v-show="item.type == 'node' && item.symbol != ''">
                    <i></i>
                    <span class="type">{{ item.symbol }}</span>
                  </div>
                </div>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.BPoS.WalletAddr }}：</span>
                <div class="detail_box fr">
                  <span>{{ item.showUser }}</span>
                  <img v-show="!hock" src="../../assets/v2img/copy_icon.png" alt="" @click="copyAddr(item.from)">
                  <img v-show="hock" src="../../assets/v2img/copy_icon_hock.png" alt="" @click="copyAddr(item.from)">
                </div>
              </div>
            </div>
            <div class="item_mpney" v-if="item.type == 4">
              <div class="node_title">
                <span class="node_type">{{ i18n.BPoS.Dividend }}</span>
                <span class="node_date">2022-06-28 11:23</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.ShareDetails.Revenue }}：</span>
                <span class="fr money">+121.0000 USDT</span>
              </div>
              <div class="node_detail clearfix">
                <span class="fl">{{ i18n.BPoS.WeightedDividend }}：</span>
                <div class="detail_box fr">
                  <span>1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="get_flxedbtn_box">
      <div class="get_flxedbtn">
        <div class="esg_money">
          <span>{{ i18n.Staking.Earnings }}：</span>
          <span>{{ Number(info.norecieved).toFixed(4) }} USDT</span>
        </div>
        <div class="btn_money" @click="getEarnings">
          {{ i18n.Staking.Get }}
        </div>
      </div>
    </div>

    <filter-date :isShow="showFilter" @closeClick="close" @resetRadio="resetRadio" @confirm="confirm">
      <div class="filter_item">
        <div class="item_title">
          {{ i18n.ExchangeRecord.Direction }}
        </div>
        <div class="radio_box">
          <van-radio-group v-model="radio" direction="horizontal" checked-color="#13C087">
            <van-radio name="1">{{ i18n.ShareDetails.NoReceived }}</van-radio>
            <van-radio name="2">{{ i18n.ShareDetails.Received }}</van-radio>
          </van-radio-group>
        </div>
      </div>
    </filter-date>
  </div>
</template>

<script>
import FilterDate from '@/components/comm/FilterDate';
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
import {
  contractMethods, GetNotReceived, GetNewNotReceived
  , GetHistoryBuyEsg, GetNewHistoryBuyEsg
} from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import BigNumber from 'bignumber.js';
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
  inject: ['reload'],
  name: 'ShareDetails',
  data() {
    return {
      buyId: '',
      total: 0,
      info: {
        esg_amount: 0,
        norecieved: 0,
        price: 0,
        reward: 0,
        usdt_amount: 0
      },
      showFilter: false,
      activeH: 1,
      radio: '1',
      dateData: [],
      list: [],
      isTeam: false,
      priceRatio: '',
      NoRelease: 0, // 团队待释放
      itemInfo: null,
      isHash: false,
    }
  },
  created() {
    // this.list = this.$route.params.data
    // this.total = this.info.holdTotal
    console.log(this.$route.query.parentPage && this.$route.query.parentPage == 'HashRecord')
    this.isHash = this.$route.query.parentPage && this.$route.query.parentPage == 'HashRecord'
    this.buyId = this.$route.params.buyId
    this.NoRelease = this.$route.params.NoRelease
    this.isTeam = this.$route.params.isTeam
    this.priceRatio = this.$route.params.priceRatio
    this.itemInfo = this.$route.params.item
    console.log(this.itemInfo)
    this.getTotalInfo()
    this.getRecord()
    console.log("buyid ==>", this.$route.params.buyId)
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/BPoS' || to.path === '/HashBump') {
      console.log('返回父级页面')
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            var key = this.$vnode.key == null
              ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
              : this.$vnode.key
            var cache = this.$vnode.parent.componentInstance.cache
            var keys = this.$vnode.parent.componentInstance.keys
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key)
                if (index > -1) {
                  keys.splice(index, 1)
                }
              }
              delete cache[key]
            }
          }
        }
      }
      this.$destroy()
    }
    next()
  },
  computed: {
    ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),
    ...web3MapState(['vuex_web3', 'vuex_myContract', 'vuex_network', 'money']),
    i18n() {
      return this.$t('message');
    },
  },
  components: {
    FilterDate
  },
  methods: {
    // 返回
    back() {
      this.$router.back();
    },
    // close
    close(val) {
      this.showFilter = val
    },
    // 重置按钮
    resetRadio() {
      this.radio = '1'
    },
    // 确认返回时间数组
    confirm(dateVal, limit) {
      this.dateData = dateVal
      this.activeH = this.radio
      if (this.radio == 1) {
        this.getRecord('weiling', limit)
      } else {
        this.getRecord('yiling', limit)
      }
    },
    // 复制
    copyAddr(val) {
      _tools.copyValue(val)
      Toast({ message: this.i18n.Main.CopySuccess, icon: 'passed', className: 'successToast' });
    },
    // 获取统计数据
    async getTotalInfo() {
      let params = {
        addr: this.address,
        status: '',
        recordType: '',
        Desc: true
      }
      let res = null
      if (this.$route.query.parentPage && this.$route.query.parentPage == 'HashRecord') {
        res = await GetNewHistoryBuyEsg({ ...params })
      } else {
        res = await GetHistoryBuyEsg({ ...params })
      }
      let data = res.data
      // console.log("仓单数据 1 ==>", data)
      data.map((v, i) => {
        if (v.ID == this.buyId) {
          let obj = {
            chain_record_idx: v.chain_record_idx,
            esg_amount: this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.esg_amount), 'ether'),
            norecieved: this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.norecieved), 'ether'),
            price: v.price,
            reward: this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.reward), 'ether'),
            usdt_amount: this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.usdt_amount), 'ether'),
          }
          this.info = obj
        }
      })
      this.total = this.info.esg_amount * this.priceRatio
      console.log("info ==>", this.info, this.total)
    },
    // 获取该条仓收益领取记录
    async getRecord(status = 'weiling', limit = 0) {
      Toast.loading({
        duration: 30000,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      this.list = []
      let params = {
        addr: this.address,
        buyId: this.buyId,
        status,
        desc: true,
        limit
      }
      try {
        let res = null
        if (this.$route.query.parentPage && this.$route.query.parentPage == 'HashRecord') {
          res = await GetNewNotReceived({ ...params })
        } else {
          res = await GetNotReceived({ ...params })
        }
        let data = res.data
        console.log('仓单数据 ==>', data)
        data.map((v, i) => {
          let obj = {
            buyid: v.buyid,
            from: v.from,
            id: v.id,
            percent: v.percent,
            reward_amount: '',
            status: v.status,
            ts: '',
            tsY: '',
            type: v.type,
            user: v.user,
            showUser: '',
            symbol: v.symbol == 0 ? '' : String.fromCharCode(v.symbol)
          }
          obj.ts = _date.getMDHM(v.ts * 1000)
          obj.tsY = _date.getYMDHMS(v.ts * 1000)
          obj.reward_amount = this.vuex_web3.utils.fromWei(parseInt(BigNumber(v.reward_amount).toNumber()).toString(), 'ether')
          obj.showUser = _accounts.easyAccount(null, 12, 8, v.from)
          this.$nextTick(() => {
            this.list.push(obj)
          })
        })
        Toast.clear()
        console.log("list ==>", this.list)
      } catch (error) {
        Toast.clear()
        console.log('err ==>', error)
      }
      Toast.clear()
    },

    // 领取收益
    async getEarnings() {
      if (this.info.norecieved == 0) {
        Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
        return
      }
      let params = []
      if (!this.isTeam) {
        params = {
          name: 'GetReward', // 方法名
          inputs: [{
            "name": "idx",
            "type": "uint256"
          }],
          arguments: [this.info.chain_record_idx], // 参数
        }
      } else {
        console.log('领取团队仓单')
        // 领取团队收益
        params = {
          name: 'GetTeamReard', // 方法名
          inputs: [],
          arguments: [], // 参数
        }
      }

      // 移仓
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });

      let contractAddr = ''
      let svrId = ''
      if (this.$route.query.parentPage && this.$route.query.parentPage == 'HashRecord') {
        contractAddr = Eth.contract.contrart_NewBuyStaker.addr
        svrId = 5
      } else {
        contractAddr = Eth.contract.contrart_BuyStaker.addr
        svrId = ''
      }

      await contractMethods(this.address, contractAddr, params, true, svrId).then(async res => {
        if (res.code == 101) {
          Toast.clear()
          Toast({ duration: 2000, message: this.i18n.EsgExchange.GetSuc, icon: 'passed', className: 'successToast' });
          setTimeout(() => {
            this.reload()
          }, 1000);
        }
      }).catch(err => {
        console.log('失败 ==>', err.message)
        if (err.code == 110) {
          // 交易拒绝
          Toast({ duration: 2000, message: this.i18n.Toast.networkRejection, icon: 'close', className: 'fail' });
        } else if (err.code == 111 || err.code == 113) {
          // 交易失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
        } else if (err.code == 112) {
          // 交易超时
          Toast({ duration: 2000, message: this.i18n.Toast.TradingTimeOut, icon: 'close', className: 'fail' });
        } else {
          // 失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ShareDetails {
  width: 100%;
  min-height: 100%;
  background-color: #fff;

  .details_top {
    /deep/ .van-nav-bar__title {
      color: #333;
      font-size: 36px;
      font-weight: bold;
    }

    /deep/ .van-nav-bar__left i {
      color: #333;
    }
  }

  .tab_hold {
    margin-top: 36px;
    padding: 0 32px 200px 32px;

    .hold_total {
      padding: 50px 32px;
      background: #FFFFFF;
      box-shadow: 0px 0px 12px 2px #DCF5ED;
      border-radius: 32px;

      // position: sticky;
      // top: 100px;
      .text_record {
        width: 100%;
        margin-bottom: 16px;
        .status {
          width: 128px;
          margin-right: 36px;
        }
        span {
          font-size: 28px;
          color: #999999;
        }
      }

      .total {
        width: 100%;
        padding-bottom: 24px;
        margin-bottom: 24px;
        border-bottom: 2px solid #F5F5F5;
        h1 {
          display: inline-block;
          // width: 100%;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .status {
          margin-right: 36px;
          width: 128px;
          height: 58px;
          background-color: linear-gradient(270deg, #16CB8F 0%, #499BF7 100%);
          border-radius: 10px;
          font-size: 24px;
          color: #fff;
          line-height: 58px;
          text-align: center;
        }
        .status_no {
          background-color: #EAEAEA;
          color: #999999;
        }

        span {
          font-size: 28px;
          color: #999999;
        }

        & span:nth-of-type(2) {
          margin-left: 16px;
        }

        .team_daishi {
          width: 100%;
          display: flex;
          align-items: center;
          line-height: 30px;

          span {
            display: inline-block;
          }
        }
      }

      .total_get {
        width: 100%;

        .total_nums,
        .revenue {
          width: 50%;

          p {
            white-space: nowrap;
            font-size: 24px;
            color: #999999;
            margin-bottom: 10px;
          }

          span {
            width: 100%;
            font-size: 32px;
            display: block;
          }
        }

        & :nth-child(3) {
          margin: 0;
        }

        & :nth-child(4) {
          margin: 0;
        }

        .revenue_box {
          // span {
          //     display: block;
          //     width: 100%;
          // }
          // & :nth-child(2) {
          //     color: #16CB8F;
          // }
          display: flex;
          align-items: center;

          span {
            width: auto;
          }

          i {
            margin: 0 10px;
            height: 28px;
            width: 2px;
            background-color: #CCCCCC;
          }

          & :nth-child(3) {
            color: #16CB8F;
          }
        }
      }
    }

    .record_box {
      margin-top: 40px;

      .hold_popup {
        width: 100%;
        display: flex;
        align-items: center;

        span {
          font-size: 32px;
        }

        img {
          width: 22px;
          margin-left: 5px;
        }
      }

      .record_item_box {
        overflow: hidden;

        .record_item {
          width: 100%;
          padding: 34px 0;
          border-bottom: 1px solid #F5F5F5;

          .node_title {
            display: flex;
            align-items: center;
            margin-bottom: 38px;

            .node_type {
              font-size: 28px;
            }

            .node_date {
              margin-left: auto;
              font-size: 24px;
              color: #999999;
            }
          }

          .node_detail {
            font-size: 28px;
            margin-bottom: 26px;

            & span:nth-of-type(1) {
              color: #999999;
            }

            .money {
              color: #16CB8F;
            }

            .add {
              color: #333333;
            }

            .detail_box {
              display: flex;
              align-items: center;

              span {
                color: #333333;
              }

              i {
                display: inline-block;
                width: 1px;
                height: 26px;
                margin: 0 10px;
                background-color: #CCCCCC;
              }

              img {
                margin-left: 10px;
                height: 26px;
              }
            }
          }

          & .node_detail:last-child {
            margin: 0;
          }
        }

        & .record_item:last-child {
          border: none;
        }
      }
    }
  }

  .get_flxedbtn_box {
    width: 100%;
    height: 92px;
    margin-top: 70px;
    border-radius: 16px;
    position: fixed;
    bottom: 100px;
    left: 0;

    .get_flxedbtn {
      width: 686px;
      height: 100%;
      margin: auto;
      background: #FAFAFA;
      border-radius: 16px;
      border: 2px solid #EDEDED;
      display: flex;
      align-items: center;
      padding: 0 24px;
      box-sizing: border-box;

      .esg_money {
        span {
          float: left;
        }

        & :nth-child(1) {
          font-size: 28px;
          color: #999999;
        }

        & :nth-child(2) {
          font-size: 32px;
        }
      }

      .btn_money {
        margin-left: auto;
        text-align: center;
        line-height: 56px;
        font-size: 28px;
        color: #fff;
        width: 148px;
        height: 56px;
        background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
        border-radius: 12px;
      }
    }
  }
}

.radio_box {
  font-size: 32px;
  margin-top: 38px;

  /deep/ .van-radio {
    width: 50%;
  }
}

.ShareDetails_hock {
  background-color: $back-qs-hock;

  .details_top {
    /deep/ .van-nav-bar {
      background-color: $back-qs-hock;

      .van-nav-bar__title {
        color: $text-qs-hock;
      }

      .van-nav-bar__left i {
        color: $text-qs-hock;
      }
    }

    /deep/ .van-hairline--bottom::after {
      border-bottom-color: $trading-border-hock;
    }
  }

  .tab_hold .hold_total {
    background: $back-hock;
    box-shadow: none;
  }

  .tab_hold .hold_total .total {
    border-bottom-color: $trading-border-hock;
  }

  .tab_hold .record_box .record_item_box .record_item {
    border-bottom-color: $trading-border-hock;
  }

  .tab_hold .record_box .record_item_box .record_item .node_detail .detail_box span {
    color: $text-qs-hock;
  }

  .get_flxedbtn_box .get_flxedbtn {
    background-color: $back-hock;
    border: 2px solid $trading-border-hock;
  }

  .tab_hold .hold_total .total .status_no {
    background-color: #1D2D28;
    color: #fff;
  }

}
</style>
