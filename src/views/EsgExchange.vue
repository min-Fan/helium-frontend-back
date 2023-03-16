<template>
    <div class="EsgExchange_wrap">
        <div class="EsgExchange_tab">
            <div class="top_box f-a-c f-j-sb">
                <van-tabs v-model="active" @change="tabsChange" :before-change="beforeTabsChange">
                    <van-tab :title="i18n.EsgExchange.Exchange" name="1"></van-tab>
                    <van-tab :title="i18n.EsgExchange.NoPositioning" name="2"></van-tab>
                    <van-tab :title="i18n.EsgExchange.Positioning" name="3"></van-tab>
                    <van-tab :title="i18n.EsgExchange.Details" name="4"></van-tab>
                    <van-tab :title="i18n.EsgExchange.Node" name="5"></van-tab>
                </van-tabs>
                <van-popover
                v-model="showPopover"
                trigger="click"
                :actions="options"
                placement="bottom-end"
                :get-container="getContainer"
                @select="statusSelect">
                <template #reference>
                    <span v-show="active == 3">{{i18n.EsgExchange[Status]}}<i class="el-icon-caret-bottom"></i></span>
                </template>
                </van-popover>
            </div>

            <div class="listloading_box" v-show="active == '3'">
                <!-- <van-list
                    v-model="loading"
                    :finished="finished"
                    :loading-text="i18n.Team.Loading"
                    :finished-text="i18n.Team.LoadingNone"
                    @load="getHoldList"
                    offset="10"> -->
                    <div class="nullData" v-show="listData.length == 0">
                        <p>{{i18n.Team.NoData}}</p>
                    </div>
                    <div :class="item.status == 'team' ? 'list_box_team' : 'list_box'" class="list_box" v-for="(item, index) in listData" :key="index">
                        <div class="tip_box" v-if="item.status == 'team'" >
                            <img src="../assets/img/team.png" alt="" srcset="">
                            <span>{{ i18n.EsgExchange.Details }}</span>
                        </div>
                        <div class="list_title clearfix">
                            <div class="team_span clearfix" v-if="item.status == 'team'">
                                <div class="team_text fl">
                                    <span>{{i18n.EsgExchange.TeamReceipts}}</span>
                                    <img src="../assets/img/team_icon.png" alt="">
                                </div>
                                <div class="releasepProceeds_box fl">
                                    <font>{{i18n.EsgExchange.ReleasepProceeds}}(USDT)</font>
                                    <p>{{ item.ReleasepProceeds }}</p>
                                </div>
                            </div>
                            <p class="fl" v-else>{{i18n.EsgExchange.PositioningSingle}}{{index + 1}}</p>
                            <span class="fr" style="color: #F69C15" v-show="item.status == 'jinxingzhong'">{{i18n.EsgExchange.Status2}}</span>
                            <span class="fr" style="color: #FA6868" v-show="item.status == 'yimaichu'">{{i18n.EsgExchange.Status3}}</span>
                            <span class="fr" style="color: #0DB970" v-show="item.status == 'yiquchu'">{{i18n.EsgExchange.Status4}}</span>
                        </div>
                        <div class="list_data">
                            <div class="data_box">
                                <p>{{i18n.EsgExchange.BuyNums}}<span style="font-size: 12px;color: #8E8A8A;">(ESG)</span></p>
                                <font>{{item.EsgAmount}}</font>
                            </div>
                            <div class="data_box">
                                <p>{{i18n.EsgExchange.Price}}<span style="font-size: 12px;color: #8E8A8A;">(USDT)</span></p>
                                <font>{{item.UsdtAmount}}</font>
                            </div>
                            <div class="data_box">
                                <p>{{i18n.EsgExchange.Time}}</p>
                                <font>{{item.Ts}}</font>
                            </div>
                        </div>
                        <div class="list_earnings clearfix">
                            <div class="data_box">
                                <p>{{i18n.EsgExchange.Earnings}}</p>
                                <font>{{item.RewardAmount}}</font>
                            </div>
                            <div class="data_box" v-show="item.status == 'jinxingzhong' || item.status == 'team'" >
                                <p>{{i18n.EsgExchange.NoEarnings}}</p>
                                <font style="color: #F69C15;font-weight: bold;">{{item.RewardAmounted}}</font>
                            </div>
                            <div class="data_box" v-show="item.status == 'jinxingzhong' || item.status == 'team'">
                                <div class="commit_btn" v-if="item.status == 'jinxingzhong'" @click="getEarnings(item, 1)">{{i18n.EsgExchange.GetEarnings}}</div>
                                <div class="commit_btn" v-if="item.status == 'team'" @click="getEarnings(item, 2)">{{i18n.EsgExchange.GetEarnings}}</div>
                            </div>
                            <div class="data_box data_btn" v-show="item.status == 'yiquchu'">
                                <img src="../assets/img/txSuc.png" alt="">
                            </div>
                        </div>
                    </div>
                <!-- </van-list> -->
            </div>
            
            <div class="exchange_box clearfix" v-show="active == '1' || active == '2'">
                <van-icon class="query_icon" name="question-o" @click="showQueryBox(3)" v-show="active == '1'"/>
                <div class="price fl">
                    <span>{{i18n.EsgExchange.Pricetxt}}</span>
                    <font>{{Number(ratioUsdtEsg).toFixed(4)}}USDT=1ESG</font>
                    <img src="../assets/img/exchange2.png" alt="" @click="resetRatio">
                </div>
                <div class="exchange fl">
                    <div class="inp_box">
                        <van-field v-show="active == 1" v-model="value1" placeholder="" @blur="esgInp" :readonly="!isImg"/>
                        <van-field class="rightinp" v-show="active == 2" v-model="value1" placeholder="" :readonly="!isImg" @click="showChoose"/>
                        <div class="choose_box" v-show="active == 2" @click="showChoose">
                            <span v-show="chooseItem.Idx == undefined">{{i18n.EsgExchange.ChoosePost}}</span>
                            <!-- <span v-show="">{{}}</span> -->
                            <img src="../assets/img/xia.png" alt="">
                        </div>
                        <div class="esg_icon">
                            <img src="../assets/img/esgIcon.png" alt="" class="fl">
                            <span class="fl" style="color: #029FE5">ESG</span>
                        </div>
                    </div>
                    <div class="icon_box clearfix">
                        <span class="fr">{{i18n.EsgExchange.EsgBalance}}：{{(ESGbalance).toFixed(4)}}</span>
                    </div>
                </div>

                <img v-show="active == 1" class="imgX fl" src="../assets/img/Exchange.png" alt="" >
                <img v-show="active == 2" class="imgS fl" src="../assets/img/Exchange.png" alt="" >
                
                <div class="exchange fl">
                    <div class="inp_box">
                        <van-field class="usdt_inp" v-model="value2" :placeholder="i18n.EsgExchange.Plac" @blur="usdtInp" :readonly="!isImg"/>
                        <div class="esg_icon">
                            <img src="../assets/img/usdt.png" alt="" class="fl">
                            <span class="fl" style="color: #1BA27A">USDT</span>
                        </div>
                    </div>
                    <div class="icon_box clearfix">
                        <span class="fl key_icon">KEY {{ KEYbanlace }}</span>
                        <span class="fr">{{i18n.EsgExchange.Balance}}：{{USDTbalance}}</span>
                    </div>
                </div>
            </div>
            <div class="price_box" v-show="active == '1' || active == '2'">
                <div class="chanum clearfix">
                    <span class="fl">{{i18n.EsgExchange.Tolerances}}</span>
                    <!-- <el-input-number v-model="value" controls-position="right" :min="0" :max="6" :step="1" ></el-input-number> -->
                    <!-- <van-stepper class="fl" v-model="valueBai" min="0" max="100" step="1" @change="stepChange"/> -->
                    <van-icon name="minus" @click="handlePrev"/>
                    <van-field v-model="valueBai" type="number" right-icon="warning-o" @blur="valueBaichange"/>
                    <van-icon name="plus" @click="handleNext"/>
                </div>
                <div class="cha clearfix">
                    <!-- <span>{{i18n.EsgExchange.Tolerances}}</span> -->
                    <!-- <van-slider v-model="value" @change="onChange" max="10" step="0.01"/> -->
                    <el-slider
                        v-model="value"
                        :step="1"
                        :max="6"
                        show-stops
                        :show-tooltip="false"
                        :marks="marks"
                        @change="sliderChange">
                    </el-slider>
                    <!-- <font style="margin-right: 0">{{value}}%</font> -->
                </div>
            </div>
            <div class="confirm_btn f-j-a-c" @click="openInvite" v-show="active == '1' || active == '2'">{{i18n.EsgExchange.ExchangeBtn}}</div>
            <!-- <div class="details_box" v-show="active == '4'">
                <div class="nullData" v-show="detailsList.length == 0">
                    <p>{{i18n.Team.NoData}}</p>
                </div>
                <div class="details_item" v-for="(item, index) in detailsList" :key="index">
                    <div class="details_top clearfix">
                        <div class="calendar_box fl">
                            <img src="../assets/img/calendar.png" alt="">
                            <span>2022.4.18</span>
                        </div>
                        <div class="total_box fl">
                            <font>{{i18n.EsgExchange.TotalRevenue}}</font>
                            <span style="font-weight: bold;">1888 USDT</span>
                        </div>
                    </div>
                    <div class="earnings_box clearfix">
                        <div class="earnings_team fl">
                            <p>{{i18n.EsgExchange.TeamReceipts}}(USDT)</p>
                            <span>12345.00</span>
                            <div class="datile_icon" @click="toDetails(1)">
                                <span>{{i18n.EsgExchange.ViewDetails}}</span>
                                <van-icon name="arrow" />
                            </div>
                        </div>
                        <div class="earnings_other fl">
                            <p>{{i18n.EsgExchange.OtherReceipts}}(USDT)</p>
                            <span>34428.26</span>
                            <div class="datile_icon" @click="toDetails(2)">
                                <span>{{i18n.EsgExchange.ViewDetails}}</span>
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="team" v-show="active == '4'">
                <div class="calendar_box" @click="isCalendar = true">
                    <img src="../assets/img/calendar.png" alt="">
                    <span>{{myDate}}</span>
                    <van-icon name="arrow-down"/>
                </div>
                <div class="team_head">
                    <!-- <div class="nums_box">
                        <span>{{i18n.SingleDetails.TeamNums}}</span>
                        <font>{{Number(teamTotal).toFixed(0)}} USDT</font>
                    </div> -->
                    <div class="nums_box clearfix">
                        <div class="earnings_team fl">
                            <p>{{i18n.SingleDetails.YesWallets}}</p>
                            <span>{{teamNumber}}</span>
                        </div>
                        <div class="earnings_other fl">
                            <p>{{i18n.SingleDetails.TeamNums}}(USDT)</p>
                            <span>{{Number(teamTotal).toFixed(4)}}</span>
                        </div>
                    </div>
                    <div class="earnings_box clearfix">
                        <div class="earnings_team fl">
                            <p>{{i18n.SingleDetails.Selfbenefiting}}(USDT)<van-icon name="question-o" @click="showQueryBox(1)"/></p>
                            <span>{{Number(Personalgain).toFixed(4)}}</span>
                            <!-- <span style="color: #999999">{{i18n.SingleDetails.DataUpd}}</span> -->
                        </div>
                        <div class="earnings_other fl">
                            <p>{{i18n.SingleDetails.TeamMotivation}}(USDT)<van-icon name="question-o" @click="showQueryBox(2)"/></p>
                            <span>{{Number(TeamBenefits).toFixed(4)}}</span>
                            <!-- <span style="color: #999999">{{i18n.SingleDetails.DataUpd}}</span> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="team_details" v-show="active == '4'">
                <div class="details_title clearfix">
                    <!-- <img class="fl" src="../assets/img/icon.png" alt="">
                    <span class="fl">{{i18n.SingleDetails.IncentiveDetails}}</span> -->
                    <van-tabs type="card" color="#E8A03D" v-model="active2" @change="tabsChange2">
                        <van-tab :title="i18n.SingleDetails.SelfDetails" name="1"></van-tab>
                        <van-tab :title="i18n.SingleDetails.IncentiveDetails" name="2"></van-tab>
                    </van-tabs>
                </div>
                <div class="deatails_list">
                    <div class="list_title1" v-show="active2 == 1">
                        <span v-show="active2 == 1">{{i18n.SingleDetails.Receipts}}</span>
                        <span>{{i18n.SingleDetails.Earnings}}</span>
                    </div>
                    <div class="list_title2" v-show="active2 == 2">
                        <span>{{i18n.SingleDetails.Addr}}</span>
                        <span>{{i18n.SingleDetails.Earnings}}</span>
                        <span>{{i18n.SingleDetails.Motivation}}</span>
                        <span>{{i18n.SingleDetails.Amount}}</span>
                    </div>
                    <!-- <div class="nullData" v-show="detailsList.length == 0">
                        <p>{{i18n.Team.NoData}}</p>
                    </div> -->
                    <van-list
                        v-model="loading1"
                        :finished="finished1"
                        :loading-text="i18n.Team.Loading"
                        :finished-text="i18n.Team.LoadingNone"
                        @load="getDetails"
                        offset="10"
                        v-show="active2 == 1">
                        <div class="list_data" v-for="(item, index) in detailsList" :key="index">
                            <span v-show="active2 == 1" style="text-align:center; flex: 1">{{i18n.SingleDetails.Receipts}} {{index + 1}}</span>
                            <span style="text-align:center; flex: 1">{{Number(item.earnings).toFixed(4)}} USDT</span>
                        </div>
                    </van-list>
                    <van-list
                        v-model="loading2"
                        :finished="finished2"
                        :loading-text="i18n.Team.Loading"
                        :finished-text="i18n.Team.LoadingNone"
                        @load="getTeamDetails"
                        offset="10"
                        v-show="active2 == 2">
                        <div class="list_data" v-for="(item, index) in detailsListTeam" :key="index">
                            <span class="one_text" @click="copyAddr(item.accounts)">{{item.addr}}</span>
                            <span>{{Number(item.earnings).toFixed(4)}} U</span>
                            <span>{{item.proportion}}%</span>
                            <span>{{Number(item.amount).toFixed(4)}}U</span>
                        </div>
                    </van-list>
                </div>
            </div>

            <div class="node_box" v-show="active == '5'">
                <div class="node_total">
                    <div class="total_data clearfix">
                        <div class="total_left fl">
                            <span>{{i18n.EsgExchange.EarningsTotal}}(USDT)</span>
                            <p>{{ Number(starLinkTotal).toFixed(4) }}</p>
                        </div>
                        <div class="total_right fl">
                            <div class="right_total">
                                <p><span>{{i18n.EsgExchange.MaxAmount}}(USDT)</span>{{CurrentReward}}</p>
                                <p><span>{{i18n.EsgExchange.NowAmount}}(USDT)</span>{{CurrentDeposit}}</p>
                            </div>
                            <!-- <img src="../assets/img/star_link.png" alt=""> -->
                        </div>
                    </div>
                    <div class="total_btn clearfix">
                        <span>{{i18n.EsgExchange.EarningsNow}}</span>
                        <font>{{ Number(starLinkNow).toFixed(4) }} USDT</font>
                        <div class="confirm_total f-j-a-c fr" @click="getNowEarnings">{{i18n.EsgExchange.GetEarnings}}</div>
                    </div>
                </div>
                <div class="node_detail">
                    <div class="node_detail_title clearfix">
                        <div class="node_title fl clearfix">
                            <img class="fl" src="../assets/img/col_line.png" alt="">
                            <span class="fl">{{i18n.EsgExchange.EarningsBreakdown}}</span>
                        </div>
                        <div class="calendar_box fr" @click="isCalendar = true">
                            <span>{{myDate2 == '全部日期' ? i18n.EsgExchange.AllCalendar : myDate2}}</span>
                            <van-icon name="arrow-down"/>
                        </div>
                    </div>
                    <div class="node_detail_box">
                        <div class="deatails_list">
                            <div class="list_title">
                                <span>{{i18n.SingleDetails.Addr}}</span>
                                <span>{{i18n.SingleDetails.Build}}</span>
                                <span>{{i18n.SingleDetails.Percentage}}</span>
                                <span>{{i18n.SingleDetails.Interest}}</span>
                            </div>
                            <van-list
                                v-model="loading3"
                                :finished="finished3"
                                :loading-text="i18n.Team.Loading"
                                :finished-text="i18n.Team.LoadingNone"
                                @load="getNodeDetails"
                                offset="10">
                                <div class="list_data" v-for="(item, index) in detailsListNode" :key="index">
                                    <span class="one_text" @click="copyAddr(item.accounts)">{{item.addr}}</span>
                                    <span>{{Number(item.amount).toFixed(4)}} U</span>
                                    <span>{{ item.percentage }} %</span>
                                    <span>{{Number(item.earnings).toFixed(4)}} U</span>
                                </div>
                            </van-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <van-popup v-model="showQuery" position="center">
            <div class="query_pop">
                <!-- <img src="../assets/img/close.png" alt="" class="close" @click="showQuery = false"> -->
                <div class="pop_title">{{i18n.EsgExchange[queryTitle]}}</div>
                <div class="pop_content" v-html="i18n.EsgExchange[queryContent]"></div>
            </div>
        </van-popup>

        <van-popup v-model="showInp" position="center">
            <div class="inp_pop f-d-c f-a-c">
                <div class="inp_titile">{{i18n.BlindBox.BindInviter}}</div>
                <div class="inp_group">
                    <textarea v-model="inviteAddr" :placeholder="i18n.BlindBox.InviterPlc"></textarea>
                </div>
                <div class="confirm_btn f-j-a-c" @click="addrRule">{{i18n.BlindBox.Confirm}}</div>
            </div>
        </van-popup>

        <van-action-sheet v-model="showHold" :title="i18n.EsgExchange.ChoosePositioning" :closeable="true" safe-area-inset-bottom>  
            <div class="item_actions" v-for="(item, index) in actions" :key="index" @click="onSelect(item)">
                <span class="team_span" v-if="item.type == 0">
                    <img src="../assets/img/team_icon.png" alt="">
                    {{i18n.EsgExchange.TeamReceipts}}
                </span>
                <span v-else>{{i18n.EsgExchange.Positioning}}{{ index + 1}}</span>
                <span>{{allDataIng[index].EsgAmount}}ESG</span>
            </div>
        </van-action-sheet>

        <van-action-sheet v-model="isCalendar" :get-container="getCalendar" safe-area-inset-bottom ock-scroll>
            <div class="calendar_head clearfix">
                <img class="fl" src="../assets/img/icon_close.png" alt=""  @click="isCalendar = false">
                <p>{{i18n.EsgExchange.ChooseCalendar}}</p>
                <span class="fr" @click="calendarChange">{{i18n.EsgExchange.Determine}}</span>
            </div>
            <div class="content">
                <div class="year_MD">
                    <span>{{i18n.EsgExchange.Year}}</span>
                    <span>{{i18n.EsgExchange.Month}}</span>
                    <span>{{i18n.EsgExchange.Day}}</span>
                </div>
                <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" :show-toolbar="false" />
            </div>
        </van-action-sheet>
        <van-action-sheet v-model="isCalendar" :get-container="getCalendar2" safe-area-inset-bottom ock-scroll>
            <div class="calendar_head clearfix">
                <img class="fl" src="../assets/img/icon_close.png" alt=""  @click="isCalendar = false">
                <p>{{i18n.EsgExchange.ChooseCalendar}}</p>
                <span class="fr" @click="calendarChange2">{{i18n.EsgExchange.Determine}}</span>
            </div>
            <div class="content">
                <div class="year_MD">
                    <span>{{i18n.EsgExchange.Year}}</span>
                    <span>{{i18n.EsgExchange.Month}}</span>
                    <span>{{i18n.EsgExchange.Day}}</span>
                </div>
                <van-datetime-picker v-model="currentDate2" type="date" :min-date="minDate" :max-date="maxDate" :show-toolbar="false" />
            </div>
        </van-action-sheet>

        <van-popup v-model="showLoading" position="center" :close-on-click-overlay="false">
            <div class="wrapper">
                <van-loading type="spinner" color="#FD9025" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { _float } from '@/assets/js/float'
    import { _accounts, _tools, _date } from '@/assets/js/utils'
    import { Toast } from 'vant';
    // 导入以太坊合约配置文件
    import { Eth } from '@eth'
    import { contractMethods, GetHistoryBuyEsg, GetUserTotalReward, GetTeamDetails, GetPersonalDetails, GetWhiteListReward, GetUserPendingRelease } from '@api'
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
                active: '1', // tabs
                // 当前选项
                currentIndex: 0,
                currentSpa: "",
                tabslist: ["Positioning", "OutPosition"],
                listData: [], // 列表
                allData: [], // 所有数据
                allDataIng: [], // 所有进行中数据
                allDataMaichu: [], // 所有进行中数据
                allDataQuchu: [], // 所有进行中数据
                value1: 0, // ESG
                value2: '', // USDT
                isImg: true, // 选择图片
                value: 3, // 容差滑块
                valueBai: 3, // 容差滑块 步进器
                showLoading: false, // 加载
                loading: false, // 加载中
                finished: false, // 没更多了
                offset: 0, // 偏移量
                ratioA: 0, // BNB - USDT
                ratioB: 0, // BNB - ESG
                ratioUsdtEsg: 0, // USDT - ESG
                ESGbalance: 0, // esg
                USDTbalance: 0, // USDT
                KEYbanlace: 0, // KEY
                showHold: false, // 显示选择移除
                actions: [], // 移除选项
                chooseItem: {}, // 选择的持仓
                marks: {
                    0: '0%',
                    1: '1%',
                    2: '2%',
                    3: '3%',
                    4: '4%',
                    5: '5%',
                    6: '6%',
                },
                Status: 'Status1',
                showPopover: false,
                options: [{ text: '全部状态', value: 'Status1' }, { text: '进行中', value: 'Status2' }, { text: '已移除', value: 'Status3' }, { text: '已完成', value: 'Status4' }],
                detailsList: [], // 明细列表
                detailsListTeam: [], // 团队明细
                isCalendar: false, // 日历弹出
                minDate: new Date(2022, 0, 1),
                maxDate: new Date(2025, 12, 1),
                currentDate: new Date(),
                currentDate2: new Date(),
                myDate: '', // 日期
                myDate2: '全部日期', // 日期
                showQuery: false, // 问号
                queryTitle: 'Selfbenefiting',
                queryContent: 'SelfContent',  // 问号文本
                showInp: false, // 邀请人弹窗
                isReferrer: false, // 是否有推荐人
                inviteAddr: '', // 邀请人地址
                teamNumber: 0, // 有效地址
                teamTotal: 0, // 团队仓单数量
                Personalgain: '', // 个人收益
                TeamBenefits: '', // 团队收益
                loading1: false, // 加载中
                finished1: false, // 没更多了
                offset1: 0, // 偏移量 1
                loading2: false, // 加载中
                finished2: false, // 没更多了
                offset2: 0, // 偏移量 1
                active2: '1', // 明细tabs
                tim: '', // 选择时间
                detailsListNode: [], // 星链数据
                tim2: '', // 选择时间
                offset3: 0, // 偏移量 1
                loading3: false, // 加载中
                finished3: false, // 没更多了
                starLinkTotal: '', // 星链累计收益
                starLinkNow: '', // 星链当前收益
                isWhite: false, // 星链权限
                CurrentReward: '', // 最高数额
                CurrentDeposit: '', // 当前数额
            }
        },

        computed: {
            ...mapState(['address', 'ethNetWork', 'isLink']),

            ...web3MapState(['vuex_web3','vuex_myContract', 'vuex_network', 'money']),
            i18n() {
                return this.$t('message');
            },
        },

        created() {
            let timer = new Date().getTime()
            this.myDate = _date.getYMD(timer)
            this.currentSpa = this.tabslist[1];
            // 需要合约实例化后运行的函数 异步函数队列
            setTimeout(async () => {
                if (this.vuex_myContract != {}) {
                    // this.showLoading = true
                    await this.getHoldList()
                    await this.getReferrer(this.address)
                    await this.getAllBuyData()
                    await this.getPermission()
                    this.showLoading = false
                    this.getRatio()
                    this.getBalance()
                    this.getNumsHold()
                    this.getTeamAmount()
                    this.getUserTotalRewardData()
                    this.getDetails()
                    this.getTeamDetails()
                    this.getStarData()
                    this.getNodeDetails()
                }
            }, 0)
        },

        methods: {
            // 切换明细
            tabsChange2(index) {
                
            },
            // 获取收益
            async getUserTotalRewardData() {
                let tim = this.tim == '' ? new Date(new Date().toLocaleDateString()).getTime() / 1000 + 28800 : this.tim
                let params = {
                    addr: this.address,
                    ts: tim
                }
                console.log("params ==>", params)
                await GetUserTotalReward(params).then(res => {
                    console.log(res)
                    let data = res.data
                    if (data.personal) {
                        this.Personalgain = this.vuex_web3.utils.fromWei(parseInt(data.personal) + '', 'ether')
                        this.TeamBenefits = this.vuex_web3.utils.fromWei(parseInt(data.team_reward) + '', 'ether')
                    }
                })
            },
            // 复制内容
            copyAddr(val) {
                _tools.copyValue(val)
                Toast.success(this.i18n.Main.CopySuccess)
            },
            // 获取个人明细
            async getDetails() {
                let tim = this.tim == '' ? new Date(new Date().toLocaleDateString()).getTime() / 1000 + 28800 : this.tim
                console.log(new Date(new Date().toLocaleDateString()).getTime() / 1000 + 28800)
                
                let params = {
                    addr: this.address,
                    offset: this.offset1 * 10,
                    limit: 10,
                    ts: tim
                }
                console.log('params ==>', params)
                await GetPersonalDetails(params).then(res => {
                    console.log(res)
                    this.offset1 += 1
                    let data = res.data.records
                    if (data.length != 0) {
                        data.forEach(v => {
                            let obj = {
                                earnings: ''
                            }
                            obj.earnings = this.vuex_web3.utils.fromWei(parseInt(v.reward) + '', 'ether')
                            this.detailsList.push(obj)
                            console.log("this.detailsList ==>", this.detailsList)
                        })
                        // 加载状态结束
                        this.loading1 = false;
                    } else {
                        this.finished1 = true;
                    }
                })
            },

            async getTeamDetails() {
                let tim = this.tim == '' ? new Date(new Date().toLocaleDateString()).getTime() / 1000 + 28800 : this.tim
                let params = {
                    addr: this.address,
                    offset: this.offset2 * 10,
                    limit: 10,
                    ts: tim
                }
                await GetTeamDetails(params).then(res => {
                    console.log(res)
                    this.offset2 += 1
                    let data = res.data.records
                    if (data.length != 0) {
                        data.forEach(v => {
                            let obj = {
                                addr: '',
                                accounts: '',
                                earnings: '',
                                proportion: '',
                                amount: '',
                            }
                            obj.addr = _accounts.easyAccount(null, 2, 4, v.Member) 
                            obj.accounts = v.Member
                            obj.earnings = this.vuex_web3.utils.fromWei(parseInt(v.total_reward) + '', 'ether')
                            obj.proportion = Number(v.percent) * 100
                            obj.amount = this.vuex_web3.utils.fromWei(parseInt(v.reward) + '', 'ether')
                            this.detailsListTeam.push(obj)
                        })
                        // 加载状态结束
                        this.loading2 = false;
                    } else {
                        this.finished2 = true;
                    }
                })
            },
            // 获取星链总量数据
            async getStarData() {
                await this.vuex_myContract.contrart_StarChian.methods.getWhiteListUsersReward(this.address).call().then(res => {
                    console.log("星链TOTAL ==>", res)
                    this.starLinkTotal = res["0"] == 0 ? 0 : this.vuex_web3.utils.fromWei(res['0'] + '', 'ether')
                    this.starLinkNow = res["1"] == 0 ? 0 : this.vuex_web3.utils.fromWei(res['1'] + '', 'ether')
                })
                this.vuex_myContract.contrart_StarChian.methods.CurrentReward(this.address).call().then(res => {
                    console.log("最高数额 ==>", res)
                    this.CurrentReward = res == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(2)
                })
                this.vuex_myContract.contrart_StarChian.methods.CurrentDeposit(this.address).call().then(res => {
                    console.log("当前数额 ==>", res)
                    this.CurrentDeposit = res == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(2)
                })
            },
            // 领取当前收益
            async getNowEarnings() {
                return
                if (this.starLinkNow == 0) {
                    Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
                    return
                }
                this.showLoading = true
                let params = {
                        name: 'Withdraw', // 方法名
                        inputs: [],
                        arguments: [], // 参数
                    }
                
                await contractMethods(this.address, Eth.contract.contrart_StarChian.addr, params).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.EsgExchange.GetSuc, icon: 'success' });
                        this.getStarData()
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
                this.showLoading = false
            },
            // 获取星链数据
            async getNodeDetails() {
                let tim = 0
                if (this.myDate2 == "全部日期") {
                    tim = 0
                } else {
                    tim = this.tim2 == '' ? new Date(new Date().toLocaleDateString()).getTime() / 1000 + 28800 : this.tim2
                }
                let params = {
                    addr: this.address,
                    ts: tim
                }
                await GetWhiteListReward(params).then(res => {
                    console.log('星链列表数据 ==>', res)
                    let data = res.data.records
                    if (data.length != 0) {
                        data.map(v => {
                            let obj = {
                                addr: '',
                                accounts: '',
                                amount: '',
                                percentage: '',
                                earnings: '',
                            }
                            obj.addr = _accounts.easyAccount(null, 2, 4, v.from) 
                            obj.accounts = v.from
                            obj.amount = this.vuex_web3.utils.fromWei(v.amount + '', 'ether')
                            obj.percentage = v.percent * 100
                            obj.earnings = obj.amount * v.percent
                            this.detailsListNode.push(obj)
                        })
                    }
                    // 加载状态结束
                    this.loading3 = false;
                    this.finished3 = true;
                })
                
            },

            // 获取团队数额数据
            async getTeamAmount() {
                await this.vuex_myContract.contrart_BuyStaker.methods.getTeamRewardAmount(this.address).call().then(res => {
                    console.log("团队明细 ==>", res)
                    this.teamNumber = res['0']
                    this.teamTotal = res['1'] == 0 ? 0 : this.vuex_web3.utils.fromWei(res['1'] + '', 'ether')
                    console.log(this.teamTotal)
                })
            },
            // 计算记录
            computeRecord(data ,obj, addr, ratio, index) {
                obj.addr = addr
                obj.earnings = Number(this.vuex_web3.utils.fromWei(data['1'][index], 'ether')).toFixed(2)
                obj.proportion = ratio
                obj.amount = (Number(this.vuex_web3.utils.fromWei(data['1'][index], 'ether')) * (ratio / 100)).toFixed(2)
            },
            // 日期改变
            async calendarChange() {
                let timer = new Date(this.currentDate)
                this.myDate = _date.getYMD(timer)
                this.isCalendar = false
                let tim = new Date(timer).getTime() / 1000 + 28800
                console.log("tim ==>", tim)
                // 初始化
                this.active2 = 1
                this.detailsList = []
                this.detailsListTeam = []
                this.offset1 = 0
                this.offset2 = 0
                this.tim = tim
                this.showLoading = true
                await this.getUserTotalRewardData()
                await this.getDetails()
                await this.getTeamDetails()
                // await this.getTeamAmount()
                this.showLoading = false
            },
            // 日期改变 node
            async calendarChange2() {
                let timer = new Date(this.currentDate2)
                this.myDate2 = _date.getYMD(timer)
                this.isCalendar = false
                let tim = new Date(timer).getTime() / 1000 + 28800
                console.log("tim ==>", tim)
                // 初始化
                this.detailsListNode = []
                this.tim2 = tim
                this.showLoading = true
                await this.getStarData()
                await this.getNodeDetails()
                this.showLoading = false
            },
            // 打开问号弹窗
            showQueryBox(value) {
                if (value == 1) {
                    this.queryTitle = 'Selfbenefiting'
                    this.queryContent = 'SelfContent'
                } else if (value == 2) {
                    this.queryTitle = 'TeamBenefits'
                    this.queryContent = 'TeamContent'
                } else if (value == 3) {
                    this.queryTitle = 'ExchangeEsg'
                    this.queryContent = 'ExchangeEsgContent'
                }
                this.showQuery = true
            },
            getContainer() {
                return document.querySelector('.top_box')
            },
            getCalendar() {
                return document.querySelector('.team')
            },
            getCalendar2() {
                return document.querySelector('.node_box');
            },
            statusSelect(item) {
                this.Status = item.value
                if (this.Status == 'Status1') {
                    this.listData = this.allData
                } else if (this.Status == "Status2") {
                    let arr = this.allDataIng.filter((v) => {
                        return v.status == 'jinxingzhong' || v.status == 'team'
                    })
                    this.listData = arr
                } else if (this.Status == "Status3") {
                    this.listData = this.allDataMaichu
                } else if (this.Status == "Status4") {
                    this.listData = this.allDataQuchu
                }
            },
            toDetails (type) {
                this.$router.push({path: '/SingleDetails', query: {type}})
            },
            // 步进器改变
            stepChange(value) {
                if (value >= 6) {
                    this.value = 6
                } else if(value == ''){
                    this.value = 0
                } else if (value <= 6) {
                    this.value = value
                }
            },
            // 滑块
            sliderChange(value) {
                this.valueBai = value
            },
            // prev
            handlePrev() {
                this.valueBai--;
                if (this.valueBai <= 0) {
                    this.valueBai = 0
                    this.value = this.valueBai
                } else if (this.valueBai <= 6) {
                    this.value = this.valueBai
                }
            },

            // next
            handleNext() {
                this.valueBai++;
                if (this.valueBai >= 100) {
                    this.valueBai = 100
                } else if (this.valueBai >= 6) {
                    this.value = 6
                } else if (this.valueBai <= 6) {
                    this.value = this.valueBai
                }
            },

            // 输入百分比
            valueBaichange() {
                if (this.valueBai >= 100) {
                    this.valueBai = 100
                } else if (this.valueBai <= 0) {
                    this.valueBai = 0
                } else if (this.valueBai == '') {
                    this.valueBai = 0
                }
            },

            // 获取是否有权限开启星链
            async getPermission() {
                await this.vuex_myContract.contrart_StarChian.methods.IsWhiteList(this.address).call().then(res => {
                    if (res) {
                        this.isWhite = true
                    } else {
                        this.isWhite = false
                    }
                })
            },

            async beforeTabsChange(index) {
                if (index == 5) {
                    if (!this.isWhite) {
                        Toast({ message: this.i18n.EsgExchange.NoPermission, icon: 'fail' });
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            },
            // tabs
            tabsChange(index) {
                console.log(index)
                this.chooseItem = {}
                if (index == 1) {
                    this.isImg = true
                    this.value1 = 0
                    this.value2 = ""
                } else if (index == 2) {
                    this.isImg = false
                    this.value1 = ''
                    this.value2 = 0
                } else if (index == 4) {
                    this.getDetails()
                    this.getTeamDetails()
                } 
            },

            // 是否打开选择持仓
            showChoose() {
                if (!this.isImg) {
                    if (this.actions.length == 0) {
                        Toast({ message: this.i18n.EsgExchange.PositioningNo, icon: 'fail' })
                    } else {
                        this.showHold = true
                    }
                } 
            },

            // 切换交互
            changeImg() {
                this.isImg = !this.isImg
                this.chooseItem = {}
                if (this.isImg) {
                    this.currentSpa = "Exchange"
                    // USDT - ESG
                    this.value1 = 100
                    this.value2 = _float.mul(this.value1, this.ratioUsdtEsg) 
                    // let addressArr = ["0x55d398326f99059fF775485246999027B3197955", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622"]
                    // this.getAmountsRatio(2, _float.mul(this.value1, Math.pow(10, 18)) + '', addressArr)
                } else {
                    this.currentSpa = "OutPosition"
                    this.value1 = 0
                    this.value2 = 0
                }
            },

            // 获取余额
            getBalance() {
                this.vuex_myContract.contrart_USDT.methods.balanceOf(this.address).call().then(res => {
                    console.log(res)
                    if (res != 0) {
                        this.USDTbalance = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
                    }
                })
                this.vuex_myContract.contrart_Key.methods.balanceOf(this.address).call().then(res => {
                    console.log(res)
                    if (res != 0) {
                        this.KEYbanlace = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
                    }
                })
                // this.vuex_myContract.contrart_NowTokens.methods.balanceOf(this.address).call().then(res => {
                //     console.log(res)
                //     if (res != 0) {
                //         this.ESGbalance = Number(this.vuex_web3.utils.fromWei(res, 'ether')).toFixed(4)
                //     }
                // })
            },

            // 获取所有数据
            async getAllBuyData() {
                // 参数
                let data = {
                    Addr: this.address,
                    Desc: true
                }
                await GetHistoryBuyEsg({...data}).then(res => {
                    console.log(res)
                    if (res.code == 0) {
                        let data = res.data.records
                        data.forEach(v => {
                            if (v.status == "yimaichu") {
                                let obj = {
                                    EsgAmount: '',
                                    UsdtAmount: '',  
                                    Ts: '', 
                                    RewardAmount: '',
                                    status: 'yimaichu'
                                }
                                obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(v.esg_amount, "ether")).toFixed(4)
                                obj.UsdtAmount = Number(this.vuex_web3.utils.fromWei(v.usdt_amount, "ether")).toFixed(4)
                                obj.Ts = _date.getMDHM(v.ts * 1000)
                                obj.RewardAmount = v.reward == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(v.reward, "ether")).toFixed(4)
                                this.allDataMaichu.push(obj)
                            }  else if (v.status == 'yiquchu') {
                                let obj = {
                                    EsgAmount: '',
                                    UsdtAmount: '',  
                                    Ts: '', 
                                    RewardAmount: '',
                                    status: 'yiquchu'
                                }
                                obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(v.esg_amount, "ether")).toFixed(4)
                                obj.UsdtAmount = Number(this.vuex_web3.utils.fromWei(v.usdt_amount, "ether")).toFixed(4)
                                obj.Ts = _date.getMDHM(v.ts * 1000)
                                obj.RewardAmount = v.reward == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(v.reward, "ether")).toFixed(4)
                                this.allDataQuchu.push(obj)
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
                this.allData = this.allDataIng
                this.allDataMaichu.forEach(v => {
                    this.allData.push(v)
                })
                this.allDataQuchu.forEach(v => {
                    this.allData.push(v)
                })
                // this.allData = [...this.allDataIng, ...this.allDataMaichu, ...this.allDataQuchu]
                this.listData = this.allData
                console.log("this.allData ==>", this.allData)
                
            },

            // 获取汇率
            async getRatio() {
                // this.showLoading = true
                await this.vuex_myContract.contrart_BnbUsdt.methods.getReserves().call().then(res => {
                    let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
                    let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
                    this.ratioA = _tools.formatDecimal(ratioA / ratioB, 4)
                    // console.log(this.ratioA)
                })
                await this.vuex_myContract.contrart_BnbEsg.methods.getReserves().call().then(res => {
                    let ratioA =  Number(this.vuex_web3.utils.fromWei(res._reserve0, 'ether')).toFixed(4)
                    let ratioB =  Number(this.vuex_web3.utils.fromWei(res._reserve1, 'ether')).toFixed(4)
                    this.ratioB = _tools.formatDecimal(ratioA / ratioB, 4)
                    // console.log(this.ratioB)
                })

                this.ratioUsdtEsg = _tools.formatDecimal(this.ratioA * this.ratioB, 9)
                console.log(this.ratioUsdtEsg)
                // this.showLoading = false
            },

            // 刷新汇率
            async resetRatio() {
                this.showLoading = true
                await this.getRatio()
                if (this.isImg) {
                    // this.value2 = _float.mul(this.value1, this.ratioUsdtEsg) 
                    this.value1 = 0
                    this.value2 = ""
                } else {
                    this.value2 = _float.mul(this.ratioUsdtEsg, this.value1) 
                }
                this.showLoading = false
            },

            // 输入esg
            esgInp() {
                if (this.isImg) {
                    // if (this.value1 < 100) {
                    //     this.value1 = 100
                    //     Toast({ message: this.i18n.EsgExchange.EsgMin, icon: 'fail' })
                    // } else {
                        this.value2 = _float.mul(this.value1, this.ratioUsdtEsg).toFixed(4)
                    // }
                    // let addressArr = ["0x55d398326f99059fF775485246999027B3197955", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622"]
                    // this.getAmountsRatio(2, _float.mul(this.value1, Math.pow(10, 18)) + '', addressArr)
                }
            },

            // 输入USDT
            usdtInp() {
                if (this.isImg) {
                    this.value1 =  (this.value2 / this.ratioUsdtEsg).toFixed(4)
                    // if (this.value1 < 100) {
                    //     this.value1 = 100
                    //     this.value2 = _float.mul(this.value1, this.ratioUsdtEsg) 
                    //     Toast({ message: this.i18n.EsgExchange.EsgMin, icon: 'fail' })
                    // }
                    // let addressArr = ["0x55d398326f99059fF775485246999027B3197955", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622"]
                    // this.getAmountsRatio(2, _float.mul(this.value1, Math.pow(10, 18)) + '', addressArr)
                }
            },

            // 计算滑块百分比
            async getAmountsRatio(type, amount, addressArr) {
                if (type == 1) {
                    await this.vuex_myContract.contrart_TpRuter.methods.getAmountsOut(amount, addressArr).call().then(res => {
                        console.log('Out ==>', res)
                        let data = Number(this.vuex_web3.utils.fromWei(res[2], 'ether'))
                        if (data > Number(this.value2)) {
                            this.value = 1
                        } else {
                            this.value = (Number(this.value2) - Number(data)) / Number(this.value2) < 1 ? 1 : Math.ceil((Number(this.value2) - Number(data)) / Number(this.value2) * 100) / 100
                        }
                    })
                } else {
                    await this.vuex_myContract.contrart_TpRuter.methods.getAmountsIn(amount, addressArr).call().then(res => {
                        console.log('In ==>', res)
                        let data = Number(this.vuex_web3.utils.fromWei(res[0], 'ether'))
                        if (data < Number(this.value1)) {
                            this.value = 1
                        } else {
                            this.value = (Number(data) - Number(this.value1)) / Number(this.value1) < 1 ? 1 : Math.ceil(Number(data) - (Number(this.value1)) / Number(this.value1) * 100) / 100
                        }
                    })
                }
            },

            async onSelect(item) {
                this.showLoading = true
                this.showHold = false
                await this.getRatio()
                if (item.type == 0) {
                    // 团队持仓
                    await this.vuex_myContract.contrart_BuyStaker.methods.TeamOf(this.address).call().then(async res => {
                        console.log('团队仓单 ==>', res)
                        if (res.EsgAmount != 0) {
                            let obj = {
                                Idx: 0, 
                                EsgAmount: '',
                                type: "team", 
                            }
                            obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(res.EsgAmount, "ether")).toFixed(4)
                            this.chooseItem = obj
                        }
                    })
                } else {
                    console.log(item.value)
                    await this.vuex_myContract.contrart_BuyStaker.methods.QueryBuyRecord(this.address, item.value, 1).call().then(res => {
                        if (res.length != 0) {
                            let data = res[0]
                            console.log(data)
                            let obj = {
                                Idx: item.value,
                                EsgAmount: '',
                                type: 'other',
                            }
                            obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(data.EsgAmount, "ether"))
                            this.chooseItem = obj
                        }
                    })
                }
                this.value1 = this.chooseItem.EsgAmount
                this.value2 = _float.mul(this.ratioUsdtEsg, this.value1)
                // let addressArr = ["0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x55d398326f99059fF775485246999027B3197955"]
                // this.getAmountsRatio(1, _float.mul(this.value1, Math.pow(10, 18)) + '', addressArr)
                console.log("this.chooseItem ==>", this.chooseItem)
                this.showLoading = false
            },

            // 获取持仓数量
            async getNumsHold() {
                // 获取数量
                let nums = 0
                await this.vuex_myContract.contrart_BuyStaker.methods.BuyLength(this.address).call().then(res => {
                    nums = res
                })
                for (let i = 0; i < nums; i++) {
                    this.actions.push({ name: `持仓${ i }`, value: i})
                }
            },

            // 获取持仓列表
            async getHoldList() {
                // this.showLoading = true
                this.listData = []
                this.allData = []
                this.allDataIng = []
                this.allDataMaichu = []
                this.allDataQuchu = []
                this.actions = []
                this.ESGbalance = 0
                this.chooseItem = {}
                
                // 获取数量
                let nums = 0
                await this.vuex_myContract.contrart_BuyStaker.methods.BuyLength(this.address).call().then(res => {
                    nums = res
                    if (res == 0) {
                        this.finished = true;
                    }
                })

                // if (this.finished) return

                // let oft = this.offset * 10
                // if (oft >= nums) {
                //     this.finished = true;
                //     return
                // }
                this.actions = []
                // 查询团队
                await this.vuex_myContract.contrart_BuyStaker.methods.TeamOf(this.address).call().then(async res => {
                    console.log("team ==>", res)
                    if (res.EsgAmount != 0) {
                        console.log('团队仓单 ==>', res)
                        let obj = {
                            EsgAmount: '',
                            UsdtAmount: '',  
                            Ts: '', 
                            Idx: 0, 
                            RewardAmount: '',
                            RewardAmounted: '', // 未领取收益
                            ReleasepProceeds: '', // 待释放收益
                            status: "team", 
                        }
                        obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(res.EsgAmount, "ether")).toFixed(4)
                        obj.UsdtAmount = Number(this.vuex_web3.utils.fromWei(res.UsdtAmount, "ether")).toFixed(4)
                        obj.Ts = _date.getMDHM(res.BuyTs * 1000)
                        obj.RewardAmount = res.RewardAmount == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res.RewardAmount, "ether")).toFixed(4)
                        this.ESGbalance = Number(obj.EsgAmount) + Number(this.ESGbalance)
                        
                        await this.vuex_myContract.contrart_BuyStaker.methods.GetTeamRewardOfRelease(this.address).call().then(res => {
                            console.log("团队未领取收益 ==>", res)
                            obj.RewardAmounted = res['0'] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res['0'], "ether")).toFixed(4)
                        }).catch(err => {
                            console.log("err1 ==>", err)
                        })
                        await GetUserPendingRelease({addr: this.vuex_web3.utils.toChecksumAddress(this.address)}).then(res => {
                            console.log("团队待释放收益 ==>", res)
                            if (res.code == 0) {
                                this.$nextTick(() => {
                                    obj.ReleasepProceeds = res.data == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(parseInt(res.data) + '', "ether")).toFixed(4)
                                })
                            }
                        }).catch(err => {
                            console.log("err2 ==>",err)
                        })
                        this.actions.push({ name: `团队仓单`, value: 0, type: 0})
                        this.allDataIng.push(obj)
                        // await this.vuex_myContract.contrart_BuyStaker.methods.TeamRewardLeft(this.address).call().then(res => {
                        //     console.log("团队待释放收益 ==>", res)
                        //     this.$nextTick(() => {
                        //         obj.ReleasepProceeds = res['0'] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res['0'], "ether")).toFixed(4)
                        //     })
                        // }).catch(err => {
                        //     console.log("err2 ==>",err)
                        // })
                    }
                })

                if (nums == 0) return

                await this.vuex_myContract.contrart_BuyStaker.methods.QueryBuyRecord(this.address, 0, nums).call().then(async res => {
                    let data = res
                    // if (data.length == 0) {
                    //     this.finished = true;
                    // } else {
                        let arr = []
                        await Promise.all(data.map(async (v, i) => {
                            let obj = {
                                EsgAmount: '',
                                UsdtAmount: '',  
                                Ts: '', 
                                Idx: '', 
                                RewardAmount: '',
                                RewardAmounted: 0, // 未领取收益
                                status: "jinxingzhong", 
                                // RAratio: '',
                                // RADratio: '', // 未领取收益百分比
                            }
                            obj.EsgAmount = Number(this.vuex_web3.utils.fromWei(v.EsgAmount, "ether")).toFixed(4)
                            obj.UsdtAmount = Number(this.vuex_web3.utils.fromWei(v.UsdtAmount, "ether")).toFixed(4)
                            obj.Ts = _date.getMDHM(v.BuyTs * 1000)
                            // idx 索引
                            let index = Number(this.allDataIng.length) == 0 ? 0 : Number(this.allDataIng.length) - 1
                            obj.Idx = i + index
                            obj.RewardAmount = v.RewardAmount == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(v.RewardAmount, "ether")).toFixed(4)
                            this.ESGbalance = Number(obj.EsgAmount) + Number(this.ESGbalance)
                            
                            await this.vuex_myContract.contrart_BuyStaker.methods.RewardLeft(this.address, obj.Idx, false).call().then(res => {
                                console.log("未领取收益 ==>", res)
                                obj.RewardAmounted = res['0'] == 0 ? 0 : Number(this.vuex_web3.utils.fromWei(res['0'], "ether")).toFixed(4)
                            }).catch(err => {
                                console.log("err3 ==>", err)
                            })
                            arr.push(obj)
                            // obj.RAratio = Number(obj.RewardAmount / obj.UsdtAmount * 100).toFixed(0) == 0 ? 0 : Number(obj.RewardAmount / obj.UsdtAmount * 100).toFixed(2)
                            // obj.RADratio = Number(obj.RewardAmounted / obj.UsdtAmount * 100).toFixed(0) == 0 ? 0 : Number(obj.RewardAmounted / obj.UsdtAmount * 100).toFixed(2)
                        }))
                        arr.sort(this.objectSort("Idx"))
                        arr.forEach(v => {
                            // this.listData.push(v)
                            this.allDataIng.push(v)
                        })
                        // console.log("arr ==>", arr)
                        console.log("this.allDataIng ==>", this.allDataIng)
                        // 加载状态结束
                        // this.loading = false;
                    // }
                }).catch(err => {
                    console.log(err)
                })

                // this.showLoading = false

                
            },
            objectSort(property) {
                return function (Obj1,Obj2) {
                        return Obj1[property]-Obj2[property]
                }
            },

            // 领取收益
            async getEarnings(item, type = 1) {
                if (item.RewardAmounted == 0) {
                    Toast({ message: this.i18n.EsgExchange.RewardAmounNo, icon: 'fail' });
                    return
                }
                this.showLoading = true
                let params = []
                if (type == 1) {
                    params = {
                        name: 'GetReward', // 方法名
                        inputs: [{
                            "name": "idx",
                            "type": "uint256"
                        }],
                        arguments: [item.Idx], // 参数
                    }
                } else {
                    // 领取团队收益
                    params = {
                        name: 'GetTeamReard', // 方法名
                        inputs: [],
                        arguments: [], // 参数
                    }
                }
                
                await contractMethods(this.address, Eth.contract.contrart_BuyStaker.addr, params).then(async res => {
                    if (res.code == 101) {
                        Toast({ message: this.i18n.EsgExchange.GetSuc, icon: 'success' });
                        // this.reload()
                        await this.getHoldList()
                        await this.getAllBuyData()
                        await this.getReferrer(this.address)
                        this.showLoading = false
                        this.getRatio()
                        this.getBalance()
                        this.getNumsHold()
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
                this.showLoading = false
            },

            // 滑块
            onChange(value) {
                console.log(value)
            },

            // 授权 - USDT
            async approved() {
                return new Promise(async (resolve, reject) => {

                    // 查询授权
                    let isApproved = false
                    await this.vuex_myContract.contrart_USDT.methods.allowance(this.address, Eth.contract.contrart_BuyStaker.addr).call().then(res => {
                        console.log("approve ==>", res)
                        let data = _float.div(res, Math.pow(10, 18))
                        if (data >= this.value1) {
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
                            Eth.contract.contrart_BuyStaker.addr,
                            '10000000000000000000000000000000'
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_USDT.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                            resolve()
                        }
                    }).catch(err => {
                        reject()
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

                })
            },
            // 授权 - Key
            async approvedKey() {
                return new Promise(async (resolve, reject) => {

                    // 查询授权
                    let isApproved = false
                    await this.vuex_myContract.contrart_Key.methods.allowance(this.address, Eth.contract.contrart_BuyStaker.addr).call().then(res => {
                        console.log("approve ==>", res)
                        let data = _float.div(res, Math.pow(10, 18))
                        if (data >= this.value1) {
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
                            Eth.contract.contrart_BuyStaker.addr,
                            '10000000000000000000000000000000'
                        ] // 参数
                    }

                    // 发起授权
                    await contractMethods(this.address, Eth.contract.contrart_Key.addr, data).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: this.i18n.Home.ApprovalSuccess, icon: 'success' });
                            resolve()
                        }
                    }).catch(err => {
                        reject()
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

                })
            },

            // 判断本人地址是否有推荐人 / 是否是合法推荐人地址
            async getReferrer(accounts) {
                // 查询推荐人
                let addr = ''
                await this.vuex_myContract.contrart_BuyStaker.methods.RecommendOf(accounts).call().then(res => {
                    if (res == '0x0000000000000000000000000000000000000000') {
                        // 无推荐人
                        this.isReferrer = false
                    } else {
                        this.isReferrer = true
                        this.inviteAddr = res
                        addr = res
                    }
                })
            },

            // 判断该地址是否有推荐人 / 是否是合法推荐人地址
            async getReferrerRule(accounts) {
                // 查询推荐人
                await this.vuex_myContract.contrart_BuyStaker.methods.RecommendOf(accounts).call().then(res => {
                    if (res == '0x0000000000000000000000000000000000000000') {
                        // 无推荐人
                        this.isReferrer = false
                    } else {
                        this.isReferrer = true
                    }
                })
            },

            // 打开邀请人弹窗
            openInvite() {
                if (!this.isReferrer && this.isImg) {
                    // 无推荐人则填写推荐人
                    this.showInp = true;
                } else {
                    // 已有推荐人 直接发起购买
                    this.Exchange()
                }
            },

            // 验证邀请人
            async addrRule() {
                if (!this.inviteAddr) return Toast({ message: this.i18n.BlindBox.InviterPlc, icon: 'fail' });
                
                // 验证以太坊地址合法性
                let isAddr = await this.vuex_web3.utils.isAddress(this.inviteAddr)

                await this.getReferrerRule(this.inviteAddr)

                if (!this.isReferrer) {
                    Toast({ message: this.i18n.EsgExchange.isReferrerAddr, icon: 'fail' });
                    return
                }

                // return
                if (!isAddr) {
                    return Toast({ message: this.i18n.BlindBox.ruleAddr, icon: 'fail' });
                } else {
                    this.showInp = false;
                    this.Exchange()
                }
            },
            // 交换 
            async Exchange() {
                if (this.isImg) {
                    // 添加 USDT - ESG
                    if (this.USDTbalance == 0) {
                        Toast({ message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' })
                        return
                    }

                    if (Number(this.USDTbalance) < Number(this.value2)) {
                        Toast({ message: "USDT" + this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' })
                        return
                    }

                    if (this.KEYbanlace == 0) {
                        Toast({ message: "KEY" + this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' })
                        return
                    }

                    if (Number(this.KEYbanlace) < Number(this.value2)) {
                        Toast({ message: "KEY" + this.i18n.BlindBox.ruleBalanceNot, icon: 'fail' })
                        return
                    }

                    this.showLoading = true
                    let isUsdt = false
                    // 验证授权 usdt
                    await this.approved().then(async (res) => {
                        isUsdt = true
                    }).catch(err => {
                        Toast({ message: "USDT" + this.i18n.Home.ApprovalFail, icon: 'fail' });
                        this.showLoading = false
                        isUsdt = false
                    })

                    if (!isUsdt) return

                    // 验证授权 key
                    await this.approvedKey().then(async (res) => {
                        setTimeout(async () => {
                            // 参数
                            let esgNum = this.vuex_web3.utils.toWei(this.value1 + '', 'ether')
                            // let usdtNum = this.vuex_web3.utils.toWei(Number(this.value2) + this.value2 * (this.valueBai / 100) + '', 'ether')
                            let usdtNum = this.vuex_web3.utils.toWei(this.value2 + '', 'ether')
                            let addrArr = [Eth.contract.contrart_USDT.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_ESG.addr]
                            let timer = parseInt(new Date().getTime() / 1000) + 1200 + ''
                            console.log(esgNum, usdtNum, addrArr, timer)
                            // return
                            let params = {
                                name: 'swapTokensForExactTokens', // 方法名
                                inputs: [{
                                    "name": "amountOut",
                                    "type": "uint256"
                                },{
                                    "name": "amountInMax",
                                    "type": "uint256"
                                },{
                                    "name": "path",
                                    "type": "address[]"
                                },{
                                    "name": "to",
                                    "type": "address"
                                },{
                                    "name": "deadline",
                                    "type": "uint256"
                                },{
                                    "name": "_recommend",
                                    "type": "address"
                                }],
                                arguments: [esgNum, usdtNum, addrArr, this.address, timer, this.inviteAddr], // 参数
                            }
                            
                            await contractMethods(this.address, Eth.contract.contrart_BuyStaker.addr, params).then(async res => {
                                if (res.code == 101) {
                                    Toast({ message: this.i18n.EsgExchange.ExchangeSuc, icon: 'success' });    
                                    this.value1 = 0
                                    this.value2 = ''
                                    this.showInp = false
                                    setTimeout(() => {
                                        this.reload()
                                    }, 2000);
                                    // await setTimeout(async () => {
                                    //     await this.getHoldList()
                                    //     await this.getAllBuyData()
                                    //     await this.getReferrer(this.address)
                                    // }, 1000);
                                    // this.showLoading = false
                                    // this.getRatio()
                                    // this.getBalance()
                                    // this.getNumsHold()
                                }
                            }).catch(err => {
                                console.log('失败 ==>', err.message)
                                this.showLoading = false
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
                        }, 2000);
                    }).catch(err => {
                        Toast({ message: "KEY" + this.i18n.Home.ApprovalFail, icon: 'fail' });
                        this.showLoading = false
                    })


                } else {
                    if (this.chooseItem.Idx == undefined) {
                        Toast({ message: this.i18n.EsgExchange.ChooseNull, icon: 'fail' });
                        return
                    }

                    let isTeam = false
                    if (this.chooseItem.type == 'team') {
                        isTeam = true
                    } else {
                        isTeam = false
                    }

                    // 移仓
                    this.showLoading = true
                    // 参数
                    let idx = this.chooseItem.Idx
                    let usdtNum = this.vuex_web3.utils.toWei(Number(this.value2) - Number(this.value2) * (Number(this.valueBai) / 100) + '', 'ether') 
                    // Number(_float.mul(this.value2, Math.pow(10, 18))) - Number(_float.mul(this.value2, Math.pow(10, 18))) * (Number(this.valueBai) / 100) + ''
                    let addrArr = [Eth.contract.contrart_ESG.addr, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", Eth.contract.contrart_USDT.addr]
                    let timer = parseInt(new Date().getTime() / 1000) + 1200 + ''
                    console.log(idx, usdtNum, addrArr, timer, isTeam)

                    let params = {
                        name: 'swapExactTokensForTokens', // 方法名
                        inputs: [{
                            "name": "idx",
                            "type": "uint256"
                        },{
                            "name": "amountOutMin",
                            "type": "uint256"
                        },{
                            "name": "path",
                            "type": "address[]"
                        },{
                            "name": "to",
                            "type": "address"
                        },{
                            "name": "deadline",
                            "type": "uint256"
                        },{
                            "name": "_team",
                            "type": "bool"
                        }],
                        arguments: [idx, usdtNum, addrArr, this.address, timer, isTeam], // 参数
                    }

                    await contractMethods(this.address, Eth.contract.contrart_BuyStaker.addr, params).then(async res => {
                        if (res.code == 101) {
                            Toast({ message: this.i18n.EsgExchange.RemoveSuc, icon: 'success' });    
                            // this.reload()
                            this.value1 = ''
                            this.value2 = 0
                            setTimeout(async () => {
                                await this.getHoldList()
                                await this.getAllBuyData()
                                await this.getReferrer(this.address)
                                this.showLoading = false
                                this.getRatio()
                                this.getBalance()
                                this.getNumsHold()
                            }, 2000);
                        }
                    }).catch(err => {
                        console.log('失败 ==>', err)
                        this.showLoading = false
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
                }

                
            }
        }
    }
</script>

<style lang="scss" scoped>
    .EsgExchange_wrap {
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        // background: url(../assets/img/other_bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 88px 0 0 0;
        box-sizing: border-box;

        /deep/ .van-action-sheet {
            *{
                background-color: transparent;
                color: #fff;
                font-size: 34px;
            }
            max-height: 50%;
            margin-bottom: -40px;
            overflow: scroll;
            padding: 50px 30px;
            box-sizing: border-box;
            // background: url(../assets/img/income_m_c.png) no-repeat;
            // background-size: 100% 100%;
            background-color: #333333 !important;
            .van-action-sheet__item {
                height: 70px;
                background: url(../assets/img/b_s_r.png) no-repeat;
                background-size: 100% 100%;
                margin-bottom: 30px;
                &:last-child {
                    margin: 0;
                }
            }
            .van-icon-cross:before {
                content: "";
                display: block;
                width: 44px;
                height: 44px;
                background: url(../assets/img/cha.png) no-repeat;
                background-size: 100% 100%;
                margin-right: 50px;
                margin-top: 30px;
            }
            .van-action-sheet__content {
                text-align: center;
                padding: 40px 0;
                .item_actions {
                    padding: 20px 0px;
                    .team_span {
                        img {
                            width: 36px;
                        }
                    }
                    &::after {
                        content: '';
                        display: block;
                        margin-top: 20px;
                        width: 100%;
                        height: 1px;
                        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #707070 51%, rgba(128, 128, 128, 0) 100%);
                    }
                }
                span {
                    color: #F69C15;
                    font-size: 30px;
                    margin-right: 66px;
                }
            }
        }

        .EsgExchange_tab {
            padding: 50px 38px;
            width: 100%;
            height: 100%;
            // background-color: rgba(0, 0, 0, .8);
            // min-height: 1054px;
            box-sizing: border-box;
            .top_box {
                width: 100%;
                height: 65px;
                padding-bottom: 44px;
                >span {
                    font-size: 28px;
                    color: #F69C15;
                    i {
                        margin-left: 18px;
                    }
                }
                /deep/ .van-dropdown-menu {
                    *{
                        background-color: rgba(0, 0, 0, .4);
                        color: #F69C15;
                        border: none;
                    }
                    .van-dropdown-menu__title::after {
                        color: #F69C15;
                        border-color: transparent transparent #F69C15 #F69C15;
                        opacity: 1;
                    }
                    .van-cell::after {
                        display: none;
                    }
                    .van-cell__title {
                        text-align: center;
                        margin-top: 40px;
                        span {
                            font-size: 30px;
                        }
                    }
                }
                /deep/ .van-popup {
                    * {
                        background-color: transparent;
                    }
                    .van-popover__content {
                        border-radius: 16px;
                        border: 1px solid #F69C15;
                        background-color: rgba(0, 0, 0, .8);
                    }
                    .van-popover__arrow {
                        border-bottom-color: #F69C15;
                        border-width: 10px;
                    }
                    .van-popover__action-text {
                        color: #fff;
                        font-size: 28px;
                        border-bottom: 1px solid rgba(53, 53, 54, .2);
                    }
                }

                /deep/ .van-tabs {
                    *{
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
                        color: #AAAAAA;
                        margin-right: 28px;
                        font-size: 34px;
                        padding: 0;
                    }
                    .van-tab--active {
                        color: #fff;
                        font-weight: bold;
                    }
                }
            }

            .listloading_box {
                width: 100%;
                height: calc(100% - 100px);
                // background: url(../assets/img/u_box.png) no-repeat;
                // background-size: 100% 100%;
                // padding: 20px;
                box-sizing: border-box;
                overflow-y: scroll;
                overflow-x: hidden;
            }
        }

        .list_box {
            padding: 30px 40px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            margin-bottom: 30px;
            
            .list_title {
                font-weight: bold;
                margin-bottom: 30px;
                line-height: 30px;
                .team_span {
                    // display: flex;
                    // align-items: center;
                    position: relative;
                    .team_text {
                        width: 33%;
                        span {
                            color: #E9A03D;
                            font-size: 30px;
                            margin-right: 20px;
                        }
                        img {
                            width: 36px;
                        }
                    }
                    .releasepProceeds_box {
                        // width: 33%;
                        width: calc(100% - 33%);
                        // position: absolute;
                        // left: 35%;
                        line-height: 30px;
                        font {
                            font-size: 22px;
                            color: #999999;
                            // margin-left: 38px;
                            font-weight: normal;
                        }
                        p{
                            display: inline-block;
                            font-size: 26px;
                            color: #F69C15;
                            margin-left: 20px;
                        }
                    }
                }
                p {
                    font-size: 30px;
                }
                span {
                    font-size: 26px;
                }
            }
            .list_data {
                // display: flex;
                // justify-content: space-between;
                width: 100%;
                overflow: hidden;
                line-height: 24px;
                padding-bottom: 30px;
                border-bottom: 1px solid rgba(112, 112, 112, .3);
                >p {
                    font-size: 35px;
                    color: #FC9203;
                    font-weight: 600;
                    margin-right: 20px;
                }
                .data_box {
                    float: left;
                    // margin-right: 20px;
                    width: 33%;
                    p {
                        font-size: 22px;
                        color: #999999;
                        margin-bottom: 12px;
                    }
                    font {
                        color: #fff;
                        font-size: 28px;
                    }
                }
            }
            .list_earnings {
                // display: flex;
                // justify-content: space-between;
                width: 100%;
                overflow: hidden;
                line-height: 24px;
                padding-top: 30px;
                // border-bottom: 1px solid rgba(112, 112, 112, .3);
                >p {
                    font-size: 35px;
                    color: #FC9203;
                    font-weight: 600;
                    margin-right: 20px;
                }
                .data_box {
                    width: 33%;
                    float: left;
                    // margin-right: 20px;
                    p {
                        font-size: 22px;
                        color: #999999;
                        margin-bottom: 12px;
                    }
                    font {
                        color: #fff;
                        font-size: 28px;
                    }
                    img {
                        width: 300px;
                        margin-top: -40px;
                    }
                }
                .commit_btn {
                    width: 160px;
                    height: 60px;
                    background: url(../assets/img/linBtn.png) no-repeat;
                    background-size: 100% 100%;
                    font-size: 26px;
                    line-height: 60px;
                    margin-top: 5px;
                    text-align: center;
                    box-sizing: border-box;
                }
            }
        }
        .list_box_team {
            border: 2px solid #E9A03D;
            position: relative;
            .tip_box {
                display: block;
                width: 100px;
                height: 90px;
                overflow: hidden;
                position: absolute;
                right: -2px;
                top: -2px;
                img {
                    width: 100px;
                    height: 90px;
                    position: absolute;
                    right: -2px;
                    top: -2px;
                }
                span {
                    width: 100%;
                    text-align: center;
                    position: absolute;
                    right: -22px;
                    top: 18px;
                    font-weight: bold;
                    font-size: 26px;
                    color: #1B1B1E;
                    transform: rotateZ(45deg);
                }
            }
        }

    }

    .exchange_box {
        padding: 40px 38px;
        background: rgba(255, 255, 255, .1);
        border-radius: 16px 16px 16px 16px;
        text-align: center;
        position: relative;
        .query_icon {
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 36px;
            color: #F69C15;
        }
        // background: url(../assets/img/u_box.png) no-repeat;
        // background-size: 100% 100%;
        .price {
            font-size: 26px;
            text-align: left;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            span {
                color: #B4B4B4;
                margin-right: 26px;
            }
            font {
                color: #B4B4B4;
                margin-right: 27px;
            }
            img {
                width: 30px;
            }
        }   
        .exchange {
            width: 100%;
            .icon_box {
                margin-top: 13px;
                img {
                    width: 56px;
                    height: 56px;
                    margin-right: 30px;
                }
                span {
                    color: #F69C15;
                    display: inline-block;
                    height: 56px;
                    line-height: 56px;
                    font-size: 30px;
                }
            }
            .key_icon {
                padding-left: 56px;
                background: url(../assets/img/key.png) no-repeat left;
                background-size: 36px 36px;
            }
            .inp_box {
                width: 100%;
                height: 110px;
                // background: url(../assets/img/nav_l_card.png) no-repeat;
                // background-size: 100% 100%;
                box-shadow: inset 0px 3px 6px 1px rgba(255, 51, 51, 0.16);
                border-radius: 8px 8px 8px 8px;
                opacity: 1;
                border: 2px solid #F69C15;
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
                .esg_icon {
                    overflow: hidden;
                    position: absolute;
                    left: 30px;
                    top: 30px;
                    img {
                        width: 56px;
                        height: 56px;
                        margin-right: 17px;
                        border-radius: 50%;
                    }
                    span {
                        color: #F69C15;
                        display: inline-block;
                        height: 56px;
                        line-height: 56px;
                        font-size: 30px;
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
                        color: #029FE5;
                        padding-right: 40px;
                        text-align: right;
                        font-size: 34px;
                    }
                    &::after {
                        display: none;
                    }
                }
                .rightinp {
                    /deep/ input {
                        padding-right: 80px;
                    }
                }
                .usdt_inp {
                    /deep/ input {
                        color: #1BA27A;
                        &::-webkit-input-placeholder {
                            color: #999999;
                            font-size: 30px;
                        }
                    }
                }
            }
        }
        >img {
            width: 45px;
            margin-top: -30px;
            margin-left: 30px;
            margin-bottom: 10px;
            float: left;

            transition: all .3s ease-in-out;
        }
        .imgS {
            transform: rotate(180deg);
            margin-bottom: 30px;
            margin-left: 30px;
            margin-top: -50px;
        }
    }
    .price_box {
        overflow: hidden;
        margin-top: 30px;
        background: rgba(255, 255, 255, .1);
        border-radius: 16px 16px 16px 16px;
        padding: 30px 40px 100px 40px;
        .chanum {
            display: flex;
            align-items: center;
            /deep/ .van-icon  {
                font-size: 40px;
                font-weight: bold;
                color: #F69C15;
            }
            /deep/ .van-icon-warning-o:before {
                color: #fff;
                content: "%";
                font-size: 26px;
            }
            /deep/ .van-cell {
                *{
                    background-color: transparent;
                    color: #fff;
                }
                width: 284px;
                margin: 0 20px;
                background-color: transparent;
                color: #fff;
                border: none;
                input {
                    text-align: center;
                    font-size: 34px;
                    width: 244px;
                    height: 70px;
                    background: rgba(255, 255, 255, .1);
                    border-radius: 8px 8px 8px 8px;
                }
                &::after {
                    display: none;
                }
            }

            span {
                font-size: 30px;
                color: #fff;
                margin-right: 30px;
            }
        }
        .cha {
            margin-top: 100px;
            width: 100%;
            /deep/ .el-slider {
                .el-slider__bar {
                    height: 8px;
                    background-color: #F69C15;
                }
                .el-slider__runway {
                    border-radius: 7px;
                    background-color: #4A4A4A;
                    height: 8px;
                    margin: 0;
                }
                .el-slider__stop {
                    width: 4px;
                    border-radius: 0;
                    background: #000;
                }
                .el-slider__button {
                    background-color: transparent;
                    border: none;
                    border-radius: 0;
                    background: url(../assets/img/slider_bar.png) no-repeat;
                    background-size: 100% 100%;
                    width: 30px;
                    margin-top: -80px;
                }
            }
        }   

    }
    // .details_box {
    //     .details_item {
    //         width: 674px;
    //         height: 274px;
    //         background-color: rgba(255, 255, 255, .1);
    //         border-radius: 16px;
    //         padding: 28px 38px 35px 38px;
    //         box-sizing: border-box;
    //         .details_top {
    //             padding-bottom: 24px;
    //             border-bottom: 1px solid rgba(112, 112, 112, .3);
    //             .calendar_box, .total_box {
    //                 width: 50%;
    //                 color: #fff;
    //                 display: flex;
    //                 align-items: center;
    //                 img {
    //                     width: 26px;
    //                     margin-right: 14px;
    //                 }
    //                 font {
    //                     color: #999999;
    //                     font-size: 22px;
    //                     margin-right: 18px;
    //                 }
    //                 span {
    //                     font-size: 28px;
    //                 }
    //             }
    //         }
    //         .earnings_box {
    //             padding-top: 24px;
    //             .earnings_team, .earnings_other {
    //                 width: 50%;
    //                 line-height: 32px;
    //                 p {
    //                     margin: 0;
    //                     font-size: 22px;
    //                     color: #999999;
    //                 }
    //                 >span {
    //                     font-size: 28px;
    //                     color: #ffffff;
    //                 }
    //                 .datile_icon {
    //                     display: flex;
    //                     align-items: center;
    //                     margin-top: 18px;
    //                     color: #F69C15;
    //                     span {
    //                         display: inline-block;
    //                         font-size: 22px;
    //                         margin-right: 7px;
    //                     }
    //                     .van-icon {
    //                         font-size: 30px;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    .team {
        margin-top: 20px;
        /deep/ .van-popup {
            &::-webkit-scrollbar {
                display: none;
            }
            height: 800px;
            .van-action-sheet__content {
                padding: 0;
            }
            .calendar_head {
                margin-bottom: 50px;
                img {
                    width: 44px;
                }
                p {
                    display: inline-block;
                    font-size: 34px;
                }
                span {
                    margin: 0;
                    font-size: 24px;
                }
            }
            .content {
                position: relative;
                .year_MD {
                    padding: 0 30px;
                    box-sizing: border-box;
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    span {
                        flex: 1;
                        text-align: right;
                        color: #999999;
                        font-size: 30px;
                        margin: 0;
                    }
                }
            }
        }
        .calendar_box {
            color: #fff;
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            margin-left: 40px;
            img {
                margin-top: -2px;
                width: 30px;
                margin-right: 14px;
            }
            span {
                font-size: 30px;
            }
            i {
                font-size: 32px;
                margin-left: 10px;
                color: #F69C15;
            }
        }
        .team_head {
            width: 674px;
            // height: 378px;
            overflow: hidden;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            padding: 28px 40px 40px;
            box-sizing: border-box;
            
            .earnings_box, .nums_box  {
                padding-top: 24px;
                .earnings_team, .earnings_other {
                    width: 50%;
                    line-height: 40px;
                    p {
                        margin: 0;
                        font-size: 22px;
                        color: #999999;
                        display: flex;
                        align-items: center;
                        i {
                            font-size: 30px;
                            color: #F59C14;
                            margin-left: 10px;
                        }
                    }
                    span {
                        font-size: 24px;
                        color: #ffffff;
                    }
                }
            }
            .nums_box {
                padding-top: 0;
            }
            .personal_gain {
                span {
                    font-size: 22px;
                    color: #999999;
                    margin-right: 30px;
                }
                font {
                    font-size: 30px;
                    color: #fff;
                }
            }
        }
    }
    .team_details {
        margin-top: 20px;
        width: 674px;
        max-height: 649px;
        background-color: rgba(255, 255, 255, .1);
        border-radius: 16px;
        padding: 30px 40px;
        box-sizing: border-box;
        .details_title {
            // display: flex;
            // align-items: center;
            margin: 0 auto;
            margin-bottom: 20px;
            img {
                margin-right: 13px;
                width: 8px;
            }
            span {
                font-size: 28px;
                font-weight: bold;
            }
            /deep/ .van-tabs__wrap {
                height: 68px;
                *{
                    background-color: transparent;
                }
                .van-tabs__nav {
                    width: 420px;
                    margin: 0 auto;
                }
                .van-tab {
                    width: 200px !important;
                }
                .van-tab--active {
                    color: #1D1D1F;
                }
                span {
                    font-weight: bold;
                }
            }

        }
        .deatails_list {
            max-height: 500px;
            overflow: scroll;
            position: relative;
            .list_title1 {
                // position: sticky;
                // top: 0px;
                display: flex;
                margin-bottom: 30px;
                span {
                    color: #999999;
                    font-size: 22px;
                    text-align: center;
                }
                & span:nth-child(1) {
                    flex: 1;
                }
                & span:nth-child(2) {
                    flex: 1;
                }
            }
            
            .list_title2, .list_data {
                // position: sticky;
                // top: 0px;
                display: flex;
                margin-bottom: 30px;
                span {
                    color: #999999;
                    font-size: 22px;
                }
                & span:nth-child(1) {
                    flex: 4;
                }
                & span:nth-child(2) {
                    flex: 3;
                }
                & span:nth-child(3) {
                    flex: 2;
                }
                & span:nth-child(4) {
                    flex: 2;
                    text-align: right;
                }
            }
            /deep/ .van-list__finished-text {
                line-height: 30px;
            }
            .list_data {
                position: static;
                margin-bottom: 20px;
                span {
                    color: #AAAAAA;
                }
            }
        }
    }
    .node_box {
        width: 100%;
        overflow: hidden;
        /deep/ .van-popup {
            &::-webkit-scrollbar {
                display: none;
            }
            height: 800px;
            .van-action-sheet__content {
                padding: 0;
            }
            .calendar_head {
                margin-bottom: 50px;
                img {
                    width: 44px;
                }
                p {
                    display: inline-block;
                    font-size: 34px;
                }
                span {
                    margin: 0;
                    font-size: 24px;
                }
            }
            .content {
                position: relative;
                .year_MD {
                    padding: 0 30px;
                    box-sizing: border-box;
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    span {
                        flex: 1;
                        text-align: right;
                        color: #999999;
                        font-size: 30px;
                        margin: 0;
                    }
                }
            }
        }
        .node_total{
            width: 674px;
            height: 288px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            padding: 34px 38px;
            box-sizing: border-box;
            .total_data {
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(112, 112, 112, .3);
                .total_left {
                    max-width: 300px;
                    line-height: 40px;
                    padding-right: 40px;
                    border-right: 1px solid rgba(112, 112, 112, .3);
                    span{
                        float: left;
                        margin-bottom: 10px;
                        font-size: 22px;
                        color: #999999;
                    }
                    p {
                        margin: 0;
                        font-size: 44px;
                        color: #fff;
                    }
                }
                .total_right {
                    height: 100px;
                    padding-left: 25px;
                    line-height: 60px;
                    display: flex;
                    align-items: center;
                    img {
                        height: 100%;
                    }
                    .right_total {
                        span{
                            float: left;
                            margin-right: 15px;
                            font-size: 22px;
                            color: #999999;
                        }
                        p {
                            margin: 0;
                            font-size: 26px;
                            color: #fff;
                        }
                    }
                }
            }
            .total_btn {
                line-height: 100px;
                span {
                    color: #999999;
                    font-size: 28px;
                    margin-right: 20px;
                }
                font {
                    font-size: 30px;
                    color: #F69C15;
                }
                .confirm_total {
                    display: inline-block;
                    width: 160px;
                    height: 60px;
                    // background: url(../assets/img/linBtn.png) no-repeat;
                    // background-size: 100% 100%;
                    background-color: #cccccc;
                    font-size: 26px;
                    line-height: 60px;
                    margin-top: 35px;
                    text-align: center;
                    box-sizing: border-box;
                }
            }

        }
        .node_detail {
            width: 674px;
            max-height: 750px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 16px;
            padding: 34px 38px;
            box-sizing: border-box;
            margin-top: 20px;
            .node_detail_title {
                line-height: 30px;
                .node_title {
                    display: flex;
                    align-items: center;
                    img {
                        width: 8px;
                        height: 22px;
                        margin-right: 15px;
                    }
                    span {
                        font-size: 28px;
                        color: #F69C15;
                    }
                }
                .calendar_box {
                    color: #fff;
                    display: flex;
                    align-items: center;
                    span {
                        font-size: 28px;
                    }
                    i {
                        font-size: 30px;
                        margin-left: 10px;
                        color: #F69C15;
                    }
                }
            }
            .node_detail_box {
                margin-top: 40px;
                .deatails_list {
                    max-height: 500px;
                    overflow: scroll;
                    position: relative;
                    
                    .list_title, .list_data {
                        // position: sticky;
                        // top: 0px;
                        display: flex;
                        margin-bottom: 30px;
                        span {
                            color: #999999;
                            font-size: 22px;
                        }
                        & span:nth-child(1) {
                            flex: 4;
                        }
                        & span:nth-child(2) {
                            flex: 3;
                        }
                        & span:nth-child(3) {
                            flex: 3;
                        }
                        & span:nth-child(4) {
                            flex: 2;
                            text-align: right;
                        }
                    }
                    /deep/ .van-list__finished-text {
                        line-height: 30px;
                    }
                    .list_data {
                        position: static;
                        margin-bottom: 20px;
                        span {
                            color: #AAAAAA;
                        }
                    }
                }
            }
        }
    }
    .query_pop {
        width: 598px;
        height: 429px;
        background: url(../assets/img/query_border.png) no-repeat;
        background-size: 100% 100%;
        padding: 48px 45px;
        box-sizing: border-box;
        position: relative;

        .close {
            width: 36px;
            height: 36px;
            position: absolute;
            top: 52px;
            right: 42px;
        }

        .pop_title {
            height: 40px;
            font-size: 36px;
            padding: 0 0 062px;
            text-align: center;
            font-weight: 600;
        }

        .pop_content {
            height: 600px;
            font-size: 26px;
            line-height: 40px;
            overflow: scroll;
            word-break: break-all;
            text-indent: 2em;
        }
    }
    .inp_pop {
        width: 662px;
        height: 668px;
        background: url(../assets/img/inp_pop.png) no-repeat;
        background-size: 100% 100%;
        padding: 74px 62px 82px;
        box-sizing: border-box;

        .inp_titile {
            height: 48px;
            font-size: 48px;
            font-weight: 600;
            color: #FC9203;
            padding: 0 0 70px;
        }

        .inp_group {
            width: 512px;
            height: 198px;
            background: url(../assets/img/inp_bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 30px 24px;
            box-sizing: border-box;

            textarea {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                font-size: 28px;
                text-align: start;
                border: none;
                outline: none;
            }
        }

        .confirm_btn {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;
            margin: 68px 0 0;
            box-sizing: border-box;
        }
    }
    .nullData {
        width: 100%;
        margin-top: 100px;
        margin-bottom: 100px;
        text-align: center;
        p {
            color: #999999;
            font-size: 24px;
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


    /deep/ .van-datetime-picker {
        background-color: transparent;
        *{
            background-color: transparent;
        }
        .van-picker-column__item {
            .van-ellipsis {
                font-size: 30px;
                color: #F69C15 !important;

            }
        }
        [class*=van-hairline]::after {
            display: none;
        }
        .van-hairline-unset--top-bottom {
            &::before {
                content: '';
                display: block;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #707070 51%, rgba(128, 128, 128, 0) 100%);
                position: relative;
                left: 0;
                top: 0%;
            }
             &::after {
                content: '';
                display: block;
                width: 100%;
                transform: none;
                height: 1px;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #707070 51%, rgba(128, 128, 128, 0) 100%);
                position: relative;
                left: 0;
                top: 100%;
                right: none;
                bottom: none;
                border: none;
            }
        }
    }
    /deep/ .van-picker__mask {
        background-image: linear-gradient(180deg,rgba(51,51,51,1),hsla(51,51,51,0)), linear-gradient(0deg,rgba(51,51,51,.9),hsla(51,51,51,0));
        background-color: transparent;
    }

    

    


</style>