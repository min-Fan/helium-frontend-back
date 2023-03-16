import store from '../store'
import axios from 'axios'; // 引入axios
import qs from 'qs'; // 引入qs模块
import router from "../router";
import { _local } from '@/assets/js/utils'
import { GetTransactionStatus } from '@api'


// 判断环境
if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_API_URL
} else {
    axios.defaults.baseURL = process.env.VUE_APP_API_URL
}

// 请求超时
axios.defaults.timeout = 30000

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


var instance = axios.create({
    headers: {
        'content-type': 'application/json'
    }
});

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    // console.log("params ==>", params)
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            console.log(err)
            reject(err.data)
        })
    })
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function getRaw(url, params) {
    // params = JSON.stringify(params)
    console.log(params)
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            console.log(err)
            reject(err.data)
        })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    params = qs.stringify(params)
    // console.log('params ==>', params)
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}


/**
 * 封装post请求 raw方式
 * @param url
 * @param params
 * @returns {Promise}
 */

export function postRaw(url, params = {}) {
    params = JSON.stringify(params)
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.log(err)
                reject(err.data)
            })
    })
}


export function HandlingFee(accounts, contractAddr, params) {
    return new Promise(async (resolve, reject) => {
        // vuex 中管理的 web3对象
        let web3 = store.state['web'].vuex_web3
        // abi 编码调用方法参数 methodsid
        let data = store.state.web.vuex_web3.eth.abi.encodeFunctionCall({
            name: params.name, // 调用的方法名
            type: "function",
            inputs: params.inputs,
        }, params.arguments); // 参数 授权给业务合约地址 Eth.contract.contrart_Helium.addr, 授权金额 最大数"10000000000000000000000000000000"
        // nonce
        let nonceNumber =  await store.state.web.vuex_web3.eth.getTransactionCount(accounts)
        // 获取 gas 价格
        let gasPrice = await store.state.web.vuex_web3.eth.getGasPrice()

        // 转账金额
        let value = params.value ? params.value : 0
        // 预估 gas limit
        let gasLimit = 0
        await store.state.web.vuex_web3.eth.estimateGas({
            nonce: store.state.web.vuex_web3.utils.numberToHex(nonceNumber),
            from: accounts, // 发起方地址
            to: contractAddr, // 合约地址
            gasPrice: store.state.web.vuex_web3.utils.numberToHex(gasPrice),
            // gas: store.state.web.vuex_web3.utils.numberToHex(gasLimit), // limit gas 限制
            value: store.state.web.vuex_web3.utils.toHex(value),
            data, // 掉起合约方法编译的abi编码
        }).then(res => {
            gasLimit = parseInt(res * 1.2)
        }).catch(err => {
            console.log("预估gas ==>", err)
            reject({
                code: 115,
                message: err
            })
        })
        let free = gasLimit * gasPrice
        resolve({
            code: 101,
            message: free
        })
    })
}
/**
 * @param {String} 请求地址
 * @param {Object} 请求data
 */
export function contractMethod(accounts, contractAddr, params, isSvr, svrFunId) {
    return new Promise(async (resolve, reject) => {reject({code: 113,message: 'Failed transactions'})})
    return new Promise(async (resolve, reject) => {
        // vuex 中管理的 web3对象
        let web3 = store.state['web'].vuex_web3
        // abi 编码调用方法参数 methodsid
        let data = store.state.web.vuex_web3.eth.abi.encodeFunctionCall({
            name: params.name, // 调用的方法名
            type: "function",
            inputs: params.inputs,
        }, params.arguments); // 参数 授权给业务合约地址 Eth.contract.contrart_Helium.addr, 授权金额 最大数"10000000000000000000000000000000"
        // nonce
        let nonceNumber =  await store.state.web.vuex_web3.eth.getTransactionCount(accounts)
        // 获取 gas 价格
        let gasPrice = await store.state.web.vuex_web3.eth.getGasPrice()

        // 转账金额
        let value = params.value ? params.value : 0
        // 预估 gas limit
        let gasLimit = 0
        await store.state.web.vuex_web3.eth.estimateGas({
            nonce: store.state.web.vuex_web3.utils.numberToHex(nonceNumber),
            from: accounts, // 发起方地址
            to: contractAddr, // 合约地址
            gasPrice: store.state.web.vuex_web3.utils.numberToHex(gasPrice),
            // gas: store.state.web.vuex_web3.utils.numberToHex(gasLimit), // limit gas 限制
            value: store.state.web.vuex_web3.utils.toHex(value),
            data, // 掉起合约方法编译的abi编码
        }).then(res => {
            gasLimit = parseInt(res * 1.5)
        }).catch(err => {
            console.log(err)
            reject({
                code: 115,
                message: err
            })
        })
        if (gasLimit == 0) {
            return
        }
        console.log("gasLimit ==>", gasLimit, store.state.web.vuex_web3.utils.fromWei(gasLimit * gasPrice + '', 'ether'))
        // walletConnect 协议发起交易必备参数
        const tx = {
            nonce: store.state.web.vuex_web3.utils.numberToHex(nonceNumber),
            from: accounts, // 发起方地址
            to: contractAddr, // 合约地址
            gasPrice: store.state.web.vuex_web3.utils.numberToHex(gasPrice),
            gas: store.state.web.vuex_web3.utils.numberToHex(gasLimit), // limit gas 限制
            value: store.state.web.vuex_web3.utils.toHex(value),
            data, // 掉起合约方法编译的abi编码
        };

        console.log(tx)
        console.log("linType ==>", store.state.linType)
        if (store.state.linType == 'Network') {
            // 发起交易
            callback(null)
            // 发起交易
            store.state.web.money.sendTransaction(tx).then((result) => {
                // 返回交易hax
                console.log(result);
                let number_takeGain = 1
                let timer_takeGain = setInterval(() => {
                    number_takeGain++
                    // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
                    store.state.web.vuex_web3.eth.getTransactionReceipt(result).then((res) => {
                        if (res == null) {
                            callback(res)
                        } else if (res.status) {
                            // 交易成功 返回收据
                            callback(res.status, res)
                            clearInterval(timer_takeGain);
                        } else {
                            callback(res.status, res.transactionHash)
                            clearInterval(timer_takeGain);
                        }
                    });
                    if (number_takeGain > 10) {
                        callback("timeout")
                        clearInterval(timer_takeGain);
                        number_takeGain = 1;
                    }
                }, 3000)
            }).catch(error => {
                callback('walletConnect', null, error)
                if (error) {

                }
            })
        } else {
            // metamask方式 钱包链接
            // 发起含合约方法的交易必要参数
            console.log(data)
            let params = [{
                nonce: store.state.web.vuex_web3.utils.toHex(nonceNumber),
                gasPrice: store.state.web.vuex_web3.utils.toHex(gasPrice),
                gas: store.state.web.vuex_web3.utils.toHex(gasLimit),
                from: accounts,
                to: contractAddr,
                data
            }]
            // 确认发起 - 回调
            callback(null);
            store.state.web.money.request({method: 'eth_sendTransaction', params}).then(txHash => {
                if (txHash) {
                    let number_takeGain = 1
                    let timer_takeGain = setInterval(() => {
                        number_takeGain++
                        // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
                        web3.eth.getTransactionReceipt(txHash).then(function (res) {
                            if (res == null) {
                                callback(res)
                            } else if (res.status) {
                                if (isSvr) {
                                    console.log('await 服务器更新...')
                                    GetTransactionStatus({tx_hash: res.transactionHash, id: svrFunId}).then(result => {
                                        if (result.data) {
                                            console.log('服务器更新完成')
                                            callback(res.status, res.transactionHash)
                                            clearInterval(timer_takeGain);
                                        }
                                    })
                                } else {
                                    callback(res.status, res.transactionHash)
                                    clearInterval(timer_takeGain);
                                }
                            } else {
                                callback(res.status, res.transactionHash)
                                clearInterval(timer_takeGain);
                            }
                        });
                        if (number_takeGain > 10) {
                            callback("timeout")
                            clearInterval(timer_takeGain);
                            number_takeGain = 1;
                        }
                    }, 2000)
                }
            }).catch(error => {
                console.log("metamask error =>", error)
                if (error.code == "-32603") {
                    callback("fail");
                }
                else if (error.code == "-32602") {
                    callback("fail");
                }
                else if (error == "cancel") {
                    callback("refuse");
                }
                else if (error.code == "4001") {
                    callback("refuse", null, error.error);
                } else {
                    callback("metamask", null, error);
                }
            })
        }
        // return

        // 查询交易结果的回调函数
        function callback(status, hax = null, error) {
            console.log('交易进度 status==>', status)
            if (status == true) {
                console.log('交易成功 hax==>', hax)
                resolve({
                    code: 101,
                    hax
                })
            } else if (status == false) {
                console.log('交易失败 hax==>', hax)
                reject({
                    code: 111,
                    message: 'Failed transactions'
                })
            } else if (status == "refuse") {
                console.log('交易拒绝')
                reject({
                    code: 110,
                    message: 'Deal Rejection'
                })
            } else if (status == "timeout") {
                console.log('交易超时')
                reject({
                    code: 112,
                    message: 'Transaction Timeout'
                })
            } else if (status == "fail") {
                console.log('交易失败')
                reject({
                    code: 113,
                    message: 'Failed transactions'
                })
            } else if (status == 'walletConnect') {
                // walletConnect 钱包报错
                reject({
                    code: 114,
                    message: error
                })
            } else if (status == 'metamask') {
                reject({
                    code: 114,
                    message: error
                })
            }
        }

    })
}
