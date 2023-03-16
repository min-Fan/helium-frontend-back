<template>
    <div class="upgrade_wrap">
        <div class="stone_card">
            <!-- 铸造石 -->
            <div class="card_title">{{i18n.Upgrade.FoundryStone}}</div>
            <div class="col f-j-a-c">
                <div class="item f-d-c f-j-a-c" v-for="(item,index) in stoneList" :key="index">
                    <div class="rate f-j-a-c">+{{item.rate}}%</div>
                    <img :src="item.img" alt="">
                    <span>{{i18n.Upgrade[item.key]}}</span>
                    <span>x{{item.quantity}}</span>
                </div>
            </div>
        </div>

        <div class="spaceship_card f-d-c f-j-a-c">
            <!-- S SS SS SSS SSSS级飞船 -->
            <div class="top_box f-a-c f-j-sb">
                <img src="../assets/img/prev.png" alt="" @click="handlePrev">
                <span>{{i18n.Spaceship[currentSpa.key]}}</span>
                <img src="../assets/img/next.png" alt="" @click="handleNext">
            </div>

            <img class="spaceship" :src="currentSpa.img" alt="">

            <div class="condition_box f-d-c f-a-c">
                <div class="rate">{{i18n.Upgrade.SynthesisRate}}: {{currentSpa.rate}}%</div>
                <div class="box_title">{{i18n.Upgrade.SynthesisConditions}}</div>
                <div class="row f-j-a-c">{{i18n.BlindBox[currentSpa.mask]}} x{{currentSpa.maskNum}}</div>
                <div class="row f-j-a-c">{{i18n.Spaceship[currentSpa.spa]}} x{{currentSpa.spaNum}}</div>
                <div class="row f-j-a-c" v-if="currentSpa.esc">{{currentSpa.esc}} UESG</div>
                <div class="tips">{{i18n.Upgrade[currentSpa.tips]}}</div>
            </div>

            <div class="confirm_btn f-j-a-c" @click="openPopup">{{i18n.Upgrade.Upgrade}}</div>
        </div>

        <!-- 升级弹窗 -->
        <van-popup v-model="showUpgrade" position="center">
            <div class="upgrade_pop f-d-c f-a-c">
                <div class="boost_title">{{i18n.Upgrade.SelectFoundryStone}}</div>

                <div class="attr_box">
                    <div class="col">
                        <div :class="['item','f-d-c', 'f-j-a-c',currentStone==index?'active':'']"  v-for="(item,index) in popupStone" :key="index" @click="onChange(item,index)">
                            <img class="icon" src="../assets/img/b_s.png" alt="" v-if="currentStone==index">
                            <span class="f-j-a-c">{{item.rate}}%</span>
                            <img :src="item.img" alt="">
                        </div>
                    </div>
                </div>

                <div class="text_row">
                    {{i18n.Upgrade.CurrentSynthesisRate}}:
                    {{currentSpa.rate + stone.rate}}%
                </div>
                
                <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.Upgrade.Upgrade}}</div>
            </div>
        </van-popup>

        <van-popup v-model="showChoose" position="center">
            <div class="choose_pop">
                <div class="attr_box">
                    <div class="col">
                        <div :class="['item','f-d-c', 'f-j-a-c',currentStone==index?'active':'']"  v-for="(item,index) in chooseMode" :key="index" @click="onChange(item,index)">
                            <span class="f-j-a-c" v-if="index == 0">{{i18n.Upgrade.ModeOne}}</span>
                            <span class="f-j-a-c" v-if="index == 1">{{i18n.Upgrade.ModeTwo}}</span>
                        </div>
                    </div>
                    <div class="item_text" v-if="currentStone == 0">
                        <div class="row f-j-a-c">{{i18n.BlindBox[currentSpa.mask]}} x146</div>
                        <div class="row f-j-a-c">{{1700}} UESG</div>
                    </div>
                    <div class="item_text" v-if="currentStone == 1">
                        <div class="row f-j-a-c">{{i18n.BlindBox[currentSpa.mask]}} x{{currentSpa.maskNum}}</div>
                        <div class="row f-j-a-c">{{i18n.Spaceship[currentSpa.spa]}} x{{currentSpa.spaNum}}</div>
                        <div class="row f-j-a-c" v-if="currentSpa.esc">{{currentSpa.esc}} UESG</div>
                    </div>
                    <div class="confirm_btn f-j-a-c" @click="risingS">{{i18n.Upgrade.Upgrade}}</div>
                </div>
            </div>
        </van-popup>

        <!-- 成功弹窗 -->
        <van-popup v-model="showSuccess" position="center">
            <div class="synthetic_pop f-d-c f-j-a-c">
                <div class="synthetic_title">{{i18n.Upgrade.SuccessTips}}</div>
                <img src="../assets/img/s.png" alt="" class="spaceship" v-if="current == 1">
                <img src="../assets/img/ss.png" alt="" class="spaceship" v-if="current == 2">
                <img src="../assets/img/sss.png" alt="" class="spaceship" v-if="current == 3">
                <img src="../assets/img/ssss.png" alt="" class="spaceship" v-if="current == 4">
                <!-- <div class="tabbar f-a-c">
                    <div :class="['tab_item', 'f-j-sa-a-c', current==index?'active':'']" v-for="(item,index) in spaceshipList" :key="index" @click="onSpaChange(item,index)">
                        <img :src="item.img" alt="">
                    </div>
                </div> -->
                <div class="confirm_btn f-j-a-c" style="margin-top: 20px" @click="onSuccess">{{i18n.Upgrade.Confirm}}</div>
            </div>
        </van-popup>

        <!-- 失败弹窗 -->
        <van-popup v-model="showFail" position="center">
            <div class="synthetic_pop f-d-c f-j-a-c">
                <div class="synthetic_title">{{i18n.Upgrade.FailTips}}</div>
                <div class="col_box f-a-c">
                    <div class="col_item f-d-c f-a-c">
                        <img :src="failAttr.img" alt="">
                        <span>{{failAttr.rate}}% {{i18n.Boost.AttributeCard}}</span>
                        <span>x1</span>
                    </div>
                    <div class="col_item f-d-c f-a-c">
                        <img :src="failStone.img" alt="">
                        <span>{{i18n.Upgrade[failStone.key]}}</span>
                        <span>x1</span>
                    </div>
                </div>
                <div class="confirm_btn f-j-a-c" @click="onFail">{{i18n.Upgrade.Confirm}}</div>
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
import { _float } from '@/assets/js/float'
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
    data() {
        return {
            showLoading: false, // 加载中
            // 铸造石
            stoneList: [
                { id: 1, key: 'Red', img: require('../assets/img/red.png'), rate: 5, quantity: 0, tokenidArr: [] },
                { id: 2, key: 'Blue', img: require('../assets/img/blue.png'), rate: 8, quantity: 0, tokenidArr: [] },
                { id: 3, key: 'Purple', img: require('../assets/img/purple.png'), rate: 10, quantity: 0, tokenidArr: [] }
            ],
            // 当前铸造石
            currentStone: 0,
            stone: {},
            // 飞船 rate：合成率，mask：所需面具宝宝，spa: 所需飞船 ，esc：所需esg，tips：贴士
            spaceship: [
                { key: 'SClass', img: require('../assets/img/s.png'), rate: 100, mask: 'MBA', maskNum: 35, spa: 'NClass', spaNum: 1, esc: '1700', tips: '' },
                { key: 'SSClass', img: require('../assets/img/ss.png'), rate: 70, mask: 'MBB', maskNum: 35, spa: 'SClass', spaNum: 1, esc: '', tips: 'Tips' },
                { key: 'SSSClass', img: require('../assets/img/sss.png'), rate: 60, mask: 'MBC', maskNum: 16, spa: 'SSClass', spaNum: 1, esc: '', tips: 'Tips' },
                { key: 'SSSSClass', img: require('../assets/img/ssss.png'), rate: 50, mask: 'MBD', maskNum: 8, spa: 'SSSClass', spaNum: 1, esc: '', tips: 'Tips' }
            ],
            // 当前飞船
            currentIndex: 0,
            currentSpa: {},
            showUpgrade: false,
            // 弹窗铸造石
            popupStone: [],
            // 升级成功
            showSuccess: false,
            current: 0,
            currentImg: require('../assets/img/s.png'),
            // 升级成功后的飞船
            spaceshipList: [
                { img: '' },
            ],
            // 升级失败
            showFail: false,
            // 属性
            attrList: [
                { img: require('../assets/img/rate_1.png'), rate: 1  },
                { img: require('../assets/img/rate_2.png'), rate: 2  }
            ],
            showChoose: false, // 选择方式弹窗
            chooseMode: [
                {mode: '',},
                {mode: '',}
            ], // 选择方式
            nft: {}, // 卡牌
            failAttr: {}, // 失败获得的属性卡
            failStone: {}, // 失败获得的宝石类型
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        }
    },
    created() {
        // 需要合约实例化后运行的函数 异步函数队列
        setTimeout(() => {
            if (this.vuex_myContract != {}) {
                this.getNft()
            }
        }, 0)
        this.currentSpa = this.spaceship[0];
    },
    methods: {
        // prev
        handlePrev() {
            if (this.currentIndex==0) this.currentIndex = 3;
            else this.currentIndex --;

            this.currentSpa = this.spaceship[this.currentIndex];
        },

        // next
        handleNext() {
            if (this.currentIndex==3) this.currentIndex = 0;
            else this.currentIndex ++;

            this.currentSpa = this.spaceship[this.currentIndex];
        },

        // 获取飞船数量
        async getNft() {
            this.stoneList[0].quantity = 0
            this.stoneList[1].quantity = 0
            this.stoneList[2].quantity = 0
            this.nft = []
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
                await this.vuex_myContract.contrart_NowNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
                    obj.tokenid = res 
                    await this.vuex_myContract.contrart_NowNFT.methods.typeOf(res).call().then(res => {
                        obj.type = res
                        nftArr.push(obj)
                    })
                })
            }))

            nftArr.map(v => {
                if (!this.nft[v.type]) {
                    this.nft[v.type] = {
                        quantity: 1,
                        tokenid: []
                    }
                    this.nft[v.type].quantity = 1
                    this.nft[v.type].tokenid.push(v.tokenid)
                } else {
                    this.nft[v.type].quantity += 1
                    this.nft[v.type].tokenid.push(v.tokenid)
                }

                if (v.type == 11) {
                    this.vuex_myContract.contrart_NowNFT.methods.stoneColor(v.tokenid).call().then(res => {
                        if (res == 1) {
                            this.stoneList[0].quantity += 1
                            this.stoneList[0].tokenidArr.push(v.tokenid)
                        } else if (res == 2) {
                            this.stoneList[1].quantity += 1
                            this.stoneList[1].tokenidArr.push(v.tokenid)
                        } else if (res == 3) {
                            this.stoneList[2].quantity += 1
                            this.stoneList[2].tokenidArr.push(v.tokenid)
                        }
                    })
                }
            })

            console.log(this.nft)

            this.showLoading = false
        },

        // 升级S飞船
        async risingS() {
            // 查询 ESG 余额
            let balance = 0
            let balanceEsg = 0
            await this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
                balance = res
                balanceEsg = res / Math.pow(10, 18)
            })
            console.log('ESG ==>', balanceEsg)
            if (balanceEsg < 1700) {
                Toast({ message: this.i18n.Upgrade.EsgBalance, icon: 'fail' })
                return
            }
            // 查询授权
            let isApprove = false
            // 判断 ESG 授权
            await this.vuex_myContract.contrart_NowTokens.methods.allowance(this.address, Eth.contract.contrart_NowNFT.addr).call().then(res => {
                console.log(res)
                let data = _float.div(res, Math.pow(10, 18))
                if (data == 0) {
                    // 未授权代币
                    isApprove = false
                } else if (data < 1700) {
                    // 授权代币 小于待支付代币
                    isApprove = false
                } 
                else {
                    // 已授权
                    isApprove = true
                }
            })
            let isPass = false
            if (!isApprove) {
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
                        Eth.contract.contrart_NowNFT.addr,
                        balance
                    ] // 参数
                }

                // 发起授权
                await contractMethods(this.address, Eth.contract.contrart_NowTokens.addr, data).then(async res => {
                    if (res.code == 101) {
                        isPass = true
                        Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                    }
                }).catch(err => {
                    isPass = false
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
            } else {
                isPass = true
            }

            if (!isPass) return Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });

            let nftArr = Object.assign([], this.nft)
            // 合成方式
            if (this.currentStone == 0) {
                if (nftArr[1] && nftArr[1].quantity >= 146) {
                    this.showLoading = true
                    console.log("方式一 ==>", nftArr[1].tokenid.slice(0, 146))
                    let data = {
                        name: 'synthesisS1', // 方法名
                        inputs: [{
                            "name": "to",
                            "type": "address"
                        },{
                            "name": "tokens",
                            "type": "uint256[]"
                        }],
                        arguments: [
                            this.address,
                            nftArr[1].tokenid.slice(0, 146),
                        ] // 参数
                    }

                    this.showChoose = false
                    // 发起合成
                    await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                        if (res.code == 101) {
                            this.current = 1;
                            this.showSuccess = !this.showSuccess;
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
                } else {
                    Toast({ message: this.i18n.Upgrade.Rule, icon: 'fail' });
                }
            } else if (this.currentStone == 1) {
                if (nftArr[1] && nftArr[5] && nftArr[1].quantity >= 35 && nftArr[5].quantity >= 1) {
                    this.showLoading = true
                    console.log("方式二 ==>")
                    let data2 = {
                        name: 'synthesisS2', // 方法名
                        inputs: [{
                            "name": "to",
                            "type": "address"
                        },{
                            "name": "tokens",
                            "type": "uint256[]"
                        },{
                            "name": "ntoken",
                            "type": "uint256"
                        }],
                        arguments: [
                            this.address,
                            nftArr[1].tokenid.slice(0, 35),
                            nftArr[5].tokenid[0],
                        ] // 参数
                    }

                    this.showChoose = false
                    // 发起合成
                    await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data2).then(async res => {
                        if (res.code == 101) {
                            this.current = 1;
                            this.showSuccess = !this.showSuccess;
                            // Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
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
                } else {
                    Toast({ message: this.i18n.Upgrade.Rule, icon: 'fail' });
                }
            }
        },

        openPopup() {
            // console.log(this.currentSpa.key)

            this.popupStone = [
                {  id: 0, key: 'null', img: require('../assets/img/null.png'), rate: 0 },
                { id: 1, key: 'Red', img: require('../assets/img/red.png'), rate: 5, quantity: 0 },
                { id: 2, key: 'Blue', img: require('../assets/img/blue.png'), rate: 8, quantity: 0 },
                { id: 3, key: 'Purple', img: require('../assets/img/purple.png'), rate: 10, quantity: 0 }
            ]

            this.stone = this.popupStone[0];
            this.currentStone = 0;

            if (this.currentSpa.key == 'SClass') this.showChoose = !this.showChoose;
            else this.showUpgrade = !this.showUpgrade;
            
            // console.log(this.popupStone);
        },

        // 选择属性
        onChange(item,index) {
            this.stone = item;
            this.currentStone = index;
        },

        // 升级
        async onConfirm() {
            if (this.currentStone == 1 && this.stoneList[0].quantity == 0 || this.currentStone == 2 && this.stoneList[1].quantity == 0 || this.currentStone == 3 && this.stoneList[2].quantity == 0) {
                Toast({ message: this.i18n.Upgrade.RuleStone, icon: 'fail' });
                return
            }

            let nftArr = Object.assign([], this.nft)
            let fncName = ''
            let cardArr = []
            let sArr = ''
            let stone = ''
            if (this.currentIndex == 1) {
                if (nftArr[2] && nftArr[6] && nftArr[2].quantity >= 35 && nftArr[6].quantity >= 1) {
                    fncName = 'synthesisSS'
                    cardArr = nftArr[2].tokenid.slice(0, 35)
                    sArr = nftArr[6].tokenid[0]
                } else {
                    Toast({ message: this.i18n.Upgrade.Rule, icon: 'fail' });
                    return
                }
            } else if (this.currentIndex == 2) {
                if (nftArr[3] && nftArr[7] && nftArr[3].quantity >= 16 && nftArr[7].quantity >= 1) {
                    fncName = 'synthesisSSS'
                    cardArr = nftArr[3].tokenid.slice(0, 16)
                    sArr = nftArr[7].tokenid[0]
                } else {
                    Toast({ message: this.i18n.Upgrade.Rule, icon: 'fail' });
                    return
                }
            } else if (this.currentIndex == 3) {
                if (nftArr[4] && nftArr[8] && nftArr[4].quantity >= 8 && nftArr[8].quantity >= 1) {
                    fncName = 'synthesisSSSS'
                    cardArr = nftArr[4].tokenid.slice(0, 8)
                    sArr = nftArr[8].tokenid[0]
                } else {
                    Toast({ message: this.i18n.Upgrade.Rule, icon: 'fail' });
                    return
                }
            }

            if (this.currentStone == 0) {
                stone = 0
            } else if (this.currentStone == 1) {
                stone = this.stoneList[0].tokenidArr[0]
            } else if (this.currentStone == 2) {
                stone = this.stoneList[1].tokenidArr[0]
            } else if (this.currentStone == 3) {
                stone = this.stoneList[2].tokenidArr[0]
            }

            this.showLoading = true

            let data = {
                name: fncName, // 方法名
                inputs: [{
                    "name": "to",
                    "type": "address"
                },{
                    "name": "tokens",
                    "type": "uint256[]"
                },{
                    "name": "stoken",
                    "type": "uint256"
                },{
                    "name": "stone",
                    "type": "uint256"
                }],
                arguments: [
                    this.address,
                    cardArr,
                    sArr,
                    stone
                ] // 参数
            }

            console.log(cardArr, sArr)

            this.showUpgrade = false
            // 发起合成
            await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                if (res.code == 101) {
                    if (res.hax.logs.length % 2 == 0) {
                        let id1 = res.hax.logs[0].topics[3]
                        let id2 = res.hax.logs[1].topics[3]
                        id1 = this.vuex_web3.eth.abi.decodeParameter('uint256', id1)
                        id2 = this.vuex_web3.eth.abi.decodeParameter('uint256', id2)
                        await this.vuex_myContract.contrart_NowNFT.methods.typeOf(id1).call().then(res => {
                            let type = res
                            if (type == 10) {
                                this.vuex_myContract.contrart_NowNFT.methods.addproperty(id1).call().then(res => {
                                    let data = Number(res) - 1
                                    this.failAttr = this.attrList[data]
                                })
                            } else if (type == 11) {
                                this.vuex_myContract.contrart_NowNFT.methods.stoneColor(id1).call().then(res => {
                                    let data = Number(res) - 1
                                    this.failStone = this.stoneList[data]
                                })
                            }
                        })
                        await this.vuex_myContract.contrart_NowNFT.methods.typeOf(id2).call().then(res => {
                            let type = res
                            if (type == 10) {
                                this.vuex_myContract.contrart_NowNFT.methods.addproperty(id2).call().then(res => {
                                    let data = Number(res) - 1
                                    this.failAttr = this.attrList[data]
                                })
                            } else if (type == 11) {
                                this.vuex_myContract.contrart_NowNFT.methods.stoneColor(id2).call().then(res => {
                                    let data = Number(res) - 1
                                    this.failStone = this.stoneList[data]
                                })
                            }
                        })
                        this.showFail = !this.showFail;
                        this.showLoading = false
                    } else {
                        // 订单收据
                        this.current = this.currentIndex + 1;
                        this.showSuccess = !this.showSuccess;
                        this.showLoading = false
                    }
                    
                }
            }).catch(err => {
                this.showLoading = false
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

        // 切换升级成功后的飞船
        onSpaChange(item,index) {
            this.current = index;
            this.currentImg = item.img;
        },

        // 升级成功
        onSuccess() {
            this.current = 0;
            this.showSuccess = !this.showSuccess;
            this.getNft()
        },

        // 升级失败
        onFail() {
            this.showFail = !this.showFail;
            this.getNft()
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
    }
}
</script>

<style lang="scss" scoped>
    .upgrade_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 152px 56px 34px;
        box-sizing: border-box;
    }

    .stone_card {
        width: 638px;
        height: 348px;
        background: url(../assets/img/wallet_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 50px 0 46px;
        box-sizing: border-box;

        .card_title {
            line-height: 40px;
            font-size: 36px;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 40px;
            text-shadow: 0px 0px 20px rgba(252, 146, 3, 0.52);
            text-align: center;
        }

        .col {
            width: 100%;
            padding-top: 36px;

            .item {
                width: 33.33%;

                .rate {
                    width: 158px;
                    height: 30px;
                    background: url(../assets/img/u_row.png) no-repeat;
                    background-size: 100% 100%;
                    box-sizing: border-box;
                    font-size: 16px;
                    color: #FC9203;
                }

                img {
                    width: 96px;
                    height: 96px;
                }

                span {
                    font-size: 24px;
                    line-height: 40px;
                }
            }
        }
    }

    .spaceship_card {
        width: 638px;
        min-height: 1054px;
        background: url(../assets/img/boost_card.png) no-repeat;
        background-size: 100% 100%;
        padding: 56px 0 22px;
        margin: 34px 0 0;
        box-sizing: border-box;

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
            height: 354px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: inset 0px 0px 20px 0px rgba(252,146,3,0.56);
            border-radius: 6px;
            border: 1px solid #FC9203;
            box-sizing: border-box;
            margin: 38px 0;
            position: relative;


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

    .upgrade_pop {
        width: 662px;
        height: 830px;
        background: url(../assets/img/b_s_p.png) no-repeat;
        background-size: 100% 100%;
        padding: 74px 0 62px;
        box-sizing: border-box;

        
        .boost_title {
            font-size: 48px;
            font-weight: 600;
            line-height: 40px;
            color: #FC9203;
        }

        .col {
            width: 460px;
            padding-top: 58px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .item {
                width: 190px;
                height: 188px;
                border-radius: 16px;
                border: 2px solid #492B04;
                margin: 0 0 36px;
                position: relative;

                .icon {
                    width: 34px;
                    height: 28px;
                    position: absolute;
                    top: -2px;
                    right: -2px;
                }

                &.active {
                    border: 2px solid #FC9203;
                }

                img {
                    width: 96px;
                    height: 96px;
                }

                span {
                    width: 160px;
                    height: 30px;
                    background: url(../assets/img/b_s_r.png) no-repeat;
                    background-size: 100% 100%;
                    font-size: 16px;
                    color: #FC9203;
                    line-height: 22px;
                }
            }
        }

       .text_row {
           font-size: 24px;
           color: #FC9203;
           line-height: 40px;
           padding: 0 0 22px;
       }
    }

    .choose_pop {
        width: 662px;
        // height: 830px;
        background: url(../assets/img/b_s_p.png) no-repeat;
        background-size: 100% 100%;
        padding: 74px 62px;
        box-sizing: border-box;
        .item_text {
            margin-bottom: 50px;
        }
        .col {
            width: 460px;
            padding-top: 58px;
            margin: auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .item {
                width: 190px;
                height: 88px;
                border-radius: 16px;
                border: 2px solid #492B04;
                margin: 0 0 36px;
                position: relative;

                .icon {
                    width: 34px;
                    height: 28px;
                    position: absolute;
                    top: -2px;
                    right: -2px;
                }

                &.active {
                    border: 2px solid #FC9203;
                }

                img {
                    width: 96px;
                    height: 96px;
                }

                span {
                    width: 160px;
                    height: 30px;
                    background: url(../assets/img/b_s_r.png) no-repeat;
                    background-size: 100% 100%;
                    font-size: 16px;
                    color: #FC9203;
                    line-height: 22px;
                }
            }
        }
        .row {
            width: 394px;
            height: 50px;
            background: url(../assets/img/u_row.png) no-repeat;
            background-size: 100% 100%;
            box-sizing: border-box;
            font-size: 28px;
            color: #FC9203;
            margin: 10px auto;
        }
    }

    .confirm_btn {
        width: 508px;
        min-height: 100px;
        background: url(../assets/img/hecheng_btn_a.png) no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        font-weight: 600;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .synthetic_pop {
        width: 638px;
        overflow: hidden;

        .synthetic_title {
            font-size: 48px;
            font-weight: 600;
            color: #FC9203;
            text-align: center;
        }

        .spaceship {
            width: 460px;
            margin-top: 20px;
            // height: 524px;
        }

        .tabbar {
            width: 100%;
            margin: 58px 0;

            .tab_item {
                width: 96px;
                height: 96px;
                background: rgba(0,0,0,.9);
                border-radius: 10px;
                border: 2px solid rgba(252, 146, 3, 0.3);

                &.active {
                    border: 2px solid #FC9203;
                }

                &:nth-child(2) {
                    margin: 0 42px;
                }

                img {
                    width: 96px;
                    height: 96px;
                }
            }
        }

        .col_box {
            width: 538px;
            margin: 136px 0 90px;

            .col_item {
                width: 50%;

                img {
                    width: 132px;
                    height: 132px;
                }

                span {
                    font-size: 24px;
                    line-height: 40px;
                }
            }
        }
    }
</style>