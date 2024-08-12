<template>
    <div class="page">
        <t-layout>
                <head-menu :head-title="t('menu3_1')" />
                <t-content>
                    <div class="main_content">
                        

                        <div class="row main_second_block">
                            <div v-for="(item, index) in 4" :key="index" class="col-sm-6 col-lg-3 mb-3 mb-lg-5">
                                <a class="card card-hover-shadow h-100" href="#">
                                    <div class="card-body">
                                        <h6 class="card-subtitle">已生效/全部</h6>
                                        <div class="row align-items-center gx-2 mb-1">
                                            <div class="col-6">
                                                <h2 class="card-title text-inherit">345</h2>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>


                        </div>
                         
                        <div class="card mb-3 mb-lg-5" >
                            <div class="card-content">
                                <t-tabs :default-value="1" v-model="goodTabModel">
                                    <t-tab-panel :value="1" label="TACOS Top10策略">


                                    </t-tab-panel>
                                    <t-tab-panel :value="2" label="降低花费Top10策略">


                                    </t-tab-panel>

                                </t-tabs>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <t-table row-key="pointId" :data="shop_goodTableList" :loading="loading"
                                            :columns="columnsShopGood" :bordered="false" :pagination="paginationShop" 
                                            cell-empty-content="/" @page-change="handleChangeShopGood">
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
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, reactive, Ref, ref, UnwrapNestedRefs, watch } from 'vue';
import 'animate.css';
import { getAllView, getAdEffect, getShopRank, getGoodRank } from '@/api/home';
import * as WebApp from '@/utils/webapp';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const loading = ref(true);
const goodTabModel = ref(1)
 
const paginationShop= reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
 
const columnsShopGood = reactive([
    { colKey: 'good.name', title: '策略ID' },
    { colKey: 'shop_name', title: '策略名称' },
    { colKey: 'sale_total', title: '更新时间' },
    { colKey: ' ', title: '操作对象' },
    { colKey: 'order_num_total', title: '操作动作' },
    { colKey: 'adv_cost', title: 'TACOS' },
    { colKey: 'acos', title: '广告花费占比' },
    { colKey: 'tacos', title: '广告花费' },
    { colKey: ' ', title: '广告销售额' },
    { colKey: ' ', title: '广告转化率' },
]);
const shop_goodTableList = reactive([])
onMounted(() => {
});
onUnmounted(() => {
});

 
const handleChangeShopGood = (pageInfo: any) => {
    paginationShop.defaultCurrent = pageInfo.current as number;
    paginationShop.defaultPageSize = pageInfo.pageSize as number;
    // getShopTableData()
};
 
  

</script>
<style lang="less" scoped>
@import url('@/style/common.less');
 
:deep(.t-pagination__select){
    display: none;
}
</style>
