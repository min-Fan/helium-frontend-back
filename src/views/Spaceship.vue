<template>
    <div class="spaceship_wrap f-d-c f-a-c">
        <div class="spa_card">
            <div class="spa_title f-a-c f-j-sb">
                <span>{{i18n.Spaceship.HELIUM}}</span><span @click="toIncome">{{i18n.Spaceship.Income}}</span>
            </div>

            <div class="col_box">
                <div class="col_item f-d-c f-a-c" v-for="(item,index) in spaceship" :key="index" @click="toDetail(item)">
                    <img :src="item.img" alt="">
                    <span>{{i18n.Spaceship[item.key]}}</span>
                    <span>x{{item.quantity}}</span>
                </div>
            </div>
        </div>

        <!-- 提升属性 -->
        <div class="confirm_btn f-j-a-c" @click="onBoost">{{i18n.Spaceship.BoostAttribute}}</div>

        <!-- 升级飞船 -->
        <div class="confirm_btn f-j-a-c" @click="onUpgrade">{{i18n.Spaceship.UpgradeSpaceship}}</div>

        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { Toast } from 'vant';
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
                spaceship: [
                    { id: 5, key: 'NClass', img: require('../assets/img/n.png'), quantity: 0 },
                    { id: 6, key: 'SClass', img: require('../assets/img/s.png'), quantity: 0 },
                    { id: 7, key: 'SSClass', img: require('../assets/img/ss.png'), quantity: 0 },
                    { id: 8, key: 'SSSClass', img: require('../assets/img/sss.png'), quantity: 0 },
                    { id: 9, key: 'SSSSClass', img: require('../assets/img/ssss.png'), quantity: 0 }
                ],
                showLoading: false, // 加载中
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
        },

        computed: {
            ...mapState(['address', 'ethNetWork', 'isLink']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
            i18n() {
                return this.$t('message');
            }
        },

        methods: {
            // 获取飞船数量
            async getNft() {
                this.spaceship[0].quantity = 0
                this.spaceship[1].quantity = 0
                this.spaceship[2].quantity = 0
                this.spaceship[3].quantity = 0
                this.spaceship[4].quantity = 0
                this.showLoading = true
                this.hiddenLoading()
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
                            if (obj.type == 5 || obj.type == 6 || obj.type == 7 || obj.type == 8 || obj.type == 9) {
                                nftArr.push(obj)
                            }
                        })
                    })
                }))

                console.log("飞船 nftArr ==>", nftArr)
                nftArr.map(v => {
                    if (v.type == 5) {
                        this.spaceship[0].quantity += 1
                    } else if (v.type == 6) {
                        this.spaceship[1].quantity += 1
                    } else if (v.type == 7) {
                        this.spaceship[2].quantity += 1
                    } else if (v.type == 8) {
                        this.spaceship[3].quantity += 1
                    } else if (v.type == 9) {
                        this.spaceship[4].quantity += 1
                    }
                })
                this.showLoading = false
            },

            toIncome() {
                this.$router.push({path: '/Income'});
            },

            // 携带飞船id到详情，拿对应的飞船展示列表
            toDetail(item) {
                if (item.quantity == 0) {
                    Toast({ message: this.i18n.Toast.nullNFT, icon: 'fail' })
                    return
                }
                this.$router.push({
                    path: '/IncomeDetail',
                    query: {
                        id: item.id
                    }
                })
            },

            onBoost() {
                this.$router.push({path: '/Boost'});
            },

            onUpgrade() {
                this.$router.push({path: '/Upgrade'});
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
    .spaceship_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 158px 56px 30px 56px;
        box-sizing: border-box;
    }

    .spa_card {
        width: 638px;
        // min-height: 1044px;
        height: auto;
        background: url(../assets/img/boost_card.png) no-repeat;
        background-size: 100% 100%;
        padding: 50px 30px 0;
        box-sizing: border-box;

        .spa_title {
            width: 100%;
            padding: 0 0 62px;

            span {
                font-size: 36px;
                line-height: 40px;
                color: #FC9203;
                font-weight: 600;
    
                &:first-child {
                    font-size: 36px;
                    font-weight: 600;
                    line-height: 40px;
                    color: #FFFFFF;
                    text-shadow: 0px 0px 20px rgba(252, 146, 3, 0.52);
                }
            }
        }

        .col_box {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .col_item {
                width: 50%;
                margin: 0 0 20px;

                img {
                    width: 270px;
                    // height: 170px;
                    margin: 0 0 20px;
                }

                span {
                    line-height: 40px;
                    font-size: 24px;
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
        box-sizing: border-box;
        margin: 44px 0 0;
    }
</style>