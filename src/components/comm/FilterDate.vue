<template>
    <div class="FilterDate" :class="hock ? 'FilterDate_hock':''">
        <van-popup v-model="isShow" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom> 
            <div class="filter_box clearfix">
                <div class="filter_title">{{i18n.Components.Filter}}</div>
                <img v-show="!hock" class="close" src="../../assets/v2img/cha_icon.png" alt="" @click="closeClick">
                <img v-show="hock" class="close" src="../../assets/v2img/cha_icon_hock.png" alt="" @click="closeClick">
                <div class="filter_item">
                    <div class="item_title">
                        {{i18n.Components.Date}}
                    </div>
                    <div class="item_date clearfix">
                        <div class="start_date fl">{{date[0]}}</div>
                        <div class="end_date fr">{{date[1]}}</div>
                    </div>
                    <div class="item_radio">
                        <van-radio-group v-model="radio" direction="horizontal" @change="getNow">
                            <van-radio name="1">{{i18n.Components.Day}}</van-radio>
                            <van-radio name="2">{{i18n.Components.Week}}</van-radio>
                            <van-radio name="3">{{i18n.Components.Month}}</van-radio>
                            <van-radio name="4">{{i18n.Components.MonthThree}}</van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <slot class="filter_item"></slot>
                <div class="filter_btn clearfix">
                    <div class="reset_btn fl" @click="reset">{{i18n.Components.Reset}}</div>
                    <div class="confirm_btn fl" @click="submit">{{i18n.Components.Confirm}}</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { _accounts, _tools, _date } from '@/assets/js/utils'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'FilterDate',
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            radio: '1',
            date: [],
            dateData: []
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    created () {
        this.getNow()
    },
    methods: {
        // 关闭
        closeClick() {
            this.$emit('closeClick', false)
        },
        // 获取当前时间
        getNow() {
            this.date = []
            this.dateData = []
            let currentTime, nowTime
            nowTime = new Date().setDate(new Date().getDate());
            if (this.radio == 1) {
                currentTime = Number(new Date()) - 1000 * 60 * 60 * 24 // 1天前
            } else if (this.radio == 2) {
                currentTime = new Date().setDate((new Date().getDate() - 7)) // 7天前
            } else if (this.radio == 3) {
                currentTime = new Date().setMonth((new Date().getMonth() - 1)) // 一个月前
            } else if (this.radio == 4) {
                currentTime = new Date().setMonth((new Date().getMonth() - 3)) // 3个月前
            }
            this.$nextTick(() => {
                this.date.push(_date.getYMD(currentTime))
                this.date.push(_date.getYMD(nowTime))
            })
            this.dateData.push(currentTime)
            this.dateData.push(nowTime)
        },
        // 重置
        reset() {
            this.radio = '1'
            this.getNow()
            this.$emit('resetRadio')
        },
        // 确认
        submit() {
            let limit = 1
            if (this.radio == 2) {
                limit = 7
            } else if (this.radio == 3) {
                limit = 30
            } else if (this.radio == 4) {
                limit = 90
            }
            this.$emit('confirm', this.dateData, limit)
            this.$emit('closeClick', false)
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/ .van-popup {
    .filter_box {
        padding-bottom: 70px;
        position: relative;
        overflow: hidden;
        .filter_title {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-top: 48px;
            margin-bottom: 40px;
        }
        .close {
            height: 36px;
            position: absolute;
            top: 32px;
            right: 32px;
        }
        .filter_item {
            padding: 0 32px;
            margin-bottom: 40px;
            .item_title {
                font-size: 32px;
                padding-bottom: 24px;
                border-bottom: 2px solid #F5F5F5;
            }
            .item_date {
                padding: 32px 0;
                overflow: hidden;
                position: relative;
                .start_date, .end_date {
                    width: 318px;
                    height: 74px;
                    background: #F5F5F5;
                    border-radius: 8px;
                    font-size: 32px;
                    text-align: center;
                    line-height: 74px;
                }
                &::after {
                    content: '';
                    display: block;
                    width: 26px;
                    height: 2px;
                    background: #CCCCCC;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                }
            }
            .item_radio {
                font-size: 28px;
            }
        }
        .filter_btn {
            overflow: hidden;
            padding: 0 32px;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            .reset_btn, .confirm_btn {
                line-height: 72px;
                width: 335px;
                height: 72px;
                border-radius: 16px;
            }
            .reset_btn {
                background: #EDEDED;
                margin-right: 16px;
                color: #000;
            }
            .confirm_btn {
                background: #13C087;
                color: #fff;
            }
        }
    }
}
/deep/ .item_radio .van-radio-group {

    .van-radio {
        flex: 1;
        .van-radio__icon {
            display: none;
        }
        .van-radio__label {
            width: 100%;
            height: 48px;
            padding: 8px 0;
            margin: 0;
            margin-right: 16px;
            text-align: center;
            line-height: 48px;
            background: #F5F5F5;
            border-radius: 8px;
            color: #999999;
        }
        .van-radio__icon--checked + .van-radio__label{
            color: #333;
        }
    }
    & .van-radio:last-child .van-radio__label{
        margin: 0;
    }
}

.FilterDate_hock {
    /deep/ .van-popup {
        .filter_box {
            background-color: $back-qs-hock;
            .filter_item {
                .item_title {
                    border-bottom-color: $trading-border-hock;
                } 
                .item_date {
                    .start_date, .end_date {
                        background-color: $cmp-qbg-hock;
                    }
                }
                .radio_box {
                    .van-radio__label {
                        color: $text-qs-hock;
                    }
                    .van-radio__icon .van-icon {
                        border: none;
                        background-color: $text-qqs-hock;
                        color: $text-hock;
                    }
                }
            }
            .filter_btn .reset_btn {
                background-color: $cmp-btn-bag-hock;
                color: $text-qs-hock;
            }
        }

    }
   
    /deep/ .item_radio .van-radio-group {
        .van-radio {
            .van-radio__label {
                color: $nav-tab-ac-hock;
                background-color: $cmp-qbg-hock;
            }
            .van-radio__icon--checked + .van-radio__label{
                color: $text-qs-hock;
            }
        }
    }
}

</style>