<template>
    <div class="page">
        <t-layout>
            <head-menu :head-title="t('menu2')" />
            <t-content>
                <t-card :bordered="false" header-bordered class="main_content_one">
                    <template #header>
                        <div class="header_block">
                            <div class="block d-flex align-items-center ">
                                <t-select class="select_type" style="width: 100px;" v-model="formData.type_filter"
                                    @change="changeType">
                                    <t-option key="parent_asin" :label="t('menu1_details.select_person')" value="parent_asin" />
                                    <t-option key="member" :label="t('menu1_details.select_asin')" value="member" />
                                </t-select>
                               
                                <t-cascader v-if="formData.type_filter === 'parent_asin'" class="select_id" multiple
                                    v-model="formData.asin_ids" :options="asinOptions" clearable filterable  :min-collapsed-num="3"  :show-all-levels="false" 
                                     :keys="{ label: 'value', value: 'value', children: 'child' }" style="width:500px"
                                    @change="asinChange" />
                                <t-select v-if="formData.type_filter === 'member'" class="select_id"
                                    @change="userChange" style="width:360px" v-model="formData.user_ids">
                                    <t-option v-for="(item, index) in personOptions" :key="index"
                                        :label="item.real_name" :value="item.adv_manager_id" />
                                </t-select>
                                <t-input style="width: 180px;margin-right: 10px"  v-if="formData.type_filter === 'parent_asin'" 
                                clearable   v-model="childAsin" placeholder="输入子asin查询父asin"></t-input>
                                <t-button class="button-primary"  v-if="formData.type_filter === 'parent_asin'"  @click="searchParentAsin">查询</t-button>
                            </div>
                            <div class="block d-flex justify-content-start align-items-center">
                                <span style="width:80px">相关数据</span>
                                <t-upload v-model="files" class="form-upload" action="/web/api/upload"
                                    :accept="'.xls,.xlsx'" :size-limit="{ size: 10, unit: 'MB' }" :headers="headerToken"
                                    :abridge-name="[8, 6]" multiple @fail="handleFail" @success="handleSuccess">
                                    <span class="hand_detail">请选择文件</span>
                                </t-upload>
                                <span class="hand_detail">下载表格示例</span>
                            </div>
                            
                        </div>

                    </template>

                    <t-card :bordered="false"  v-if="formData.type_filter === 'member'"  class="shop_card">
                         
                        <div class="shop_info">
                            <div class="userInfo">
                                <img class="img_avatar" :src="shopInfo.avatar" alt="" />
                                <div class="user_info">
                                    <h3>{{blockData.user_info.name}}</h3>
                                    <p>账号已使用{{blockData.user_info.time.year}}年{{blockData.user_info.time.months}}月</p>
                                </div>
                            </div>
                            <div class="shop_tip" style="margin-left: 120px">
                                <p>销售额</p>
                                <h3>{{ exchangeRate(blockData.store_count, 'USD') }}</h3>
                            </div>
                            <div class="shop_tip">
                                <p>销量</p>
                                <h3>{{ blockData.asin_count }}</h3>
                            </div>
                            <div class="shop_tip">
                                <p>广告花费</p>
                                <h3>{{ exchangeRate(blockData.ad_cost, 'USD') }}</h3>
                            </div>
                            <div class="shop_tip">
                                <p>ACOS</p>
                                <h3>{{ blockData.acos }}%</h3>
                            </div>
                        </div>
                    </t-card>
                    <div class="shop_table">
                        <div class="timeGroup"  >
                            <h4 class="table_title" v-if="formData.type_filter === 'parent_asin'">店铺已关联的广告活动</h4>
                            <h4 class="table_title" v-else>负责人已关联的广告活动</h4>
                                <div class="timeInput">统计时间：{{ formData.st }}-{{ formData.ed }}</div>
                            </div>
                        <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId" :data="adTableList"
                            :loading="loading" table-layout="fixed" :columns="columns1" :bordered="false"
                            :pagination="paginationOne" cell-empty-content="/" @sort-change="adSortChange"
                            :hide-sort-tips="true" @page-change="handleChangeOne">
                            <template #name="{ row }">
                                <div class="table-name">
                                    <div class="table-title">
                                        <p class="tooltip-text" :title="row.name"> {{ row.name }} </p>
                                        <span class="tip-primary">{{ row.status === 'ENABLED' ? '生效中' : '已中止' }}</span>
                                    </div>
                                </div>
                            </template>
                        </t-table>
                    </div>
                </t-card>
                <div class="main_content_three">
                    <div class="card mb-3 mb-lg-5">
                        <div class="card-header">
                            <div class="card-header-back">
                                <h4 class="card-header-title">广告策略建议</h4>
                            </div>
                        </div>
                        <div class="card-content">
                            <t-tabs class="card-tab" :default-value="'降本增效'" v-model="formData.action_type"
                                @change="getAdvstrategySuggestTable">
                                <t-tab-panel :value="'降本增效'" label="降本增效">
                                </t-tab-panel>
                                <t-tab-panel :value="'拓展流量'" label="拓展流量">
                                </t-tab-panel>
                                <t-tab-panel :value="'竞价调整'" label="竞价调整">
                                </t-tab-panel>
                                <t-tab-panel :value="'预算调整'" label="预算调整">
                                </t-tab-panel>

                            </t-tabs>
                            <div class="main_blocks">
                                <div class="main_block">
                                    <img class="main_bgd" :src="WebApp.getImage('common/card.png')" alt="">
                                    <div class="main_block_con">
                                        <div class="tit">
                                            <span class="main_t">广告花费节省</span>
                                            <h3>
                                                预计：{{
                                                    exchangeRate(blockData.cost_save.forecast_value,
                                                        blockData.cost_save.currency_code)
                                                }}
                                            </h3>

                                        </div>
                                        <div class="badge bg-soft-down  text-danger ms-4">
                                            <img :src="WebApp.getImage('common/line_chart_down.png')" alt="">
                                            {{ blockData.cost_save.compare_value }}%
                                        </div>

                                    </div>
                                </div>
                                <div class="main_block">
                                    <img class="main_bgd" :src="WebApp.getImage('common/card.png')" alt="">
                                    <div class="main_block_con">
                                        <div class="tit">
                                            <span class="main_t">ACOS下降</span>
                                            <h3>
                                                预计：{{ blockData.acos_down.forecast_value }}%
                                            </h3>
                                        </div>
                                        <div class="badge  bg-soft-down text-danger ms-4">
                                            <img :src="WebApp.getImage('common/line_chart_down.png')" alt="">
                                            {{ blockData.cost_save.compare_value }}%
                                        </div>

                                    </div>
                                </div>
                                <div class="main_block">
                                    <img class="main_bgd" :src="WebApp.getImage('common/card.png')" alt="">
                                    <div class="main_block_con">
                                        <div class="tit">
                                            <span class="main_t">销售额提升</span>
                                            <h3>
                                                预计：{{
                                                    exchangeRate(blockData.sale_up.forecast_value,
                                                        blockData.sale_up.currency_code)
                                                }}
                                            </h3>
                                        </div>
                                        <div class="badge bg-soft-up text-success ms-4">
                                            <img :src="WebApp.getImage('common/line_chart_up.png')" alt="">
                                            {{ blockData.sale_up.compare_value }}%
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId" :data="adviceTableList"
                                :loading="loading" :table-layout="'fixed'" :columns="columnsAdvice" :bordered="false"
                                :pagination="paginationAdvice" cell-empty-content="/" @sort-change="adviceSortChange"
                                :hide-sort-tips="true" @page-change="handleChangeAdvice">
                                <template #action_name="{ row }">
                                    <div class="table-name">
                                        <div class="table-title">
                                            <p class="tooltip-text" :title="row.action_name"> {{
                                                row.action_name }} </p>
                                            <span class="tip-primary">{{ row.action_term }}</span>
                                        </div>
                                        <p>统计粒度：{{ row.statistic_dim }}</p>
                                    </div>
                                </template>
                                <template #handle="{ row }">
                                <span class="hand_detail" @click="toStragyList(row)">查看明细</span>
                            </template>
                            </t-table>
                        </div>

                    </div>

                </div>
            </t-content>

        </t-layout>


    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, Ref, ref, UnwrapNestedRefs, watch } from 'vue';
import 'animate.css';
import * as WebApp from '@/utils/webapp';
import { MessagePlugin, UploadProps, TableProps, SelectProps } from 'tdesign-vue-next';
import { exchangeRate } from '@/utils/countryFile';
import { getShopDetail, getAssociateAsin, getAssociateManager, getAdvstrategySuggest } from '@/api/intelligentDiagnosis';
import { getAllUser,getAllAsins,searchAsin} from '@/api/home';
import { formatDate } from '@/utils/date';
import dayjs from 'dayjs';
import { accountInfo, shopSelect, shopData } from '@/types/model.home';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const headerToken = computed(() => {
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    if (authToken === null) {
        WebApp.toPage('/login/index');
    }
    return { 'Authorization': 'Bearer ' + authToken.token }
})
const accountData: accountInfo = JSON.parse(localStorage.getItem('account')).account
const range = ref([dayjs().subtract(29, 'day').toDate(), dayjs().toDate()]);

const formData = reactive({
    type_filter: 'parent_asin',
    user_ids: 0,
    asin_ids:[],
    asin_id: '',
    country_code: 'IT',
    shopFile: [],
    action_type: '降本增效',
    st: '',
    ed: ''

});
const childAsin=ref('')

const files = ref<UploadProps['value']>([]);
const personOptions: Array<shopSelect> = reactive([])

const asinOptions: Array<shopSelect> = reactive([])
const blockData = reactive({
    
    currency_code: '',
    // 负责人维度
    store_count:'',
    asin_count:'',
    ad_cost:'',
    acos:'',
    user_info:{
        time:{}
    },
    cost_save: {
        forecast_value: '',
        currency_code: '',
        compare_value: ''
    },//节省
    acos_down: {
        forecast_value: '',
        compare_value: ''
    },//acos下降
    sale_up: {
        forecast_value: '',
        currency_code: '',
        compare_value: ''
    },//销售额提升
})
const shopInfo: shopData = reactive({})
const loading = ref(true);
const paginationOne = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const columns1 = reactive([
    { colKey: 'name', title: '广告活动名称', align: 'center', width: 200 },
    {
        colKey: 'acos', title: 'ACOS', align: 'center', width: 120, sortType: 'all', sorter: true,
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
        colKey: 'budget', title: '广告预算', align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.budget, row.currency_code)
            return cost
        }
    },
    {
        colKey: 'cost', title: '广告花费', align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.cost, row.currency_code)
            return cost
        }
    },
    {
        colKey: 'sale', title: '销售额', align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.sale, row.currency_code)
            return cost
        }
    },
    { colKey: 'count_num', title: '订单数', align: 'center', width: 120, sortType: 'all', sorter: true },
    { colKey: 'order_num', title: '销量', align: 'center', width: 120, sortType: 'all', sorter: true },
    { colKey: 'impressions', title: '曝光量', align: 'center', width: 120, sortType: 'all', sorter: true },
    { colKey: 'clicks', title: '点击量', align: 'center', width: 120, sortType: 'all', sorter: true },
    {
        colKey: 'pay_rate', title: '转化率', align: 'center', width: 120, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;

            return row.pay_rate + '%';
        }
    },
]);
const adTableList = ref<TableProps['data']>([])
const adSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});

const adviceTableList = ref<TableProps['data']>([])
const adviceSort = ref<TableProps['sort']>({
    sortBy: ' ',
    descending: true
});

const columnsAdvice = reactive([
    { colKey: 'action_name', title: '操作动作名称', align: 'center', width: 200 },
    {
        colKey: 'last30d_acos', title: '最近30天ACOS', align: 'center', width: 200, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            if (row.last30d_sale_amt === 0) {
                return '/';

            } else {
                return row.last30d_acos + '%';
            }
        }
    },
    {
        colKey: 'last30d_cost', title: '最近30天广告花费', align: 'center', width: 180, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.last30d_cost, row.currency_code)
            return cost
        }
    },
    {
        colKey: 'last30d_ad_spend_pct', title: '最近30天广告花费占比', align: 'center', width: 200, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.last30d_ad_spend_pct + '%';
        }
    },
    {
        colKey: 'last30d_sale_amt', title: '最近30天销售额', align: 'center', width: 180, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const cost = exchangeRate(row.last30d_sale_amt, row.currency_code)
            return cost
        }
    },
    {
        colKey: 'prepost7d_acos_delta', title: '采纳前后7天acos变化', align: 'center', width: 200, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.prepost7d_acos_delta + '%';
        }
    },
    {
        colKey: ' last30d_conv_rate', title: '最近30天转化率', align: 'center', width: 180, sortType: 'all', sorter: true,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;

            return row.last30d_conv_rate + '%';
        }
    },
    { colKey: 'handle', title: '操作', align: 'center',width: 110 },

]);
const paginationAdvice = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});

const handleFail: UploadProps['onFail'] = ({ file }) => {
    MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
const handleSuccess: UploadProps['onSuccess'] = ({ file }) => {
    MessagePlugin.success(`文件 ${file.name} 上传成功`);
};
const screenWidth = ref(0);

onMounted(() => {
    screenWidth.value = window.innerWidth - 305;
    console.log(screenWidth.value)
    window.addEventListener('resize', updateScreenWidth);

    formData.st = WebApp.formatDate(range.value[0], 'yyyyMMdd')
    formData.ed = WebApp.formatDate(range.value[1], 'yyyyMMdd')
    // user_id字段暂无用处，以store_id查询
    formData.user_ids = accountData.store_id
    getSelectAsin();
    getSelectUser();
    getShopDetailData();

});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});
function updateScreenWidth() {
    screenWidth.value = window.innerWidth - 305;
}
const changeType = () => {
    if (formData.type_filter === 'member') {
        getADManagerTable();
        getAdvstrategySuggestTable()
    } else {
        getADShopTable();

    }
}
const asinChange = (value: CascaderValue<CascaderOption>, context: CascaderChangeContext<CascaderOption>)=> {
    console.log('asinchange==',value,formData.asin_ids)
    const data= WebApp.extractMarketplaceAsins(asinOptions,formData.asin_ids);
    formData.asin_id = JSON.stringify(data)
    getADShopTable();
    getAdvstrategySuggestTable();
}
const userChange = () => {
    getADManagerTable();
    getAdvstrategySuggestTable()
} 
const toStragyList=(row:any)=>{
    sessionStorage.setItem('expanded',JSON.stringify(["3",'降本增效']))
    window.open('#/reduceCost/negativeWord?title='+row.action_name)

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
const adSortChange: TableProps['onSortChange'] = (val) => {
    adSort.value = val;
    request(val);
};
const adviceRequest = (sort: TableProps['sort']) => {
    // 模拟异步请求，进行数据排序
    if (Array.isArray(sort)) return;
    const timer = setTimeout(() => {
        if (sort) {
            adviceTableList.value = adviceTableList.value && adviceTableList.value
                .concat()
                .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
            adviceTableList.value = adviceTableList.value && adviceTableList.value.concat();
        }
        clearTimeout(timer);
    }, 100);
};
const adviceSortChange: TableProps['onSortChange'] = (val) => {
    adviceSort.value = val;
    adviceRequest(val);
};
const handleChangeOne = (pageInfo: any) => {
    paginationOne.defaultCurrent = pageInfo.current as number;
    paginationOne.defaultPageSize = pageInfo.pageSize as number;
};
const handleChangeAdvice = (pageInfo: any) => {
    paginationAdvice.defaultCurrent = pageInfo.current as number;
    paginationAdvice.defaultPageSize = pageInfo.pageSize as number;
};
async function getSelectUser() {
    const res = await getAllUser();
    Object.assign(personOptions, res.employers)
}
async function getSelectAsin() {
    const res = await getAllAsins();
    Object.assign(asinOptions, res)
    formData.asin_ids = asinOptions.reduce((acc, item) => {
        const leafValues = WebApp.getLeafValues(item);
        return acc.concat(leafValues);
    }, []);
    const data=WebApp.extractMarketplaceAsins(asinOptions,formData.asin_ids);
    formData.asin_id = JSON.stringify(data)
    getADShopTable();
    getAdvstrategySuggestTable();
}
async function searchParentAsin() {
    if(childAsin.value===''){
        MessagePlugin.warning('请输入子asin！')
        return false
    }
    const res = await searchAsin({asin:childAsin.value});
    console.log('search==',res)
    const asin_ids=ref([])
    res.forEach((item)=>{
        asin_ids.value.push(item.parent_asin)
    })
    formData.asin_ids=asin_ids.value
    asinChange()
}
async function getShopDetailData() {
    const res = await getShopDetail({ stored_id: accountData.store_id });
    Object.assign(shopInfo, res)
}

async function getADShopTable() {
    const res = await getAssociateAsin({  param_id:formData.asin_id });
    loading.value = false;
    if(res.code===200&&res.data){
        adTableList.value = res.data.campaigns;
        paginationOne.total = res.data.campaigns.length;
        
    }else{
        MessagePlugin.warning('ASIN暂无数据！')
        adTableList.value=[]
        paginationOne.total=0;
       
    }

}
async function getADManagerTable() {
    const res = await getAssociateManager({ tenant_id: accountData.tenant_id, adv_manager_id: formData.user_ids });
    loading.value = false
    adTableList.value = res.campaigns;
    paginationOne.total = res.campaigns.length;
    blockData.acos = res.acos
    blockData.ad_cost = res.ad_cost
    blockData.asin_count = res.asin_count
    blockData.store_count = res.store_count
    blockData.currency_code = res.currency_code
    blockData.user_info=res.user_info;
}

//
async function getAdvstrategySuggestTable() {

    const params = ref({})
    adviceTableList.value = [];
    if (formData.type_filter === 'member') {
        params.value = {
            action_type: formData.action_type,
            type_filter: formData.type_filter,
            tenant_id: accountData.tenant_id,
            adv_manager_id: formData.user_ids,
            country_code: formData.country_code
        }
    } else {
        params.value = {
            action_type: formData.action_type,
            type_filter: formData.type_filter,
            tenant_id: accountData.tenant_id,
            adv_manager_id: formData.user_ids,
            param_id:formData.asin_id,
            country_code: formData.country_code
        }
    }
    const res = await getAdvstrategySuggest(params.value);
    console.log('getAdvstrategySuggestTable',res)
    if(res.code===200&&res.data){
        adviceTableList.value = res.data.strategy_info;
        paginationAdvice.total = res.data.strategy_info.length;
        Object.assign(blockData.cost_save, res.data.cost_save)
        Object.assign(blockData.acos_down, res.data.acos_down)
        Object.assign(blockData.sale_up, res.data.sale_up)
    }else{
        adviceTableList.value =[];
        paginationAdvice.total=0
    }
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/style/style.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');

.main_content_one {

    .header_block {
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .block {
            margin: 0 10px;
        }

       
    }

    .form-upload {
        width: 200px;
        height: 100%;

        // :deep(.t-upload__single-input-preview),
        // :deep(.t-button) {
        //     display: block;
        //     width: 100%;
        //     height: 100%;
        //     padding: 0.6125rem 1rem;
        //     font-size: 0.875rem;
        //     font-weight: 400;
        //     line-height: 1.5;
        //     color: #1e2022;
        //     background-color: #fff;
        //     background-clip: padding-box;
        //     border: 0.0625rem solid rgba(231, 234, 243, 0.7) !important;
        //     -webkit-appearance: none;
        //     -moz-appearance: none;
        //     appearance: none;
        //     border-radius: 0.3125rem;
        //     transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        // }
    }



    .shop_card {
        background: @back-info2;

        .shop_info {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            .userInfo {
                width: 20%;
                border-right: 1px dashed #C9C9C9;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

                .img_avatar {
                    border-radius: 50%;
                    width: 64px;
                    height: 64px;
                }

                .user_info {
                    height: 100%;
                    line-height: 100%;
                    margin: auto 24px;

                    p,
                    h3 {
                        margin-bottom: 10px;
                    }
                }
            }

            .shop_tip {
                margin: auto 60px;

                p {
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 22px;
                    text-align: left;
                    color: #929AA6;
                }

                h3 {
                    font-family: MiSans;
                    font-size: 22px;
                    font-weight: 500;
                    line-height: 30px;
                    text-align: left;
                    color: @color-info;

                }
            }

        }
    }

    .shop_table {
        margin: 20px 0;
        .timeGroup {
          display: flex;
          justify-content: space-between;
        }


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



.main_blocks {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .main_block {
        margin: 20px 0;
        width: 32.5%;
        position: relative;

        .main_bgd {
            width: 100%;
        }

        .main_block_con {
            position: absolute;
            top: 16%;
            left: 10%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            width: 80%;
            height: 80%;

            .tit {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;

                .main_t {
                    font-family: PingFang SC;
                    font-weight: 400;
                    line-height: 20px;
                    text-align: left;
                    color: #fff;

                }

                h3 {
                    font-family: MiSans;
                    font-weight: 600;
                    line-height: 26px;
                    text-align: right;
                    color: #fff;
                }
            }

            .badge {
                font-size: 16px;
            }

            .bg-soft-down {
                background: #FEE9E5;
                margin-left: 20px;
            }

            .bg-soft-up {
                background: #E5FEEB;
                margin-left: 20px;
            }


        }
    }
}
</style>
