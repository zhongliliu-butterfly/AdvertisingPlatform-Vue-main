<template>
    <!-- 添加大小词，投放品，好词晋升 策略明细页 -->
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
                            strategyList.last30d_sale_amt_new }}
                        </t-descriptions-item>
                    </t-descriptions>
                </t-card>
                <t-card :bordered="false" class="main_content_one">
                    <div class="search-list mb-3 ">
                        <t-button class="applybtn" @click="HandleWordApply"> 批量执行 </t-button>
                        <div>

                            <t-select class="select_type" v-model="panelData.formData.asin" clearable
                                placeholder="父ASIN">
                                <t-option v-for="(ele, index) in panelData.parent_asin_info" :key="index" :label="ele"
                                    :value="ele" />
                            </t-select>
                        </div>
                        <div>
                            <t-select class="select_type" clearable v-model="panelData.formData.campaign_name"
                                placeholder="广告活动名称">
                                <t-option v-for="(ele, index) in panelData.campaigns_info" :key="index" :label="ele"
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
                            <t-input v-model="panelData.formData.orig_campaign_match_type" placeholder="原始最高匹配类型"
                                clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.new_campaign_name" placeholder="目标广告活动名称"
                                clearable></t-input>
                        </div>
                        <div>
                            <t-input v-model="panelData.formData.new_group_name" placeholder="目标广告组名称"
                                clearable></t-input>
                        </div>
                        <img class="search_icon" @click="filterDetailTable(panelData.formData)"
                            :src="WebApp.getImage('common/search-icon.png')" alt="">
                    </div>
                    <div>
                        <t-table row-key="row_id" :data="panelData.detail" headerAffixedTop verticalAlign="bottom"
                            :style="{ width: `${screenWidth}px` }" :loading="loading" tableLayout="fixed"
                            :columns="columnsDetail" :bordered="false" :pagination="paginationDetail"
                            :selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange"
                            :sort="detailSort" cell-empty-content="/" @sort-change="detailSortChange"
                            :hide-sort-tips="true" @page-change="handleChangeDetail">
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
                            <template #cost="{ row }">
                                <span class="hand_detail" @click="onClick('cost', row.row_id)">{{
                                    exchangeRate(row.cost, row.currency_code) }}</span>
                            </template>
                            <template #aba_rank="{ row }">
                                <span v-if="row.aba_rank" class="hand_detail" @click="onClick('abaRank', row.row_id)">{{
                                    row.aba_rank }}</span>
                                <span v-else>/</span>
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
                    <t-dialog v-model:visible="visible" :header="rowName === 'cost' ? '广告花费趋势图' : 'ABA搜索排名'"
                        width="700px" :confirm-on-enter="true" :cancel-btn="null" :confirm-btn="null">
                        <cost-chart :row-name="rowName" :cost-data="panelData.costData" />
                    </t-dialog>
                </t-card>
            </t-content>
        </t-layout>



    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import 'animate.css';
import { getAdvstrategydetail, getListCostData, addtargetkeyword, addtargetproduct, goodwordcreate } from '@/api/intelligentDelivery';
import { getAllUser } from '@/api/home';
import * as WebApp from '@/utils/webapp';
import { exchangeRate } from '@/utils/countryFile';
import { TabsProps, TableProps, DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { advDetail } from '@/types/model.home';
const accountData = JSON.parse(localStorage.getItem('account')).account
const loading = ref(true);
const selectForm = reactive({
    strategy_type_id: 'tthss',
    tenant_id: accountData.tenant_id,
    adv_manager_id: accountData.store_id,
    county_code: 'IT',
});
const strategyList: advDetail = reactive({
    strategy_id: '',
    currency_code: '',
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
            campaign_name: '',
            adv_manager_name: '',
            category_name: '',
            good_name: '',
            department_name: '',
            marketplace_name: '',
            seller_name: '',
            orig_campaign_match_type: '',
            new_campaign_name: '',
            new_group_name: '',
        },
        costData: {},
    },
);
const detailSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});

const columnsDetail = reactive([
    {
        colKey: 'row-select', type: 'multiple',
        checkProps: ({ row }) => ({
            disabled: row.status === true,
        }),
    },
    { colKey: 'serial-number', title: '序号', align: 'center', width: 60 },
    { colKey: 'good_name', title: '商品', align: 'center', width: 280 },
    { colKey: 'object_term', title: '操作对象', width: 160 },
    { colKey: 'good_info.name', title: '商品名称', align: 'center', width: 320 },
    { colKey: 'category_name', title: '品线', align: 'center', width: 200 },
    { colKey: 'orig_campaign_match_type', align: 'center', width: 160, title: '原始最高匹配类型' },
    { colKey: 'new_campaign_name', align: 'center', width: 160, title: '目标广告活动名称' },
    { colKey: 'new_group_name', align: 'center', width: 140, title: '目标广告组名称' },
    { colKey: 'new_campaign_match_type', align: 'center', width: 140, title: '目标匹配类型' },
    { colKey: 'new_cpc', align: 'center', width: 160, title: '新建的投放词竞价' },
    { colKey: 'new_bid_strategy', align: 'center', width: 140, title: '新建的竞价策略' },
    {
        colKey: 'new_campaign_budget_amt', align: 'center', width: 180, title: '新建的广告活动预算',
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.new_campaign_budget_amt, row.currency_code)
            return cost
        }
    },
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
            return row.cvr ? (row.cvr * 100).toFixed(2) + '%' : '0%';
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
    { colKey: 'adv_rank', title: '广告坑位排名', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'norm_rank', title: '自然坑位排名', align: 'center', width: 140, sortType: 'all', sorter: true },
    { colKey: 'aba_rank', title: 'ABA搜索排名', align: 'center', width: 160, sortType: 'all', sorter: true },
    { colKey: 'aba_rank_week_to_week', title: 'ABA搜索排名周环比', align: 'center', width: 200, sortType: 'all', sorter: true },
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
const rowName = ref('')
const selectedRowKeys = ref<TableProps['selectedRowKeys']>([]);
const columnCnt = reactive([
    { colKey: 'order_quantity_list', title: '关键词' },
    { colKey: 'aba_rank_list', title: '排名' },
    { colKey: 'week_list', title: '周' },

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
    selectedRowKeys.value = value
};

const handleChangeDetail = (pageInfo: any) => {
    paginationDetail.defaultCurrent = pageInfo.current as number;
    paginationDetail.defaultPageSize = pageInfo.pageSize as number;
};

const filterDetailTable = (formData: any) => {
    const deepCopiedDetail = JSON.parse(JSON.stringify(panelData.value.oldDetail)); // 深拷贝示例数据
    panelData.value.detail = WebApp.filterDetails(deepCopiedDetail, {
        asin: formData.asin,
        campaign_name: formData.campaign_name,
        adv_manager_name: formData.adv_manager_name,
        category_name: formData.category_name,
        good_name: formData.good_name,
        department_name: formData.department_name,
        marketplace_name: formData.marketplace_name,
        seller_name: formData.seller_name,
        orig_campaign_match_type: formData.orig_campaign_match_type,
        new_campaign_name: formData.new_campaign_name,
        new_group_name: formData.new_group_name,
    });
    paginationDetail.total = panelData.value.detail.length;
    paginationDetail.defaultCurrent = 1;
}


const onClick = (name: string, row_id: string) => {
    getCostChartData(row_id)
    visible.value = true;
    rowName.value = name
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

async function addWordApply(row: any) {
    const form = reactive({
        action_name: strategyList.action_name,
        row_ids: [row.row_id.toString()]
    });
    try {
        let res;
        switch (form.action_name) {
            case '添加投放品':
                res = await addtargetproduct({ row_ids: form.row_ids });
                break;
            case '好词晋升':
                res = await goodwordcreate({ row_ids: form.row_ids });
                break;
            default:
                res = await addtargetkeyword(form);
                break;
        }

        MessagePlugin.success('应用成功！');

        // 更新状态逻辑
        panelData.value.detail = panelData.value.detail.map(item => ({
            ...item,
            status: item.row_id === row.row_id
        }));
    } catch (error) {
        console.error('操作失败:', error);
        MessagePlugin.error('操作失败！');
    }

}
async function HandleWordApply() {
    if (selectedRowKeys.value && !selectedRowKeys.value.length) {
        MessagePlugin.error("未选择广告活动！");
        return;
    }
    const form = reactive({
        action_name: strategyList.action_name,
        row_ids: selectedRowKeys.value ? selectedRowKeys.value.map((element: number) => element.toString()) : []
    });
    if (strategyList.action_name === '添加投放品') {
        const res = await addtargetproduct({ row_ids: form.row_ids })
        MessagePlugin.success('应用成功！')
    } else if (strategyList.action_name === '好词晋升') {
        const res = await goodwordcreate({ row_ids: form.row_ids })
        MessagePlugin.success('应用成功！')
    } else {
        const res = await addtargetkeyword(form)
        MessagePlugin.success('应用成功！')
    }
    getAdvDetaildata(strategyList.strategy_id, strategyList.action_name);
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
</style>
