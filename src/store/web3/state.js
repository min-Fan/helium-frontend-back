
export const state = {
    vuex_web3: {}, // 注入web3对象
    vuex_myContract: {}, // 实例化合约
    vuex_network: {
        BSC_Testnet: {
            name: 'Binance Smart Chain Testnet',
            chainId: 97,
            numberToHex: '0x61'
        },
        BSC_netWork: {
            name: 'BSC_netWork',
            chainId: 56,
            numberToHex: '0x38'
        }
    },
    money: {}, // 调用交易的对象
};