<template>
    <div class="SingleDetails">
        <div class="details_warp">
            <van-nav-bar fixed :placeholder="true" :title="i18n.SingleDetails[title]" :left-text="i18n.SingleDetails.Back" left-arrow @click-left="onClickLeft"/>
            <div class="team" v-if="type == 1">
                <div class="team_head">
                    <div class="calendar_box">
                        <img src="../assets/img/calendar.png" alt="">
                        <span>2022.4.18</span>
                    </div>
                    <div class="nums_box">
                        <span>{{i18n.SingleDetails.TeamNums}}</span>
                        <font>1888 USDT</font>
                    </div>
                    <div class="earnings_box clearfix">
                        <div class="earnings_team fl">
                            <p>{{i18n.SingleDetails.Selfbenefiting}}(USDT)</p>
                            <span>12345.00</span>
                        </div>
                        <div class="earnings_other fl">
                            <p>{{i18n.SingleDetails.TeamMotivation}}(USDT)</p>
                            <span>34428.26</span>
                        </div>
                    </div>
                    <div class="personal_gain">
                        <span>{{i18n.SingleDetails.Personal}}(USDT)</span>
                        <font>50.00</font>
                    </div>
                </div>
            </div>
            <div class="team_details" v-if="type == 1">
                <div class="details_title clearfix">
                    <img class="fl" src="../assets/img/icon.png" alt="">
                    <span class="fl">{{i18n.SingleDetails.IncentiveDetails}}</span>
                </div>
                <div class="deatails_list">
                    <div class="list_title">
                        <span>{{i18n.SingleDetails.Addr}}</span>
                        <span>{{i18n.SingleDetails.Selfbenefiting}}</span>
                        <span>{{i18n.SingleDetails.Motivation}}</span>
                        <span>{{i18n.SingleDetails.Amount}}</span>
                    </div>
                    <div class="list_data" v-for="(item, index) in listData" :key="index">
                        <span class="one_text">0x886abcdsasdasdefg</span>
                        <span>200U</span>
                        <span>2%</span>
                        <span>4U</span>
                    </div>
                </div>
            </div>
            <div class="other_details" v-if="type == 2">
                <div class="list_title">
                    <span>{{i18n.SingleDetails.Receipts}}</span>
                    <span>{{i18n.SingleDetails.Nums}}</span>
                    <span>{{i18n.SingleDetails.Selfbenefiting}}</span>
                </div>
                <div class="list_data" v-for="(item, index) in listData" :key="index">
                    <span class="num_box">
                        <span>{{i18n.SingleDetails.Receipts}}1</span>
                    </span>
                    <span>200EGS</span>
                    <span>10USDT</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SingleDetails',
    data() {
        return {
            type: 1,
            title: 'TeamTitle',
            listData: [{}, {}]
        }
    },
    computed: {
        i18n() {
            return this.$t('message');
        },
    },

    created() {
        this.type = this.$route.query.type
        if (this.type == 1) {
            this.title = 'TeamTitle'
        } else {
            this.title = 'OthaerTitla'
        }
    },

    methods: {
        onClickLeft() {
            this.$router.back()
        },
    
    }
}
</script>
<style lang="scss" scoped>
.SingleDetails {
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    background: url(../assets/img/other_bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 100px 0 0 0;
    box-sizing: border-box;
    .details_warp {
        padding: 50px 38px;
        width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, .8);
        box-sizing: border-box;
        /deep/ .van-nav-bar {
            background-color: transparent;
            border: none;
            *{
                background-color: transparent;
                color: #fff;
                border: none;
            }
            &.van-hairline--bottom::after {
                display: none;
            }
            .van-nav-bar__left {
                padding: 0;
                span {
                    font-size: 34px
                }
            }
            .van-nav-bar__title {
                font-size: 34px
            }
        }

        .team {
            margin-top: 20px;
            .team_head {
                width: 674px;
                height: 378px;
                background-color: rgba(255, 255, 255, .1);
                border-radius: 16px;
                padding: 28px 40px 40px;
                box-sizing: border-box;
                .calendar_box {
                    color: #fff;
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    img {
                        width: 26px;
                        margin-right: 14px;
                    }
                    span {
                        font-size: 28px;
                    }
                }
                .nums_box {
                    display: flex;
                    align-items: center;
                    padding-bottom: 30px;
                    border-bottom: 1px solid rgba(112, 112, 112, .3);
                    span {
                        font-size: 22px;
                        color: #999999;
                        margin-right: 30px;
                    }
                    font {
                        color: #F69C15;
                        font-size: 34px;
                    }
                }
                .earnings_box {
                    padding-top: 24px;
                    .earnings_team, .earnings_other {
                        width: 50%;
                        line-height: 40px;
                        p {
                            margin: 0;
                            font-size: 22px;
                            color: #999999;
                        }
                        span {
                            font-size: 34px;
                            color: #ffffff;
                        }
                    }
                }
                .personal_gain {
                    span {
                        font-size: 22px;
                        color: #999999;
                        margin-right: 30px;
                    }
                    font {
                        font-size: 30px;
                        color: #fff;
                    }
                }
            }
        }
        .team_details {
            margin-top: 20px;
            width: 674px;
            max-height: 649px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            padding: 30px 40px;
            box-sizing: border-box;
            .details_title {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                img {
                    margin-right: 13px;
                    width: 8px;
                }
                span {
                    font-size: 28px;
                    font-weight: bold;
                }
            }
            .deatails_list {
                
                .list_title, .list_data {
                    display: flex;
                    margin-bottom: 30px;
                    span {
                        color: #999999;
                        font-size: 22px;
                    }
                    & span:nth-child(1) {
                        flex: 4;
                    }
                    & span:nth-child(2) {
                        flex: 3;
                    }
                    & span:nth-child(3) {
                        flex: 2;
                    }
                    & span:nth-child(4) {
                        flex: 2;
                        text-align: right;
                    }
                }
                .list_data {
                    margin-bottom: 20px;
                    span {
                        color: #AAAAAA;
                    }
                }
            }
        }
        .other_details {
            margin-top: 20px;
            width: 674px;
            max-height: 100%;
            overflow: scroll;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            padding: 30px 40px;
            box-sizing: border-box;
            .list_title, .list_data {
                display: flex;
                align-items: center;
                margin-bottom: 30px;
                span {
                    color: #999999;
                    font-size: 22px;
                }
                & span:nth-child(1) {
                    flex: 5;
                }
                & span:nth-child(2) {
                    flex: 3;
                }
                & span:nth-child(3) {
                    flex: 3;
                    text-align: right;
                }
            }
            .list_data {
                margin-bottom: 20px;
                span {
                    color: #fff;
                }
                & span:nth-child(1) {
                    display: inline-block;
                    color: #F69C15;
                }
                .num_box span{
                    padding: 8px 20px;
                    border-radius: 4px;
                    border: 1px solid #F69C15;
                }
            }
        }

    }
}
</style>