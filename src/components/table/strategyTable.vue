<template>
    <div>
        <h4 class="table_title">策略列表</h4>

        <t-table :style="{ width: `${screenWidth}px` }" row-key="row_id" headerAffixedTop :data="shopTableList"
            :loading="loading" table-layout="fixed" :columns="columnsShop" :bordered="false"
            :pagination="paginationShop" :sort="shopSort" cell-empty-content="/" @sort-change="shopSortChange"
            :hide-sort-tips="true" @page-change="handleChangeShop">

            <template #strategyName="{ row }">
                <div class="table-name">
                    <div class="table-title">
                        <p class="tooltip-text" :title="row.strategy_name"> {{ row.strategy_name }} </p>
                        <span class="tip-primary">{{ row.term_type_label }}</span>
                    </div>
                    <p> 统计粒度：{{ row.statistic_dim }}</p>
                    <p> 生命周期：{{ row.life_cycle_label }}</p>
                </div>
            </template>
            <template #handle="{ row }">
                <span class="hand_detail" @click="addTab(row)">查看明细</span>
            </template>
        </t-table>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import 'animate.css';
import { getAdvstrategylist } from '@/api/intelligentDelivery';
import * as WebApp from '@/utils/webapp';
import { exchangeRate } from '@/utils/countryFile';
import { TableProps } from 'tdesign-vue-next';
import { advDetail } from '@/types/model.home';
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
    { colKey: 'strategyName', title: '策略名称', align: 'center', width: 200 },
    { colKey: 'strategy_desc', title: '策略说明', align: 'center', width: 180, },
    { colKey: 'action_recommend_date', title: '策略生效时间', align: 'center', width: 140, sortType: 'all', sorter: true },
    {
        colKey: 'change_acos', title: '采纳前后7天ACOS变化', align: 'center', width: 220, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.change_acos + '%';
        },
    },
    { colKey: 'last30d_impressions', title: '近30天曝光', align: 'center', width: 130, sortType: 'all', sorter: true },
    { colKey: 'last30d_clicks', title: '近30天点击量', align: 'center', width: 150, sortType: 'all', sorter: true },
    { colKey: 'last30d_order_quantity', title: '近30天销售量', align: 'center', width: 150, sortType: 'all', sorter: true },
    {
        colKey: 'last30d_sale_amt', title: '近30天销售额', align: 'center', width: 150, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.last30d_sale_amt, row.currency_code)
            return cost
        }
    },
    { colKey: 'handle', title: '操作', align: 'center',fixed:'right', width: 110 },
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
    const check =selectForm.action_name;
    const url=ref('')
    //  check === 'adjustPrice'不确定
    if (check === '精准否词' || check === '精准否品') {
        url.value='#/reduceCost/negativeWordDetail'
    } else if (check === '否词根') {
        url.value='#/reduceCost/negativeRootDetail'
    } else if (check === '暂停投放词' || check === '暂停投放品') {
        url.value='#/reduceCost/pauseWordDetail'
    } else if (check === '暂停推广品' || check === '添加推广品') {
        url.value='#/reduceCost/pausePromotionDetail'
    } else if (check === '添加投放大词' || check === '添加投放小词' || check === '添加投放品' || check === '好词晋升') {
        url.value='#/expansionFlow/addBigWordDetail'
    } else if (check === '竞价调整' || check === '预算调整') {
        url.value='#/intelligentDelivery/adjustingBudgetDetail'
    }
    window.open(url.value+'?title=' + WebApp.getQueryFromUrl('title') + '&strategy_row=' + encodeURI(JSON.stringify(row)))

};
const screenWidth = ref(0);

onMounted(() => {
    screenWidth.value = window.innerWidth - 305;
    console.log(window.innerWidth)
    window.addEventListener('resize', updateScreenWidth);

    selectForm.action_name = decodeURI(WebApp.getQueryFromUrl('title'))
    getTableData(selectForm.action_name);
});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);

});
function updateScreenWidth() {
    screenWidth.value = window.innerWidth - 305;
}
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
    const res = await getAdvstrategylist({ action_name });
    loading.value = false;
    shopTableList.value = res;
    paginationShop.total = res.length;
}

</script>
<style lang="less" scoped>
@import url('@/style/common.less');
</style>
