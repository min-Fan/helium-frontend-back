<template>
    <div class="ExchangeRecord" :class="hock ? 'ExchangeRecord_hock':''">
        <div class="record_top">
            <van-nav-bar fixed :placeholder="true" :title="typePage != 3 ? i18n.ExchangeRecord.Record : i18n.ExchangeRecord.MobilityRecord" left-arrow safe-area-inset-top @click-left="back">
                <template #right>
                    <img v-show="!hock" class="filter_icon" src="../../assets/v2img/filter_icon.png" alt="" @click="isShow = true">
                    <img v-show="hock" class="filter_icon" src="../../assets/v2img/filter_icon_hock.png" alt="" @click="isShow = true">
                </template>
            </van-nav-bar>
        </div>
        <div class="record_list">
            <div class="record_data">
                <div class="null_box" v-show="recordData.length == 0">
                    <span>Null</span>
                </div>
                <van-collapse v-model="activeName" accordion >
                    <!-- :is-link="typePage == 1 || typePage == 3" :disabled="!(typePage == 1 || typePage == 3)" -->
                    <van-collapse-item :name="index" v-for="(item, index) in recordData" :key="index" :disabled="typePage == 2" :is-link="typePage != 2">
                        <template #title>
                            <div class="record_item">
                                <div class="record_data clearfix" v-if="typePage == 1">
                                    <span class="mairu fl" v-show="item.type == 'buy'">{{i18n.Trading.Buy}}</span>
                                    <span class="maichu fl" v-show="item.type == 'sell'">{{i18n.Trading.SellOut}}</span>
                                    <span class="date fl">{{item.ts}}</span>
                                </div>
                                <div class="record_data clearfix" v-if="typePage == 2">
                                    <span class="mairu fl" v-show="item.map_type == 'staking'">{{i18n.ExchangeRecord.Eschange}}</span>
                                    <span class="maichu fl" v-show="item.map_type == 'redeem'">{{i18n.ExchangeRecord.Redemption}}</span>
                                    <span class="date fl">{{item.tsY}}</span>
                                </div>
                                <div class="record_data clearfix" v-if="typePage == 3">
                                    <span class="mairu fl" v-show="item.type == 'buy'">{{i18n.Mobility.Add}}</span>
                                    <span class="maichu fl" v-show="item.type == 'sell'">{{i18n.Mobility.Remove}}</span>
                                    <span class="date fl">{{item.ts}}</span>
                                </div>
                                <div class="record_detail" v-if="typePage == 1">
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
                                <div class="record_detail" v-if="typePage == 2">
                                    <div class="record_usdt">
                                        <div class="icon_usdt" v-if="item.map_type == 'staking'">
                                            <img src="../../assets/v2img/nft_icon.png" alt="">
                                            <span>{{item.name}}</span>
                                        </div>
                                        <div class="icon_usdt" v-if="item.map_type == 'redeem'">
                                            <img src="../../assets/v2img/esg_icon.png" alt="">
                                            <span>ESG</span>
                                        </div>
                                        <span v-if="item.map_type != 'staking'">{{Number(item.total_amount).toFixed(4)}}</span>
                                        <span v-if="item.map_type == 'staking' && item.number == 0">{{item.token_id}}</span>
                                        <span v-if="item.map_type == 'staking' && item.number != 0">{{item.number}}</span>
                                    </div>
                                    <div class="record_icon">
                                        <img v-show="!hock" src="../../assets/v2img/you_icons.png" alt="">
                                        <img v-show="hock" src="../../assets/v2img/you_icons_hock.png" alt="">
                                    </div>
                                    <div class="record_esg">
                                        <div class="icon_usdt" v-if="item.map_type == 'staking'">
                                            <img src="../../assets/v2img/esg_icon.png" alt="">
                                            <span>ESG</span>
                                        </div>
                                        <div class="icon_usdt" v-if="item.map_type == 'redeem'">
                                            <img src="../../assets/v2img/nft_icon.png" alt="">
                                            <span>{{item.name}}</span>
                                        </div>
                                        <span v-if="item.map_type != 'staking' && item.number == 0">{{item.token_id}}</span>
                                        <span v-if="item.map_type != 'staking' && item.number != 0">{{item.number}}</span>
                                        <span v-if="item.map_type == 'staking'">{{Number(item.total_amount).toFixed(4)}}</span>
                                    </div>
                                </div>
                                <div class="record_detail" v-if="typePage == 3">
                                    <div class="record_usdt">
                                        <div class="icon_usdt" v-if="item.type == 'buy'">
                                            <img src="../../assets/v2img/usdt_icon.png" alt="">
                                            <span>USDT</span>
                                        </div>
                                        <div class="icon_usdt" v-if="item.type == 'sell'">
                                            <img src="../../assets/v2img/esg_icon.png" alt="">
                                            <span>ESG</span>
                                        </div>
                                        <span v-if="item.type == 'buy'">{{Number(item.usdt_amount).toFixed(4)}}</span>
                                        <span v-if="item.type == 'sell'">{{Number(item.esg_amount).toFixed(4)}}</span>
                                    </div>
                                    <div class="record_icon">
                                        <img v-show="!hock" src="../../assets/v2img/you_icons.png" alt="">
                                        <img v-show="hock" src="../../assets/v2img/you_icons_hock.png" alt="">
                                    </div>
                                    <div class="record_esg">
                                        <div class="icon_usdt" v-if="item.type == 'buy'">
                                            <img src="../../assets/v2img/esg_icon.png" alt="">
                                            <span>ESG</span>
                                        </div>
                                        <div class="icon_usdt" v-if="item.type == 'sell'">
                                            <img src="../../assets/v2img/usdt_icon.png" alt="">
                                            <span>USDT</span>
                                        </div>
                                        <span v-if="item.type == 'buy'">{{Number(item.esg_amount).toFixed(4)}}</span>
                                        <span v-if="item.type == 'sell'">{{Number(item.usdt_amount).toFixed(4)}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="record_ontent" v-if="typePage == 1">
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
                        </div>
                        <!-- <div class="record_ontent" v-if="typePage == 2">
                          <div class="content_btn">
                            <div class="confirm_btn" v-if="item.isStake" @click="redeem">{{i18n.ExchangeRecord.Redemption}}</div>
                            <div class="confirm_btn no_btn" v-else @click="redeem">{{i18n.ExchangeRecord.NoRedemption}}</div>
                          </div>
                        </div> -->
                        <div class="record_ontent" v-if="typePage == 3">
                            <div class="content_item clearfix">
                                <span class="fl">{{i18n.Mobility.Nums}}（USDT）</span>
                                <span class="fr">{{Number(item.usdt_amount).toFixed(4)}}</span>
                            </div>
                            <div class="content_item clearfix">
                                <span class="fl">{{i18n.Mobility.Nums}}（ESG）</span>
                                <span class="fr">{{Number(item.esg_amount).toFixed(4)}}</span>
                            </div>
                            <div class="content_item clearfix">
                                <span class="fl">{{i18n.Mobility.Fene}}（LP）</span>
                                <span class="fr">{{Number(item.lp_amount).toFixed(4)}}</span>
                            </div>
                            <div class="content_item clearfix">
                                <span class="fl">{{i18n.Mobility.HandlingFee}}（ESG）</span>
                                <span class="fr">{{Number(item.fee).toFixed(4)}}</span>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
        </div>
        <filter-date :isShow="isShow" @closeClick="close" @resetRadio="resetRadio" @confirm="confirm">
            <div class="filter_item">
                <div class="item_title">
                    {{i18n.ExchangeRecord.Direction}}
                </div>
                <div class="radio_box">
                    <van-radio-group v-model="radio" direction="horizontal" checked-color="#13C087">
                        <van-radio name="1" v-if="typePage == 1">{{i18n.Trading.Buy}}</van-radio>
                        <van-radio name="2" v-if="typePage == 1">{{i18n.Trading.SellOut}}</van-radio>
                        <van-radio name="1" v-if="typePage == 2">{{i18n.ExchangeRecord.Eschange}}</van-radio>
                        <van-radio name="2" v-if="typePage == 2">{{i18n.ExchangeRecord.Redemption}}</van-radio>
                        <van-radio name="1" v-if="typePage == 3">{{i18n.Mobility.Add}}</van-radio>
                        <van-radio name="2" v-if="typePage == 3">{{i18n.Mobility.Remove}}</van-radio>
                    </van-radio-group>
                </div>
            </div>
        </filter-date>
    </div>
</template>

<script>
import { Toast } from 'vant';
import { _float } from '@/assets/js/float'
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { GetHistoryBuyEsg, GetNftMapHistory, GetHistoryAddLpEsg } from '@api'
import FilterDate from '@/components/comm/FilterDate';
// 导入以太坊合约配置文件
import { NftName } from '@eth'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    inject: ['reload'],
    name: 'ExchangeRecord',
    data() {
        return {
            typePage: 1,
            activeName: '',
            recordData: [],
            isShow: false,
            radio: '1',
            dateData: [], // 筛选周期
        }
    },
    created() {
        this.typePage = this.$route.query.type
        if (this.typePage == 1) {
            this.getHoldList('', 0)
        } else if (this.typePage == 2) {
            this.getNftHistory('', 0)
        } else if (this.typePage == 3) {
            this.getLpList('', 0 )
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock', 'holdRecordData']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    components: {
        FilterDate
    },
    watch: {
        $route(to, from) {
            if (to.path == '/ExchangeRecord') {
                this.$nextTick(() => {
                    this.typePage = this.$route.query.type
                })
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.path === '/Trading' || to.path === '/NFTexchange') {
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
    methods: {
        // 返回
        back() {
            this.$router.back();
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
            if (this.typePage == 1) {
                if (this.radio == 1) {
                    this.getHoldList('buy', limit)
                } else {
                    this.getHoldList('sell', limit)
                }
            } else if (this.typePage == 2) {
                if (this.radio == 1) {
                    this.getNftHistory('staking', limit)
                } else {
                    this.getNftHistory('redeem', limit)
                }
            } else if (this.typePage == 3) {
                if (this.radio == 1) {
                    this.getLpList('buy', limit)
                } else {
                    this.getLpList('sell', limit)
                }
            }
        },
        // 获取持仓列表
        async getHoldList(recordType, limit) {
            this.recordData = []
            let params = {
                addr: this.address,
                status: '',
                recordType,
                limit,
                desc: true
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
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
                    this.recordData = arr
                    console.log('this.allData ==>', this.allData)
                })
                Toast.clear()
            } catch (error) {
                Toast.clear()
                console.log('this.allData err ==>', error)
            }
        },
        // 获取Lp持仓列表
        async getLpList(recordType, limit) {
            this.recordData = []
            let params = {
                addr: this.address,
                status: '',
                recordType,
                limit,
                desc: true
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let recordList = await GetHistoryAddLpEsg({...params})
                let data = recordList.data
                let arr = []
                data.map(v => {
                    let obj = {
                        ID:  v.ID,
                        chain_record_idx:  v.chain_record_idx,
                        esg_amount:  '',
                        fee:  '',
                        is_team: '',
                        last_ts:  '',
                        lp_amount:  '',
                        norecieved:  '',
                        recommend:  '',
                        reward:  '',
                        sender:  '',
                        status:  v.status,
                        ts:  '',
                        type:  v.type,
                        usdt_amount: ''
                    }
                    // getMDHM
                    obj.ts = _date.getMDHM(v.ts * 1000)
                    obj.last_ts = _date.getMDHM(v.last_ts * 1000)
                    obj.usdt_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.usdt_amount), 'ether')
                    obj.esg_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.esg_amount), 'ether')
                    obj.lp_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.lp_amount), 'ether')
                    obj.fee = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.fee), 'ether')
                    obj.is_team = v.is_team == 1 ? true : false
                    arr.push(obj)
                })
                this.$nextTick(() => {
                    this.recordData = arr
                    console.log('this.allData ==>', this.allData)
                })
                Toast.clear()
            } catch (error) {
                Toast.clear()
                console.log('this.allData err ==>', error)
            }
        },
        objectSort(property) {
            return function (Obj1,Obj2) {
                return Obj1[property]-Obj2[property]
            }
        },

        // 获取兑换记录
        async getNftHistory(type, limit) {
            this.recordData = []
            let params = {
                addr: this.address,
                type,
                limit,
                desc: true
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let recordList = await GetNftMapHistory({...params})
                let data = recordList.data
                console.log(data)
                data.map(v => {
                    let obj = {
                        is_redeem: v.is_redeem,
                        map_type: v.map_type,
                        contract: v.contract,
                        token_id: v.token_id,
                        number: v.number,
                        total_amount: "",
                        ts: '',
                        tsY: '',
                        name: ''
                    }
                    obj.ts = _date.getMDHM(v.ts * 1000)
                    obj.tsY = _date.getYMDHMS(v.ts * 1000)
                    obj.total_amount = this.vuex_web3.utils.fromWei(v.total_amount, 'ether')
                    for (const key in NftName) {
                        if (NftName[key].contract == v.contract) {
                            obj.name = NftName[key].name
                        }
                    }
                    this.recordData.push(obj)
                })
                Toast.clear()
            } catch (error) {
                Toast.clear()
                console.log('this.allData err ==>', error)
            }
        },
        // 赎回
        async redeem() {

        }
    }
}
</script>

<style lang="scss" scoped>

.ExchangeRecord {
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
    /deep/ .van-collapse-item__title--expanded{
        .van-cell__right-icon::before {
            transform: rotate(90deg) translateZ(0) !important;
        }
    }
    /deep/ .van-collapse-item__title--disabled {
        color: #333;
    }
    /deep/ .van-icon-arrow:before {
        color: #333;
        font-weight: bold;
        transform: rotate(0) translateZ(0);
    }
    /deep/ .van-cell {
        display: block;
        padding: 32px 32px 0 32px;
        .van-icon {
            position: absolute;
            right: 24px;
            top: 32px;
        }
    }
    /deep/ .van-collapse-item__wrapper {
        padding: 0 32px;
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
                .content_btn {
                    width: 100%;
                    font-size: 28px;
                    color: #fff;
                    font-weight: bold;
                    text-align: center;
                    line-height: 30px;
                    margin: 10px 0;
                    .confirm_btn {
                        margin: auto;
                        padding: 20px 0;
                        width: 300px;
                        height: 30px;
                        background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
                        border-radius: 16px;
                    }
                    .no_btn {
                        background: #cccccc;
                    }
                }
                & .content_item:last-child {
                    margin: 0;
                }
            }
        }
    }
    /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
        display: none;
    }
    /deep/ .van-collapse-item__title--expanded::after {
        display: none;
    }
    /deep/ .van-collapse-item--border::after {
        display: none;
    }
    .record_list {
        padding-bottom: 108px;
    }
    .record_item {
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
                    justify-content: right;
                    font-size: 24px;
                    margin-bottom: 5px;
                    img {
                        height: 36px;
                        margin-right: 8px;
                    }
                }
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

.ExchangeRecord_hock {
    background-color: $back-qs-hock;

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
    /deep/ .van-cell {
        background-color: $back-qs-hock;
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
    /deep/ .van-collapse-item__wrapper .van-collapse-item__content {
        border-color: $bpos-border-b-hock;
    }
    /deep/ .van-collapse-item__wrapper .van-collapse-item__content .record_ontent .content_item {
        color: $text-qqs-hock;
    }
}
</style>
