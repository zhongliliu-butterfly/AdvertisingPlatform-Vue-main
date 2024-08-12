<template>
    <div class="page">
       
        <t-layout>
            <head-menu :head-title="t('menu5_1')" /> 
            <t-content>
                <t-card :bordered="false" title="模板基础信息" class="main_content_one">
                    <t-form :data="formData" :rules="infoRules" :label-align="'top'" :layout="'inline'"
                        class="main_form">
                        <t-form-item label="模板名称" name="name">
                            <t-input v-model="formData.name"></t-input>
                        </t-form-item>
                        <t-form-item label="详情描述" name="description">
                            <t-input v-model="formData.description"></t-input>
                        </t-form-item>
                        <t-form-item label="操作对象" name="actionobj">
                            <t-select class="selectItem" v-model="formData.actionobj">
                                            <t-option key="apple" label="搜索词" value="搜索词" />
                                            <t-option key="banana" label="搜索品" value="搜索品" />
                                            <t-option key="banana" label="投放词" value="投放词" />
                                            <t-option key="banana" label="投放品" value="投放品" />
                                            <t-option key="banana" label="广告活动" value="广告活动" />
                                        </t-select>
                        </t-form-item>
                        <t-form-item label="策略类型" name="type">
                            <t-select class="selectItem" v-model="formData.type">
                                            <t-option key="apple" label="精准否词" value="精准否词" />
                                        </t-select>
                            
                        </t-form-item>
                    </t-form>
                </t-card>
                <t-card :bordered="false" title="模板规则" class="main_content_two">
                    <t-row :gutter="12">
                        <t-col :span="2">
                            <t-menu v-model:expanded="expanded" expandMutex :default-value="checkedValue"
                                @change="changeHandler">
                                <t-submenu value="0" title="商品类型">
                                    <template #icon>
                                        <img class="iconImg" width="20" height="20"
                                            :src="WebApp.getImage(checkedValue === '0-1' ? 'menu/business_active.svg' : 'menu/business.svg')" />
                                    </template>
                                    <t-menu-item value="0-1">
                                        <span>类型一</span>
                                    </t-menu-item>
                                </t-submenu>

                                <t-submenu value="1" title="关键词类型">
                                    <template #icon>
                                        <img class="iconImg" width="20" height="20"
                                            :src="WebApp.getImage(checkedValue === '1-1' ? 'menu/lock_active.svg' : 'menu/lock.svg')" />
                                    </template>
                                    <t-menu-item value="1-1">
                                        <span>菜单二</span>
                                    </t-menu-item>
                                </t-submenu>
                                <t-submenu value="2" title="效果类型">
                                    <template #icon>
                                        <img class="iconImg" width="20" height="20"
                                            :src="WebApp.getImage(checkedValue === '2-1' ? 'menu/setting_active.svg' : 'menu/setting.svg')" />
                                    </template>

                                    <t-menu-item value="2-1">
                                        <span>二级菜单</span>
                                    </t-menu-item>
                                </t-submenu>
                            </t-menu>


                        </t-col>
                        <t-col :span="4">

                            <div class="infoblock">
                                <h3>基础信息</h3>
                                <t-form :data="formData" :rules="basicRules">
                                    <t-form-item label="统计维度" name="weidu">
                                        <t-radio v-model="formData.weidu">广告活动</t-radio>
                                    </t-form-item>
                                    <t-form-item label="统计周期" name="time">
                                        <t-input v-model="formData.time"></t-input>
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



                        </t-col>
                        <t-col :span="6">
                            <div class="infoblock">
                                <h3>自定义信息</h3>
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


                        </t-col>
                    </t-row>
                    <template #footer>
                        <div class="foot_btn">
                            <t-button theme="default" variant="base">{{ t('btn.cancel') }}</t-button>
                            <t-button theme="default" variant="base" @click="checkDataView">查看命中对象</t-button>
                            <t-button>创建模板</t-button>

                        </div>
                    </template>
                </t-card>
                <t-dialog v-model:visible="visible" header="模板今日命中对象预览" width="700px" :confirm-on-enter="true"
                    :cancel-btn="null" :confirm-btn="null">
                    <div class="row mb-3 ">

                        <div class="col-lg-4">

                            <t-select class="select_type" v-model="dialogForm.shop" clearable placeholder="请选择站点/店铺">
                                <t-option key="apple" label="Apple" value="apple" />
                            </t-select>
                        </div>
                        <div class="col-lg-3">
                            <t-select class="select_type" clearable v-model="dialogForm.type" placeholder="请选择类目">
                                <t-option key="apple" label="Apple" value="apple" />
                            </t-select>
                        </div>
                        <div class="col-lg-3">
                            <t-select class="select_type" clearable v-model="dialogForm.asin" placeholder="请输入父ASIN">
                                <t-option key="apple" label="Apple" value="apple" />

                            </t-select>
                        </div>
                        <div class="col-lg-2">
                            <img class="search_icon" @click=" " :src="WebApp.getImage('common/search-icon.png')" alt="">

                        </div>
                    </div>
                    <t-table row-key="campaign_id" :data="cntData" :loading="loading" table-layout="auto"
                        :columns="columnCnt" :bordered="false" cell-empty-content="/">

                    </t-table>
                </t-dialog>
            </t-content>
        </t-layout>



    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, Ref, ref, UnwrapNestedRefs, watch } from 'vue';
import 'animate.css';
import * as WebApp from '@/utils/webapp';
import { FormProps, MenuProps } from 'tdesign-vue-next';
import { } from '@/api/intelligentDiagnosis';
import { formatDate } from '@/utils/date';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const expanded = ref<MenuProps['expanded']>(['0']);
const checkedValue = ref('0-1')
const formData: FormProps['data'] = reactive({
    name: '',
    description: '',
    actionobj: '',
    type: '',
    weidu: '',
    time: '',
    type2: ''
});
const infoRules: FormProps['rules'] = {

    name: [
        { required: true, message: '必填' },
    ],

    actionobj: [{ required: true, message: '必填' }],
    type: [{ required: true, message: '必填' }],

};
const basicRules: FormProps['rules'] = {

    weidu: [
        { required: true, message: '必填' },
    ],

    time: [{ required: true, message: '必填' }],
    type: [{ required: true, message: '必填' }],

};
const visible = ref(false)
const dialogForm = reactive({
    shop: '',
    type: '',
    asin: ''
})
const loading = ref(false);
const cntData = ref([])
const columnCnt = reactive([
    { colKey: 'campaign_id', title: '基础信息' },
    { colKey: 'campaign_name', title: '策略建议' },
    { colKey: 'ad_mode', title: '类目' },
    { colKey: 'word', title: '统计天数' },
    { colKey: 'search_term_list', title: '曝光量' },
])
const changeHandler: MenuProps['onChange'] = (active) => {
    console.log('change', active, expanded.value);
    checkedValue.value = active
};
const checkDataView = () => {
    visible.value = true;
}
onMounted(() => {

});
onUnmounted(() => {
});


</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');

.main_content_one {

    .main_form {
        width: 100%;
        display: flex;
        justify-content: space-between;

        :deep(.t-form__item) {
            width: 22%;
            margin-right: 0;
        }

    }
}

.main_content_two {
    margin: 20px;
    min-height: 500px;

    :deep(.t-menu__item.t-is-active) {
        background: #E2F3FE;
        ;
        color: #237FFA !important;
    }

    :deep(.t-default-menu .t-menu__item.t-is-opened) {
        color: #237FFA !important;
        background: #F2F4F7;


    }


    .iconImg {
        margin-right: 10px;
    }

    .t-col:not(:last-child) {
        min-height: 500px;
        border-right: 1px solid #EBEDF0;
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

    :deep(.t-card__footer) {
        border-top: 1px solid #EBEDF0;

        .foot_btn {
            width: 30%;
            margin: 0 auto;
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
    }
}

.search_icon {
    width: 32px;
    height: 32px;
    cursor: pointer;
}
</style>
