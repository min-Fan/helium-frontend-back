export const mutations = {
    // 注入web3
    setWeb3 (state, data) {
        state.vuex_web3 = data
    },
    // 注入合约 二维对象
    setContract (state, data) {
        state.vuex_myContract[data.name] = { ...data.contract }
    },
    
    // 注入 调用交易的钱包 / 协议对象
    setMoney(state, data) {
        state.money = data
    }
    

}