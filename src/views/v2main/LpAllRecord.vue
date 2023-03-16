<template>
    <div class="AllRecord" :class="hock ? 'AllRecord_hock':''">
        <div class="record_top">
            <van-nav-bar fixed :placeholder="true" :title="type == 1 ? i18n.AllRecord.Water : type == 2 ? i18n.AllRecord.DividendRecord : i18n.AllRecord.StarRecord" left-arrow safe-area-inset-top @click-left="back">
                <template #right>
                    <img v-if="type != 2 && !hock" class="filter_icon" src="../../assets/v2img/filter_icon.png" alt="" @click="isShow = true">
                    <img v-if="type != 2 && hock" class="filter_icon" src="../../assets/v2img/filter_icon_hock.png" alt="" @click="isShow = true">

                    <img v-if="type == 2 && !hock" class="filter_icon" src="../../assets/v2img/filter_icon.png" alt="" @click="isShow = true">
                    <img v-if="type == 2 && hock" class="filter_icon" src="../../assets/v2img/filter_icon_hock.png" alt="" @click="isShow = true">
                </template>
            </van-nav-bar>
            <!-- <van-nav-bar fixed :placeholder="true" title="分红记录" left-arrow safe-area-inset-top @click-left="back" v-if="type == 2"></van-nav-bar>
            <van-nav-bar fixed :placeholder="true" title="星链记录" left-arrow safe-area-inset-top @click-left="back" v-if="type == 3"></van-nav-bar> -->
        </div>
        <div class="record_item_box">
            <div class="record_item" v-for="(item, index) in list" :key="index">
                <div class="item_node" v-if="type == 1">
                    <div class="node_title">
                        <span class="node_type" v-if="item.type == 'node'">{{i18n.BPoS.Node}}</span>
                        <span class="node_type" v-if="item.type == 'starchain'">{{i18n.BPoS.StarLink}}</span>
                        <span class="node_date">{{item.ts}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Earnings}}：</span>
                        <span class="fr money" v-if="item.type == 'node'">+{{Number(item.reward_amount).toFixed(4)}} ESG</span>
                        <span class="fr money" v-if="item.type == 'starchain'">+{{Number(item.reward_amount).toFixed(4)}} ESG</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.ShareDetails.RevenueRatio}}：</span>
                        <div class="detail_box fr">
                            <span>{{item.percent * 100}}%</span>
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
                <div class="item_money" v-if="type == 2">
                    <div class="node_title">
                        <span class="node_type">{{i18n.BPoS.Dividend}}</span>
                        <span class="node_date">{{item.ts}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Earnings}}：</span>
                        <span class="fr money">+{{item.amount == 0 ? 0 : Number(item.amount).toFixed(4)}} ESG</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.WeightedDividend}}：</span>
                        <div class="detail_box fr">
                            <span >{{Number(item.percent * 100).toFixed(4)}}%</span>
                        </div>
                    </div>
                </div>
                <div class="item_star" v-if="type == 3">
                    <div class="node_title">
                        <span class="node_type">{{i18n.BPoS.StarLink}}</span>
                        <span class="node_date">{{item.ts}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl" v-if="item.type == 'buy'">{{i18n.LpBPoS.Add}}：</span>
                        <span class="fl" v-if="item.type == 'sell'">{{i18n.BPoS.Reduction}}：</span>
                        <span class="fr money" v-if="item.type == 'buy'">+{{Number(item.amount).toFixed(4)}} ESG</span>
                        <span class="fr money" v-else>-{{Number(item.amount).toFixed(4)}} ESG</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.BPoS.Revenue}}：</span>
                        <div class="detail_box fr">
                            <span >{{item.percent * 100}}%</span>
                            <!-- <div v-show="item.type == 'node' && item.symbol != ''">
                                <i></i>
                                <span class="type">{{item.symbol}}</span>
                            </div> -->
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
        <div class="get_flxedbtn_box" v-if="type == 2">
            <div class="get_flxedbtn">
                <div class="esg_money">
                    <span>{{i18n.Staking.Earnings}}：</span>
                    <span>{{Number(reward).toFixed(4)}} ESG</span>
                </div>
                <div class="btn_money" @click="getEarnings">
                    {{i18n.Staking.Get}}
                </div>
            </div>
        </div>
        <filter-date :isShow="isShow" @closeClick="close" @resetRadio="resetRadio" @confirm="confirm">
            <div class="filter_item" v-if="type != 2">
                <div class="item_title">
                    {{i18n.ExchangeRecord.Direction}}
                </div>
                <div class="radio_box">
                    <van-radio-group v-model="radio" direction="horizontal" checked-color="#13C087" v-if="type == 1">
                        <van-radio name="1">{{i18n.BPoS.Node}}</van-radio>
                        <van-radio name="2">{{i18n.BPoS.StarLink}}</van-radio>
                    </van-radio-group>
                    <van-radio-group v-model="radio" direction="horizontal" checked-color="#13C087" v-if="type == 3">
                        <van-radio name="1">{{i18n.BPoS.Add}}</van-radio>
                        <van-radio name="2">{{i18n.BPoS.Reduction}}</van-radio>
                    </van-radio-group>
                </div>
            </div>
        </filter-date>
        <filter-calendar :isShow="isShowCalendar" @setIsShow="setIsShow" @setDate="setDate"></filter-calendar>
    </div>
</template>

<script>
import FilterDate from '@/components/comm/FilterDate';
import FilterCalendar from '@/components/comm/FilterCalendar';
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
import { contractMethods, GetLpReceivedLiquidity, GetHistoryLpWhitelistRecord, LpDiffRecord } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    inject: ['reload'],
    name: 'AllRecord',
    props: {

    },
    data() {
        return {
            type: 1,
            isShow: false,
            isShowCalendar: false,
            list: [],
            radio: '1',
            dateData: [], // 时间
            reward: 0, // 可领分红
        }
    },
    created () {
        this.$nextTick(() => {
            this.type = this.$route.query.type
            this.list = this.$route.params.data
            console.log("list ==>", this.list)
        })
        setTimeout(async () => {
            this.getEarningAmount()
        }, 0);
    },
    beforeRouteLeave (to, from, next) {
        if (to.path === '/LpBPoS') {
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
        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        }
    },
    components: {
        FilterDate,
        FilterCalendar
    },
    methods: {
        // 返回
        back() {
            this.$router.back();
        },
        // 复制
        copyAddr(val) {
            _tools.copyValue(val)
            Toast({ message: this.i18n.Main.CopySuccess, icon: 'passed', className: 'successToast' });
        },
        // close
        close(val) {
            this.isShow = val
        },
        // 重置按钮
        resetRadio() {
            this.radio = '1'
        },
        // 确认返回时间数组
        confirm(dateVal, limit) {
            this.dateData = dateVal
            if (this.type == 1) {
                if (this.radio == 1) {
                    this.getNodes(limit, 'node')
                } else {
                    this.getNodes(limit, 'starchain')
                }
            } else if (this.type == 3) {
                if (this.radio == 1) {
                    this.getStars(limit, 'buy')
                } else {
                    this.getStars(limit, 'sell')
                }
            } else if (this.type == 2) {
                this.getDividend(limit)
            }

        },
        // 关闭日历
        setIsShow(val) {
            this.isShowCalendar = val
        },
        // 设置日期
        setDate(val) {
            this.dateData = val
        },
        // 获取可领取金额
        async getEarningAmount() {
            let res = await this.vuex_myContract.contrart_UlpReward.methods.getReward(this.address).call()
            this.reward = this.vuex_web3.utils.fromWei(res, 'ether')
        },

        // 获取节点数据
        async getNodes(limit = 0, type = '') {
            this.list = []
            let params = {
                addr: this.address,
                desc: true,
                limit,
                type
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let res = await GetLpReceivedLiquidity({...params})
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
                    this.list.push(obj)
                })
                Toast.clear()
                console.log('nodelist ==>', this.list)
            } catch (error) {
                console.log('nodelist err==>', error)
                Toast.clear()
            }
        },

        // 获取分红数据
        async getDividend(limit = 0) {
            this.list = []
            let params = {
                addr: this.address,
                limit,
                desc: true
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let res = await LpDiffRecord({...params})
                let data = res.data

                data.map((v, i) => {
                    let obj = {
                        amount: '',
                        id: v.id,
                        percent: v.percent,
                        ts: '',
                        user: v.user
                    }
                    obj.ts = _date.getYMDHMS(v.ts * 1000)
                    obj.amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.amount), 'ether')
                    this.list.push(obj)
                })
                Toast.clear()
                console.log('dividend list ==>', this.list)
            } catch (error) {
                Toast.clear()
                console.log('dividend err ==>', error)
            }
        },

        // 获取星链数据
        async getStars(limit = 0, type = '') {
            this.list = []
            let params = {
                addr: this.address,
                type,
                limit,
                desc: true,
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let res = await GetHistoryLpWhitelistRecord({...params})
                let data = res.data
                console.log("stars ==>", data)
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
                    this.list.push(obj)
                })
                Toast.clear()
                console.log('starslist ==>', this.list)
            } catch (error) {
                Toast.clear()
                console.log('starslist err==>', error)
            }
        },

        // 领取收益
        async getEarnings() {
            if (this.reward == 0) {
                Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
                return
            }
            // contrart_UlpReward
            let params = {
                name: 'GetLpReward', // 方法名
                inputs: [],
                arguments: [], // 参数
            }
            // 移仓
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            await contractMethods(this.address, Eth.contract.contrart_UlpReward.addr, params).then(async res => {
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
        }
    },

}
</script>

<style lang="scss" scoped>
.AllRecord {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    .record_top {
        /deep/ .van-nav-bar__title {
            color: #333;
            font-size: 36px;
            font-weight: bold;
        }
        /deep/ .van-nav-bar__left i{
            color: #333;
        }
        .filter_icon {
            height: 38px;
        }
    }
    .record_item_box {
        padding: 0 32px;
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
                    color: #16CB8F !important;
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

.AllRecord_hock {
    background-color: $back-qs-hock;
    .record_top {
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
    .record_item_box .record_item .node_detail .detail_box span {
        color: $text-qs-hock;
    }
    .record_item_box .record_item {
        border-bottom-color: $trading-border-hock;
    }
    .get_flxedbtn_box .get_flxedbtn {
        background-color: $back-hock;
        border: 2px solid $trading-border-hock;
    }
}
</style>
