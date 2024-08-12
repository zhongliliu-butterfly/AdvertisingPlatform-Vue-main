<template>
    <!-- 否词和否品页面 -->
    <div class="page">

        <t-layout>
            <head-menu :head-title="selectForm.action_name" />
            <t-content>
                <t-card :bordered="false" class="main_content_one">
                    <div>
                        <h4 class="table_title">策略列表</h4>

                        <t-table row-key="row_id" headerAffixedTop :data="shopTableList" :loading="loading"
                            table-layout="auto" :columns="columnsShop" :bordered="false" :pagination="paginationShop"
                            :sort="shopSort" cell-empty-content="/" @sort-change="shopSortChange" :hide-sort-tips="true"
                            @page-change="handleChangeShop">

                            <template #strategyName="{ row }">
                                <div class="table-title">
                                    <p class="tooltip-text" :title="row.strategy_name"> {{ row.strategy_name }} </p>
                                    <span class="tip-primary">{{ row.term_type_label }}</span>
                                </div>
                                <p> 统计粒度：{{ row.statistic_dim }}</p>
                                <p> 生命周期：{{ row.life_cycle_label }}</p>
                            </template>
                            <template #handle="{ row }">
                                <span class="hand_detail" @click="addTab(row)">查看明细</span>
                            </template>
                        </t-table>
                    </div>

                </t-card>

            </t-content>


        </t-layout>


    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import 'animate.css';
import { getAdvstrategylist } from '@/api/intelligentDelivery';
import * as WebApp from '@/utils/webapp';
import { exchangeRate } from '@/utils/countryFile';
import { TabsProps, TableProps, DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { advDetail, panelModel, DetailItem } from '@/types/model.home';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const loading = ref(true);
const accountData = JSON.parse(localStorage.getItem('account')).account

const selectForm = reactive({
    action_name: '',
    tenant_id: accountData.tenant_id,
    adv_manager_id: accountData.store_id,
    county_code: 'IT',
});
const shopTableList = ref<TableProps['data']>([])
const columnsShop = reactive([
    { colKey: 'strategyName', title: '策略名称组件', align: 'center', width: 200 },
    // { colKey: 'life_cycle_label', title: '产品生命周期', align: 'center', width: 120 },
    // { colKey: 'action_name', title: '操作动作', align: 'center', width: 100 },
    // { colKey: 'term_type_label', title: '操作具体对象', align: 'center', width: 140, },
    { colKey: 'strategy_desc', title: '策略说明', align: 'center', width: 180, },
    { colKey: 'action_recommend_date', title: '策略生效时间', align: 'center', width: 140, sortType: 'all', sorter: true },
    {
        colKey: 'change_acos', title: '采纳前后7天ACOS变化', align: 'center', width: 140, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.change_acos + '%';
        },
    },
    { colKey: 'last30d_impressions', title: '近30天曝光', align: 'center', width: 110, sortType: 'all', sorter: true },
    { colKey: 'last30d_clicks', title: '近30天点击量', align: 'center', width: 120, sortType: 'all', sorter: true },
    { colKey: 'last30d_order_quantity', title: '近30天销售量', align: 'center', width: 120, sortType: 'all', sorter: true },
    {
        colKey: 'last30d_sale_amt', title: '近30天销售额', align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.last30d_sale_amt, row.currency_code)
            return cost
        }
    },
    { colKey: 'handle', title: '操作', align: 'center', fixed: 'right', width: 110 },
]);
const paginationShop = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const shopSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});
watch(
    () => selectForm.action_name,
    (value) => {
        console.log('watch===', value)
    },
);

const addTab = (row: advDetail) => {
    row.last30d_sale_amt_new = row.last30d_sale_amt && row.currency_code ? exchangeRate(row.last30d_sale_amt, row.currency_code) : ''
    window.open('#/reduceCost/negativeWordDetail?menu_name=' + WebApp.getQueryFromUrl('check') + '&strategy_row=' + encodeURI(JSON.stringify(row)))
};

onMounted(() => {
    selectForm.action_name = decodeURI(WebApp.getQueryFromUrl('title'))
    getTableData(selectForm.action_name);
});
onUnmounted(() => {
});
const shopRequest = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            shopTableList.value = shopTableList.value && shopTableList.value
                .concat()
                .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            shopTableList.value = shopTableList.value && shopTableList.value.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const shopSortChange: TableProps['onSortChange'] = (val) => {
    shopSort.value = val;
    shopRequest(val);
};
const handleChangeShop = (pageInfo: any) => {
    paginationShop.defaultCurrent = pageInfo.current as number;
    paginationShop.defaultPageSize = pageInfo.pageSize as number;
};

async function getTableData(action_name: string) {
    const res = await getAdvstrategylist({ action_name, tenant_id: selectForm.tenant_id, adv_manager_id: selectForm.adv_manager_id, county_code: selectForm.county_code });
    loading.value = false;
    shopTableList.value = res;
    paginationShop.total = res.length;
}

</script>
<style lang="less" scoped>
@import url('@/style/common.less');
</style>
