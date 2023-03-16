<template>
    <div class="StakDetails" :class="hock ? 'StakDetails_hock':''">
        <div class="record_top">
            <van-nav-bar fixed :placeholder="true" :title="i18n.ShareDetails.ShifDetails" left-arrow safe-area-inset-top @click-left="back">
                <template #right>
                    <img v-show="!hock" class="filter_icon" src="../../assets/v2img/filter_icon.png" alt="" @click="isShow = true">
                    <img v-show="hock" class="filter_icon" src="../../assets/v2img/filter_icon_hock.png" alt="" @click="isShow = true">
                </template>
            </van-nav-bar>
        </div>
        <div class="record_list">
            <div class="record_item" v-for="(item, index) in recordList" :key="index">
                <div class="item_money">
                    <div class="node_title">
                        <span class="node_type">{{name}}</span>
                        <span class="node_date">{{item.tsY}}</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.Trading.Buy}}：</span>
                        <span class="fr ">{{Number(item.buy_amount).toFixed(4)}} ESG</span>
                    </div>
                    <div class="node_detail clearfix">
                        <span class="fl">{{i18n.Staking.Release}}：</span>
                        <span class="fr money">+{{Number(item.release_amount).toFixed(4)}} ESG</span> 
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="get_flxedbtn_box">
            <div class="get_flxedbtn">
                <div class="esg_money">
                    <span>{{i18n.Staking.Earnings}}：</span>
                    <span>100.0000 USDT</span>
                </div>
                <div class="btn_money">
                    {{i18n.Staking.Get}}
                </div>
            </div>
        </div> -->

        <filter-date :isShow="isShow" @closeClick="close" @resetRadio="resetRadio" @confirm="confirm"></filter-date>
    </div>
</template>

<script>
import FilterDate from '@/components/comm/FilterDate';
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { contractMethods, GetNftMapRelease } from '@api'
// 导入以太坊合约配置文件
import { Eth } from '@eth'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
import BigNumber from 'bignumber.js';
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'StakDetails',
    data() {
        return {
            isShow: false,
            date: [], // 日期
            buyId: 0, 
            name: '', 
            recordList: []
        }
    },
    created () {
        this.buyId = this.$route.params.buyId
        this.name = this.$route.params.name
        this.getMapRelease()
    },
    beforeRouteLeave (to, from, next) {
        if (to.path === '/Staking') {
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
        },
    },
    components: {
        FilterDate,
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
            this.isShow = false
            this.date = dateVal
            if (this.radio == 1) {
                this.getMapRelease(limit)
            } else {
                this.getMapRelease(limit)
            }
        },
        // 获取释放数据
        async getMapRelease(limit = 0) {
            this.recordList = []
            let params = {
                addr: this.address,
                map_id: this.buyId,
                limit,
                desc: false
            }
            console.log(params)
            let recordData = await GetNftMapRelease({...params})
            let data = recordData.data
            console.log(data)
            data.map(v => {
                let obj = {
                    buy_amount: "",
                    release_amount: "",
                    ts: ''
                }
                obj.tsY = _date.getYMDHMS(v.ts * 1000)
                obj.buy_amount = this.vuex_web3.utils.fromWei(v.buy_amount, 'ether')
                obj.release_amount = this.vuex_web3.utils.fromWei(v.release_amount, 'ether')
                this.recordList.push(obj)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.StakDetails {
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

    .record_list {
        padding: 0 32px 200px 32px;
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
                    color: #16CB8F;
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

.StakDetails_hock {
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
    .get_flxedbtn_box .get_flxedbtn {
        background-color: $back-hock;
        border: 2px solid $trading-border-hock;
    }
}
</style>