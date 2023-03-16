<template>
    <div :class="hock ? 'container_hock':''" class="container">
        <nav-bar @setClick="openSet" @menuClick="openMenu" @ununitedClick="ununitedClick" @connectedClick="connectedClick" ref="childNav"></nav-bar>

        <van-popup v-model="showMenu" position="right" :style="'height: 100%'">
            <div class="popup_wrapper">
                <div :class="item.key == 'Gamefi' ? 'game_item' : 'col_item'" class="f-j-a-c" v-for="(item,index) in popup" :key="index" @click="jump(item)" v-show="isLpWhite || item.key != 'Dividend'">
                    <div class="item_text">{{i18n.Main[item.key]}}</div>
                    <div class="gamefi_item" v-show="isGamefi">
                        <div class="gamefi" v-for="(val, idx) in item.child" :key="idx" @click="jump(val)">
                            <div>{{i18n.Main[val.key]}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="language_box f-j-sb-a-c" @click="switchLanguage">
                <span>{{$store.state.language=='en-US'?'简体中文':'English'}}</span>
                <img src="../assets/img/transition.png" alt="">
            </div>
        </van-popup>
        <van-popup v-model="showSet" position="bottom">
            <div class="popup_set">
                <div class="set_title">
                    <span>{{i18n.Main.Set}}</span>
                </div>
                <div class="set_items">
                    <div class="set_item clearfix">
                        <span class="fl">{{i18n.Main.LangChange}}</span>
                        <div class="fr radio_change clearfix">
                            <span :class="$store.state.language=='zh-CN' ? 'activeLan' : ''" class="fl" @click="switchLanguage('CN')">中文</span>
                            <span :class="$store.state.language=='en-US' ? 'activeLan' : ''" class="fl" @click="switchLanguage('US')">EN</span>
                        </div>
                    </div>
                    <div class="set_item clearfix">
                        <span class="fl">{{i18n.Main.Mode}}</span>
                        <div class="fr">
                            <van-switch v-model="modeChecked" active-color="#13C087" size="24px" @change="modeChange"/>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup v-model="showWallet" position="center" round>
            <div class="wallet_box">
                <div class="title">{{i18n.Main.Connect}}</div>
                <div class="wallet">
                    <div class="wallet_item" v-for="(item,index) in wallet" :key="index" @click="linkMoney(item.name)">
                        <img :src="item.icon" alt="">
                        <div>{{item.name}}</div>
                    </div>
                </div>
                <div class="cha_box" @click="showWallet = false">
                    <img v-if="!hock" src="../assets/v2img/cha_icon.png" alt="">
                    <img v-if="hock" src="../assets/v2img/cha_icon_hock.png" alt="">
                </div>
            </div>
        </van-popup>

        <!-- 需连接钱包 -->
        <!-- <img src="../assets/img/down_arrow.png" alt="" class="down_arrow" v-if="!address" @click="showWallet=!showWallet"> -->
        <div class="app_boxs" v-if="isRouterAlive">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" ref="MapChild"/>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive" ref="MapChild"/>
        </div>
        <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive" ref="MapChild"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" ref="MapChild"></router-view> -->
        <nav-tab></nav-tab>
    </div>
</template>

<script>
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import NavBar from '@/components/NavBar';
import NavTab from '@/components/NavTab';
import { Locale, Toast } from 'vant';
import { _tools } from "@/assets/js/utils"

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
    // 重载组件
    inject: ["reload"],
    data() {
        return {
            isRouterAlive: true,
            activeName: '1',
            accounts: '', // 用户地址
            showMenu: false,
            showWallet: false,
            showSet: false,
            modeChecked: true,
            popup: [
                { key: 'Home', status: true },
                { key: 'EsgExchange', status: true },
                { key: 'Map', status: true },
                { key: 'Dividend', status: false },
                {
                    key: 'Gamefi',
                    status: true,
                    child: [
                        { key: 'BlindBox', status: true },
                        { key: 'Nuclear', status: true },
                        { key: 'MaskBaby', status: true },
                        { key: 'Team', status: true },
                        { key: 'Announcement', status: true },
                        { key: 'Spaceship', status: true },
                    ]
                },
                // { key: 'LuckyNumber', status: true },
                // { key: 'EsgExchange', status: true },
                // { key: 'Invite', status: true }
            ],
            wallet: [
                { name: 'TokenPocket', icon: require('../assets/v2img/tpToken.png') },
                // { name: 'TrustWallet', icon: '../assets/img/TrustWallet.png' },
                // { name: 'WalletConnect', icon: require('../assets/img/WalletConnect.png') },
                { name: 'MetaMask', icon: require('../assets/v2img/metamask.png') },
                // { name: 'BinanceChain', icon: '../assets/img/BinanceChain.png' },
                // { name: 'Coin98', icon: '../assets/img/Coin98.png' },
                // { name: 'Safepal', icon: '../assets/img/Safepal.png' },
                // { name: 'MathWallet', icon: '../assets/img/MathWallet.png' }
            ],
            isLpWhite: false,
            isGamefi: false
        }
    },
    provide() {
        return {
            reloadMain: this.reloadMain, // 重载组件
        }
    },
    components: {
        NavBar,
        NavTab
    },
    computed: {
        ...mapState(['address', 'ethNetWork', 'isLink', 'linType', 'hock']),

        ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),

        i18n() {
            return this.$t('message');
        }
    },

    async created() {
        // 链接到 BSC 网络
        const web3 = await new Web3(this.$web3Url);
        // 获取当前网络 chainId
        if (this.$web3Url == "https://data-seed-prebsc-1-s1.binance.org:8545") {
            // BSC 测试网
            this.$store.commit('setNetWork', this.vuex_network.BSC_Testnet);
        } else if (this.$web3Url == "https://bsc-dataseed1.defibit.io/") {
            // BSC 主网
            this.$store.commit('setNetWork', this.vuex_network.BSC_netWork);
        }

        // 注入 web3 对象
        this.setWeb3(web3)

        // 创建合约
        this.setContract({name: 'contrart_Helium',contract: new web3.eth.Contract(Eth.contract.contrart_Helium.abi, Eth.contract.contrart_Helium.addr)})
        this.setContract({name: 'contract_Config',contract: new web3.eth.Contract(Eth.contract.contract_Config.abi, Eth.contract.contract_Config.addr)})
        this.setContract({name: 'contrart_Tokens',contract: new web3.eth.Contract(Eth.contract.contrart_Tokens.abi, Eth.contract.contrart_Tokens.addr)})
        this.setContract({name: 'contrart_NowTokens',contract: new web3.eth.Contract(Eth.contract.contrart_NowTokens.abi, Eth.contract.contrart_NowTokens.addr)})
        this.setContract({name: 'contrart_NFT',contract: new web3.eth.Contract(Eth.contract.contrart_NFT.abi, Eth.contract.contrart_NFT.addr)})
        this.setContract({name: 'contrart_NowNFT',contract: new web3.eth.Contract(Eth.contract.contrart_NowNFT.abi, Eth.contract.contrart_NowNFT.addr)})
        this.setContract({name: 'contrart_MapNFT',contract: new web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, Eth.contract.contrart_MapNFT.addr)})
        this.setContract({name: 'contrart_AtaNFT2',contract: new web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, Eth.contract.contrart_AtaNFT2.addr)})
        this.setContract({name: 'contrart_SpaceId',contract: new web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, Eth.contract.contrart_SpaceId.addr)})
        this.setContract({name: 'contrart_BuyStaker',contract: new web3.eth.Contract(Eth.contract.contrart_BuyStaker.abi, Eth.contract.contrart_BuyStaker.addr)})
        this.setContract({name: 'contrart_NewBuyStaker',contract: new web3.eth.Contract(Eth.contract.contrart_NewBuyStaker.abi, Eth.contract.contrart_NewBuyStaker.addr)})
        this.setContract({name: 'contrart_BnbUsdt',contract: new web3.eth.Contract(Eth.contract.contrart_BnbUsdt.abi, Eth.contract.contrart_BnbUsdt.addr)})
        this.setContract({name: 'contrart_BnbEsg',contract: new web3.eth.Contract(Eth.contract.contrart_BnbEsg.abi, Eth.contract.contrart_BnbEsg.addr)})
        this.setContract({name: 'contrart_USDT',contract: new web3.eth.Contract(Eth.contract.contrart_USDT.abi, Eth.contract.contrart_USDT.addr)})
        this.setContract({name: 'contrart_ESG',contract: new web3.eth.Contract(Eth.contract.contrart_ESG.abi, Eth.contract.contrart_ESG.addr)})
        this.setContract({name: 'contrart_TpRuter',contract: new web3.eth.Contract(Eth.contract.contrart_TpRuter.abi, Eth.contract.contrart_TpRuter.addr)})
        this.setContract({name: 'contrart_StarChian',contract: new web3.eth.Contract(Eth.contract.contrart_StarChian.abi, Eth.contract.contrart_StarChian.addr)})
        this.setContract({name: 'contrart_MapEsg',contract: new web3.eth.Contract(Eth.contract.contrart_MapEsg.abi, Eth.contract.contrart_MapEsg.addr)})
        this.setContract({name: 'contrart_Key',contract: new web3.eth.Contract(Eth.contract.contrart_Key.abi, Eth.contract.contrart_Key.addr)})
        this.setContract({name: 'contrart_Klp',contract: new web3.eth.Contract(Eth.contract.contrart_Klp.abi, Eth.contract.contrart_Klp.addr)})
        this.setContract({name: 'contrart_AddLp',contract: new web3.eth.Contract(Eth.contract.contrart_AddLp.abi, Eth.contract.contrart_AddLp.addr)})
        this.setContract({name: 'contrart_LpReward',contract: new web3.eth.Contract(Eth.contract.contrart_LpReward.abi, Eth.contract.contrart_LpReward.addr)})
        this.setContract({name: 'contrart_EsgRelease',contract: new web3.eth.Contract(Eth.contract.contrart_EsgRelease.abi, Eth.contract.contrart_EsgRelease.addr)})
        this.setContract({name: 'contrart_AndUandStaker',contract: new web3.eth.Contract(Eth.contract.contrart_AndUandStaker.abi, Eth.contract.contrart_AndUandStaker.addr)})
        this.setContract({name: 'contrart_UlpReward',contract: new web3.eth.Contract(Eth.contract.contrart_UlpReward.abi, Eth.contract.contrart_UlpReward.addr)})
        this.setContract({name: 'contrart_PancakeSwapRouterV2',contract: new web3.eth.Contract(Eth.contract.contrart_PancakeSwapRouterV2.abi, Eth.contract.contrart_PancakeSwapRouterV2.addr)})
        this.setContract({name: 'contract_HashCollision',contract: new web3.eth.Contract(Eth.contract.contract_HashCollision.abi, Eth.contract.contract_HashCollision.addr)})
        this.setContract({name: 'contrart_Hash',contract: new web3.eth.Contract(Eth.contract.contrart_Hash.abi, Eth.contract.contrart_Hash.addr)})

        // 实例化 walletConnect 协议
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
        });

        // 判断是否链接 walletconnect 协议
        if (connector.connected) {
            console.log('已经连接walletconnect钱包')

            // 注入 walletConnect 对象
            this.setMoney(connector)
            // 地址
            this.accounts = connector._accounts[0]
            this.$store.commit('setAddress', this.accounts);
            this.$store.commit('setIsLink', true);
            this.$store.commit('setLinkType', "Network");

            // 订阅连接事件
            connector.on("connect", (error, payload) => {

                if (error) {
                    console.log('connect ==>', error)
                }

                // 获取账号 地址 和 链id
                const { accounts, chainId } = payload.params[0];
                // 判断钱包所在网络 chainId
                if (chainId != this.ethNetWork.chainId) {
                    console.log('错误的网络，断开链接')
                    Toast({ message: this.i18n.Toast.netWorkErr, icon: 'fail' })
                    this.$store.commit('setIsLink', false);
                    // 断开
                    connector.killSession()
                    return
                } else {
                    // 地址
                    this.$store.commit('setAddress', accounts[0]);
                    this.accounts = accounts[0]
                    this.$store.commit('setIsLink', true);
                    this.showWallet = false
                    // 重载组件
                    this.reload()
                }
            });

            // 更新链接
            connector.on("session_update", (error, payload) => {
                if (error) {
                    console.log('session_update ==>', error)
                }

                // const { accounts, chainId } = payload.params[0];
                console.log('更新链接 ==>', payload)
            });

            // 断开链接
            connector.on("disconnect", (error, payload) => {
                if (error) {
                    console.log('disconnect ==>', error)
                }
                console.log('断开链接')
                this.$store.commit('setAddress', null);
                this.$store.commit('setIsLink', false);
                this.$router.push({path: '/Trading'})
            });

        } else {
            console.log('未连接walletconnect钱包')
            // if (localStorage.getItem('address')) {
                this.linkMetaMask()
            // }
            // this.$store.commit('setAddress', null);
            // this.$store.commit('setIsLink', false);
        }

        // 执行合约方法
        // await this.getLpWhite()

    },
    mounted() {
        document.addEventListener('visibilitychange',()=>{
            // console.log('监听页面返回----',document);
            if (!document.hidden) { // 页面隐藏
                this.reloadMain()
            }
        },false)

        if (window.ethereum.isMetaMask) {
            let that = this
            window.ethereum.on("chainChanged", function network(networkIDstring) {
                // 监听网络切换
                console.log(networkIDstring)
                // 修改 vuex 状态
                that.$store.commit('setAddress', null);
                that.$store.commit('setIsLink', false);
                // 不刷新页面重载组件
                if (that.$route.path == "/Trading") {
                    location.reload();
                } else {
                    that.reload();
                }
            });

            // console.log(ethereum.listener("accountsChanged"))
            window.ethereum.on("accountsChanged", function (accounts) {
                // 监听账户变化
                console.log('changeAccounts ==>', accounts)
                if (accounts.length == 0) {
                    that.$store.commit('setAddress', null);
                    that.$store.commit('setIsLink', false);
                    // that.$router.push({path: '/Home'})
                } else {
                    // 修改 vuex 状态
                    that.$store.commit('setAddress', accounts[0]);
                    that.$store.commit('setIsLink', true);
                    // 不刷新页面重载组件
                    // if (that.$route.path == "/Home") {
                    //     location.reload();
                    // } else {
                        that.reload();
                    // }
                }
            });

            window.ethereum.on('disconnect', function(error) {
                console.log('error disconnect')
            });
        }
    },
    methods: {
        ...mapMutations(['setHock']),
        ...web3MapMutations(["setWeb3", 'setContract', 'setMoney', 'setLinkType']),
        modeChange() {
            this.setHock(this.modeChecked)
            if (this.$route.path == '/Staking') {
                this.$refs.MapChild.updLange()
            }
        },
        // 不白屏 刷新组件
        reloadMain() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
        // 连接钱包
        ununitedClick() {
            this.showWallet = !this.showWallet;
        },

        // 退出钱包
        connectedClick() {
            if (this.money.connected) {
                this.money.killSession()
            } else {
                this.$store.commit('setAddress', null);
                this.$store.commit('setIsLink', false);
                localStorage.clear()
            }
            this.setMoney({})
        },

        // MetaMask / WalletConnect 钱包连接
        linkMoney(item) {
            if (item == 'WalletConnect') {
                // 选择连接 WalletConnect 钱包
                console.log(item)
                this.linkConnector()
            } else if (item == 'MetaMask') {
                // 选择连接 MetaMask 钱包
                console.log(item)
                this.linkMetaMask()
            } else if (item == "TokenPocket") {
                // TP 钱包
                this.linkMetaMask()
            }
        },

        async linkMetaMask() {

            // 检测是否安装 metamask
            try {
                window.ethereum.isMetaMask
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("accounts ==>", accounts[0], localStorage.getItem('address'))
                if (window.ethereum.networkVersion != this.ethNetWork.chainId) {
                    console.warn('不在正确的网络!!!')
                    // this.$store.commit('setAddress', null);
                    // this.$store.commit('setIsLink', false);
                    await this.linkNetwork()
                    // return
                } else {
                    // 注入 metamask 对象
                    this.setMoney(window.ethereum)
                    this.$store.commit('setLinkType', "Wallet");
                    // 地址
                    this.accounts = accounts[0]
                    this.$store.commit('setAddress', accounts[0]);
                    this.$store.commit('setIsLink', true);
                    this.showWallet = false
                    this.$refs.childNav.updAccounts()
                }
                // this.reload()
            } catch (error) {
                this.$store.commit('setAddress', null);
                this.$store.commit('setIsLink', false);
                console.log('error1 ==>', error)
                switch (error.code) {
                    case -32002:
                        Toast({ message: this.i18n.Toast.networkRepeat, icon: 'fail' })
                        break;
                    case 4001:
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' })
                        break;
                    default:
                        if (error.message == 'ReferenceError: ethereum is not defined') {
                            Toast({ message: this.i18n.Toast.NoneMetamask, icon: 'fail' })
                        }
                        // console.log('error ==>', error)
                        break;
                }
                if (error.message == "Can't find variable: ethereum") {
                    Toast({ message: this.i18n.Toast.NoneMetamask, icon: 'fail' })
                }
            }
        },

        // 切换至正确的 BSC 网络
        async linkNetwork() {

            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: this.vuex_web3.utils.numberToHex(this.ethNetWork.chainId),
                        chainName: this.ethNetWork.name,
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB', // 2-6 characters long
                            decimals: 18
                        },
                        rpcUrls: [this.$web3Url], // 区块网络地址
                        blockExplorerUrls: [process.env.VUE_APP_BLOCK_URL] // 区块浏览器
                    }
                ]
            }).then((res)=>{
                //添加成功
                location.reload()
            }).catch((err)=>{
                //添加失败
                console.log('neterr ==>', err)
                switch (err) {
                    case -32002:
                        Toast({ message: this.i18n.Toast.networkRepeat, icon: 'fail' })
                        break;
                    case 4001:
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' })
                    break;
                    case "cancel":
                        Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' })
                        break;
                    default:
                        if (err == 'ReferenceError: ethereum is not defined') {
                            Toast({ message: this.i18n.Toast.NoneMetamask, icon: 'fail' })
                        }
                        console.log('error ==>', err)
                        break;
                }
                if (err.message == "Can't find variable: ethereum") {
                    Toast({ message: this.i18n.Toast.NoneMetamask, icon: 'fail' })
                }
            })
        },

        // walletConnect 协议链接  二维码模式
        linkConnector() {
            // 实例化 walletConnect 协议
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal,
            });
            // 注入 walletConnect 对象
            this.setMoney(connector)
            // walletconnect 协议
            // 判断是否链接
            if (!connector.connected) {
                // create new session
                connector.createSession()
            } else {
                console.log('已经连接钱包')
                // 地址
                this.accounts = connector._accounts[0]
                this.$store.commit('setAddress', this.accounts);
                this.$store.commit('setIsLink', true);
                this.showWallet = false
            }

            // 订阅连接事件
            connector.on("connect", (error, payload) => {

                if (error) {
                    console.log('connect ==>', error)
                }

                // 获取账号 地址 和 链id
                const { accounts, chainId } = payload.params[0];
                if (chainId != this.ethNetWork.chainId) {
                    console.log('错误的网络，断开链接')
                    Toast({ message: this.i18n.Toast.netWorkErr, icon: 'fail' })
                    this.$store.commit('setIsLink', false);
                    // 断开
                    connector.killSession()
                    return
                } else {
                    // 地址
                    console.log(accounts[0])
                    this.accounts = accounts[0]
                    this.$store.commit('setAddress', accounts[0]);
                    this.$store.commit('setIsLink', true);
                    this.showWallet = false
                    // 重载组件
                    this.reload()
                }
            });

            // 更新链接
            connector.on("session_update", (error, payload) => {
                if (error) {
                    console.log('session_update ==>', error)
                }

                // Get updated accounts and chainId
                // const { accounts, chainId } = payload.params[0];
                console.log('更新链接 ==>', payload)
            });

            // 断开链接
            connector.on("disconnect", (error, payload) => {
                if (error) {
                    console.log('disconnect ==>', error)
                }
                console.log('断开链接')
                this.$store.commit('setAddress', null);
                this.$store.commit('setIsLink', false);
                // 重载组件
                this.$router.push({path: '/Trading'})
            });

        },


        openMenu() {
            this.showMenu = !this.showMenu;
        },
        openSet() {
            this.showSet = !this.showSet;
        },

        // 获取 LP 白名单
        async getLpWhite() {
            await this.vuex_myContract.contrart_AddLp.methods.IsWhiteList(this.address).call().then(res => {
                console.log('isLpWhite ==>', res)
                this.isLpWhite = res
                // this.$nextTick(() => {
                    this.popup[2].status = res
                // })
            })
        },

        jump(item) {
            if (!this.isLink) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });

            if (item.key == 'Invite') {
                // 复制链接
                // let protocol = window.location.protocol; /* 获取协议 */
                // let host = window.location.host;
                // let url = `${protocol}//${host}`
                // 复制
                _tools.copyValue(this.address)
                Toast.success(this.i18n.Main.CopySuccess)
                return
            } else if (item.key == 'Dividend') {
                if (!this.isLpWhite) {
                    // 不是白名单
                    Toast.fail(this.i18n.Main.NoWhite)
                    return
                }
            } else if (item.key == 'Gamefi') {
                this.isGamefi = !this.isGamefi
                return
            }
            // else if (item.key == 'Map') {
            //     Toast({ message: this.i18n.Toast.ContractUpgrade, icon: 'fail' })
            //     return
            // }
            // else if (item.key == 'EsgExchange') {
            //     Toast({ message: this.i18n.Toast.ContractUpgrade, icon: 'fail' })
            //     return
            // }
            let currentPath = this.$route.path.replace(/\//g,'');
            // console.log(currentPath);
            if (!this.address) {
                Toast({ message: this.i18n.Toast.link, icon: 'fail' })
            } else {
                if (item.key == currentPath) return;
                this.$router.push({path: `/${item.key}`});
            }
            this.isGamefi = false
            this.showMenu = false;

        },

        switchLanguage(lang) {
            let language;

            if (lang == 'CN') {
                this.$store.commit('setLanguage', 'zh-CN');
                language = 'zh-CN';
            } else {
                this.$store.commit('setLanguage', 'en-US');
                language = 'en-US';
            }
            this.$nextTick(() => {
                this.$i18n.locale = language;
            })
            if (this.$route.path == '/Staking') {
                this.$refs.MapChild.updLange()
            }
            this.showSet = false
        },
    }
}
</script>

<style lang="scss" scoped>

    // .container /deep/ .van-popup {
    //     background-color: rgba(0,0,0,0) !important;
    // }

    .container {
        width: 100vw;
        height: 100vh;
    }

    .popup_wrapper {
        width: 462px;
        height: 100%;
        background: rgba(17, 10, 0, 0.8);
        padding: 96px 0 0;
        box-sizing: border-box;

        .col_item {
            width: 462px;
            height: 94px;
            background: url(../assets/img/menu_item.png) no-repeat;
            background-size: 100% 100%;
            box-sizing: border-box;
            margin: 0 0 30px 0;
            font-size: 28px;
            color: #FC9203;

        }
        .game_item {
            display: inline-block;
            width: 462px;
            height: 94px;
            // margin: 0 0 30px 0;
            transition: all .3s ease-in-out;
            .item_text {
                height: 94px;
                line-height: 94px;
                text-align: center;
                background: url(../assets/img/menu_item.png) no-repeat;
                background-size: 100% 100%;
                box-sizing: border-box;
                margin: 0 0 30px 0;
                font-size: 28px;
                color: #FC9203;
            }
            .gamefi_item {
                background: url(../assets/img/menu_item.png) no-repeat center;
                background-size: 100% 110%;
                box-sizing: border-box;
                font-size: 28px;
                color: #FC9203;
                text-align: center;
                .gamefi {
                    height: 80px;
                    line-height: 80px;
                    div {
                        height: 100%;
                    }
                }
            }
        }
    }

    .language_box {
        width: 198px;
        height: 60px;
        background: url(../assets/img/language_box.png) no-repeat;
        background-size: 100% 100%;
        padding: 0 30px;
        box-sizing: border-box;
        font-size: 24px;
        color: #FC9203;
        position: absolute;
        left: 132px;
        bottom: 38px;

        img {
            width: 28px;
            height: 28px;
        }
    }
    .popup_set {
        width: 100%;
        height: 330px;
        background: $back-qs-white;
        padding-top: 48px;
        padding-bottom: 68px;
        border-radius: 32px 32px 0px 0px;
        .set_title {
            text-align: center;
            margin-bottom: 40px;
            span {
                font-size: 32px;
                height: auto;
                font-weight: bold;
            }
        }
        .set_items {
            padding: 0 40px 0 32px;
            .set_item {
                margin-bottom: 44px;
                span {
                    font-size: 32px;
                }
                .radio_change {
                    font-size: 28px;
                    padding: 10px 6px;
                    background-color: $back-white;
                    border-radius: 16px;
                    span {
                        text-align: center;
                        display: inline-block;
                        color: #fff;
                        width: 88px;
                        height: 44px;
                        border-radius: 8px;
                        line-height: 44px;
                        color: #13C087;
                    }
                    .activeLan {
                        background: #13C087;
                        color: #fff;
                        box-shadow: 0px 0px 8px 2px rgba(141,86,255,0.0500);
                    }
                }
                // /deep/ .van-switch {
                //     width: 79px;
                //     height: 48px;
                //     .van-switch__node {
                //         width: 48px;
                //         height: 48px;
                //     }
                // }
            }
        }
    }

    .wallet_box {
        width: 538px;
        height: 406px;
        overflow: hidden;
        // background: url(../assets/img/wallet_pop.png) no-repeat;
        // background-size: 100% 100%;
        box-sizing: border-box;
        background-color: $back-qs-white;
        border-radius: 32px;
        padding: 0 60px;
        position: relative;
        .title {
            padding: 40px 0 20px;
            font-size: 36px;
            color: $text-white;
        }
        .cha_box {
            position: absolute;
            top: 10px;
            right: 30px;
            img {
                height: 40px;
            }
        }

        .wallet {
            width: 100%;

            .wallet_item {
                width: 100%;
                height: 84px;
                margin-bottom: 40px;
                display: flex;
                align-items: center;
                padding-left: 32px;
                border-radius: 16px;
                border: 1px solid #EDEDED;
                box-sizing: border-box;
                &:active {
                    border-color: #13C087;
                }

                img {
                    width: 60px;
                    height: 60px;
                }

                div {
                    font-size: 32px;
                    margin-left: 36px;
                }
            }
        }
    }

    .down_arrow {
        width: 108px;
        height: 108px;
        position: fixed;
        left: 321px;
        bottom: 118px;
    }

    .container_hock {
        .wallet_box {
            background-color: $back-qs-hock;
            .title {
                color: $text-hock;
            }
        }
        .popup_set {
            background: $back-qs-hock;
            color: $text-qs-hock;
        }
    }
</style>
