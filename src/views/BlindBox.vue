<template>
    <div class="blind_box_wrap">
        <div class="card_box">
            <div class="blind_box">
                <img src="../assets/img/query.png" alt="" class="icon_qurey" @click="showQuery = !showQuery">
                <img v-if="$store.state.language=='en-US'" src="../assets/img/HELIUM-3BOX.png" alt="" class="logo">
                <img v-else src="../assets/img/lucky_title.png" alt="" class="lucky">
                <div class="lucky_num f-a-c">
                    <div class="row f-d-c f-j-a-c">
                        <span class="f-j-a-c">{{i18n.BlindBox.LuckyPool}}(BNB)</span>
                        <span>{{ luckyPool }}</span>
                    </div>
                    <div class="row f-d-c f-j-a-c">
                        <span class="f-j-a-c">{{i18n.BlindBox.All}}</span>
                        <span>{{ AllIn }}</span>
                    </div>
                </div>
            </div>

            <div class="num_box f-j-sa-a-c">
                <img src="../assets/img/Binance.png" alt="" class="Binance">

                <div class="inp_group f-a-c" @input="changeNum">
                    <input type="number" v-model="num" placeholder="0.1-30.0">
                </div>

                <div class="options f-d-c f-j-a-c">
                    <!-- <img src="../assets/img/top.png" alt="" class="plus">
                    <img src="../assets/img/down.png" alt="" class="minus"> -->
                </div>
            </div>

            <div class="rate_box f-j-a-c">
                <img src="../assets/img/rate.png" alt="">
                <span>+ {{ esgRatio }}</span>
            </div>

            <div class="lucky_num_box">
                <div class="sub_title">{{i18n.Main.LuckyNumber}}</div>
                <div class="swipper f-j-sa-a-c">
                    <van-swipe class="my_swipe" :show-indicators="false" :vertical="true" @change="LuckyNum1">
                        <van-swipe-item v-for="(item,index) in numList" :key="index">
                            <img :src="item.icon" alt="" class="swipe_img">
                        </van-swipe-item>
                    </van-swipe>

                    <van-swipe class="my_swipe" :show-indicators="false" :vertical="true" @change="LuckyNum2">
                        <van-swipe-item v-for="(item,index) in numList" :key="index">
                            <img :src="item.icon" alt="" class="swipe_img">
                        </van-swipe-item>
                    </van-swipe>

                    <van-swipe class="my_swipe" :show-indicators="false" :vertical="true"  @change="LuckyNum3">
                        <van-swipe-item v-for="(item,index) in numList" :key="index">
                            <img :src="item.icon" alt="" class="swipe_img">
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>

            <div class="btn_box f-j-a-c" @click="OpenBlindBox">{{i18n.BlindBox.OpenBlindBox}}</div>

            <div class="store_box">
                <div class="store_item" v-for="(item,index) in storeList" :key="index" @click="handleCard(item)">
                    <img :src="item.icon" alt="">
                    <span>{{i18n.BlindBox[item.key]}}</span>
                </div>
            </div>
        </div>

        <van-popup v-model="showQuery" position="center">
            <div class="query_pop">
                <img src="../assets/img/close.png" alt="" class="close" @click="showQuery = false">
                <div class="pop_title">{{i18n.BlindBox.Introduce}}</div>
                <div class="pop_content" v-html="i18n.BlindBox.IntrContent"></div>
            </div>
        </van-popup>

        <van-popup v-model="showCard" position="center">
            <div class="card_pop f-d-c f-j-a-c">
                <img src="../assets/img/close.png" alt="" class="close" @click="showCard = false">
                <img :src="current.large" alt="">
                <div class="card_name">{{i18n.BlindBox[current.key]}}</div>
                <div class="pop_content">{{i18n.BlindBox[current.intr]}}</div>
            </div>
        </van-popup>

        <van-popup v-model="showInp" position="center">
            <div class="inp_pop f-d-c f-a-c">
                <div class="inp_titile">{{i18n.BlindBox.BindInviter}}</div>
                <div class="inp_group">
                    <textarea v-model="inviteAddr" :placeholder="i18n.BlindBox.InviterPlc"></textarea>
                </div>
                <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.BlindBox.Confirm}}</div>
            </div>
        </van-popup>
        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
        <van-popup v-model="showBlindBox" position="center" :close-on-click-overlay="true" overlay-class="success_pup" >
            <div class="blind_success_box">
                <h1>{{ i18n.BlindBox.BuySuccess }}</h1>
                <div class="blind_success">
                    <img src="../assets/img/blind_success.png" alt="" srcset="">
                </div>
                <div class="open_btn f-j-a-c" @click="goOpen">{{i18n.BlindBox.GoOpenBlindBox}}</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { _float } from '@/assets/js/float'
    import { _tools } from '@/assets/js/utils'
    import { contractMethods, GetStaticInfo } from '@api'
    // 导入以太坊合约配置文件
    import { Eth } from '@eth'
    //创建命名空间帮助者：createNamespacedHelpers
    import { createNamespacedHelpers, mapState, mapMutations } from "vuex";

    //导入辅助函数
    const {
    mapState: web3MapState,
    mapMutations: web3MapMutations
    } = createNamespacedHelpers("web");
    import { Toast } from 'vant';
    export default {
        
        data() {
            return {
                num: '', // 下注盲盒？
                numList: [
                    { icon: require('../assets/img/number_0.png') },
                    { icon: require('../assets/img/number_1.png') },
                    { icon: require('../assets/img/number_2.png') },
                    { icon: require('../assets/img/number_3.png') },
                    { icon: require('../assets/img/number_4.png') },
                    { icon: require('../assets/img/number_5.png') },
                    { icon: require('../assets/img/number_6.png') },
                    { icon: require('../assets/img/number_7.png') },
                    { icon: require('../assets/img/number_8.png') },
                    { icon: require('../assets/img/number_9.png') },
                ],
                storeList: [
                    { id: 1, key: 'MBA', intr: 'MBAIntr', icon: require('../assets/img/mask_1_b.png'), large: require('../assets/img/mask_1_a.png') },
                    { id: 2, key: 'MBB', intr: 'MBBIntr', icon: require('../assets/img/mask_2_b.png'), large: require('../assets/img/mask_2_a.png') },
                    { id: 3, key: 'MBC', intr: 'MBCIntr', icon: require('../assets/img/mask_3_b.png'), large: require('../assets/img/mask_3_a.png') },
                    { id: 4, key: 'MBD', intr: 'MBDIntr', icon: require('../assets/img/mask_4_b.png'), large: require('../assets/img/mask_4_a.png') },
                ],
                current: {},
                showQuery: false,
                showCard: false,
                showInp: false,
                AllIn: 0, // 总入金
                isReferrer: false, // 是否有推荐人
                inviteAddr: '', // 邀请人地址

                ratio: 0, // 汇率
                luckyNum1: '0', // 幸运数字1
                luckyNum2: '0', // 幸运数字2
                luckyNum3: '0', // 幸运数字3
                luckyNum: '', // 幸运数字
                luckyPool: 0, // 幸运池
                showLoading: false, // 加载中
                showBlindBox: false, // 购买成功
                esgRatio: '', // esg汇率
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
        created () {
            console.log(this.$web3Url)
            console.log(Eth.contract.contrart_Helium, this.$web3Url)
            // 需要合约实例化后运行的函数 异步函数队列
            setTimeout(async () => {
                if (this.vuex_myContract != {}) {
                    this.showLoading = true
                    this.getRatio()
                    await this.getReferrer(this.address)
                    await this.getLucky()
                    this.getAllIn()
                    this.showLoading = false
                }
            }, 0);
        },

        methods: {
            changeNum() {
                this.esgRatio = Number(_float.mul(this.num, this.ratio)).toFixed(2)
            },

            // 获取总入金
            getAllIn() {
                GetStaticInfo().then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data
                        this.AllIn = Number(_float.div(data.DividendsUserAllEthIn, Math.pow(10, 18))).toFixed(3)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            
            // 获取换算比例
            async getRatio() {
                this.vuex_myContract.contract_Config.methods.BNB_ESGRatio().call().then(res => {
                    // 除以开方
                    this.ratio = _tools.formatDecimal(Number(res) / Math.pow(10, 6), 2);
                })
            },

            // 幸运数字 1 
            LuckyNum1(index) {
                this.luckyNum1 = index + ''
            },
            // 幸运数字 2 
            LuckyNum2(index) {
                this.luckyNum2 = index + ''
            },
            // 幸运数字 3 
            LuckyNum3(index) {
                this.luckyNum3 = index + ''
            },
            
            handleCard(item) {
                this.showCard = true;
                this.current = item;
            },

            // 获取幸运池
            getLucky() {
                this.vuex_myContract.contrart_Helium.methods.LuckyPollAllValue().call().then(res => {
                    this.luckyPool = Number(res / Math.pow(10, 18)).toFixed(3)
                })
            },

            // 判断该地址是否有推荐人 / 是否是合法推荐人地址
            async getReferrer(accounts) {
                // 查询推荐人
                let addr = ''
                await this.vuex_myContract.contrart_Helium.methods.RecommendOf(accounts).call().then(res => {
                    if (res == '0x0000000000000000000000000000000000000000') {
                        // 无推荐人
                        this.isReferrer = false
                    } else {
                        this.isReferrer = true
                        addr = res
                    }
                })
                return addr
            },

            // 打开地址输入弹窗
            async OpenBlindBox() {
                
                if (!this.isLink) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });

                // 判断合法性
                if (this.num == '') {
                    Toast({ message: this.i18n.BlindBox.ruleNull, icon: 'fail' });
                    return
                } else if (Number(this.num) < 0.1) {
                    Toast({ message: this.i18n.BlindBox.ruleLow, icon: 'fail' });
                    return
                } else if (Number(this.num) > 30) {
                    Toast({ message: this.i18n.BlindBox.ruleHei, icon: 'fail' });
                    return
                }

                // 查询 BNB 余额
                let balanceBnb = 0
                await this.vuex_web3.eth.getBalance(this.address).then(res => {
                    console.log('BNB ==>', res)
                    balanceBnb = res / Math.pow(10, 18)
                });
                // BNB 余额不足
                if (balanceBnb < this.num) {
                    this.showLoading = false;
                    return Toast({ message: this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' });
                }
                
                // 查询 ESG 余额
                let balanceEsg = 0
                await this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
                    console.log('ESG ==>', res)
                    balanceEsg = res / Math.pow(10, 18)
                })
                // ESG 余额不足
                if (balanceEsg < this.num * this.ratio) {
                    this.showLoading = false;
                    return Toast({ message: this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' });
                }
                
                // 幸运数字
                this.luckyNum = this.luckyNum1 + this.luckyNum2 + this.luckyNum3
                if (!this.isReferrer) {
                    // 无推荐人则填写推荐人
                    this.showInp = true;
                } else {
                    // 已有推荐人 直接发起购买
                    this.showInp = false;
                    let inviteAddr = await this.getReferrer(this.address)
                    console.log(inviteAddr)
                    this.showLoading = true
                    // 检测loading
                    this.hiddenLoading()
                    this.buyBlindBox(inviteAddr)
                }
                
            },

            // 验证
            async onConfirm() {
                if (!this.inviteAddr) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });
                
                this.showLoading = true
                // 检测loading
                this.hiddenLoading()
                // 验证以太坊地址合法性
                let isAddr = await this.vuex_web3.utils.isAddress(this.inviteAddr)
                // return
                if (!isAddr) {
                    this.showLoading = false;
                    return Toast({ message: this.i18n.BlindBox.ruleAddr, icon: 'fail' });
                }

                // 验证是否合法地址 （即有推荐人的地址）
                // await this.getReferrer(this.inviteAddr)

                // if (!this.isReferrer) return Toast({ message: this.i18n.BlindBox.ruleAddr, icon: 'fail' });
                
                // 查询 BNB 余额
                let balanceBnb = 0
                await this.vuex_web3.eth.getBalance(this.address).then(res => {
                    console.log('BNB ==>', res)
                    balanceBnb = res / Math.pow(10, 18)
                });
                // BNB 余额不足
                if (balanceBnb < this.num) {
                    this.showLoading = false;
                    return Toast({ message: this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' });
                }
                
                // 查询 ESG 余额
                let balanceEsg = 0
                await this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
                    console.log('ESG ==>', res)
                    balanceEsg = res / Math.pow(10, 18)
                })
                // ESG 余额不足
                if (balanceEsg < this.num * this.ratio) {
                    this.showLoading = false;
                    return Toast({ message: this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' });
                }

                // 查询授权
                let isApprove = false
                // 判断 USDT 授权
                await this.vuex_myContract.contrart_NowTokens.methods.allowance(this.address, Eth.contract.contrart_Helium.addr).call().then(res => {
                    let data = _float.div(res, Math.pow(10, 18))
                    if (data == 0) {
                        // 未授权代币
                        isApprove = false
                    } 
                    else if (data < this.num * this.ratio) {
                        // 授权代币 小于待支付代币
                        isApprove = false
                    } 
                    else {
                        // 已授权
                        isApprove = true
                    }
                })

                if (!isApprove) {
                    console.log('未授权')
                    // 未授权
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
                            Eth.contract.contrart_Helium.addr,
                            '10000000000000000000000000000000'
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_NowTokens.addr, data).then(async res => {
                        if (res.code == 101) {
                            this.buyBlindBox()
                        }
                    }).catch(err => {
                        console.error(err.message);
                        this.showLoading = false
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

                } else {
                    // 已授权 发起购买
                    this.buyBlindBox()

                }
            },

            async buyBlindBox(inviteAddr = '') {
                let inviteAccounts = inviteAddr == '' ? this.inviteAddr : inviteAddr
                // 查询授权
                let isApprove = false
                // 判断 USDT 授权
                await this.vuex_myContract.contrart_NowTokens.methods.allowance(this.address, Eth.contract.contrart_Helium.addr).call().then(res => {
                    let data = _float.div(res, Math.pow(10, 18))
                    if (data == 0) {
                        // 未授权代币
                        isApprove = false
                    } 
                    else if (data < this.num * this.ratio) {
                        // 授权代币 小于待支付代币
                        isApprove = false
                    } 
                    else {
                        // 已授权
                        isApprove = true
                    }
                })

                let pay = false
                if (!isApprove) {
                    console.log('未授权 / 授权余额不足')
                    // 未授权
                    // // abi 编码调用方法参数 methodsid
                    // let data = this.vuex_web3.eth.abi.encodeFunctionCall({
                    //     name: 'approve', // 调用的方法名
                    //     type: "function",
                    //     inputs: [{
                    //         "name": "spender",
                    //         "type": "address"
                    //     }, {
                    //         "name": "amount",
                    //         "type": "uint256"
                    //     }],
                    // }, [Eth.contract.contrart_Helium.addr, '10000000000000000000000000000000']); // 参数 授权给业务合约地址 Eth.contract.contrart_Helium.addr, 授权金额 最大数"10000000000000000000000000000000"
                    // // nonce
                    // let nonceNumber =  await this.vuex_web3.eth.getTransactionCount(this.address)
                    // // 获取 gas 价格
                    // let gasPrice = await this.vuex_web3.eth.getGasPrice()

                    // // walletConnect 协议发起交易必备参数
                    // const tx = {
                    //     nonce: this.vuex_web3.utils.numberToHex(nonceNumber),
                    //     from: this.address, // 发起方地址
                    //     to: Eth.contract.contrart_NowTokens.addr,
                    //     gasPrice: this.vuex_web3.utils.numberToHex(gasPrice),
                    //     gas: this.vuex_web3.utils.numberToHex(210000), // limit gas 限制
                    //     data, // 掉起合约方法编译的abi编码
                    // };
                    // // 发起交易
                    // this.callback(null)
                    // // 发起交易
                    // await this.money.sendTransaction(tx).then((result) => {
                    //     // 返回交易hax
                    //     console.log(result);
                    //     let number_takeGain = 1
                    //     let timer_takeGain = setInterval(() => {
                    //         number_takeGain++
                    //         // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
                    //         this.vuex_web3.eth.getTransactionReceipt(result).then((res) => {
                    //             if (res == null) {
                    //                 this.callback(res)
                    //             } else if (res.status) {
                    //                 pay = true
                    //                 this.callback(res.status, res.transactionHash)
                    //                 clearInterval(timer_takeGain);
                    //             } else {
                    //                 pay = false
                    //                 this.callback(res.status, res.transactionHash)
                    //                 clearInterval(timer_takeGain);
                    //             }
                    //         });
                    //         if (number_takeGain > 10) {
                    //             pay = false
                    //             this.callback("timeout")
                    //             clearInterval(timer_takeGain);
                    //             number_takeGain = 1;
                    //         }
                    //     }, 3000)

                    // }).catch((error) => {
                    //     // Error returned when rejected
                    //     console.error(error.message);
                    //     Toast({ message: error.message, icon: 'fail' });
                    //     this.showLoading = false
                    //     pay = false
                    // });

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
                            Eth.contract.contrart_Helium.addr,
                            '10000000000000000000000000000000'
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_NowTokens.addr, data).then(async res => {
                        if (res.code == 101) {
                            pay = true
                        }
                    }).catch(err => {
                        console.error(err.message);
                        this.showLoading = false
                        pay = false
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

                } else {
                    // 支付
                    pay = true
                }

                console.log(pay)
                if (!pay) return

                // 发起购买

                let params = {
                    name: 'buyBlindBox', // 方法名
                    inputs: [{
                        "name": "_recommend",
                        "type": "address"
                    },{
                        "name": "_lucky_number",
                        "type": "uint256"
                    },{
                        "name": "esgType",
                        "type": "uint256"
                    }],
                    arguments: [inviteAccounts, this.luckyNum, 0], // 参数
                    value: this.num * Math.pow(10, 18) + '' // 以 wei 单位计价
                }
                
                await contractMethods(this.address, Eth.contract.contrart_Helium.addr, params).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: `${this.i18n.BlindBox.BuySuccess}：${_tools.formatDecimal((this.num / 0.1), 0)}`, icon: 'success' });
                        this.showLoading = false
                        this.showBlindBox = true
                        // let id = 0
                        // // 订单收据
                        // let haxToken = res.hax.logs[1].topics[3]
                        // let tokenid = this.vuex_web3.eth.abi.decodeParameter('uint256', haxToken)
                        // await this.vuex_myContract.contrart_NowNFT.methods.typeOf(tokenid).call().then(res => {
                        //     console.log('类型 ==>', res)
                        //     id = res
                        // })
                        // this.showLoading = false
                        // console.log('showLoading ==>', this.showLoading)
                        // this.$router.push({
                        //     path: '/Success',
                        //     query: {id}
                        // })
                    } else {
                        Toast({ message: res.message, icon: 'fail' });
                        this.showLoading = false
                    }
                }).catch(err => {
                    console.log('购买失败 ==>', err.message)
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
            },

            // 查询交易结果的回调函数
            callback(status, hax = null) {
                console.log('交易进度 status==>', status)
                if (status == true) {
                    console.log('交易成功 hax==>', hax)
                } else if (status == false) {
                    console.log('交易失败 hax==>', hax)
                } else if (status == "refuse") {
                    console.log('交易拒绝')
                } else if (status == "timeout") {
                    console.log('交易超时')
                } else if (status == "fail") {
                    console.log('交易失败')
                }
            },

            // 去开启页面
            goOpen() {
                this.$router.push({path: '/MaskBaby'})
            },

            // 检测 loading 加载
            hiddenLoading() {
                // 检测 延迟 31s loading 加载是否还在加载
                setTimeout(() => {
                    if (this.showLoading) {
                        this.showLoading = false
                    }
                }, 31000);
            }
        },

    }
</script>
<style lang="scss" scoped>
    .blind_box_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/payment_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 124px 44px 20px;
        box-sizing: border-box;

        .card_box {
            width: 662px;
            height: 1384px;
            background: url(../assets/img/payment_pop.png) no-repeat;
            background-size: 100% 100%;
            padding: 112px 63px 58px;
            box-sizing: border-box;

            .blind_box {
                width: 536px;
                height: 532px;
                background: url(../assets/img/blind_box.png) no-repeat;
                background-size: 100% 100%;
                position: relative;

                .icon_qurey {
                    width: 36px;
                    height: 36px;
                    position: absolute;
                    top: -54px;
                    right: -18px;
                }

                .logo {
                    width: 370px;
                    height: 74px;
                    position: absolute;
                    bottom: 30px;
                    left: 84px;
                }

                .lucky {
                    width: 178px;
                    height: 74px;
                    position: absolute;
                    bottom: 30px;
                    left: 180px;
                }

                .lucky_num {
                    width: 478px;
                    height: 114px;
                    background: url(../assets/img/lucky_box.png) no-repeat;
                    background-size: 100% 100%;
                    padding: 14px 0 12px;
                    box-sizing: border-box;
                    position: absolute;
                    top: -64px;
                    left: 29px;

                    .row {
                        width: 49.8%;

                        &:last-child {
                            border-left: 2px solid #FC9203;
                        }
                    }

                    span {
                        font-size: 24px;
                        color: #FC9203;
                        text-shadow: 0px 0px 20px rgba(252, 146, 3, 0.35);

                        &:last-child {
                            font-size: 36px;
                            line-height: 50px;
                        }

                        &:first-child {
                            height: 40px;
                        }
                    }
                }
            }
        }

        .num_box {
            width: 350px;
            height: 72px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: 0px 0px 20px 0px rgba(252,146,3,0.56);
            border-radius: 6px;
            border: 1px solid #FC9203;
            padding: 0 18px;
            margin: 0px 91px 14px;
            box-sizing: border-box;

            .Binance {
                width: 36px;
                height: 36px;
            }

            .inp_group {
                width: 150px;
                height: 40px;

                input {
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0);
                    font-size: 32px;
                    font-size: 600;
                    text-align: center;
                    border: none;
                    outline: none;
                }
            }

            .options {
                img {
                    width: 16px;
                    height: 10px;

                    &:last-child {
                        margin: 10px 0 0;
                    }
                }
            }
        }

        .rate_box {

            img {
                width: 30px;
                height: 34px;
            }

            span {
                font-size: 20px;
                padding: 0 0 0 12px;
            }
        }

        .lucky_num_box {
            width: 476px;
            height: 194px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: 0px 0px 20px 0px rgba(252,146,3,0.56);
            border-radius: 6px;
            border: 1px solid #FC9203;
            padding: 16px 37px 18px;
            margin: 24px 30px 12px;
            box-sizing: border-box;

            .sub_title {
                height: 40px;
                font-size: 24px;
                text-align: center;
            }

            .swipper {
                width: 100%;
                height: 116px;

                .my_swipe {
                    width: 110px;
                    height: 116px;
                    background: url(../assets/img/number_bg.png) no-repeat;
                    background-size: 100% 100%;

                    .swipe_img {
                        width: 110px;
                        height: 116px;
                    }
                }
            }
        }

        .btn_box {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            margin: 12px 0 20px;
            box-sizing: border-box;
            font-size: 36px;
            font-weight: 600;
            font-family: AlibabaPuHuiTiH;
        }
        .open_btn {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            // margin: 12px 0 20px;
            margin: 0 auto;
            box-sizing: border-box;
            font-size: 36px;
            font-weight: 600;
            font-family: AlibabaPuHuiTiH;
        }

        .store_box {
            display: flex;
            flex-wrap: wrap;

            .store_item {
                width: 260px;
                height: 74px;
                font-size: 24px;
                padding: 30px 0 0 85px;
                box-sizing: border-box;
                margin-bottom: 28px;
                position: relative;

                img {
                    width: 260px;
                    height: 74px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                &:nth-child(odd) {
                    margin-right: 16px;
                }
            }
        }
    }

    .query_pop {
        width: 662px;
        height: 792px;
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

    .card_pop {
        width: 662px;
        height: 1274px;
        background: url(../assets/img/publicity_card.png) no-repeat;
        background-size: 100% 100%;
        padding: 0 35px;
        box-sizing: border-box;
        position: relative;

        .close {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 52px;
            right: 42px;
        }

        img {
            width: 456px;
            height: 576px;
        }

        .card_name {
            font-size: 32px;
            padding: 35px 0;
        }

        .pop_content {
            height: 350px;
            overflow: scroll;
            font-size: 26px;
            word-break: break-all;
            text-indent: 2em;
        }
    }

    .inp_pop {
        width: 662px;
        height: 668px;
        background: url(../assets/img/inp_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 74px 62px 82px;
        box-sizing: border-box;

        .inp_titile {
            height: 48px;
            font-size: 48px;
            font-weight: 600;
            color: #FC9203;
            padding: 0 0 70px;
        }

        .inp_group {
            width: 512px;
            height: 198px;
            background: url(../assets/img/inp_bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 30px 24px;
            box-sizing: border-box;

            textarea {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                font-size: 28px;
                text-align: start;
                border: none;
                outline: none;
            }
        }

        .confirm_btn {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;
            margin: 68px 0 0;
            box-sizing: border-box;
        }
    }
    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    /deep/ .success_pup {
        background-color: rgba(0, 0, 0, .9);
    }
    .blind_success_box {
        h1 {
            text-align: center;
            font-size: 48px;
            color: #FC9203;
            text-shadow: 0px 0px 10px rgba(252, 146, 3, 0.52);
            margin: 0;
        }
        .blind_success {
            width: 745px;
            height: 750px;
            background: url(../assets/img/bg_light.png) center;
            background-size: 100% 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 460px;
            }
        }
    }
</style>