<template>
    <div class="card_list_wrap">
        <div class="list" v-for="(item,index) in items" :key="index">
            <div class="item f-a-c">
                <img v-if="type == 1" src="../assets/img/mask_1_a.png" alt="" class="left_img">
                <img v-if="type == 2" src="../assets/img/mask_2_a.png" alt="" class="left_img">
                <img v-if="type == 3" src="../assets/img/mask_3_a.png" alt="" class="left_img">
                <img v-if="type == 4" src="../assets/img/mask_4_a.png" alt="" class="left_img">

                <div class="right_text">

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.Owner}}:</div>
                        <div class="row_desc f-a-c">
                            <span>{{ accounts }}</span>
                            <img src="../assets/img/copy.png" alt="" class="copy" @click="copy(address)">
                        </div>
                    </div>

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.AssetProtocol}}:</div>
                        <div class="row_desc f-a-c">
                            <span>ERC721</span>
                        </div>
                    </div>

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.ContractAddress}}:</div>
                        <div class="row_desc f-a-c">
                            <span>{{ easyContractNft }}</span>
                            <img src="../assets/img/copy.png" alt="" class="copy" @click="copy(contractNft)">
                        </div>
                    </div>
                    
                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.AssetPublicChain}}:</div>
                        <div class="row_desc f-a-c">
                            <span>BSC</span>
                        </div>
                    </div>

                    <div class="row f-a-c">
                        <div class="row_title">{{i18n.CardList.Token}}:</div>
                        <div class="row_desc f-a-c">
                            <span># {{ item.tokenid }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                accounts: '', // 简化地址
                contractNft: '', // NFT 合约地址
                easyContractNft: '', // 简化的 NFT 合约地址
                type: 1, // 类型
                items: [], // 列表
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
            // 简化地址
            let easyAccount = _accounts.easyAccount(this, 4)
            this.accounts = easyAccount
            this.contractNft = Eth.contract.contrart_NowNFT.addr
            this.easyContractNft = _accounts.easyAccount(null, 4, 4, this.contractNft)
            // 初始化数据
            this.items = this.$route.query.items
            console.log(this.items)
            this.type = this.$route.params.type
        },
        methods: {
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
    .card_list_wrap {
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
                height: 304px;
                background: url(../assets/img/card_box.png) no-repeat;
                background-size: 100% 100%;
                padding: 42px 44px;
                margin: 0 0 38px;
                box-sizing: border-box;

                .left_img {
                    width: 174px;
                    height: 220px;
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