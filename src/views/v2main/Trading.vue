<template>
    <div class="Trading" :class="hock ? 'Trading_hock' : ''">
        <div class="top">
            <div class="top_box f-a-c f-j-sb">
                <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange" :ellipsis="false">
                    <van-tab :title="i18n.Trading.Exchange" name="1"></van-tab>
                    <van-tab :title="i18n.Trading.Mobility" name="2"></van-tab>
                    <van-tab :title="i18n.Trading.Nft" name="3"></van-tab>
                    <!-- <van-tab :title="i18n.Trading.Lucky" name="4"></van-tab> -->
                    <van-tab :title="i18n.Trading.Hash" name="5"></van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="Trading_tab">
            <div class="tab_exchange" v-show="active == '1'">
                <div class="exchange_inp clearfix">
                    <div class="balance fl clearfix">
                        <span class="fl">{{i18n.Trading.Send}}</span>
                        <span class="fr">
                            <!-- <van-skeleton :row="0.5" row-width="100%" :loading="balanceLoad" round> -->
                                <div v-show="isExchange" @click="allBalance">{{i18n.Trading.Balance}}：{{USDTbalance}}</div>
                                <div v-show="!isExchange">{{i18n.Trading.Balance}}：{{holdBalance == 0 ? 0 : Number(holdBalance).toFixed(4)}}</div>
                                <!-- <div>{{i18n.Trading.Balance}}：{{KEYbalance}}</div> -->
                            <!-- </van-skeleton> -->
                        </span>
                    </div>
                    <div class="inp_box_out fl">
                        <van-field class="usdt_inp" v-show="isExchange" v-model="value1" :placeholder="i18n.Trading.OutNums" @blur="usdtInp"/>
                        <van-field class="esg_inp" v-show="!isExchange" v-model="value1" :placeholder="i18n.Trading.OutNums" :readonly="!isExchange"/>
                        <div class="usdt_icon" v-show="isExchange">
                            <img src="../../assets/v2img/usdt_icon.png" alt="" class="fl">
                            <span class="fl">USDT</span>
                        </div>
                        <div class="esg_icon" v-show="!isExchange" @click="showChoose">
                            <img src="../../assets/v2img/esg_icon.png" alt="" class="fl">
                            <span class="fl">ESG</span>
                            <img v-show="!hock" class="fl xia_icon" src="../../assets/v2img/xia_icon.png" alt="">
                            <img v-show="hock" class="fl xia_icon" src="../../assets/v2img/xia_icon_hock.png" alt="">
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
                            <span class="fr" v-show="!isExchange" @click="allBalance">{{i18n.Trading.Balance}}：{{USDTbalance}}</span>
                            <span class="fr" v-show="isExchange">{{i18n.Trading.Balance}}：{{holdBalance == 0 ? 0 : Number(holdBalance).toFixed(4)}}</span>
                        </div>
                        <div class="inp_box_in">
                            <van-field class="usdt_inp" v-show="!isExchange" v-model="value2" :placeholder="i18n.Trading.InNums" @blur="usdtInp" :readonly="!isExchange"/>
                            <van-field class="esg_inp" v-show="isExchange" v-model="value2" :placeholder="i18n.Trading.InNums" @blur="esgInp"/>
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
                        <div class="confirm_btn" @click="openInvite">{{i18n.Trading.ExchangeBtn}}</div>
                    </div>
                    <div class="key_bnb fl">
                        <!-- <div class="key clearfix">
                            <div class="key_left fl">
                                <span>KEY {{i18n.Trading.Value}}</span>
                            </div>
                            <div class="key_right fr">
                                <span>{{KEYbalance}} KEY</span>
                            </div>
                        </div> -->
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
                <div class="exchange_record">
                    <div class="record_top clearfix">
                        <span class="fl">{{i18n.Trading.RecentRecord}}</span>
                        <span class="fr" @click="toMove">{{i18n.Trading.MoveRecord}}</span>
                    </div>
                    <div class="null_box" v-if="allData.length == 0">
                        <span>Null</span>
                    </div>
                    <div class="record_item" v-if="allData.length != 0">
                        <van-collapse v-model="activeName" accordion>
                            <van-collapse-item :name="index" v-for="(item, index) in allDataOne" :key="index">
                                <template #title>
                                    <div>
                                        <div class="record_data clearfix">
                                            <span class="mairu fl" v-show="item.type == 'buy'">{{i18n.Trading.Buy}}</span>
                                            <span class="maichu fl" v-show="item.type == 'sell'">{{i18n.Trading.SellOut}}</span>
                                            <span class="date fl">{{item.ts}}</span>
                                        </div>
                                        <div class="record_detail">
                                            <div class="record_usdt">
                                                <div class="icon_usdt">
                                                    <img v-if="item.type == 'buy'" src="../../assets/v2img/usdt_icon.png" alt="">
                                                    <img v-else src="../../assets/v2img/esg_icon.png" alt="">
                                                    <span v-if="item.type == 'buy'">USDT</span>
                                                    <span v-else>ESG</span>
                                                </div>
                                                <span v-if="item.type == 'buy'">{{Number(item.usdt_amount).toFixed(4)}}</span>
                                                <span v-else>{{Number(item.esg_amount).toFixed(4)}}</span>
                                            </div>
                                            <div class="record_icon">
                                                <img v-show="!hock" src="../../assets/v2img/you_icons.png" alt="">
                                                <img v-show="hock" src="../../assets/v2img/you_icons_hock.png" alt="">
                                            </div>
                                            <div class="record_esg">
                                                <div class="icon_usdt">
                                                    <img v-if="item.type == 'buy'" src="../../assets/v2img/esg_icon.png" alt="">
                                                    <img v-else src="../../assets/v2img/usdt_icon.png" alt="">
                                                    <span v-if="item.type == 'buy'">ESG</span>
                                                    <span v-else>USDT</span>
                                                </div>
                                                <span v-if="item.type == 'buy'">{{Number(item.esg_amount).toFixed(4)}}</span>
                                                <span v-else>{{Number(item.usdt_amount).toFixed(4)}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="record_ontent">
                                    <div class="content_item clearfix">
                                        <span class="fl">{{i18n.ExchangeRecord.SoldPrice}}（USDT）</span>
                                        <span class="fr">{{Number(item.price).toFixed(4)}}</span>
                                    </div>
                                    <div class="content_item clearfix">
                                        <span class="fl">{{i18n.ExchangeRecord.SoldNumber}}（ESG）</span>
                                        <span class="fr">{{Number(item.esg_amount).toFixed(4)}}</span>
                                    </div>
                                    <div class="content_item clearfix">
                                        <span class="fl">{{i18n.ExchangeRecord.SoldAmount}}（USDT）</span>
                                        <span class="fr">{{Number(item.usdt_amount).toFixed(4)}}</span>
                                    </div>
                                    <div class="content_item clearfix">
                                        <span class="fl">{{i18n.ExchangeRecord.HandlingFee}}（ESG）</span>
                                        <span class="fr" v-show="item.type == 'buy'">{{Number(item.esg_amount / 19).toFixed(4)}}</span>
                                        <span class="fr" v-show="item.type == 'sell'">0</span>
                                    </div>
                                    <!-- <div class="content_item clearfix">
                                        <span class="fl">{{i18n.ExchangeRecord.Final}}（ESG）</span>
                                        <span class="fr">{{Number(item.esg_amount - (item.esg_amount / 19))}}</span>
                                    </div> -->
                                </div>
                            </van-collapse-item>
                        </van-collapse>
                        <!-- <div class="record_data clearfix">
                            <span class="mairu fl" v-show="allData[0].type == 'buy'">{{i18n.Trading.Buy}}</span>
                            <span class="maichu fl" v-show="allData[0].type == 'sell'">{{i18n.Trading.SellOut}}</span>
                            <span class="date fl">{{allData[0].ts}}</span>
                            <img v-show="!hock" class="fr" src="../../assets/v2img/you_icon.png" alt="">
                            <img v-show="hock" class="fr" src="../../assets/v2img/you_icon_hock.png" alt="">
                        </div>
                        <div class="record_detail">
                            <div class="record_usdt">
                                <div class="icon_usdt">
                                    <img src="../../assets/v2img/usdt_icon.png" alt="">
                                    <span>USDT</span>
                                </div>
                                <span>{{Number(allData[0].usdt_amount).toFixed(4)}}</span>
                            </div>
                            <div class="record_icon">
                                <img v-show="!hock" src="../../assets/v2img/you_icons.png" alt="">
                                <img v-show="hock" class="fr" src="../../assets/v2img/you_icons_hock.png" alt="">
                            </div>
                            <div class="record_esg">
                                <div class="icon_usdt">
                                    <img src="../../assets/v2img/esg_icon.png" alt="">
                                    <span>ESG</span>
                                </div>
                                <span>{{Number(allData[0].esg_amount).toFixed(4)}}</span>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="showInp" position="center">
            <div class="inp_pop f-d-c f-a-c">
                <img class="close_btn" v-if="!hock" src="../../assets/v2img/cha_icon.png" alt="" @click="showInp = false">
                <img class="close_btn" v-if="hock" src="../../assets/v2img/cha_icon_hock.png" alt="" @click="showInp = false">
                <div class="inp_titile">{{i18n.Trading.BindInviter}}</div>
                <div class="inp_group">
                    <textarea v-model="inviteAddr" :placeholder="i18n.BlindBox.InviterPlc"></textarea>
                </div>
                <div class="confirm_btn f-j-a-c" @click="addrRule">{{i18n.BlindBox.Confirm}}</div>
            </div>
        </van-popup>
        <hold v-show="isShowHold" :isShowHold="isShowHold" :holdList="actions" @chooseItem="setChooseItem" @closeHode="closeHode"></hold>
    </div>
</template>

<script>
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
import Hold from '@/components/popup/Hold';
import { contractMethods, HandlingFees, GetHistoryBuyEsg, GetEsgPrice, GetBposUserInfos, GetTransactionStatus } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    inject: ["reloadMain", 'reload'],
    name: 'Trading',
    data() {
        return {
            activeName: '1',
            active: '1', // tabs
            balanceLoad: true, // 余额骨架
            holdBalance: '', // 持仓余额
            USDTbalance: 0, // usdt
            KEYbalance: 0, // usdt
            ESGbalance: 0, // ESG
            isExchange: true, // 买入 or 转出
            value1: '', // inp1
            value2: '', // inp2
            ratioA: 0, // BNB - USDT
            ratioB: 0, // BNB - ESG
            ratioUsdtEsg: 0, // USDT - ESG
            ratioEsgUsdt: 0, // esg - usdt
            actions: [], // 移除持仓选项
            allData: [], // 所有数据
            allDataOne: [], // 最新一条
            allDataMairu: [], // 所有卖入
            allDataMaichu: [], // 所有卖出
            chooseItem: null, // 选择项
            isReferrer: false, // 是否推荐人地址
            inviteAddr: '', // 邀请人地址
            showInp: false, // 输入推荐人
            valueBai: 3, // 容差
            gasFee: 0, // gas 费
            recordData: [],
            isShowHold: false, // 持仓弹窗
            priceNowOld: [], // 价格 当前 / 昨天
            isHashWhite: false, // 是否hash白名单
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    components: {
        Hold
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
                await this.getHoldList()
            } catch (error) {
                console.log("Tranding err ==>", error)
                // this.reload()
            }
            Toast.clear()
            this.getReferrer(this.address)
            this.getRatio()
            this.getBalanceUsdt()
            this.getBalanceKey()
            this.getNewRecord()
            // this.getHashWhite()
        })
    },
    methods: {
        ...mapMutations(['setHoldRecordData', 'setRedioPrice']),
        // 是否hash白名单
        async getHashWhite() {
          // isHashWhite
          this.isHashWhite = await this.vuex_myContract.contract_HashCollision.methods.IsWhiteList(this.address).call()
        },
        // 更多记录
        toMove() {
            if (this.allData.length == 0) {
                return
            }
            this.$router.push({name: 'ExchangeRecord', query: {type: 1}, params: {data: this.allData}})
        },
        // 选择持仓
        setChooseItem(item) {
            this.chooseItem = item
            console.log("chooseItem ==>", this.chooseItem)
            this.value1 = Number(item.esg_amount).toFixed(4)
            this.value2 = Number(_float.mul(this.ratioUsdtEsg, item.esg_amount)).toFixed(4)
        },
        closeHode() {
            this.isShowHold = false
        },
        // tabs 跳转前
        async beforeTabsChange(index) {
            if (index == 1) {
                this.$router.push({path: 'Trading'})
            } else if (index == 2) {
                // Toast({ message: this.i18n.Trading.Dev, icon: 'close', className: 'fail' });
                // return
                this.$router.push({path: 'Mobility'})
            } else if (index == 3) {
                this.$router.push({path: 'NFTexchange'})
            } else if (index == 4) {
                this.$router.push({path: 'LuckyPool'})
            } else if (index == 5) {
              // if (!this.isHashWhite) {
              //   Toast({ message: this.i18n.HashBump.NoWhite, icon: 'close', className: 'fail' });
              //   return
              // }
              this.$router.push({ path: 'HashBump' })
            }
            return false;
        },

        // 切换
        tabsChange(index) {

        },
        // 所有余额
        allBalance() {
            if (this.isExchange) {
                this.value1 = this.USDTbalance
                this.value2 = (this.value1 / this.ratioUsdtEsg).toFixed(4) == 0 ? '' : (this.value1 / this.ratioUsdtEsg).toFixed(4)
            }
        },
        // 获取余额 - usdt
        async getBalanceUsdt() {
            this.vuex_myContract.contrart_USDT.methods.balanceOf(this.address).call().then(res => {
                if (res != 0) {
                    this.$nextTick(() => {
                        this.USDTbalance = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
                    })
                }
                this.balanceLoad = false
            })
            let infoData = await GetBposUserInfos({addr: this.address})
            this.holdBalance = this.vuex_web3.utils.fromWei(_tools.interceptFloat(infoData.data.personal_totalesg), 'ether')
        },
        // 获取余额 - esg
        getBalanceESG() {
            // this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
            //     console.log(res)
            //     if (res != 0) {
            //         this.ESGbalance = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
            //     }
            // })
        },
        // 获取余额 - key
        getBalanceKey() {
            this.vuex_myContract.contrart_Key.methods.balanceOf(this.address).call().then(res => {
                if (res != 0) {
                    this.$nextTick(() => {
                        this.KEYbalance = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
                        this.balanceLoad = false
                    })
                }
            })
        },
        // 获取汇率
        async getRatio() {
            // await this.vuex_myContract.contrart_BnbUsdt.methods.getReserves().call().then(res => {
            //     let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
            //     let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
            //     this.ratioA = _tools.formatDecimal(ratioA / ratioB, 4)
            // })
            // await this.vuex_myContract.contrart_BnbEsg.methods.getReserves().call().then(res => {
            //     let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
            //     let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
            //     this.ratioB = _tools.formatDecimal(ratioA / ratioB, 4)
            // })

            // this.ratioUsdtEsg = _tools.formatDecimal(this.ratioA * this.ratioB, 9)
            // this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9)
            let data = await GetEsgPrice({})
            let price = data.data
            this.priceNowOld = price
            this.ratioUsdtEsg = price[0]
            this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9)
            // this.setRedioPrice([this.ratioUsdtEsg, this.ratioEsgUsdt])
        },

        // 刷新汇率
        async resetRatio() {
            Toast.loading({
                duration: 30000,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            await this.getRatio()
            if (this.isExchange) {
                // this.value2 = _float.mul(this.value1, this.ratioUsdtEsg)
                this.value1 = ''
                this.value2 = ''
            } else {
                this.value2 = Number(_float.mul(this.ratioUsdtEsg, this.value1)).toFixed(4) == 0 ? '' : Number(_float.mul(this.ratioUsdtEsg, this.value1)).toFixed(4)
            }
            Toast.clear();
        },

        // 输入USDT
        usdtInp() {
            if (this.value1 == '') return this.value2 = ''
            if (this.isExchange) {
                this.value2 = (this.value1 / this.ratioUsdtEsg).toFixed(4) == 0 ? '' : (this.value1 / this.ratioUsdtEsg).toFixed(4)
            }
            this.gasFee = _float.mul(this.value2, 0.05)
            // this.gasPriceAmount()
        },
        // 输入esg
        esgInp() {
            if (this.value2 == '') return this.value1 = ''
            if (this.isExchange) {
                this.value1 = _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4) == 0 ? '' : _float.mul(this.value2, this.ratioUsdtEsg).toFixed(4)
            }
            this.gasFee = _float.mul(this.value2, 0.05)
            // this.gasPriceAmount()
        },
        // 是否打开选择持仓
        showChoose() {
            if (!this.isExchange) {
                if (this.actions.length == 0) {
                    Toast({duration: 2000, message: this.i18n.EsgExchange.PositioningNo, icon: 'close', className: 'fail'})
                } else {
                    this.isShowHold = true
                }
            }
        },
        // 获取最新一条记录
        async getNewRecord() {
            let params = {
                addr: this.address,
                status: '',
                recordType: '',
                Desc: true
            }
            let recordList = await GetHistoryBuyEsg({...params})
            let data = recordList.data
            let arr = []
            data.map(v => {
                let obj = {
                    ts: '',
                    usdt_amount: '',
                    esg_amount: '',
                    is_team: false,
                    chain_record_idx: '',
                    type: v.type,
                    price: v.price,
                    handlingFees: ''
                }
                // getMDHM
                obj.ts = _date.getMDHM(v.ts * 1000)
                obj.usdt_amount = this.vuex_web3.utils.fromWei(v.usdt_amount, 'ether')
                obj.esg_amount = this.vuex_web3.utils.fromWei(v.esg_amount, 'ether')
                obj.handlingFees = _float.mul(obj.esg_amount, 0.05)
                obj.is_team = v.is_team == 1 ? true : false
                obj.chain_record_idx = v.chain_record_idx
                arr.push(obj)
            })
            this.$nextTick(() => {
                this.allDataOne = [arr[0]]
            })
        },

        // 获取持仓列表
        async getHoldList() {
            this.allData = []
            this.allDataMairu = []
            this.allDataMaichu = []
            this.actions = []
            this.ESGbalance = 0
            this.chooseItem = null

            let params = {
                addr: this.address,
                status: '',
                recordType: '',
                Desc: true
            }
            let recordList = await GetHistoryBuyEsg({...params})
            let data = recordList.data
            this.recordData = data
            data.map(v => {
                let obj = {
                    ts: '',
                    usdt_amount: '',
                    esg_amount: '',
                    is_team: false,
                    chain_record_idx: '',
                    type: v.type,
                    price: v.price,
                    status: v.status,
                    handlingFees: ''
                }
                // getMDHM
                obj.ts = _date.getMDHM(v.ts * 1000)
                obj.usdt_amount = this.vuex_web3.utils.fromWei(v.usdt_amount, 'ether')
                obj.esg_amount = this.vuex_web3.utils.fromWei(v.esg_amount, 'ether')
                obj.handlingFees = _float.mul(obj.esg_amount, 0.05)
                obj.is_team = v.is_team == 1 ? true : false
                obj.chain_record_idx = v.chain_record_idx
                this.allData.push(obj)
            })
            this.allDataOne = [this.allData[0]]
            this.allData.sort(this.objectSort("chain_record_idx"))
            this.allData.map(v => {
                if (v.is_team && v.status == 'jinxingzhong') {
                    this.actions.unshift(v)
                } else if (v.status == 'jinxingzhong'){
                    this.actions.push(v)
                }
            })
            this.setHoldRecordData(this.allData)
        },
        objectSort(property) {
            return function (Obj1,Obj2) {
                return Obj1[property]-Obj2[property]
            }
        },
        // 改变交换状态
        changeStatus() {
            this.value1 = ''
            this.value2 = ''
            this.isExchange = !this.isExchange;
        },

        // 授权 - USDT
        async approved() {
            return new Promise(async (resolve, reject) => {

                // 查询授权
                let isApproved = false
                await this.vuex_myContract.contrart_USDT.methods.allowance(this.address, Eth.contract.contrart_BuyStaker.addr).call().then(res => {
                    console.log("approve usdt==>", res)
                    let data = _float.div(res, Math.pow(10, 18))
                    if (data >= this.value1) {
                        isApproved = true
                    } else {
                        isApproved = false
                    }
                })

                if (isApproved) return resolve()

                let data = {
                    name: 'approve', // 方法名
                    inputs: [{
                        "name": "spender",
                        "type": "address"
                    },{
                        "name": "amount",
                        "type": "uint256"
                    }],
                    arguments: [
                        Eth.contract.contrart_BuyStaker.addr,
                        '10000000000000000000000000000000'
                    ] // 参数
                }

                // 发起授权
                await contractMethods(this.address, Eth.contract.contrart_USDT.addr, data).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Toast.ApprovalSuccess, icon: 'passed', className: 'successToast' });
                        resolve()
                    }
                }).catch(err => {
                    reject()
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

            })
        },
        // 授权 - Key
        async approvedKey() {
            return new Promise(async (resolve, reject) => {

                // 查询授权
                let isApproved = false
                await this.vuex_myContract.contrart_Key.methods.allowance(this.address, Eth.contract.contrart_BuyStaker.addr).call().then(res => {
                    console.log("approve key==>", res)
                    let data = _float.div(res, Math.pow(10, 18))
                    if (data >= this.value1) {
                        isApproved = true
                    } else {
                        isApproved = false
                    }
                })

                if (isApproved) return resolve()

                let data = {
                    name: 'approve', // 方法名
                    inputs: [{
                        "name": "spender",
                        "type": "address"
                    },{
                        "name": "amount",
                        "type": "uint256"
                    }],
                    arguments: [
                        Eth.contract.contrart_BuyStaker.addr,
                        '10000000000000000000000000000000'
                    ] // 参数
                }

                // 发起授权
                await contractMethods(this.address, Eth.contract.contrart_Key.addr, data).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Toast.ApprovalSuccess, icon: 'passed', className: 'successToast' });
                        resolve()
                    }
                }).catch(err => {
                    reject()
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

            })
        },

        // 判断本人地址是否有推荐人 / 是否是合法推荐人地址
        async getReferrer(accounts) {
            // 查询推荐人
            let addr = ''
            await this.vuex_myContract.contrart_BuyStaker.methods.RecommendOf(accounts).call().then(res => {
                if (res == '0x0000000000000000000000000000000000000000') {
                    // 无推荐人
                    this.isReferrer = false
                } else {
                    this.isReferrer = true
                    this.inviteAddr = res
                    addr = res
                }
            })
        },

        // 判断该地址是否有推荐人 / 是否是合法推荐人地址
        async getReferrerRule(accounts) {
            // 查询推荐人
            await this.vuex_myContract.contrart_BuyStaker.methods.RecommendOf(accounts).call().then(res => {
                if (res == '0x0000000000000000000000000000000000000000') {
                    // 无推荐人
                    this.isReferrer = false
                } else {
                    this.isReferrer = true
                }
            })
        },

        // 打开邀请人弹窗
        openInvite() {
            if (this.value1 == '' || this.value2 == '' || this.value1 == 0 || this.value2 == 0) {
                Toast({duration: 2000, message: this.i18n.Trading.ruleNull, icon: 'close', className: 'fail'})
                return
            }
            if (!this.isReferrer && this.isExchange) {
                // 无推荐人则填写推荐人
                this.showInp = true;
            } else {
                // 已有推荐人 直接发起购买
                this.Exchange()
            }
        },

        // 验证邀请人
        async addrRule() {
            if (!this.inviteAddr) return Toast({ duration: 2000, message: this.i18n.BlindBox.InviterPlc, icon: 'close', className: 'fail' });

            // 验证以太坊地址合法性
            let isAddr = await this.vuex_web3.utils.isAddress(this.inviteAddr)

            await this.getReferrerRule(this.inviteAddr)

            if (!this.isReferrer) {
                Toast({ duration: 2000, message: this.i18n.EsgExchange.isReferrerAddr, icon: 'close', className: 'fail' });
                return
            }

            // return
            if (!isAddr) {
                return Toast({ duration: 2000, message: this.i18n.BlindBox.ruleAddr, icon: 'close', className: 'fail' });
            } else {
                this.showInp = false;
                this.Exchange()
            }
        },
        // 预估gas
        async gasPriceAmount () {
            if (this.isExchange) {
                // 添加 USDT - ESG
                if (this.USDTbalance == 0) return

                if (Number(this.USDTbalance) < Number(this.value1)) return

                if (this.KEYbalance == 0) return

                if (Number(this.KEYbalance) < Number(this.value1)) return
                // 参数
                let esgNum = this.vuex_web3.utils.toWei(this.value2 + '', 'ether')
                let usdtNum = this.vuex_web3.utils.toWei(Number(this.value1) + this.value1 * (this.valueBai / 100) + '', 'ether')
                let addrArr = [Eth.contract.contrart_USDT.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_ESG.addr]
                let timer = parseInt(new Date().getTime() / 1000) + 1200 + ''
                console.log(esgNum, usdtNum, addrArr, timer)
                // return
                let params = {
                    name: 'swapTokensForExactTokens', // 方法名
                    inputs: [{
                        "name": "amountOut",
                        "type": "uint256"
                    },{
                        "name": "amountInMax",
                        "type": "uint256"
                    },{
                        "name": "path",
                        "type": "address[]"
                    },{
                        "name": "to",
                        "type": "address"
                    },{
                        "name": "deadline",
                        "type": "uint256"
                    },{
                        "name": "_recommend",
                        "type": "address"
                    }],
                    arguments: [esgNum, usdtNum, addrArr, this.address, timer, this.inviteAddr], // 参数
                }
                console.log(params)
                HandlingFees(this.address, Eth.contract.contrart_BuyStaker.addr, params).then(async res => {
                    if (res.code == 101) {
                        this.gasFee = this.vuex_web3.utils.fromWei(res.message + '', 'ether')
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        // 交换
        async Exchange() {
            if (this.isExchange) {
                // 停止参与提示
                // Toast({ duration: 2000, message: "KEY" + this.i18n.BlindBox.ruleBalanceNot, icon: 'close', className: 'fail' })
                Toast({ duration: 2000, message: "Come soon", icon: 'close', className: 'fail' })
                return
                // 添加 USDT - ESG
                if (this.USDTbalance == 0) {
                    Toast({ duration: 2000, message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: 'close', className: 'fail' })
                    return
                }

                if (Number(this.USDTbalance) < Number(this.value1)) {
                    Toast({ duration: 2000, message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: 'close', className: 'fail' })
                    return
                }

                if (this.KEYbalance == 0) {
                    Toast({ duration: 2000, message: "KEY" + this.i18n.BlindBox.ruleBalanceNot, icon: 'close', className: 'fail' })
                    return
                }

                if (Number(this.KEYbalance) < Number(this.value1)) {
                    Toast({ duration: 2000, message: "KEY" + this.i18n.BlindBox.ruleBalanceNot, icon: 'close', className: 'fail' })
                    return
                }

                Toast.loading({
                    duration: 0,
                    message: this.i18n.Loading,
                    forbidClick: true,
                });
                let isUsdt = false
                // 验证授权 usdt
                await this.approved().then(async (res) => {
                    isUsdt = true
                }).catch(err => {
                    Toast({ duration: 2000, message: "USDT" + this.i18n.Toast.ApprovalFail, icon: 'close', className: 'fail' });
                    Toast.clear();
                    isUsdt = false
                })

                if (!isUsdt) return

                Toast.loading({
                    duration: 0,
                    message: this.i18n.Loading,
                    forbidClick: true,
                });

                // 验证授权 key
                await this.approvedKey().then(async (res) => {
                    setTimeout(async () => {
                        // 参数
                        let esgNum = this.vuex_web3.utils.toWei(this.value2 + '', 'ether')
                        let usdtNum = this.vuex_web3.utils.toWei(this.value1 + '', 'ether')
                        let addrArr = [Eth.contract.contrart_USDT.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_ESG.addr]
                        let timer = parseInt(new Date().getTime() / 1000) + 1200 + ''
                        console.log(esgNum, usdtNum, addrArr, timer)
                        // return
                        let params = {
                            name: 'swapTokensForExactTokens', // 方法名
                            inputs: [{
                                "name": "amountOut",
                                "type": "uint256"
                            },{
                                "name": "amountInMax",
                                "type": "uint256"
                            },{
                                "name": "path",
                                "type": "address[]"
                            },{
                                "name": "to",
                                "type": "address"
                            },{
                                "name": "deadline",
                                "type": "uint256"
                            },{
                                "name": "_recommend",
                                "type": "address"
                            }],
                            arguments: [esgNum, usdtNum, addrArr, this.address, timer, this.inviteAddr], // 参数
                        }

                        await contractMethods(this.address, Eth.contract.contrart_BuyStaker.addr, params, true).then(async res => {
                            if (res.code == 101) {
                                Toast.clear();
                                Toast({ message: this.i18n.Trading.ExchangeSuc, icon: 'passed', className: 'successToast' });
                                this.value1 = ''
                                this.value2 = ''
                                this.showInp = false
                                setTimeout(() => {
                                    this.reload()
                                }, 1000);
                            }
                        }).catch(err => {
                            console.log('失败 ==>', err.message)
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
                    }, 2000);
                }).catch(err => {
                    Toast({ duration: 2000, message: "KEY" + this.i18n.Toast.ApprovalFail, icon: 'close', className: 'fail' });
                    Toast.clear();
                })


            } else {
                if (this.chooseItem.chain_record_idx == undefined) {
                    Toast({ duration: 2000, message: this.i18n.EsgExchange.ChooseNull, icon: 'close', className: 'fail' });
                    return
                }

                // 参数
                let idx = this.chooseItem.chain_record_idx
                let usdtNum = this.vuex_web3.utils.toWei(this.value1 + '', 'ether')
                let addrArr = [Eth.contract.contrart_ESG.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_USDT.addr]
                let isTeam = this.chooseItem.is_team
                let timer = parseInt(new Date().getTime() / 1000) + 1200 + ''
                console.log(idx, usdtNum, addrArr, timer, isTeam)
                // 移仓
                Toast.loading({
                    duration: 0,
                    message: this.i18n.Loading,
                    forbidClick: true,
                });

                let params = {
                    name: 'swapExactTokensForTokens', // 方法名
                    inputs: [{
                        "name": "idx",
                        "type": "uint256"
                    },{
                        "name": "amountOutMin",
                        "type": "uint256"
                    },{
                        "name": "path",
                        "type": "address[]"
                    },{
                        "name": "to",
                        "type": "address"
                    },{
                        "name": "deadline",
                        "type": "uint256"
                    },{
                        "name": "_team",
                        "type": "bool"
                    }],
                    arguments: [idx, usdtNum, addrArr, this.address, timer, isTeam], // 参数
                }

                await contractMethods(this.address, Eth.contract.contrart_BuyStaker.addr, params, true).then(async res => {
                    if (res.code == 101) {
                        Toast.clear();
                        Toast({ message: this.i18n.Trading.RemoveSuc, icon: 'passed', className: 'successToast' });
                        this.value1 = ''
                        this.value2 = ''
                        setTimeout(async () => {
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
            }


        }
    }
}
</script>

<style lang="scss" scoped>
.Trading {
    height: 100%;
    .top {
        padding: 48px 32px 24px 32px;
        box-sizing: border-box;
        .top_box {
            width: 100%;
            height: 65px;

            /deep/ .van-tabs {
                *{
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
    .Trading_tab {
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
                }
                .inp_box_out, .inp_box_in {
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
                    .esg_icon, .usdt_icon {
                        overflow: hidden;
                        position: absolute;
                        left: 10px;
                        top: 10px;
                        width: 190px;
                        height: 76px;
                        background: #FFFFFF;
                        box-shadow: 0px 6px 12px 2px rgba(0,0,0,0.0800);
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
                    .usdt_inp, .esg_inp {
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
                        }
                        & span:nth-of-type(3) {
                            color: #333;
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
                    .key:nth-child(2){
                        margin: 0;
                    }
                }
            }
            .exchange_record {
                width: 100%;
                padding: 32px;
                box-sizing: border-box;
                background: #FFFFFF;
                box-shadow: 0px 6px 4px 2px #DCF5ED;
                border-radius: 32px;
                margin-top: 32px;
                .record_top {
                    width: 100%;
                    margin-bottom: 32px;
                    span {
                        font-size: 28px;
                    }
                    & span:nth-child(2) {
                        color: #999999;
                    }
                }
                .record_item {

                    /deep/ .van-collapse-item__title--expanded{
                        .van-cell__right-icon::before {
                            transform: rotate(90deg) translateZ(0) !important;
                        }
                    }
                    /deep/ .van-icon-arrow:before {
                        color: #333;
                        font-weight: bold;
                        transform: rotate(0) translateZ(0);
                    }
                    /deep/ .van-cell {
                        padding: 0;
                    }
                    /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
                        border: none;
                    }
                    /deep/ .van-collapse-item__title--expanded::after {
                        display: none;
                    }
                    .record_data {
                        margin-bottom: 12px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        span {
                            font-size: 28px;
                        }
                        .mairu {
                            color: #13C087;
                        }
                        .maichu {
                            color: #E52E2E;
                        }
                        .date {
                            font-size: 20px;
                            color: #999999;
                            margin-left: 8px;
                        }
                        img {
                            margin-left: auto;
                            height: 32px;
                            margin-right: -10px;
                        }
                    }
                    .record_detail {
                        display: flex;
                        .record_usdt {
                            margin-right: auto;
                            font-size: 24px;
                            .icon_usdt {
                                display: flex;
                                align-items: center;
                                font-size: 24px;
                                margin-bottom: 5px;
                                img {
                                    height: 36px;
                                    margin-right: 8px;
                                }
                            }
                        }
                        .record_icon {
                            margin: auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            img {
                                height: 14px;
                            }
                            &::after {
                                content: '';
                                display: block;
                                width: 160px;
                                height: 2px;
                                background-color: #EDEDED;
                                position: absolute;
                                top: 50%;
                                left: -80px;
                                margin-top: -1px;
                            }
                        }
                        .record_esg {
                            margin-left: auto;
                            font-size: 24px;
                            text-align: right;
                            .icon_usdt {
                                display: flex;
                                align-items: center;
                                font-size: 24px;
                                margin-bottom: 5px;
                                img {
                                    height: 36px;
                                    margin-right: 8px;
                                }
                            }
                        }
                    }
                    /deep/ .van-collapse-item__wrapper {
                        .van-collapse-item__content {
                            padding: 24px;
                            // height: 204px;
                            border-radius: 24px;
                            border: 2px solid #F5F5F5;
                            .record_ontent {
                                width: 100%;
                                .content_item {
                                    color: #333;
                                    margin-bottom: 14px;
                                    span {
                                        font-size: 24px;
                                    }
                                    & span:nth-child(1) {
                                        color: #999999;
                                    }
                                }
                                & .content_item:last-child {
                                    margin: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
/deep/ .van-popup {
    background-color: transparent;
}
.inp_pop {
    width: 650px;
    height: 488px;
    background: #FFFFFF;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    .inp_titile {
        font-size: 36px;
        font-weight: 600;
        padding: 52px 0 48px;
    }

    .inp_group {
        width: 530px;
        height: 142px;
        border-radius: 16px;
        padding: 24px;
        border: 2px solid #13C087;
        box-sizing: border-box;
        margin-bottom: 60px;

        textarea {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            font-size: 28px;
            text-align: start;
            border: none;
            outline: none;
            resize: none;
            &::-webkit-input-placeholder {
                color: #CCCCCC;
            }
        }
    }

    .confirm_btn {
        font-size: 32px;
        font-weight: 600;
        box-sizing: border-box;
        width: 322px;
        height: 72px;
        color: #fff;
        background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
        border-radius:16px;
    }
    .close_btn {
        display: block;
        position: absolute;
        top: 30px;
        right: 30px;
        width: 40px;
        height: 40px;
        // background: url(../../assets/v2img/cha_icon.png);
        // background-size: 100% 100%;
    }
}

.Trading_hock {
    .inp_pop {
        background-color: $back-qs-hock;
    }
    .top .top_box /deep/ .van-tabs .van-tab {
         color: $text-qqs-hock;
    }
    .top .top_box /deep/ .van-tabs .van-tab--active {
        color: $text-qs-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp {
        background-color: $back-hock;
        box-shadow: none;
    }
    .Trading_tab .tab_exchange .exchange_record {
        background-color: $back-hock;
        box-shadow: none;
    }
    .Trading_tab .tab_exchange .exchange_inp .change_status .change_box {
        background-color: $trading-changebg-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .balance span {
        color: $text-999-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .balance span:nth-child(2) {
        color: $text-qs-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .inp_box_out,.Trading_tab .tab_exchange .exchange_inp .inp_box_in {
        background-color: $back-qs-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .in_box .in_title span:nth-of-type(2) {
        color: $text-qs-hock;
    }
    /deep/ .van-field__control {
        color: $text-666-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .inp_box_in /deep/ .van-cell input, .Trading_tab .tab_exchange .exchange_inp .inp_box_out /deep/ .van-cell input {
        color: $text-hock;
        &::-webkit-input-placeholder {
            color: $text-666-hock;
        }
    }
    .Trading_tab .tab_exchange .exchange_inp .inp_box_out .usdt_icon, .Trading_tab .tab_exchange .exchange_inp .inp_box_in .esg_icon {
        background-color: $back-hock;
        span {
            color: $text-qs-hock !important;
        }
    }
    .Trading_tab .tab_exchange .exchange_inp .key_bnb {
        border: 2px solid $trading-border-hock;
        border-radius: 24px;
    }
    .Trading_tab .tab_exchange .exchange_record .record_item .record_detail .record_icon::after {
        background-color: $trading-border-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon, .Trading_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon {
        background-color: $back-hock;
    }
    .Trading_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon span, .Trading_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon span {
        color: $text-qs-hock !important;
    }
    .record_item .record_detail {
        color: $text-qs-hock;
        .record_icon::after {
            background-color: $trading-border-hock;
        }
    }
    .Trading_tab .tab_exchange .exchange_inp .in_box .in_title {
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
    /deep/ .van-collapse-item__content {
        background-color: $back-qs-hock;
    }
    /deep/ .Trading_tab .tab_exchange .exchange_record .record_item .van-collapse-item__wrapper .van-collapse-item__content {
        border-color: $bpos-border-b-hock;
    }
    /deep/ .Trading_tab .tab_exchange .exchange_record .record_item .van-collapse-item__wrapper .van-collapse-item__content .record_ontent .content_item {
        color: $text-qqs-hock;
    }
}
</style>
