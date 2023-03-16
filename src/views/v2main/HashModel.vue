<template>
  <div class="HashModel" :class="hock ? 'HashModel_hock' : ''">
    <div class="top">
      <div class="top_box f-a-c f-j-sb">
        <van-tabs v-model="active" :ellipsis="false" :before-change="beforeTabsChange">
          <van-tab :title="i18n.HashBump.MyBuy" name="1"></van-tab>
          <van-tab :title="i18n.HashBump.MyHold" name="2"></van-tab>
          <van-tab :title="i18n.HashBump.MyTeam" name="3"></van-tab>
          <van-tab :title="i18n.HashBump.MyNode" name="4"></van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="HashModel_tabs">
      <div class="my_buy" v-if="active == '1'">
        <div class="buy_item claerfix" v-for="(item, index) in buyList" :key="index">
          <div class="item_box fl">
            <span>{{ i18n.HashBump.Time }}</span>
            <p>{{ item.txPA }}</p>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.BuyIn }}</span>
            <p>{{ item.usdt_amount == 0 ? 0 : Number(item.usdt_amount).toFixed(4) }} USDT</p>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.Hax }}</span>
            <div class="copy_box">
              <a :href="item.hashUrl" target="_blank">{{ item.show_tx }}</a>
              <!-- <img src="../../assets/v2img/copy_icon_min.png" alt=""> -->
            </div>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.BuyHeight }}</span>
            <div class="copy_box">
              <a :href="item.blockUrl" target="_blank">{{ item.height }}</a>
              <!-- <img src="../../assets/v2img/copy_icon_min.png" alt=""> -->
            </div>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.BlockHeight }}</span>
            <div class="copy_box">
              <a :href="item.bumpUrl" target="_blank">{{ Number(item.height) + 1 }}</a>
              <!-- <img src="../../assets/v2img/copy_icon_min.png" alt=""> -->
            </div>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.Mantissa }}</span>
            <p>{{ item.hash_number == -1 ? i18n.HashBump.NoCandy : item.hash_number }}</p>
          </div>
          <div class="item_box fl">
            <span>{{ i18n.HashBump.Candy }}</span>
            <p>{{ item.candy == 0 ? 0 : Number(item.candy).toFixed(4) }} USDT</p>
          </div>
          <div class="item_box fl">
            <div class="qustion_box">
              <span>{{ i18n.HashBump.Operate }}</span>
              <img src="../../assets/v2img/Question.png" alt="" @click="isQuestionOperate = true">
            </div>
            <div class="btn_box">
              <span class="claim" v-if="item.isReward != 0" @click="getReward(item)">{{ i18n.HashBump.Claim }}</span>
              <span class="claim_no" v-if="item.isReward == 0 && !item.isGet">-</span>
              <span v-if="item.isReward == 0 && item.isGet" class="claim no_get">{{ i18n.HashBump.Claimed }}</span>
              <!-- <span v-if="item.status == 4" class="no_get">{{i18n.HashBump.NoCandy}}</span> -->
            </div>
          </div>
        </div>
      </div>
      <div class="my_hold" v-if="active == '2' || active == '3'">
        <div class="tab_hold">
          <div class="hold_total">
            <div class="text_record clearfix">
              <span class="fl" v-show="active == 2">{{ i18n.BPoS.HoldTotal }}（USDT）</span>
              <span class="fl" v-show="active == 3">{{ i18n.HashBump.TeamTotalMoney }}（USDT）</span>
              <img v-show="active == 2 && !hock" class="fr" src="../../assets/v2img/get_record.png" alt=""
                @click="goGetRecord">
              <img v-show="active == 2 && hock" class="fr" src="../../assets/v2img/get_record_hock.png" alt=""
                @click="goGetRecord">
            </div>
            <div class="total">
              <h1 v-show="active == 2">{{ Number(totalHold).toFixed(4) | numberToCurrency }}</h1>
              <h1 v-show="active == 3">{{ Number(totalNode).toFixed(4) | numberToCurrency }}</h1>
            </div>
            <div class="total_get clearfix">
              <div class="total_nums fl clearfix">
                <p v-show="active == 2">{{ i18n.BPoS.TotalPosition }}(ESG)</p>
                <p v-show="active == 3">{{ i18n.HashBump.TeamTotalPosition }}(ESG)</p>
                <span v-show="active == 2" class="fl">{{ allDataObj.personal_totalesg == 0 ? 0 :
                    Number(allDataObj.personal_totalesg).toFixed(4) | numberToCurrency
                }}</span>
                <span v-show="active == 3" class="fl">{{ allDataObj.node_totalesg == 0 ? 0 :
                    Number(allDataObj.node_totalesg).toFixed(4) | numberToCurrency
                }}</span>
              </div>
              <div class="revenue fl">
                <p v-show="active == 2">{{ i18n.BPoS.NoAndYesTotal }}(USDT)</p>
                <p v-show="active == 3">{{ i18n.HashBump.TeamTotalRevenue }}(USDT)</p>
                <div class="revenue_box" v-show="active == 2">
                  <span class="money">
                    {{ allDataObj.personal_norev == 0 ? 0 :Number(allDataObj.personal_norev).toFixed(2) |numberToCurrency}}
                  </span><i></i>
                  <span class="money">
                    {{ allDataObj.personal_alreadyRev == 0 ? 0 : Number(allDataObj.personal_alreadyRev).toFixed(2) | numberToCurrency}}
                  </span>
                </div>
                <div class="revenue_box" v-show="active == 3">
                  <span :class="active == 2 ? 'money' : ''">{{ allDataObj.node_alreadyrev == 0 ? 0 :
                      Number(allDataObj.node_alreadyrev).toFixed(4) | numberToCurrency
                  }}</span>
                </div>
              </div>
              <div class="total_nums fl" v-show="active == 3">
                <p>{{ i18n.BPoS.Node }} </p>
                <span class="fl">{{ allDataObj.node_amountofa }}</span>
              </div>
              <div class="total_nums fl" v-show="active == 3">
                <p>{{ i18n.BPoS.Node }} / ALL</p>
                <span class="fl">{{ allDataObj.node_amountofall }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="record_box" v-show="active == 2">
          <div class="hold_popup" @click="showFilter = true">
            <span v-show="activeH == 1">{{ i18n.BPoS.AllHolds }}</span>
            <span v-show="activeH == 2">{{ i18n.BPoS.NowHolds }}</span>
            <span v-show="activeH == 3">{{ i18n.BPoS.Moved }}</span>
            <img v-show="!hock" src="../../assets/v2img/xia_icon.png" alt="">
            <img v-show="hock" src="../../assets/v2img/xia_icon_hock.png" alt="">
          </div>
          <div class="null_box" v-show="recordList.length == 0">
            <span>Null</span>
          </div>
          <div class="record_item" v-for="(item, index) in recordList" :key="index" @click="toShareDetails(item)">
            <div class="record_date clearfix">
              <img class="fl" src="../../assets/v2img/esg_icon.png" alt="">
              <span class="fl" v-if="item.is_team == 1">ESG/Major Position</span>
              <span class="fl" v-else>ESG/Position {{ item.chain_record_idx + 1 }}</span>
              <i></i>
              <span>{{ item.ts }}</span>
              <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
              <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
            </div>
            <div class="record_nums">
              <div class="esg_num clearfix">
                <p>{{ i18n.BPoS.Transactions }}(ESG)</p>
                <span class="fl">{{ item.esg_amount == 0 ? 0 : Number(item.esg_amount).toFixed(4) }}</span>
              </div>
              <div class="usdt_num">
                <p>{{ i18n.BPoS.Turnover }}(USDT)</p>
                <span class="fl">{{ item.usdt_amount == 0 ? 0 : Number(item.usdt_amount).toFixed(4) }}</span>
              </div>
              <div class="earning" v-if="item.type != 'sell' && item.status != 'yimaichu'">
                <p>{{ i18n.BPoS.NoAndYes }}(USDT)</p>
                <div class="earning_one clearfix">
                  <!-- <span class="fr">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)}}</span> -->
                  <span class="fl">{{ item.norecieved == 0 ? 0 : Number(item.norecieved).toFixed(4) |
                      numberToCurrency
                  }}</span><i class="fl"></i><span class="money fl">{{ item.reward == 0 ? 0 :
    Number(item.reward).toFixed(4) | numberToCurrency
}}</span>
                </div>
              </div>
              <div class="earning" v-else>
                <p>{{ i18n.BPoS.NoAndYes }}(USDT)</p>
                <div class="earning_one clearfix">
                  <!-- <span style="color: #333" class="fr">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)}}</span> -->
                  <span class="fl">{{ item.norecieved == 0 ? 0 : Number(item.norecieved).toFixed(4) |
                      numberToCurrency
                  }}</span><i class="fl"></i><span class="money fl">{{ item.reward == 0 ? 0 :
    Number(item.reward).toFixed(4) | numberToCurrency
}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="record_box" v-show="active == 3">
          <div class="node_all">
            <span>{{ i18n.BPoS.Revenue }}</span>
            <div class="all_btn clearfix" @click="toAllRecord(1)">
              <span class="fl">{{ i18n.BPoS.All }}</span>
              <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
              <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
            </div>
          </div>
          <div class="null_box" v-show="showNodes.length == 0">
            <span>Null</span>
          </div>
          <div class="node_item" v-for="(item, index) in showNodes" :key="index">
            <div class="node_title">
              <span class="node_type" v-if="item.type == 'starchain'">{{ i18n.BPoS.StarLink }}</span>
              <span class="node_type" v-else>{{ i18n.BPoS.Node }}</span>
              <span class="node_date">{{ item.ts }}</span>
            </div>
            <div class="node_detail clearfix">
              <span class="fl">{{ i18n.BPoS.Earnings }}：</span>
              <span class="fr money">+{{ Number(item.reward_amount).toFixed(4) }} USDT</span>
            </div>
            <div class="node_detail clearfix">
              <span class="fl">{{ i18n.BPoS.Revenue }}：</span>
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
        </div>
      </div>
      <div class="my_node" v-if="active == '4'">
        <div class="node_get">
          <div class="get_fl">
            <div class="get_text">
              <span>{{i18n.Staking.Earnings}}</span>
              <span>（USDT）</span>
            </div>
            <div class="get_nums">
              {{teamReaward == 0 ? 0 : Number(teamReaward).toFixed(2)}}
            </div>
          </div>
          <div class="get_fr">
            <div class="get_btn" @click="nodeGet">{{i18n.HashBump.Claim}}</div>
          </div>
        </div>
        <div class="record_box" v-show="active == '4'">
          <div class="node_all">
            <span>{{ i18n.BPoS.Revenue }}</span>
            <div class="all_btn clearfix" @click="toAllRecord(4)">
              <span class="fl">{{ i18n.BPoS.All }}</span>
              <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
              <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
            </div>
          </div>
          <div class="null_box" v-show="showNodeDatas.length == 0">
            <span>Null</span>
          </div>
          <div class="node_item" v-for="(item, index) in showNodeDatas" :key="index">
            <div class="node_detail clearfix">
              <span class="fl addr">{{ i18n.BPoS.WalletAddr }}：</span>
              <div class="detail_box fr addr">
                <span>{{ item.showUser }}</span>
                <img v-show="!hock" src="../../assets/v2img/copy_icon.png" alt="" @click="copyAddr(item.from)">
                <img v-show="hock" src="../../assets/v2img/copy_icon_hock.png" alt="" @click="copyAddr(item.from)">
              </div>
            </div>
            <div class="node_detail clearfix">
              <span class="fl money">{{ i18n.Trading.Buy }}</span>
              <span class="fr">{{ item.ts }}</span>
            </div>
            <div class="node_detail clearfix">
              <span class="fl">{{ i18n.HashBump.FlowingWater }}：</span>
              <span class="fr">+{{ item.amount == 0 ? 0 : Number(item.amount).toFixed(4) }} USDT</span>
            </div>
            <div class="node_detail clearfix">
              <span class="fl">{{ i18n.BPoS.Earnings }}：</span>
              <span class="fr money">+{{ item.earnings == 0 ? 0 : Number(item.earnings).toFixed(4) }} USDT </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="showFilter" position="bottom" safe-area-inset-bottom>
      <div class="hold_filter clearfix">
        <span :class="activeH == 1 ? 'active_hold' : ''" @click="chooseHoldFilter(1)">{{ i18n.BPoS.AllHolds }}</span>
        <span :class="activeH == 2 ? 'active_hold' : ''" @click="chooseHoldFilter(2)">{{ i18n.BPoS.NowHolds }}</span>
        <span :class="activeH == 3 ? 'active_hold' : ''" @click="chooseHoldFilter(3)">{{ i18n.BPoS.Moved }}</span>
      </div>
    </van-popup>
    <Question :show="isQuestionOperate" @closeFunName="closeOperate" :title="i18n.HashBump.QuestionOperate">
      <div class="content">
        <p>{{ i18n.HashBump.QuestionOperateText }}</p>
      </div>
    </Question>
  </div>
</template>
<script>
import Question from '@/components/comm/Question.vue';
import { BigNumber } from 'bignumber.js'
import { _float } from '@/assets/js/float'
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { Toast } from 'vant';
import { contractMethods, GetNewBposUserInfos, GetNewHistoryBuyEsg, GetEsgPrice, GetNewReceivedLiquidity, GetNewWhitelistRecord } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import { Eth } from '../../ethereum/eth';
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
  name: "HashModel",
  inject: ["reloadMain", 'reload'],
  data() {
    return {
      active: '1',
      buyList: [],
      totalHold: 0,
      totalNode: 0,
      totalDividend: 0,
      totalStar: 0,
      showFilter: false,
      activeH: 2, // 当前选项
      recordList: [],
      nodeList: [],
      showNodes: [], // 展示的流水
      nodeDatas: [],
      showNodeDatas: [], // 展示的流水
      dividendList: [],
      starList: [],
      showStars: [], // 展示的星链
      allDataObj: {
        node_alreadyrev: 0,
        node_amountofa: 0,
        node_amountofall: 0,
        node_totalesg: 0,
        personal_alreadyRev: 0,
        personal_norelease: 0,
        personal_norev: 0,
        personal_totalesg: 0,
        star_currentamount: 0,
        star_highestamount: 0,
        star_totalrev: 0,
        ts: 0,
        user: 0,
      },
      ratioUsdtEsg: '',
      ratioEsgUsdt: '',
      isStar: false,
      isQuestionOperate: false,
      teamReaward: 0,
      isWhite: false
    }
  },
  components: { Question },
  computed: {
    ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),

    ...web3MapState(['vuex_web3', 'vuex_myContract', 'vuex_network', 'money']),
    i18n() {
      return this.$t('message');
    },
  },
  created() {
    // 需要合约实例化后运行的函数 异步函数队列
    setTimeout(async () => {
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      try {
        await this.getWhite()
        await this.getRatio()
        await this.getTotalInfo()
      } catch (error) {
        console.log("Bpos err ==>", error)
        // this.reload()
      }
      Toast.clear();
      this.getBuyHold()
      this.getNodes()
      this.getNodeDatas()
      this.getTeamReaward()
    })
  },
  methods: {
    closeOperate() {
      this.isQuestionOperate = false
    },
    // 切换tab前
    beforeTabsChange(index) {
      if (index == '4') {
        if (!this.isWhite) Toast({ message: this.i18n.HashBump.IsWhite, icon: 'close', className: 'fail' });
        return this.isWhite
      } else {
        return true
      }
    },
    // 获取是否白名单
    async getWhite() {
      let res = await this.vuex_myContract.contract_HashCollision.methods.IsWhiteList(this.address).call()
      this.isWhite = res
      console.log('white ==>', res)
    },
    // 跳转详情
    toShareDetails(item) {
      this.$router.push({ name: 'ShareDetails', params: { buyId: item.id, isTeam: item.is_team, priceRatio: this.ratioUsdtEsg, NoRelease: this.allDataObj.personal_norelease, item }, query: { parentPage: 'HashRecord' } })
    },
    // 跳转记录
    toAllRecord(val) {
      console.log(val)
      if (val == 1) {
        if (this.nodeList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
        this.$router.push({ name: 'AllRecord', query: { type: val, parentPage: 'HashRecord' }, params: { data: this.nodeList } })
      } else if (val == 2) {
        if (this.dividendList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
        this.$router.push({ name: 'AllRecord', query: { type: val, parentPage: 'HashRecord' }, params: { data: this.dividendList } })
      } else if (val == 3) {
        if (this.starList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
        this.$router.push({ name: 'AllRecord', query: { type: val, parentPage: 'HashRecord' }, params: { data: this.starList } })
      }  else if (val == 4) {
        if (this.nodeDatas.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
        this.$router.push({ name: 'AllRecord', query: { type: val, parentPage: 'HashRecord' }, params: { data: this.nodeDatas } })
      }
    },
    // 点击 选项
    async chooseHoldFilter(index) {
      this.activeH = index
      this.showFilter = false
      Toast.loading({
        duration: 30000,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      if (index == 1) {
        await this.getBuyHold('', '')
      } else if (index == 2) {
        await this.getBuyHold()
      } else {
        await this.getBuyHold('', 'yimaichu')
      }
      Toast.clear()
    },
    // 记录
    goGetRecord() {
      this.$router.push({ name: 'GetRecord', query: { parentPage: 'HashRecord' } })
    },
    // 复制
    copyAddr(val) {
      _tools.copyValue(val)
      Toast({ message: this.i18n.Main.CopySuccess, icon: 'passed', className: 'successToast' });
    },

    // 获取汇率
    async getRatio() {
      let data = await GetEsgPrice({})
      let price = data.data
      this.ratioUsdtEsg = price[0]
      this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9)
    },

    // 获取total信息
    async getTotalInfo() {
      try {
        let infoData = await GetNewBposUserInfos({ addr: this.address })
        let data = infoData.data
        console.log('data ==>', data)
        let obj = {
          node_alreadyrev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.node_alreadyrev), 'ether'),
          node_amountofa: data.node_amountofa,
          node_amountofall: data.node_amountofall,
          node_totalesg: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.node_totalesg), 'ether'),
          personal_alreadyRev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_alreadyRev), 'ether'),
          personal_norelease: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_norelease), 'ether'),
          personal_norev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_norev), 'ether'),
          personal_totalesg: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_totalesg), 'ether'),
          ts: data.ts,
          user: data.user,
        }
        this.allDataObj = obj
        this.totalHold = BigNumber(obj.personal_totalesg).multipliedBy(this.ratioUsdtEsg)
        this.totalNode = BigNumber(obj.node_totalesg).multipliedBy(this.ratioUsdtEsg)
        this.totalStar = obj.star_totalrev
        // console.log("this.allDataObj ==>", this.allDataObj)
      } catch (error) {
        console.log('info error ==>', error)
      }

    },

    // 获取当前持仓
    async getBuyHold(type = 'buy', status = 'jinxingzhong') {
      let params = {
        addr: this.address,
        status,
        recordType: type,
        Desc: true
      }
      let recordList = await GetNewHistoryBuyEsg({ ...params })
      let data = recordList.data
      console.log("hold ==>", data)
      let arr = []
      let list = []
      await Promise.all(data.map(async v => {
        let obj = {
          id: v.ID,
          ts: '',
          txPA: '',
          tsY: '',
          usdt_amount: '',
          esg_amount: '',
          is_team: false,
          chain_record_idx: '',
          type: v.type,
          price: v.price,
          handlingFees: '',
          recommend: v.recommend,
          reward: '',
          norecieved: '',
          status: v.status,
          showId: '',
          tx_hash: v.tx_hash,
          show_tx: '',
          height: v.height,
          hash_number: v.hash_number,
          hashUrl: `${Eth.BscUrl}tx/${v.tx_hash}`,
          blockUrl: `${Eth.BscUrl}block/${v.height}`,
          bumpUrl: `${Eth.BscUrl}block/${Number(v.height) + 1}`,
          candy: '',
          gidx: v.gidx,
          isReward: 0,
          isGet: false
        }
        // getMDHM
        obj.ts = _date.getMDHM(v.ts * 1000)
        obj.timestamp = v.ts
        obj.tsY = _date.getYMDHMS(v.ts * 1000)
        obj.reward = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.reward), 'ether')
        obj.norecieved = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.norecieved), 'ether')
        obj.usdt_amount = this.vuex_web3.utils.fromWei(v.usdt_amount, 'ether')
        obj.esg_amount = this.vuex_web3.utils.fromWei(v.esg_amount, 'ether')
        obj.candy = this.vuex_web3.utils.fromWei(v.candy, 'ether')
        obj.handlingFees = _float.mul(obj.esg_amount, 0.05)
        obj.is_team = v.is_team == 1 ? true : false
        obj.chain_record_idx = v.chain_record_idx
        obj.txPA = _date.formatAMPM(v.ts * 1000)
        obj.show_tx = _accounts.easyAccount(null, 2, 4, v.tx_hash)
        if (type == 'buy' && v.status == 'jinxingzhong') {
          arr.push(obj)
          let reward = await this.vuex_myContract.contract_HashCollision.methods.getResult(this.address, obj.gidx).call()
          obj.isReward = reward[0]
          obj.isGet = reward[1]
          console.log("reward ==>", reward)
          list.push(obj)
        } else if (type == '') {
          arr.push(obj)
        }
        if (v.hash_number == -1) {
          setTimeout(() => {
            this.getBuyHold()
          }, 3000);
        }
      }))
      list.sort((a, b) => b.timestamp - a.timestamp)
      arr.sort(this.objectSort("chain_record_idx"))
      let sortArr = []
      let showidx = 0
      arr.map(v => {
        if (v.chain_record_idx == 0 && v.is_team) {
          sortArr.unshift(v)
        } else {
          showidx += 1
          v.showId = showidx
          sortArr.push(v)
        }
      })
      this.$nextTick(() => {
        this.buyList = list
        this.recordList = sortArr
        console.log("this.recordList ==>", this.recordList)
      })
    },
    objectSort(property) {
      return function (Obj1, Obj2) {
        return Obj1[property] - Obj2[property]
      }
    },
    // 获取团队可领
    async getTeamReaward() {
      let res = await this.vuex_myContract.contract_HashCollision.methods.TeamReaward(this.address).call()
      // console.log('team get ==>', res)
      this.teamReaward = this.vuex_web3.utils.fromWei(_tools.interceptFloat(res), 'ether')
    },
    // 获取团队数据
    async getNodes() {
      let params = {
        addr: this.address,
        desc: true
      }
      let res = await GetNewReceivedLiquidity({ ...params })
      let data = res.data
      data.map((v, i) => {
        let obj = {
          buyid: v.buyid,
          from: v.from,
          id: v.id,
          percent: v.percent,
          reward_amount: '',
          status: v.status,
          ts: '',
          type: v.type,
          user: v.user,
          showUser: '',
          symbol: v.symbol == 0 ? '' : String.fromCharCode(v.symbol)
        }
        obj.ts = _date.getYMDHMS(v.ts * 1000)
        obj.reward_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.reward_amount), 'ether')
        obj.showUser = _accounts.easyAccount(null, 12, 8, v.from)
        this.nodeList.push(obj)
        if (i <= 2) {
          this.showNodes.push(obj)
        }
      })
      // console.log('nodelist ==>', this.nodeList)
    },

    // 获取节点数据
    async getNodeDatas() {
      let params = {
        addr: this.address,
        desc: true
      }
      let res = await GetNewWhitelistRecord({ ...params })
      let data = res.data
      console.log('节点数据 ==>', data)
      data.map((v, i) => {
        let obj = {
          from: v.from,
          showUser: '',
          id: v.id,
          percent: v.percent,
          amount: '',
          ts: '',
          earnings: ''
        }
        obj.ts = _date.getYMDHMS(v.ts * 1000)
        obj.amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.amount), 'ether')
        obj.earnings = _float.mul(obj.amount, obj.percent)
        obj.showUser = _accounts.easyAccount(null, 12, 8, v.from)
        this.nodeDatas.push(obj)
        if (i <= 2) {
          this.showNodeDatas.push(obj)
        }
      })
      console.log('showNodeDatas ==>', this.showNodeDatas)
    },

    // 领取
    async getReward(item) {
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      let params = {
        name: 'getReward', // 方法名
        inputs: [
          {
            "internalType": "uint256",
            "name": "gIdx",
            "type": "uint256"
          }
        ],
        arguments: [item.gidx], // 参数
      }

      await contractMethods(this.address, Eth.contract.contract_HashCollision.addr, params).then(async res => {
        if (res.code == 101) {
          setTimeout(async () => {
            Toast.clear();
            this.reload()
          }, 1000);
        }
      }).catch(err => {
        console.log('失败 ==>', err)
        Toast.clear();
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

    // 节点领取
    async nodeGet() {
      if (this.teamReaward == 0) return Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      let params = {
        name: 'getUsdtReward', // 方法名
        inputs: [],
        arguments: [], // 参数
      }

      await contractMethods(this.address, Eth.contract.contract_HashCollision.addr, params).then(async res => {
        if (res.code == 101) {
          setTimeout(async () => {
            Toast.clear();
            this.reload()
          }, 1000);
        }
      }).catch(err => {
        console.log('失败 ==>', err)
        Toast.clear();
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
.HashModel {
  height: 100%;

  .top {
    padding: 48px 0 32px 0;
    box-sizing: border-box;

    .top_box {
      width: 100%;
      height: 65px;

      /deep/ .van-tabs {
        width: 100%;

        * {
          background-color: transparent;
        }

        .van-tabs__wrap {
          height: 60px;
          width: 100%;
        }

        .van-tabs__nav--line {
          padding: 0;
          height: 100%;
        }

        .van-tabs__line {
          background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
          border-radius: 4px 4px 4px 4px;
          width: 32px;
          height: 4px;
          bottom: 0;
        }

        .van-tab {
          color: #333;
          // margin-right: 58px;
          font-size: 32px;
          width: auto;
          padding: 0;
          font-weight: normal;
        }

        .van-tab--active {
          color: #00C482;
          font-weight: normal;
        }
      }
    }
  }

  .HashModel_tabs {
    .my_buy {
      width: 100%;

      .buy_item {
        box-sizing: border-box;
        width: 100%;
        padding: 60px 32px 0px;
        overflow: hidden;
        background: #FFFFFF;
        box-shadow: 0px 6px 6px 0px #DCF5ED;
        border-radius: 30px;
        margin-bottom: 32px;

        .item_box {
          width: 50%;
          height: 170px;
          line-height: 0;

          >span {
            display: inline-block;
            height: 52px;
            padding: 0 16px;
            line-height: 52px;
            border-radius: 20px;
            border: 2px solid #F5F5F5;
            font-size: 28px;
            white-space: nowrap;
          }

          >p {
            padding-left: 16px;
            margin: 0;
            margin-top: 32px;
            font-size: 24px;
            line-height: 34px;
          }

          .copy_box {
            display: flex;
            align-items: center;
            margin-top: 32px;
            padding-left: 16px;

            a {
              margin: 0;
              font-size: 24px;
              color: #13C087;
              margin-right: 6px;
              border-bottom: 1px solid #13C087;
              line-height: 34px;
            }

            img {
              width: 12px;
            }
          }

          .qustion_box {
            display: flex;
            align-items: center;
            justify-content: left;

            span {
              display: inline-block;
              height: 52px;
              padding: 0 16px;
              line-height: 52px;
              border-radius: 20px;
              border: 2px solid #F5F5F5;
              font-size: 28px;
              white-space: nowrap;
            }

            img {
              margin-left: 10px;
              width: 26px;
            }
          }

          .btn_box {
            margin-top: 18px;

            // span {
            //   display: inline-block;
            //   line-height: 50px;
            //   color: #333;
            //   font-size: 24px;
            //   padding-left: 16px;
            // }
            .claim {
              display: inline-block;
              width: 132px;
              height: 60px;
              background: linear-gradient(270deg, #16CB8F 0%, #499BF7 100%);
              border-radius: 12px;
              color: #fff;
              font-size: 24px;
              line-height: 60px;
              padding: 0;
              text-align: center;
            }

            .claim_no {
              display: inline-block;
              line-height: 50px;
              color: #333;
              font-size: 24px;
              padding-left: 16px;
            }

            .no_get {
              background: #EAEAEA;
              color: #999999;
            }
          }
        }
      }

      & .buy_item:last-child {
        margin-bottom: 0;
      }
    }

    .my_hold, .my_node {
      .tab_hold {
        .hold_total {
          padding: 48px 32px;
          background: #FFFFFF;
          box-shadow: 0px 0px 12px 2px #DCF5ED;
          border-radius: 32px;

          .text_record {
            width: 100%;
            margin-bottom: 16px;

            span {
              font-size: 28px;
              color: #999999;
            }

            img {
              height: 38px;
            }
          }

          .total {
            padding-bottom: 24px;
            margin-bottom: 24px;
            border-bottom: 2px solid #F5F5F5;

            h1 {
              font-size: 48px;
              font-weight: bold;
            }
          }

          .total_get {
            width: 100%;

            .total_nums,
            .revenue {
              width: 50%;
              margin-bottom: 30px;

              p {
                white-space: nowrap;
                font-size: 24px;
                color: #999999;
                margin-bottom: 10px;
              }

              span {
                font-size: 32px;
              }
            }

            & :nth-child(3) {
              margin: 0;
            }

            & :nth-child(4) {
              margin: 0;
            }

            .revenue_box {
              display: flex;
              align-items: center;

              i {
                margin: 0 10px;
                height: 28px;
                width: 2px;
                background-color: #CCCCCC;
              }

              & :nth-child(3) {
                color: #16CB8F;
              }

              .money {
                color: #16CB8F;
              }
            }
          }
        }
      }

      .record_box {
        margin-top: 32px;
        width: 100%;
        padding: 50px 18px;
        box-sizing: border-box;
        background: #FFFFFF;
        box-shadow: 0px 6px 6px 0px #DCF5ED;
        border-radius: 30px;

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

        .record_item {
          width: 100%;
          padding: 28px 0;
          border-bottom: 1px solid #F5F5F5;

          .record_date {
            display: flex;
            align-items: center;
            width: 100%;
            margin-bottom: 16px;

            & img:nth-of-type(1) {
              height: 44px;
              margin-right: 10px;
            }

            & img:nth-of-type(2) {
              height: 26px;
              margin-left: auto;
            }

            & img:nth-of-type(3) {
              height: 26px;
              margin-left: auto;
            }

            & span:nth-of-type(1) {
              font-size: 28px;
              color: #000;
              font-weight: bold;
            }

            i {
              display: inline-block;
              width: 2px;
              height: 24px;
              background-color: #CCCCCC;
              margin: 0 8px;
            }

            & span:nth-of-type(2) {
              font-size: 20px;
              color: #CCCCCC;
            }
          }

          .record_nums {
            width: 100%;
            display: flex;

            .esg_num,
            .usdt_num,
            .earning {
              flex: 1;

              p {
                font-size: 24px;
                color: #999999;
              }

              span {
                font-size: 28px;
                display: inline-block;
                margin-top: 5px;
              }
            }

            .esg_num {
              max-width: 180px;
            }

            .usdt_num {
              max-width: 180px;
              padding-left: 10px;
            }

            .earning {
              text-align: right;

              .earning_one {
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                flex-wrap: nowrap;
                justify-content: right;
                align-items: center;

                >span {
                  margin-right: 8px;
                  margin-left: auto;
                }

                i {
                  margin-left: 0;
                }

                & span:last-child {
                  margin: 0;
                }
              }

              i {
                display: inline-block;
                width: 2px;
                height: 24px;
                background-color: #CCCCCC;
                margin: 0px 8px 0 8px;
              }

              span {
                margin: 0;
                color: #16CB8F;
              }
            }
          }
        }

        & .record_item:last-of-type {
          border: none;
        }

        .node_all {
          display: flex;
          align-items: center;

          >span {
            font-size: 28px;
            font-weight: bold;
          }

          .all_btn {
            margin-left: auto;
            display: flex;
            align-items: center;

            span {
              font-size: 28px;
              color: #666666;
            }

            img {
              margin-left: 14px;
              height: 28px;
            }
          }
        }

        .node_item {
          width: 100%;
          padding: 34px 0;
          border-bottom: 1px solid #F5F5F5;

          .node_title {
            display: flex;
            align-items: center;
            margin-bottom: 38px;

            .node_type {
              font-size: 28px;
              font-weight: bold;
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

            .money {
              color: #16CB8F !important;
            }

            .add {
              color: #333333;
            }

            .addr {
              color: #333 !important;
              span {
                color: #333;
              }
            }
          }

          & .node_detail:last-child {
            margin: 0;
          }
        }

        & .node_item:last-of-type {
          border: none;
        }
      }
    }

    .my_node {
      .node_get {
        width: 100%;
        height: 204px;
        background: #FFFFFF;
        box-shadow: 0px 0px 6px 0px #DCF5ED;
        border-radius: 30px;
        padding: 36px 32px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .get_fl {
          .get_text {
            line-height: 32px;
            span {
              color: #999999;
              font-weight: normal;
            }
            & span:nth-of-type(1) {
              font-size: 32px;
            }
            & span:nth-of-type(2) {
              font-size: 24px;
            }
          }
          .get_nums {
            span {
              font-size: 40px;
            }
          }
        }
        .get_fr {
          margin-left: auto;
          margin-right: 30px;
          .get_btn {
            width: 148px;
            height: 56px;
            background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
            border-radius: 15px;
            color: #fff;
            border-radius: 12px;
            font-size: 28px;
            text-align: center;
            line-height: 56px;
          }
        }
      }
    }
  }
}

/deep/ .van-popup {
  .hold_filter {
    background-color: #fff;
    padding-top: 60px;
    padding-bottom: 70px;

    span {
      display: block;
      margin: 40px;
      text-align: center;
      font-size: 32px;
    }

    & :nth-child(1) {
      margin-top: 0;
    }

    .active_hold {
      color: #16CB8F;
    }
  }

}

.HashModel_hock {
  background-color: $back-qs-hock;

  .top .top_box /deep/ .van-tabs .van-tab {
    color: $text-qqs-hock;
  }

  .top .top_box /deep/ .van-tabs .van-tab--active {
    color: $text-qs-hock;
  }

  .my_hold .tab_hold .hold_total {
    background-color: $back-hock;
    box-shadow: none;
  }

  .my_hold .tab_hold .hold_total .total {
    border-bottom-color: $trading-border-hock;
  }

  .my_hold .record_box .record_item .record_date span:nth-of-type(1) {
    color: $text-qs-hock;
  }

  .my_hold .record_box .record_item .record_date i {
    background-color: $trading-border-hock;
  }

  .my_hold .record_box .record_item .record_date span:nth-of-type(2) {
    color: $text-999-hock;
  }

  .my_hold .record_box .record_item {
    border-bottom-color: $bpos-border-b-hock;
  }

  .my_hold .record_box .node_all .all_btn span {
    color: $text-qqs-hock;
  }

  .my_hold .record_box .node_item .node_detail .detail_box span {
    color: $text-qs-hock;
  }

  .my_hold .record_box .node_item {
    border-bottom-color: $trading-border-hock;
  }

  .my_hold .record_box .node_item .node_detail .add {
    color: $text-qs-hock;
  }

  /deep/ .van-popup {
    .hold_filter {
      background-color: $back-qs-hock;
    }
  }

  .HashModel_tabs .my_buy .buy_item {
    box-shadow: none;
    background-color: #000D07;
  }

  /deep/ .top .top_box .van-tabs .van-tab {
    color: #CCCCCC;
  }

  /deep/ .top .top_box .van-tabs .van-tab--active {
    color: #00C482;
  }

  .HashModel_tabs .my_buy .buy_item .item_box>span {
    border-color: #27332F;
    color: #fff;
  }

  .HashModel_tabs .my_buy .buy_item .item_box>p {
    color: #fff;
  }

  .HashModel_tabs .my_buy .buy_item .item_box .btn_box .no_get {
    background-color: #1D2D28;
    color: #fff;
  }

  .HashModel_tabs .my_hold .tab_hold .hold_total {
    box-shadow: none;
    background-color: #000D07;
    color: #fff;
  }

  .HashModel_tabs .my_hold .tab_hold .hold_total .total {
    border-color: #28342E;
  }

  .HashModel_tabs .my_hold .record_box {
    background-color: #09130F;
    box-shadow: none;
  }

  .HashModel_tabs .my_hold .record_box .record_item {
    border-color: #28342E;
  }

  .HashModel_tabs .my_hold .record_box .record_item .record_date span:nth-of-type(1) {
    color: #fff;
  }

  .HashModel_tabs .my_hold .record_box .node_all .all_btn span {
    color: #CCCCCC;
  }

  .HashModel_tabs .my_hold .record_box .node_item {
    border-color: #28342E;
  }

  .HashModel_tabs .my_hold .record_box .node_item .node_detail .detail_box span {
    color: #fff;
  }

  .HashModel_tabs .my_buy .buy_item .item_box .qustion_box span {
    border-color: #28342E;
    color: #fff;
  }
  .HashModel_tabs .my_node .node_get {
    background-color: #000D07;
    box-shadow: none;
  }
  .HashModel_tabs .my_node .record_box {
    background-color: #09130F;
    box-shadow: none;
  }
  .HashModel_tabs .my_node .record_box .node_item .node_detail .addr {
    color: #fff !important;
  }
  .HashModel_tabs .my_node .record_box .node_item .node_detail .addr span {
    color: #fff;
  }
}
</style>
