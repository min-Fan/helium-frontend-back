<template>
  <div class="NFTexchange" :class="hock ? 'NFTexchange_hock':''">
    <div class="top">
      <div class="top_box f-a-c f-j-sb">
        <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange" :ellipsis="false">
          <van-tab :title="i18n.Trading.Exchange" name="1"></van-tab>
          <van-tab :title="i18n.Trading.Mobility" name="2"></van-tab>
          <van-tab :title="i18n.Trading.Nft" name="3"></van-tab>
          <!-- <van-tab :title="i18n.Trading.Lucky" name="4"></van-tab> -->
          <van-tab :title="i18n.Trading.Hash" name="5"></van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="Trading_tab">
      <div class="tab_exchange" v-show="active == '3'">
        <div class="exchange_inp clearfix" v-if="1 == 0">
          <div class="balance fl clearfix">
            <span class="fl">{{i18n.NFTexchange.Staking}}</span>
            <span class="fr">
              <!-- <van-skeleton :row="0.5" row-width="100%" :loading="balanceLoad" round> -->
              <div>{{i18n.Trading.Balance}}：{{NFTbalance}}</div>
              <!-- <div>{{i18n.Trading.Balance}}：{{KEYbalance}}</div> -->
              <!-- </van-skeleton> -->
            </span>
          </div>
          <div class="inp_box_out fl">
            <van-field class="esg_inp" v-model="value1" :placeholder="i18n.NFTexchange.Out" :readonly="true" />
            <div class="esg_icon" @click="showChoose">
              <img src="../../assets/v2img/nft_icon.png" alt="" class="fl">
              <span class="fl">NFT</span>
              <img v-show="!hock" class="fl xia_icon" src="../../assets/v2img/xia_icon.png" alt="">
              <img v-show="hock" class="fl xia_icon" src="../../assets/v2img/xia_icon_hock.png" alt="">
            </div>
          </div>
          <div class="change_status">
            <div class="change_box">
              <img src="../../assets/v2img/xia_dan.png" alt="">
            </div>
          </div>
          <div class="in_box fl">
            <div class="in_title">
              <span>{{i18n.Trading.Receive}}</span>
            </div>
            <div class="inp_box_in">
              <van-field class="esg_inp" v-model="value2" :placeholder="i18n.NFTexchange.In" :readonly="true" />
              <div class="esg_icon">
                <img src="../../assets/v2img/esg_icon.png" alt="" class="fl">
                <span class="fl">ESG</span>
              </div>
            </div>
          </div>
          <div class="price_box fl">
            <div class="price">
              <span>{{Number(ratioUsdtEsg).toFixed(4)}} USDT ≈ 1 ESG</span>
              <img src="../../assets/v2img/reset_icon.png" alt="" @click="resetRatio">
            </div>
          </div>
          <div class="exchange_btn fl">
            <div class="confirm_btn" @click="Exchange">{{i18n.NFTexchange.Confirm}}</div>
          </div>
        </div>
        <div class="nft_list">
          <div class="list_title">
            <div class="title clearfix">
              <span class="fl">{{i18n.NFTexchange.Name}}</span>
              <span class="fr">{{i18n.NFTexchange.Mynums}}</span>
            </div>
            <p>{{i18n.NFTexchange.StakeTotal}}</p>
          </div>
          <div class="no_nfts" v-if="nftList.length == 0">
            <p>No NFT</p>
          </div>
          <div class="list_box">
            <van-collapse v-model="activeNft" accordion>
              <van-collapse-item :name="index" v-for="(item, index) in nftList" :key="index"
                @click.stop.native="nftTokens(item, index)">
                <template #title>
                  <div class="list_item">
                    <div class="list_img">
                      <img :src="item.src" alt="">
                    </div>
                    <div class="list_name">
                      <p>{{item.name}}</p>
                      <span v-if="item.name != 'Mask Baby'">{{i18n.NFTexchange.Credit}}：{{item.credit}} U</span>
                    </div>
                    <div class="list_nums">
                      <span
                        v-if="item.name == 'Mask Baby' || item.name == 'AtAlpha1(NFT)' || item.name == 'AtAlpha2(NFT)'">{{
                        item.nums }}</span>
                      <span v-else>{{item.stake}}/{{Number(item.nums) + Number(item.stake)}}</span>
                    </div>
                  </div>
                </template>
                <div class="no_nfts_item" v-if="item.nums == 0 && item.stake == 0">
                  <p>No NFT</p>
                </div>
                <div class="loading_icon clearfix" v-show="item.data.length == 0 && item.nums != 0">
                  <van-loading />
                </div>
                <div class="item_details">
                  <p v-show="item.data.length != 0">Token ID</p>
                  <div class="token_list" v-for="(v, i) in item.data" :key="i">
                    <div class="token_item">
                      <span v-if="item.name == 'Mask Baby'">{{v.typeName}}({{v.credit * v.amount}}U)</span>
                      <span v-else>#{{v.tokenid}}</span>
                      <div class="token_btn">
                        <div class="btn_set" :class="v.isStake ? 'no_btn' : ''" @click="Exchange(v, v.isStake)">
                          {{i18n.NFTexchange.Staking}}</div>
                        <div class="btn_get"
                          v-if="item.name != 'Mask Baby' && item.name != 'AtAlpha1(NFT)' && item.name != 'AtAlpha2(NFT)'"
                          :class="!v.isStake ? 'no_btn' : ''" @click="Redemption(v, v.isStake)">
                          {{i18n.NFTexchange.Redemption}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </div>
        <div class="exchange_record" @click="toMove">
          <div class="record_top clearfix">
            <span class="fl">{{i18n.Trading.RecentRecord}}</span>
            <span class="fr">{{i18n.Trading.MoveRecord}}</span>
          </div>
          <div class="null_box" v-if="recordData.length == 0">
            <span>Null</span>
          </div>
          <div class="record_item" v-if="recordData.length != 0">
            <div class="record_data clearfix">
              <span class="mairu fl" v-show="recordData[0].status == 1">{{i18n.ExchangeRecord.Eschange}}</span>
              <span class="maichu fl" v-show="recordData[0].status == 2">{{i18n.ExchangeRecord.Redemption}}</span>
              <span class="date fl">{{recordData[0].ts}}</span>
              <img v-show="!hock" class="fr" src="../../assets/v2img/you_icon.png" alt="">
              <img v-show="hock" class="fr" src="../../assets/v2img/you_icon_hock.png" alt="">
            </div>
            <div class="record_detail">
              <div class="record_usdt">
                <div class="icon_usdt">
                  <img src="../../assets/v2img/nft_icon.png" alt="">
                  <span>{{recordData[0].name}}</span>
                </div>
                <span v-if="recordData[0].number == 0">{{recordData[0].token_id}}</span>
                <span v-else>{{recordData[0].number}}</span>
              </div>
              <div class="record_icon">
                <img v-show="!hock" src="../../assets/v2img/you_icons.png" alt="">
                <img v-show="hock" src="../../assets/v2img/you_icons_hock.png" alt="">
              </div>
              <div class="record_esg">
                <div class="icon_usdt">
                  <img src="../../assets/v2img/esg_icon.png" alt="">
                  <span>ESG</span>
                </div>
                <span>{{Number(recordData[0].total_amount).toFixed(4)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hold v-show="isShowHold" :isShowHold="isShowHold" :holdList="actions" :type="2" @chooseItem="setChooseItem"
      @closeHode="closeHode" @getNftData="getNftData"></hold>
  </div>
</template>

<script>
import Hold from '@/components/popup/Hold';
import { _float } from '@/assets/js/float'
import { Toast } from 'vant';
import { _accounts, _tools, _date } from '@/assets/js/utils'
import { nft_logo } from '@/assets/js/nft_logo'
// 导入以太坊合约配置文件
import { Eth, NftName } from '@eth'
import { contractMethods, GetEsgPrice, GetNftMapHistory, GetNftMapRelease, GetAbleRedeem } from '@api'
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");

const MaskBabyCredit = {
  "1": {
    name: 'Mask Baby A',
    credit: '50'
  },
  "2": {
    name: 'Mask Baby B',
    credit: '100'
  },
  "3": {
    name: 'Mask Baby C',
    credit: '500'
  },
  "4": {
    name: 'Mask Baby D',
    credit: '1000'
  },
  "5": {
    name: 'Mask Baby N',
    credit: '2000'
  },
  "6": {
    name: 'Mask Baby S',
    credit: '3000'
  },
  "7": {
    name: 'Mask Baby SS',
    credit: '5000'
  },
  "8": {
    name: 'Mask Baby SSS',
    credit: '7000'
  },
  "9": {
    name: 'Mask Baby SSSS',
    credit: '10000'
  },
}
const NFTs = {
  "Mask Baby": {
    tokenAddress: '0x7988d65644006A08E2623FaAb2C4FD7036A85c42',
    credit: '',
  },
  "AtAlpha1(NFT)": {
    tokenAddress: '0x5ca438bAe21f528924FEa7469aE1aF4D0c699D53',
    credit: '30000',
  },
  "AtAlpha2(NFT)": {
    tokenAddress: '0xc8Cd31AbB800E133574b5C2a03f71e8088Fc3E6f',
    credit: '18000',
  },
  "Amazy Sneaker": {
    tokenAddress: '0xa8330f559e6317813940936a78b0b4597488cb7b',
    credit: '2000',
  },
  "Pancake Bunnies V5": {
    tokenAddress: '0xdf7952b35f24acf7fc0487d01c8d5690a60dba07',
    credit: '1000',
  },
  "Pancake Squad": {
    tokenAddress: '0x0a8901b0e25deb55a87524f0cc164e9644020eba',
    credit: '5000',
  },
  "Stepn": {
    tokenAddress: '0x69D60ad11fEB699fE5fEEeB16AC691dF090bfd50',
    credit: '5000',
  },
  "Melody": {
    tokenAddress: '0x4b5c4b2be2fe1656f8efedd27393c61a7357b6e7',
    credit: '3000',
  },
}
export default {
  name: 'NFTexchange',
  inject: ["reloadMain", 'reload'],
  data() {
    return {
      active: '3',
      activeNft: '1',
      NFTbalance: 0, // usdt
      ESGbalance: 0, // ESG
      value1: '', // inp1
      value2: '', // inp2
      nftPrice: '', // nft price
      ratioA: 0, // BNB - USDT
      ratioB: 0, // BNB - ESG
      ratioUsdtEsg: 0, // USDT - ESG
      ratioEsgUsdt: 0, // esg - usdt
      actions: [], // 移除持仓选项
      allData: [], // 所有数据
      allDataMairu: [], // 所有兑换
      allDataMaichu: [], // 所有赎回
      chooseItem: null, // 选择项
      recordData: [],
      isShowHold: false, // 持仓弹窗
      price: [],
      nftList: [],
      isHashWhite: false
    }
  },
  created() {
    // 需要合约实例化后运行的函数 异步函数队列
    setTimeout(async () => {
      this.getRatio()
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      // await this.getMapNft()
      // await this.getNftType()
      await this.getMapNftList()
      Toast.clear();
      // this.getHashWhite()
      this.getNftHistory()
    })
  },
  computed: {
    ...mapState(['address', 'ethNetWork', 'isLink', 'hock']),
    ...web3MapState(['vuex_web3', 'vuex_myContract', 'vuex_network', 'money']),
    i18n() {
      return this.$t('message');
    },
  },
  components: {
    Hold
  },
  methods: {
    ...mapMutations(['setHoldRecordData']),
    // 是否hash白名单
    async getHashWhite() {
      // isHashWhite
      this.isHashWhite = await this.vuex_myContract.contract_HashCollision.methods.IsWhiteList(this.address).call()
    },
    // tabs 跳转前
    async beforeTabsChange(index) {
      if (index == 1) {
        this.$router.push({ path: 'Trading' })
      } else if (index == 2) {
        // Toast({ message: this.i18n.Trading.Dev, icon: 'close', className: 'fail' });
        // return
        this.$router.push({ path: 'Mobility' })
      } else if (index == 3) {
        this.$router.push({ path: 'NFTexchange' })
      } else if (index == 4) {
        this.$router.push({ path: 'LuckyPool' })
      } else if (index == 5) {
        // if (!this.isHashWhite) {
        //   Toast({ message: this.i18n.HashBump.NoWhite, icon: 'close', className: 'fail' });
        //   return
        // }
        this.$router.push({ path: 'HashBump' })
      }
      return false;
    },

    // 切换
    tabsChange(index) {

    },
    // 获取 map nft 列表
    async getMapNftList() {
      let nfts = []
      for (const key in NFTs) {
        let contractNft = await new this.vuex_web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, NFTs[key].tokenAddress)
        let nums = await contractNft.methods.balanceOf(this.address).call()
        // let stakeNums = await GetAbleRedeem({ addr: this.address })
        // console.log("stakeNums ==>", stakeNums)
        // if (nums != 0) {
          let obj = {
            name: key,
            nums,
            stake: 0,
            tokenAddress: NFTs[key].tokenAddress,
            credit: NFTs[key].credit,
            data: [],
            src: nft_logo(key)
          }
          if (key == 'Mask Baby') {
            let data = []
            for (let i = 0; i < nums; i++) {
              await contractNft.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
                await contractNft.methods.typeOf(res).call().then(result => {
                  data.push({
                    credit: MaskBabyCredit[result].credit,
                    tokenid: res,
                    name: key,
                    typeName: MaskBabyCredit[result].name,
                    type: result
                  })
                })
              })
            }
            let maskObj = {}
            data.map(v => {
              if (!maskObj[v.type]) {
                maskObj[v.type] = { type: v.type, typeName: v.typeName, name: v.name, amount: 1, tokenids: [v.tokenid], credit: v.credit }
              } else {
                maskObj[v.type].amount += 1
                maskObj[v.type].tokenids.push(v.tokenid)
              }
            })
            for (const key in maskObj) {
              obj.data.push(maskObj[key])
            }

            console.log('obj data ==>', obj.data)
          } else {
            // map nfts
            let res = await GetAbleRedeem({ addr: this.address })
            let data = res.data
            data.forEach((v) => {
              if (v.ContrAddr == obj.tokenAddress && v.Tokenids) {
                obj.stake = v.Tokenids.length
                let data = []
                v.Tokenids.forEach(val => {
                  data.push({
                    tokenid: val,
                    isStake: true,
                    name: key,
                  })
                })
                obj.data = data
              }
            })
            // console.log("redeem res ==>", res)
          }
          nfts.push(obj)
        // } else {
        //   nfts.push({
        //     name: key,
        //     nums,
        //     stake: 0,
        //     tokenAddress: NFTs[key].tokenAddress,
        //     credit: NFTs[key].credit,
        //     data: [],
        //     src: nft_logo(key)
        //   })
        // }
      }
      this.nftList = nfts
      console.log("nftList ==>", this.nftList)
    },
    // 获取nft token
    async nftTokens(item, index) {
      if (item.name != 'Mask Baby') {
        if (item.data.length == 0 && item.nums != 0) {
          let tokens = await this.getMapNft(item)
          this.nftList[index].data = tokens
          console.log("this.nftList[index ==>", this.nftList[index])
        }
      }
    },
    // 获取 nft 列表
    getNftList() {
      this.setHoldRecordData([])
    },
    // 选择持仓
    setChooseItem(item) {
      console.log(item)
      this.chooseItem = item
      if (item.name == 'AtAlpha1(NFT)' || item.name == 'AtAlpha2(NFT)') {
        this.NftTokenid = item.tokenid
        this.value1 = item.tokenid
      } else {
        this.NftTokenid = item.tokenids
        this.value1 = item.tokenids.length
      }
      this.getMapNftToEsg(item)
      // this.value2 = this.nftPrice
    },
    closeHode() {
      this.isShowHold = false
    },
    // 获取兑换记录
    async getNftHistory() {
      let params = {
        addr: this.address,
        type: '',
        // redeem: false,
        limit: 0,
        desc: true
      }
      let recordList = await GetNftMapHistory({ ...params })
      let data = recordList.data

      data.map(v => {
        let obj = {
          is_redeem: v.is_redeem,
          map_type: v.map_type,
          contract: v.contract,
          token_id: v.token_id,
          number: v.number,
          total_amount: "",
          ts: '',
          tsY: '',
          name: ''
        }
        obj.ts = _date.getMDHM(v.ts * 1000)
        obj.tsY = _date.getYMDHMS(v.ts * 1000)
        obj.total_amount = this.vuex_web3.utils.fromWei(v.total_amount, 'ether')
        for (const key in NftName) {
          if (NftName[key].contract == v.contract) {
            obj.name = NftName[key].name
          }
        }
        this.recordData.push(obj)
      })
      // console.log(this.recordData)
    },
    // 更多记录
    toMove() {
      if (this.recordData.length == 0) {
        return
      }
      this.$router.push({ name: 'ExchangeRecord', query: { type: 2 } })
    },
    // 是否打开选择持仓
    showChoose() {
      if (this.actions.length == 0) {
        Toast({ duration: 2000, message: this.i18n.NFTexchange.NftNo, icon: 'close', className: 'fail' })
      } else {
        this.isShowHold = true
      }
    },
    // 获取汇率
    async getRatio() {
      let data = await GetEsgPrice({})
      let price = data.data
      this.price = price
      this.ratioUsdtEsg = price[0]
      this.ratioEsgUsdt = _tools.formatDecimal(1 / this.ratioUsdtEsg, 9)
      console.log(this.price)
    },

    // 刷新汇率
    async resetRatio() {
      Toast.loading({
        duration: 30000,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      await this.getRatio()
      this.value1 = ''
      this.value2 = ''
      Toast.clear();
    },
    // 获取有的nft
    async getNftType() {
      let data1 = await this.vuex_myContract.contrart_MapNFT.methods.balanceOf(this.address).call()
      if (data1 != 0) this.actions.push({ name: 'AtAlpha1(NFT)', data: [] })

      let data2 = await this.vuex_myContract.contrart_AtaNFT2.methods.balanceOf(this.address).call()
      if (data2 != 0) this.actions.push({ name: 'AtAlpha2(NFT)', data: [] })

      let data3 = await this.vuex_myContract.contrart_NowNFT.methods.balanceOf(this.address).call()
      if (data3 != 0) this.actions.push({ name: 'Mask Baby', data: [] })

      // let data4 = await this.vuex_myContract.contrart_SpaceId.methods.balanceOf(this.address).call()
      // if (data4 != 0 ) this.actions.push({name: 'SPACE ID', data: []})

      this.NFTbalance = Number(data1) + Number(data2) + Number(data3)
      console.log(data1, data2, data3)

    },
    // 获取nft数据
    getNftData(name) {
      console.log(name)
      let isdata = false
      isdata = this.isGetData(name)
      if (name == 'AtAlpha1(NFT)') {
        if (isdata) {
          this.getMapNft('contrart_MapNFT', name)
        }
      } else if (name == 'AtAlpha2(NFT)') {
        if (isdata) {
          this.getMapNft('contrart_AtaNFT2', name)
        }
      } else if (name == 'Mask Baby') {
        if (isdata) {
          this.getMapNft('contrart_NowNFT', name)
        }
      } else if (name == 'SPACE ID') {
        if (isdata) {
          this.getMapNft('contrart_SpaceId', name)
        }
      }
    },
    // 判断是否获取该数据
    isGetData(name) {
      for (let i = 0; i < this.actions.length; i++) {
        if (this.actions[i].name == name && this.actions[i].data.length == 0) {
          return true
        }
      }
    },
    // 获取 map nft 数据
    async getMapNft(item) {
      let contractNft = await new this.vuex_web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, NFTs[item.name].tokenAddress)
      // 卡牌数量
      let numbers = [];
      await contractNft.methods.balanceOf(this.address).call().then(res => {
        let data = res;
        console.log('nums ==>', res)
        for (let i = 0; i < data; i++) {
          numbers.push("1");
        }
      })
      // tokenid 数组
      let nftArr = [];
      await Promise.all(numbers.map(async (v, i) => {
        let obj = {
          tokenid: 0,
          isStake: false,
          name: item.name,
        };
        await contractNft.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
          obj.tokenid = res
          nftArr.push(obj);
        })
      }))
      let res = await GetAbleRedeem({ addr: this.address })
      let data = res.data
      data.forEach((v) => {
        if (v.ContrAddr == item.tokenAddress && v.Tokenids) {
          v.Tokenids.forEach((val) => {
            let obj = {
              tokenid: val,
              isStake: true,
              name: item.name,
            }
            nftArr.push(obj);
          })
        }
      })
      return nftArr
    },
    // 授权 - NFT
    async approved(Cname) {
      return new Promise(async (resolve, reject) => {
        // 查询授权
        let isApprovedForAll = false
        let contractNft = await new this.vuex_web3.eth.Contract(Eth.contract.contrart_MapNFT.abi, NFTs[Cname].tokenAddress)
        await contractNft.methods.isApprovedForAll(this.address, Eth.contract.contrart_MapEsg.addr).call().then(res => {
          if (res) {
            isApprovedForAll = true
          } else {
            isApprovedForAll = false
          }
        })
        console.log("isApprovedForAll ==>", isApprovedForAll)
        if (isApprovedForAll) return resolve()

        let data = {
          name: 'setApprovalForAll', // 方法名
          inputs: [{
            "name": "operator",
            "type": "address"
          },
          {
            "name": "approved",
            "type": "bool"
          }],
          arguments: [
            Eth.contract.contrart_MapEsg.addr,
            true
          ] // 参数
        }

        // 发起授权
        await contractMethods(this.address, NFTs[Cname].tokenAddress, data).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
            resolve()
          }
        }).catch(err => {
          reject()
          // 失败
          if (err.code == 110) {
            // 交易拒绝
            Toast({ duration: 2000, message: this.i18n.Toast.networkRejection, icon: 'close', className: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ duration: 2000, message: this.i18n.Toast.TradingTimeOut, icon: 'close', className: 'fail' });
          } else {
            // 失败
            Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
          }
        })

      })
    },
    // 查询 map nft - esg
    async getMapNftToEsg(item) {
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      let params = 0
      if (item.name == 'AtAlpha1(NFT)') {
        params = this.vuex_web3.utils.toWei('30000', 'ether')
      } else if (item.name == 'AtAlpha2(NFT)') {
        params = this.vuex_web3.utils.toWei('18000', 'ether')
      } else if (item.name == 'Mask Baby') {
        params = item.tokenids
      } else if (item.name == 'SPACE ID') {
        params = this.vuex_web3.utils.toWei('800', 'ether')
      }
      console.log(params)
      if (item.name == 'AtAlpha1(NFT)' || item.name == 'AtAlpha2(NFT)') {
        await this.vuex_myContract.contrart_MapEsg.methods.QueryAlAAmount(params).call().then(res => {
          this.value2 = Number(this.vuex_web3.utils.fromWei(res)).toFixed(4)
        }).catch(err => {
          console.log('nft-esg err==>', err)
          Toast.clear()
        })
      } else if (item.name == 'Mask Baby') {
        await this.vuex_myContract.contrart_MapEsg.methods.QueryNftAmounts(params[0]).call().then(res => {
          this.value2 = Number(this.vuex_web3.utils.fromWei(res)).toFixed(4) * params.length
        }).catch(err => {
          console.log('nft-esg err==>', err)
          Toast.clear()
        })
      }
      Toast.clear()
    },
    // 交易
    async Exchange(item, isStake) {
      // if (this.NftTokenid == '') {
      //   Toast({ message: this.i18n.NFTexchange.InpNft, icon: 'fail' })
      //   return
      // }
      // if (this.chooseItem == null) {
      //   Toast({ message: this.i18n.NFTexchange.InpNft, icon: 'fail' })
      //   return
      // }
      if (isStake) return
      console.log('item ==>', item)
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      // console.log(this.chooseItem)
      // let Cname = ''
      // if (this.chooseItem.name == 'AtAlpha1(NFT)') {
      //   Cname = 'contrart_MapNFT'
      // } else if (this.chooseItem.name == 'AtAlpha2(NFT)') {
      //   Cname = 'contrart_AtaNFT2'
      // } else if (this.chooseItem.name == 'Mask Baby') {
      //   Cname = 'contrart_NowNFT'
      // }
      await this.approved(item.name).then(async (res) => {
        let params = {}
        Toast.loading({
          duration: 0,
          message: this.i18n.Loading,
          forbidClick: true,
        });
        if (item.name != 'Mask Baby') {
          params = {
            name: 'MultMapToEsg', // 方法名
            inputs: [{
              "name": "contr_addr",
              "type": "address"
            }, {
              "name": "tokenid",
              "type": "uint256"
            }],
            arguments: [NFTs[item.name].tokenAddress, item.tokenid], // 参数
          }
        } else {
          params = {
            name: 'NftMapToEsg', // 方法名
            inputs: [{
              "name": "tokenIDs",
              "type": "uint256[]"
            }],
            arguments: [item.tokenids], // 参数
          }
        }

        await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params, true, 4).then(async res => {
          if (res.code == 101) {
            Toast.clear();
            Toast({ duration: 2000, message: this.i18n.NFTexchange.StakeSuc, icon: 'success' });
            this.$nextTick(() => {
              // this.getMapNft()
              // this.NftTokenid = ''
              // this.value1 = ''
              // this.value2 = ''
              // this.getMapNftList()
              this.reload()
            })
          }
        }).catch(err => {
          console.log('失败 ==>', err.message)
          Toast.clear();
          if (err.code == 110) {
            // 交易拒绝
            Toast({ duration: 2000, message: this.i18n.Toast.networkRejection, icon: 'close', className: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ duration: 2000, message: this.i18n.Toast.TradingTimeOut, icon: 'close', className: 'fail' });
          } else {
            // 失败
            Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
          }
        })

      }).catch(err => {
        Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
      })
      Toast.clear()
    },
    // 赎回
    async Redemption(item, isStake) {
      if (!isStake) return
      console.log('item ==>', item)
      Toast.loading({
        duration: 0,
        message: this.i18n.Loading,
        forbidClick: true,
      });
      let params = {
        name: 'NftRedeem', // 方法名
        inputs: [{
          "name": "contrAddr",
          "type": "address"
        }, {
          "name": "tokenId",
          "type": "uint256"
        }],
        arguments: [NFTs[item.name].tokenAddress, item.tokenid], // 参数
      }

      await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params, true, 4).then(async res => {
        if (res.code == 101) {
          Toast.clear();
          Toast({ duration: 2000, message: this.i18n.NFTexchange.RedeemedSuc, icon: 'success' });
          this.$nextTick(() => {
            // this.getMapNftList()
            this.reload()
          })
        }
      }).catch(err => {
        console.log('失败 ==>', err.message)
        Toast.clear();
        if (err.code == 110) {
          // 交易拒绝
          Toast({ duration: 2000, message: this.i18n.Toast.networkRejection, icon: 'close', className: 'fail' });
        } else if (err.code == 111 || err.code == 113) {
          // 交易失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
        } else if (err.code == 112) {
          // 交易超时
          Toast({ duration: 2000, message: this.i18n.Toast.TradingTimeOut, icon: 'close', className: 'fail' });
        } else {
          // 失败
          Toast({ duration: 2000, message: this.i18n.Toast.TradingFail, icon: 'close', className: 'fail' });
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.NFTexchange {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  .top {
    padding: 48px 32px 24px 32px;
    box-sizing: border-box;

    .top_box {
      width: 100%;
      height: 65px;

      /deep/ .van-tabs {
        * {
          background-color: transparent;
        }

        .van-tabs__wrap {
          height: 60px;
        }

        .van-tabs__nav--line {
          padding: 0;
          height: 100%;
        }

        .van-tabs__line {
          background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
          border-radius: 4px 4px 4px 4px;
          width: 32px;
          height: 4px;
          bottom: 0;
        }

        .van-tab {
          color: #666666;
          margin-right: 64px;
          font-size: 32px;
          width: auto;
          padding: 0;
          font-weight: bold;
        }

        .van-tab--active {
          color: #333333;
          font-weight: bold;
        }
      }
    }
  }

  .Trading_tab {
    padding: 0 32px 32px 32px;
    width: 100%;
    height: calc(100% - 137px);
    overflow: auto;
    box-sizing: border-box;

    .tab_exchange {
      position: relative;

      .exchange_inp {
        padding: 40px 48px;
        background-color: #fff;
        border-radius: 32px;
        box-shadow: 0px 6px 6px 2px #DCF5ED;

        .balance {
          width: 100%;
          padding: 0 32px 16px 32px;
          box-sizing: border-box;

          span {
            font-size: 24px;
          }

          & span:nth-child(1) {
            color: #999999;
          }

          & span:nth-child(2) {
            text-align: right;
            min-width: 200px;
            color: #333333;
          }
        }

        .inp_box_out,
        .inp_box_in {
          width: 100%;
          height: 96px;
          // background: url(../assets/img/nav_l_card.png) no-repeat;
          // background-size: 100% 100%;
          background-color: #F5F5F5;
          border-radius: 24px;
          opacity: 1;
          color: #fff;
          position: relative;

          .choose_box {
            position: absolute;
            right: 30px;
            top: 30px;
            display: flex;
            align-items: center;

            span {
              color: #999999;
              font-size: 34px;
            }

            img {
              width: 40px;
              margin-left: 32px;
            }
          }

          .esg_icon,
          .usdt_icon {
            overflow: hidden;
            position: absolute;
            left: 10px;
            top: 10px;
            width: 190px;
            height: 76px;
            background: #FFFFFF;
            box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.0800);
            border-radius: 24px;

            // display: flex;
            // align-items: center;
            // justify-content: center;
            img {
              width: 64px;
              height: 64px;
              margin-right: 6px;
              margin-top: 6px;
              margin-left: 18px;
              border-radius: 50%;
            }

            span {
              color: #333333 !important;
              display: inline-block;
              height: 76px;
              line-height: 76px;
              font-size: 30px;
            }

            .xia_icon {
              height: 24px;
              width: 24px;
              margin-left: 5px;
              margin-top: 26px;
            }
          }

          /deep/ .van-cell {
            background-color: transparent;
            width: 100%;
            height: 100%;

            .van-field__body {
              height: 100%;
            }

            input {
              width: 100%;
              padding-right: 32px;
              padding-left: 220px;
              text-align: right;
              font-size: 34px;
            }

            &::after {
              display: none;
            }
          }

          .usdt_inp,
          .esg_inp {
            /deep/ input {
              &::-webkit-input-placeholder {
                color: #CCCCCC;
                font-size: 28px;
              }
            }
          }
        }

        .change_status {
          width: 100%;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 200px;
          left: 0;
          z-index: 10;

          .change_box {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              height: 100%;
            }
          }
        }

        .in_box {
          display: inline-block;
          margin-top: 46px;
          overflow: hidden;

          .in_title {
            box-sizing: border-box;
            width: 100%;
            padding-bottom: 16px;
            padding-left: 32px;
            font-size: 24px;
            color: #999999;
          }
        }

        .price_box {
          width: 100%;
          font-size: 24px;
          text-align: center;
          margin: 20px 0 30px 0;
          display: flex;
          justify-content: center;

          .price {
            display: flex;
            align-items: center;

            img {
              height: 28px;
              margin-left: 10px;
            }
          }
        }

        .exchange_btn {
          font-size: 32px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          line-height: 80px;
          margin-bottom: 62px;

          .confirm_btn {
            width: 590px;
            height: 80px;
            background: linear-gradient(90deg, #4A9BF8 0%, #16CB8F 100%);
            border-radius: 16px;
          }
        }
      }

      .nft_list {
        width: 100%;
        background: #FFFFFF;
        border-radius: 32px;
        overflow: hidden;
        box-shadow: 0px 6px 6px 0px #DCF5ED;

        .list_title {
          padding: 52px 32px 0 32px;
          margin-bottom: 4px;

          .title {
            font-size: 24px;
            color: #999999;

            span {
              line-height: normal;
              font-weight: normal;
            }
          }

          p {
            margin: 0;
            text-align: right;
            font-size: 20px;
            color: #999999;
          }
        }

        .no_nfts {
          padding: 60px 0;
          p {
            text-align: center;
            font-size: 22px;
            color: #CCCCCC;
          }
        }

        .no_nfts_item {
          padding: 60px 0 0;
          p {
            text-align: center;
            font-size: 22px;
            color: #CCCCCC;
          }
        }

        .list_box {

          /deep/ .van-hairline--top-bottom::after,
          .van-hairline-unset--top-bottom::after {
            border: none;
          }

          /deep/ .van-cell {
            line-height: normal;
            align-items: center;
            padding: 54px 32px;
          }

          /deep/ .van-cell::after {
            border: none;
          }

          /deep/ .van-collapse {
            .van-collapse-item--border::after {
              border-color: #F6F6F6;
            }

            .van-cell__right-icon {
              color: #13C087;
              font-weight: bold;
              font-size: 22px;
            }

            .van-collapse-item__content {
              background-color: #F6F6F6;
              padding: 0;
            }
          }

          .loading_icon {
            padding-top: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .list_item {
            display: flex;
            align-items: center;

            .list_img {
              height: 92px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 92px;
              }
            }

            .list_name {
              margin-left: 20px;
              text-align: left;
              line-height: normal;
              font-weight: 0;

              p {
                margin: 0;
                font-size: 26px;
              }

              span {
                font-size: 20px;
                color: #999999;
              }
            }

            .list_nums {
              margin-left: auto;
              color: #13C087;
              font-size: 26px;
            }
          }

          .item_details {
            padding: 32px 40px;
            max-height: 600px;
            overflow: auto;

            p {
              margin: 0;
              font-size: 24px;
              color: #333333;
              margin-bottom: 24px;
            }

            .token_list {
              width: 100%;
              margin-bottom: 50px;

              .token_item {
                display: flex;
                align-items: center;

                span {
                  font-size: 28px;
                  color: #333333;
                }

                .token_btn {
                  display: flex;
                  align-items: center;
                  margin-left: auto;

                  .btn_set,
                  .btn_get {
                    width: 154px;
                    height: 70px;
                    background: linear-gradient(270deg, #16CB8F 0%, #499BF7 100%);
                    border-radius: 12px;
                    color: #fff;
                    text-align: center;
                    line-height: 70px;
                    font-weight: normal;
                  }

                  .btn_get {
                    margin-left: 44px;
                  }

                  .no_btn {
                    background: #EAEAEA;
                    color: #999999;
                  }
                }
              }
            }

            & .token_list:last-child {
              margin: 0;
            }
          }
        }
      }

      .exchange_record {
        width: 100%;
        padding: 32px;
        box-sizing: border-box;
        background: #FFFFFF;
        box-shadow: 0px 6px 4px 2px #DCF5ED;
        border-radius: 32px;
        margin-top: 32px;

        .record_top {
          width: 100%;
          margin-bottom: 32px;

          span {
            font-size: 28px;
          }

          & span:nth-child(2) {
            color: #999999;
          }
        }

        .record_item {
          .record_data {
            margin-bottom: 12px;
            width: 100%;
            display: flex;
            align-items: center;

            span {
              font-size: 28px;
            }

            .mairu {
              color: #13C087;
            }

            .maichu {
              color: #E52E2E;
            }

            .date {
              font-size: 20px;
              color: #999999;
              margin-left: 8px;
            }

            img {
              margin-left: auto;
              height: 32px;
              margin-right: -10px;
            }
          }

          .record_detail {
            display: flex;

            .record_usdt {
              margin-right: auto;
              font-size: 24px;

              .icon_usdt {
                display: flex;
                align-items: center;
                font-size: 24px;
                margin-bottom: 5px;

                img {
                  height: 36px;
                  margin-right: 8px;
                }
              }
            }

            .record_icon {
              margin: auto;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;

              img {
                height: 14px;
              }

              &::after {
                content: '';
                display: block;
                width: 160px;
                height: 2px;
                background-color: #EDEDED;
                position: absolute;
                top: 50%;
                left: -80px;
                margin-top: -1px;
              }
            }

            .record_esg {
              margin-left: auto;
              font-size: 24px;
              text-align: right;

              .icon_usdt {
                display: flex;
                align-items: center;
                font-size: 24px;
                margin-bottom: 5px;

                img {
                  height: 36px;
                  margin-right: 8px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.NFTexchange_hock {
  .top .top_box /deep/ .van-tabs .van-tab {
    color: $text-qqs-hock;
  }

  .top .top_box /deep/ .van-tabs .van-tab--active {
    color: $text-qs-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp,
  .Trading_tab .tab_exchange .exchange_record {
    background-color: $back-hock;
    box-shadow: none;
  }

  .Trading_tab .tab_exchange .exchange_inp .balance span {
    color: $text-999-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp .balance span:nth-child(2) {
    color: $text-qs-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp .inp_box_out,
  .Trading_tab .tab_exchange .exchange_inp .inp_box_in {
    background-color: $back-qs-hock;
  }

  /deep/ .van-field__control {
    color: $text-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp .inp_box_in /deep/ .van-cell input,
  .Trading_tab .tab_exchange .exchange_inp .inp_box_out /deep/ .van-cell input {
    &::-webkit-input-placeholder {
      color: $text-666-hock;
    }
  }

  .Trading_tab .tab_exchange .exchange_inp .inp_box_out .usdt_icon,
  .Trading_tab .tab_exchange .exchange_inp .inp_box_in .esg_icon {
    background-color: $back-hock;

    span {
      color: $text-qs-hock !important;
    }
  }

  .Trading_tab .tab_exchange .exchange_record .record_item .record_detail .record_icon::after {
    background-color: $trading-border-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon,
  .Trading_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon {
    background-color: $back-hock;
  }

  .Trading_tab .tab_exchange .exchange_inp .inp_box_out .esg_icon span,
  .Trading_tab .tab_exchange .exchange_inp .inp_box_in .usdt_icon span {
    color: $text-qs-hock !important;
  }

  .Trading_tab .tab_exchange .nft_list {
    background-color: $back-hock;
    box-shadow: none;
  }

  /deep/ .van-cell {
    background-color: $back-hock;
  }

  .Trading_tab .tab_exchange .nft_list .list_box .list_item .list_name p {
    color: #fff;
  }

  /deep/ .Trading_tab .tab_exchange .nft_list .list_box .van-collapse .van-collapse-item__content {
    background-color: #09130F;
  }

  .Trading_tab .tab_exchange .nft_list .list_box .item_details p {
    color: #fff;
  }

  .Trading_tab .tab_exchange .nft_list .list_box .item_details .token_list .token_item span {
    color: #fff;
  }

  .Trading_tab .tab_exchange .nft_list .list_box .item_details .token_list .token_item .token_btn .no_btn {
    background-color: #0F1A17;
    color: #fff;
  }

  .Trading_tab .tab_exchange .nft_list .list_box .van-collapse .van-collapse-item--border::after {
    border-color: #252F2B;
  }
}
</style>
