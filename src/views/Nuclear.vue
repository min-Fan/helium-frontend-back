<template>
    <div class="nuclear_wrap">
        <div class="nuclear_box f-j-a-c">
            <img src="../assets/img/power_box.gif" alt="" class="power_gif">

            <img src="../assets/img/query.png" alt="" class="query" @click="openPowerQuery">

            <div class="power">
                <div class="power_title">{{i18n.Nuclear.NuclearChange}}</div>

                <div class="change_num f-a-c">
                    <div class="col f-d-c f-j-a-c">
                        <div>{{ Htarget }}</div>
                        <div>{{i18n.Nuclear.Target}}</div>
                    </div>

                    <div class="col f-d-c f-j-a-c">
                        <div>{{ nowProgress }}</div>
                        <div>{{i18n.Nuclear.Schedule}}</div>
                    </div>
                </div>

                <div class="count f-j-a-c">{{ stage }}</div>
            </div>
        </div>

        <div class="date_box f-j-sa-a-c">
            <div class="date_box_title">{{i18n.Nuclear.EntropyCountdown}}</div>

            <div class="date_item f-d-c f-a-c">
                <div class="sub_title">DAYS</div>
                <div class="date f-j-a-c">
                    {{ days }}
                    <div class="line"></div>
                </div>
            </div>

            <div class="date_item f-d-c f-a-c">
                <div class="sub_title">HOURS</div>
                <div class="date f-j-a-c">
                    {{ hours }}
                    <div class="line"></div>
                </div>
            </div>

            <div class="date_item f-d-c f-a-c">
                <div class="sub_title">MINUTES</div>
                <div class="date f-j-a-c">
                    {{ minutes }}
                    <div class="line"></div>
                </div>
            </div>

            <div class="date_item f-d-c f-a-c">
                <div class="sub_title">SECONDS</div>
                <div class="date f-j-a-c">
                    {{ seconds }}
                    <div class="line"></div>
                </div>
            </div>
        </div>

        <div class="into_box">
            <div class="row f-j-sb">
                <div>{{i18n.Nuclear.Overview}}:</div>
                <div>HELIUM-3</div>
            </div>

            <div class="row f-j-sb">
                <div>{{i18n.Nuclear.MaximumSupply}}:</div>
                <div>{{ total | numberToCurrency }} UESG</div>
            </div>

            <div class="row f-j-sb">
                <div>{{i18n.Nuclear.HoldingAddress}}:</div>
                <div>{{ addrUser }} {{i18n.Nuclear.Per}}</div>
            </div>

            <div class="row f-j-sb">
                <div>{{i18n.Nuclear.Circulation}}:</div>
                <div>{{ circulation | numberToCurrency }} UESG</div>
            </div>
        </div>

        <van-popup v-model="showQuery" position="center">
            <div class="query_pop">
                <img src="../assets/img/close.png" alt="" class="close" @click="showQuery = false">
                <div class="pop_title">{{i18n.BlindBox.Introduce}}</div>
                <div class="pop_content" v-html="i18n.Nuclear.IntrContent"></div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { _float } from '@/assets/js/float'
    import { _tools } from '@/assets/js/utils'
    import { GetHolderAddr } from '@api'
    // 导入以太坊合约配置文件
    import { Eth } from '@eth'
    //创建命名空间帮助者：createNamespacedHelpers
    import { createNamespacedHelpers, mapState, mapMutations } from "vuex";

    //导入辅助函数
    const {
    mapState: web3MapState,
    mapMutations: web3MapMutations
    } = createNamespacedHelpers("web");
    export default {
        data() {
            return {
                showQuery: false,
                Htarget: 0, // 核变目标
                nowProgress: 0, // 当前进度
                timer: null, // 倒计时
                days: 0, // 天
                hours: 0, // 时
                minutes: 0, // 分
                seconds: 0, // 秒
                Countdown: 0, // 倒计时
                countdownTimer: null, // 倒计时定时器

                total: '', // 总供应量
                addrUser: '', // 持有人
                transfer: 0, // 交易量
                stage: '', // 阶段
                circulation: '', // 销毁量
            }
        },
        computed: {
            ...mapState(['address', 'ethNetWork', 'isLink']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),

            i18n() {
                return this.$t('message');
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
            // 需要合约实例化后运行的函数 异步函数队列
            setTimeout(() => {
                if (this.vuex_myContract != {}) {
                    this.getHetarget()
                    this.getTimer()
                    this.getTotal()
                    this.getCirculation()
                }
            }, 0)
            this.getHolderNumber()
        },

        mounted() {
            this.timer = setInterval(() => {
                this.getTimer()
                this.getHetarget()
            }, 15000)

            this.countdownTimer = setInterval(() => {
                this.countdown()
            }, 1000)


        },

        beforeDestroy() {
            // 清空定时器
            clearInterval(this.timer)
            clearInterval(this.countdownTimer)
        },

        methods: {
            openPowerQuery() {
                this.showQuery = true;
            },
            // 获取核变目标 
            async getHetarget() {
                // 获取目标数组
                let arr = []
                await this.vuex_myContract.contract_Config.methods.getNuclearDistStepAmount().call().then(res => {
                    let data = res 
                    data.map(v => {
                        let num = Number(_float.div(v , Math.pow(10, 18)))
                        arr.push(num)
                    })
                    
                })
                // 获取当前进度
                this.vuex_myContract.contrart_Helium.methods.NESplitAllValue().call().then(res => {
                    let data = Number(_float.div( res, Math.pow(10,18))).toFixed(4)
                    this.nowProgress = data
                })
                // 获取当前阶段
                this.vuex_myContract.contrart_Helium.methods.nuclieDistPeriod().call().then(res => {
                    this.Htarget = arr[res]
                    this.stage = Number(res) + 1
                })
            },

            // 获取倒计时
            async getTimer() {
                // 查询合约倒计时
                await this.vuex_myContract.contrart_Helium.methods.EntropyTsToEnd().call().then(res => {
                    let data = parseInt(res / Math.pow(10, 18))
                    // 记录倒计时
                    this.Countdown = data
                    this.days = parseInt(data / (60 * 60 * 24)) < 10 ? "0" + parseInt(data / (60 * 60 * 24)) : parseInt(data / (60 * 60 * 24))
                    this.hours = parseInt((data % (60 * 60 * 24)) / (60 * 60))  < 10 ? "0" + parseInt((data % (60 * 60 * 24)) / (60 * 60)) : parseInt((data % (60 * 60 * 24)) / (60 * 60))
                    this.minutes = parseInt((data % (60 * 60)) / 60) < 10 ? "0" + parseInt((data % (60 * 60)) / 60) : parseInt((data % (60 * 60)) / 60)
                    this.seconds = data % 60 < 10 ? "0" + data % 60 : data % 60
                })
            },

            // 倒计
            async countdown() {
                if (this.Countdown == 0) return
                this.Countdown -= 1
                let data = this.Countdown
                this.days = parseInt(data / (60 * 60 * 24)) < 10 ? "0" + parseInt(data / (60 * 60 * 24)) : parseInt(data / (60 * 60 * 24))
                this.hours = parseInt((data % (60 * 60 * 24)) / (60 * 60))  < 10 ? "0" + parseInt((data % (60 * 60 * 24)) / (60 * 60)) : parseInt((data % (60 * 60 * 24)) / (60 * 60))
                this.minutes = parseInt((data % (60 * 60)) / 60) < 10 ? "0" + parseInt((data % (60 * 60)) / 60) : parseInt((data % (60 * 60)) / 60)
                this.seconds = data % 60 < 10 ? "0" + data % 60 : data % 60
            },

            // 获取总供应量 ...
            async getTotal() {
                // 总供应量
                this.vuex_myContract.contrart_NowTokens.methods.totalSupply().call().then(res => {
                    let data = res
                    this.total = (data / Math.pow(10, 18)).toFixed(0)
                })

            },

            // 获取销毁量
            getCirculation() {
                // 总供应量
                this.vuex_myContract.contrart_NowTokens.methods.balanceOf(Eth.contract.contrart_Helium.addr).call().then(res => {
                    let data = _tools.formatDecimal(_float.div(res, Math.pow(10, 18)) + 518322.9594, 4)
                    this.circulation = data
                })
            },

            // 获取持有人数
            getHolderNumber() {
                // 后端接口
                GetHolderAddr().then(res => {
                    if (res.code == 0) {
                        let data = res.data
                        this.addrUser = data
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .nuclear_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 134px 56px 28px;
        box-sizing: border-box;
    }

    .nuclear_box {
        width: 638px;
        height: 808px;
        background: url(../assets/img/nuclear_box.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        z-index: 11;

        .power_gif {
            width: 580px;
            height: 768px;
            position: absolute;
            z-index: -11;
        }

        .query {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 28px;
            right: 28px;
        }

        .power {
            width: 520px;
            height: 168px;
            background: url(../assets/img/power.png) no-repeat;
            background-size: 100% 100%;
            box-sizing: border-box;
            position: absolute;
            bottom: 18px;

            .power_title {
                font-size: 20px;
                font-weight: 600;
                color: #00D887;
                text-shadow: 0px 0px 6px #00D887;
                margin: 12px 0 0 110px;
            }

            .change_num {
                margin: 40px 0 0 144px;

                .col {

                    &:first-child {
                        margin-right: 30px;
                    }

                    &:last-child {
                        div {
                            color: #FF9800;
                            text-shadow: 0px 0px 18px #FF9800;

                            &:last-child {
                                color: #FF9800;
                                text-shadow: 0px 0px 18px #FF9800;
                            }
                        }
                    }

                    div {
                        font-size: 32px;
                        font-weight: 600;
                        color: #00D887;
                        text-shadow: 0px 0px 6px #00D887;

                        &:last-child {
                            color: #FFFFFF;
                            font-size: 12px;
                            font-weight: normal;
                        }
                    }
                }
            }

            .count {
                width: 120px;
                height: 120px;
                font-size: 40px;
                font-weight: 600;
                position: absolute;
                top: 16px;
                left: 4px;
            }
        }
    }

    .date_box {
        width: 638px;
        height: 232px;
        background: url(../assets/img/date_box.png) no-repeat;
        background-size: 100% 100%;
        margin: 31px 0;
        padding: 55px 42px 0;
        box-sizing: border-box;
        position: relative;

        .date_box_title {
            font-size: 24px;
            position: absolute;
            top: 32px;
        }

        .date_item {
            .sub_title {
                font-size: 16px;
            }

            .date {
                width: 110px;
                height: 116px;
                font-size: 48px;
                font-weight: 600;
                background: url(../assets/img/number_bg.png) no-repeat;
                background-size: 100% 100%;
                position: relative;

                .line {
                    width: 110px;
                    height: 4px;
                    background: #000000;
                    position: absolute;
                    left: 0;
                    top: 50%;
                }
            }
        }
    }

    .into_box {
        width: 638px;
        height: 264px;
        background: url(../assets/img/nuclear_into_box.png) no-repeat;
        background-size: 100% 100%;
        margin: 31px 0;
        padding: 36px;
        box-sizing: border-box;

        .row {
            width: 100%;
            font-size: 24px;
            line-height: 40px;
            padding-bottom: 8px;
        }
    }

        .query_pop {
        width: 662px;
        height: 792px;
        background: url(../assets/img/intr_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 48px 45px;
        box-sizing: border-box;
        position: relative;

        .close {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 52px;
            right: 42px;
        }

        .pop_title {
            height: 40px;
            font-size: 36px;
            padding: 0 0 062px;
            text-align: center;
            font-weight: 600;
        }

        .pop_content {
            height: 600px;
            font-size: 24px;
            line-height: 40px;
            overflow: scroll;
            word-break: break-all;
            text-indent: 2em;
        }
    }
</style>