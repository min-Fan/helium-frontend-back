<template>
    <div class="NFT_wrap">
        <div class="card_box f-d-c f-j-a-c">
            <div class="card_nums">
                <div class="nums_left">
                    <span>{{i18n.NFT.Nums}}：</span>
                    <span class="nums">{{ blindNum }} {{ i18n.NFT.Per }}</span>
                </div>
                <div class="nums_right">
                    <div class="nums_btn f-j-a-c" @click="isOpenShow">{{i18n.NFT.Open}}</div>
                </div>
            </div>

            <van-popup v-model="openShow" position="center" @close="openClose">
                <div class="open_pop">
                    <div class="numsbox">
                        <img class="jian" src="../assets/img/nums_jian.png" alt="" @click="numsJian">
                        <van-field v-model="openNum" type="digit" class="nums_inp" @blur="openNumChange" />
                        <img class="jia" src="../assets/img/nums_jia.png" alt="" @click="numsJia">
                    </div>
                    <span>{{ i18n.NFT.YesNums }}：{{ blindNum }}</span>
                    <div class="btn_box f-j-a-c" @click="Open">{{i18n.NFT.Open}}</div>
                </div>
            </van-popup>

            <div class="card_title">{{i18n.NFT.NFTCards}}</div>

            <div class="card_list">
                <div class="card_item f-d-c f-j-sb-a-c" v-for="(item,index) in cardList" :key="index" @click="toCardList(item.id)">
                    <img :src="item.amount>0?item.active:item.inactive" alt="" class="card_img">
                    <div class="amount" v-if="item.amount>0">x{{item.amount}}</div>
                </div>
            </div>

            <div v-if="active" class="confirm_btn_d f-j-a-c">{{i18n.NFT.Synthetic}}</div>
            <div v-else class="confirm_btn_a f-j-a-c" @click="onOpen">{{i18n.NFT.Synthetic}}</div>

            <van-popup v-model="showSynthetic" position="center">
                <div class="synthetic_pop f-d-c f-j-a-c">
                    <div class="synthetic_title">{{i18n.NFT.SuccessText}}</div>
                    <img :src="currentImg" alt="" class="spaceship">
                    <div class="tabbar f-a-c">
                        <div :class="['tab_item', 'f-j-sa-a-c', current==index?'active':'']" v-for="(item,index) in spaceship" :key="index" @click="onChange(item,index)">
                            <img :src="item.img" alt="">
                        </div>
                    </div>
                    <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.BlindBox.Confirm}}</div>
                </div>
            </van-popup>
            <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
                <div class="wrapper">
                    <van-loading type="spinner" color="#FD9025" />
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
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
        inject: ["reload"],
        data() {
            return {
                cardList: [
                    { id: 1, key: 'MBA', amount: 0, active: require('../assets/img/mask_1_a.png'), inactive: require('../assets/img/mask_1_d.png') },
                    { id: 2, key: 'MBB', amount: 0, active: require('../assets/img/mask_2_a.png'), inactive: require('../assets/img/mask_2_d.png') },
                    { id: 3, key: 'MBC', amount: 0, active: require('../assets/img/mask_3_a.png'), inactive: require('../assets/img/mask_3_d.png') },
                    { id: 4, key: 'MBD', amount: 0, active: require('../assets/img/mask_4_a.png'), inactive: require('../assets/img/mask_4_d.png') },
                ],
                showSynthetic: false,
                current: 0,
                currentImg: require('../assets/img/n.png'),
                spaceship: [
                    { img: require('../assets/img/n.png') },
                    // { img: require('../assets/img/spaceship_2.png') },
                    // { img: require('../assets/img/spaceship_3.png') }
                ], 
                showLoading: false, // 加载中
                nft: [], // nft 列表
                openShow: false, // 开启弹窗
                blindNum: 0, // 可开启数量
                openNum: 1, // 开启
            }
        },
        computed: {
            ...mapState(['address', 'ethNetWork', 'isLink']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),

            i18n() {
                return this.$t('message');
            },
            active() {
                let total = 0;
                this.cardList.map(item => {
                    if (!item.amount) total ++;
                })
                if (!total) return false;
                else return true;
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
            setTimeout(() => {
                if (this.vuex_myContract != {}) {
                    this.getNft()
                    this.getNftLeft()
                }
            }, 0)
        },
        methods: {
            // 获取可开启盲盒数量
            getNftLeft() {
                this.vuex_myContract.contrart_Helium.methods.WaitForOpenAmount(this.address).call().then(res => {
                    console.log(res)
                    this.blindNum = res
                })
            },
            // 判断是否有盲盒
            isOpenShow() {
                if (this.blindNum == 0) {
                    Toast({ message: this.i18n.NFT.OpenShow, icon: 'fail' });
                } else {
                    this.openShow = true
                }
            },
            // 开启
            async Open() {
                this.showLoading = true
                // 开启盲盒   
                let data = {
                    name: 'ClaimNft', // 方法名
                    inputs: [{
                        "name": "amount",
                        "type": "uint256"
                    }],
                    arguments: [
                        this.openNum,
                    ] // 参数
                }
                // 发起开启
                await contractMethods(this.address, Eth.contract.contrart_Helium.addr, data).then(async res => {
                    if (res.code == 101) {
                        if (this.openNum == 1) {
                            let id = 0
                            // 订单收据
                            let haxToken = res.hax.logs[0].topics[3]
                            let tokenid = this.vuex_web3.eth.abi.decodeParameter('uint256', haxToken)
                            await this.vuex_myContract.contrart_NowNFT.methods.typeOf(tokenid).call().then(res => {
                                console.log('类型 ==>', res)
                                id = res
                            })
                            this.showLoading = false
                            this.$router.push({
                                path: '/Success',
                                query: {id}
                            })
                        } else {
                            Toast({ message: this.i18n.NFT.OpenSuccess, icon: 'success' });
                            this.showLoading = false
                        }
                        this.getNftLeft()
                        this.reload()
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
            },
            // 减
            numsJian() {
                if (this.openNum > 1) {
                    this.openNum = Number(this.openNum) - 1
                }
            },
            // 加
            numsJia() {
                if (this.openNum < this.blindNum) {
                    this.openNum = Number(this.openNum) + 1
                }
            },
            // 输入开启个数
            openNumChange() {
                // console.log("value ==>", this.openNum)
                if (this.openNum >= this.blindNum) {
                    this.openNum = this.blindNum
                } else if (this.openNum <= 1) {
                    this.openNum = 1
                }
            },
            // 关闭输入个数弹窗
            openClose() {
                this.openNum = 1
            },
            // 获取nft卡牌数据
            async getNft() {
                this.cardList[0].amount = 0
                this.cardList[1].amount = 0
                this.cardList[2].amount = 0
                this.cardList[3].amount = 0
                this.showLoading = true
                // 卡牌数量
                let numbers = []
                await this.vuex_myContract.contrart_NowNFT.methods.balanceOf(this.address).call().then(res => {
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

                this.nft = nftArr
                // console.log(this.nft)
                
                nftArr.map(v => {
                    if (v.type == 1) {
                        this.cardList[0].amount += 1
                    } else if (v.type == 2) {
                        this.cardList[1].amount += 1
                    } else if (v.type == 3) {
                        this.cardList[2].amount += 1
                    } else if (v.type == 4) {
                        this.cardList[3].amount += 1
                    }
                })

                this.showLoading = false
            },

            // 跳转列表
            toCardList(index) {
                // 传递数据
                let arr = []
                this.nft.map(v => {
                    if (v.type == index) {
                        arr.push(v)
                    }
                })
                
                // 判断是否无该卡牌
                let isPush = false
                for (let i = 0; i < this.cardList.length; i++) {
                    if (this.cardList[i].id == index && this.cardList[i].amount == 0) {
                        isPush = false
                        break
                    } else {
                        isPush = true
                    }
                    
                }

                if (isPush) {
                    this.$router.push({path: `CardList/${index}`, query: {items: arr}})
                } else {
                    Toast({ message: this.i18n.Toast.nullNFT, icon: 'fail' })
                }
 
            },

            // 合成飞船
            async onOpen() {
                if (!this.isLink) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });
                
                this.showLoading = true
                // 检测loading
                this.hiddenLoading()
                // 归类数组
                let arr = {}
                this.nft.map(v => {
                    if (arr[`type${v.type}`]) {
                        arr[`type${v.type}`].push(v)
                    } else {
                        arr[`type${v.type}`] = [v]
                    }
                })

                // 发起
                let params = {
                    name: 'synthesis', // 方法名
                    inputs:  [{
                        "name": "to",
                        "type": "address"
                    },{
                        "name": "token1",
                        "type": "uint256"
                    },{
                        "name": "token2",
                        "type": "uint256"
                    },{
                        "name": "token3",
                        "type": "uint256"
                    },{
                        "name": "token4",
                        "type": "uint256"
                    }],
                    arguments: [ this.address, arr['type1'][0].tokenid, arr['type2'][0].tokenid, arr['type3'][0].tokenid, arr['type4'][0].tokenid ] // 参数
                }
                
                await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, params).then(async res => {
                    if (res.code == 101) {
                        this.showLoading = false
                        // 打开合成结果
                        this.showSynthetic = true;
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

            },

            // 检测 loading 加载
            hiddenLoading() {
                // 检测 延迟 31s loading 加载是否还在加载
                setTimeout(() => {
                    if (this.showLoading) {
                        this.showLoading = false
                    }
                }, 31000);
            },

            onConfirm() {
                setTimeout(() => {
                    this.getNft()
                    this.showSynthetic = false;
                }, 500);
            },

            onChange(item,index) {
                this.current = index;
                this.currentImg = item.img;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .NFT_wrap /deep/ .van-overlay {
        background-color: rgba(0,0,0,.8) !important;
    }

    .open_pop {
        width: 662px;
        height: 394px;
        background: url(../assets/img/nums_bag.png) no-repeat;
        background-size: 100% 100%;
        padding: 65px 63px 34px 63px;
        box-sizing: border-box;
        position: relative;
        .numsbox {
            padding: 0 140px;
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            .jian {
                width: 26px;
                margin-right: 44px;
            }
            .jia {
                width: 26px;
                margin-left: 44px;
            }
            .nums_inp {
                width: 140px;
                height: 80px;
                background: url(../assets/img/nums_bag.png) no-repeat center;
                background-size: 100% 100%;
                line-height: 80px;
                font-size: 36px;
                /deep/ .van-field__control {
                    color: #F18B03;
                    font-weight: bolder;
                    text-align: center;
                }
                &::after {
                    display: none;
                    border-bottom: none;
                }
            }
        }
        >span {
            color: #F18B03;
            font-size: 24px;
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-bottom: 11px;
        }
        .btn_box {
            width: 536px;
            height: 136px;
            background: url(../assets/img/withdraw_btn.png) no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
            box-sizing: border-box;
            font-size: 36px;
            font-weight: 600;
            font-family: AlibabaPuHuiTiH;
        }
    }

    .NFT_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 144px 44px 20px;
        box-sizing: border-box;

        .card_box {
            width: 100%;
            min-height: 1122px;
            background: url(../assets/img/publicity_card.png) no-repeat;
            background-size: 100% 100%;
            padding: 50px 43px;
            box-sizing: border-box;
            
            .card_nums {
                width: 100%;
                margin-bottom: 40px;
                .nums_left {
                    line-height: 70px;
                    float: left;
                    display: flex;
                    align-items: center;
                    font-family: AlibabaPuHuiTiH;
                    span {
                        font-size: 28px;
                        font-weight: bolder;
                    }
                    .nums {
                        font-size: 36px;
                        font-weight: bolder;
                        color: #F18B03;
                    }
                }
                .nums_right {
                    float: right;
                    .nums_btn {
                        width: 189px;
                        height: 70px;
                        background: url(../assets/img/nums_btn.png) no-repeat;
                        background-size: 100% 100%;
                        margin: 0 auto;
                        box-sizing: border-box;
                        font-size: 36px;
                        font-weight: 600;
                        font-family: AlibabaPuHuiTiH;
                    }
                }
                &::after {
                    content: '';
                    display: block;
                    clear: both;
                }
            }

            .card_title {
                height: 40px;
                font-size: 36px;
                font-weight: 600;
                padding-bottom: 50px;
            }

            .card_list {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                text-decoration: none;
                color: #FFFFFF;

                .card_item {
                    width: 47%;
                    margin-bottom: 36px;

                    .card_img {
                        width: 252px;
                        height: 320px;
                    }

                    .amount {
                        font-size: 28px;
                        padding-top: 10px;
                    }
                }
            }

            .confirm_btn_d {
                width: 508px;
                height: 100px;
                background: url(../assets/img/hecheng_btn_d.png) no-repeat;
                background-size: 100% 100%;
                font-size: 36px;
                font-weight: 600;
                box-sizing: border-box;
            }

            .confirm_btn_a {
                width: 508px;
                height: 100px;
                background: url(../assets/img/hecheng_btn_a.png) no-repeat;
                background-size: 100% 100%;
                font-size: 36px;
                font-weight: 600;
                box-sizing: border-box;
            }
        }
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
            margin-top: 20px;
            width: 100%;
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

        .confirm_btn {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;
            box-sizing: border-box;
        }
    }
</style>