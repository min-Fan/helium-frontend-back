<template>
  <div class="Map_wrap">
    <div class="Map_tab">
      <div class="top_box f-a-c f-j-sb">
        <van-tabs v-model="active" @change="tabsChange" >
          <van-tab
            v-for="(item,index) in tabList"
            :key="index  + 'key1'"
            :title="i18n.Map[item.key]"
            :name="index+1"
          ></van-tab>
        </van-tabs>
      </div>

      <!-- 映射 -->
      <div class="map_box" v-show="active==1">
        <!-- NFT映射 -->
        <div class="map_item">
          <div class="row_top f-a-c f-j-sb">
            <div class="left f-a-c">
              <img src="../assets/img/icon_map.png" alt />
              <span>NFT{{i18n.Map.Map}}</span>
            </div>
          </div>
          <div class="select_row f-a-c f-j-sb" @click="openPopup">
            <div class="left f-a-c">
              <span v-if="currentNFT.name">{{currentNFT.name}}</span>
              <span v-else>{{i18n.Map.Select}} NFT {{i18n.Map.Type}}</span>
              <img src="../assets/img/numsBur1.png" alt />
            </div>
            <div class="right f-a-c">
              <span>{{i18n.Map.Balance}}</span>
              <!-- <span>{{currentNFT.num||'--'}}{{i18n.Map.PCS}}</span> -->
              <span>{{mapCardList.length||'--'}}{{i18n.Map.PCS}}</span>
            </div>
          </div>
          <div class="inp_box f-a-c f-j-sb">
            <img class="left_icon" src="../assets/img/icon_chain.png" alt />
            <div class="right_box">
              <div class="box_top f-a-c f-j-sb">
                <van-field class="pcs_inp fieldC" type="number" v-model="NftNum" :readonly="true" :placeholder="i18n.Map.MapChooseNft" @blur="inpNftNum"/>
                <!-- <div class="pcs">{{i18n.Map.PCS}}</div> -->
                <!-- <div class="all" @click="allNft">{{i18n.Map.All}}</div> -->
              </div>
              <div class="bottom_box f-a-c f-j-sb">
                <div class="left f-a-c">
                  <img src="../assets/img/esgIcon.png" alt />
                  <span>ESG</span>
                </div>
                <!-- <div class="right">{{NftEsg}}</div> -->
                <div class="right">{{Number(NftEsg).toFixed(0)}}</div>
              </div>
            </div>
          </div>
          <div class="confirm_btn f-j-a-c" @click="mapNftExchange">{{i18n.Map.Confirm}}</div>
        </div>
        <!-- UESG映射 -->
        <!-- <div class="map_item">
          <div class="row_top f-a-c f-j-sb">
            <div class="left f-a-c">
              <img src="../assets/img/icon_map.png" alt />
              <span>UESG{{i18n.Map.Map}}</span>
            </div>
            <div class="right f-a-c">
              <span>{{i18n.Map.Balance}}</span>
              <span>{{balanceEsg}}</span>
            </div>
          </div>
          <div class="inp_box f-a-c f-j-sb">
            <img class="left_icon" src="../assets/img/icon_chain.png" alt />
            <div class="right_box">
              <div class="box_top f-a-c f-j-sb">
                <van-field v-model="UesgNum" type="digit" :readonly="true" :placeholder="i18n.Map.MapPlc" @blur="inpUESGNum"/>
                <div class="all" @click="allUesg">{{i18n.Map.All}}</div>
              </div>
              <div class="bottom_box f-a-c f-j-sb">
                <div class="left f-a-c">
                  <img src="../assets/img/esgIcon.png" alt />
                  <span>ESG</span>
                </div>
                <div class="right">{{usegEsg}}</div>
              </div>
            </div>
          </div>
          <div class="confirm_btn_no f-j-a-c" @click="uesgExchange">{{i18n.Map.Confirm}}</div>
        </div> -->
        
      </div>

      <div class="receive_box" v-show="active==2">
        <div id="myEcharts" class="echarts"></div>
        <div class="data_box">
          <div class="name_box" style="margin-right: 10px">
            <div class="item_box" v-for="(item, index) in itemList" :key="index">
              <i :style="'background-color:' + item.color"></i>
              <span>{{i18n.Map[item.name]}}</span>
              <!-- <font>{{item.value}}</font> -->
            </div>
          </div>
          <div class="name_box">
            <div class="item_box" v-for="(item, index) in itemList" :key="index">
              <span></span>
              <font>{{Number(item.value).fixed(4)}}</font>
            </div>
          </div>
          <div class="btn_box fr">
            <div class="btn" @click="getMoney">{{i18n.Map.Receive}}</div>
          </div>
        </div>
      </div>

      <div class="record_box" v-show="active==3">
        <div class="nullData" v-show="esgRecord.length == 0 && nftRecord.length == 0">
          <p>{{i18n.Team.NoData}}</p>
        </div>
        <!-- UESG类型 -->
        <!-- <div class="title_box f-a-c" v-if="esgRecord.length != 0">
          <img src="../assets/img/col_line.png" alt />
          <span>UESG{{i18n.Map.Type}}</span>
        </div>
        <div class="record_item" v-for="(item,index) in esgRecord" :key="index + 'key2'">
          <div class="row_top f-a-c f-j-sb">
            <span>{{i18n.Map.Time}}</span>
            <span>{{i18n.Map.Quantity}}(UESG)</span>
            <span>{{i18n.Map.Result}}(ESG)</span>
          </div>
          <div class="row_bottom f-a-c f-j-sb">
            <span class="time f-d-c">
              <span>{{item.Ts}}</span>
            </span>
            <span>{{item.Number}}</span>
            <span>{{item.Number}}</span>
          </div>
        </div> -->

        <!-- NFT类型 -->
        <div class="title_box f-a-c" v-if="nftRecord.length != 0">
          <img src="../assets/img/col_line.png" alt />
          <span>NFT</span>
        </div>
        <div class="record_item" v-for="(item,index) in nftRecord" :key="index + 'key3'">
          <div class="row_top row_top_two f-a-c f-j-sb">
            <span>{{i18n.Map.Time}}</span>
            <span>{{i18n.Map.Type}}</span>
            <span>{{i18n.Map.Quantity}}({{i18n.Map.PCS}})</span>
            <span>{{i18n.Map.Result}}(ESG)</span>
          </div>
          <div class="row_bottom row_bottom_two f-a-c f-j-sb">
            <span class="time f-d-c">
              <span>{{item.Ts}}</span>
              <!-- <span>12:23:13</span> -->
            </span>
            <span>{{item.Type == 100 ? 'AlAlpha(NFT)' : item.Type}}</span>
            <span>{{item.Number}}</span>
            <span>{{item.TotalAmount}}</span>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="showSelect" position="bottom">
      <div class="popup_wrapper">
        <div class="popup_title f-a-j-c">
          <div class="title">{{i18n.Map.SelectTitle}}</div>
          <img
            src="../assets/img/icon_close.png"
            alt
            class="icon_close"
            @click="showSelect=!showSelect"
          />
        </div>
        <div class="popup_content">
          <div class="row_title f-a-c f-j-sb">
            <span>NFT{{i18n.Map.Type}}</span>
            <!-- <span>{{i18n.Map.Balance}}</span> -->
            <span>tokenid</span>
          </div>
          <!-- <div
            class="row_item f-a-c f-j-sb"
            v-for="(item,index) in cardList"
            :key="index + 'key4'"
            @click="onSelect(item)"
            v-show="item.id == 0"
          >
            <span>{{item.key}}</span>
            <span>{{item.amount}} {{i18n.Map.PCS}}</span>
          </div> -->
          <div
            class="row_item f-a-c f-j-sb"
            v-for="(item,index) in mapCardList"
            :key="index + 'key4'"
            @click="onSelectMapNft(item)">
            <span>{{item.name}}</span>
            <span>{{item.tokenid}}</span>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
      <div class="wrapper">
        <van-loading type="spinner" color="#FD9025" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { _float } from "@/assets/js/float";
import { _tools, _date } from "@/assets/js/utils";
import { Toast } from "vant";
import { contractMethods, GetHistoryNftMapToEsg, GetHistoryUEsgMapToEsg } from "@api";
// 导入以太坊合约配置文件
import { Eth } from "@eth";
//创建命名空间帮助者：createNamespacedHelpers
import { createNamespacedHelpers, mapState, mapMutations } from "vuex";
//导入辅助函数
const {
  mapState: web3MapState,
  mapMutations: web3MapMutations
} = createNamespacedHelpers("web");
export default {
  inject: ["reload"],
  data() {
    return {
      showLoading: false,
      tabList: [
        {
          key: "Map"
        },
        {
          key: "Receive"
        },
        {
          key: "Record"
        }
      ],
      active: 1, // tabs
      showSelect: false,
      currentNFT: {}, // 当前NFT
      option: {
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            animation: true,
            radius: "100%",
            center: ["50%", "70%"],
            min: 0,
            max: 1,
            width: 10,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0, "#F69C15"],
                  // [1, "#DB3A5E"],
                  // [1, "#029FE5"]
                ]
              },
              roundCap: true
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            title: {
              offsetCenter: [0, "-40%"],
              fontSize: 12,
              color: "#757575"
            },
            detail: {
              fontSize: 24,
              offsetCenter: [0, "-10%"],
              valueAnimation: true,
              formatter: function(value) {
                return value;
              },
              fontWeight: "normal",
              color: "#F69C15"
            },
            data: [
              {
                value: 100,
                name: ""
              }
            ]
          }
        ]
      },
      itemList: [
        { color: "#F69C15", name: "Received", value: 0 },
        { color: "#DB3A5E", name: "NoRelease", value: 0 },
        { color: "#029FE5", name: "YesRelease", value: 0 }
      ],
      cardList: [
        { id: 0, key: "Mask Baby A", amount: 0, tokens: [] },
        { id: 1, key: "Mask Baby B", amount: 0, tokens: [] },
        { id: 2, key: "Mask Baby C", amount: 0, tokens: [] },
        { id: 3, key: "Mask Baby D", amount: 0, tokens: [] },
      ], // 卡牌数据
      mapCardList: [], // map nft 数据
      NftNum: '',  // nft 数量
      NftEsg: 0,  // NFT 兑换 esg数量
      esgRecord: [], // esg类型记录
      nftRecord: [], // nft类型记录
      balanceEsg: '', // uesg 余额
      uesgBalance: '', // uesg 余额 wei
      UesgNum: '', // uesg 数量
      usegEsg: 0, // uesg - esg 汇率
    };
  },

  computed: {
    ...mapState(["address", "ethNetWork", "isLink"]),

    ...web3MapState(["vuex_web3", "vuex_myContract", "vuex_network", "money"]),
    i18n() {
      return this.$t("message");
    }
  },

  created() {
    // 需要合约实例化后运行的函数 异步函数队列
    setTimeout(async () => {
      if (this.vuex_myContract != {}) {
        this.$nextTick(() => {
          let chartDom = document.getElementById("myEcharts");
          let myChart = echarts.init(chartDom);
          this.option.series[0].data[0].name = this.i18n.Map.EsgTotal;
          myChart.setOption(this.option);
        });
        // this.getNft()
        this.getMapNft()
        this.getTotalData()
        this.getRecord()
        // this.getUesgRecord()
        // this.getUesgBalance()
      }
    }, 0);
  },

  mounted() {},

  methods: {
    // 查询 uesg 余额
    async getUesgBalance() {
      // 查询 ESG 余额
      await this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
        console.log('ESG ==>', res)
        this.uesgBalance = res
        this.balanceEsg = res / Math.pow(10, 18)
      })
    }, 
    // 输入 UESG
    inpUESGNum() {
      this.usegEsg = this.UesgNum
      if (this.UesgNum > this.balanceEsg) {
        
      }
    },
    // 所有 UESG
    allUesg() {
      return
      this.UesgNum = this.balanceEsg 
      this.usegEsg = this.balanceEsg
    },
    // 授权 - UESG
    async approvedUesg() {
      return new Promise(async (resolve, reject) => {

        // 查询授权
        let isApproved = false
        await this.vuex_myContract.contrart_NowTokens.methods.allowance(this.address, Eth.contract.contrart_MapEsg.addr).call().then(res => {
          console.log(res)
          if (Number(res) >= Number(this.uesgBalance)) {
              isApproved = true
          } else {
              isApproved = false
          }
        })

        if (isApproved) return resolve()

        let data = {
          name: 'approve', // 方法名
          inputs: [{
              "name": "spender",
              "type": "address"
          },{
              "name": "amount",
              "type": "uint256"
          }],
          arguments: [
            Eth.contract.contrart_MapEsg.addr,
            this.uesgBalance
          ] // 参数
        }

        // 发起授权
        await contractMethods(this.address, Eth.contract.contrart_NowTokens.addr, data).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
            resolve()
          }
        }).catch(err => {
          reject()
          // 失败
          if (err.code == 110) {
            // 交易拒绝
            Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
          } else {
            // 失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          }
        })

      })
    },
    // 兑换 UESG - ESG 
    async uesgExchange() {
      return
      if (this.currentNFT.num == 0) {
        Toast({ message: this.i18n.Map.InpZero, icon: 'fail' })
        return
      }
      if (this.UesgNum == '') {
        Toast({ message: this.i18n.Map.InpUesg, icon: 'fail' })
        return
      }
      if (this.balanceEsg < this.UesgNum) {
        Toast({ message: this.i18n.Map.BalanceNo, icon: 'fail' })
        return
      }
      this.showLoading = true
      await this.approvedUesg().then(async res => {
        let params = {
          name: 'UEsgMapToEsg', // 方法名
          inputs: [{
            "name": "amount",
            "type": "uint256"
          }],
          arguments: [this.vuex_web3.utils.toWei(this.UesgNum, 'ether')], // 参数
        }
        await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Map.Redeemed, icon: 'success' });
            setTimeout(() => {
              this.getUesgBalance()
            }, 1000);
            this.UesgNum = ''
          }
        }).catch(err => {
          console.log('失败 ==>', err.message)
          if (err.code == 110) {
            // 交易拒绝
            Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
          } else {
            // 失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          }
        })
      }).catch(err => {
        Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
      })
      this.showLoading = false
    },
    // 获取记录
    async getUesgRecord() {
      this.esgRecord = []
      let data = {
        Addr: this.address,
        Desc: true
      }
      GetHistoryUEsgMapToEsg({...data}).then(res => {
        console.log(res)
        let data = res.data.records
        if (data.length != 0) {
          data.forEach(v => {
            let obj = {
              TS: '',
              Type: '',
              Number: '',
              TotalAmount: '',
            }
            obj.Ts = _date.getMDHMS(v.ts * 1000)
            obj.Number = this.vuex_web3.utils.fromWei(v.esg_amount, 'ether')
            obj.TotalAmount = this.vuex_web3.utils.fromWei(v.usdt_amount)
            this.esgRecord.push(obj)
          });
        }
      })
    },
    // 获取数据
    async getTotalData() {
      await this.vuex_myContract.contrart_MapEsg.methods.QueryUEsgAmount().call({from: this.address}).then(res => {
        console.log(res)
        let data = res
        this.option.series[0].data[0].value = Number(this.vuex_web3.utils.fromWei(res[0])).toFixed(4)
        this.itemList[0].value = this.vuex_web3.utils.fromWei(res[1])
        this.itemList[1].value = this.vuex_web3.utils.fromWei(res[2])
        this.itemList[2].value = this.vuex_web3.utils.fromWei(res[3])
        let total = Number(this.itemList[0].value) + Number(this.itemList[1].value) + Number(this.itemList[2].value)
        let value1 = this.itemList[0].value / total
        let value2 = this.itemList[1].value / total
        let value3 = this.itemList[2].value / total
        this.option.series[0].axisLine.lineStyle.color = []
        if (value1 != 0) {
          this.option.series[0].axisLine.lineStyle.color.push([value1, "#F69C15"])
        }
        if (value2 != 0) {
          this.option.series[0].axisLine.lineStyle.color.push([value1 + value2, "#DB3A5E"])
        }
        if (value3 != 0) {
          this.option.series[0].axisLine.lineStyle.color.push([value1 + value2 + value3, "#029FE5"])
        }
      })
    },  
    // 获取记录
    async getRecord() {
      this.nftRecord = []
      let data = {
        Addr: this.address,
        Desc: true
      }
      GetHistoryNftMapToEsg({...data}).then(res => {
        console.log(res)
        let data = res.data.records
        if (data.length != 0) {
          data.forEach(v => {
            let obj = {
              TS: '',
              Type: '',
              Number: '',
              TotalAmount: '',
            }
            obj.Ts = _date.getMDHMS(v.ts * 1000)
            if (v.type != 100) {
              obj.Type = this.cardList[v.type - 1].key
            } else {
              obj.Type = v.type
            }
            obj.Number = v.number
            obj.TotalAmount = this.vuex_web3.utils.fromWei(v.usdt_amount)
            this.nftRecord.push(obj)
            console.log("this.nftRecord ==>", this.nftRecord)
          });
        }
      })
    },
    // 获取nft卡牌数据
    async getNft() {
      this.cardList[0].amount = 0;
      this.cardList[1].amount = 0;
      this.cardList[2].amount = 0;
      this.cardList[3].amount = 0;
      this.showLoading = true;
      // 卡牌数量
      let numbers = [];
      await this.vuex_myContract.contrart_NowNFT.methods.balanceOf(this.address).call().then(res => {
        let data = res;
        for (let i = 0; i < data; i++) {
          numbers.push("1");
        }
      });

      // tokenid 数组
      let nftArr = [];
      await Promise.all(numbers.map(async (v, i) => {
          // 查询卡牌 tokenid
          let obj = {
            tokenid: 0,
            type: 0
          };
          await this.vuex_myContract.contrart_NowNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
            obj.tokenid = res;
            await this.vuex_myContract.contrart_NowNFT.methods.typeOf(res).call().then(res => {
              obj.type = res;
              nftArr.push(obj);
            });
          });
        })
      );

      this.nft = nftArr;
      // console.log(this.nft)

      nftArr.map(v => {
        if (v.type == 1) {
          this.cardList[0].amount += 1;
          this.cardList[0].tokens.push(v.tokenid)
        } else if (v.type == 2) {
          this.cardList[1].amount += 1;
          this.cardList[1].tokens.push(v.tokenid)
        } else if (v.type == 3) {
          this.cardList[2].amount += 1;
          this.cardList[2].tokens.push(v.tokenid)
        } else if (v.type == 4) {
          this.cardList[3].amount += 1;
          this.cardList[3].tokens.push(v.tokenid)
        }
      });

      this.showLoading = false;
    },
    // 获取 map nft 数据
    async getMapNft() {
      this.mapCardList = []

      // 卡牌数量
      let numbers = [];
      await this.vuex_myContract.contrart_MapNFT.methods.balanceOf(this.address).call().then(res => {
        let data = res;
        for (let i = 0; i < data; i++) {
          numbers.push("1");
        }
      })
      // tokenid 数组
      let nftArr = [];
      await Promise.all(numbers.map(async (v, i) => {
        let obj = {
          tokenid: 0,
          name: "AtAlpha(NFT)"
        };
        await this.vuex_myContract.contrart_MapNFT.methods.tokenOfOwnerByIndex(this.address, i).call().then(async res => {
          obj.tokenid = res
          nftArr.push(obj);
        })
      }))

      this.mapCardList = nftArr
      // console.log("mapCardList ==>", this.mapCardList)
    },
    // 输入nft数量
    inpNftNum() {
      if (this.currentNFT.num == 0) {
        Toast({ message: this.i18n.Map.InpZero, icon: 'fail' })
        return
      }
      if (!this.currentNFT.num) {
        Toast({ message: this.i18n.Map.ChooseNft, icon: 'fail' })
        this.NftNum = ''
        return
      }
      if (this.NftNum >= this.currentNFT.num) {
        this.NftNum = this.currentNFT.num
      } else if (this.NftNum  != '') {
        this.NftNum = parseInt(this.NftNum)
      }
      this.getNftToEsg()
    },
    // 所有该NFT
    allNft() {
      if (this.currentNFT.num == 0) {
        Toast({ message: this.i18n.Map.InpZero, icon: 'fail' })
        return
      }
      if (!this.currentNFT.num) {
        Toast({ message: this.i18n.Map.ChooseNft, icon: 'fail' })
        this.NftNum = ''
        return
      }
      this.NftNum = this.currentNFT.num
      this.getNftToEsg()
    },
    // 查询 NFT - ESG 
    async getNftToEsg() {
      let tokenArr = []
      for (let i = 0; i < this.NftNum; i++) {
        tokenArr.push(this.currentNFT.tokens[i])        
      }
      console.log(tokenArr)
      this.showLoading = true
      await this.vuex_myContract.contrart_MapEsg.methods.QueryNftAmounts(tokenArr).call().then(res => {
        this.NftEsg = this.vuex_web3.utils.fromWei(res)
      }).catch(err => {
        console.log(err)
      })
      this.showLoading = false

    },
    // 查询 map nft - esg
    async getMapNftToEsg() {
      await this.vuex_myContract.contrart_MapEsg.methods.QueryAlAAmount().call().then(res => {
        this.NftEsg = this.vuex_web3.utils.fromWei(res)
      })
    },
    // 授权 - NFT
    async approved() {
      return new Promise(async (resolve, reject) => {

        // 查询授权
        let isApprovedForAll = false
        await this.vuex_myContract.contrart_MapNFT.methods.isApprovedForAll(this.address, Eth.contract.contrart_MapEsg.addr).call().then(res => {
          if (res) {
            isApprovedForAll = true
          } else {
            isApprovedForAll = false
          }
        })

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
        await contractMethods(this.address, Eth.contract.contrart_MapNFT.addr, data).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
            resolve()
          }
        }).catch(err => {
          reject()
          // 失败
          if (err.code == 110) {
            // 交易拒绝
            Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
          } else {
            // 失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          }
        })

      })
    },
    // NFT 兑换
    async nftExchange() {
      if (this.currentNFT.num == 0) {
        Toast({ message: this.i18n.Map.InpZero, icon: 'fail' })
        return
      }
      if (this.NftNum == '') {
        Toast({ message: this.i18n.Map.InpNft, icon: 'fail' })
        return
      }
      let tokenArr = []
      for (let i = 0; i < this.NftNum; i++) {
        tokenArr.push(this.currentNFT.tokens[i])        
      }
      this.showLoading = true
      await this.approved().then(async (res) => {
        let params = {
          name: 'NftMapToEsg', // 方法名
          inputs: [{
            "name": "tokenIDs",
            "type": "uint256[]"
          }],
          arguments: [tokenArr], // 参数
        }
        
        await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Map.Redeemed, icon: 'success' });
            this.$nextTick(() => {
              this.getNft()
              this.NftNum = ''
            })
          }
        }).catch(err => {
          console.log('失败 ==>', err.message)
          if (err.code == 110) {
            // 交易拒绝
            Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
          } else {
            // 失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          }
        })

      }).catch(err => {
        Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
      })
      this.showLoading = false
    },
    // map NFT 兑换
    async mapNftExchange() {
      if (this.NftNum == '') {
        Toast({ message: this.i18n.Map.InpNft, icon: 'fail' })
        return
      }
      this.showLoading = true
      await this.approved().then(async (res) => {
        let params = {
          name: 'AlAMapToEsg', // 方法名
          inputs: [{
            "name": "tokenId",
            "type": "uint256"
          }],
          arguments: [this.NftNum], // 参数
        }
        
        await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params).then(async res => {
          if (res.code == 101) {
            Toast({ message: this.i18n.Map.Redeemed, icon: 'success' });
            this.$nextTick(() => {
              this.getMapNft()
              this.NftNum = ''
            })
          }
        }).catch(err => {
          console.log('失败 ==>', err.message)
          if (err.code == 110) {
            // 交易拒绝
            Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
          } else if (err.code == 111 || err.code == 113) {
            // 交易失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          } else if (err.code == 112) {
            // 交易超时
            Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
          } else {
            // 失败
            Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
          }
        })

      }).catch(err => {
        Toast({ message: this.i18n.Home.ApprovalFail, icon: 'fail' });
      })
      this.showLoading = false
    },
    // 领取收益
    async getMoney() {
      if (this.itemList[2].value == 0) {
        Toast({ message: this.i18n.Map.NoMoney, icon: 'fail' })
        return
      }

      let params = {
        name: 'ClameUEsgMap', // 方法名
        inputs: [],
        arguments: [], // 参数
      }
      
      await contractMethods(this.address, Eth.contract.contrart_MapEsg.addr, params).then(async res => {
        if (res.code == 101) {
          Toast({ message: this.i18n.Map.Received, icon: 'success' });
          this.$nextTick(() => {
            this.getTotalData()
            this.updLange()
          })
        }
      }).catch(err => {
        console.log('失败 ==>', err.message)
        if (err.code == 110) {
          // 交易拒绝
          Toast({ message: this.i18n.Toast.networkRejection, icon: 'fail' });
        } else if (err.code == 111 || err.code == 113) {
          // 交易失败
          Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
        } else if (err.code == 112) {
          // 交易超时
          Toast({ message: this.i18n.Toast.TradingTimeOut, icon: 'fail' });
        } else {
          // 失败
          Toast({ message: this.i18n.Toast.TradingFail, icon: 'fail' });
        }
      })
    },
    // 更新echarts语言
    updLange() {
      this.$nextTick(() => {
        let chartDom = document.getElementById("myEcharts");
        let myChart = echarts.init(chartDom);
        this.option.series[0].data[0].name = this.i18n.Map.EsgTotal;
        myChart.setOption(this.option); 
      });
    },
    // tabs
    tabsChange(index) {
      if (index == 2) {
        this.updLange()
      } else if (index == 3) {
        this.getRecord()
        this.getUesgRecord()
      }
    },

    // 打开popup
    openPopup() {
      if (this.mapCardList.length == 0) return Toast({ message: this.i18n.Map.InpZero, icon: 'fail' })
      this.showSelect = true;
    },

    onSelect(item) {
      this.currentNFT = {
        name: item.key,
        num: item.amount,
        id: item.id,
        tokens: item.tokens
      };
      this.NftNum = ''
      this.showSelect = false;
    },
    onSelectMapNft(item) {
      this.currentNFT = {
        name: item.name,
        tokenid: item.tokenid
      };
      this.NftNum = this.currentNFT.tokenid
      this.showSelect = false;
      this.getMapNftToEsg()
    }
  }
};
</script>

<style lang="scss" scoped>
.Map_wrap {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background: url(../assets/img/other_bg.png) no-repeat;
  background-size: 100% 100%;
  padding: 100px 0 0;
  box-sizing: border-box;

  .Map_tab {
    padding: 50px 38px;
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: rgba(0, 0, 0, 0.8);
    // min-height: 1054px;
    box-sizing: border-box;

    .top_box {
      width: 100%;
      height: 65px;
      padding-bottom: 44px;

      > span {
        font-size: 28px;
        color: #f69c15;

        i {
          margin-left: 18px;
        }
      }

      /deep/ .van-tabs {
        * {
          background-color: transparent;
        }

        .van-tabs__nav--line {
          padding: 0;
        }

        .van-tabs__line {
          background: url(../assets/img/tabs_bur.png) no-repeat center;
          background-size: 38px 8px;
          height: 8px;
          bottom: 0;
        }

        .van-tab {
          color: #aaaaaa;
          margin-right: 66px;
          font-size: 34px;
        }

        .van-tab--active {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .map_box {
    .map_item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 36px 38px;
      margin: 0 0 30px;
      .confirm_btn_no {
        width: 367px;
        height: 88px;
        background-color: #808080;
        border-radius: 50px;
        font-size: 34px;
        margin: 0 auto;
        margin-top: 50px;
        box-sizing: border-box;
      }

      .row_top {
        .left {
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          span {
            font-size: 30px;
            font-weight: 600;
            line-height: 40px;
            padding: 0 0 0 17px;
          }
        }

        .right {
          span {
            font-size: 26px;
            color: #f69c15;

            &:last-child {
              padding: 0 0 0 28px;
            }
          }
        }
      }

      .select_row {
        padding: 32px 0 0;

        span {
          font-size: 30px;
          color: #f69c15;
        }

        .left {
          span {
            padding: 0 24px 0 0;
          }

          img {
            width: 20px;
            height: 14px;
            border-radius: 50%;
          }
        }

        .right {
          span {
            &:last-child {
              padding: 0 0 0 28px;
            }
          }
        }
      }

      .inp_box {
        box-shadow: inset 0px 3px 6px 1px rgba(255, 51, 51, 0.16);
        border-radius: 8px;
        border: 2px solid #f69c15;
        padding: 28px 24px;
        margin: 32px 0 44px;
        box-sizing: border-box;

        .left_icon {
          width: 81px;
          height: 81px;
        }

        .right_box {
          .box_top {
            width: 456px;
            padding: 26px 0;
            border-bottom: 2px solid #f69c15;

            input {
              width: 250px;
              height: 42px;
              margin: 0 0 0 78px;
              background: rgba(0, 0, 0, 0);
              border: none;
              font-size: 34px;
              color: #fff;
              text-align: center;
            }
            /deep/ .van-field {
              width: 250px;
              margin: 0 0 0 30px;
              background-color: transparent;
              &.van-cell::after {
                display: none;
              }
              input {
                width: 250px;
                height: 42px;
                margin: 0 0 0 0px;
                background: rgba(0, 0, 0, 0);
                border: none;
                font-size: 34px;
                color: #fff;
                text-align: center;
                &::-webkit-input-placeholder {
                  color: #999999;
                }
              }
            }
            .fieldC {
              margin: 0 !important;
              width: 100%;
              /deep/ .van-field__body {
                display: block;
                width: 100% !important;
                input {
                  width: 100%;
                }
              }
            }


            .pcs {
              line-height: 42px;
              font-size: 34px;
              color: #999999;
              padding: 0 18px;
            }

            .all {
              line-height: 42px;
              font-size: 34px;
              color: #f69c15;
              padding: 0 0 0 27px;
              border-left: 2px solid #707070;
            }
          }

          .bottom_box {
            padding: 22px 0 0;

            .left {
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
              }

              span {
                font-size: 30px;
                color: #029fe5;
                padding: 0 0 0 17px;
              }
            }

            .right {
              font-size: 34px;
              color: #029fe5;
              font-weight: 600;
            }
          }
        }
      }
    }
  }

  .receive_box {
    width: 100%;
    #myEcharts {
      width: 526px;
      height: 500px;
      margin: 0 auto;
    }
    .data_box {
      width: 100%;
      height: 312px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      margin-top: -50px;
      padding: 40px;
      box-sizing: border-box;
      .name_box {
        display: inline-block;
        height: 100%;
        .item_box {
          // width: 100%;
          height: 33%;
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            width: 28px;
            height: 6px;
            border-radius: 3px;
            margin-right: 40px;
          }
          span {
            font-size: 32px;
            // min-width: 300px;
          }
          font {
            display: block;
            // height: 120%;
            color: #f69c15;
            font-size: 32px;
          }
        }
      }
      .btn_box {
        display: inline-block;
        height: 100%;
        position: relative;
        .btn {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 152px;
          height: 68px;
          background: url(../assets/img/linBtn.png) no-repeat;
          background-size: 100% 100%;
          font-size: 34px;
          line-height: 68px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .record_box {
    .nullData {
      width: 100%;
      margin-top: 100px;
      text-align: center;
      p {
        color: #999999;
        font-size: 30px;
      }
    }
    .title_box {
      padding: 0 0 18px;

      img {
        width: 8px;
        height: 22px;
      }

      span {
        font-size: 28px;
        color: #f69c15;
        padding: 0 0 0 21px;
      }
    }

    .record_item {
      padding: 21px;
      margin: 0 0 16px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;

      &:last-child {
        margin: 0;
      }

      .row_top,
      .row_bottom {
        width: 100%;
        line-height: 33px;

        span {
          width: 33.33%;
        }
      }

      .row_top {
        span {
          font-size: 20px;
          color: #999999;

          &:last-child {
            text-align: end;
          }
        }
      }

      .row_bottom {
        padding: 6px 0 0;

        .time {
          span {
            text-align: left !important;
            width: 100%;
            color: #ffffff !important;
          }
        }

        span {
          font-size: 24px;
          color: #ffffff;

          &:last-child {
            color: #f69c15;
            text-align: end;
          }
        }
      }

      .row_top_two,
      .row_bottom_two {
        width: 100%;
        line-height: 33px;

        span {
          width: 25%;
        }
      }
    }
  }
}

.confirm_btn {
  width: 367px;
  height: 88px;
  background: url(../assets/img/esgMoneyBtn.png) no-repeat;
  background-size: 100% 100%;
  font-size: 34px;
  margin: 0 auto;
  margin-top: 50px;
  box-sizing: border-box;
}

.popup_wrapper {
  width: 750px;
  background: #333333;
  border-radius: 30px 30px 0px 0px;

  .popup_title {
    width: 100%;
    height: 100px;
    position: relative;

    .title {
      font-size: 34px;
      font-weight: 600;
      color: #ffffff;
    }

    .icon_close {
      width: 44px;
      height: 44px;
      position: absolute;
      right: 44px;
      top: 25px;
    }
  }

  .popup_content {
    padding: 0 38px 64px;

    .row_title,
    .row_item {
      padding: 25px 103px;

      span {
        font-size: 30px;
        line-height: 42px;
      }
    }

    .row_title {
      span {
        color: #999999;
      }
    }

    .row_item {
      border-bottom: 1px solid #707070;

      span {
        color: #f69c15;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
