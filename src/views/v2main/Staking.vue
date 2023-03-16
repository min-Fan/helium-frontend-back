<template>
    <div class="Staking" :class="hock ? 'Staking_hock':''">
        <div class="Staking_tab">
            <div class="total_box">
                <div class="get_btn">
                    <div class="get_nums">
                        <div class="text_record clearfix">
                            <span class="fl">{{i18n.Staking.NoGetNums}}（ESG）</span>
                        </div>
                        <div class="total">
                            <h1>{{Number(total).toFixed(4)| numberToCurrency}}</h1>
                        </div>
                    </div>
                    <div class="get_money" @click="getMoney">{{i18n.Staking.Get}}</div>
                </div>
                <div class="total_get clearfix">
                    <div class="total_nums fl clearfix">
                        <p>{{i18n.Staking.Released}}（ESG）</p>
                        <span class="fl">{{Number(daish).toFixed(4)}}</span>
                    </div>
                    <div class="revenue fl">
                        <p>{{i18n.Staking.GetNums}}（ESG）</p>
                        <div class="revenue_box">
                            <span>{{Number(getNums).toFixed(4)}}</span>
                        </div>
                    </div>
                </div>
                <div id="myEcharts" class="echarts"></div>
            </div>
            <div class="staking_title">
                <span>{{i18n.Staking.NftExchangeRecord}}</span>
            </div>
            <div class="record_box">
                <div class="null_box" v-if="recordList.length == 0">
                    <span>Null</span>
                </div>
                <div class="record_item" v-for="(item, index) in recordList" :key="index"> 
                    <div class="record_date clearfix">
                        <img class="fl" src="../../assets/v2img/nft_icon.png" alt="">
                        <span class="fl">{{item.name}}</span>
                        <i></i>
                        <span>{{item.ts}}</span>
                        <img v-show="!hock" class="fl" src="../../assets/v2img/you_icon.png" alt="" @click="toShareDetails(item)">
                        <img v-show="hock" class="fl" src="../../assets/v2img/you_icon_hock.png" alt="" @click="toShareDetails(item)">
                    </div>
                    <div class="record_nums">
                        <div class="esg_num clearfix">
                            <div v-if="item.number != 0">
                                <p>{{i18n.Staking.Nums}} (NFT)</p>
                                <span class="fl">{{item.number}}</span>
                            </div>
                            <div v-else>
                                <p>Token (NFT)</p>
                                <span class="fl">#{{item.token_id}}</span>
                            </div>
                        </div>
                        <div class="usdt_num">
                            <p>{{i18n.Staking.ExchangeNum}} (ESG)</p>
                            <span class="fl">{{Number(item.total_amount).toFixed(4)}}</span>
                        </div>
                        <div class="earning">
                            <p>{{i18n.Staking.getExchangeNum}} (ESG)</p>
                            <span class="fr">{{Number(item.already_release).toFixed(4)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
// 导入以太坊合约配置文件
import { Eth, NftName } from '@eth'
import { contractMethods, GetNftMapHistory } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'Staking',
    data() {
        return {
            total: 0,
            daish: 0,
            getNums: 0,
            recordList: [],
            option: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '0%',
                    left: 'center',
                    itemWidth: 18,
                    itemHeight: 6,
                    borderRadius: 30,
                    itemGap: 20,
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        name: 'Total From',
                        type: 'pie',
                        radius: ['61%', '76%'],
                        center: ['50%', '40%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 0,
                            borderColor: 'rgba(255,255,255, 1)',
                            borderWidth: 1
                        },
                        label: {
                            show: false,
                        },
                        data: [
                            { value: 0, name: '',itemStyle: {color: '#13C087'}},
                            { value: 0, name: '', itemStyle: {color: '#35AFCE'}},
                            { value: 0, name: '', itemStyle: {color: '#499BF7'}}
                        ]
                    },{
                        type: "gauge",
                        animation: true,
                        radius: "20%",
                        center: ["50%", "52%"],
                        axisLine: {
                            show: false,
                        },
                        pointer: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        title: {
                            offsetCenter: [0, "-50%"],
                            fontSize: 14,
                            color: "#999999",
                        },
                        detail: {
                            fontSize: 26,
                            offsetCenter: [0, "-140%"],
                            valueAnimation: true,
                            formatter: function(value) {
                                return value;
                            },
                            fontWeight: "normal",
                            color: "#333333"
                        },
                        data: [{
                            value: 0,
                            name: ""
                        }]
                    }
                ]
            }
        }
    },
    created () {
        if (this.hock) {
            this.$nextTick(() => {
                this.option.series[0].itemStyle.borderColor = 'rgba(1,13,8, 1)'
                this.option.legend.textStyle.color = 'rgba(245,245,245, 1)'
                this.option.series[1].title.color = '#999999'
                this.option.series[1].detail.color = '#F5F5F5'
            })
        }
        // 需要合约实例化后运行的函数 异步函数队列
        setTimeout(async () => {
            this.getTotalData()
            this.getNftHistory()
        })
        this.$nextTick(() => {
            let chartDom = document.getElementById("myEcharts");
            let myChart = echarts.init(chartDom);
            this.option.series[1].data[0].name = this.i18n.Staking.EsgTotal;
            this.option.series[0].data[0].name = this.i18n.Staking.Geted;
            this.option.series[0].data[1].name = this.i18n.Staking.WaitNums;
            this.option.series[0].data[2].name = this.i18n.Staking.NoGetNums;
            myChart.setOption(this.option);
        });
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),
        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    watch: {
        hock() {
            if (this.hock) {
                this.$nextTick(() => {
                    let chartDom = document.getElementById("myEcharts");
                    let myChart = echarts.init(chartDom);
                    this.option.series[0].itemStyle.borderColor = 'rgba(1,13,8, 1)'
                    this.option.legend.textStyle.color = 'rgba(245,245,245, 1)'
                    this.option.series[1].title.color = '#999999'
                    this.option.series[1].detail.color = '#F5F5F5'
                    myChart.setOption(this.option);
                })
            }
        }
    },
    methods: {
        // 跳转详情
        toShareDetails(item) {
            this.$router.push({name: 'StakDetails', params: {buyId: item.id, name: item.name}})
        },
        // 获取兑换记录
        async getNftHistory() {
            let params = {
                addr: this.address,
                type: 'staking',
                // redeem: false,
                limit: 0,
                desc: false
            }
            let recordList = await GetNftMapHistory({...params})
            let data = recordList.data
            console.log(data)
            data.map(v => {
                let obj = {
                    id: v.ID,
                    is_redeem: v.is_redeem,
                    map_type: v.map_type,
                    contract: v.contract,
                    token_id: v.token_id,
                    number: v.number,
                    total_amount: "",
                    already_release: '',
                    ts: '',
                    tsY: '',
                    name: ''
                }
                obj.ts = _date.getMDHM(v.ts * 1000)
                obj.tsY = _date.getYMDHMS(v.ts * 1000)
                obj.total_amount = this.vuex_web3.utils.fromWei(v.total_amount, 'ether')
                obj.already_release = this.vuex_web3.utils.fromWei(v.already_release, 'ether')
                if (!v.is_redeem) {
                    for (const key in NftName) {
                        if (NftName[key].contract == v.contract) {
                            obj.name = NftName[key].name
                        }
                    }
                    console.log(obj.name)
                    if (obj.number != 0) {
                        switch (v.token_id) {
                            case 1:
                                obj.name = 'Mask Baby A'
                                break;
                            case 2:
                                obj.name = 'Mask Baby B'
                                break;
                            case 3:
                                obj.name = 'Mask Baby C'
                                break;
                            case 4:
                                obj.name = 'Mask Baby D'
                                break;    
                            case 5:
                                obj.name = 'Mask Baby N'
                                break;
                            case 6:
                                obj.name = 'Mask Baby S'
                                break;
                            case 7:
                                obj.name = 'Mask Baby SS'
                                break;
                            case 8:
                                obj.name = 'Mask Baby SSS'
                                break;
                            case 9:
                                obj.name = 'Mask Baby SSSS'
                                break;
                            default:
                                break;
                        }
                    }
                    this.recordList.push(obj)
                }
            })
        },
        // 更新echarts语言
        updLange() {
            let chartDom = document.getElementById("myEcharts");
            let myChart = echarts.init(chartDom);
            if (this.hock) {
                this.option.series[0].itemStyle.borderColor = 'rgba(1,13,8, 1)'
                this.option.series[1].title.color = '#999999'
                this.option.series[1].detail.color = '#F5F5F5'
                this.option.legend.textStyle.color = 'rgba(245,245,245, 1)'
            } else {
                this.option.series[0].itemStyle.borderColor = 'rgba(255,255,255, 1)'
                this.option.legend.textStyle.color = 'rgba(51,51,51, 1)'
                this.option.series[1].title.color = '#999999'
                this.option.series[1].detail.color = '#333333'
            }
            this.$nextTick(() => {
                this.option.series[1].data[0].name = this.i18n.Staking.EsgTotal;
                this.option.series[0].data[0].name = this.i18n.Staking.Geted;
                this.option.series[0].data[1].name = this.i18n.Staking.WaitNums;
                this.option.series[0].data[2].name = this.i18n.Staking.NoGetNums;
                myChart.setOption(this.option);
            })
        },

        // 获取数据
        async getTotalData() {
            let chartDom = document.getElementById("myEcharts");
            let myChart = echarts.init(chartDom);
            await this.vuex_myContract.contrart_MapEsg.methods.QueryUEsgAmount().call({from: this.address}).then(res => {
                this.option.series[1].data[0].value = Number(this.vuex_web3.utils.fromWei(res[0])).toFixed(4)
                this.option.series[0].data[0].value = this.vuex_web3.utils.fromWei(res[1])
                this.option.series[0].data[1].value = this.vuex_web3.utils.fromWei(res[2])
                this.option.series[0].data[2].value = this.vuex_web3.utils.fromWei(res[3])
                this.total = this.vuex_web3.utils.fromWei(res[3])
                this.daish = this.vuex_web3.utils.fromWei(res[2])
                this.getNums = this.vuex_web3.utils.fromWei(res[1])
            })
            this.$nextTick(() => {
                myChart.setOption(this.option);
            })
        },  
        // 领取收益
        async getMoney() {
            if (this.total == 0) {
                Toast({ message: this.i18n.Staking.NoMoney, icon: 'fail' })
                return
            }

            let params = {
                name: 'ClameUEsgMap', // 方法名
                inputs: [],
                arguments: [], // 参数
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params).then(async res => {
                if (res.code == 101) {
                    Toast.clear();
                    Toast({ duration: 2000, message: this.i18n.Staking.Received, icon: 'success' });
                    this.$nextTick(() => {
                        this.getTotalData()
                        this.updLange()
                    })
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
        },
    },
}
</script>

<style lang="scss" scoped>
.Staking {
    height: 100%;
    background-color: #fff;
    .Staking_tab {
        height: 100%;
        padding: 48px 32px 68px 32px;
        box-sizing: border-box;
        overflow: auto;
        .total_box {
            padding: 48px;
            background: #FFFFFF;
            box-shadow: 0px 0px 12px 2px #DCF5ED;
            border-radius: 32px;
            .get_btn {
                display: flex;
                align-items: center;
                padding-bottom: 24px;
                margin-bottom: 24px;
                border-bottom: 2px solid #F5F5F5;
                .get_nums {
                    .text_record {
                        width: 100%;
                        margin-bottom: 16px;
                        span {
                            font-size: 28px;
                            color: #999999;
                        }
                    }
                    .total {
                        
                        h1 {
                            font-size: 48px;
                            font-weight: bold;
                        }
                    }
                }
                .get_money {
                    margin-left: auto;
                    width: 148px;
                    height: 56px;
                    background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
                    border-radius: 12px;
                    font-size: 28px;
                    text-align: center;
                    line-height: 56px;
                    color: #fff;
                }
            }
            .total_get {
                width: 100%;
                .total_nums, .revenue {
                    width: 50%;
                    margin-bottom: 30px;
                    p {
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
                    span {
                        color: #16CB8F;
                    }
                }
            }
            #myEcharts {
                width: 590px;
                height: 500px;
                margin: 0 auto;
            }
        }
        .staking_title {
            font-size: 28px;
            margin-top: 40px;
            span {
                display: block;
            }
        }
        .record_box {
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
                    & img:nth-of-type(2), & img:nth-of-type(3) {
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
                    .usdt_num {
                        padding-left: 50px;
                    }
                    .earning {
                        text-align: right;
                        color: #13C087;
                    }
                }
            }
            & .record_item:last-of-type {
                border: none;
            }

            
        }
    }
}

.Staking_hock {
    background-color: $back-qs-hock;
    .Staking_tab .total_box {
        background-color: $back-hock;
        box-shadow: none;
    }
    .Staking_tab .total_box .get_btn {
        border-bottom-color: $trading-border-hock;
    }
    .Staking_tab .record_box .record_item .record_date span:nth-of-type(1) {
        color: $text-qs-hock;
    }
    .Staking_tab .record_box .record_item .record_date span:nth-of-type(2) {
        color: $text-999-hock;
    }
    .Staking_tab .record_box .record_item {
        border-bottom-color: $trading-border-hock;
    }
}
</style>