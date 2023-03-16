<template>
    <div class="GetRecord" :class="hock ? 'GetRecord_hock':''">
        <div class="record_top">
            <van-nav-bar fixed :placeholder="true" :title="i18n.GetRecord.Record" left-arrow safe-area-inset-top @click-left="back">
                <template #right>
                    <img v-show="!hock" class="filter_icon" src="../../assets/v2img/filter_icon.png" alt="" @click="isShow = true">
                    <img v-show="hock" class="filter_icon" src="../../assets/v2img/filter_icon_hock.png" alt="" @click="isShow = true">
                </template>
            </van-nav-bar>
        </div>
        <div class="record_box">
            <div class="null_box" v-show="record.length == 0">
                <span>Null</span>
            </div>
            <div class="record_item clearfix" v-for="(item, index) in record" :key="index">
                <div class="record_name">
                    <span v-if="item.is_team == 1">Major Position</span>
                    <span v-else>Position {{item.chain_record_idx + 1}}</span>
                    <span>{{item.ts}}</span>
                </div>
                <div class="record_usdt">
                    <span>{{Number(item.reward_amount).toFixed(4)}} ESG</span>
                    <span class="success"><i></i>{{i18n.GetRecord.Success}}</span>
                </div>
            </div>
        </div>
        <filter-date :isShow="isShow" @closeClick="close" @confirm="confirm"></filter-date>
        <!-- <filter-calendar :isShow="isShow" @setIsShow="setIsShow" @setDate="setDate"></filter-calendar> -->
    </div>
</template>

<script>
import FilterDate from '@/components/comm/FilterDate';
import { BigNumber } from 'bignumber.js'
import { _float } from '@/assets/js/float'
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { Toast } from 'vant';
import { GetLpRecordGetReward } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'GetRecord',
    data() {
        return {
            isShow: false,
            record: [],
            date: [], // 日期
        }
    },
    created() {
        // 需要合约实例化后运行的函数 异步函数队列
        setTimeout(async () => {
            Toast.loading({
                duration: 30000,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            await this.getRecord()
            Toast.clear();
        })
    },
    watch: {
        
    },
    components: {
        FilterDate,
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),
        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
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
        // 确认返回时间数组
        confirm(dateVal, limit) {
            this.date = dateVal
            this.getRecord(limit)
        },
        // 获取记录
        async getRecord(limit = 0) {
            let params = {
                addr: this.address,
                desc: true,
                limit,
            }
            Toast.loading({
                duration: 0,
                message: this.i18n.Loading,
                forbidClick: true,
            });
            try {
                let record = await GetLpRecordGetReward({...params})
                let data = record.data
                console.log(data)
                let arr = []
                Promise.all(data.map(v => {
                    let obj = {
                        chain_record_idx: '',
                        id: '',
                        is_team: '',
                        reward_amount: '',
                        ts: '',
                        txhash: '',
                        user: ''
                    }
                    obj.ts = _date.getYMDHMS(v.ts * 1000)
                    obj.is_team = v.is_team == 1 ? true : false
                    obj.chain_record_idx = v.Chain_record_idx
                    obj.reward_amount = this.vuex_web3.utils.fromWei(_tools.interceptFloat(v.reward_amount), 'ether')
                    arr.push(obj)
                }))
                this.record = arr
                console.log("this.record ==>", this.record, data)
                Toast.clear()
            } catch (error) {
                Toast.clear()
                console.log("this.record err==>", error)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.GetRecord {
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
    .record_box {
        padding: 0 32px;
        padding-bottom: 100px;
        .record_item {
            padding: 32px 0;
            border-bottom: 1px solid #F5F5F5;
            display: flex;
            align-items: center;
            .record_name {
                & :nth-child(1) {
                    font-size: 28px;
                    color: #000;
                    display: block;
                    margin-bottom: 10px;
                }
                & :nth-child(2) {
                    display: block;
                    color: #999999;
                    font-size: 24px;
                }
            }
            .record_usdt {
                margin-left: auto;
                font-size: 28px;
                text-align: right;
                span {
                    display: block;
                }
                & :nth-child(1) {
                    margin-bottom: 10px;
                }
                .success {
                    display: inline-block;
                    color: #999999;
                    position: relative;
                    &::after {
                        content: '';
                        display: block;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        overflow: hidden;
                        position: absolute;
                        top: 50%;
                        left: -10px;
                        background-color: #13C087;
                    }
                }
            }
        }

        & .record_item:last-of-type {
            border: none;
        }
    }
}

.GetRecord_hock {
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
    .record_box .record_item {
        border-bottom-color: $trading-border-hock;
    }
    .record_box .record_item .record_name :nth-child(1) {
        color: $text-qs-hock;
    }
    .record_box .record_item .record_usdt .success {
        color: $text-qqs-hock;
    }
}
</style>