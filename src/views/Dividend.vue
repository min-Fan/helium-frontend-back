<template>
    <div class="Dividend">
        <div class="Dividend_wrap">
            <div class="Dividend_tab">
                <div class="top_box f-a-c f-j-sb">
                    <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange">
                        <van-tab :title="i18n.Dividend.Add" name="1"></van-tab>
                        <van-tab :title="i18n.Dividend.Remove" name="2"></van-tab>
                        <van-tab :title="i18n.Dividend.Buy" name="3"></van-tab>
                        <van-tab :title="i18n.Dividend.Money" name="4"></van-tab>
                    </van-tabs>
                </div>
                <div class="add_box" v-show="active == '1'">
                    <div class="time_choose">
                        <p>{{ i18n.Dividend.Choosetime }}</p>
                        <van-radio-group v-model="radio" direction="horizontal">
                            <van-radio name="1" disabled>90 {{ i18n.Dividend.Day }} <span>10% <img src="../assets/img/sheng.png" alt=""></span> </van-radio>
                            <van-radio name="2">180 {{ i18n.Dividend.Day }} <span>20% <img src="../assets/img/sheng.png" alt=""></span> </van-radio>
                        </van-radio-group>
                    </div>
                    <div class="inp_box">
                        <div class="balance_box">
                            <span>USDT {{ i18n.Dividend.Balance }}</span>
                            {{ Number(usdtBalance).toFixed(2) }}
                        </div>
                        <div class="usdt_box">
                            <van-field class="usdt_inp inp_text" v-model="value" :placeholder="i18n.Dividend.Maxadd" @blur="usdtInp"/>
                            <div class="usdt_icon">
                                <img src="../assets/img/usdt.png" alt="" class="fl">
                                <span class="fl" style="color: #fff">USDT</span>
                            </div>
                        </div>
                        <div class="jiaicon">
                            <img src="../assets/img/jia_icon.png" alt="">
                        </div>
                        <div class="esg_box">
                            <van-field class="usdt_inp" v-model="value_esg" :readonly="true"/>
                            <div class="usdt_icon">
                                <img src="../assets/img/esgIcon.png" alt="" class="fl">
                                <span class="fl" style="color: #fff">ESG</span>
                            </div>
                        </div>
                        <div class="lian_box clearfix">
                            <div class="fl lian_taxt">
                                <span>{{ i18n.Dividend.Buyprice }}</span>
                                {{ Number(ratioUsdtEsg).toFixed(2) }} USDT/ESG
                                <img src="../assets/img/exchange2.png" alt="" @click="resetRatio">
                            </div>
                            <div class="fr">
                                <img src="../assets/img/lian.png" alt="" srcset="">
                            </div>
                        </div>
                        <div class="esg_box">
                            <van-field class="usdt_inp" v-model="value_usdt" :readonly="true"/>
                            <div class="usdt_icon">
                                <img src="../assets/img/usdt.png" alt="" class="fl">
                                <span class="fl" style="color: #fff">USDT</span>
                            </div>
                        </div>
                        <div class="jiaicon">
                            <span>{{ i18n.Dividend.Buynumbs }}</span>
                            <img src="../assets/img/jia_icon.png" alt="">
                        </div>
                        <div class="esg_box">
                            <van-field class="usdt_inp" v-model="value_esg2" :readonly="true"/>
                            <div class="usdt_icon">
                                <img src="../assets/img/esgIcon.png" alt="" class="fl">
                                <span class="fl" style="color: #fff">ESG</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="remove_box" v-show="active == '2'">
                    <div class="choose_box">
                        <div class="choose_price">
                            <span>{{ i18n.Dividend.Price }}</span>
                            {{ Number(ratioUsdtEsg).toFixed(2) }}USDT/ESG
                            <img src="../assets/img/exchange2.png" alt="" @click="resetRatio">
                        </div>
                        <div class="exchange clearfix">
                            <div class="inp_box">
                                <van-field class="rightinp" v-model="remove_value" placeholder="" @click="showChoose"/>
                                <div class="choose_box_inp" @click="showChoose">
                                    <span v-show="remove_value == ''">{{i18n.Dividend.ChoosePost}}</span>
                                    <img src="../assets/img/xia.png" alt="">
                                </div>
                            </div>
                            <div class="icon_box clearfix">
                                <span class="fr">{{i18n.Dividend.Share}}: {{ Number(holdAmountTotal).toFixed(4) }}</span>
                            </div>
                            <img class="imgS fl" src="../assets/img/Exchange.png" alt="" >
                            <div class="usdt_box fl">
                                <van-field class="usdt_inp" v-model="remove_value2" :readonly="true"/>
                                <div class="usdt_icon">
                                    <img src="../assets/img/usdt.png" alt="" class="fl">
                                    <span class="fl" >USDT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="buy_box" v-show="active =='3'">
                    <div class="nullData" v-show="listData.length == 0">
                        <p>{{i18n.Team.NoData}}</p>
                    </div>
                    <div class="buy_list" v-show="listData.length != 0">
                        <div class="list_box" v-for="(item, index) in listData" :key="index">
                            <div class="list_title clearfix">
                                <p class="fl">ESG {{i18n.Dividend.Subscriptions}}{{index + 1}}</p>
                            </div>
                            <div class="list_data">
                                <div class="data_box">
                                    <p>{{i18n.Dividend.Periodicity}}<span style="font-size: 12px;color: #8E8A8A;"></span></p>
                                    <font>{{ item.period }}{{ i18n.Dividend.Day }}</font>
                                </div>
                                <div class="data_box">
                                    <p>{{i18n.Dividend.Buytotal}}<span style="font-size: 12px;color: #8E8A8A;">(ESG)</span></p>
                                    <font>{{ Number(item.releaseEsg).toFixed(4) }}</font>
                                </div>
                                <div class="data_box" style="text-align: right">
                                    <p>{{i18n.Dividend.Time}}</p>
                                    <font>{{ item.AddTs }}</font>
                                </div>
                            </div>
                            <div class="list_earnings clearfix">
                                <div class="data_box">
                                    <p>{{i18n.Dividend.Collected}}(ESG)</p>
                                    <font>{{ Number(item.RewardAmounted).toFixed(5) == 0 ? 0 : Number(item.RewardAmounted).toFixed(4) }}</font>
                                </div>
                                <div class="data_box">
                                    <p>{{i18n.Dividend.Available}}(ESG)</p>
                                    <font style="color: #F69C15;font-weight: bold;">{{ Number(item.RewardAmount).toFixed(5) == 0 ? 0 : Number(item.RewardAmount).toFixed(4) }}</font>
                                </div>
                                <div class="data_box">
                                    <div class="commit_btn" @click="getEarnings(item)">{{i18n.Dividend.GetEarnings}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="money_box" v-show="active =='4'">
                    <div class="info_box clearfix">
                        <div class="info_list clearfix">
                            <div class="info_text fl">
                                <p>{{ i18n.Dividend.Totaltext }} LP</p>
                                <span>{{ dividends.total }}</span>
                            </div>
                            <div class="info_text fl">
                                <p>{{ i18n.Dividend.My }} LP</p>
                                <span>{{ dividends.my }}</span>
                            </div>
                            <div class="info_text fl">
                                <p>LP {{ i18n.Dividend.Cumulative }}(USDT)</p>
                                <span>{{ dividends.cumulative }}</span>
                            </div>
                            <div class="info_text fl">
                                <p>{{ i18n.Dividend.Recommend }}(USDT)</p>
                                <span>{{ dividends.recommend }}</span>
                            </div>
                        </div>
                        <div class="get_box clearfix">
                            <div class="revenue_box fl">
                                <span>{{ i18n.Dividend.Earnings }}</span>
                                <span>{{ dividends.earnings }} USDT</span>
                            </div>
                            <div class="btn_box fr">
                                <div class="commit_btn" @click="getEarningsMoney">{{i18n.Dividend.GetEarningbtn}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="confirm_btn f-j-a-c" @click="confirm" v-show="active == '1'">{{ active == '1' ? i18n.Dividend.AddBtn : i18n.Dividend.RemoveBtn}}</div>
                <div class="confirm_btn f-j-a-c" @click="remove" v-show="active == '2'">{{ active == '1' ? i18n.Dividend.AddBtn : i18n.Dividend.RemoveBtn}}</div>
            </div>
        </div>

        <van-action-sheet v-model="showHold" :title="i18n.Dividend.Sharepre" :closeable="true" safe-area-inset-bottom>  
            <div class="item_actions" v-for="(item, index) in actions" :key="index" @click="onSelect(item)">
                <span>{{i18n.Dividend.Sharepre}}{{ index + 1}}</span>
                <span>{{ Number(item.liquidity).toFixed(4) }}</span>
                <span>{{ i18n.Dividend.Surplus }}{{ item.Surplus }}{{ i18n.Dividend.Day }}</span>
            </div>
        </van-action-sheet>
        <van-popup v-model="showInp" position="center">
            <div class="inp_pop f-d-c f-a-c">
                <div class="inp_titile">{{i18n.BlindBox.BindInviter}}</div>
                <div class="inp_group">
                    <textarea v-model="inviteAddr" :placeholder="i18n.BlindBox.InviterPlc"></textarea>
                </div>
                <div class="confirm_btn f-j-a-c" @click="addrRule">{{i18n.BlindBox.Confirm}}</div>
            </div>
        </van-popup>
        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
// import BigNumber from "bignumber.js";
import { _float } from '@/assets/js/float'
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { Toast } from 'vant';
import { contractMethods } from '@api'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import { CookieStorage } from 'cookie-storage';
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    inject: ["reload"],
    name: 'Dividend',
    data() {
        return {
            isLpWhite: false, // 是否白名单
            showLoading: false, // 加载
            active: '1', // tabs
            radio: '2',
            value: '', // add usdt
            value_esg: '0.0', // add esg
            value_usdt: '0.0', // add usdt/esg usdt
            value_esg2: '0.0 + 0', // add usdt/esg esg
            remove_value: '', // remove value amount
            remove_value2: '0', // remove value usdt
            showHold: false, // 展示持仓
            actions: [], // 移除选项
            listData: [], // 购入列表
            usdtBalance: '0', // usdt 余额
            ratioUsdtEsg: '0', // 汇率
            isReferrer: false, // 是否有推荐人
            showInp: false, // 推荐人弹窗
            inviteAddr: '', // 推荐人地址
            chooseItem: null, // 选择移除
            holdAmountTotal: 0, // 持仓份额
            dividends: {
                total: '0',
                my: '0',
                cumulative: '0',
                recommend: '0',
                earnings: '0'
            }
        }
    },

    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },

    created() {
        // 需要合约实例化后运行的函数 异步函数队列
        setTimeout(async () => {
            if (this.vuex_myContract != {}) {
                this.showLoading = true
                await this.getLpWhite()
                await this.getReferrer(this.address)
                await this.getRatio()
                await this.getUsdtbalance()
                await this.getBuylist()
                await this.getUserReward()
                this.showLoading = false
                // console.log(this.isLpWhite)
                if (!this.isLpWhite) {
                    Toast({ message: this.i18n.Main.NoWhite, icon: 'fail' });
                    this.$parent.getLpWhite()
                    this.$router.push({path: `EsgExchange`});
                }
            }
        }, 0)
        
    },

    methods: {
        // 获取 LP 白名单
        async getLpWhite() {
            await this.vuex_myContract.contrart_AddLp.methods.IsWhiteList(this.address).call().then(res => {
                this.isLpWhite = res
            }).catch(err => {
                console.log('白名单 err ==>', err)
            })
        },
        // tabs
        tabsChange(index) {
            console.log(index)
        },
        // before tabs
        async beforeTabsChange(index) {
            return true;
        },
        // 获取认购列表
        async getBuylist() {
            this.listData = []
            this.actions = []
            // 获取数量
            let nums = 0
            await this.vuex_myContract.contrart_EsgRelease.methods.BuyLength(this.address).call().then(res => {
                nums = res
                console.log("nums res ==>", res)
            })
            if (nums == 0) return

            await this.vuex_myContract.contrart_EsgRelease.methods.QueryBuyRecord(this.address, 0, nums).call().then(async res => {
                if (res.length != 0) {
                    let data = res
                    let arr = []
                    await Promise.all(data.map(async (v, i) => {
                        let obj = {
                            AddTs: "",
                            startTim: v.AddTs,
                            period: "",
                            periodData: v.period,
                            releaseEsg: "",
                            idx: i,
                            liquidity: this.vuex_web3.utils.fromWei(v.liquidity, "ether"),
                            RewardAmount: "", // 可领取收益
                            RewardAmounted: "", // 已领取收益
                            Surplus: '', // 剩余天
                        }
                        obj.period = parseInt(v.period / 86400)
                        obj.releaseEsg = Number(this.vuex_web3.utils.fromWei(v.releaseEsg, "ether"))
                        obj.AddTs = _date.getYMD(v.AddTs * 1000)
                        // (relraseEsg/period) * (LastTs - AddTs)
                        let tsNum = (Number(v.LastTs) - Number(v.AddTs))
                        let rewaerd = ((Number(obj.releaseEsg) / Number(v.period)) * tsNum).toFixed(9)
                        rewaerd = Number(rewaerd) > Number(obj.releaseEsg) ? Number(obj.releaseEsg) : rewaerd
                        obj.RewardAmounted = rewaerd
                        arr.push(obj)
                        await this.vuex_myContract.contrart_EsgRelease.methods.getEsgRelease(this.address, obj.idx).call().then(res => {
                            // console.log("可领取收益 ==>", obj.idx, res)
                            obj.RewardAmount = res[0] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res[0], "ether"))
                        }).catch(err => {
                            console.log("err1 可领取==>", err, i)
                        })
                    }))

                    arr.sort(this.objectSort("idx"))
                    
                    arr.forEach(v => {
                        let timeNow = parseInt(new Date().getTime() / 1000)
                        let endTim = Number(v.startTim) + Number(v.periodData)
                        let timer = ((endTim - timeNow) / 86400) <= 0 ? 0 : ((endTim - timeNow) / 86400)
                        v.Surplus = Math.ceil(Number(timer))
                        this.holdAmountTotal += Number(v.liquidity)
                        this.listData.push(v)
                        this.actions.push(v)
                    })
                    console.log("arr ==>", arr)
                }
            }).catch(err => {
                console.log("err2 列表==>", err)
            })
        },
        // 对象排序
        objectSort(property) {
            return function (Obj1,Obj2) {
                return Obj1[property]-Obj2[property]
            }
        },

        // 获取汇率
        async getRatio() {
            // this.showLoading = true
            await this.vuex_myContract.contrart_BnbUsdt.methods.getReserves().call().then(res => {
                let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
                let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
                this.ratioA = _tools.formatDecimal(ratioA / ratioB, 4)
                // console.log(this.ratioA)
            })
            await this.vuex_myContract.contrart_BnbEsg.methods.getReserves().call().then(res => {
                let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
                let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
                this.ratioB = _tools.formatDecimal(ratioA / ratioB, 4)
                // console.log(this.ratioB)
            })

            this.ratioUsdtEsg = _tools.formatDecimal(this.ratioA * this.ratioB, 9)
        },

        // 刷新汇率
        async resetRatio() {
            this.showLoading = true
            await this.getRatio()
            this.showLoading = false
        },

        // 获取分红数据
        async getUserReward() {
            await this.vuex_myContract.contrart_LpReward.methods.getUserLp(this.address).call().then(res => {
                console.log("res1 ==>", res)
                this.dividends.total = res[0] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res[0], 'ether')).toFixed(2)
                this.dividends.my = res[1] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res[1], 'ether')).toFixed(4)
            }).catch(err => {
                console.log("err1 ==>", err)
            })
            await this.vuex_myContract.contrart_LpReward.methods.getUserTotalReward(this.address).call().then(res => {
                console.log("res2 ==>", res)
                this.dividends.cumulative = res.TotalSettleldLp == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res.TotalSettleldLp, 'ether')).toFixed(4)
                this.dividends.recommend = res.TotalRecommend == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res.TotalRecommend, 'ether')).toFixed(4)
            }).catch(err => {
                console.log("err2 ==>", err)
            })
            await this.vuex_myContract.contrart_LpReward.methods.getReward(this.address).call().then(res => {
                console.log("res3 ==>", res)
                this.dividends.earnings = res == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
            }).catch(err => {
                console.log("err3 ==>", err)
            })
        },

        // 获取 usdt esg 余额
        async getUsdtbalance() {
            await this.vuex_myContract.contrart_USDT.methods.balanceOf(this.address).call().then(res => {
                // console.log("usdt balance ==>", res)
                this.usdtBalance = this.vuex_web3.utils.fromWei(res, 'ether');
            })
        },
        // 输入添加 usdt
        usdtInp() {
            if (this.usdtBalance == 0) {
                this.value = 0
                Toast({ message: this.i18n.Map.BalanceNo, icon: 'fail' })
                return
            }
            let max = this.usdtBalance / 3
            if (this.value > max) {
                this.value = max;
                this.value_esg = Number(this.value / this.ratioUsdtEsg).toFixed(4)
                this.value_usdt = (this.value * 2).toFixed(4)
                // 收益率
                let value1, value2
                value1 = Number(this.value_usdt / this.ratioUsdtEsg).toFixed(4)
                if (this.radio == 1) {
                    value2 = _float.mul(value1, 0.1).toFixed(4)
                } else {
                    value2 = _float.mul(value1, 0.2).toFixed(4)
                }
                // this.value_esg2 = _float.add(value1, value2).toFixed(4)
                this.value_esg2 = Number(value1).toFixed(4) + ' + ' + Number(value2).toFixed(4)
                Toast({ message: this.i18n.Dividend.Maxadd, icon: 'fail' })
            } else {
                this.value_esg = Number(this.value / this.ratioUsdtEsg).toFixed(4)
                console.log(this.value, this.ratioUsdtEsg, this.value / this.ratioUsdtEsg, this.value_esg)
                this.value_usdt = (this.value * 2).toFixed(4)
                // 收益率
                let value1, value2
                value1 = Number(this.value_usdt / this.ratioUsdtEsg).toFixed(4)
                if (this.radio == 1) {
                    value2 = _float.mul(value1, 0.1).toFixed(4)
                } else {
                    value2 = _float.mul(value1, 0.2).toFixed(4)
                }
                // this.value_esg2 = _float.add(value1, value2).toFixed(4)
                this.value_esg2 = Number(value1).toFixed(4) + ' + ' + Number(value2).toFixed(4)
            }
        },
        // 验证邀请人
        async addrRule() {
            if (!this.inviteAddr) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });
            
            // 验证以太坊地址合法性
            let isAddr = await this.vuex_web3.utils.isAddress(this.inviteAddr)

            await this.getReferrerRule(this.inviteAddr)

            if (!this.isReferrer) {
                Toast({ message: this.i18n.EsgExchange.isReferrerAddr, icon: 'fail' });
                return
            }

            // return
            if (!isAddr) {
                return Toast({ message: this.i18n.BlindBox.ruleAddr, icon: 'fail' });
            } else {
                this.showInp = false;
                this.confirm()
            }
        },
        // 判断该地址是否有推荐人 / 是否是合法推荐人地址
        async getReferrerRule(accounts) {
            // 查询推荐人
            await this.vuex_myContract.contrart_AddLp.methods.RecommendOf(accounts).call().then(res => {
                if (res == '0x0000000000000000000000000000000000000000') {
                    // 无推荐人
                    this.isReferrer = false
                } else {
                    this.isReferrer = true
                }
            })
        },
        // 判断本人地址是否有推荐人 / 是否是合法推荐人地址
        async getReferrer(accounts) {
            // 查询推荐人
            await this.vuex_myContract.contrart_AddLp.methods.RecommendOf(accounts).call().then(res => {
                if (res == '0x0000000000000000000000000000000000000000') {
                    // 无推荐人
                    this.isReferrer = false
                } else {
                    this.isReferrer = true
                    this.inviteAddr = res
                }
            })
        },
        // 授权 - USDT
        async approved() {
            return new Promise(async (resolve, reject) => {

                // 查询授权
                let isApproved = false
                await this.vuex_myContract.contrart_USDT.methods.allowance(this.address, Eth.contract.contrart_AddLp.addr).call().then(res => {
                    console.log("approve ==>", res)
                    if (res != 0) {
                        let data = _float.div(res, Math.pow(10, 18))
                        if (data >= this.value) {
                            isApproved = true
                        } else {
                            isApproved = false
                        }
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
                        Eth.contract.contrart_AddLp.addr,
                        '10000000000000000000000000000000'
                    ] // 参数
                }

                // 发起授权
                await contractMethods(this.address, Eth.contract.contrart_USDT.addr, data).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                        resolve()
                    }
                }).catch(err => {
                    reject()
                    console.log('失败 ==>', err.message)
                    if (err.code == 110) {
                        // 交易拒绝
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                    } else if (err.code == 111 || err.code == 113) {
                        // 交易失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    } else if (err.code == 112) {
                        // 交易超时
                        Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                    } else {
                        // 失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    }
                })

            })
        },
        // 确认
        async confirm() {
            if (this.value == 0) {
                Toast({ message: this.i18n.Dividend.InpUsdt, icon: 'fail' })
                return
            }
            this.showLoading = true
            if (!this.isReferrer) {
                this.showLoading = false
                this.showInp = true
                // Toast({ message: this.i18n.Dividend.noReferrer, icon: 'fail' })
                return
            }
                
            // 验证授权 usdt
            await this.approved().then(async (res) => {
                let usdtIn, period, deadline, recommend
                usdtIn = this.vuex_web3.utils.toWei(_float.add(this.value, this.value_usdt) + '', 'ether')
                if (this.radio == 1) {
                    // 90 day
                    period = 90 * 86400
                } else {
                    // 180 day
                    period = 180 * 86400
                }
                deadline = parseInt(new Date().getTime() / 1000) + 1200 + ''
                recommend = this.inviteAddr
                console.log(usdtIn, period, deadline, recommend)

                let params = {
                    name: 'addLiquidity', // 方法名
                    inputs: [{
                        "name": "usdtIn",
                        "type": "uint256"
                    },{
                        "name": "period",
                        "type": "uint256"
                    },{
                        "name": "deadline",
                        "type": "uint256"
                    },{
                        "name": "_recommend",
                        "type": "address"
                    }],
                    arguments: [usdtIn, period, deadline, recommend], // 参数
                }
                
                await contractMethods(this.address, Eth.contract.contrart_AddLp.addr, params).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Dividend.addSuc, icon: 'success' })
                        this.value = ''
                        this.value_esg = '0.0'
                        this.value_usdt = '0.0'
                        this.value_esg2 = '0.0'
                        this.showInp = false
                        setTimeout(() => {
                            this.reload()
                        }, 2000);
                    }
                }).catch(err => {
                    console.log('失败 ==>', err.message)
                    this.showLoading = false
                    if (err.code == 110) {
                        // 交易拒绝
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                    } else if (err.code == 111 || err.code == 113) {
                        // 交易失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    } else if (err.code == 112) {
                        // 交易超时
                        Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                    } else {
                        // 失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    }
                })

            }).catch(err => {
                Toast({ message: "USDT" + this.i18n.Home.ApprovalFail, icon: 'fail' });
                this.showLoading = false
                this.reload()
            })
        },
        // 移除
        async remove() {
            if (this.chooseItem == null) {
                Toast({ message: this.i18n.Dividend.noChoose, icon: 'fail' })
                return
            }
            this.showLoading = true

            let deadline = parseInt(new Date().getTime() / 1000) + 1200 + ''
            let params = {
                name: 'removeLiquidity', // 方法名
                inputs:  [{
                    "name": "idx",
                    "type": "uint256"
                },{
                    "name": "deadline",
                    "type": "uint256"
                }],
                arguments: [this.chooseItem.idx, deadline], // 参数
            }
            
            await contractMethods(this.address, Eth.contract.contrart_AddLp.addr, params).then(async res => {
                if (res.code == 101) {
                    Toast({ message: this.i18n.Dividend.removeSuc, icon: 'success' })
                    setTimeout(() => {
                        this.reload()
                    }, 2000);
                }
            }).catch(err => {
                console.log('失败 ==>', err.message)
                this.showLoading = false
                if (err.code == 110) {
                    // 交易拒绝
                    Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                } else if (err.code == 111 || err.code == 113) {
                    // 交易失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                } else if (err.code == 112) {
                    // 交易超时
                    Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                } else {
                    // 失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                }
            })

        },
        // 获取可换取usdt数量
        async getUsdtAmount(idx) {
            let amount;
            await this.vuex_myContract.contrart_AddLp.methods.getRemoveLiquidityAmount(this.address, idx).call().then(res => {
                amount = this.vuex_web3.utils.fromWei(res + '', 'ether')
            })
            return amount;
        },

        // 展开选择
        showChoose() {
            if (this.actions.length == 0) {
                Toast({ message: this.i18n.EsgExchange.PositioningNo, icon: 'fail' })
            } else {
                this.showHold = true
            }
        },
        // 选择
        async onSelect(item) {
            console.log("item ==>", item)
            this.showLoading = true
            if (item.Surplus != 0) {
                this.showLoading = false
                Toast({ message: this.i18n.Dividend.Noremove, icon: 'fail' });
                return
            }
            this.remove_value = Number(item.liquidity).toFixed(4)
            this.chooseItem = item
            let usdtAmount = await this.getUsdtAmount(item.idx);
            this.remove_value2 = Number(usdtAmount).toFixed(4)
            this.showHold = false
            this.showLoading = false
        },

        // 领取收益
        async getEarnings(item) {
            if (item.RewardAmount == 0) {
                Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
                return
            }
            this.showLoading = true
            let params = {
                name: 'GetEsgReward', // 方法名
                inputs:  [{
                    "name": "idx",
                    "type": "uint256"
                }],
                arguments: [item.idx], // 参数
            }
            
            await contractMethods(this.address, Eth.contract.contrart_EsgRelease.addr, params).then(async res => {
                if (res.code == 101) {
                    this.showLoading = true
                    await this.getRatio()
                    await this.getBuylist()
                    await this.getUserReward()
                    this.showLoading = false
                }
            }).catch(err => {
                console.log('失败 ==>', err.message)
                this.showLoading = false
                if (err.code == 110) {
                    // 交易拒绝
                    Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                } else if (err.code == 111 || err.code == 113) {
                    // 交易失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                } else if (err.code == 112) {
                    // 交易超时
                    Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                } else {
                    // 失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                }
            })
        },
        // 分红 领取收益
        async getEarningsMoney() {
            if (this.dividends.earnings == 0) {
                Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
                return
            }
            this.showLoading = true
            let params = {
                name: 'GetLpReward', // 方法名
                inputs:  [],
                arguments: [], // 参数
            }
            
            await contractMethods(this.address, Eth.contract.contrart_LpReward.addr, params).then(async res => {
                if (res.code == 101) {
                    this.showLoading = true
                    await this.getUserReward()
                    this.showLoading = false
                }
            }).catch(err => {
                console.log('失败 ==>', err.message)
                this.showLoading = false
                if (err.code == 110) {
                    // 交易拒绝
                    Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                } else if (err.code == 111 || err.code == 113) {
                    // 交易失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                } else if (err.code == 112) {
                    // 交易超时
                    Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                } else {
                    // 失败
                    Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.Dividend_wrap {
    width: 100vw;
    height: 100vh;
    background: url(../assets/img/other_bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 100px 0 0 0;
    box-sizing: border-box;
    
    .Dividend_tab {
        padding: 50px 38px;
        padding-bottom: 100px;
        width: 100%;
        height: 100%;
        overflow: scroll;
        background-color: rgba(0, 0, 0, .8);
        box-sizing: border-box;
        .top_box {
            width: 100%;
            height: 65px;
            padding-bottom: 44px;
            /deep/ .van-tabs {
                *{
                    background-color: transparent;
                }
                .van-tabs__nav--line {
                    padding: 0;
                }
                .van-tabs__line {
                    background: url(../assets/img/tabs_bur.png) no-repeat center;
                    background-size: 38px 8px;
                    height: 8px;
                    bottom: 0;
                }
                .van-tab {
                    color: #AAAAAA;
                    margin-right: 70px;
                    font-size: 34px;
                    padding: 0;
                }
                .van-tab--active {
                    color: #fff;
                    font-weight: bold;
                }
            }
        }
        .add_box {
            width: 100%;
            .time_choose {
                padding: 29px 40px;
                background: rgba(255, 255, 255, .1);
                border-radius: 16px 16px 16px 16px;
                font-size: 26px;
                p {
                    font-size: 26px;
                    color: #999999;
                    margin-bottom: 25px;
                }
                /deep/ .van-radio-group {
                    height: 50px;
                    .van-radio {
                        flex: 1;
                        .van-radio__icon {
                            i {
                                border-color: #fff;
                                box-sizing: content-box;
                                background: rgba(255, 255, 255, .2);
                                &::before {
                                    transform: translateY(-1px);
                                    content: '';
                                }
                            }
                        }
                        .van-radio__icon--checked {
                            i {
                                border-color: #F69C15;
                                background: transparent;
                                &::before {
                                    content: '';
                                    width: 22px;
                                    height: 22px;
                                    background-color: #F69C15;
                                    border-radius: 50%;
                                }
                            }
                        }
                        .van-radio__label {
                            height: 35px;
                            color: #fff;
                            font-size: 28px;
                            span {
                                box-sizing: border-box;
                                padding: 5px 10px;
                                font-size: 26px;
                                color: #F69C15;
                                border-radius: 7px;
                                background-color: rgba(246, 156, 21, .3);
                                margin-left: 7px;
                                img {
                                    height: 20px;
                                }
                            }
                        }
                    }
                    .van-radio:nth-child(1) {
                        .van-radio__icon {
                            i {
                                border-color: #999999;
                            }
                        }
                        .van-radio__label {
                            color: #999999;
                        }
                    }
                }
            }
            .inp_box {
                margin-top: 20px;
                padding: 29px 40px;
                padding-bottom: 40px;
                background: rgba(255, 255, 255, .1);
                border-radius: 16px 16px 16px 16px;
                font-size: 26px;
                .balance_box {
                    text-align: right;
                    font-size: 26px;
                    color: #F69C15;
                    margin-bottom: 15px;
                    span {
                        margin-right: 22px;
                    }
                }
                .usdt_box, .esg_box {
                    width: 100%;
                    height: 110px;
                    border-radius: 8px 8px 8px 8px;
                    opacity: 1;
                    border: 2px solid #F69C15;
                    color: #fff;
                    position: relative;
                    .usdt_icon {
                        overflow: hidden;
                        position: absolute;
                        left: 30px;
                        top: 30px;
                        img {
                            width: 56px;
                            height: 56px;
                            margin-right: 17px;
                            border-radius: 50%;
                        }
                        span {
                            display: inline-block;
                            height: 56px;
                            line-height: 50px;
                            font-size: 28px;
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
                            color: #fff;
                            padding-right: 40px;
                            text-align: right;
                            font-size: 28px;
                            &::-webkit-input-placeholder {
                                color: #999999;
                                font-size: 28px;
                            }
                        }
                        .van-field__body {
                            input {
                                color: #999999;
                            }
                        }
                        &::after {
                            display: none;
                        }
                    }
                    /deep/ .inp_text {
                        .van-field__body {
                            input {
                                color: #fff;
                            }
                        }
                    }
                }
                .esg_box {
                    border: none;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 9px;
                    /deep/ .van-cell {
                        background-color: rgba(246, 156, 21, .1);
                    }
                }
                .jiaicon {
                    margin: 12px 0;
                    text-align: center;
                    position: relative;
                    span {
                        position: absolute;
                        left: 0;
                        top: 0;
                        color: #B4B4B4;
                    }
                    img {
                        width: 34px;
                    }
                }
                .lian_box {
                    position: relative;
                    margin-bottom: 10px;
                    .lian_taxt {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        color: #B4B4B4;
                        display: flex;
                        align-items: center;
                        span { 
                            margin-right: 18px;
                        }
                        img {
                            width: 30px;
                            height: 30px;
                            margin-left: 20px;
                        }
                    }
                    img {
                        height: 137px;
                    }
                }

            }
        }
        .remove_box {
            width: 100%;
            .choose_box {
                padding: 34px 40px 60px 40px;
                background: rgba(255, 255, 255, .1);
                border-radius: 16px 16px 16px 16px;
                font-size: 26px;
                .choose_price {
                    color: #B4B4B4;
                    font-size: 26px;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    span {
                        margin-right: 28px;
                    }
                    img {
                        width: 30px;
                        height: 30px;
                        margin-left: 20px;
                    }
                }
                .exchange {
                    width: 100%;
                    .icon_box {
                        margin-top: 13px;
                        img {
                            width: 56px;
                            height: 56px;
                            margin-right: 30px;
                        }
                        span {
                            color: #F69C15;
                            display: inline-block;
                            height: 56px;
                            line-height: 56px;
                            font-size: 28px;
                        }
                    }
                    .inp_box {
                        width: 100%;
                        height: 110px;
                        border-radius: 8px 8px 8px 8px;
                        opacity: 1;
                        border: 2px solid #F69C15;
                        color: #fff;
                        position: relative;
                        box-sizing: border-box;
                        .choose_box_inp {
                            width: 100%;
                            position: absolute;
                            left: 30px;
                            top: 30px;
                            display: flex;
                            align-items: center;
                            span {
                                color: #999999;
                                font-size: 28px;
                            }
                            img {
                                position: absolute;
                                right: 60px;
                                top: 0px;
                                width: 40px;
                            }
                        }
                        /deep/ .van-cell {
                            background-color: transparent;
                            width: 100%;
                            height: 100%;
                            .van-field__body {
                                height: 100%;
                                input {
                                    color: #fff;
                                    font-size: 26px;
                                    padding-left: 30px;
                                }
                            }
                            &::after {
                                display: none;
                            }
                        }
                        .rightinp {
                            /deep/ input {
                                padding-right: 80px;
                            }
                        }
                    }
                }
                .imgS {
                    width: 45px;
                    transform: rotate(180deg);
                    margin-bottom: 30px;
                    margin-left: 30px;
                    margin-top: -50px;
                }
                .usdt_box {
                    width: 100%;
                    height: 110px;
                    border-radius: 8px 8px 8px 8px;
                    opacity: 1;
                    border: 2px solid #F69C15;
                    color: #fff;
                    position: relative;
                    .usdt_icon {
                        overflow: hidden;
                        position: absolute;
                        left: 30px;
                        top: 30px;
                        img {
                            width: 56px;
                            height: 56px;
                            margin-right: 17px;
                        }
                        span {
                            display: inline-block;
                            height: 56px;
                            line-height: 56px;
                            font-size: 28px;
                            color: #1BA27A;
                        }
                    }
                    /deep/ .van-cell {
                        background-color: transparent;
                        width: 100%;
                        height: 100%;
                        color: #1BA27A;
                        .van-field__body {
                            height: 100%;
                        }
                        input {
                            width: 100%;
                            color: #1BA27A;
                            padding-right: 40px;
                            text-align: right;
                            font-size: 28px;
                        }
                        &::after {
                            display: none;
                        }
                        
                    }
                }
                .esg_box {
                    border: none;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 9px;
                    /deep/ .van-cell {
                        background-color: rgba(246, 156, 21, .1);
                    }
                }
            }
        }
        .buy_box {
            width: 100%;
            .buy_list {
                width: 100%;
                .list_box {
                    padding: 30px 40px;
                    background-color: rgba(255, 255, 255, .1);
                    border-radius: 16px;
                    margin-bottom: 30px;
                    .list_title {
                        font-weight: bold;
                        margin-bottom: 30px;
                        line-height: 30px;
                        p {
                            font-size: 28px;
                        }
                    }
                    .list_data {
                        width: 100%;
                        overflow: hidden;
                        line-height: 24px;
                        padding-bottom: 30px;
                        border-bottom: 1px solid rgba(112, 112, 112, .3);
                        >p {
                            font-size: 28px;
                            color: #FC9203;
                            font-weight: 600;
                            margin-right: 20px;
                        }
                        .data_box {
                            float: left;
                            // margin-right: 20px;
                            width: 33%;
                            p {
                                font-size: 22px;
                                color: #999999;
                                margin-bottom: 12px;
                            }
                            font {
                                color: #fff;
                                font-size: 26px;
                            }
                        }
                    }
                    .list_earnings {
                        width: 100%;
                        overflow: hidden;
                        line-height: 24px;
                        padding-top: 30px;
                        >p {
                            font-size: 30px;
                            color: #FC9203;
                            font-weight: 600;
                            margin-right: 20px;
                        }
                        .data_box {
                            width: 33%;
                            float: left;
                            p {
                                font-size: 22px;
                                color: #999999;
                                margin-bottom: 12px;
                            }
                            font {
                                color: #fff;
                                font-size: 26px;
                            }
                        }
                        .commit_btn {
                            float: right;
                            width: 160px;
                            height: 60px;
                            background: url(../assets/img/linBtn.png) no-repeat;
                            background-size: 100% 100%;
                            font-size: 26px;
                            line-height: 60px;
                            margin-top: 5px;
                            text-align: center;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }
        .money_box {
            width: 100%;
            .info_box {
                padding: 10px 40px 30px 40px;
                background-color: rgba(255, 255, 255, .1);
                border-radius: 16px;
                margin-bottom: 30px;
                .info_list {
                    padding-bottom: 6px;
                    border-bottom: 1px solid rgba($color: #707070, $alpha: .3);
                    margin-bottom: 40px;
                    .info_text {
                        padding: 15px 0;
                        box-sizing: border-box;
                        width: 50%;
                        margin-bottom: 34px;
                        overflow: hidden;
                        text-align: left;
                        p {
                            font-size: 22px;
                            color: #999999;
                            margin-bottom: 10px;
                        }
                        span {
                            font-size: 40px;
                            color: #fff;
                            font-weight: bold;
                        }
                    }
                    .info_text:nth-child(2) {
                        padding: 15px 30px;
                        background-color: rgba($color: #F69C15, $alpha: .1);
                        border-radius: 22px;
                        span {
                            color: #F69C15;
                        }
                    }
                    .info_text:nth-child(4) {
                        padding: 15px 30px;
                    }
                }
                .get_box {
                    width: 100%;
                    height: 60px;
                    .revenue_box {
                        line-height: 60px;
                        span:nth-child(1) {
                            font-size: 26px;
                            color: #999999;
                            margin-right: 20px;
                        }
                        span:nth-child(2) {
                            font-size: 28px;
                            color: #F69C15;
                        }
                    }
                    .btn_box {
                        .commit_btn {
                            float: right;
                            width: 160px;
                            height: 60px;
                            background: url(../assets/img/linBtn.png) no-repeat;
                            background-size: 100% 100%;
                            font-size: 26px;
                            line-height: 60px;
                            margin-top: 5px;
                            text-align: center;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }

    }
    .nullData {
        width: 100%;
        margin-top: 100px;
        margin-bottom: 100px;
        text-align: center;
        p {
            color: #999999;
            font-size: 24px;
        }
    }
    .confirm_btn {
        width: 367px;
        height: 88px;
        background: url(../assets/img/esgMoneyBtn.png) no-repeat;
        background-size: 100% 100%;
        font-size: 34px;
        margin: 0 auto;
        margin-top: 50px;
        box-sizing: border-box;
    }
    
}
.inp_pop {
    width: 662px;
    height: 668px;
    background: url(../assets/img/inp_pop.png) no-repeat;
    background-size: 100% 100%;
    padding: 74px 62px 82px;
    box-sizing: border-box;

    .inp_titile {
        height: 48px;
        font-size: 48px;
        font-weight: 600;
        color: #FC9203;
        padding: 0 0 70px;
    }

    .inp_group {
        width: 512px;
        height: 198px;
        background: url(../assets/img/inp_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 30px 24px;
        box-sizing: border-box;

        textarea {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            font-size: 28px;
            text-align: start;
            border: none;
            outline: none;
        }
    }

    .confirm_btn {
        width: 538px;
        height: 136px;
        background: url(../assets/img/btn_a.png) no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        font-weight: 600;
        margin: 68px 0 0;
        box-sizing: border-box;
    }
}

/deep/ .van-action-sheet {
    *{
        background-color: #333333;
        color: #fff;
        font-size: 34px;
    }
    max-height: 50%;
    margin-bottom: -40px;
    overflow: scroll;
    background-color: #333333 !important;
    .van-action-sheet__header {
        padding-top: 20px;
    }
    .van-action-sheet__item {
        height: 70px;
        background: url(../assets/img/b_s_r.png) no-repeat;
        background-size: 100% 100%;
        margin-bottom: 30px;
        &:last-child {
            margin: 0;
        }
    }
    .van-icon-cross:before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background: url(../assets/img/cha.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 50px;
        margin-top: 30px;
    }
    .van-action-sheet__content {
        text-align: center;
        padding: 40px 0 100px 0;
        .item_actions {
            padding: 20px 0px;
            .team_span {
                img {
                    width: 36px;
                }
            }
            &::after {
                content: '';
                display: block;
                margin-top: 20px;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #707070 51%, rgba(128, 128, 128, 0) 100%);
            }
        }
        span {
            color: #F69C15;
            font-size: 30px;
            margin-right: 180px;
            &:last-child {
                margin: 0;
            }
        }
    }
}

</style>