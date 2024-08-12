<template>
    <div class="page">
       
        <t-layout>
            <head-menu :head-title="t('menu5_2')" />
            <t-content>
                <t-card :bordered="false" class="main_content_one">
                    <t-tabs class="card-tab" v-model="type">
                        <t-tab-panel value="alarm" label="策略模板列表">
                        </t-tab-panel>
                        <t-tab-panel value="potential" label="我的收藏">
                        </t-tab-panel>
                        <t-tab-panel value="app" label="我的应用">
                        </t-tab-panel>

                    </t-tabs>
                    <div class="row mb-3 ">
                        <div class="col-lg-1">
                            <t-button class="applybtn" @click="editModel"> 批量应用 </t-button>
                        </div>
                        <div class="col-lg-1">
                            <t-button class="applybtn" @click=" "> 批量暂停 </t-button>
                        </div>
                        <div class="col-lg-2">

                            <t-select class="select_type" v-model="panelData.formData.asin" clearable placeholder="负责人">
                                <t-option v-for="(ele, index) in panelData.parent_asin_info" :key="index" :label="ele"
                                    :value="ele" />
                            </t-select>
                        </div>
                        <div class="col-lg-2">
                            <t-select class="select_type" clearable v-model="panelData.formData.campaign_name"
                                placeholder="策略类型">
                                <t-option v-for="(ele, index) in panelData.campaigns_info" :key="index" :label="ele"
                                    :value="ele" />
                            </t-select>
                        </div>
                        <div class="col-lg-2">
                            <t-select class="select_type" clearable v-model="panelData.formData.adv_manager_name"
                                placeholder="应用状态">
                                <t-option>应用中</t-option>
                                <t-option>未到时间</t-option>
                                <t-option>已暂停</t-option>
                            </t-select>
                        </div>

                        <div class="col-lg-2">
                            <t-date-range-picker allow-input clearable />
                        </div>
                        <div class="col-lg-2">
                            <img class="search_icon" @click="filterDetailTable(panelData.formData, panelData.value)"
                                :src="WebApp.getImage('common/search-icon.png')" alt="">

                        </div>
                    </div>
                    <div ref="tableRef">
                        <t-table row-key="row_id" :data="panelData.detail" headerAffixedTop verticalAlign="bottom"
                            :style="{ width: `${tableWidth}px` }" :loading="loading" tableLayout="fixed"
                            :columns="columnsDetail" :bordered="false" :pagination="paginationDetail"
                            :selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange"
                            :sort="detailSort" cell-empty-content="/" @sort-change="detailSortChange"
                            :hide-sort-tips="true" @page-change="handleChangeDetail">


                            <template #applyState="{ row }">
                                <span v-if="row.status === false" class="text-danger">未应用</span>
                                <span v-else class="text-success">已应用</span>
                            </template>
                            <template #handle="{ row }">
                                <span class="hand_detail" @click="addWordApply(row)">暂停</span>
                                <span class="hand_detail" @click="addWordApply(row)">应用</span>
                                <span class="hand_detail" @click="addWordApply(row)">刷新</span>
                                <t-popup>
                                    <span class="hand_detail" @click="addWordApply(row)">更多</span>
                                    <template #content>
                                        <div>触发元素是指触发浮层内容显示的元素</div>
                                    </template>
                                </t-popup>

                            </template>
                        </t-table>
                    </div>
                    <t-dialog v-model:visible="visible" header="编辑模版" width="700px" :confirm-on-enter="true"
                        :cancel-btn="null" :confirm-btn="null" :on-close="close">
                        <t-descriptions :column="2" layout="horizontal" item-layout="horizontal">
                            <t-descriptions-item label="模板名称">2829999999</t-descriptions-item>
                            <t-descriptions-item label="详情描述">这里是详情</t-descriptions-item>
                            <t-descriptions-item label="操作对象">李某某</t-descriptions-item>
                            <t-descriptions-item label="策略类型">精准否词</t-descriptions-item>
                        </t-descriptions>
                        <t-space></t-space>
                        <div class="infoblock">
                            <h4>基础信息</h4>
                            <t-form :data="formData" :rules="basicRules">
                                <t-form-item label="统计维度" name="weidu">
                                    <t-radio v-model="formData.weidu">广告活动</t-radio>
                                </t-form-item>
                                <t-form-item label="统计周期" name="time">
                                    <t-select v-model="formData.time" class="selectItem">
                                        <t-option key="apple" label="近30天" value="近30天" />
                                        <t-option key="banana" label="近315天" value="近15天" />
                                    </t-select>
                                </t-form-item>
                                <t-form-item label="投放类型" name="type2">
                                    <t-radio-group v-model="formData.type2">
                                        <t-radio value="1">不限</t-radio>
                                        <t-radio value="2">自动</t-radio>
                                        <t-radio value="3">手动</t-radio>
                                    </t-radio-group>
                                </t-form-item>

                            </t-form>
                        </div>
                        <div class="infoblock">
                            <h4>自定义信息</h4>
                            <t-form :data="formData" class="custom_form" labelAlign="left" label-width="160px">
                                <t-form-item label="FBA首次入库时间" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-input class="inputItem" suffix="天" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                                <t-form-item label="上架时间" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-input class="inputItem" suffix="天" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                                <t-form-item label="自然搜索坑位排名" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-input class="inputItem" suffix="天" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                                <t-form-item label="ABA排名30天飙升比例" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-input class="inputItem" suffix="天" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                                <t-form-item label="点击量" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-input class="inputItem" suffix="天" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                                <t-form-item label="转化率" name="weidu">
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>
                                    <t-select class="selectItem">
                                        <t-option key="apple" label="大于" value="大于" />
                                        <t-option key="banana" label="小于" value="小于" />
                                    </t-select>

                                    <t-input class="inputItem" suffix="%" type="number" />
                                    <img class="custom_del" :src="WebApp.getImage('common/delete.png')" alt="">
                                </t-form-item>
                            </t-form>

                        </div>
                        <div class="foot_btn">

                            <t-button theme="default" variant="base">{{ t('btn.cancel') }}</t-button>
                            <t-button theme="default" variant="base">恢复</t-button>
                            <t-button> 保存修改</t-button>
                        </div>
                    </t-dialog>
                </t-card>

            </t-content>
        </t-layout>



    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import 'animate.css';
import { getAdvstrategydetail, getListCostData, addnegkeywords, addnegproducts } from '@/api/intelligentDelivery';
import * as WebApp from '@/utils/webapp';
import { FormProps, TableProps, DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { advDetail } from '@/types/model.home';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const type = ref('alarm')
const loading = ref(true);
const accountData = JSON.parse(localStorage.getItem('account')).account

const selectForm = reactive({
    strategy_type_id: 'jzfcfp',
    tenant_id: accountData.tenant_id,
    adv_manager_id: accountData.store_id,
    county_code: 'IT',
});
const formData: FormProps['data'] = reactive({
    name: '',
    description: '',
    actionobj: '',
    type: '',
    weidu: '',
    time: '',
    type2: ''
});
const basicRules: FormProps['rules'] = {

    weidu: [
        { required: true, message: '必填' },
    ],

    time: [{ required: true, message: '必填' }],
    type: [{ required: true, message: '必填' }],

};
const strategyList: advDetail = reactive({
    strategy_id: ''
})
const menu_name = WebApp.getQueryFromUrl('menu_name')
const tableRef = ref(null);
const tableWidth = ref(0);
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
            category_name: ''
        },
        costData: {}
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
    { colKey: 'row_id', title: '策略模板ID' },
    { colKey: 'row_id', title: '策略模板名称' },
    { colKey: 'row_id', title: '策略模板介绍' },
    { colKey: 'row_id', title: '策略类型' },
    { colKey: 'row_id', title: '负责人' },
    { colKey: 'row_id', title: '应用时间' },
    { colKey: 'applyState', title: '当前应用状态' },
    { colKey: 'row_id', title: '当前应用对象数量' },
    { colKey: 'handle', title: '操作', fixed: 'right', width: 140 },
]);
const paginationDetail = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const visible = ref(false);
const selectedRowKeys = ref<TableProps['selectedRowKeys']>([]);

onMounted(() => {
    loading.value = false;
    if (tableRef.value) {
        tableWidth.value = tableRef.value.offsetWidth;
        console.log("Table width:", tableWidth.value); // 输出宽度到控制台
    }

   
});
onUnmounted(() => {
});
 
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

const filterDetailTable = (formData: any, index: string) => {
    const deepCopiedDetail = JSON.parse(JSON.stringify(panelData.value.oldDetail)); // 深拷贝示例数据
    panelData.value.detail = WebApp.filterDetails(deepCopiedDetail, {
        asin: formData.asin,
        campaign_name: formData.campaign_name,
        adv_manager_name: formData.adv_manager_name,
        category_name: formData.category_name
    });
    paginationDetail.total = panelData.value.detail.length;
    paginationDetail.defaultCurrent = 1;
}


const editModel = (row_id: string) => {
    visible.value = true;
};
const close: DialogProps['onClose'] = (context) => {
};

async function getAdvDetaildata(strategy_id: string, action_name?: string) {
    loading.value = false;
    const res = await getAdvstrategydetail({ action_name, strategy_id, strategy_type_id: selectForm.strategy_type_id, tenant_id: selectForm.tenant_id, adv_manager_id: selectForm.adv_manager_id,   county_code: selectForm.county_code });
    Object.assign(panelData.value, {
        detail: res.data_list,
        oldDetail: res.data_list,
        campaigns_info: res.campaigns_info,
        managers_info: res.managers_info,
        parent_asin_info: res.parent_asin_info,
        category_info: WebApp.convertData(res.category_info.category_data)
    });


    paginationDetail.total = res.data_list.length
}


async function addWordApply(row: any) {
    const form = reactive({
        match_type: strategyList.action_name === '精准否词' ? "NEGATIVE_EXACT" : 'ASIN_SAME_AS',
        row_ids: [row.row_id.toString()]
    })
    const res = strategyList.action_name === '精准否词' ? await addnegkeywords(form) : await addnegproducts(form);
    MessagePlugin.success('应用成功！')
    panelData.value.detail = panelData.value.detail.map((item: any) => ({
        ...item,
        status: item.row_id === row.row_id ? true : item.status
    }));

}
async function HandleWordApply() {
    if (selectedRowKeys.value && !selectedRowKeys.value.length) {
        MessagePlugin.error("未选择广告活动！");
        return;
    }
    const form = reactive({
        match_type: strategyList.action_name === '精准否词' ? "NEGATIVE_EXACT" : 'ASIN_SAME_AS',
        row_ids: selectedRowKeys.value ? selectedRowKeys.value.map((element: number) => element.toString()) : []
    });
    const res = strategyList.action_name === '精准否词' ? await addnegkeywords(form) : await addnegproducts(form);
    MessagePlugin.success('批量应用成功！')
    getAdvDetaildata(strategyList.strategy_id, strategyList.action_name);
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');


.title_icon {
    width: 24px;
    height: 24px;
}

.main_content_one {
    .card-tab{
        margin-bottom: 20px;
    }
    .applybtn {
        background: #E2F3FE;
        border: none;
        border-radius: 4px;
        color: #237FFA;

    }

    .search_icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
}

.infoblock {
    margin: 0 20px;
}

.custom_form {
    width: 100%;

    .selectItem {
        width: 140px;
    }

    .inputItem {
        width: 140px;
    }

    .custom_del {
        width: 20px;
        height: 20px;
        margin-left: 10px;
    }
}

.foot_btn {
    width: 40%;
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .t-button {
        border: none;
        border-radius: 4px;
        color: #1F2733;
        background: #F2F4F7;
    }

    .t-button--variant-base.t-button--theme-primary:not(.t-is-disabled):not(.t-button--ghost) {
        background: #237FFA;
        color: #fff;
    }

}
</style>