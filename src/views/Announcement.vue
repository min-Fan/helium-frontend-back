<template>
    <div class="announcement_wrap">
        <div class="tabbar f-a-c">
            <div :class="['tab_item', 'f-j-a-c', current==0?'active':'']" @click="onChange(0)">{{i18n.Announcement.Lucky}}</div>
            <div :class="['tab_item', 'f-j-a-c', current==1?'active':'']" @click="onChange(1)">{{i18n.Announcement.Nuclear}}</div>
        </div>

        <div class="announcement_box f-d-c f-a-c">
            <div class="box_title">
                {{current==0?i18n.Announcement.LuckyAnnouncement:i18n.Announcement.NuclearAnnouncement}}
            </div>

            <div class="row_top">
                <div class="row f-j-sb">
                    <div>{{i18n.Announcement.Timestamp}}:</div>
                    <div>{{ timer }}</div>
                </div>
                <div class="row f-j-sb" v-if="current==0">
                    <div>{{i18n.Announcement.TransactionHash}}:</div>
                    <div>{{ hax }}</div>
                </div>
                <div class="row f-j-sb" v-if="current==0">
                    <div>{{i18n.Announcement.LuckyNumber}}:</div>
                    <div>{{ luckyNum }}</div>
                </div>
            </div>

            <div class="row_bottom">
                <div class="row f-j-sb" v-for="(item,index) in addrList" :key="index">
                    <div>
                        {{current==0?i18n.Announcement.LuckyNumberAddress:i18n.Announcement.LuckyAddress}}:
                    </div>
                    <div>{{ item }}</div>
                </div>
                <p class="null" v-if="addrList.length == 0">{{ i18n.Announcement.null }}</p>
            </div>
        </div>
        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { GetDrawLuckPollInfo, GetNucliearDistInfo, GetNucliearDistNoEntryInfo } from '@api'
    import { _tools, _date } from '@/assets/js/utils'
    export default {
        data() {
            return {
                current: 0,
                addrList: [],
                timer: '',  // 时间戳
                hax: '',    // 交易哈希
                luckyNum: '', // 幸运数字
                showLoading: false, // 加载中
                heData: null, // 核变数据
                shanData: null, // 熵变数据
            }
        },
        computed: {
            i18n() {
                return this.$t('message');
            }
        },

        created() {
            this.getLuck()
            // this.getHistoryNucliearDists()
        },
        
        methods: {
            onChange(index) {
                this.current = index;
                if (this.current == 0) {
                    this.getLuck()
                } else {
                    // this.getHistoryNucliearDists()
                    this.setData()
                }
            },

            // 获取幸运数字
            async getLuck() {
                this.showLoading = true
                await GetDrawLuckPollInfo().then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data
                        if (data.length == 0) {
                            this.addrList = []
                            this.timer = ''
                            this.hax = ''
                            this.luckyNum = ''
                        } else {
                            this.hax = data[data.length - 1].TxHash
                            this.luckyNum = _tools.prefixInteger(data[data.length - 1].LuckNumber, 3)
                            if (data[data.length - 1].Ts != 0) {
                                this.timer = _date.getYMDHMS(data[data.length - 1].Ts * 1000)
                            }
                            if (data[data.length - 1].RewardAddrss != null) {
                                this.addrList = data[data.length - 1].RewardAddrss
                            }
                        }
                    }
                    this.showLoading = false
                }).catch(err => {
                    this.showLoading = false
                    console.log(err)
                })
                this.showLoading = false
            },

            // 获取核变数据
            async getHistoryNucliearDists() {
                // 获取数据
                await GetNucliearDistInfo().then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data
                        this.heData = data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },

            // 获取熵变数据
            async getNucliearDistNoEntryInfo() {
                // 获取数据
                await GetNucliearDistNoEntryInfo().then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data
                        this.shanData = data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },

            // 赋值 核变 / 熵变 数据
            async setData() {
                // this.showLoading = true
                // 数据初始化
                this.addrList = []
                this.timer = ''
                this.hax = ''
                this.luckyNum = ''

                // 获取数据
                await this.getHistoryNucliearDists()
                await this.getNucliearDistNoEntryInfo()

                console.log(this.heData, this.shanData)
                let data = null
                if (this.heData.ts > this.shanData.Ts) {
                    data = this.heData
                    if (data.ts != 0) {
                        this.timer = _date.getYMDHMS(data.ts * 1000)
                    }
                    if (data.LastUserAddrss != null) {
                        this.addrList = data.LastUserAddrs
                    }
                } else {
                    data = this.shanData
                    if (data.ts != 0) {
                        this.timer = _date.getYMDHMS(data.Ts * 1000)
                    }
                    if (data.LastUser != null) {
                        this.addrList = [data.LastUser]
                    }
                }

                console.log("data ==>", data)
                
                

            }
        }
    }
</script>

<style lang="scss" scoped>
    .announcement_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 98px 56px 48px;
        box-sizing: border-box;
    }

    .tabbar {
        width: 638px;
        height: 136px;
        background: url(../assets/img/tabbar.png) no-repeat;
        background-size: 100% 100%;

        .tab_item {
            width: 50%;
            font-size: 36px;
            font-weight: 600;
        }

        .active {
            color: #FC9203;
        }
    }

    .announcement_box {
        width: 638px;
        height: 1228px;
        background: url(../assets/img/publicity_card.png) no-repeat;
        background-size: 100% 100%;
        padding: 40px 36px 0;
        box-sizing: border-box;
        font-size: 24px;
        overflow: scroll;

        .box_title {
            height: 40px;
            font-size: 36px;
            font-weight: 600;
        }

        .row_top, .row_bottom {
            width: 100%;

            .row {
                width: 100%;
                line-height: 40px;

                div {
                    width: 56%;
                    text-align: end;
                    word-wrap:break-word;

                    &:first-child {
                        width: 36%;
                        text-align: start;
                    }
                }
            }
        }

        .row_top {
            padding-top: 46px;
            border-bottom: 2px dashed #FC9203;

            .row {
                padding-bottom: 16px;
            }
        }

        .row_bottom {
            padding: 28px 0;
            
            p {
                text-align: center;
            }
            .row {
                padding-bottom: 16px;
            }
        }
    }
</style>