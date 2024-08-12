<template>
    <!-- 精准否词根 策略明细页 -->
    <div class="page">

        <t-layout>
            <head-menu :head-title="'策略明细'" />
            <t-content>
                <t-card :bordered="false" class="main_content_one">
                    <t-descriptions :column="4" :content-style="{ width: '400px' }"
                        :label-style="{ width: '180px', innerHeight: '48px', textAlign: 'left' }" layout="horizontal"
                        item-layout="horizontal">

                        <t-descriptions-item label="策略名称">{{
                            strategyList.strategy_name }}</t-descriptions-item>
                        <t-descriptions-item label="产品生命周期">
                            {{ strategyList.life_cycle_label }}</t-descriptions-item>
                        <t-descriptions-item label="操作动作">{{ strategyList.action_name
                            }}</t-descriptions-item>
                        <t-descriptions-item label="操作具体对象">{{ strategyList.term_type_label
                            }}</t-descriptions-item>
                        <t-descriptions-item label="统计粒度">{{ strategyList.statistic_dim
                            }}</t-descriptions-item>
                        <t-descriptions-item label="策略说明">{{ strategyList.strategy_desc
                            }}</t-descriptions-item>
                        <t-descriptions-item label="策略生效时间">{{
                            strategyList.action_recommend_date }}</t-descriptions-item>
                        <t-descriptions-item label="采纳前后7天ACOS变化">{{
                            strategyList.change_acos }}%</t-descriptions-item>
                        <t-descriptions-item label="近30天曝光">{{
                            strategyList.last30d_impressions }}</t-descriptions-item>
                        <t-descriptions-item label="近30天点击量">{{ strategyList.last30d_clicks
                            }}</t-descriptions-item>
                        <t-descriptions-item label="近30天销售量">{{
                            strategyList.last30d_order_quantity }}</t-descriptions-item>
                        <t-descriptions-item label="近30天销售额">{{
                            strategyList.last30d_sale_amt_new }}</t-descriptions-item>
                    </t-descriptions>
                </t-card>
                <t-card :bordered="false" class="main_content_one">
                    <div class="search-list mb-3 ">
                        <div>
                            <t-select class="select_type" v-model="panelData.formData.asin" clearable
                                placeholder="父ASIN">
                                <t-option v-for="(ele, index) in panelData.parent_asin_info" :key="index" :label="ele"
                                    :value="ele" />
                            </t-select>
                        </div>


                        <div v-if="accountData.role === 'root'">
                            <t-cascader placeholder="广告负责人" v-model="panelData.formData.adv_manager_name"
                                :options="panelData.managers_info" clearable filterable style="width: 360px;"
                                :keys="{ label: 'name', value: 'name', children: 'child' }" />
                        </div>
                        <div>
                            <t-cascader v-model="panelData.formData.category_name" placeholder="品线"
                                :options="panelData.category_info" clearable />
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.good_name" placeholder="商品名称" clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.department_name" placeholder="广告部门列表"
                                clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.marketplace_name" placeholder="站点" clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.seller_name" placeholder="卖家名称" clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.campaign_name_list" placeholder="卖家名称"
                                clearable></t-input>
                        </div>

                        <img class="search_icon" @click="filterDetailTable(panelData.formData)"
                            :src="WebApp.getImage('common/search-icon.png')" alt="">
                    </div>
                    <div>
                        <t-table row-key="row_id" :data="panelData.detail" headerAffixedTop verticalAlign="bottom"
                            :style="{ width: `${screenWidth}px` }" :loading="loading" tableLayout="fixed"
                            :columns="columnsDetail" :bordered="false" :pagination="paginationDetail" :sort="detailSort"
                            cell-empty-content="/" @sort-change="detailSortChange" :hide-sort-tips="true"
                            @page-change="handleChangeDetail">
                            <template #good_name="{ row }">
                                <div class="table-good">
                                    <img @click="toGoodDetail(row.good_info.url)" :src="row.good_info.avatar" alt="">
                                    <div>
                                        <p>{{ row.good_info.asin }} <t-icon @click="WebApp.copyASIN(row.good_info.asin)"
                                                class="file_copy" name="file-copy" />
                                        </p>
                                        <p>站点：{{ row.marketplace_name }}</p>
                                        <p>卖家名称：{{ row.seller_name }}</p>
                                    </div>
                                </div>
                            </template>
                            <template #campaign_cnt="{ row }">
                                <span class="hand_detail" @click="onClick(row.row_id, 'cnt')">{{
                                    exchangeRate(row.campaign_cnt, row.currency_code) }}</span>
                            </template>
                            <template #cost="{ row }">
                                <span class="hand_detail" @click="onClick(row.row_id, 'cost')">{{
                                    exchangeRate(row.cost, row.currency_code) }}</span>
                            </template>
                            <template #applyState="{ row }">
                                <span v-if="row.status === false" class="text-danger">未应用</span>
                                <span v-else class="text-success">已应用</span>
                            </template>
                            <template #handle="{ row }">
                                <t-button v-if="row.status === false" class="blue_btn" @click="addWordApply(row)"
                                    :disabled="accountData.role !== 'employ'">应用</t-button>
                                <span v-else>已应用</span>
                            </template>
                        </t-table>
                    </div>
                    <t-dialog v-model:visible="visible" header="广告花费趋势图" width="700px" :confirm-on-enter="true"
                        :cancel-btn="null" :confirm-btn="null" :on-close="close">
                        <cost-chart :cost-data="panelData.costData" />
                    </t-dialog>
                    <t-dialog v-model:visible="cntvisible" header="广告活动个数趋势图" width="1000px" :confirm-on-enter="true"
                        :cancel-btn="null" :confirm-btn="null">
                        <t-table row-key="campaign_id" :data="panelData.cntData" :loading="loading" table-layout="auto"
                            :selected-row-keys="panelData.selectKey" @select-change="rehandleSelectChange"
                            :columns="columnCnt" :bordered="false" cell-empty-content="/">

                        </t-table>
                    </t-dialog>
                </t-card>
            </t-content>
        </t-layout>



    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import 'animate.css';
import { getAdvstrategydetail, getListCostData, getListCampaignData, adjustbid } from '@/api/intelligentDelivery';
import { getAllUser } from '@/api/home';
import * as WebApp from '@/utils/webapp';
import { exchangeRate } from '@/utils/countryFile';
import { TableProps, DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { advDetail } from '@/types/model.home';
const accountData = JSON.parse(localStorage.getItem('account')).account
const loading = ref(true);
const selectForm = reactive({
    strategy_type_id: 'ystz',
    tenant_id: accountData.tenant_id,
    adv_manager_id: accountData.store_id,

    county_code: 'IT',
});

const strategyList: advDetail = reactive({
    strategy_id: ''
})
const panelData: any = ref(
    {
        detail: [],
        oldDetail: [],
        campaigns_info: [],
        managers_info: [],
        parent_asin_info: [],
        category_info: [],
        formData: {
            asin: '',
            adv_manager_name: '',
            category_name: '',
            good_name: '',
            department_name: '',
            marketplace_name: '',
            seller_name: '',
            campaign_name_list: '',
        },
        costData: {},
        cntData: [],
        selectKey: []
    },
);
const detailSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});

const columnsDetail = reactive([
    { colKey: 'serial-number', title: '序号', align: 'center', width: 60 },
    { colKey: 'good_name', title: '商品', align: 'center', width: 280 },
    { colKey: 'good_info.name', title: '商品名称', align: 'center', width: 320 },
    { colKey: 'category_name', title: '品线', align: 'center', width: 200 },
    { colKey: 'campaign_cnt', title: '广告活动个数', align: 'center', width: 120 },
    { colKey: 'campaign_name_list', title: '广告活动名称List', align: 'center', width: 140 },
    { colKey: 'before_campaign_budget_amt', title: '调整前预算', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'new_campaign_budget_amt', title: '调整后预算', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'avg_campaign_budget_amt_7d', title: '近7天平均每天花费', align: 'center', width: 180, sortType: 'all', sorter: true },
    { colKey: 'afn_warehouse_quantity', title: '当前库存量', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'DOS', title: '库存可售天数', align: 'center', sortType: 'all', width: 140, sorter: true },
    { colKey: 'best_asin_dos', title: '热卖子ASIN可售天数', align: 'center', width: 200, sortType: 'all', sorter: true },
    { colKey: 'top_cost_asin_dos', title: '广告花费Top子ASIN可售天数', align: 'center', width: 240, sortType: 'all', sorter: true },
    { colKey: 'avg_tacos_7d', title: '父ASIN近7天TACOS', align: 'center', width: 200, sortType: 'all', sorter: true },
    { colKey: 'statistic_days', title: '统计天数', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'clicks', title: '点击量', align: 'center', sortType: 'all', sorter: true },
    {
        colKey: 'cost', title: '广告花费', align: 'center', width: 140, sortType: 'all', sorter: true
    },
    {
        colKey: 'sale_amt', title: '销售额', align: 'center', sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale_amt, row.currency_code)
            return cost
        }
    },
    { colKey: 'sale_num', title: '销售量', align: 'center', sortType: 'all', sorter: true },
    { colKey: 'order_num', title: '订单量', align: 'center', sortType: 'all', sorter: true },
    {
        colKey: 'cpc', title: '竞价', align: 'center', sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.cpc.toFixed(2);
        }
    },
    {
        colKey: 'acos', title: 'ACOS', align: 'center', sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.sale_amt === 0) {
                return '/';

            } else {
                return (row.acos * 100).toFixed(2) + '%';
            }
        }
    },
    {
        colKey: 'cvr', title: '转化率', align: 'center', sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.cvr ? row.cvr + '%' : '0%';
        },
    },
    {
        colKey: 'cate_cvr', title: '类目CVR', align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return (row.cate_cvr * 100).toFixed(2) + '%';
        },
    },
    {
        colKey: 'cate_cpc', title: '类目CPC', align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.cate_cpc.toFixed(2);
        },
    },
    {
        colKey: 'cate_acos', title: '类目ACOS', align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return (row.cate_acos * 100).toFixed(2) + '%';
        },
    },
    {
        colKey: 'cate_tacos', title: '类目TACOS', align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.cate_tacos + '%';
        },
    },
    { colKey: 'adv_manager_name', title: '广告负责人', align: 'center', width: 120 },
    { colKey: 'adv_department_list_name', title: '广告部门列表', align: 'center', width: 180 },
    { colKey: 'applyState', title: '应用状态', align: 'center', },
    { colKey: 'handle', title: '操作', align: 'center', fixed: 'right', width: 100 },
]);
const paginationDetail = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const visible = ref(false);
const cntvisible = ref(false)
const currentDialog = ref('')
const columnCnt = reactive([
    { colKey: 'row-select', type: 'multiple' },
    { colKey: 'campaign_id', title: '广告活动id' },
    { colKey: 'campaign_name', title: '广告活动名称' },
    { colKey: 'ad_mode', title: '广告活动类型' },
    { colKey: 'word', title: '词根' },
    { colKey: 'search_term_list', title: '搜索词list' },
    { colKey: 'search_term_cnt', title: '搜索词个数' },
    { colKey: 'clicks', title: '点击量' },
    { colKey: 'cost', title: '广告花费' },
    { colKey: 'sale_amt', title: '销售额' },
    { colKey: 'sale_num', title: '销售量' },
    { colKey: 'order_num', title: '订单量' },
    { colKey: 'cpc', title: '降价' },
    { colKey: 'acos', title: 'ACOS' },
    { colKey: 'cvr', title: '转化率' },
])

const screenWidth = ref(0);

onMounted(() => {
    loading.value = false;
    screenWidth.value = window.innerWidth - 305;
    window.addEventListener('resize', updateScreenWidth);
    const strategy_row = decodeURI(WebApp.getQueryFromUrl('strategy_row'))
    Object.assign(strategyList, JSON.parse(strategy_row))
    getAdvDetaildata(strategyList.strategy_id, strategyList.action_name); // 调用策略明细table
    getSelectUser()
});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);

});
function updateScreenWidth() {
    screenWidth.value = window.innerWidth - 305;
}
const detailRequest = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            panelData.value.detail = panelData.value.detail
                .concat()
                .sort((a: any, b: any) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            panelData.value.detail = panelData.value.detail.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const detailSortChange: TableProps['onSortChange'] = (val) => {
    detailSort.value = val;
    detailRequest(val);
};
const toGoodDetail = (url: string) => {
    window.open(url);
}
const rehandleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    panelData.selectKey = value
};

const handleChangeDetail = (pageInfo: any) => {
    paginationDetail.defaultCurrent = pageInfo.current as number;
    paginationDetail.defaultPageSize = pageInfo.pageSize as number;
};

const filterDetailTable = (formData: any) => {

    const deepCopiedDetail = JSON.parse(JSON.stringify(panelData.value.oldDetail)); // 深拷贝示例数据
    panelData.value.detail = WebApp.filterDetails(deepCopiedDetail, {
        asin: formData.asin,
        adv_manager_name: formData.adv_manager_name,
        category_name: formData.category_name,
        good_name: formData.good_name,
        department_name: formData.department_name,
        marketplace_name: formData.marketplace_name,
        seller_name: formData.seller_name,
        campaign_name_list: formData.campaign_name_list,
    });
    paginationDetail.total = panelData.value.detail.length;
    paginationDetail.defaultCurrent = 1;
}


const onClick = (row_id: string, row_text: string) => {
    currentDialog.value = row_text;
    if (currentDialog.value === 'cost') {
        getCostChartData(row_id)
        visible.value = true;

    } else {
        getCntChartData(row_id)
        cntvisible.value = true;

    }
};
const close: DialogProps['onClose'] = (context) => {
};
async function getSelectUser() {
    const res = await getAllUser();
    Object.assign(panelData.value.managers_info, res.orgs)
}
async function getAdvDetaildata(strategy_id: string, action_name?: string) {
    loading.value = false;
    const res = await getAdvstrategydetail({ action_name, strategy_id, strategy_type_id: selectForm.strategy_type_id, tenant_id: selectForm.tenant_id, adv_manager_id: selectForm.adv_manager_id, county_code: selectForm.county_code });
    Object.assign(panelData.value, {
        detail: res.data_list,
        oldDetail: res.data_list,
        campaigns_info: res.campaigns_info,
        parent_asin_info: res.parent_asin_info,
        category_info: WebApp.convertData(res.category_info.category_data)
    });


    paginationDetail.total = res.data_list.length
}
async function getCostChartData(row_id: string) {
    const res = await getListCostData({ row_id });
    loading.value = false;
    panelData.value.costData = res;
}
async function getCntChartData(row_id: string) {
    const res = await getListCampaignData({ row_id, detail_type_name: selectForm.strategy_type_id });
    loading.value = false;
    panelData.cntData = res;
}
async function addWordApply(row: any) {
    if (panelData.value.selectKey && !panelData.value.selectKey.length) {
        MessagePlugin.error("未选择广告活动！");
        return;
    }
    const form = reactive({
        row_ids: []
    });
    const rowIdStr = row.row_id.toString();
    const newRowIds = panelData.value.selectKey.map((element: any) => ({
        row_id: rowIdStr,
        campaign_id: [element]
    }));
    form.row_ids.push(...newRowIds)
    const res = await adjustbid(form);
    MessagePlugin.success('应用成功！')
    panelData.value.detail = panelData.value.detail.map((item: any) => ({
        ...item,
        status: item.row_id === row.row_id ? true : item.status
    }));
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
</style>
