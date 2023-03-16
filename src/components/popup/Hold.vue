<template>
    <div class="Hold" :class="hock ? 'Hold_hock':''">
        <van-popup v-model="isShowHold" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom v-if="type == 1 || type == 3">
            <div class="hold_box clearfix">
                <div class="hold_title">{{i18n.Components.ChooseHold}}</div>
                <img v-show="!hock" class="close" src="../../assets/v2img/cha_icon.png" alt="" @click="closeClick">
                <img v-show="hock" class="close" src="../../assets/v2img/cha_icon_hock.png" alt="" @click="closeClick">
                <div class="hold_list">
                    <div class="hold_item clearfix" v-for="(item, index) in holdList" :key="index" @click="choose(item)">
                        <div class="esg_icon fl">
                            <img src="../../assets/v2img/esg_icon.png" alt="" v-if="type == 1">
                            <img src="../../assets/v2img/esg_icon.png" alt="" v-if="type == 3">
                            <div class="esg_text" v-if="type == 1 || type == 3">
                                <span v-if="type == 1">ESG</span>
                                <span v-if="type == 3">LP</span>
                                <span v-if="item.is_team">Major Position</span>
                                <span v-else>Position {{item.chain_record_idx + 1}}</span>
                            </div>
                            <!-- <div class="esg_text" v-if="type == 3">
                                <span>LP</span>
                                <span>{{item.name}}</span>
                            </div> -->
                        </div>
                        <div class="esg_nums fr">
                            <span v-if="type == 1">{{Number(item.esg_amount).toFixed(4)}}</span>
                            <span v-if="type == 3">{{Number(item.lp_amount).toFixed(4)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup v-model="isShowHold" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom v-if="type == 2">
            <div class="hold_box clearfix">
                <div class="hold_title">{{i18n.Components.ChooseNft}}</div>
                <img v-show="!hock" class="close" src="../../assets/v2img/cha_icon.png" alt="" @click="closeClick">
                <img v-show="hock" class="close" src="../../assets/v2img/cha_icon_hock.png" alt="" @click="closeClick">
                <van-collapse v-model="activeNames" accordion>
                    <van-collapse-item :name="item.name" v-for="(item, index) in holdList" :key="index" @click.native="nftChange(item.name)">
                        <template #title>
                            <div class="esg_icon fl">
                                <img src="../../assets/v2img/nft_icon.png" alt="">
                                <div class="esg_text">
                                    <span>NFT</span>
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </template>
                        <div class="loading_icon clearfix" v-show="item.data.length == 0">
                            <!-- <span>loadgin...</span> -->
                            <van-loading />
                        </div>
                        <div class="nft_list" v-if="item.data.length != 0 && item.name != 'Mask Baby'">
                            <div class="nft_item clearfix" v-for="(val, idx) in item.data" :key="idx" @click="choose(val)">
                                <span class="fl">{{val.name}}</span>
                                <span class="fr">#{{val.tokenid}}</span>
                            </div>
                        </div>
                        <div class="nft_list" v-if="item.data.length != 0 && item.name == 'Mask Baby'">
                            <div class="nft_item clearfix" v-for="(val, idx) in item.data" :key="idx" @click="choose(val)">
                                <span class="fl" v-if="val.type == 1">Mask Baby A</span>
                                <span class="fl" v-if="val.type == 2">Mask Baby B</span>
                                <span class="fl" v-if="val.type == 3">Mask Baby C</span>
                                <span class="fl" v-if="val.type == 4">Mask Baby D</span>
                                <span class="fl" v-if="val.type == 5">Mask Baby N</span>
                                <span class="fl" v-if="val.type == 6">Mask Baby S</span>
                                <span class="fl" v-if="val.type == 7">Mask Baby SS</span>
                                <span class="fl" v-if="val.type == 8">Mask Baby SSS</span>
                                <span class="fl" v-if="val.type == 9">Mask Baby SSSS</span>
                                <span class="fr">{{val.tokenids.length}}</span>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
        </van-popup>
    </div>
</template>

<script>
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'Hold',
    props: {
        isShowHold: {
            type: Boolean,
            default: false
        },
        type: {
            type: Number,
            default: 1
        },
        holdList: {
            type: Array,
        }
    },
    data() {
        return {
            activeNames: ''
        }
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
        i18n() {
            return this.$t('message');
        },
    },
    created () {

    },
    mounted() {

    },
    methods: {
        nftChange(name) {
            this.$emit('getNftData', name)
        },
        // 关闭
        closeClick() {
            this.$emit('closeHode', false)
        },
        choose(item) {
            this.$emit('chooseItem', item)
            this.$emit('closeHode', false)
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/ .van-popup {
    .hold_box {
        background-color: #fff;
        padding-bottom: 70px;
        position: relative;
        overflow: hidden;

        .hold_title {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-top: 48px;
            margin-bottom: 28px;
        }
        .close {
            height: 36px;
            position: absolute;
            top: 32px;
            right: 32px;
        }
        .van-collapse {
            padding: 0 32px;
        }
        .van-hairline--top-bottom::after, .van-collapse-item--border::after {
            border: none;
        }
        .van-cell__right-icon{
            margin-top: 30px;
        }
        .van-cell {
            padding: 18px 32px 12px 32px;
            border-radius: 14px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        .van-collapse-item__content {
            background-color: #F5F5F5;
            border-radius: 14px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        .van-collapse-item__title--expanded::after {
            display: none;
        }
        .van-collapse-item__content {
            padding: 0;
            padding-left: 98px;
            padding-right: 32px;
            padding-bottom: 18px;
        }
        .van-collapse-item__title--expanded {
            background-color: #F5F5F5;
        }
        .loading_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            .van-loading {
                padding: 30px;
            }
        }
        .nft_list {
            padding-top: 20px;
            border-top: 2px solid #cccccc4d;
            max-height: 300px;
            overflow: auto;
            &::-webkit-scrollbar {
                display: none;
            }
            span {
                font-size: 24px;
            }
            & span:nth-of-type(1) {
                color: #666666;
            }
            & span:nth-of-type(2) {
                color: #13C087;
            }
            .nft_item {
                margin-bottom: 20px;
            }
            & .nft_item:last-child {
                margin: 0;
            }
        }
        .esg_icon {
            display: flex;
            align-items: center;
            img {
                height: 52px;
                margin-right: 14px;
            }
            .esg_text {
                span {
                    display: block;
                }
                & span:nth-child(1) {
                    color: #000;
                    font-size: 28px;
                }
                & span:nth-child(2) {
                    font-size: 24px;
                    color: #666666;
                    white-space: nowrap;
                }
            }
        }
        .hold_list {
            max-height: 800px;
            overflow: auto;
            .hold_item {
                width: 100%;
                padding: 0 30px;
                margin-bottom: 48px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .esg_nums {
                    font-size: 28px;
                    color: #000;
                    margin-left: auto;
                    text-align: right;
                }
            }
            & .hold_item:last-child {
                margin: 0;
            }
        }
    }
}
.Hold_hock {
    /deep/ .van-popup {
        background-color: $back-qs-hock;
        .hold_box {
            background-color: $back-qs-hock;
            .hold_list .hold_item .esg_icon .esg_text span:nth-child(1) {
                color: $text-qs-hock;
            }
            .hold_list .hold_item .esg_icon .esg_text span:nth-child(2) {
                color: $text-qqs-hock;
            }
            .hold_list .hold_item .esg_nums {
                color: $text-qs-hock;
            }
            .esg_icon .esg_text span:nth-child(1) {
                color: $text-hock;
            }
            .van-cell {
                background-color: transparent;
            }
            .van-collapse-item__title--expanded {
                background-color: $back-hock;
            }
            .van-collapse-item__content {
                background-color: $back-hock;
            }
        }
    }

}
</style>
