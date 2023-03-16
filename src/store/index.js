import Vue from 'vue'
import Vuex from 'vuex'
// 导入 web3 模块
import { web } from './web3/store'

Vue.use(Vuex)

const language = localStorage.getItem('LANGUAGE') || 'en-US'; // 中英文切换
const address = localStorage.getItem('address') || ''; // 钱包地址

export default new Vuex.Store({
  state: {
    language,
    address,
    linType: '', // 链接钱包的方式 Wallet / Network
    ethNetWork: {}, // 网络 id 配置
    isLink: false, // 链接状态
    hock: true, // 暗夜模式
    holdRecordData: [], // 持仓数据
  },
  mutations: {
    setLanguage(state, data) {
			state.language = data;
      localStorage.setItem('LANGUAGE', data);
		},

    setAddress(state, data) {
      state.address = data;
      localStorage.setItem('address', data);
    },
    // 设置链接方式
    setLinkType(state, data) {
      state.linType = data;
    },
    // 设置网络 id 配置
    setNetWork(state, data) {
      state.ethNetWork = data;
    },
    // 设置状态
    setIsLink(state, data) {
      state.isLink = data;
    },
    // 设置状态
    setHock(state, data) {
      state.hock = data;
    },
    // 设置持仓数据
    setHoldRecordData(state, data) {
      state.holdRecordData = data;
    }
  },
  actions: {
  },
  modules: {
    // web3相关
    web
  }
})
