<template>
  <div class="LuckyPool" :class="hock ? 'LuckyPool_hock' : ''">
    <div class="top">
      <div class="top_box f-a-c f-j-sb">
        <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange" :ellipsis="false">
          <van-tab :title="i18n.Trading.Exchange" name="1"></van-tab>
          <van-tab :title="i18n.Trading.Mobility" name="2"></van-tab>
          <van-tab :title="i18n.Trading.Nft" name="3"></van-tab>
          <van-tab :title="i18n.Trading.Lucky" name="4"></van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="LuckyPool_tab">
      <div class="tab_exchange" v-show="active == '4'">
        <div class="exchange_inp clearfix">
          <div class="balance fl clearfix">
            <span class="fl">{{i18n.Trading.Send}}</span>
            <div class="question_icon fr">
              <img src="../../assets/v2img/Question.png" alt="" @click="isQuestionBuy = true">
            </div>
            <span class="fr">
              <!-- <van-skeleton :row="0.5" row-width="100%" :loading="balanceLoad" round> -->
              <div v-show="isExchange" @click="allBalanceUSDT">
                {{i18n.Trading.Balance}}：{{Number(USDTbalance).toFixed(4)}}</div>
              <div v-show="!isExchange" @click="allBalanceESG">{{i18n.Trading.Balance}}：{{ESGbalance == 0 ? 0 :
              Number(ESGbalance).toFixed(4)}}
              </div>
              <!-- <div>{{i18n.Trading.Balance}}：{{KEYbalance}}</div> -->
              <!-- </van-skeleton> -->
            </span>
          </div>
          <div class="inp_box_out fl">
            <van-field class="usdt_inp" type="number" v-show="isExchange" v-model="value1" :placeholder="i18n.Trading.OutNums"
              @blur="usdtInp" />
            <van-field class="esg_inp" type="number" v-show="!isExchange" v-model="value1" :placeholder="i18n.Trading.OutNums"
              @blur="esgInp" />
            <div class="usdt_icon" v-show="isExchange">
              <img src="../../assets/v2img/usdt_icon.png" alt="" class="fl">
              <span class="fl">USDT</span>
            </div>
            <div class="esg_icon" v-show="!isExchange">
              <img src="../../assets/v2img/esg_icon.png" alt="" class="fl">
              <span class="fl">ESG</span>
            </div>
          </div>
          <div class="change_status">
            <div class="change_box" @click="changeStatus">
              <img v-show="!hock" src="../../assets/v2img/shangxia_icon.png" alt="">
              <img v-show="hock" src="../../assets/v2img/shangxia_icon_hock.png" alt="">
            </div>
          </div>
          <div class="in_box fl">
            <div class="in_title clearfix">
              <span class="fl">{{i18n.Trading.Receive}}</span>
              <span class="fr" v-show="!isExchange">{{i18n.Trading.Balance}}：{{Number(USDTbalance).toFixed(4)}}</span>
              <span class="fr" v-show="isExchange">{{i18n.Trading.Balance}}：{{ESGbalance == 0 ? 0
              :
              Number(ESGbalance).toFixed(4)}}</span>
            </div>
            <div class="inp_box_in">
              <van-field class="esg_inp" type="number" v-show="isExchange" v-model="value2" :placeholder="i18n.Trading.InNums"
                @blur="esgInp" />
              <van-field class="usdt_inp" type="number" v-show="!isExchange" v-model="value2" :placeholder="i18n.Trading.InNums"
                @blur="usdtInp" />
              <div class="usdt_icon" v-show="!isExchange">
                <img src="../../assets/v2img/usdt_icon.png" alt="" class="fl">
                <span class="fl">USDT</span>
              </div>
              <div class="esg_icon" v-show="isExchange">
                <img src="../../assets/v2img/esg_icon.png" alt="" class="fl">
                <span class="fl">ESG</span>
              </div>
            </div>
          </div>
          <div class="price_box fl">
            <div class="price">
              <span>{{Number(ratioUsdtEsg).toFixed(4)}} USDT ≈ 1 ESG</span>
              <img src="../../assets/v2img/reset_icon.png" alt="" @click="resetRatio">
            </div>
          </div>
          <div class="exchange_btn fl">
            <div class="confirm_btn" @click="Exchange">{{i18n.Trading.ExchangeBtn}}</div>
          </div>
          <div class="key_bnb fl">
            <div class="key clearfix">
              <div class="key_left fl">
                <span>{{i18n.Trading.Gasfee}}</span>
              </div>
              <div class="key_right fr">
                <span v-show="isExchange">{{gasFee == 0 ? 0 : Number(gasFee).toFixed(4)}} ESG</span>
                <span v-show="!isExchange">0 ESG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pool_box">
        <div class="tabs_box">
          <van-tabs v-model="activePool">
            <van-tab :title="i18n.LuckyPool.Luckypool" name="1">
              <div class="pool_item">
                <div class="q_box clearfix">
                  <img class="fr" src="../../assets/v2img/Question.png" alt="" @click="isQuestionLucky = true">
                </div>
                <div class="total_box">
                  <h1>{{luckPool == 0 ? 0 : Number(luckPool).toFixed(4)}}</h1>
                  <span>ESG</span>
                </div>
              </div>
            </van-tab>
            <van-tab :title="i18n.LuckyPool.Porwerpool" name="2">
              <div class="pool_item">
                <div class="q_box clearfix">
                  <img class="fr" src="../../assets/v2img/Question.png" alt="" @click="isQuestionPower = true">
                </div>
                <div class="total_box">
                  <h1>{{powerPool == 0 ? 0 : Number(powerPool).toFixed(4)}}</h1>
                  <span>ESG</span>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>

      <div class="count_down">
        <div class="timer_title">
          <span>{{i18n.LuckyPool.CountDown}}</span>
          <img src="../../assets/v2img/Question.png" alt="" @click="isQuestionTimer = true">
        </div>
        <div class="timer_box">
          <van-count-down :time="time * 1000" @finish="timeFinish" ref="CountDown">
            <template #default="timeData">
              <span class="block">{{ String(timeData.hours).length == 1 ? '0' + timeData.hours : timeData.hours
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{ String(timeData.minutes).length == 1 ? '0' + timeData.minutes : timeData.minutes
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{ String(timeData.seconds).length == 1 ? '0' + timeData.seconds : timeData.seconds
              }}</span>
            </template>
          </van-count-down>
        </div>
      </div>

      <div class="pool_box record_box">
        <div class="tabs_box">
          <van-tabs v-model="activeRecord">
            <van-tab :title="i18n.LuckyPool.BuyReocrd" name="1">
              <div class="buy_box">
                <div class="null_box" v-if="buy_record.length == 0">
                  {{i18n.Toast.NoData}}
                </div>
                <div class="buy_item" v-for="(item, index) in buy_record" :key="index">
                  <div class="item_time">
                    {{item.ts}}
                  </div>
                  <div class="item_addr">
                    <span>{{item.showUser}}</span>
                    <img v-if="!hock" src="../../assets/v2img/copy_icon_min.png" alt="" @click="copyAddr(item.sender)">
                    <img v-if="hock" src="../../assets/v2img/copy_icon_min_hock.png" alt=""
                      @click="copyAddr(item.sender)">
                  </div>
                  <div class="item_amount">
                    {{Number(item.esg_amount).toFixed(4)}} ESG
                  </div>
                </div>
              </div>
            </van-tab>
            <van-tab :title="i18n.LuckyPool.OpenReocrd" name="2">
              <div class="buy_box open_box">
                <div class="open_top">
                  <div class="top_box f-a-c f-j-sb">
                    <van-tabs v-model="activeOpenRecord" :ellipsis="false" @change="tabsChangeOpenRecord">
                      <van-tab :title="i18n.LuckyPool.Luckypool" name="1"></van-tab>
                      <van-tab :title="i18n.LuckyPool.Porwerpool" name="2"></van-tab>
                      <van-tab :title="i18n.LuckyPool.QuestionTimer" name="3"></van-tab>
                    </van-tabs>
                  </div>
                </div>
                <div class="content_main">
                  <div class="tips_box">
                    <div class="tips_item">
                      {{i18n.LuckyPool.Per}} {{Period}} {{i18n.LuckyPool.Period}}
                    </div>
                  </div>
                  <div class="record_heard">
                    <span>{{i18n.LuckyPool.Awards}}</span>
                    <span>{{i18n.LuckyPool.Address}}</span>
                    <span>{{i18n.LuckyPool.Bonus}}</span>
                  </div>
                  <div class="null_box" v-if="open_record.length == 0">
                    {{i18n.Toast.NoData}}
                  </div>
                  <div class="open_item" v-for="(item, index) in open_record" :key="index">
                    <div class="item_awards">
                      {{i18n.LuckyPool[`Awards${item.step}`]}}
                    </div>
                    <div class="item_addr">
                      <span>{{item.showUser}}</span>
                      <img v-if="!hock" src="../../assets/v2img/copy_icon_min.png" alt="" @click="copyAddr(item.user)">
                      <img v-if="hock" src="../../assets/v2img/copy_icon_min_hock.png" alt=""
                        @click="copyAddr(item.user)">
                    </div>
                    <div class="item_amount">
                      {{Number(item.amount).toFixed(4)}} ESG
                    </div>
                  </div>
                </div>
              </div>
            </van-tab>
            <van-tab :title="i18n.LuckyPool.MyReocrd" name="3">
              <div class="buy_box open_box my_box">
                <div class="record_heard">
                  <span>{{i18n.LuckyPool.Time}}</span>
                  <span>{{i18n.LuckyPool.Amount}}</span>
                  <span>{{i18n.LuckyPool.Bonus}}</span>
                </div>
                <div class="null_box" v-if="my_record.length == 0">
                  {{i18n.Toast.NoData}}
                </div>
                <div class="open_item" v-for="(item, index) in my_record" :key="index">
                  <div class="item_time">
                    {{item.ts}}
                  </div>
                  <div class="item_amount">
                    {{Number(item.esg_amount).toFixed(4)}} ESG
                  </div>
                  <div class="item_amount">
                    {{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)}} ESG
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <Question :show="isQuestionLucky" @closeFunName="closeLucky" :title="i18n.LuckyPool.Luckypool">
      <div class="content">
        <p>{{i18n.LuckyPool.q_luck1}}</p>
        <p>{{i18n.LuckyPool.q_luck2}}</p>
        <p>{{i18n.LuckyPool.q_luck3}}</p>
        <p>{{i18n.LuckyPool.q_luck4}}</p>
        <p>{{i18n.LuckyPool.q_luck5}}</p>
        <p>{{i18n.LuckyPool.q_luck6}}</p>
      </div>
    </Question>
    <Question :show="isQuestionPower" @closeFunName="closePower" :title="i18n.LuckyPool.Porwerpool">
      <div class="content">
        <p>{{i18n.LuckyPool.q_power1}}</p>
        <p>{{i18n.LuckyPool.q_power2}}</p>
        <p>{{i18n.LuckyPool.q_power3}}</p>
        <p>{{i18n.LuckyPool.q_power4}}</p>
        <p>{{i18n.LuckyPool.q_power5}}</p>
        <p>{{i18n.LuckyPool.q_power6}}</p>
      </div>
    </Question>
    <Question :show="isQuestionBuy" @closeFunName="closeBuy" :title="i18n.LuckyPool.QuestionBuy">
      <div class="content">
        <p>{{i18n.LuckyPool.q_buy1}}</p>
        <p>{{i18n.LuckyPool.q_buy2}}</p>
        <p>{{i18n.LuckyPool.q_buy3}}</p>
      </div>
    </Question>
    <Question :show="isQuestionTimer" @closeFunName="closeTimer" :title="i18n.LuckyPool.QuestionTimer">
      <div class="content">
        <p>{{i18n.LuckyPool.q_timer1}}</p>
        <p>{{i18n.LuckyPool.q_timer2}}</p>
        <p>{{i18n.LuckyPool.q_timer3}}</p>
        <p>{{i18n.LuckyPool.q_timer4}}</p>
      </div>
    </Question>
  </div>
</template>

<script>
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { contractMethods, GetEsgPrice, GetTenUPond, GetTenULottery, GetTenUBuyRecord } from '@api'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import Question from '@/components/comm/Question.vue';
import BigNumber from 'bignumber.js';
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
  inject: ["reloadMain", 'reload'],
  data() {
    return {
      active: "4",
      activePool: "1",
      activeOpenRecord: '1',
      holdBalance: "",
      USDTbalance: 0,
      KEYbalance: 0,
      ESGbalance: 0,
      isExchange: true,
      gasFee: 0,
      value1: "",
      value2: "",
      ratioA: 0,
      ratioB: 0,
      ratioUsdtEsg: 0,
      ratioEsgUsdt: 0, // esg - usdt
      isQuestionLucky: false,
      isQuestionPower: false,
      isQuestionBuy: false,
      isQuestionTimer: false,
      luckPool: 0,
      powerPool: 0,
      time: 0,
      activeRecord: '1',
      buy_record: [],
      Period: 1,
      open_record: [],
      my_record: []
    };
  },
  components: { Question },
  computed: {
    ...mapState(["address", "ethNetWork", "isLink", "hock"]),
    ...web3MapState(["vuex_web3", "vuex_myContract", "vuex_network", "money"]),
    i18n() {
      return this.$t("message");
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
      }
      catch (error) {
        console.log("LuckyPool err ==>", error);
      }
      Toast.clear();
      this.getRatio();
      this.getBalanceUsdt();
      this.getBalanceEsg();
      this.getPoolPond();
      this.getOpenRecord();
      this.getBuyOrMyRecord();
      this.getBuyOrMyRecord(this.address);
    }, 0);

    let timer = setInterval(() => {
      this.resetData()
    }, 5000);
  },
  methods: {
    // 复制
    copyAddr(val) {
      _tools.copyValue(val)
      Toast({ message: this.i18n.Main.CopySuccess, icon: 'passed', className: 'successToast' });
    },
    // tabs 跳转前
    async beforeTabsChange(index) {
      if (index == 1) {
        this.$router.push({ path: "Trading" });
      }
      else if (index == 2) {
        // Toast({ message: this.i18n.Trading.Dev, icon: 'close', className: 'fail' });
        // return
        this.$router.push({ path: "Mobility" });
      }
      else if (index == 3) {
        this.$router.push({ path: "NFTexchange" });
      }
      else if (index == 4) {
        this.$router.push({ path: "LuckyPool" });
      }
      return false;
    },
    // 切换
    tabsChange(index) {
    },
    async tabsChangeOpenRecord() {
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      if (this.activeOpenRecord == 1) {
        await this.getOpenRecord(1)
      } else if (this.activeOpenRecord == 2) {
        await this.getOpenRecord(2)
      } else {
        await this.getOpenRecord(3)
      }
      Toast.clear()
    },
    closeLucky() {
      this.isQuestionLucky = false
    },
    closePower() {
      this.isQuestionPower = false
    },
    closeBuy() {
      this.isQuestionBuy = false
    },
    closeTimer() {
      this.isQuestionTimer = false
    },
    // 更新数据
    resetData() {
      this.getPoolPond()
      this.getOpenRecord(this.activeOpenRecord)
      this.getBuyOrMyRecord()
      this.getBuyOrMyRecord(this.address)
    },
    // 获取池子 - 倒计时数据
    async getPoolPond() {
      let res = await GetTenUPond({})
      // console.log('pool data res ==>', res)
      let data = res.data
      if (data) {
        this.luckPool = this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.lucky_pool), "ether")
        this.powerPool = this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.energ_ypool), 'ether')
        this.time = data.dealine
      }
    },
    // 倒计时结束
    timeFinish() {
      this.$refs.CountDown.reset()
      this.getPoolPond()
      this.getOpenRecord()
      this.getBuyOrMyRecord()
      this.getBuyOrMyRecord(this.address)
    },
    // 获取开奖记录
    async getOpenRecord(type = 1) {
      let res = await GetTenULottery({})
      let data = res.data
      // console.log("open data ==>", res)
      let arr = []
      if (data.length != 0) {
        let one = []
        let two = []
        let three = []
        for (const item of data) {
          item.showUser = _accounts.easyAccount(null, 2, 5, item.user)
          item.amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(item.amount), 'ether')
          if (item.step == 1) {
            one.push(item)
          } else if (item.step == 2) {
            two.push(item)
          } else {
            three.push(item)
          }
        }
        let onetype = []
        let twotype = []
        let threetype = []
        if (type == 1) {
          // 幸运池
          one.map(item => {if (item.lottery_name == 'BigOpen') {onetype.push(item)}})
          two.map(item => {if (item.lottery_name == 'BigOpen') {onetype.push(item)}})
          three.map(item => {if (item.lottery_name == 'BigOpen') {onetype.push(item)}})
        } else if (type == 2) {
          // 能量池
          one.map(item => {if (item.lottery_name == 'SmallOpen') {onetype.push(item)}})
          two.map(item => {if (item.lottery_name == 'SmallOpen') {onetype.push(item)}})
          three.map(item => {if (item.lottery_name == 'SmallOpen') {onetype.push(item)}})
        } else if (type == 3) {
          // 倒计时
          one.map(item => {if (item.lottery_name == 'TimeOpen') {onetype.push(item)}})
          two.map(item => {if (item.lottery_name == 'TimeOpen') {onetype.push(item)}})
          three.map(item => {if (item.lottery_name == 'TimeOpen') {onetype.push(item)}})
        }
        arr = [...onetype, ...twotype, ...threetype]
        if (arr.length != 0) {
          this.Period = arr[0].period
        }
      }
      this.open_record = arr
    },
    // 获取买入记录
    async getBuyOrMyRecord(addr = '') {
      let params = {
        addr,
        desc: true
      }
      let res = await GetTenUBuyRecord(params)
      let data = res.data
      let arr = []
      if (data.length != 0) {
        if (addr == '') {
          // console.log('buy record ==>', res)
          for (const item of data) {
            item.showUser = _accounts.easyAccount(null, 2, 5, item.sender)
            item.esg_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(item.esg_amount), 'ether')
            item.ts = _date.formatAMPM(item.ts * 1000)
            arr.push(item)
          }
          this.buy_record = arr
        } else {
          // console.log('my record ==>', res)
          for (const item of data) {
            item.showUser = _accounts.easyAccount(null, 2, 5, item.sender)
            item.esg_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(item.esg_amount), 'ether')
            item.reward = this.vuex_web3.utils.fromWei(_tools.interceptFloat(item.reward), 'ether')
            item.ts = _date.formatAMPM(item.ts * 1000)
            arr.push(item)
          }
          this.my_record = arr
        }
      }

    },
    // 获取汇率
    async getRatio() {
      let data = await GetEsgPrice({});
      let price = data.data;
      this.priceNowOld = price;
      this.ratioUsdtEsg = price[0];
      this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9);
    },
    // 刷新汇率
    async resetRatio() {
      Toast.loading({
        duration: 30000,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      await this.getRatio();
      if (this.isExchange) {
        // this.value2 = _float.mul(this.value1, this.ratioUsdtEsg)
        this.value1 = "";
        this.value2 = "";
      }
      else {
        this.value2 = Number(_float.mul(this.ratioUsdtEsg, this.value1)).toFixed(4) == 0 ? "" : Number(_float.mul(this.ratioUsdtEsg, this.value1)).toFixed(4);
      }
      Toast.clear();
    },
    // 获取余额 - usdt
    async getBalanceUsdt() {
      this.vuex_myContract.contrart_USDT.methods.balanceOf(this.address).call().then(res => {
        if (res != 0) {
          this.$nextTick(() => {
            // console.log("usdt balance ==>", res);
            this.USDTbalance = Number(this.vuex_web3.utils.fromWei(res, "ether"));
            // console.log("USDTbalance ==>", this.USDTbalance);
          });
        }
        this.balanceLoad = false;
      });
    },
    // 获取余额 - usdt
    async getBalanceEsg() {
      this.vuex_myContract.contrart_ESG.methods.balanceOf(this.address).call().then(res => {
        if (res != 0) {
          this.$nextTick(() => {
            // console.log("esg balance ==>", res);
            this.ESGbalance = Number(this.vuex_web3.utils.fromWei(res, "ether"));
            // console.log("ESGbalance ==>", this.ESGbalance);
          });
        }
        this.balanceLoad = false;
      });
    },
    // 所有余额 - usdt
    allBalanceUSDT() {
      if (this.isExchange) {
        this.value1 = this.USDTbalance;
        this.value2 = (this.value1 / this.ratioUsdtEsg).toFixed(4) == 0 ? "" : (this.value1 / this.ratioUsdtEsg).toFixed(4);
      }
      else {
        this.value2 = this.USDTbalance;
        this.value1 = (this.value2 / this.ratioUsdtEsg).toFixed(4) == 0 ? "" : (this.value2 / this.ratioUsdtEsg).toFixed(4);
      }
    },
    // 所有余额 - esg
    allBalanceESG() {
      if (this.isExchange) {
        this.value2 = this.ESGbalance;
        this.value1 = _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4) == 0 ? "" : _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4);
      }
      else {
        this.value1 = this.ESGbalance;
        this.value2 = _float.mul(this.value1, this.ratioUsdtEsg).toFixed(4) == 0 ? "" : _float.mul(this.value1, this.ratioUsdtEsg).toFixed(4);
      }
    },
    // 输入USDT
    usdtInp() {
      // if (this.value1 == '') return this.value2 = ''
      if (this.isExchange) {
        // this.value2 = (this.value1 / this.ratioUsdtEsg).toFixed(4) == 0 ? "" : (this.value1 / this.ratioUsdtEsg).toFixed(4);
        this.value2 = new BigNumber(this.value1).div(this.ratioUsdtEsg).toString() == 0 ? '' : Number(new BigNumber(this.value1).div(this.ratioUsdtEsg).toString()).toFixed(4)
      }
      else {
        // this.value1 = (this.value2 / this.ratioUsdtEsg).toFixed(4) == 0 ? "" : (this.value2 / this.ratioUsdtEsg).toFixed(4);
        this.value1 = new BigNumber(this.value2).div(this.ratioUsdtEsg).toString() == 0 ? '' : Number(new BigNumber(this.value2).div(this.ratioUsdtEsg).toString()).toFixed(4)
      }
      this.gasFee = _float.mul(this.value2, 0.05);
    },
    // 输入esg
    esgInp() {
      // if (this.value2 == '') return this.value1 = ''
      if (this.isExchange) {
        this.value1 = _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4) == 0 ? "" : _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4);
      }
      else {
        this.value2 = _float.mul(this.value1, this.ratioUsdtEsg).toFixed(4) == 0 ? "" : _float.mul(this.value1, this.ratioUsdtEsg).toFixed(4);
      }
      this.gasFee = _float.mul(this.value2, 0.05);
    },
    // 改变交换状态
    changeStatus() {
      let oldv1 = this.value1;
      let oldv2 = this.value2;
      this.value1 = oldv2;
      this.value2 = oldv1;
      this.isExchange = !this.isExchange;
    },
    // 授权 - USDT
    async approved() {
      return new Promise(async (resolve, reject) => {
        // 查询授权
        let isApproved = false;
        await this.vuex_myContract.contrart_USDT.methods.allowance(this.address, Eth.contract.contrart_PancakeSwapRouterV2.addr).call().then(res => {
          console.log("approve ==>", res);
          let data = _float.div(res, Math.pow(10, 18));
          if (data >= this.value1) {
            isApproved = true;
          }
          else {
            isApproved = false;
          }
        });
        if (isApproved)
          return resolve();
        let data = {
          name: "approve",
          inputs: [{
            "name": "spender",
            "type": "address"
          }, {
            "name": "amount",
            "type": "uint256"
          }],
          arguments: [
            Eth.contract.contrart_PancakeSwapRouterV2.addr,
            "10000000000000000000000000000000"
          ] // 参数
        };
        // 发起授权
        await contractMethods(this.address, Eth.contract.contrart_USDT.addr, data).then(async (res) => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Toast.ApprovalSuccess, icon: "passed", className: "successToast" });
            resolve();
          }
        }).catch(err => {
          reject();
          console.log("失败 ==>", err.message);
          if (err.code == 110) {
            // 交易拒绝
            Toast({ duration: 3000, message: this.i18n.Toast.networkRejection, icon: "close", className: "fail" });
          }
          else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ duration: 3000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
          }
          else if (err.code == 112) {
            // 交易超时
            Toast({ duration: 3000, message: this.i18n.Toast.TradingTimeOut, icon: "close", className: "fail" });
          }
          else {
            // 失败
            Toast({ duration: 3000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
          }
        });
      });
    },
    // 授权 - ESG
    async approvedESG() {
      return new Promise(async (resolve, reject) => {
        // 查询授权
        let isApproved = false;
        await this.vuex_myContract.contrart_ESG.methods.allowance(this.address, Eth.contract.contrart_PancakeSwapRouterV2.addr).call().then(res => {
          console.log("approve esg==>", res);
          let data = _float.div(res, Math.pow(10, 18));
          if (data >= this.value1) {
            isApproved = true;
          }
          else {
            isApproved = false;
          }
        });
        if (isApproved)
          return resolve();
        let data = {
          name: "approve",
          inputs: [{
            "name": "spender",
            "type": "address"
          }, {
            "name": "amount",
            "type": "uint256"
          }],
          arguments: [
            Eth.contract.contrart_PancakeSwapRouterV2.addr,
            "10000000000000000000000000000000"
          ] // 参数
        };
        // 发起授权
        await contractMethods(this.address, Eth.contract.contrart_ESG.addr, data).then(async (res) => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Toast.ApprovalSuccess, icon: "passed", className: "successToast" });
            resolve();
          }
        }).catch(err => {
          reject();
          console.log("失败 ==>", err.message);
          if (err.code == 110) {
            // 交易拒绝
            Toast({ duration: 3000, message: this.i18n.Toast.networkRejection, icon: "close", className: "fail" });
          }
          else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ duration: 3000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
          }
          else if (err.code == 112) {
            // 交易超时
            Toast({ duration: 3000, message: this.i18n.Toast.TradingTimeOut, icon: "close", className: "fail" });
          }
          else {
            // 失败
            Toast({ duration: 3000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
          }
        });
      });
    },
    async Exchange() {
      if (this.value1 == "" || this.value2 == "" || this.value1 == 0 || this.value2 == 0) {
        Toast({ duration: 2000, message: this.i18n.Trading.ruleNull, icon: "close", className: "fail" });
        return;
      }
      let isApproved = false;
      if (this.isExchange) {
        // 添加 USDT - ESG
        if (this.USDTbalance == 0) {
          Toast({ duration: 2000, message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: "close", className: "fail" });
          return;
        }
        if (Number(this.USDTbalance) < Number(this.value1)) {
          Toast({ duration: 2000, message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: "close", className: "fail" });
          return;
        }
        Toast.loading({
          duration: 0,
          message: this.i18n.Loading,
          forbidClick: true,
        });
        // 验证授权 usdt
        await this.approved().then(async (res) => {
          isApproved = true;
        }).catch(err => {
          Toast({ duration: 3000, message: "USDT" + this.i18n.Toast.ApprovalFail, icon: "close", className: "fail" });
          Toast.clear();
          isApproved = false;
        });
      }
      else {
        // 添加 USDT - ESG
        if (this.ESGbalance == 0) {
          Toast({ duration: 3000, message: "ESG" + this.i18n.BlindBox.ruleBalanceNot, icon: "close", className: "fail" });
          return;
        }
        if (Number(this.ESGbalance) < Number(this.value1)) {
          Toast({ duration: 3000, message: "ESG" + this.i18n.BlindBox.ruleBalanceNot, icon: "close", className: "fail" });
          return;
        }
        Toast.loading({
          duration: 0,
          message: this.i18n.Loading,
          forbidClick: true,
        });
        // 验证授权 esg
        await this.approvedESG().then(async (res) => {
          isApproved = true;
        }).catch(err => {
          Toast({ duration: 3000, message: "ESG" + this.i18n.Toast.ApprovalFail, icon: "close", className: "fail" });
          Toast.clear();
          isApproved = false;
        });
      }
      if (!isApproved)
        return Toast.clear();
      let inpNum = this.vuex_web3.utils.toWei(this.value1 + "", "ether");
      let outMin = 0;
      let addrArr = [];
      if (this.isExchange) {
        addrArr = [Eth.contract.contrart_USDT.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_ESG.addr];
      }
      else {
        addrArr = [Eth.contract.contrart_ESG.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_USDT.addr];
      }
      let timer = parseInt(new Date().getTime() / 1000) + 1200 + "";
      console.log(inpNum, outMin, addrArr, this.address, timer);
      let params = {
        name: "swapExactTokensForTokens",
        inputs: [
          {
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "name": "path",
            "type": "address[]"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "deadline",
            "type": "uint256"
          }
        ],
        arguments: [inpNum, outMin, addrArr, this.address, timer], // 参数
      };
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      await contractMethods(this.address, Eth.contract.contrart_PancakeSwapRouterV2.addr, params, this.isExchange && Number(this.value1) >= 0.1, 3).then(async (res) => {
        if (res.code == 101) {
          Toast.clear();
          Toast({ message: this.i18n.Trading.ExchangeSuc, icon: "passed", className: "successToast" });
          this.value1 = "";
          this.value2 = "";
          setTimeout(async () => {
            this.reload();
          }, 1000);
        }
      }).catch(err => {
        console.log("失败 ==>", err);
        Toast.clear();
        if (err.code == 110) {
          // 交易拒绝
          Toast({ duration: 2000, message: this.i18n.Toast.networkRejection, icon: "close", className: "fail" });
        }
        else if (err.code == 111 || err.code == 113) {
          // 交易失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
        }
        else if (err.code == 112) {
          // 交易超时
          Toast({ duration: 2000, message: this.i18n.Toast.TradingTimeOut, icon: "close", className: "fail" });
        }
        else {
          // 失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: "close", className: "fail" });
        }
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.LuckyPool {
  height: 100%;

  .top {
    padding: 48px 32px 24px 32px;
    box-sizing: border-box;

    .top_box {
      width: 100%;
      height: 65px;

      /deep/ .van-tabs {
        * {
          background-color: transparent;
        }

        .van-tabs__wrap {
          height: 60px;
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
          color: #666666;
          margin-right: 64px;
          font-size: 32px;
          width: auto;
          padding: 0;
          font-weight: bold;
        }

        .van-tab--active {
          color: #333333;
          font-weight: bold;
        }
      }
    }
  }

  .LuckyPool_tab {
    padding: 0 32px 100px 32px;
    width: 100%;
    height: calc(100% - 137px);
    overflow: auto;
    box-sizing: border-box;

    .tab_exchange {
      position: relative;

      .exchange_inp {
        padding: 40px 48px;
        background-color: #fff;
        border-radius: 32px;
        box-shadow: 0px 6px 6px 2px #DCF5ED;

        .balance {
          width: 100%;
          padding: 0 32px 16px 32px;
          box-sizing: border-box;

          span {
            font-size: 24px;
          }

          & span:nth-child(1) {
            color: #999999;
          }

          & span:nth-child(2) {
            text-align: right;
            min-width: 200px;
            color: #333333;
          }

          .question_icon {
            margin-left: 12px;

            img {
              float: right;
              margin-top: 5px;
              width: 26px;
              height: 26px;
            }
          }
        }

        .inp_box_out,
        .inp_box_in {
          width: 100%;
          height: 96px;
          // background: url(../assets/img/nav_l_card.png) no-repeat;
          // background-size: 100% 100%;
          background-color: #F5F5F5;
          border-radius: 24px;
          opacity: 1;
          color: #fff;
          position: relative;

          .choose_box {
            position: absolute;
            right: 30px;
            top: 30px;
            display: flex;
            align-items: center;

            span {
              color: #999999;
              font-size: 34px;
            }

            img {
              width: 40px;
              margin-left: 32px;
            }
          }

          .esg_icon,
          .usdt_icon {
            overflow: hidden;
            position: absolute;
            left: 10px;
            top: 10px;
            width: 190px;
            height: 76px;
            background: #FFFFFF;
            box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.0800);
            border-radius: 24px;

            // display: flex;
            // align-items: center;
            // justify-content: center;
            img {
              width: 64px;
              height: 64px;
              margin-right: 6px;
              margin-top: 6px;
              margin-left: 18px;
              border-radius: 50%;
            }

            span {
              color: #333333 !important;
              display: inline-block;
              height: 76px;
              line-height: 76px;
              font-size: 30px;
            }

            .xia_icon {
              height: 24px;
              width: 24px;
              margin-left: 5px;
              margin-top: 26px;
            }
          }

          /deep/ .van-cell {
            background-color: transparent;
            width: 100%;
            height: 100%;

            .van-field__body {
              height: 100%;
            }

            input {
              width: 100%;
              padding-right: 32px;
              padding-left: 220px;
              text-align: right;
              font-size: 34px;
            }

            &::after {
              display: none;
            }
          }

          .usdt_inp,
          .esg_inp {
            /deep/ input {
              &::-webkit-input-placeholder {
                color: #CCCCCC;
                font-size: 28px;
              }
            }
          }
        }

        .change_status {
          width: 100%;
          height: 68px;
          // margin: 16px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 200px;
          left: 0;
          z-index: 10;

          .change_box {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background-color: #EBFFF8;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              margin-left: 2px;
              height: 42px;
              position: relative;
              z-index: 2;
            }
          }
        }

        .in_box {
          display: inline-block;
          margin-top: 46px;
          overflow: hidden;

          .in_title {
            box-sizing: border-box;
            width: 100%;
            padding-bottom: 16px;
            padding-left: 32px;
            padding-right: 32px;
            font-size: 24px;
            color: #999999;

            & span:nth-of-type(2) {
              color: #333;
              position: relative;
              z-index: 10;
            }

            & span:nth-of-type(3) {
              color: #333;
              position: relative;
              z-index: 10;
            }
          }
        }

        .price_box {
          width: 100%;
          font-size: 24px;
          text-align: center;
          margin: 20px 0 30px 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .price {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              height: 28px;
              margin-left: 10px;
            }
          }
        }

        .exchange_btn {
          font-size: 32px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          line-height: 80px;
          margin-bottom: 62px;

          .confirm_btn {
            width: 590px;
            height: 80px;
            background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
            border-radius: 16px;
          }
        }

        .key_bnb {
          padding: 30px 32px;
          width: 100%;
          box-sizing: border-box;
          border: 2px solid #F5F5F5;
          border-radius: 24px;

          .key {
            font-size: 24px;
            // margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: center;

            .key_left {
              text-align: left;
              display: flex;
              align-items: center;
              margin-right: 20px;

              span {
                color: #999999;
              }

              img {
                height: 30px;
                margin-left: 5px;
              }
            }

            .key_right {
              text-align: right;
            }
          }

          .key:nth-child(2) {
            margin: 0;
          }
        }
      }
    }
  }

  .pool_box {
    width: 100%;
    height: 300px;
    margin-top: 30px;
    background: #fff url('../../assets/svg/pool.svg') center 15px no-repeat;
    background-size: 100% 100%;
    border-radius: 30px;
    box-shadow: 0px 6px 6px 0px #DCF5ED;

    .tabs_box {
      /deep/ .van-tabs {
        .van-tabs__line {
          display: none;
        }

        .van-tabs__nav {
          background: #F5F5F5;
          border-radius: 30px;
        }

        .van-tab {
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
          background-color: #F5F5F5;
          font-weight: normal;
          font-size: 32px;
          // color: #50e2b2;
          color: #00C482;
        }

        .van-tab--active {
          color: #00C482;
          background-color: #fff;
        }
      }

      .pool_item {
        width: 100%;

        .q_box {
          margin-top: 16px;
          padding-right: 48px;

          img {
            width: 26px;
          }
        }

        .total_box {
          display: flex;
          justify-content: center;

          h1 {
            display: inline-block;
            margin: 0;
            font-size: 90px;
            line-height: 180px;
            background: linear-gradient(270deg, #16CB8F 0%, #4A9BF8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          span {
            display: inline-block;
            font-size: 40px;
            margin-left: 10px;
            line-height: 210px;
            background: linear-gradient(270deg, #16CB8F 0%, #4A9BF8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
  }

  .record_box {
    .tabs_box {
      /deep/ .van-tabs {
        .van-tab {
          font-size: 26px;
        }
      }
    }
  }

  .count_down {
    width: 100%;
    height: 248px;
    background: #FFFFFF;
    box-shadow: 0px 6px 6px 0px #DCF5ED;
    border-radius: 30px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .timer_title {
      position: absolute;
      top: 20px;
      left: 0;
      width: 100%;
      padding: 0 48px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        color: #00C482;
        font-size: 28px;
      }

      img {
        margin-left: auto;
        display: inline-block;
        width: 25px;
      }
    }

    .timer_box {
      overflow: hidden;
      display: inline-block;
      height: 100%;
      display: flex;
      align-items: center;

      /deep/ .van-count-down {
        height: 100%;
        color: #13C087;
        display: flex;
        align-items: center;
        font-size: 84px;
        padding-top: 38px;
        box-sizing: border-box;

        .block {
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          border-radius: 23px;
          border: 2px solid #F5F5F5;
          padding: 0 10px;
        }

        .colon {
          margin: 0 10px;
        }
      }
    }
  }

  .record_box {
    background: #FFFFFF;
    height: auto;

    .tips_box {
      width: 100%;
      margin-bottom: 32px;

      .tips_item {
        display: inline-block;
        font-size: 28px;
        color: #13C087;
        height: 50px;
        padding: 0 10px;
        border-radius: 15px;
        border: 2px solid #13C087;
        text-align: center;
        line-height: 50px;
      }
    }

    .record_heard {
      width: 100&;
      margin-bottom: 30px;
      display: flex;
      padding-left: 32px;
      box-sizing: border-box;

      span {
        font-size: 32px;
      }

      span:nth-child(1) {
        flex: 3;
      }

      span:nth-child(2) {
        flex: 4;
      }

      span:nth-child(3) {
        flex: 3;
      }
    }

    .buy_box {
      padding: 30px 48px;
      box-sizing: border-box;

      .null_box {
        font-size: 24px;
        color: #CCCCCC;
        text-align: center;
        margin: 50px auto;
      }

      .buy_item {
        margin-bottom: 20px;
        border-radius: 30px;
        width: 100%;
        height: 96px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;

        .item_time {
          flex: 4;
          text-align: left;
          padding-left: 20px;
        }

        .item_addr {
          flex: 3;
          display: flex;
          align-items: center;

          img {
            margin-left: 6px;
            width: 12px;
          }
        }

        .item_amount {
          flex: 3;
          white-space: nowrap;
        }
      }

      & .buy_item:last-child {
        margin: 0;
      }
    }

    .open_box {
      text-align: left;
      padding: 0;

      .open_top {
        /deep/ .van-tabs {
          width: 100%;
          background-color: transparent;

          .van-tabs__nav {
            padding: 0;
          }

          .van-tabs__nav {
            background-color: transparent;
          }

          .van-tab {
            background-color: transparent;
            color: #666666;
            font-size: 32px;
          }

          .van-tab--active {
            color: #333333;
          }

          .van-tabs__line {
            display: block;
            background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
            border-radius: 4px 4px 4px 4px;
            width: 32px;
            height: 4px;
            bottom: 0;
          }

        }
      }
      .content_main {
        background-color: rgba(#F5FFFC, .5);
        padding: 30px 48px 100px 48px;
      }
      .open_item {
        border-radius: 30px;
        width: 100%;
        height: 96px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        padding-left: 30px;
        box-sizing: border-box;
        margin-bottom: 20px;

        .item_awards {
          flex: 3;
        }

        .item_addr {
          flex: 4;
        }

        .item_amount {
          flex: 3;
        }

        .item_addr {
          img {
            width: 12px;
            margin-left: 6px;
          }
        }
      }

      & .open_item:last-child {
        margin: 0;
      }
    }

    .my_box {
      padding: 30px 48px;
      .record_heard {
        span:nth-child(1) {
          flex: 4;
        }

        span:nth-child(2) {
          flex: 3;
        }

        span:nth-child(3) {
          flex: 3;
        }
      }

      .open_item {
        .item_time {
          flex: 4;
        }

        .item_addr {
          flex: 3;
        }

        .item_amount {
          flex: 3;
        }
      }
    }
  }
}

.content {
  max-height: 800px;
  overflow: auto;

  p {
    margin-bottom: 20px;
  }

  & p:last-child {
    margin: 0;
  }
}

.LuckyPool_hock {
  .inp_pop {
    background-color: $back-qs-hock;
  }

  .top .top_box /deep/ .van-tabs .van-tab {
    color: $text-qqs-hock;
  }

  .top .top_box /deep/ .van-tabs .van-tab--active {
    color: $text-qs-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp {
    background-color: $back-hock;
    box-shadow: none;
  }

  .LuckyPool_tab .tab_exchange .exchange_record {
    background-color: $back-hock;
    box-shadow: none;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .change_status .change_box {
    background-color: $trading-changebg-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .balance span {
    color: $text-999-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .balance span:nth-child(2) {
    color: $text-qs-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in {
    background-color: $back-qs-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .in_box .in_title span:nth-of-type(2) {
    color: $text-qs-hock;
  }

  /deep/ .van-field__control {
    color: $text-666-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in /deep/ .van-cell input,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out /deep/ .van-cell input {
    color: $text-hock;

    &::-webkit-input-placeholder {
      color: $text-666-hock;
    }
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out .usdt_icon,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in .esg_icon {
    background-color: $back-hock;

    span {
      color: $text-qs-hock !important;
    }
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .key_bnb {
    border: 2px solid $trading-border-hock;
    border-radius: 24px;
  }

  .LuckyPool_tab .tab_exchange .exchange_record .record_item .record_detail .record_icon::after {
    background-color: $trading-border-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon {
    background-color: $back-hock;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon span,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon span {
    color: $text-qs-hock !important;
  }

  .record_item .record_detail {
    color: $text-qs-hock;

    .record_icon::after {
      background-color: $trading-border-hock;
    }
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .in_box .in_title {
    & span:nth-of-type(2) {
      color: $text-hock;
    }

    & span:nth-of-type(3) {
      color: $text-hock;
    }
  }

  /deep/ .van-hairline--bottom::after {
    border-bottom-color: $trading-border-hock;
  }

  /deep/ .van-cell {
    background-color: $back-hock;
  }

  /deep/ .van-icon-arrow:before {
    color: $ex-record-icon-hock;
  }

  .record_item .record_detail {
    color: $text-qs-hock;

    .record_icon::after {
      background-color: $trading-border-hock;
    }
  }
  /deep/ .record_box .open_box .open_top .van-tabs {
    color: #CCCCCC;
  }
  /deep/ .record_box .open_box .open_top .van-tabs .van-tab--active {
    color: #fff;
  }
  .record_box .open_box .content_main {
    background-color: rgba(#121917, .5);
  }

  /deep/ .van-collapse-item__content {
    background-color: $back-qs-hock;
  }

  /deep/ .LuckyPool_tab .tab_exchange .exchange_record .record_item .van-collapse-item__wrapper .van-collapse-item__content {
    border-color: $bpos-border-b-hock;
  }

  /deep/ .LuckyPool_tab .tab_exchange .exchange_record .record_item .van-collapse-item__wrapper .van-collapse-item__content .record_ontent .content_item {
    color: $text-qqs-hock;
  }

  /deep/ .LuckyPool_tab .pool_box .tabs_box .van-tabs .van-tab--active {
    background-color: #000D07;
  }

  .pool_box {
    box-shadow: none;
    background-color: #000D07;
  }

  /deep/ .pool_box .tabs_box .van-tabs .van-tabs__nav {
    background-color: #273D39;
  }

  /deep/ .pool_box .tabs_box .van-tabs .van-tab {
    background-color: #273D39;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp {
    background-color: #000D07;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in {
    background-color: #0F1A17;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out .usdt_icon,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in .esg_icon {
    background-color: #000D07;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon,
  .LuckyPool_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon {
    background-color: #000D07;
  }

  .count_down {
    box-shadow: none;
    background: #000D07;
  }

  .count_down .timer_box .van-count-down .block {
    border-color: #27332F;
  }

  .record_box .buy_box .buy_item {
    background-color: #0F1A17;
  }

  .record_box .open_box .open_item {
    background-color: #0F1A17;
  }

  .LuckyPool_tab .tab_exchange .exchange_inp .balance span {
    color: #f1f1f1;
  }

  .LuckyPool_hock .LuckyPool_tab .tab_exchange .exchange_inp .in_box .in_title span:nth-of-type(3) {
    color: #f1f1f1;
  }

}
</style>
