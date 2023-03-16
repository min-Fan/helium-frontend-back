<template>
    <div class="FilterCalendar" :class="hock ? 'FilterCalendar_hock':''">
        <van-popup v-model="isShow" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom> 
            <div class="filter_box clearfix">
                <div class="filter_title">
                    <span @click="reset">{{i18n.Components.Cancel}}</span>
                    <span>{{i18n.Components.Filter}}</span>
                    <span @click="calendarChange">{{i18n.Components.Completion}}</span>
                </div>
                <div class="filter_item">
                    <div class="item_date clearfix">
                        <div class="start_date fl" @click="chooseDate1">{{dateShow[0]}}</div>
                        <div class="end_date fr" @click="chooseDate2">{{dateShow[1]}}</div>
                    </div>
                </div>
                <van-datetime-picker v-show="chooseDate == 1" v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" :show-toolbar="false" @change="calendar"/>
                <van-datetime-picker v-show="chooseDate == 2" v-model="currentDate2" type="date" :min-date="minDate2" :max-date="maxDate2" :show-toolbar="false" @change="calendar2"/>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { _accounts, _tools, _date } from '@/assets/js/utils'
export default {
    name: 'FilterCalendar',
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dateShow: [],
            dateData: [],
            minDate: new Date(2022, 0, 1),
            maxDate: new Date(2025, 12, 1),
            currentDate: new Date(),
            minDate2: new Date(2022, 0, 1),
            maxDate2: new Date(2025, 12, 1),
            currentDate2: new Date(),
            chooseDate: 1
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),
        i18n() {
            return this.$t('message');
        },
    },
    created () {
        this.getNow()
    },
    methods: {
        chooseDate1() {
            let date = new Date(this.dateData[0])
            this.currentDate = date
            this.chooseDate = 1
        },
        chooseDate2() {
            let date = new Date(this.dateData[1])
            this.currentDate = date
            this.chooseDate = 2
        },
        // 获取当前时间
        getNow() {
            this.dateShow = []
            let currentTime, nowTime
            nowTime = new Date().setDate(new Date().getDate());
            currentTime = Number(new Date()) - 1000 * 60 * 60 * 24 // 1天前
            this.$nextTick(() => {
                this.dateShow.push(_date.getYMD(currentTime))
                this.dateShow.push(_date.getYMD(nowTime))
            })
            this.currentDate = new Date(currentTime) 
            this.currentDate2 = new Date(nowTime)
            this.maxDate = new Date(nowTime - 1000 * 60 * 60 * 24)
            this.minDate2 = new Date(currentTime + 1000 * 60 * 60 * 24)
            this.dateData.push(currentTime)
            this.dateData.push(nowTime)
        },
        calendar() {
            let date = new Date(this.currentDate).getTime()
            this.dateShow[0] = _date.getYMD(date)
            this.dateData[0] = date
            this.minDate2 = new Date(date + 1000 * 60 * 60 * 24)
        },
        calendar2() {
            let date = new Date(this.currentDate2).getTime()
            this.dateShow[1] = _date.getYMD(date)
            this.dateData[1] = date
            this.maxDate = new Date(date - 1000 * 60 * 60 * 24)
        },
        // 重置
        reset() {
            this.getNow()
            this.$emit('setIsShow', false)
        },
        // 确认
        calendarChange() {
            this.$emit('setDate', this.dateData)
            this.$emit('setIsShow', false)
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
            width: 750px;
            height: 100px;
            background: #FFFFFF;
            border-bottom: 1px solid rgba($color: #E6E6E6, $alpha: .6);
            display: flex;
            justify-content:center;
            font-size: 32px;
            line-height: 100px;
            padding: 0 28px;
            box-sizing: border-box;
            & :nth-child(1) {
                margin-right: auto;
            }
            & :nth-child(2) {
                color: #000;
                font-weight: bold;
            }
            & :nth-child(3) {
                color: #13C087;
                margin-left: auto;
            }
            
        }
        .filter_item {
            padding: 0 32px;
            margin-bottom: 40px;
            .item_date {
                padding: 16px 0 32px 0;
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
        }
    }
}

.FilterCalendar_hock {
    /deep/ .van-popup {
        .filter_box {
            background-color: $back-qs-hock;
            .filter_title {
                background-color: $back-qs-hock;
                border-bottom-color: $trading-border-hock;
            }
        }
        .filter_item .item_date .start_date, .filter_item .item_date .end_date {
            background-color: $cmp-qbg-hock;
        }
        .van-picker {
            background-color: $back-qs-hock;
        }
        .van-ellipsis {
            color: $nav-tab-ac-hock;
        }
        .van-picker-column__item--selected {
            .van-ellipsis {
                color: $text-qs-hock;
            }
        }
        .van-picker__frame {
            width: 100%;
            left: 0;
        }
        .van-hairline-unset--top-bottom::after {
            border-color: $trading-border-hock;
        }
        .van-picker__mask {
            background: transparent;
        }
    }
}

</style>