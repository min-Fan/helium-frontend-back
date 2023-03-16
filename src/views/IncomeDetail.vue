<template>
    <div class="detail_wrap">
        <div class="list" v-for="(item,index) in nft" :key="index">
            <div class="item f-a-c">
                <img src="../assets/img/n.png" alt="" class="left_img" v-if="id == 5">
                <img src="../assets/img/s.png" alt="" class="left_img" v-if="id == 6">
                <img src="../assets/img/ss.png" alt="" class="left_img" v-if="id == 7">
                <img src="../assets/img/sss.png" alt="" class="left_img" v-if="id == 8">
                <img src="../assets/img/ssss.png" alt="" class="left_img" v-if="id == 9">

                <div class="right_text">

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.Owner}}:</div>
                        <div class="row_desc f-a-c">
                            <span>{{ accounts }}</span>
                            <img src="../assets/img/copy.png" alt="" class="copy" @click="copy(address)">
                        </div>
                    </div>

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.Token}}:</div>
                        <div class="row_desc f-a-c">
                            <span># {{item.tokenid}}</span>
                        </div>
                    </div>

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.Income.BasicIncome}}:</div>
                        <div class="row_desc f-a-c">
                            <span>{{item.earnings}} ESG / day</span>
                        </div>
                    </div>
                </div>
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
    import { Toast } from 'vant';
    // 导入以太坊合约配置文件
    import { Eth } from '@eth'
    // 导入工具库
    import { _accounts, _tools } from "@/assets/js/utils"
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
                id: '', // 飞船类型
                accounts: '', // 简化地址
                contractNft: '', // NFT 合约地址
                easyContractNft: '', // 简化的 NFT 合约地址
                showLoading: false, // 加载中
                nft: [], // 列表
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
            // 简化地址
            let easyAccount = _accounts.easyAccount(this, 4)
            this.accounts = easyAccount
            this.contractNft = Eth.contract.contrart_NowNFT.addr
            this.easyContractNft = _accounts.easyAccount(null, 4, 4, this.contractNft)

            this.id = this.$route.query.id

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
            // 获取 飞船 卡牌数据
            async getNft() {
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
                        type: 0,
                        earnings: 0,
                    }
                    if (this.id == 5) {
                        obj.earnings = 28.8
                    } else if (this.id == 6) {
                        obj.earnings = 43.34
                    } else if (this.id == 7) {
                        obj.earnings = 158.54
                    } else if (this.id == 8) {
                        obj.earnings = 648.14
                    } else if (this.id == 9) {
                        obj.earnings = 2275.34
                    }
                    
                    await this.vuex_myContract.contrart_NowNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
                        obj.tokenid = res
                        await this.vuex_myContract.contrart_NowNFT.methods.typeOf(res).call().then(res => {
                            if (res == this.id) {
                                obj.type = res
                                nftArr.push(obj)
                            }
                        })
                    })
                }))
                
                this.nft = nftArr

                console.log("nft ==>", this.nft)

                this.showLoading = false
                
            },

            copy(text) {
                let result = null;
                let textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.readOnly = "readOnly";
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, text.length);
                result = document.execCommand("copy");
                textarea.remove();
                Toast({ message: this.i18n.Main.CopySuccess, icon: 'success' })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .detail_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 144px 56px 0;
        box-sizing: border-box;

        .list {
            .item {
                width: 638px;
                height: 214px;
                background: url(../assets/img/card_box.png) no-repeat;
                background-size: 100% 100%;
                padding: 42px 24px;
                margin: 0 0 38px;
                box-sizing: border-box;

                .left_img {
                    // width: 220px;
                    height: 140px;
                }

                .right_text {
                    font-size: 24px;
                    margin-left: 26px;

                    .row {
                        padding-bottom: 8px;
                    }

                    .row_title {
                        padding-right: 12px;
                    }

                    .copy {
                        width: 18px;
                        height: 20px;
                        margin-left: 16px;
                    }
                }
            }
        }
    }
</style>