<template>
    <div class="home_wrap">
        <div class="card_box" v-show="isNFT">
            <img src="../assets/img/query.png" alt="" class="icon_qurey" @click="showQuery = !showQuery">
            <h1>MasK Baby</h1>
            <div class="btn_box f-j-a-c" @click="migration">{{i18n.Home.Migration}}</div>
        </div>

        <!-- <div class="card_box" v-show="isESG" style="margin-top: 20px;">
            <img src="../assets/img/query.png" alt="" class="icon_qurey" @click="showQueryESG = !showQueryESG">
            <h1>{{ i18n.Home.ESG }}</h1>
            <div class="btn_box f-j-a-c" @click="mappingEsg">{{i18n.Home.ESGMapping}}</div>
        </div> -->

        <van-popup v-model="showQuery" position="center">
            <div class="query_pop">
                <img src="../assets/img/close.png" alt="" class="close" @click="showQuery = false">
                <div class="pop_title">{{i18n.Home.Introduce}}</div>
                <div class="pop_content" v-html="i18n.Home.IntrContent"></div>
            </div>
        </van-popup>

        <van-popup v-model="showQueryESG" position="center">
            <div class="query_pop">
                <img src="../assets/img/close.png" alt="" class="close" @click="showQueryESG = false">
                <div class="pop_title">{{i18n.Home.Introduce}}</div>
                <div class="pop_content" v-html="i18n.Home.IntrContentESG"></div>
            </div>
        </van-popup>

        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    // import { _float } from '@/assets/js/float'
    import { Toast } from 'vant';
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
        // 重载组件
        inject: ["reload"],
        data() {
            return {
                showQuery: false, // 问号弹窗 - NFT
                showQueryESG: false, // 问号弹窗 - ESG
                isNFT: false, // 是否有NFT
                isESG: false, // 旧 esg
                NFTnums: 0, // nft数量
                ESGnums: 0, // esg数量
                showLoading: false, // 加载中
            }
        },
        computed: {
            ...mapState(['address', 'ethNetWork']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),

            i18n() {
                return this.$t('message');
            }
        },
        created() {
            // 需要合约实例化后运行的函数 异步函数队列
            setTimeout(async () => {
                if (this.vuex_myContract != {}) {
                    // this.getNFT()
                    // this.getEsg()
                }
            }, 0)
            
        },
        methods: {
            // 检测 loading 加载
            hiddenLoading() {
                // 检测 延迟 31s loading 加载是否还在加载
                setTimeout(() => {
                    if (this.showLoading) {
                        this.showLoading = false
                    }
                }, 31000);
            },
            
            // 查询 ESG
            // getEsg() {
            //     this.vuex_myContract.contrart_Tokens.methods.balanceOf(this.address).call().then(res => {
            //         console.log(res)
            //         if (res == 0) {
            //             this.isESG = false
            //         } else {
            //             // nft 数量
            //             this.ESGnums = res
            //             this.isESG = true
            //         }
            //     })
            // },

            // 查询NFT 
            getNFT() {
                this.vuex_myContract.contrart_NFT.methods.balanceOf(this.address).call().then(res => {
                    // console.log(res)
                    if (res == 0) {
                        this.isNFT = false
                    } else {
                        // nft 数量
                        this.NFTnums = res
                        this.isNFT = true
                    }
                })
            },

            // 授权 - ESG
            async approvedESG() {
                return new Promise(async (resolve, reject) => {
                    // 查询授权
                    let isApproved = false
                    await this.vuex_myContract.contrart_Tokens.methods.allowance(this.address, Eth.contract.contrart_NowTokens.addr).call().then(res => {
                        console.log("esg ==>", res)
                        if (res >= this.ESGnums) {
                            isApproved = true
                        } else {
                            isApproved = false
                        }
                    })

                    if (isApproved) return resolve()

                    let data = {
                        name: 'approve', // 方法名
                        inputs: [{
                            "name": "spender",
                            "type": "address"
                        },{
                            "name": "amount",
                            "type": "uint256"
                        }],
                        arguments: [
                            Eth.contract.contrart_NowTokens.addr,
                            this.ESGnums
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_Tokens.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                            resolve()
                        }
                    }).catch(err => {
                        reject()
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

                })
            },  

            // 授权 - NFT
            async approved() {
                return new Promise(async (resolve, reject) => {

                    // 查询授权
                    let isApprovedForAll = false
                    await this.vuex_myContract.contrart_NFT.methods.isApprovedForAll(this.address, Eth.contract.contrart_NowNFT.addr).call().then(res => {
                        if (res) {
                            isApprovedForAll = true
                        } else {
                            isApprovedForAll = false
                        }
                    })

                    if (isApprovedForAll) return resolve()

                    let data = {
                        name: 'setApprovalForAll', // 方法名
                        inputs: [{
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "name": "approved",
                            "type": "bool"
                        }],
                        arguments: [
                            Eth.contract.contrart_NowNFT.addr,
                            true
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_NFT.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                            resolve()
                        }
                    }).catch(err => {
                        reject()
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

                })
            },

            // 迁移
            async migration() {
                this.showLoading = true
                // 验证授权
                await this.approved().then(async (res) => {
                    // 循环次数
                    let nums = 0
                    // 获取tokenid
                    if (this.NFTnums <= 30) {
                        nums = this.NFTnums
                    } else {
                        nums = 30
                    }
                    // tokenid 数组
                    let tokenidArr = []
                    for (let i = 0; i < nums; i++) {
                        await this.vuex_myContract.contrart_NFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(res => {
                            tokenidArr.push(res)
                        })
                    }
                    console.log(tokenidArr)

                    // 发起迁移参数
                    let data = {
                        name: 'migrate', // 方法名
                        inputs: [{
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "name": "tokenIds",
                            "type": "uint256[]"
                        }],
                        arguments: [
                            this.address,
                            tokenidArr
                        ] // 参数
                    }

                    // 发起迁移
                    await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: `${this.i18n.Home.MigrateSuccess}: ${nums} ${this.i18n.Home.Per}`, icon: 'success' });
                            setTimeout(() => {
                                this.showLoading = false
                                this.reload()
                            }, 1000);
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
                        this.showLoading = false
                    })
                }).catch(err => {
                    Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
                    this.showLoading = false
                })

            },

            async mappingEsg() {
                this.showLoading = true
                // 验证授权
                await this.approvedESG().then(async (res) => {
                    // 发起迁移参数
                    let data = {
                        name: 'exchange', // 方法名
                        inputs: [],
                        arguments: [] // 参数
                    }

                    // 发起迁移
                    await contractMethods(this.address, Eth.contract.contrart_NowTokens.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: `${this.i18n.Home.MappingSuccess}`, icon: 'success' });
                            setTimeout(() => {
                                this.showLoading = false
                                this.reload()
                            }, 1000);
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
                        this.showLoading = false
                    })
                }).catch(err => {
                    Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
                    this.showLoading = false
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    
    .home_wrap {
        width: 100vw;
        height: 100vh;
        background: url(../assets/img/index.jpg) no-repeat;
        background-size: 100% 100%;
        padding: 90px 44px 20px;
        box-sizing: border-box;
        
        .down_arrow {
            width: 108px;
            height: 108px;
            position: fixed;
            left: 321px;
            bottom: 118px;
        }
    }
    .card_box {
        width: 100%;
        height: 240px;
        background: url("../assets/img/home_btnbag.png") no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;
        position: relative;
        .icon_qurey {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 24px;
            right: 34px;
        }
        h1{
            font-size: 36px;
            text-align: center;
            font-weight: bolder;
            font-family: "PingFangSC-Semibold";
            margin-top: 34px;
            margin-bottom: 22px;
            font-family: AlibabaPuHuiTiH;
        }
        .btn_box {
            width: 510px;
            height: 100px;
            background: url(../assets/img/home_btn.png) no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            box-sizing: border-box;
            font-size: 36px;
            font-weight: 600;
            font-family: AlibabaPuHuiTiH;
        }
    }

    .query_pop {
        width: 662px;
        height: 652px;
        background: url(../assets/img/intr_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 48px 45px;
        box-sizing: border-box;
        position: relative;

        .close {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 52px;
            right: 42px;
        }

        .pop_title {
            height: 40px;
            font-size: 36px;
            padding: 0 0 062px;
            text-align: center;
            font-weight: 600;
        }

        .pop_content {
            height: 600px;
            font-size: 26px;
            line-height: 40px;
            overflow: scroll;
            word-break: break-all;
            text-indent: 2em;
        }
    }
</style>