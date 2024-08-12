<template>
    <div class="page">
        <t-layout>
            <head-menu :head-title="t('menu1')" />
            <t-content>
                <t-card :bordered="false" header-bordered class="main_content_one">
                    <template #header>
                        <div class="d-flex">
                            <t-select class="select_type" style="width: 90px;" v-model="selectForm.type_filter"
                                @change="changeType">
                                <t-option key="member" :label="t('menu1_details.select_person')" value="member" />
                                <t-option key="parent_asin" :label="t('menu1_details.select_asin')" value="parent_asin" />
                            </t-select>
                            <t-select v-if="selectForm.type_filter === 'member'" class="select_id" multiple :min-collapsed-num="4" 
                                style="min-width: 400px;" v-model="selectForm.user_ids" @change="userChange">
                                <t-option v-for="(item, index) in personOptions" :key="index" :label="item.real_name"
                                    :value="item.adv_manager_id" />
                            </t-select>
                            <t-cascader v-if="selectForm.type_filter === 'parent_asin'" class="select_id" v-model="selectForm.asin_ids" :options="asinOptions"
                                multiple clearable filterable  :min-collapsed-num="3"  :show-all-levels="false"  style="width:70%;"
                                :keys="{ label: 'value', value: 'value', children: 'child' }" @change="asinChange" />
                                <t-input style="width: 180px;margin-right: 10px"  v-if="selectForm.type_filter === 'parent_asin'" 
                                clearable   v-model="childAsin" placeholder="输入子asin查询父asin"></t-input>
                                <t-button class="button-primary"  v-if="selectForm.type_filter === 'parent_asin'"  @click="searchParentAsin">查询</t-button>
                        </div>
                        <div class="timeGroup">
                            <div class="timeInput">{{ selectForm.st }}-{{ selectForm.ed }}</div>

                            <t-radio-group class="radio-time" v-model="checkTime" variant="default-filled"
                                @change="onTimeChange">
                                <t-radio-button value="1">{{t('menu1_details.date_7day')}}</t-radio-button>
                                <t-radio-button value="2">{{t('menu1_details.date_30day')}}</t-radio-button>
                                <t-popup trigger="click">
                                    <t-radio-button value="3" variant="outline">{{t('menu1_details.date_custom')}}</t-radio-button>
                                    <template #content>
                                        <div class="date-picker-panel-border">
                                            <t-date-range-picker-panel :on-change="handleChange" />
                                        </div>
                                    </template>
                                </t-popup>
                            </t-radio-group>
                        </div>
                    </template>
                    <template #actions>

                    </template>

                    <div class="row main_second_block">  
                        <div v-for="(item) in costList" :key="item.index" class="col-sm-6 col-lg-3 mb-3 mb-lg-5">
                            <!-- Card -->
                            <div class="card card-hover-shadow h-100">
                                <div class="card-body">
                                    <h3 class="card-subtitle">{{ item.name }}</h3>
                                    <div class="row align-items-center gx-2 ">
                                        <div class="col-5">
                                            <h2 class="card-title text-inherit"  v-if="item.index===0||item.index===3">{{ exchangeRate(item.value,'USD') }}</h2>
                                            <h2 class="card-title text-inherit" v-else>{{ item.value }}</h2>
                                        </div>
                                        <div class="col-7">
                                            <line-chart :ad-chart="item" :shop-data-time="shop_data_time" />
                                        </div>
                                    </div>
                                    <t-divider style="margin-top: 0"></t-divider>
                                    <div class="row   align-items-center  ">
                                        <div class="col-7">
                                            <span class="card-subtitle"  v-if="item.index===0||item.index===3">{{t('menu1_details.block_t')}}：{{ exchangeRate(item.last?.value,'USD') }}</span>
                                            <span class="card-subtitle"  v-else>{{t('menu1_details.block_t')}}：{{ item.last?.value }}</span>

                                        </div>
                                        <div class="col-5">
                                            <!-- 环比： -->
                                            <span v-if="item.last && item.last.rate.indexOf('-') !== -1"
                                                class="badge bg-soft-danger text-white ms-2">
                                                <img class="line_icon" :src="WebApp.getImage('common/line-chart.png')"
                                                    alt="">
                                                {{ item.last.rate }}
                                            </span>
                                            <span v-else class="badge bg-soft-success text-white">
                                                <img class="line_icon" :src="WebApp.getImage('common/line-chart.png')"
                                                    alt="">
                                                {{ item.last.rate }}
                                            </span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <!-- End Card -->
                        </div>
                    </div>

                </t-card>
                <div class="row main_content_two" v-if="selectForm.type_filter === 'member'">
                    <div class="col-lg-6   ">
                        <div class="card h-100">
                            <!-- Header -->
                            <div class="card-header card-header-content-sm-between">
                                <h4 class="card-header-title mb-2 mb-sm-0">{{t('menu1_details.adblock_t')}}</h4>
                                <div class="tom-select-custom ">
                                    <t-select class="select_type" v-model="selectForm.data_type" style="width: 120px;">
                                        <t-option key="good" :label="t('menu1_details.select_shop')" value="good" />
                                    </t-select>
                                </div>

                            </div>
                            <!-- End Header -->
                            <!-- Body -->
                            <div class="card-body">

                                <div class="chartjs-custom" style="height: 18rem;">
                                    <ad-chart :ad-chart-list="adChartList" :shop-data-time="shop_data_time" />
                                </div>

                            </div>

                        </div>
                    </div>
                    <div class="col-lg-6  ">
                        <div class="card h-100">
                            <!-- Header -->
                            <div class="card-header card-header-content-sm-between">
                                <h4 class="card-header-title mb-2 mb-sm-0">{{t('menu1_details.stablock_t')}}</h4>
                                <div class="tom-select-custom ">
                                    <t-select class="select_type" v-model="tactic_data_type" style="width: 120px;" @change="getStrategyChartData">
                                        <t-option key="category" :label="t('menu1_details.select_shop')" value="category" />
                                        <t-option key="type" :label="t('menu1_details.select_action')" value="type" />
                                    </t-select>

                                </div>

                            </div>
                            <div class="card-body">
                                <div class="row mb-4">
                                    <div class="col-sm mb-2 mb-sm-0">
                                        <div class="d-flex align-items-center">
                                            <span class="h4 mb-0">{{t('menu1_details.stablock_t2')}}</span>
                                            <span class="text-success ms-2">
                                                25.3%
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div class="chartjs-custom" style="height: 18rem;">
                                    <tactics-chart :tactic-data-type="tactic_data_type" :strategy-chart-list="strategyChartList" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="row main_content_two" style="min-height: 450px" v-else>
                    <div class="col-lg-8">
                        <div class="card h-100">
                            <!-- Header -->
                            <div class="card-header card-header-content-sm-between">
                                <h4 class="card-header-title mb-2 mb-sm-0">{{t('menu1_details.asinblock_t')}}</h4>
                                <div class="tom-select-custom ">
                                    <t-select class="select_type" v-model="shop_data_type" style="width: 120px;">
                                        <t-option key="cust_unit_price" :label="t('menu1_details.select_price')" value="cust_unit_price" />
                                        <t-option key="pay_conversion_rate" :label="t('menu1_details.select_pay')" value="pay_conversion_rate" />
                                    </t-select>
                                </div>

                            </div>
                            <div class="card-body">
                                <div class="chartjs-custom" style="height: 18rem;">
                                    <shop-chart :shop-data-type="shop_data_type" :shop-data-time="shop_data_time"
                                        :shop-chart-list="shopChartList" />
                                </div>

                            </div>

                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card h-100">
                            <div class="card-header card-header-content-between">
                                <h4 class="card-header-title">{{t('menu1_details.saleblock_t')}} </h4>
                            </div>
                            <div class="card-body">
                                <div class="list-group list-group-flush list-group-no-gutters">
                                    <div v-for="(item, index) in shopRankList" :key="index" class="list-group-item">
                                        <div class="d-flex align-items-center">
                                            <div class="shop_rank" :class="'shop_rank' + index">
                                                {{ index + 1 }}

                                            </div>
                                            <div class="flex-shrink-0">
                                                <img class="avatar avatar-circle" :src="getCountryFlag(item.name)"
                                                    alt="Flag">
                                            </div>

                                            <div class="flex-grow-1 ms-2">
                                                <div class="row align-items-center">
                                                    <div class="col">
                                                        <span class="d-block">{{ item.name }}</span>
                                                    </div>
                                                    <!-- End Col -->

                                                    <div class="col-auto">
                                                        <h5>{{ exchangeRate(item.value, item.currency) }}
                                                        </h5>
                                                    </div>
                                                    <!-- End Col -->
                                                </div>
                                                <!-- End Row -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="main_content_three">
                    <div class="card mb-3 mb-lg-5" v-if="selectForm.type_filter === 'member'">
                        <div class="card-header">
                            <div class="card-header-back">
                                <h4 class="card-header-title">{{t('menu1_details.coreadblock_t')}}-{{t('menu1_details.coreadblock_t1')}}</h4>
                            </div>
                        </div>
                        <div class="card-content">
                            <t-tabs class="card-tab" v-model="selectForm.adv_type" @change="changeAdTab">
                                <t-tab-panel value="alarm" :label="t('menu1_details.coreadblock_tab1')">
                                </t-tab-panel>
                                <t-tab-panel value="potential" :label="t('menu1_details.coreadblock_tab2')">
                                </t-tab-panel>
                            </t-tabs>

                            <div class="row ">
                                <div class="col-lg-12 mt-3 mb-3">
                                    <t-radio-group class="radio-primary" v-if="selectForm.adv_type === 'alarm'"
                                        v-model="selectForm.adv_secondType" variant="default-filled"
                                        @change="changeAdTableData">
                                        <t-radio-button value="acosup"> {{t('menu1_details.coreadblock_btn1')}}</t-radio-button>
                                        <t-radio-button value="costup"> {{t('menu1_details.coreadblock_btn2')}}</t-radio-button>
                                        <t-radio-button value="salesdown"> {{t('menu1_details.coreadblock_btn3')}}</t-radio-button>
                                        <t-radio-button value="ordernumdown"> {{t('menu1_details.coreadblock_btn4')}}</t-radio-button>
                                        <t-radio-button value="noadv"> {{t('menu1_details.coreadblock_btn5')}}</t-radio-button>
                                    </t-radio-group>
                                    <t-radio-group class="radio-primary" v-else v-model="selectForm.adv_secondType"
                                        variant="default-filled" @change="changeAdTableData">
                                        <t-radio-button value="acosdown"> {{t('menu1_details.coreadblock_btn6')}}</t-radio-button>
                                        <t-radio-button value="salesup">{{t('menu1_details.coreadblock_btn7')}}</t-radio-button>
                                        <t-radio-button value="ordernumup">{{t('menu1_details.coreadblock_btn8')}}</t-radio-button>
                                    </t-radio-group>
                                </div>
                                <div class="col-lg-12">
                                    <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId"
                                        :data="adTableList" :loading="loading" table-layout="fixed" :columns="columns1"
                                        :bordered="false" :pagination="paginationOne" :sort="adSort"
                                        cell-empty-content="/" @sort-change="adSortChange" :hide-sort-tips="true"
                                        @page-change="handleChangeOne">
                                        <template #campaign_name="{ row }">
                                            <div class="table-name">
                                                <div class="table-title">
                                                    <p class="tooltip-text" :title="row.campaign_name"> {{ row.campaign_name
                                                        }} </p>
                                                </div>
                                            </div>
                                        </template>
                                    </t-table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3 mb-lg-5" v-if="selectForm.type_filter === 'member'">
                        <div class="card-header">
                            <div class="card-header-back">
                                <h4 class="card-header-title">{{t('menu1_details.coreadblock_t')}}-{{t('menu1_details.coreshopblock_t1')}}</h4>
                            </div>
                        </div>
                        <div class="card-content">
                            <t-tabs class="card-tab" v-model="selectForm.good_type" @change="changeGoodTab">
                                <t-tab-panel value="alarm" :label="t('menu1_details.coreshopblock_tab1')">
                                </t-tab-panel>
                                <t-tab-panel value="potential" :label="t('menu1_details.coreshopblock_tab2')">
                                </t-tab-panel>

                            </t-tabs>
                            <div class="row">
                                <div class="col-lg-12  mt-3 mb-3">
                                    <t-radio-group class="radio-primary" v-if="selectForm.good_type === 'alarm'"
                                        v-model="selectForm.good_secondType" variant="default-filled"
                                        @change="changeGoodTableData">
                                        <t-radio-button value="acosup"> {{t('menu1_details.coreshopblock_btn1')}}</t-radio-button>
                                        <t-radio-button value="tacosup">{{t('menu1_details.coreshopblock_btn2')}}</t-radio-button>
                                        <t-radio-button value="salesdown">{{t('menu1_details.coreshopblock_btn3')}}</t-radio-button>
                                        <t-radio-button value="advsalsedown">{{t('menu1_details.coreshopblock_btn4')}}</t-radio-button>
                                        <t-radio-button value="advnosales">{{t('menu1_details.coreshopblock_btn5')}}</t-radio-button>
                                    </t-radio-group>
                                    <t-radio-group class="radio-primary" v-else v-model="selectForm.good_secondType"
                                        variant="default-filled" @change="changeGoodTableData">
                                        <t-radio-button value="acosdown"> {{t('menu1_details.coreshopblock_btn6')}}</t-radio-button>
                                        <t-radio-button value="tacosdown">{{t('menu1_details.coreshopblock_btn7')}}</t-radio-button>
                                        <t-radio-button value="salesup">{{t('menu1_details.coreshopblock_btn8')}}</t-radio-button>
                                        <t-radio-button value="advsalseup">{{t('menu1_coreshopblock_btn9')}}</t-radio-button>
                                    </t-radio-group>
                                </div>
                                <div class="col-lg-12">
                                    <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId"
                                        :data="goodTableList" :loading="loading" table-layout="fixed"
                                        :columns="columnsGood" :bordered="false" :pagination="paginationGood"
                                        :sort="goodSort" cell-empty-content="/" @sort-change="goodSortChange"
                                        :hide-sort-tips="true" @page-change="handleChangeGood">
                                        <template #good_name="{ row }">
                                            <div class="table-good">
                                                <img @click="toGoodDetail(row.good.url)" :src="row.good.avatar" alt="">
                                                <div>
                                                    <p>
                                                        <span class="text-blue"> {{ row.good.name.slice(0, 15) }}</span>

                                                        ({{ row.good.asin }} <t-icon
                                                            @click="WebApp.copyASIN(row.good.asin)" class="file_copy"
                                                            name="file-copy" />)
                                                    </p>
                                                    <p class="text-tip">{{ row.shop_name }}</p>

                                                </div>
                                            </div>
                                        </template>
                                    </t-table>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="card mb-3 mb-lg-5" v-else>
                        <div class="card-content">
                            <t-tabs class="card-tab" :default-value="1" v-model="selectForm.rank_type"
                                @change="getShopTableData()">
                                <t-tab-panel value="order_num" :label="t('menu1_details.saleTab')">


                                </t-tab-panel>
                                <t-tab-panel value="cost" :label="t('menu1_details.adcostTab')">


                                </t-tab-panel>

                            </t-tabs>
                            <div class="row">
                                <div class="col-lg-12">
                                    <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId"
                                        :data="shop_goodTableList" :loading="loading" table-layout="fixed"
                                        :columns="columnsShopGood" :bordered="false" :sort="shopGoodSort"
                                        cell-empty-content="/" @sort-change="shopGoodChange" :hide-sort-tips="true">
                                        <template #good_name="{ row }">
                                            <div class="table-good">
                                                <img @click="toGoodDetail(row.good.url)" :src="row.good.avatar" alt="">
                                                <div>
                                                    <p>
                                                        <span class="text-blue"> {{ row.good.name.slice(0, 15) }}</span>

                                                        ({{ row.good.asin }} <t-icon
                                                            @click="WebApp.copyASIN(row.good.asin)" class="file_copy"
                                                            name="file-copy" />)
                                                    </p>
                                                    <p>{{ row.shop_name }}</p>

                                                </div>

                                            </div>
                                        </template>
                                    </t-table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </t-content>

        </t-layout>
    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, nextTick, Ref, ref, watch, computed } from 'vue';
// import 'animate.css';
import { getAllUser, getAllAsins,searchAsin, getAllView, getAdEffect,getStrategyadopt, getCorefocusadv, getCorefocusgood, getShopInfo, getShopRank, getGoodRank } from '@/api/home';

import * as WebApp from '@/utils/webapp';
import { getCountryFlag, exchangeRate } from '@/utils/countryFile';
import dayjs from 'dayjs';
import { accountInfo, shopSelect, CostList, AdList,strategyList, CountryFile } from '@/types/model.home';
import { formatDate } from '@/utils/date';
import { TableProps, RadioGroupProps, DateRangeValue, DateRangePickerPartial } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const selectForm = reactive({
    type_filter: 'member',
    user_ids: [],
    user_id: '',
    asin_ids: [],
    asin_id: '',
    st: '',
    ed: '',
    data_type: 'good', // 目前固定为商品品类
    adv_type: 'alarm',// 核心关注-广告活动
    adv_secondType: 'acosup',//广告侧边栏选择
    past_day: '',// 过去七天或十五天
    good_type: 'alarm',// 核心关注-商品
    good_secondType: 'acosup',//商品侧边栏选择
    rank_type: 'order_num', //商铺排名
    country_code: 'IT',
})
const childAsin=ref('')
const personOptions: Array<shopSelect> = reactive([])
const asinOptions: Array<shopSelect> = reactive([])


const tactic_data_type = ref('')
const shop_data_type = ref('')
const shop_data_time = ref('')

const range = ref([dayjs().subtract(6, 'day').toDate(), dayjs().toDate()]);
const checkTime = ref('1')
const costList: Array<CostList> = reactive([]);
const adChartList: AdList = reactive({});
const strategyChartList:strategyList=reactive({})
const loading = ref(true);

const checkAdTime = ref('1'); // 核心关注广告活动的时间筛选
const paginationOne = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const paginationGood = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const columns1 = reactive([
    { colKey: 'campaign_name', title: t('table.column_campaign_name'), width: 140 },

    { colKey: 'shop_name', title:t('table.column_shop_name'), align: 'center' },
    {
        colKey: 'acos', title:t('table.column_acos'), align: 'center',
        sortType: 'all',
        sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale === 0) {
                return '/';

            } else {
                return row.acos + '%';
            }
        }
    },
    {
        colKey: 'adv_cost', title: t('table.column_adv_cost'), width: 140, align: 'center',
        sortType: 'all',
        sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.adv_cost, row.currency)
            return cost
        }
    },
    {
        colKey: 'sale', title: t('table.column_sale'), align: 'center',
        sortType: 'all',
        sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale, row.currency)
            return cost
        }
    },
    {
        colKey: 'order_count_total', title: t('table.column_order_count_total'), align: 'center', sortType: 'all',
        sorter: true,
    },
    {
        colKey: 'order_num_total',title: t('table.column_order_num_total'), align: 'center', sortType: 'all',
        sorter: true,
    },
    {
        colKey: 'impressions',title: t('table.column_impressions'), align: 'center', sortType: 'all',
        sorter: true,
    },
    {
        colKey: 'clicks',title: t('table.column_clicks'), align: 'center', sortType: 'all',
        sorter: true,
    },
    {
        colKey: 'conversion_rate',title: t('table.column_conversion_rate'), align: 'center', sortType: 'all',
        sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.conversion_rate + '%';
        },
    },
]);
const columnsGood = reactive([
    { colKey: 'serial-number',title: t('table.column_serial_number'),  },
    {
        colKey: 'good_name',title: t('table.column_good_name'),  align: 'center', width: 400
    },
    {
        colKey: 'sale_amt_total', title: t('table.column_sale_amt_total'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale_amt_total, row.currency)
            return cost
        }
    },
    { colKey: 'order_num', title: t('table.column_order_num'), align: 'center', width: 120, sortType: 'all', sorter: true },
    { colKey: 'order_count_total',title: t('table.column_order_count_total2'), align: 'center', width: 120, sortType: 'all', sorter: true },
    {
        colKey: 'adv_cost',title: t('table.column_adv_cost'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.adv_cost, row.currency)
            return cost
        }
    },
    {
        colKey: 'acos', title: t('table.column_acos'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale_amt_total === 0) {
                return '/';

            } else {
                return row.acos + '%';
            }
        },
    },
    {
        colKey: 'tacos',title: t('table.column_tacos'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale_amt_adv === 0) {
                return '/';

            } else {
                return row.tacos + '%';
            }
        },
    },
    {
        colKey: 'sale_amt_adv', title: t('table.column_sale_amt_adv'), align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale_amt_total, row.currency)
            return cost
        }
    },
    { colKey: 'order_count_adv', title: t('table.column_order_count_adv'), align: 'center', width: 140, sortType: 'all', sorter: true },
    {
        colKey: 'order_num_adv', title: t('table.column_order_num_adv'),align: 'center', width: 120, sortType: 'all', sorter: true
    },
]);
const columnsShopGood = reactive([
    { colKey: 'serial-number', title: t('table.column_serial_number2'), },
    { colKey: 'good_name', title: t('table.column_good_name'), align: 'center', width: 400 },
    {
        colKey: 'sale_total', title: t('table.column_sale_total'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale_total, row.currency)
            return cost
        }
    },
    {
        colKey: 'order_num_total', title: t('table.column_order_num_total2'), align: 'center', width: 120, sortType: 'all', sorter: true
    },
    { colKey: 'order_count_total', title: t('table.column_order_count_total2'), align: 'center', width: 120, sortType: 'all', sorter: true },
    {
        colKey: 'adv_cost', title: t('table.column_adv_cost'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.adv_cost, row.currency)
            return cost
        }
    },
    {
        colKey: 'acos', title: t('table.column_acos'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale_total === 0) {
                return '/';

            } else {
                return row.acos + '%';
            }
        },
    },
    {
        colKey: 'tacos', title: t('table.column_tacos'), align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale_amt_adv === 0) {
                return '/';

            } else {
                return row.tacos + '%';
            }
        },
    },
    {
        colKey: 'sale_amt_adv', title: t('table.column_sale_amt_adv'), align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale_amt_adv, row.currency)
            return cost
        }
    },
    { colKey: 'order_count_adv', title: t('table.column_order_count_adv'), align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'order_num_adv',title: t('table.column_order_num_adv'), align: 'center', width: 120, sortType: 'all', sorter: true },
]);

const adSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});
const goodSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});
const shopGoodSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});
const adAllTableList = reactive({})
const adTableList = ref<TableProps['data']>([])
const goodAllTableList = reactive({})
const goodTableList = ref<TableProps['data']>([])
const shop_goodTableList = ref<TableProps['data']>([])
const shopChartList = reactive({})
// 商品销售额top5
const shopRankList: Array<CountryFile> = reactive([])
const screenWidth = ref(0);
onMounted(() => {
    screenWidth.value = window.innerWidth - 300;
    // 添加事件监听，以响应屏幕尺寸变化
    window.addEventListener('resize', updateScreenWidth);

    selectForm.st = WebApp.formatDate(range.value[0], 'yyyyMMdd')
    selectForm.past_day = WebApp.formatDate(range.value[0], 'yyyyMMdd')
    selectForm.ed = WebApp.formatDate(range.value[1], 'yyyyMMdd')
    

    getSelectUser();
    getSelectAsin();
    console.log('用户信息', selectForm)


});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});
function updateScreenWidth() {
    screenWidth.value = window.innerWidth - 300;
}
const changeType = () => {
    shop_data_time.value = selectForm.st + selectForm.ed
    if (selectForm.type_filter === 'parent_asin') {
        getHomeList();
        getShopInfoChart();
        getShopRankList();
        getShopTableData();
    } else {
        getHomeList();
        getAdChartData();
        getStrategyChartData()
    }
}
const userChange = () => {
    selectForm.user_id = JSON.stringify(selectForm.user_ids)
    getHomeList();
    getAdChartData();
    getStrategyChartData()
    getAdTableData();
    getGoodTableData();
}
const asinChange = () => {
    const data= WebApp.extractMarketplaceAsins(asinOptions,selectForm.asin_ids);
    selectForm.asin_id = JSON.stringify(data)
    console.log('submit==',data,selectForm.asin_ids,selectForm.asin_id)

    getHomeList();
    getShopInfoChart();
    getShopRankList();
    getShopTableData();
}

const onTimeChange: RadioGroupProps['onChange'] = (checkedValues) => {
    if (checkTime.value === '1') {
        range.value = [dayjs().subtract(6, 'day').toDate(), dayjs().toDate()]
        selectForm.st = WebApp.formatDate(range.value[0], 'yyyyMMdd')
        selectForm.ed = WebApp.formatDate(range.value[1], 'yyyyMMdd')
        changeType();
    } else if (checkTime.value === '2') {
        range.value = [dayjs().subtract(29, 'day').toDate(), dayjs().toDate()]
        selectForm.st = WebApp.formatDate(range.value[0], 'yyyyMMdd')
        selectForm.ed = WebApp.formatDate(range.value[1], 'yyyyMMdd')
        changeType();
    }
};

function handleChange(value: DateRangeValue) {
    range.value = value
    const timeRange = value.map(date => date.replace(/-/g, ''));
    selectForm.st = timeRange[0]
    selectForm.ed = timeRange[1]
    changeType();

}

const request = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            adTableList.value = adTableList.value && adTableList.value
                .concat()
                .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            adTableList.value = adTableList.value && adTableList.value.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const goodRequest = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            goodTableList.value = goodTableList.value && goodTableList.value
                .concat()
                .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            goodTableList.value = goodTableList.value && goodTableList.value.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const shopGoodRequest = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            shop_goodTableList.value = shop_goodTableList.value && shop_goodTableList.value
                .concat()
                .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            shop_goodTableList.value = shop_goodTableList.value && shop_goodTableList.value.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const adSortChange: TableProps['onSortChange'] = (val) => {
    adSort.value = val;
    request(val);
};
const goodSortChange: TableProps['onSortChange'] = (val) => {
    goodSort.value = val;
    goodRequest(val);
};
const shopGoodChange: TableProps['onSortChange'] = (val) => {
    shopGoodSort.value = val;
    shopGoodRequest(val);
};
const handleChangeOne = (pageInfo: any) => {
    paginationOne.defaultCurrent = pageInfo.current as number;
    paginationOne.defaultPageSize = pageInfo.pageSize as number;
    // const adList = adAllTableList[selectForm.adv_secondType];
    // Object.assign(adTableList, adList);
    adTableList.value = adAllTableList[selectForm.adv_secondType]
};
const changeAdTableData = () => {
    // WebApp.toEmpty(adTableList.value);
    adTableList.value = adAllTableList[selectForm.adv_secondType];
    paginationOne.total = adAllTableList[selectForm.adv_secondType].length
}
const changeAdTab = () => {
    if (selectForm.adv_type === 'alarm') {
        selectForm.adv_secondType = 'acosup'
    } else {
        selectForm.adv_secondType = 'acosdown'
    }
    getAdTableData()
}
const handleChangeGood = (pageInfo: any) => {
    paginationGood.defaultCurrent = pageInfo.current as number;
    paginationGood.defaultPageSize = pageInfo.pageSize as number;
    goodTableList.value = goodAllTableList[selectForm.good_secondType]

};
const changeGoodTableData = () => {
    goodTableList.value = goodAllTableList[selectForm.good_secondType]
    paginationGood.total = goodAllTableList[selectForm.good_secondType].length
}
const changeGoodTab = () => {
    if (selectForm.good_type === 'alarm') {
        selectForm.good_secondType = 'acosup'
    } else {
        selectForm.good_secondType = 'acosdown'
    }
    getGoodTableData()
}
const toGoodDetail = (url: string) => {
    window.open(url);
}

async function getHomeList() {
    const res = await getAllView({ param_id: selectForm.type_filter === 'member' ? selectForm.user_id : selectForm.asin_id, type_filter: selectForm.type_filter, st: selectForm.st, ed: selectForm.ed });
    Object.assign(costList, res.costList)
}
async function getAdChartData() {
    // 广告效果评估--负责人

    const res = await getAdEffect({ param_id: selectForm.user_id, data_type: selectForm.data_type, st: selectForm.st, ed: selectForm.ed });
    Object.assign(adChartList, res)
}
async function getStrategyChartData() {
    // 策略采纳情况-负责人
    const res = await getStrategyadopt({type_filter: selectForm.type_filter, param_id: selectForm.user_id, param_filter: tactic_data_type.value });
    const transformed = res.reduce((acc, item) => {
    acc.names.push(item.name);
    acc.strategy_adopt_counts.push(item.strategy_adopt_count);
    acc.strategy_adopt_rates.push(item.strategy_adopt_rate);
    return acc;
}, { names: [], strategy_adopt_counts: [], strategy_adopt_rates: [] });
    Object.assign(strategyChartList,transformed)
    tactic_data_type.value='category'
    console.log('策略采纳==',strategyChartList,res)
}
async function getAdTableData() {
    // 核心关注广告活动预警-负责人
    const res = await getCorefocusadv({ type_filter: selectForm.type_filter, param_id: selectForm.user_id, adv_type: selectForm.adv_type, past_day: selectForm.st });
    loading.value = false;
    Object.assign(adAllTableList, res)
    adTableList.value = res[selectForm.adv_secondType]
    paginationOne.total = res[selectForm.adv_secondType].length;
}
async function getGoodTableData() {
    // 核心关注商品-负责人
    const res = await getCorefocusgood({ type_filter: selectForm.type_filter, param_id: selectForm.user_id, good_type: selectForm.good_type, past_day: selectForm.st });
    loading.value = false;
    Object.assign(goodAllTableList, res)
    goodTableList.value = res[selectForm.good_secondType]
    paginationGood.total = res[selectForm.good_secondType].length;
}

async function getShopInfoChart() { //店铺经营情况-- 商铺
    const res = await getShopInfo({ param_id: selectForm.asin_id, st: selectForm.st, ed: selectForm.ed });
    const obj = res.reduce((acc: any, item: any) => {
        acc.date.push(item.date);
        acc.cust_unit_price.push(item.cust_unit_price);
        acc.pay_conversion_rate.push(item.pay_conversion_rate);
        return acc;
    }, { date: [], cust_unit_price: [], pay_conversion_rate: [] });
    Object.assign(shopChartList, obj)
    shop_data_type.value = 'cust_unit_price'
}
async function getShopRankList() {//店铺排名-- 商铺
    const res = await getShopRank({ param_id: selectForm.asin_id, st: selectForm.st, ed: selectForm.ed });
    Object.assign(shopRankList, res)
}
async function getShopTableData() {//销量排名-- 商铺
    const res = await getGoodRank({ param_id: selectForm.asin_id, rank_type: selectForm.rank_type, st: selectForm.st, ed: selectForm.ed });
    loading.value = false;
    shop_goodTableList.value = res;
}

async function getSelectUser() {
    const res = await getAllUser();
    Object.assign(personOptions, res.employers)
    res.employers.forEach(item => {
        if (item.adv_manager_id) {
            selectForm.user_ids.push(item.adv_manager_id);
        }
    })
    selectForm.user_id = JSON.stringify(selectForm.user_ids)
    getHomeList();
    getAdChartData();
    getStrategyChartData()
    getAdTableData();
    getGoodTableData();

}
async function getSelectAsin() {
    const res = await getAllAsins();
    Object.assign(asinOptions, res)
    selectForm.asin_ids = asinOptions.reduce((acc, item) => {
        const leafValues = WebApp.getLeafValues(item);
        return acc.concat(leafValues);
    }, []);
    const data=WebApp.extractMarketplaceAsins(asinOptions,selectForm.asin_ids);
    selectForm.asin_id = JSON.stringify(data)
}
async function searchParentAsin() {
    if(childAsin.value===''){
        MessagePlugin.warning('请输入子asin！')
        return false
    }
    const res = await searchAsin({asin:childAsin.value});
    const asin_ids=ref([])
    res.forEach((item)=>{
        asin_ids.value.push(item.parent_asin)
    })
    selectForm.asin_ids=asin_ids.value
    asinChange()
}




</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');

.main_content_one {

    .timeGroup {
        display: flex;
        justify-content: flex-end;
        min-width: 380px;
    }



    .card-hover-shadow {
        background: #F2F4F7;
        border: none;

        .card-subtitle,
        .align-items-center {
            color: #1F2733;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
        }

        .card-title {
            color: #1F2733;
            font-size: 1rem;
            font-weight: 600;
            line-height: 26px;
        }

    }
}

.main_content_two {
    margin: 20px 10px;

    .card-header-title {
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        text-align: left;
    }

    .shop_rank {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background: #F2F4F7;
        margin-right: 20px;
        text-align: center;
    }

    .shop_rank0 {
        background: #FF5959;
        color: #fff;
    }

    .shop_rank1 {
        background: #FE7940;
        color: #fff;
    }

    .shop_rank2 {
        background: #FAB007;
        color: #fff;
    }
}

.main_content_three {
    margin: 20px;

    .card-header {
        padding: 0;
        border: none;

        .card-header-back {
            width: 235px;
            height: 38px;
            background: #237FFA;
            border-top-left-radius: 8px;
            border-bottom-right-radius: 28px;

            .card-header-title {
                height: 38px;
                line-height: 38px;
                color: #fff;
                margin: auto 0 auto 24px;
                font-size: 16px;
                font-weight: 500;
            }
        }
    }





}

.timeInput {
    text-align: right;
    line-height: 32px;
    padding-right: 10px;
}

// 时间切换
.radio-time {
    border-radius: 4px;
    background: @back-info2;

    :deep(.t-radio-button) {
        color: @color-info;
    }

    :deep(.t-radio-button:hover) {
        color: @color-info;
    }

    :deep(.t-is-checked) {
        background: @back-primary !important;
        color: @color-primary !important;

    }

}
</style>
