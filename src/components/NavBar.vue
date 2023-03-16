<template>
    <div :class="hock ? 'hock_nav_bar': ''" class="nav_bar f-j-sb-a-c">
        <div class="logo_box">
            <img v-if="!hock" src="../assets/v2img/min_logo.png" alt="" class="nav_logo">
            <img v-else src="../assets/v2img/min_logo_hock.png" alt="" class="nav_logo">
            <!-- <span class="logo_name">Meta ESG</span> -->
        </div>

        <div class="left_wrapper f-a-c">
            <div class="ununited f-j-a-c" @click.prevent="onUnunitedClick" v-if="!isLink">
                <span>{{i18n.Main.Connect}}</span>
            </div>

            <div class="connected f-j-a-c" @click="onConnectedClick" v-else>
                <span>{{ accounts }}</span>
                <img src="../assets/v2img/out_icon.png" alt="">
            </div>
            
            <!-- <img src="../assets/img/hbg.png" alt="" class="hbg" @click.prevent="onMenuClick"> -->
            <img src="../assets/v2img/setting_icon.png" alt="" class="hbg" @click.prevent="onSetClick">
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    // 导入工具包
    import { _accounts, _date, _tools } from '@/assets/js/utils'
    export default {
        data() {
            return {
                accounts: '', // 地址
            }
        },

        mounted() {
            this.updAccounts()
        },

        computed: {
            ...mapState(['address', 'isLink', 'hock']),
            i18n() {
				return this.$t('message');
			}
        },
        methods: {
            onMenuClick() {
                this.$emit('menuClick');
            },

            // 已连接更新数据
            updAccounts() {
                if (localStorage.getItem('address')) {
                    // 简化地址
                    let easyAccount = _accounts.easyAccount(this, 4, 4, localStorage.getItem('address'))
                    this.accounts = easyAccount
                } else {
                    // 简化地址
                    let easyAccount = _accounts.easyAccount(this, 4)
                    this.accounts = easyAccount
                }
            },

            // 连接钱包
            onUnunitedClick() {
                this.$emit('ununitedClick');
            },

            // 退出钱包
            onConnectedClick() {
                this.$emit('connectedClick');
            },

            // 设置按钮
            onSetClick() {
                this.$emit('setClick');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .nav_bar {
        width: 100%;
        height: 88px;
        padding: 0 30px;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 111;
        box-sizing: border-box;
        background-color: $back-white;
        box-shadow: 0px 12px 20px 2px $nav-bar-rgba-white;
        .logo_box {
            display: flex;
            align-items: center;
            .nav_logo {
                // width: 238px;
                height: 60px;
            }
            .logo_name {
                display: inline-block;
                width: 150px;
                font-size: 28px;
                margin-left: 20px;
            }
        }
        .left_wrapper {

            .ununited {
                width: 148px;
                height: 52px;
                // background: url(../assets/img/nav_m_card.png) no-repeat;
                // background-size: 100% 100%;
                margin: 0 22px 0 0;
                box-sizing: border-box;
                font-size: 28px;
                color: $text-gl-hock;
                border-radius: 16px 16px 16px 16px;
                border: 2px solid $text-gl-hock;
            }
            
            .connected {
                min-width: 202px;
                padding: 0 14px 0 20px;
                height: 52px;
                // background: url(../assets/img/nav_l_card.png) no-repeat;
                // background-size: 100% 100%;
                margin: 0 22px 0 0;
                box-sizing: border-box;
                font-size: 28px;
                color: $text-gl-hock;
                border-radius: 16px 16px 16px 16px;
                border: 2px solid $text-gl-hock;

                img {
                    width: 36px;
                    height: 36px;
                    margin-left: 6px;
                }
            }
        }

        .hbg {
            width: 56px;
            height: 56px;
        }
    }

    .hock_nav_bar {
        background-color: $back-hock;
        box-shadow: 0px 12px 20px 2px $nav-bar-rgba-hock;
    }
</style>