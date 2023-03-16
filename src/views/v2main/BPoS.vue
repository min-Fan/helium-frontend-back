<template>
    <div class="BPoS" :class="hock ? 'BPoS_hock':''">
        <div class="top">
            <div class="top_box f-a-c f-j-sb">
                <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange" :ellipsis="false">
                    <van-tab :title="i18n.BPoS.Hold" name="1"></van-tab>
                    <van-tab :title="i18n.BPoS.Node" name="2"></van-tab>
                    <!-- <van-tab :title="i18n.BPoS.Dividend" name="3"></van-tab> -->
                    <van-tab :title="i18n.BPoS.StarLink" name="4"></van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="Bpos_tab">
            <div class="tab_hold">
                <div class="hold_total">
                    <div class="text_record clearfix">
                        <span class="fl" v-show="active == 1">{{i18n.BPoS.HoldTotal}}（USDT）</span>
                        <span class="fl" v-show="active == 2">{{i18n.BPoS.NodeTotalMoney}}（USDT）</span>
                        <span class="fl" v-show="active == 3">{{i18n.BPoS.DividendTotalRevenue}}（USDT）</span>
                        <span class="fl" v-show="active == 4 ">{{i18n.BPoS.StarTotalRevenue}}（USDT）</span>
                        <img v-show="active == 1 && !hock" class="fr" src="../../assets/v2img/get_record.png" alt="" @click="goGetRecord">
                        <img v-show="active == 1 && hock" class="fr" src="../../assets/v2img/get_record_hock.png" alt="" @click="goGetRecord">
                    </div>
                    <div class="total">
                        <h1 v-show="active == 1">{{Number(totalHold).toFixed(4)| numberToCurrency}}</h1>
                        <h1 v-show="active == 2">{{Number(totalNode).toFixed(4)| numberToCurrency}}</h1>
                        <h1 v-show="active == 3">{{Number(totalDividend).toFixed(4)| numberToCurrency}}</h1>
                        <h1 v-show="active == 4">{{Number(totalStar).toFixed(4)| numberToCurrency}}</h1>
                    </div>
                    <div class="total_get clearfix">
                        <div class="total_nums fl clearfix">
                            <p v-show="active == 1">{{i18n.BPoS.TotalPosition}}(ESG)</p>
                            <p v-show="active == 2">{{i18n.BPoS.NodeTotalPosition}}(ESG)</p>
                            <p v-show="active == 3">{{i18n.BPoS.DividendTotalAmount}}(ESG)</p>
                            <p v-show="active == 4">{{i18n.BPoS.PositionValue}}(U)</p>
                            <span  v-show="active == 1" class="fl">{{allDataObj.personal_totalesg == 0 ? 0 : Number(allDataObj.personal_totalesg).toFixed(4)| numberToCurrency}}</span>
                            <span  v-show="active == 2" class="fl">{{allDataObj.node_totalesg == 0 ? 0 : Number(allDataObj.node_totalesg).toFixed(4)| numberToCurrency}}</span>
                            <span  v-show="active == 3" class="fl">{{0| numberToCurrency}}</span>
                            <span  v-show="active == 4" class="fl">{{allDataObj.star_highestamount == 0 ? 0 : Number(allDataObj.star_highestamount).toFixed(4)| numberToCurrency}}</span>
                        </div>
                        <div class="revenue fl">
                            <p v-show="active == 1">{{i18n.BPoS.NoAndYesTotal}}(USDT)</p>
                            <p v-show="active == 2">{{i18n.BPoS.NodeTotalRevenue}}(USDT)</p>
                            <p v-show="active == 3">{{i18n.BPoS.TodayDividend}}(ESG)</p>
                            <p v-show="active == 4">{{i18n.BPoS.CurrentPosition}}(USDT)</p>
                            <div class="revenue_box" v-show="active == 1">
                                <span class="money">{{allDataObj.personal_norev == 0 ? 0 : Number(allDataObj.personal_norev).toFixed(2)| numberToCurrency}}</span><i></i><span class="money">{{allDataObj.personal_alreadyRev == 0 ? 0 : Number(allDataObj.personal_alreadyRev).toFixed(2)| numberToCurrency}}</span>
                            </div>
                            <div class="revenue_box" v-show="active == 2">
                                <span :class="active == 2 ? 'money':''">{{allDataObj.node_alreadyrev == 0 ? 0 : Number(allDataObj.node_alreadyrev).toFixed(4)| numberToCurrency}}</span>
                            </div>
                            <div class="revenue_box" v-show="active == 3">
                                <span>{{0}}</span>
                            </div>
                            <div class="revenue_box" v-show="active == 4">
                                <span>{{allDataObj.star_currentamount == 0 ? 0 : Number(allDataObj.star_currentamount).toFixed(4)| numberToCurrency}}</span>
                            </div>
                        </div>
                        <div class="total_nums fl"  v-show="active == 2">
                            <p>{{i18n.BPoS.Node}} </p>
                            <span class="fl">{{allDataObj.node_amountofa}}</span>
                        </div>
                        <div class="total_nums fl"  v-show="active == 2">
                            <p>{{i18n.BPoS.Node}} / ALL</p>
                            <span class="fl">{{allDataObj.node_amountofall}}</span>
                        </div>
                    </div>
                    <div class="total_btn" v-show="active == 1" @click="toExchange">{{i18n.BPoS.Create}}</div>
                </div>
            </div>
            <div class="record_box" v-show="active == 1">
                <div class="hold_popup" @click="showFilter = true">
                    <span v-show="activeH == 1">{{i18n.BPoS.AllHolds}}</span>
                    <span v-show="activeH == 2">{{i18n.BPoS.NowHolds}}</span>
                    <span v-show="activeH == 3">{{i18n.BPoS.Moved}}</span>
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
                        <span class="fl" v-else>ESG/Position {{item.chain_record_idx + 1}}</span>
                        <i></i>
                        <span>{{item.ts}}</span>
                        <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="" >
                        <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
                    </div>
                    <div class="record_nums">
                        <div class="esg_num clearfix">
                            <p>{{i18n.BPoS.Transactions}}(ESG)</p>
                            <span class="fl">{{item.esg_amount == 0 ? 0 : Number(item.esg_amount).toFixed(4)}}</span>
                        </div>
                        <div class="usdt_num">
                            <p>{{i18n.BPoS.Turnover}}(USDT)</p>
                            <span class="fl">{{item.usdt_amount == 0 ? 0 : Number(item.usdt_amount).toFixed(4)}}</span>
                        </div>
                        <div class="earning" v-if="item.type != 'sell' && item.status != 'yimaichu'">
                            <p>{{i18n.BPoS.NoAndYes}}(USDT)</p>
                            <div class="earning_one clearfix">
                                <!-- <span class="fr">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)}}</span> -->
                                <span class="fl">{{item.norecieved == 0 ? 0 : Number(item.norecieved).toFixed(4)| numberToCurrency}}</span><i class="fl"></i><span class="money fl">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)| numberToCurrency}}</span>
                            </div>
                        </div>
                        <div class="earning" v-else>
                            <p>{{i18n.BPoS.NoAndYes}}(USDT)</p>
                            <div class="earning_one clearfix">
                                <!-- <span style="color: #333" class="fr">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)}}</span> -->
                                <span class="fl">{{item.norecieved == 0 ? 0 : Number(item.norecieved).toFixed(4)| numberToCurrency}}</span><i class="fl"></i><span class="money fl">{{item.reward == 0 ? 0 : Number(item.reward).toFixed(4)| numberToCurrency}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="record_box"  v-show="active == 2">
                <div class="node_all">
                    <span>{{i18n.BPoS.Revenue}}</span>
                    <div class="all_btn clearfix" @click="toAllRecord(1)">
                        <span class="fl">{{i18n.BPoS.All}}</span>
                        <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
                        <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
                    </div>
                </div>
                <div class="null_box" v-show="showNodes.length == 0">
                    <span>Null</span>
                </div>
                <div class="node_item" v-for="(item, index) in showNodes" :key="index">
                    <div class="node_title">
                        <span class="node_type" v-if="item.type == 'starchain'">{{i18n.BPoS.StarLink}}</span>
                        <span class="node_type" v-else>{{i18n.BPoS.Node}}</span>
                        <span class="node_date">{{item.ts}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Earnings}}：</span>
                        <span class="fr money">+{{Number(item.reward_amount).toFixed(4)}} USDT</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Revenue}}：</span>
                        <div class="detail_box fr">
                            <span >{{item.percent * 100}}%</span>
                            <div v-show="item.type == 'node' && item.symbol != ''">
                                <i></i>
                                <span class="type">{{item.symbol}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.WalletAddr}}：</span>
                        <div class="detail_box fr">
                            <span>{{item.showUser}}</span>
                            <img v-show="!hock" src="../../assets/v2img/copy_icon.png" alt="" @click="copyAddr(item.from)">
                            <img v-show="hock" src="../../assets/v2img/copy_icon_hock.png" alt="" @click="copyAddr(item.from)">
                        </div>
                    </div>
                </div>
            </div>
            <div class="record_box"  v-show="active == 3">
                <div class="node_all">
                    <span>{{i18n.BPoS.DividendRecord}}</span>
                    <div class="all_btn clearfix" @click="toAllRecord(2)">
                        <span class="fl">{{i18n.BPoS.All}}</span>
                        <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
                        <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
                    </div>
                </div>
                <div class="null_box" v-show="dividendList.length == 0">
                    <span>Null</span>
                </div>
                <div class="node_item" v-for="(item, index) in dividendList" :key="index">
                    <div class="node_title">
                        <span class="node_type">{{i18n.BPoS.Dividend}}</span>
                        <span class="node_date">2022-06-28 11:23</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Earnings}}：</span>
                        <span class="fr money">+121.0000 USDT</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.WeightedDividend}}：</span>
                        <div class="detail_box fr">
                            <span>1%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="record_box"  v-show="active == 4">
                <div class="node_all">
                    <span>{{i18n.BPoS.StarlinkRecord}}</span>
                    <div class="all_btn clearfix" @click="toAllRecord(3)">
                        <span class="fl">{{i18n.BPoS.All}}</span>
                        <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="">
                        <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="">
                    </div>
                </div>
                <div class="null_box" v-show="showStars.length == 0">
                    <span>Null</span>
                </div>
                <div class="node_item" v-for="(item, index) in showStars" :key="index">
                    <div class="node_title">
                        <span class="node_type">{{i18n.BPoS.StarLink}}</span>
                        <span class="node_date">{{item.ts}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl" v-if="item.type == 'buy' && item.percent == 0.01">{{i18n.BPoS.Add}}：</span>
                        <span class="fl" v-if="item.type == 'buy' && item.percent == 0.02">{{i18n.BPoS.Addjin}}：</span>
                        <span class="fl" v-if="item.type == 'sell'">{{i18n.BPoS.Reduction}}：</span>
                        <span class="fr add">{{Number(item.amount).toFixed(4)}} USDT</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Revenue}}：</span>
                        <div class="detail_box fr">
                            <span>{{item.percent * 100}}%</span>
                        </div>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.WalletAddr}}：</span>
                        <div class="detail_box fr">
                            <span>{{item.showUser}}</span>
                            <img v-show="!hock" src="../../assets/v2img/copy_icon.png" alt="" @click="copyAddr(item.from)">
                            <img v-show="hock" src="../../assets/v2img/copy_icon_hock.png" alt="" @click="copyAddr(item.from)">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <van-popup v-model="showFilter" position="bottom" safe-area-inset-bottom>
            <div class="hold_filter clearfix">
                <span :class="activeH == 1 ? 'active_hold' : ''" @click="chooseHoldFilter(1)">{{i18n.BPoS.AllHolds}}</span>
                <span :class="activeH == 2 ? 'active_hold' : ''" @click="chooseHoldFilter(2)">{{i18n.BPoS.NowHolds}}</span>
                <span :class="activeH == 3 ? 'active_hold' : ''" @click="chooseHoldFilter(3)">{{i18n.BPoS.Moved}}</span>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import { _float } from '@/assets/js/float'
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { Toast } from 'vant';
import { contractMethods, GetBposUserInfos, GetHistoryBuyEsg, GetEsgPrice, GetIsStarChain, GetReceivedLiquidity, GetHistoryWhitelistRecord } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    inject: ['reload'],
    name: 'BPoS',
    data() {
        return {
            active: '1',
            totalHold: 0,
            totalNode: 0,
            totalDividend: 0,
            totalStar: 0,
            showFilter: false,
            activeH: 2, // 当前选项
            recordList: [],
            nodeList: [],
            showNodes: [], // 展示的流水
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
        }
    },
    created () {
        // 需要合约实例化后运行的函数 异步函数队列
        setTimeout(async () => {
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                await this.getRatio()
                await this.getTotalInfo()
            } catch (error) {
                console.log("Bpos err ==>", error)
                // this.reload()
            }
            Toast.clear();
            this.getStarUser()
            this.getBuyHold()
            this.getNodes()
            this.getStars()

        })
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock', 'redioPrice']),
        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    methods: {
        // 切换
        tabsChange(index) {
            if (index == '1') {

            }
        },
        // tabs 跳转前
        async beforeTabsChange(index) {
            if (index == 4) {
                if (!this.isStar) {
                    Toast({duration: 2000, message: this.i18n.EsgExchange.NoPermission, icon: 'close', className: 'fail' });
                }
                console.log(this.isStar)
                return this.isStar;
            } else {
                return true;
            }
        },
        // 去创建
        toExchange() {
            this.$router.push({path: 'Trading'})
        },
        // 跳转详情
        toShareDetails(item) {
            this.$router.push({name: 'ShareDetails', params: {buyId: item.id, isTeam: item.is_team, priceRatio: this.ratioUsdtEsg, NoRelease: this.allDataObj.personal_norelease, item}})
        },
        // 跳转记录
        toAllRecord(val) {
            console.log(val)
            if (val == 1) {
                if (this.nodeList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
                this.$router.push({name: 'AllRecord', query: {type: val}, params: {data: this.nodeList}})
            } else if(val == 2) {
                if (this.dividendList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
                this.$router.push({name: 'AllRecord', query: {type: val}, params: {data: this.dividendList}})
            } else if(val == 3) {
                if (this.starList.length == 0) return Toast({ message: this.i18n.Toast.NoData, icon: 'close', className: 'fail' });
                this.$router.push({name: 'AllRecord', query: {type: val}, params: {data: this.starList}})
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
            this.$router.push({name: 'GetRecord'})
        },
        // 复制
        copyAddr(val) {
            _tools.copyValue(val)
            Toast({ message: this.i18n.Main.CopySuccess, icon: 'passed', className: 'successToast' });
        },

        // 获取是否星链
        async getStarUser() {
            let obj = await GetIsStarChain({addr: this.address})
            this.isStar = obj.data
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
                let infoData = await GetBposUserInfos({addr: this.address})
                let data = infoData.data
                let obj = {
                    node_alreadyrev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.node_alreadyrev), 'ether'),
                    node_amountofa: data.node_amountofa,
                    node_amountofall: data.node_amountofall,
                    node_totalesg: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.node_totalesg), 'ether'),
                    personal_alreadyRev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_alreadyRev), 'ether'),
                    personal_norelease: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_norelease), 'ether'),
                    personal_norev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_norev), 'ether'),
                    personal_totalesg: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.personal_totalesg), 'ether'),
                    star_currentamount: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.star_currentamount), 'ether'),
                    star_highestamount: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.star_highestamount), 'ether'),
                    star_totalrev: this.vuex_web3.utils.fromWei(_tools.interceptFloat(data.star_totalrev), 'ether'),
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
            let recordList = await GetHistoryBuyEsg({...params})
            let data = recordList.data
            console.log("hold ==>", data)
            let arr = []
            data.map(v => {
                let obj = {
                    id: v.ID,
                    ts: '',
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
                    showId: ''
                }
                // getMDHM
                obj.ts = _date.getMDHM(v.ts * 1000)
                obj.tsY = _date.getYMDHMS(v.ts * 1000)
                obj.reward = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.reward), 'ether')
                obj.norecieved = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.norecieved), 'ether')
                obj.usdt_amount = this.vuex_web3.utils.fromWei(v.usdt_amount, 'ether')
                obj.esg_amount = this.vuex_web3.utils.fromWei(v.esg_amount, 'ether')
                obj.handlingFees = _float.mul(obj.esg_amount, 0.05)
                obj.is_team = v.is_team == 1 ? true : false
                obj.chain_record_idx = v.chain_record_idx
                if (type == 'buy' && v.status == 'jinxingzhong') {
                    arr.push(obj)
                } else if (type == ''){
                    arr.push(obj)
                }
            })
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
                this.recordList = sortArr
                console.log("this.recordList ==>", this.recordList)
            })
        },
        objectSort(property) {
            return function (Obj1,Obj2) {
                return Obj1[property]-Obj2[property]
            }
        },

        // 获取节点数据
        async getNodes() {
            let params = {
                addr: this.address,
                desc: true
            }
            let res = await GetReceivedLiquidity({...params})
            let data = res.data
            console.log(data)
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
            console.log('nodelist ==>', this.nodeList)
        },

        // 获取星链数据
        async getStars() {
            let params = {
                addr: this.address,
                desc: true
            }
            let res = await GetHistoryWhitelistRecord({...params})
            let data = res.data
            // console.log("stars ==>", data)
            data.map((v, i) => {
                let obj = {
                    TxHash: v.TxHash,
                    amount: '',
                    from: v.from,
                    id: v.id,
                    percent: v.percent,
                    ts: '',
                    type: v.type,
                    whitelist: v.whitelist,
                    showUser: ''
                }
                obj.ts = _date.getYMDHMS(v.ts * 1000)
                obj.amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.amount), 'ether')
                obj.showUser = _accounts.easyAccount(null, 12, 8, v.from)
                this.starList.push(obj)
                if (i <= 2) {
                    this.showStars.push(obj)
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.BPoS {
    height: 100%;
    // padding-bottom: 10px;
    background-color: #fff;
    .top {
        padding: 48px 32px 0px 32px;
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
    .Bpos_tab {
        padding: 0 32px;
        width: 100%;
        height: calc(100% - 137px);
        overflow: auto;
        box-sizing: border-box;
        .tab_hold {
            margin-top: 32px;
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
                    .total_nums, .revenue {
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
                .total_btn {
                    margin: auto;
                    color: #fff;
                    font-size: 32px;
                    font-weight: bold;
                    text-align: center;
                    line-height: 80px;
                    width: 590px;
                    height: 80px;
                    margin-top: 36px;
                    background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
                    border-radius: 16px;
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
                    .esg_num, .usdt_num, .earning {
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
            & .node_item:last-of-type {
                border: none;
            }
        }
    }
}

/deep/ .van-popup {
    .hold_filter {
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

.BPoS_hock {
    background-color: $back-qs-hock;
    .top .top_box /deep/ .van-tabs .van-tab {
         color: $text-qqs-hock;
    }
    .top .top_box /deep/ .van-tabs .van-tab--active {
        color: $text-qs-hock;
    }
    .Bpos_tab .tab_hold .hold_total {
        background-color: $back-hock;
        box-shadow: none;
    }
    .Bpos_tab .tab_hold .hold_total .total {
        border-bottom-color: $trading-border-hock;
    }
    .Bpos_tab .record_box .record_item .record_date span:nth-of-type(1) {
        color: $text-qs-hock;
    }
    .Bpos_tab .record_box .record_item .record_date i {
        background-color: $trading-border-hock;
    }
    .Bpos_tab .record_box .record_item .record_date span:nth-of-type(2) {
        color: $text-999-hock;
    }
    .Bpos_tab .record_box .record_item {
        border-bottom-color: $bpos-border-b-hock;
    }
    .Bpos_tab .record_box .node_all .all_btn span {
        color: $text-qqs-hock;
    }
    .Bpos_tab .record_box .node_item .node_detail .detail_box span {
        color: $text-qs-hock;
    }
    .Bpos_tab .record_box .node_item {
        border-bottom-color: $trading-border-hock;
    }
    .Bpos_tab .record_box .node_item .node_detail .add {
        color: $text-qs-hock;
    }

    /deep/ .van-popup {
        .hold_filter {
            background-color: $back-qs-hock;
        }
    }
}
</style>
