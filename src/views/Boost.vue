<template>
    <div class="boost_wrap">
        <div class="attr_card">
            <!-- 属性卡 -->
            <div class="card_title">{{i18n.Boost.AttributeCard}}</div>
            <div class="col f-j-a-c">
                <div class="item f-d-c f-j-a-c" v-for="(item,index) in attrList" :key="index">
                    <img :src="item.img" alt="">
                    <span>{{item.rate}}% {{i18n.Boost.AttributeCard}}</span>
                    <span>x{{item.quantity}}</span>
                </div>
            </div>
        </div>

        <div class="spaceship_card f-d-c f-j-a-c">
            <!-- N S SS SS SSS SSSS级飞船 -->
            <div class="top_box f-a-c f-j-sb">
                <img src="../assets/img/prev.png" alt="" @click="handlePrev">
                <span>{{i18n.Spaceship[currentSpa.key]}}</span>
                <img src="../assets/img/next.png" alt="" @click="handleNext">
            </div>

            <img class="spaceship" :src="currentSpa.img" alt="">

            <div class="row_box f-a-c f-j-sb">
                <!-- 数量 -->
                <span>{{i18n.Boost.Quantity}}: {{currentSpa.quantity}}</span>
                <!-- 基础属性值 -->
                <span>{{i18n.Boost.BasePropertyValue}}: {{currentSpa.base}}</span>
            </div>

            <div class="attr_box">
                <div class="attr_item f-d-c f-a-c" v-for="(item,index) in currentSpa.attrList" :key="index" @click="openBoostPopup(item)">
                    <span>#{{item.tokenid}}</span>
                    <!-- 属性值 -->
                    <span>{{i18n.Boost.AttributeValue}}</span>
                    <span>{{item.attr}}</span>
                    <span>{{i18n.Boost.Boost}}</span>
                </div>
            </div>
        </div>

        <van-popup v-model="showBoost" position="center">
            <div class="boost_pop f-d-c f-a-c">
                <div class="boost_title">{{i18n.Boost.SelectAttributeCard}}</div>
                <div class="attr_box">
                    <div class="col f-a-c">
                        <div :class="['item','f-d-c', 'f-j-a-c',currentAttr==index?'active':'']"  v-for="(item,index) in attrList" :key="index" @click="onChange(item,index)">
                            <img class="icon" src="../assets/img/b_s.png" alt="" v-if="currentAttr==index">
                            <span class="f-j-a-c">{{item.rate}}%</span>
                            <img :src="item.img" alt="">
                        </div>
                    </div>
                </div>
                <div class="inp_flex f-a-c f-j-sb">
                    <span>{{i18n.Boost.Quantity}}</span>
                    <input type="number" v-model="quantity" placeholder="0">
                </div>
                <!-- 可用数量 -->
                <div class="right_row">{{i18n.Boost.QuantityAvailable}}: {{ attrNums }}</div>
                <div class="tips">{{i18n.Boost.Tips}}</div>
                <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.Boost.Boost}}</div>
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
            // 属性
            attrList: [
                { img: require('../assets/img/rate_1.png'), rate: 1 , quantity: 0, tokenidArr: []},
                { img: require('../assets/img/rate_2.png'), rate: 2 , quantity: 0, tokenidArr: []}
            ],
            // 当前属性
            currentAttr: 0,
            // 飞船 id及属性值未知，attrList: 属性值数组长度先以数字代替，quality：数量，base：基础属性值
            spaceship: [
                { key: 'NClass', img: require('../assets/img/n.png'), attrList: [], quantity: 0, base: 85 },
                { key: 'SClass', img: require('../assets/img/s.png'), attrList: [], quantity: 0, base: 88 },
                { key: 'SSClass', img: require('../assets/img/ss.png'), attrList: [], quantity: 0, base: 96 },
                { key: 'SSSClass', img: require('../assets/img/sss.png'), attrList: [], quantity: 0, base: 130 },
                { key: 'SSSSClass', img: require('../assets/img/ssss.png'), attrList: [], quantity: 0, base: 243 }
            ],
            // 当前飞船
            currentIndex: 0,
            currentSpa: {},
            showBoost: false,
            // 弹窗输入框数量
            quantity: '1',
            showLoading: false, // 加载中
            attrNums: 0, // 可用数量
            openItem: {}, // 升级的对象
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
        setTimeout(() => {
            if (this.vuex_myContract != {}) {
                this.getNft()
            }
        }, 0)
        this.currentSpa = this.spaceship[0];
    },
    methods: {
        // 获取卡牌
        async getNft() {
            // 初始化
            this.attrList[0].quantity = 0
            this.attrList[1].quantity = 0
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
                    type: 0,
                    attr: 0
                }
                await this.vuex_myContract.contrart_NowNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
                    obj.tokenid = res
                    await this.vuex_myContract.contrart_NowNFT.methods.typeOf(res).call().then(res => {
                        obj.type = res
                        
                    })
                    await this.vuex_myContract.contrart_NowNFT.methods.propertyOf(res).call().then(res => {
                        obj.attr = _tools.formatDecimal(res / Math.pow(10, 6), 2)
                        if (obj.type == 5 || obj.type == 6 || obj.type == 7 || obj.type == 8 || obj.type == 9 || obj.type == 10) {
                            nftArr.push(obj)
                        }
                    })
                })
                
            }))

            nftArr.map(v => {
                if (v.type == 5) {
                    this.spaceship[0].quantity += 1
                    this.spaceship[0].attrList.push(v)
                } else if (v.type == 6) {
                    this.spaceship[1].quantity += 1
                    this.spaceship[1].attrList.push(v)
                } else if (v.type == 7) {
                    this.spaceship[2].quantity += 1
                    this.spaceship[2].attrList.push(v)
                } else if (v.type == 8) {
                    this.spaceship[3].quantity += 1
                    this.spaceship[3].attrList.push(v)
                } else if (v.type == 9) {
                    this.spaceship[4].quantity += 1
                    this.spaceship[4].attrList.push(v)
                } else if (v.type == 10) {
                    this.vuex_myContract.contrart_NowNFT.methods.addproperty(v.tokenid).call().then(res => {
                        if (res == 1) {
                            this.attrList[0].quantity += 1
                            this.attrList[0].tokenidArr.push(v.tokenid)
                        } else if (res == 2) {
                            this.attrList[1].quantity += 1
                            this.attrList[1].tokenidArr.push(v.tokenid)
                        }
                    })
                }
            })

            console.log(nftArr)

            this.showLoading = false

        },

        openBoostPopup(item) {
            this.onChange({}, 0)
            this.showBoost = !this.showBoost;
            this.openItem = item
        },

        // prev
        handlePrev() {
            if (this.currentIndex==0) this.currentIndex = 4;
            else this.currentIndex --;

            this.currentSpa = this.spaceship[this.currentIndex];
        },

        // next
        handleNext() {
            if (this.currentIndex==4) this.currentIndex = 0;
            else this.currentIndex ++;

            this.currentSpa = this.spaceship[this.currentIndex];
        },

        // 选择属性
        onChange(item,index) {
            this.currentAttr = index;
            if (this.currentAttr == 0) {
                this.attrNums = this.attrList[0].quantity
            } else if (this.currentAttr == 1) {
                this.attrNums = this.attrList[1].quantity
            }
        },

        // 提升
        async onConfirm() {
            if (this.attrNums == 0) {
                Toast({ message: this.i18n.Toast.nullAttr, icon: 'fail' })
                return
            }
            
            if (this.quantity > this.attrNums) return Toast({ message: this.i18n.Toast.numsNone, icon: 'fail' })
             
             
            this.vuex_myContract.contrart_NowNFT.methods.propertyPercentAdd(this.openItem.tokenid).call().then(res => {
                console.log(res)
                if (res >= 10) {
                    Toast({ message: this.i18n.Toast.NoUpgrade, icon: 'fail' })
                    return
                }
            })

            // 深拷贝
            let arrtToken = Object.assign([], this.attrList)
            let attrCard = []
            if (this.currentAttr == 0) {
                attrCard = arrtToken[0].tokenidArr.slice(0, this.quantity)
            } else if (this.currentAttr == 1) {
                attrCard = arrtToken[1].tokenidArr.slice(0, this.quantity)
            }

            this.showLoading = true

            let data = {
                name: 'usePropertyCard', // 方法名
                inputs:  [{
                    "name": "shipCard",
                    "type": "uint256"
                },{
                    "name": "propertyCard",
                    "type": "uint256[]"
                }],
                arguments: [
                    this.openItem.tokenid,
                    attrCard
                ] // 参数
            }

            console.log(attrCard)

            // 发起使用
            await contractMethods(this.address, Eth.contract.contrart_NowNFT.addr, data).then(async res => {
                if (res.code == 101) {
                    Toast({ message: this.i18n.Toast.UseSuccess, icon: 'fail' });
                    this.getNft()
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
    .boost_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 152px 56px 34px;
        box-sizing: border-box;
    }

    .attr_card {
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
            padding-top: 46px;

            .item {
                width: 50%;

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
        height: 1054px;
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

        .row_box {
            width: 558px;
            background: url(../assets/img/boost_row.png) no-repeat;
            background-size: 100% 100%;
            padding: 12px 34px;
            margin: 20px 0 42px;
            box-sizing: border-box;
            
            span {
                font-size: 24px;
            }
        }

        .attr_box {
            width: 558px;
            height: 420px;
            overflow: scroll;
            display: flex;
            flex-wrap: wrap;

            .attr_item {
                width: 30%;
                height: 190px;
                background: url(../assets/img/boost_box.png) no-repeat;
                background-size: 100% 100%;
                margin: 0 9px 24px;

                span {
                    font-size: 20px;
                    color: #6E4D25;
                    line-height: 28px;

                    &:nth-child(1) {
                        font-size: 24px;
                        color: #FC9203;
                        line-height: 36px;
                        padding-bottom: 10px;
                    }

                    &:nth-child(3) {
                        font-size: 34px;
                        color: #FC9203;
                        line-height: 40px;
                        padding: 10px 0 22px;
                    }

                    &:nth-child(4) {
                        font-size: 24px;
                        color: #FC9203;
                        line-height: 40px;
                    }
                }
            }
        }
    }

    .boost_pop {
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
            width: 100%;
            padding-top: 58px;

            .item {
                width: 190px;
                height: 188px;
                border-radius: 16px;
                border: 2px solid #492B04;
                margin: 0 40px;
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

        .inp_flex {
            width: 456px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: inset 0px 0px 20px 0px rgba(252,146,3,0.56);
            border-radius: 6px;
            border: 1px solid #FC9203;
            padding: 28px 34px;
            margin: 80px 0 20px;
            box-sizing: border-box;

            span {
                font-size: 32px;
            }

            input {
                width: 200px;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                font-size: 28px;
                text-align: end;
                border: none;
                outline: none;
                color: #FC9203;

                ::-webkit-textarea-placeholder {
                    color: rgba(252, 146, 3, 0.35);
                    font-size: 28px;
                }
            }
        }

        .right_row {
            width: 456px;
            font-size: 24px;
            line-height: 40px;
            color: #FC9203;
            text-align: end;
        }

        .tips {
            font-size: 24px;
            line-height: 40px;
            color: #FC9203;
            padding: 14px 0 20px;
        }

        .confirm_btn {
            width: 508px;
            height: 100px;
            background: url(../assets/img/hecheng_btn_a.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;
            box-sizing: border-box;
        }
    }
</style>