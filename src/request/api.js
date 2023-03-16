import { contractMethod, HandlingFee, get, getRaw, post, postRaw } from './request'

// 发起钱包交易
export const contractMethods = (accounts, contractAddr, data, isSvr = false, svrFunId = 1) => contractMethod(accounts, contractAddr, data, isSvr, svrFunId)
export const HandlingFees = (accounts, contractAddr, data) => HandlingFee(accounts, contractAddr, data)

/**
 * 服务器请求接口
 * @param {Object} data 请求参数
 */

// 获取入金
export const GetStaticInfo = data => get('/GetStaticInfo', data)
// 获取团队数量
export const GetTeamNumber = data => postRaw('/GetTeamNumber', data)
// 获取持币人数
export const GetHolderAddr = data => get('/GetHolderAddr', data)
// 获取幸运数字公示
export const GetDrawLuckPollInfo = data => get('/GetDrawLuckPollInfo', data)
export const GetNucliearDistInfo = data => get('/GetNucliearDistInfo', data)
// 获取熵变
export const GetNucliearDistNoEntryInfo = data => get('/GetNucliearDistNoEntryInfo', data)
// 获取购买记录
export const GetHistoryBuyBlindBox = data => postRaw('/GetHistoryBuyBlindBox', data)
// 获取esg分红购买记录
// export const GetHistoryBuyEsg = data => postRaw('/GetHistoryBuyEsg', data)
// 获取nft兑换esg记录
export const GetHistoryNftMapToEsg = data => postRaw('/GetHistoryNftMapToEsg', data)
// 获取 Uesg 兑换 esg 记录
export const GetHistoryUEsgMapToEsg = data => postRaw('/GetHistoryUEsgMapToEsg', data)
//  获取个人总收益团队总收益
export const GetUserTotalReward = data => postRaw('/GetUserTotalReward', data)
// 获取团队明细
export const GetTeamDetails = data => postRaw('/GetTeamDetails', data)
// 获取个人明细
export const GetPersonalDetails = data => postRaw('/GetPersonalDetails', data)
// 获取星链数据列表
export const GetWhiteListReward = data => postRaw('/GetWhiteListReward', data)
// 获取待释放收益
export const GetUserPendingRelease = data => postRaw('/GetUserPendingRelease', data)

// 获取 买/卖 记录
export const GetHistoryBuyEsg = data => postRaw('/GetHistoryBuyEsg', data)
export const GetNewHistoryBuyEsg = data => postRaw('/GetNewHistoryBuyEsg', data)
// 获取 币价
export const GetEsgPrice = data => get('/GetEsgPrice', data)
// 获取 BPoS 信息
export const GetBposUserInfos = data => postRaw('/GetBposUserInfos', data)
export const GetNewBposUserInfos = data => postRaw('/GetNewBposUserInfos', data)
// 获取领取记录
export const GetRecordGetReward = data => postRaw('/GetRecordGetReward', data)
export const GetNewRecordGetReward = data => postRaw('/GetNewRecordGetReward', data)
// 获取是否星链
export const GetIsStarChain = data => postRaw('/GetIsStarChain', data)
// 获取 节点数据
export const GetReceivedLiquidity = data => postRaw('/GetReceivedLiquidity', data)
export const GetNewReceivedLiquidity = data => postRaw('/GetNewReceivedLiquidity', data)
// 获取 星链数据
export const GetHistoryWhitelistRecord = data => postRaw('/GetHistoryWhitelistRecord', data)
// 获取仓单领取记录
export const GetNotReceived = data => postRaw('/GetNotReceived', data)
export const GetNewNotReceived = data => postRaw('/GetNewNotReceived', data)
// 查询交易hax
export const GetTransactionStatus = data => postRaw('/GetTransactionStatus', data)
// 查询nft兑换记录
export const GetNftMapHistory = data => postRaw('/GetNftMapHistory', data)
// 查询释放s记录
export const GetNftMapRelease = data => postRaw('/GetNftMapRelease', data)

// 获取用户lp信息
export const GetLpUserInfos = data => postRaw('/GetLpUserInfos', data)
// 获取lp 记录
export const GetHistoryAddLpEsg = data => postRaw('/GetHistoryAddLpEsg', data)
// 获取lp节点数据
export const GetLpReceivedLiquidity = data => postRaw('/GetLpReceivedLiquidity', data)
// 获取lp星链数据
export const GetHistoryLpWhitelistRecord = data => postRaw('/GetHistoryLpWhitelistRecord', data)
// 查询lp是否是星链
export const GetLpIsStarChain = data => postRaw('/GetLpIsStarChain', data)
// 获取领取记录
export const GetLpNotReceived = data => postRaw('/GetLpNotReceived', data)
// 获取lp领取记录
export const GetLpRecordGetReward = data => postRaw('/GetLpRecordGetReward', data)
// 获取分红数据
export const GetLpAoutData = data => postRaw('/GetLpAoutData', data)
// 获取分红记录
export const LpDiffRecord = data => postRaw('/LpDiffRecord', data)

// 获取幸运池数据
export const GetTenUPond = data => get('/GetTenUPond', data)
// 获取luck 开奖记录
export const GetTenULottery = data => get('/GetTenULottery', data)
// 获取luck 买入记录 我的记录
export const GetTenUBuyRecord = data => postRaw('/GetTenUBuyRecord', data)
// 获取可赎回token
export const GetAbleRedeem = data => postRaw('/GetAbleRedeem', data)
// 获取节点可领取接口
// export const TeamReaward = data => postRaw('/TeamReaward', data)
// 查询hash节点数据接口
export const GetNewWhitelistRecord = data => postRaw('/GetNewWhitelistRecord', data)


