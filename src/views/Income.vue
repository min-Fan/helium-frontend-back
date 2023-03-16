<template>
    <div class="income_wrap">
        <van-empty class="custom-image" :image="nummPageimg" :description="i18n.Main.Commonsoon" v-if="showPage" />
        <div class="top_card f-d-c f-a-c" v-if="!showPage">
            <!-- 飞船总收益(ESG) -->
            <div class="subtitle">{{i18n.Income.ShipGrossEarnings}}</div>
            <div class="num_box f-j-a-c">
                {{totalEarnings}}
                <div class="line"></div>
            </div>
            <!-- 今日收益(ESG) -->
            <div class="esg">
                <div class="esg_box" style="padding-left: 0;">
                    <div class="subtitle">{{i18n.Income.ExtractionTotal}}</div>
                    <div class="num_box f-j-a-c" style="width: 100%">
                        {{extractionTotal}}
                        <div class="line"></div>
                    </div>
                </div>
                <div class="esg_box" style="padding-right: 0;">
                    <div class="subtitle">{{i18n.Income.Extraction}}</div>
                    <div class="num_box f-j-a-c" style="width: 100%">
                        {{extraction}}
                        <div class="line"></div>
                    </div>
                </div>
            </div>
            <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.Income.YesExtraction}}</div>
        </div>

        <div class="spaceship_card f-d-c f-j-a-c" v-if="!showPage">
            <van-tabs v-model="active" @change="tabschange">
                <van-tab :title="i18n.Income.Mininger + '('+ miningedArr.length + ')'"></van-tab>
                <van-tab :title="i18n.Income.Unmined + '('+ UnminedArr.length + ')'"></van-tab>
            </van-tabs>
            <!-- <span>{{i18n.Income.Nums}} ({{miningArr.length + ' ' +i18n.Income.Per}})</span> -->
            <!-- S SS SS SSS SSSS级飞船 -->
            <div class="null" style="color: #808080; font-size: 18px; margin: 30px 0;" v-show="showAirArr.length == 0">{{i18n.Income.NullData}}</div>
            <div class="top_box f-a-c f-j-sb" v-show="showAirArr.length != 0">
                <img src="../assets/img/prev.png" alt="" @click="handlePrev">
                <span>{{i18n.Spaceship[currentSpa.key]}}</span>
                <img src="../assets/img/next.png" alt="" @click="handleNext">
            </div>

            <img class="spaceship" :src="currentSpa.img" alt="" v-show="showAirArr.length != 0">

            <div class="condition_box f-d-c f-a-c" v-show="showAirArr.length != 0">
                <span class="title_span">Token：</span>
                <p># {{currentSpa.tokenid}}</p>
                <span class="title_span">{{i18n.Income.Power}}：</span>
                <p>{{currentSpa.total}} ESG/{{i18n.Income.Block}}</p>
                <span class="title_span">{{i18n.Income.Timer}}：</span>
                <p>{{currentSpa.date == 0 ? i18n.Income.Null : currentSpa.Mount + i18n.Income.Month + currentSpa.Day + i18n.Income.Day + ' ' + currentSpa.Hours + i18n.Income.Hours + currentSpa.Minute + i18n.Income.Minute}}</p>
                <span class="title_span">{{i18n.Income.HeightBlock}}：</span>
                <p>{{currentSpa.block}}</p>
            </div>

            <div class="confirm_btn f-j-a-c" @click="mining(currentSpa.tokenid)" v-show="currentSpa.block == 0 && showAirArr.length != 0">{{i18n.Income.Mining}}</div>
            <div class="mining f-j-a-c" v-show="currentSpa.block != 0 && showAirArr.length != 0" >{{i18n.Income.Mininged}}</div>
        </div>

        <!-- <div class="bottom_card f-d-c f-a-c">
            <div class="card_title">{{i18n.Income.EarningsBreakdown}}(ESG)</div>

            <div class="col_box">
                <div class="col_item f-d-c f-a-c" v-for="(item,index) in spaceship" :key="index" @click="toDetail(item)">
                    <img :src="item.img" alt="">
                    <span class="f-j-a-c">{{item.total}}</span>
                </div>
            </div>
        </div> -->

        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { Toast } from 'vant';
    import { _tools } from '@/assets/js/utils'
    import { contractMethods } from '@api'
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
                showPage: true, // 显示页面
                nummPageimg: require('../assets/img/null.png'),
                active: 0,
                spaceship: [
                    { id: 1, key: 'NClass', img: require('../assets/img/n.png'), total: 10086, quantity: 0, tokenidArr: [] },
                    { id: 2, key: 'SClass', img: require('../assets/img/s.png'), total: 10086, quantity: 0, tokenidArr: [] },
                    { id: 3, key: 'SSClass', img: require('../assets/img/ss.png'), total: 10086, quantity: 0, tokenidArr: [] },
                    { id: 4, key: 'SSSClass', img: require('../assets/img/sss.png'), total: 10086, quantity: 0, tokenidArr: [] },
                    { id: 5, key: 'SSSSClass', img: require('../assets/img/ssss.png'), total: 10086, quantity: 0, tokenidArr: [] }
                ],
                spaceshipList: [], // 所有飞船数组
                showLoading: false, // 加载
                currentSpa: {},
                // 当前飞船
                currentIndex: 0,
                airNums: 0, // 数量
                totalEarnings: 0, // 总算力
                extractionTotal: 0, // 累计提取
                extraction: 0, // 可提取
                miningArr: [], // 挖矿的飞船
                allAir: [], // 所有飞船
                miningedArr: [], // 挖矿中
                UnminedArr: [], // 未挖矿
                showAirArr: [], // 渲染数组 miningArr / UnminedArr
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
            // setTimeout(async () => {
            //     if (this.vuex_myContract != {}) {
            //         await this.getNft()
            //         this.getTotal()
            //         this.showAirArr = this.miningedArr
            //         if (this.showAirArr.length != 0) {
            //             this.currentSpa = this.showAirArr[0];
                        
            //             await this.vuex_myContract.contrart_NowNFT.methods.getShipCurrentPower([this.currentSpa.tokenid]).call().then(res => {
            //                 this.currentSpa.total = _tools.formatDecimal((res / Math.pow(10, 18)), 4)
            //             })      
            //             await this.vuex_myContract.contrart_NowNFT.methods.heightOf(this.currentSpa.tokenid).call().then(res => {
            //                 this.currentSpa.block = res
            //             })   
            //             await this.vuex_myContract.contrart_NowNFT.methods.getShipReduceBlock(this.currentSpa.tokenid).call().then(res => {
            //                 this.currentSpa.date = res * 3
            //                 let time = res * 3
            //                 const month = parseInt(time / 60 / 60 / 24 / 30)
            //                 const date = parseInt(time / 60 / 60 / 24)
            //                 const hours = parseInt(time / 60 / 60 % 24)
            //                 const minute = parseInt(time / 60 % 60)
            //                 this.currentSpa.Mount = month
            //                 this.currentSpa.Day = date
            //                 this.currentSpa.Hours = hours
            //                 this.currentSpa.Minute = minute
            //             })   
            //         }
            //     }
            // }, 0)
        },

        mounted() {
            
        },

        methods: {
            // tabs 切换
            async tabschange(index, name) {
                this.currentIndex = 0
                if (index == 0) {
                    this.showAirArr = this.miningedArr
                    if (this.showAirArr.length != 0) {
                        this.currentSpa = this.showAirArr[0];
    
                        this.showLoading = true
                        
                        await this.vuex_myContract.contrart_NowNFT.methods.getShipCurrentPower([this.currentSpa.tokenid]).call().then(res => {
                            this.currentSpa.total = _tools.formatDecimal((res / Math.pow(10, 18)), 4)
                        })      
                        await this.vuex_myContract.contrart_NowNFT.methods.heightOf(this.currentSpa.tokenid).call().then(res => {
                            this.currentSpa.block = res
                        })   
                        await this.vuex_myContract.contrart_NowNFT.methods.getShipReduceBlock(this.currentSpa.tokenid).call().then(res => {
                            this.currentSpa.date = res * 3
                            let time = res * 3
                            const month = parseInt(time / 60 / 60 / 24 / 30)
                            const date = parseInt(time / 60 / 60 / 24)
                            const hours = parseInt(time / 60 / 60 % 24)
                            const minute = parseInt(time / 60 % 60)
                            this.currentSpa.Mount = month
                            this.currentSpa.Day = date
                            this.currentSpa.Hours = hours
                            this.currentSpa.Minute = minute
                        })  
                        this.showLoading = false 
                    }

                } else if (index == 1) {
                    this.showAirArr = this.UnminedArr
                    this.currentSpa = this.showAirArr[0];
                }
            },
            // prev
            async handlePrev() {
                if (this.currentIndex==0) this.currentIndex = this.showAirArr.length - 1;
                else this.currentIndex --;

                this.currentSpa = this.showAirArr[this.currentIndex];
                console.log(this.currentSpa.tokenid)

                if (this.active == 0) {
                    this.showLoading = true
                    
                    await this.vuex_myContract.contrart_NowNFT.methods.getShipCurrentPower([this.currentSpa.tokenid]).call().then(res => {
                        this.currentSpa.total = _tools.formatDecimal((res / Math.pow(10, 18)), 4)
                    })      
                    await this.vuex_myContract.contrart_NowNFT.methods.heightOf(this.currentSpa.tokenid).call().then(res => {
                        this.currentSpa.block = res
                    })   
                    await this.vuex_myContract.contrart_NowNFT.methods.getShipReduceBlock(this.currentSpa.tokenid).call().then(res => {
                        this.currentSpa.date = res * 3
                        let time = res * 3
                        const month = parseInt(time / 60 / 60 / 24 / 30)
                        const date = parseInt(time / 60 / 60 / 24)
                        const hours = parseInt(time / 60 / 60 % 24)
                        const minute = parseInt(time / 60 % 60)
                        this.currentSpa.Mount = month
                        this.currentSpa.Day = date
                        this.currentSpa.Hours = hours
                        this.currentSpa.Minute = minute
                    })   
                        
                    this.showLoading = false
                }

            },

            // next
            async handleNext() {
                if (this.currentIndex == this.showAirArr.length - 1) this.currentIndex = 0;
                else this.currentIndex ++;

                this.currentSpa = this.showAirArr[this.currentIndex];
                console.log(this.currentSpa.tokenid)

                if (this.active == 0) {
                    this.showLoading = true
                    await this.vuex_myContract.contrart_NowNFT.methods.getShipCurrentPower([this.currentSpa.tokenid]).call().then(res => {
                        this.currentSpa.total = _tools.formatDecimal((res / Math.pow(10, 18)), 4)
                    })      
                    await this.vuex_myContract.contrart_NowNFT.methods.heightOf(this.currentSpa.tokenid).call().then(res => {
                        this.currentSpa.block = res
                    })   
                    await this.vuex_myContract.contrart_NowNFT.methods.getShipReduceBlock(this.currentSpa.tokenid).call().then(res => {
                        this.currentSpa.date = res * 3
                        let time = res * 3
                        const month = parseInt(time / 60 / 60 / 24 / 30)
                        const date = parseInt(time / 60 / 60 / 24)
                        const hours = parseInt(time / 60 / 60 % 24)
                        const minute = parseInt(time / 60 % 60)
                        this.currentSpa.Mount = month
                        this.currentSpa.Day = date
                        this.currentSpa.Hours = hours
                        this.currentSpa.Minute = minute
                    })   
    
                    this.showLoading = false
                }

                
            },


            // 获取飞船数量
            async getNft() {
                this.spaceship[0].quantity = 0
                this.spaceship[1].quantity = 0
                this.spaceship[2].quantity = 0
                this.spaceship[3].quantity = 0
                this.spaceship[4].quantity = 0
                this.showLoading = true
                // 卡牌数量
                let numbers = []
                await this.vuex_myContract.contrart_NowNFT.methods.balanceOf(this.address).call().then(res => {
                    console.log(res)
                    let data = res
                    for (let i = 0; i < data; i++) {
                        numbers.push('1')
                    }
                })
                // tokenid 数组
                let nftArr = []
                await Promise.all(numbers.map(async (v, i) => {
                    // 查询卡牌 tokenid
                    let obj = {
                        tokenid: 0,
                        type: 0
                    }
                    let obj2 = {tokenid: 0, key: '', img: null, total: 0, Mount: 0, Day: 0, Hours: 0, Minute: 0, block: 0 }
                    await this.vuex_myContract.contrart_NowNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
                        obj.tokenid = res
                        obj2.tokenid = res
                        await this.vuex_myContract.contrart_NowNFT.methods.typeOf(res).call().then(res => {
                            obj.type = res
                            if (obj.type == 5) {
                                obj2.key = 'NClass'
                                obj2.img = require('../assets/img/n.png')
                            } else if (obj.type == 6) {
                                obj2.key = 'SClass'
                                obj2.img = require('../assets/img/s.png')
                            } else if (obj.type == 7) {
                                obj2.key = 'SSClass'
                                obj2.img = require('../assets/img/ss.png')
                            } else if (obj.type == 8) {
                                obj2.key = 'SSSClass'
                                obj2.img = require('../assets/img/sss.png')
                            } else if (obj.type == 9) {
                                obj2.key = 'SSSSClass'
                                obj2.img = require('../assets/img/ssss.png')
                            }
                            if (obj.type == 5 || obj.type == 6 || obj.type == 7 || obj.type == 8 || obj.type == 9) {
                                nftArr.push(obj)
                                this.spaceshipList.push(obj2)
                            }
                        })
                    })
                }))

                await Promise.all(this.spaceshipList.map(async v => {
                    // 是否挖矿
                    await this.vuex_myContract.contrart_NowNFT.methods.heightOf(v.tokenid).call().then(res => {
                        if (res != 0) {
                            this.miningedArr.push(v)
                        } else {
                            this.UnminedArr.push(v)
                        }
                    })
                }))


                nftArr.map(v => {
                    if (v.type == 5) {
                        this.spaceship[0].quantity += 1
                        this.spaceship[0].tokenidArr.push(v.tokenid)
                    } else if (v.type == 6) {
                        this.spaceship[1].quantity += 1
                        this.spaceship[1].tokenidArr.push(v.tokenid)
                    } else if (v.type == 7) {
                        this.spaceship[2].quantity += 1
                        this.spaceship[2].tokenidArr.push(v.tokenid)
                    } else if (v.type == 8) {
                        this.spaceship[3].quantity += 1
                        this.spaceship[3].tokenidArr.push(v.tokenid)
                    } else if (v.type == 9) {
                        this.spaceship[4].quantity += 1
                        this.spaceship[4].tokenidArr.push(v.tokenid)
                    }
                })
                console.log("飞船 nftArr ==>", this.spaceship)
                this.showLoading = false
            },

            // 获取算例 提取
            async getTotal() {
                this.totalEarnings = 0
                this.extraction = 0
                this.extractionTotal = 0
                // 总算力
                let arr = []
                this.spaceshipList.map(v => {
                    arr.push(v.tokenid)
                })
                this.allAir = arr

                let miningArr = []
                await Promise.all(arr.map(async v => {
                    // 是否挖矿
                    await this.vuex_myContract.contrart_NowNFT.methods.heightOf(v).call().then(res => {
                        if (res != 0) {
                            miningArr.push(v)
                        }
                    })
                }))
                
                this.miningArr = miningArr
                if (miningArr.length != 0) {
                    let total = 0
                    let extra = 0
                    // 获取总算力
                    await Promise.all(miningArr.map(async v => {
                        await this.vuex_myContract.contrart_NowNFT.methods.getShipCurrentPower(miningArr).call().then(res => {
                            total = Number(res) + Number(this.totalEarnings)
                        })
                        // 获取可提取
                        await this.vuex_myContract.contrart_NowNFT.methods.getShipRewardOf(v).call().then(res => {
                            extra = Number(res) + Number(this.extraction) 
                        })
                    }))
                    this.totalEarnings = _tools.formatDecimal(total / Math.pow(10, 18), 4)
                    this.extraction = _tools.formatDecimal(extra / Math.pow(10, 18), 2)
                }

                // 获取累计提取
                this.vuex_myContract.contrart_NowNFT.methods.userRewardOf(this.address).call().then(res => {
                    if (res != 0) {
                        this.extractionTotal = Number(_tools.formatDecimal((res / Math.pow(10, 18)), 2))
                    }
                })

            },

            // 挖矿
            async mining(id) {
                let data = {
                    name: "start", // 方法名
                    inputs: [{
                        "name": "tokenID",
                        "type": "uint256"
                    }],
                    arguments: [
                        id
                    ] // 参数
                }

                this.showLoading = true

                // 发起
                await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Income.StartMining, icon: 'fail' });
                    }
                }).catch(err => {
                    // 失败
                    if (err.code == 110) {
                        // 交易拒绝
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                    } else if (err.code == 111 || err.code == 113) {
                        // 交易失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    } else if (err.code == 112) {
                        // 交易超时
                        Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                    } else {
                        // 失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    }
                })

                this.showLoading = false
            },

            // 提取
            async onConfirm() {
                if (this.extraction == 0) return Toast({ message: this.i18n.Income.WithdrawNone, icon: 'fail' });

                let data = {
                    name: "airShipRewardOf", // 方法名
                    inputs: [{
                        "name": "tokenIds",
                        "type": "uint256[]"
                    }],
                    arguments: [
                        this.miningArr
                    ] // 参数
                }

                this.showLoading = true

                // 发起
                await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.Income.GetSuccess, icon: 'fail' });
                        this.getTotal()
                    }
                }).catch(err => {
                    // 失败
                    if (err.code == 110) {
                        // 交易拒绝
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
                    } else if (err.code == 111 || err.code == 113) {
                        // 交易失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    } else if (err.code == 112) {
                        // 交易超时
                        Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
                    } else {
                        // 失败
                        Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
                    }
                })

                this.showLoading = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .income_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 152px 56px 0;
        box-sizing: border-box;
    }
    .custom-image {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .top_card {
        width: 638px;
        min-height: 574px;
        background: url(../assets/img/income_m_c.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 50px 66px 54px;

        .subtitle {
            font-size: 24px;
            text-align: center;
            font-weight: 600;
            line-height: 40px;
            margin: 0 0 10px;
        }

        .num_box {
            width: 506px;
            height: 110px;
            background: url(../assets/img/l_box.png) no-repeat;
            background-size: 100% 100%;
            font-size: 60px;
            font-weight: 600;
            box-sizing: border-box;
            margin: 0 0 26px;
            position: relative;

            .line {
                width: 100%;
                height: 4px;
                background: #000000;
                position: absolute;
                left: 0;
                top: 50%;
            }
        }
        .esg {
            width: 100%;
            overflow: hidden;
            .esg_box {
                width: 50%;
                float: left;  
                display: block;
                padding: 0 20px;
                box-sizing: border-box;
                .num_box {
                    height: 110px;
                    margin: 0;
                }
                
            }
        }

        
    }

    .confirm_btn {
        width: 508px;
        min-height: 100px;
        background: url(../assets/img/hecheng_btn_a.png) no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        font-weight: 600;
        margin: 20px auto;
        box-sizing: border-box;
    }
    .mining {
        font-size: 36px;
        font-weight: 600;
        color: #FC9203;
    }

    .spaceship_card {
        width: 638px;
        // min-height: 1054px;
        height: auto;
        background: url(../assets/img/boost_card.png) no-repeat;
        background-size: 100% 100%;
        padding: 35px 0 56px;
        margin: 34px 0 0;
        box-sizing: border-box;
        >span {
            display: inline-block;
            font-size: 30px;
            font-weight: 600;
            font-family: AlibabaPuHuiTi_2_105_Heavy;
            color: #FFFFFF;
            line-height: 20px;
            text-shadow: 0px 0px 10px rgba(252, 146, 3, 0.52);
            margin-bottom: 50px;
        }
        /deep/ .van-tabs {
            width: 100%;
        }
        /deep/ .van-tabs__wrap {
            margin-bottom: 20px;
            *{
                background-color: transparent;
            }
            .van-tab {
                color: #fff;
                font-size: 30px;
                font-weight: 600;
                font-family: AlibabaPuHuiTi_2_105_Heavy;
                color: #FFFFFF;
            }
            .van-tab--active {
                color: #FC9203;
            }
            .van-tabs__line {
                background-color: #FC9203;
            }
        }

        .top_box {
            width: 558px;
            height: 50px;
            margin-bottom: 24px;

            span {
                font-size: 36px;
                font-weight: 600;
                color: #FC9203;
                line-height: 40px;
            }

            img {
                width: 36px;
                height: 36px;
            }
        }

        .spaceship {
            width: 460px;
            // height: 292px;
        }

        .condition_box {
            width: 520px;
            min-height: 354px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: inset 0px 0px 20px 0px rgba(252,146,3,0.56);
            border-radius: 6px;
            border: 1px solid #FC9203;
            box-sizing: border-box;
            margin: 38px 0;
            padding: 40px;
            position: relative;
            .title_span {
                font-size: 28px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 5px;
            }
            p {
                font-size: 36px;
                font-weight: 600;
                color: #FC9203;
                background: url(../assets/img/titlebag.png) no-repeat center;
                background-size: 100% 100%;
                padding: 5px 55px;
                margin-bottom: 10px;
                text-align: center;
            }

            .rate {
                padding: 2px 18px;
                font-size: 20px;
                color: #FC9203;
                background: rgba(252, 146, 3, 0.2);
                border-radius: 0px 6px 0px 20px;
                position: absolute;
                top: 0;
                right: 0;
            }

            .box_title {
                font-size: 24px;
                line-height: 40px;
                padding: 48px 0 18px;
            }

            .row {
                width: 394px;
                height: 50px;
                background: url(../assets/img/u_row.png) no-repeat;
                background-size: 100% 100%;
                box-sizing: border-box;
                font-size: 28px;
                color: #FC9203;
                margin: 0 0 18px;
            }

            .tips {
                width: 452px;
                font-size: 20px;
                color: #FC9203;
            }
        }
    }

    // .bottom_card {
    //     width: 638px;
    //     height: 944px;
    //     background: url(../assets/img/boost_card.png) no-repeat;
    //     background-size: 100% 100%;
    //     box-sizing: border-box;
    //     padding: 52px 32px 0;
    //     margin: 44px 0 0;

    //     .card_title {
    //         font-size: 36px;
    //         font-weight: 600;
    //         line-height: 40px;
    //         text-shadow: 0px 0px 20px rgba(252, 146, 3, 0.52);
    //         margin: 0 0 30px;
    //     }

    //     .col_box {
    //         width: 100%;
    //         display: flex;
    //         flex-wrap: wrap;

    //         .col_item {
    //             width: 50%;
    //             margin: 0 0 20px;

    //             img {
    //                 width: 270px;
    //                 height: 170px;
    //                 margin: 0 0 20px;
    //             }

    //             span {
    //                 width: 270px;
    //                 height: 50px;
    //                 background: url(../assets/img/b_s_r.png) no-repeat;
    //                 background-size: 100% 100%;
    //                 font-size: 28px;
    //                 color: #FC9203;
    //             }
    //         }
    //     }
    // }
</style>