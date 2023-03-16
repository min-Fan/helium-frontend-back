<template>
    <div class="team_wrap">
        <div class="team_card f-d-c f-j-a-c">
            <div class="top_box">
                <!-- <div class="card_top f-j-sb">
                    <div class="row_box f-d-c f-a-c" v-for="(item,index) in peopleNum" :key="index">
                        <div class="row_title">{{i18n.Team[item.key]}}</div>
                        <div class="num_box f-j-a-c">
                            {{item.count}}
                            <div class="line"></div>
                        </div>
                    </div>
                </div> -->
                <div class="top_title">
                    {{ i18n.Team.BuyRecord }}
                </div>
                <div class="table_title">
                    <span>{{ i18n.Team.TableDate }}</span>
                    <span>{{ i18n.Team.TableMoney }}</span>
                    <span>{{ i18n.Team.TableLucky }}</span>
                    <span>{{ i18n.Team.TableHax }}</span>
                </div>
                <div class="table_box">
                    <div class="table_itemBox">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            :loading-text="i18n.Team.Loading"
                            :finished-text="i18n.Team.LoadingNone"
                            @load="onLoad"
                            offset="10">
                            <!-- <van-cell >  -->
                                <div class="table_item" v-for="(item, index) in tableItem" :key="index">
                                    <span>{{ item.Ts }}</span>
                                    <span>{{ Number(item.EthIn) / Math.pow(10, 18)}}</span>
                                    <span>{{ item.LuckNumber }}</span>
                                    <span class="oneText" @click="copy(item.TxHash)">{{ item.TxHash }}</span>
                                </div>
                            <!-- </van-cell> -->
                        </van-list>
                        <!-- <div class="nullRecord" v-if="tableItem.length == 0">
                            <span>{{ i18n.Team.NoData }}</span>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="bottom_box">
                <div class="card_bottom">
                    <div class="col_item f-d-c f-a-c" v-for="(item,index) in incomeList" :key="index">
                        <div class="col_title">{{i18n.Team[item.key]}}</div>
                        <div class="num_box f-j-a-c" v-if="item.key != 'OutStatus' && item.key != 'Recommend'">
                            {{item.count}}
                            <div class="line"></div>
                        </div>
                        <div class="num_box f-j-a-c" v-if="item.key == 'OutStatus'" style="font-size: 20px">
                            {{item.count == 0 ? i18n.Team.NoBureau : i18n.Team.YesBureau}}
                            <div class="line"></div>
                        </div>
                        <div class="num_box one_text f-j-a-c" v-if="item.key == 'Recommend'" style="font-size: 20px;line-height: 50px;padding: 0 10px" @click="copy(item.count)">
                            {{item.count}}
                            <div class="line"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="withdraw_btn f-j-a-c" @click="onWithdraw">{{i18n.Team.Withdraw}}</div>
        </div>

        <van-popup v-model="showTips" position="center">
            <div class="tips_pop f-d-c f-j-a-c">
                <div class="tips_title">{{i18n.Team.Tips}}</div>
                <div class="tips_text">{{i18n.Team.ConfirmWithdrawal}}</div>
                <div class="btn_box f-a-c f-j-sb">
                    <div class="btn f-j-a-c" @click="showTips=false">{{i18n.Team.Cancel}}</div>
                    <div class="btn f-j-a-c" @click="onConfirm">{{i18n.BlindBox.Confirm}}</div>
                </div>
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
    import { _float } from '@/assets/js/float'
    import { _tools, _date } from '@/assets/js/utils'
    import { Toast } from 'vant';
    import { contractMethods, GetTeamNumber, GetHistoryBuyBlindBox } from '@api'
    // 导入以太坊合约配置文件
    import { Eth } from '@eth'
    // 创建命名空间帮助者：createNamespacedHelpers
    import { createNamespacedHelpers, mapState, mapMutations } from "vuex";

    // 导入辅助函数
    const {
    mapState: web3MapState,
    mapMutations: web3MapMutations
    } = createNamespacedHelpers("web");
    export default {
        data() {
            return {
                // 人数
                peopleNum: [
                    { key: 'DirectPush', count: 0 },
                    { key: 'TeamSize', count: 0 }
                ],
                // 收益
                incomeList: [
                    { key: 'DirectPush', count: 0 }, // 直推人数
                    { key: 'TeamSize', count: 0 }, // 团队人数
                    { key: 'MyMoney', count: 0 },  // 我的入金
                    { key: 'TeamMoney', count: 0 },  // 团队入金
                    { key: 'OutStatus', count: 0 }, // 在局状态
                    { key: 'Recommend', count: "0x" },  // 推荐地址
                    { key: 'TotalRevenue', count: 0.0000 }, // 总收益
                    { key: 'WithdrawnRevenue', count: 0.0000 }, // 已提现
                    { key: 'TeamRevenue', count: 0.0000 }, // 团队收益
                    { key: 'GameDividends', count: 0.0000 }, // 游戏分红
                    { key: 'LuckyRevenue', count: 0.0000 }, // 幸运收益
                    { key: 'NuclearRevenue', count: 0.0000 }, // 核变收益
                    // { key: 'WithdrawableRevenue', count: 0.0000 },
                ],
                showTips: false,
                total: 0, // 总收益
                teamData: {}, // 收益数据
                showLoading: false, // 加载中
                tableItem: [], // 记录列表
                loading: false, // 加载中
                finished: false, // 没更多了
                offset: 0, // 偏移量
            }
        },
        beforeCreate() {
            // 异步队列 判断是否连接钱包访问路由
            setTimeout(() => {
                if (!this.$store.state.isLink) {
                    this.$router.push({path: '/'})
                }
            }, 0);
        },
        created() {
            // this.getRecord(this.offset)
            // 需要合约实例化后运行的函数 异步函数队列
            setTimeout(() => {
                if (this.vuex_myContract != {}) {
                    this.getTeamData()
                    this.getTeam() 
                    this.getRecommend()
                }
            }, 0)
        },
        computed: {
            ...mapState(['address', 'ethNetWork', 'isLink']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),

            i18n() {
                return this.$t('message');
            }
        },
        methods: {
            // 下拉获取购买记录
            async onLoad() {
                console.log(this.offset * 10)
                // 参数
                let data = {
                    Addr: this.address,
                    Offset: this.offset * 10, 
                    Limit: 10, 
                    Desc: true
                }
                await GetHistoryBuyBlindBox({...data}).then(res => {
                    this.offset += 1
                    if (res.code == 0) {
                        let data = res.data
                        console.log(data)
                        if (data.length == 0) {
                            this.finished = true;
                        } else {
                            data.map(v => {
                                v.LuckNumber = _tools.prefixInteger(v.LuckNumber, 3)
                                v.Ts = _date.getYMDHMS(v.Ts * 1000)
                                this.tableItem.push(v)
                            })
                            // 加载状态结束
                            this.loading = false;
                        }
                    }
                    // this.showLoading = false
                }).catch(err => {
                    console.log(err)
                    // this.showLoading = false
                })
                // await this.getRecord(this.offset * 50)
            },
            // 复制
            copy(value) {
                _tools.copyValue(value)
                Toast.success(this.i18n.Main.CopySuccess)
            },
            // 获取购买记录
            async getRecord(offset = 0) {
                this.showLoading = true
                let data = {
                    Addr: this.address,
                    Offset: offset, 
                    Limit: 50, 
                    Desc: true
                }
                await GetHistoryBuyBlindBox({...data}).then(res => {
                    if (res.code == 0) {
                        let data = res.data
                        console.log(data)
                        this.tableItem = data
                    }
                    this.showLoading = false
                }).catch(err => {
                    console.log(err)
                    this.showLoading = false
                })
            },
            // 获取推荐人地址
            getRecommend() {
                this.vuex_myContract.contrart_Helium.methods.RecommendOf(this.address).call().then(res => {
                    console.log(res)
                    if (res != '0x0000000000000000000000000000000000000000') {
                        this.incomeList[5].count = res
                    } else {
                        this.incomeList[5].count = res
                    }
                })
                this.vuex_myContract.contrart_Helium.methods.QueryUserEthIn().call({from: this.address}).then(res => {
                    // if (res == 0) {
                        this.incomeList[4].count = res
                    // }
                })
            },
            // 获取团队人数
            getTeam() {
                let params = {
                    Addr: this.address
                }
                GetTeamNumber(params).then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data
                        if (data != null) {
                            this.incomeList[0].count = data.direct_number
                            this.incomeList[1].count = data.team_number
                            this.incomeList[2].count = _tools.formatDecimal((data.eth_in / Math.pow(10, 18)), 4)
                            this.incomeList[3].count = _tools.formatDecimal((data.team_eth_in / Math.pow(10, 18)), 4)
                        }

                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 获取团队数据
            getTeamData() {
                // 查询数据
                this.vuex_myContract.contrart_Helium.methods.RewardOf(this.address).call().then(res => {
                    // console.log('data ==>', res)
                    let data = res
                    let obj = {
                        ReferralValue: Number(this.vuex_web3.utils.fromWei(data.ReferralValue, 'ether')).toFixed(4),  //团队收益
                        LuckyPollValue: Number(this.vuex_web3.utils.fromWei(data.LuckyPollValue, 'ether')).toFixed(4),  //幸运收益
                        NuclearDistValue: Number(this.vuex_web3.utils.fromWei(data.NuclearDistValue, 'ether')).toFixed(4),   //核变推荐人奖励（核变收益2，计算核变收益时与的相加）
                        NuclearDistRecoValue: Number(this.vuex_web3.utils.fromWei(data.NuclearDistRecoValue, 'ether')).toFixed(4),  //核变推荐人奖励（核变收益2，计算核变收益时与的相加）
                        DividendsValue: Number(this.vuex_web3.utils.fromWei(data.DividendsValue, 'ether')).toFixed(4),  // 分红
                        AlreadyWithdraw: Number(this.vuex_web3.utils.fromWei(data.AlreadyWithdraw, 'ether')).toFixed(4)  // 已经提现
                    }
                    this.teamData = obj
                    // 总收益
                    this.total = _tools.formatDecimal(Number(obj.ReferralValue) + Number(obj.LuckyPollValue) + Number(obj.NuclearDistValue) + Number(obj.NuclearDistRecoValue) + Number(obj.DividendsValue), 4)
                    this.incomeList[8].count = Number(obj.ReferralValue)
                    this.incomeList[9].count = Number(obj.DividendsValue)
                    this.incomeList[10].count = Number(obj.LuckyPollValue)

                    this.incomeList[11].count = Number(obj.NuclearDistValue) + Number(obj.NuclearDistRecoValue)
                    this.incomeList[6].count = Number(this.total) == 0 ? 0 : Number(this.total).toFixed(4)
                    this.incomeList[7].count = Number(obj.AlreadyWithdraw)
                    // this.incomeList[12].count = this.total - Number(obj.AlreadyWithdraw) <= 0 ? 0.0000 : this.total - Number(obj.AlreadyWithdraw)
                    // console.log(this.incomeList[0])


                })
            },

            onWithdraw() {
                this.showTips = true;
            },

            async onConfirm() {
                
                if (!this.isLink) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });

                // 判断有余额提现
                if (this.total - this.teamData.AlreadyWithdraw <= 0) {
                    Toast({ message: this.i18n.Team.noBalance, icon: 'fail' });
                    return
                }
                this.showLoading = true
                // 检测loading
                this.hiddenLoading()
                // 发起购买
                let params = {
                    name: 'UserWithDraw', // 方法名
                    inputs:  [],
                    arguments: [] // 参数
                }
                // 发起提现
                await contractMethods(this.address, Eth.contract.contrart_Helium.addr, params).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Team.WithdrawSuccess, icon: 'success' });
                        this.showTips = false;
                    }
                }).catch(err => {
                    // 失败
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
                    this.showLoading = false
                })
                
                
            },

            // 检测 loading 加载
            hiddenLoading() {
                // 检测 延迟 31s loading 加载是否还在加载
                setTimeout(() => {
                    if (this.showLoading) {
                        this.showLoading = false
                    }
                }, 31000);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .team_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 144px 56px 20px;
        box-sizing: border-box;

        .team_card {
            width: 638px;
            height: 1364px;
            overflow: hidden;
            background: url(../assets/img/team_card.png) no-repeat;
            background-size: 100% 100%;
            padding: 48px 33px 20px;
            box-sizing: border-box;
            .top_box {
                width: 100%;
                height: 300px;
                overflow: hidden;
                .top_title {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .table_title {
                    width: 100%;
                    display: flex;
                    margin-bottom: 10px;
                    span {
                        display: inline-block;
                        text-align: center;
                        flex: 1;
                        font-size: 20px;
                        color: #ADADAD;
                    }
                }
                .table_box {
                    width: 100%;
                    height: 110px;
                    // overflow-y: scroll;
                    // overflow-x: hidden;
                    overflow: hidden;
                    .nullRecord {
                        font-size: 20px;
                        text-align: center;
                        margin-top: 50px;
                        color: #ADADAD;
                    }
                    .table_itemBox {
                        height: 100%;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        .table_item {
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            span {
                                text-align: center;
                                width: 25%;
                                font-size: 22px;
                            }
                            .oneText {
                                margin: auto;
                                width: 25%;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                    /deep/ .van-list__finished-text {
                        line-height: 20px;
                        margin-top: 30px;
                    }
                }
            }
            .bottom_box {
                display: block;
                width: 100%;
                height: 100%;
                margin-top: 80px;
                overflow-y: scroll;
            }
            .card_top {
                 margin-bottom: 96px;

                 .row_box {
                     width: 100%;

                     &:last-child {
                         margin-left: 72px;
                     }
                 }

                .row_title {
                    height: 40px;
                    font-size: 24px;
                }

                .num_box {
                    width: 218px;
                    height: 110px;
                    background: url(../assets/img/m_box.png) no-repeat;
                    background-size: 100% 100%;
                    font-size: 60px;
                    font-weight: 600;
                    margin-top: 10px;
                    box-sizing: border-box;
                    position: relative;

                    .line {
                        width: 218px;
                        height: 4px;
                        background: #000000;
                        position: absolute;
                        left: 0;
                        top: 50%;
                    }
                }
            }

            .card_bottom {
                width: 100%;
                .col_item {
                    width: 50%;
                    float: left;
                    padding: 0 30px;
                    box-sizing: border-box;
                    margin-bottom: 26px;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }

                .col_title {
                    height: 40px;
                    font-size: 24px;
                    text-align: center;
                }

                .num_box {
                    width: 100%;
                    height: 110px;
                    background: url(../assets/img/l_box.png) no-repeat;
                    background-size: 100% 100%;
                    font-size: 60px;
                    font-weight: 600;
                    margin-top: 10px;
                    box-sizing: border-box;
                    position: relative;

                    .line {
                        width: 100%;
                        height: 4px;
                        background: #000000;
                        position: absolute;
                        left: 0;
                        top: 50%;
                    }
                }
            }

            .withdraw_btn {
                width: 100%;
                height: 136px;
                background: url(../assets/img/withdraw_btn.png) no-repeat;
                background-size: 100% 100%;
                font-size: 36px;
                font-weight: 600;
                margin: 16px 0 0;
                box-sizing: border-box;
            }
        }
    }

    .tips_pop {
        width: 662px;
        height: 508px;
        background: url(../assets/img/tips_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 74px 44px;
        box-sizing: border-box;

        .tips_title {
            height: 50px;
            font-size: 48px;
            font-weight: 600;
            color: #FC9203;
        }

        .tips_text {
            height: 38px;
            font-size: 36px;
            padding: 74px 0 104px;
        }

        .btn_box {
            width: 100%;
        }

        .btn {
            width: 270px;
            height: 100px;
            background: url(../assets/img/cancel.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;

            &:last-child {
                width: 270px;
                height: 100px;
                background: url(../assets/img/confirm.png) no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>