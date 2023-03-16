<template>
    <div :class="hock ? 'hock_NavTab': ''" class="NavTab">
        <van-tabbar v-model="active" placeholder :before-change="beforeChange">
            <van-tabbar-item v-for="(item, index) in icon" :key="index" @click="jump(item.route)">
                <span>{{i18n.NavTab[item.name]}}</span>
                <template #icon="props">
                    <img :src="props.active ? item.active : item.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
        <template>

        <div class="price_form" v-show="isIndex" @click="showForm">
            <div class="esg">
                <span>ESG</span>
            </div>
            <div class="price">
                <span>${{Number(ratioUsdtEsg).toFixed(2)}}</span>
                <span v-show="!isRange">+{{Number(range).toFixed(4)}}%</span>
                <span v-show="isRange">-{{Number(range).toFixed(4)}}%</span>
                <img v-show="!hock" src="../assets/v2img/shang_icon.png" alt="">
                <img v-show="hock" src="../assets/v2img/shang_icon_hock.png" alt="">
            </div>
        </div>
        </template>
    </div>  
</template>

<script>
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
// 导入以太坊合约配置文件
import { GetEsgPrice } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
mapState: web3MapState,
mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
    name: 'NavTab',
    data() {
        return {
            active: 0,
            icon: [{
                name: 'Trading',
                route: 'Trading',
                active: require('../assets/v2img/tab_1_h.png'),
                inactive: require('../assets/v2img/tab_1.png'),
            },{
                name: 'BPoS',
                route: 'BPoS',
                active: require('../assets/v2img/tab_2_h.png'),
                inactive: require('../assets/v2img/tab_2.png'),
            },{
                name: 'Mobility',
                route: 'LpBPoS',
                active: require('../assets/v2img/tab_3_h.png'),
                inactive: require('../assets/v2img/tab_3.png'),
            },{
                name: 'Staking',
                route: 'Staking',
                active: require('../assets/v2img/tab_4_h.png'),
                inactive: require('../assets/v2img/tab_4.png'),
            }],
            price: [],
            ratioUsdtEsg: 0,
            ratioEsgUsdt: 0,
            isIndex: false,
            isRange: false,
            range: 0,
        }
    },
    watch: {
        $route(to, from) {
            if (to.path == '/Trading') {
                this.isIndex = true
            } else {
                this.isIndex = false
            }
            if (to.path == '/Trading' || to.path == '/NFTexchange' || to.path == '/Mobility') {
                this.active = 0
            } else if (to.path == '/BPoS') {
                this.active = 1
            } else if (to.path == '/LpBPoS') {
                this.active = 2
            } else if (to.path == '/Staking') {
                this.active = 3
            }
        },
        hock() {
            if (this.hock) {
                this.icon[0].inactive = require('../assets/v2img/tab_1_hock.png')
                this.icon[1].inactive = require('../assets/v2img/tab_2_hock.png')
                this.icon[2].inactive = require('../assets/v2img/tab_3_hock.png')
                this.icon[3].inactive = require('../assets/v2img/tab_4_hock.png')
            }
        }
    }, 
    computed: {
        ...mapState(['address', 'isLink', 'hock']),
        i18n() {
            return this.$t('message');
        },
    },
    async created() {
        if (this.hock) {
            this.icon[0].inactive = require('../assets/v2img/tab_1_hock.png')
            this.icon[1].inactive = require('../assets/v2img/tab_2_hock.png')
            this.icon[2].inactive = require('../assets/v2img/tab_3_hock.png')
            this.icon[3].inactive = require('../assets/v2img/tab_4_hock.png')
        }
        if (this.$route.path == '/Trading') {
            this.active = 0
            this.isIndex = true
        } else if (this.$route.path == '/BPoS') {
            this.active = 1
        } else if (this.$route.path == '/LpBPoS') {
            this.active = 2
        } else if (this.$route.path == '/Staking') {
            this.active = 3
        }

        this.getRatio()
    },
    methods: {
        beforeChange() {
            
        },
        // 跳转
        jump(route) {
            // if (route == 'Mobility') {
            //     Toast({ message: this.i18n.Trading.Dev, icon: 'close', className: 'fail' });
            //     return
            // }
            if (route != 'Trading') {
                this.isIndex = false
            } else {
                this.isIndex = true
            }
            this.$router.push({path: route})
        },
        // 获取汇率
        async getRatio() {
            let data = await GetEsgPrice({})
            let price = data.data
            this.price = price
            this.ratioUsdtEsg = price[0]
            this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9)
            if (price[0] > price[1]) {
                // 涨
                this.isRange = false
                this.range = price[0] / price[1] - 1
            } else {
                // 跌
                this.isRange = true
                this.range = 1 - price[0] / price[1]
            }
            this.range *= 100
            console.log(this.range, this.price)
        },
        showForm() {
            console.log('xxxxxxxxxxx')
        }
    }

}
</script>

<style lang="scss" scoped>
.NavTab {
    /deep/ .van-tabbar__placeholder {
        .van-tabbar {
            height: 100px;
            padding-bottom: 70px;
        }
        .van-tabbar-item__icon {
            img {
                height: 52px;
            }
        }
        .van-tabbar-item__text {
            span {
                font-size: 20px;
                color: $nav-tab-ac-white;
            }
        }
        .van-tabbar-item--active {
            .van-tabbar-item__text {
                span {
                    color: $text-gl-white;
                }
            }
        }
        .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
            border: none;
        }
    }
    .price_form {
        width: 100%;
        height: 72px;
        background: $back-white;
        opacity: 1;
        position: fixed;
        bottom: 170px;
        left: 0;
        z-index: 9;
        display: flex;
        align-items: center;
        font-size: 28px;
        padding: 0 32px;
        box-sizing: border-box;
        color: $text-white;
        .price {
            margin-left: auto;
            display: flex;
            align-items: center;
            & span:nth-of-type(2) {
                color: $text-gl-white;
                margin: 0 16px;
            }
            & span:nth-of-type(3) {
                color: #E52E2E;
                margin: 0 16px;
            }
            img {
                width: 30px;
            }
        }
    }
}
.hock_NavTab {
    /deep/ .van-tabbar__placeholder {
        .van-tabbar {
            background-color: $back-hock;
        }
        .van-tabbar-item {
            background-color: $back-hock;
        }
        .van-tabbar-item__text {
            span {
                color: $nav-tab-ac-hock;
            }
        }
        .van-tabbar-item--active {
            .van-tabbar-item__text {
                span {
                    color: $text-gl-hock;
                }
            }
        }
    }
    .price_form { 
        background: $back-hock;
        color: $text-hock;
    }
}
</style>