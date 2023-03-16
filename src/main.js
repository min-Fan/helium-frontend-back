import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import './common/theme-hock.scss'
// import './common/theme-white.scss'
Vue.prototype.$store = store
// import VConsole from 'vconsole'
// import { Slider,Dropdown,DropdownMenu,DropdownItem, } from 'element-ui';
// Vue.use(Slider)
// .use(Dropdown)
// .use(DropdownMenu)
// .use(DropdownItem)

// 开发环境引入
// new VConsole()

// 全局挂载 BSC 主 / 测试 网络地址
// Vue.prototype.$web3Url = 'https://bsc-dataseed1.defibit.io/'
Vue.prototype.$web3Url = process.env.VUE_APP_BSC_URL

import { numberToCurrencyNo } from '@/assets/js/numberToCurrency'
// 配置全局过滤器，实现数字千分位格式
Vue.filter('numberToCurrency', numberToCurrencyNo)

// 移动端px转换rem
import 'amfe-flexible'

// 移动端点击延迟事件
import FastClick from 'fastclick'
FastClick.attach(document.body)

// 全局引入按需引入UI库 vant
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant);

// 多语言
import VueI18n from 'vue-i18n'
let Chinese = require('./assets/locales/zh-CN.js')
let English = require('./assets/locales/en-US.js')
let Tradition = require('./assets/locales/zh-HK.js')
Vue.use(VueI18n)
const lan = localStorage.getItem('LANGUAGE')
const i18n = new VueI18n({
  locale: lan ? lan : 'en-US',
  messages: {
    'zh-CN': Chinese,
    'en-US': English,
    'zh-HK': Tradition
  }
})
Number.prototype.fixed = function(len){
  len=isNaN(len)?0:len
  var num=Math.pow(10,len)
  return Math.round(this*num)/num
}
Vue.prototype._i18n = i18n

Vue.config.productionTip = false

// 路由前置守卫
router.beforeEach((to, from, next) => {

	// 404 处理
	if (to.matched.length !== 0) {
	  next()
	} else {
	  next({ path: `/` })
	}
  // 拦截进入其他路由
  // if (to.path != '/Home') {
  //   next({ path: `/Home` })
  // }
  if (from.fullPath == '/') {
    if (to.name == "GetRecord" || to.name == "AllRecord" || to.name == "ShareDetails") {
      if (to.query.parentPage && to.query.parentPage == "HashRecord") {
        next({path: 'HashBump'})
      } else {
        next({path: 'BPoS'})
      }
    } else if (to.name == "LpGetRecord" || to.name == "LpDetails" || to.name == "LpAllRecord") {
      next({path: 'LpBPoS'})
    } else if (to.name == 'ExchangeRecord') {
      next({path: 'Trading'})
    } else if (to.name == 'StakDetails') {
      next({path: 'Staking'})
    } else {
      next()
    }
  }

})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
