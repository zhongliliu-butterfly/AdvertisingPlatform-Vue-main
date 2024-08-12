<template>
    <div class="page">
        <t-layout>
                <head-menu :head-title="t('menu6_1')" />
                <t-content>
                    <t-card :bordered="false" class="main_content_one">
                        <div class="btn_group">
                            <t-button @click="onClick" class="add_btn"> <template #icon>+</template>新建店铺授权</t-button>
                        </div>
                        <t-table row-key="pointId" :data="adviceTableList" :loading="loading"  
                            table-layout="fixed" :columns="columnsAdvice" :bordered="false"
                            :pagination="paginationAdvice" cell-empty-content="/" @page-change="handleChangeAdvice">

                            <template #ad_status="{ row }">
                                <span v-if="row.ad_status === '0'" class="hand_detail" @click="setAdvHandle(row)">授权</span>
                                <span v-else-if="row.ad_status === '1'&&row.sync_status==='0'">授权成功</span>
                                <span v-else-if="row.ad_status === '1'&&row.sync_status==='1'">数据同步中</span>
                                <span v-else>暂停同步</span>
                            </template>
                            <template #email="{ row }">
                                <span v-if="row.email" >{{row.email}}</span>
                                <span v-else class="hand_detail" @click="setEmailHandle(row)">绑定邮箱</span>
                                
                            </template>
                            
                            <template #handle="{ row }">
                                <t-popup trigger="click" placement="bottom" show-arrow destroy-on-close>
                                    <span class="hand_detail">{{ t('table.handle_manager') }}</span>
                                    <template #content>
                                        <div class="manage_popup">
                                            <span class="hand_detail" v-if="row.ad_status === '1'" @click="SetHandleStore(row)">广告授权设置</span>
                                            <span class="hand_detail" @click="handleStore(row, 'update','status')">{{ row.status
                                                === '0' ? t('table.handle_enable') : t('table.handle_disable') }}</span>
                                            <span class="hand_detail" @click="handleStore(row, 'delete')">{{ t('table.handle_delete') }}</span>

                                        </div>
                                    </template>
                                </t-popup>


                            </template>
                        </t-table>
                    </t-card>
                    <div class="main_content">



                    </div>
                </t-content>
                <t-dialog v-model:visible="visible" header="店铺授权" width="30%" :confirm-on-enter="true"
                    :cancel-btn="null" :confirm-btn="null">
                    <t-space direction="vertical" style="width: 100%">
                        <div>
                            <div class="dialog_tip">
                                <img class="icon" :src="WebApp.getImage('common/infoIcon.png')" alt="">
                                <p>如何店铺授权？</p>
                                <span class="operation" @click="handleOperation">查看</span>

                            </div>

                            <t-space></t-space>
                            <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" :label-width="80"
                                @submit="onSubmit" >

                                <t-form-item label="账号名称" name="name">
                                    <t-input v-model="formData.name" clearable placeholder="用于卖家区分各个账号">
                                    </t-input>
                                </t-form-item>

                                <t-form-item label="区域" name="zone">
                                    <t-select v-model="formData.zone" @change="onZoneChange">
                                        <t-option v-for="item in amazonSupportedAreaList" :key="item.country_id"
                                            :label="item.country" :value="item.code" />
                                    </t-select>


                                </t-form-item>
                                <t-form-item label="站点" v-if="marketOption.length > 0">
                                    <t-checkbox-group v-model="formData.marketplaces">
                                        <t-checkbox key="all" :check-all="true" label="全选" />
                                        <t-checkbox v-for="item in marketOption" :key="item.code" :value="item.code">{{
                                            item.country
                                            }}</t-checkbox>
                                    </t-checkbox-group>
                                </t-form-item>
                                <t-form-item class="form_btns">
                                    <t-button theme="default" variant="base" type="reset" @click="visible=false">{{ t('btn.cancel') }}</t-button>
                                    <t-button class="submit" theme="primary" type="submit"
                                        :loading="loading">登录亚马逊授权</t-button>
                                </t-form-item>
                            </t-form>
                        </div>
                    </t-space>
                </t-dialog>
                <t-dialog v-model:visible="emailVisible" header="绑定邮箱" width="30%" :confirm-on-enter="true"
                    :cancel-btn="null" :confirm-btn="null">
                    <t-form ref="form" :data="advFormData" :rules="emailRules" :colon="true" :label-width="80" @submit="handleStore(advFormData, 'update')">
                        <t-form-item label="邮箱" name=email>
                            <t-input v-model="advFormData.email" placeholder="请输入邮箱"></t-input>
                        </t-form-item>
                        <t-form-item class="form_btns">
                            <t-button theme="default" variant="base" type="reset" @click="emailVisible=false">{{ t('btn.cancel') }}</t-button>
                            <t-button class="submit" theme="primary" type="submit" :loading="loading">{{ t('btn.comfirm') }}</t-button>
                        </t-form-item>
                    </t-form>
                </t-dialog>
                <t-dialog v-model:visible="adVisible" header="数据同步设置" width="30%" :confirm-on-enter="true"
                    :cancel-btn="null" :confirm-btn="null">
                    <t-form ref="form" :data="advFormData" :colon="true" :label-width="80" @submit="saveData">

                        <t-form-item label="广告授权">
                            <span v-if="advFormData.ad_status === '1'&&advFormData.sync_status==='0'">授权成功</span>
                                <span v-else-if="advFormData.ad_status === '1'&&advFormData.sync_status==='1'">数据同步中</span>
                                <span v-else >暂停同步</span>
                            <span style="margin: 0 16px;color: #EBEDF0">|</span>
                            <span class="hand_detail" @click="setAdvHandle(advFormData)">重新授权</span>
                            <span class="hand_detail" @click="handleStore(advFormData, 'update','ad_status')">取消授权</span>
                        </t-form-item>

                        <t-form-item label="广告数据">
                            <t-radio-group v-model="advFormData.sync_status" :options="advOptions"></t-radio-group>


                        </t-form-item>

                        <t-form-item class="form_btns">
                            <t-button theme="default" variant="base" type="reset" @click="adVisible=false">{{ t('btn.cancel') }}</t-button>
                            <t-button class="submit" theme="primary" type="submit" :loading="loading">{{ t('btn.comfirm') }}</t-button>
                        </t-form-item>
                    </t-form>
                </t-dialog>
                <t-dialog class="auth_dialog" v-model:visible="advauthisible" header="广告授权" width="30%"
                    :confirm-on-enter="true" :cancel-btn="null" :confirm-btn="null">
                    <div>
                        1.点击【去授权】将跳转到亚马逊登录页面，<span style="font-weight: bold;"> 请在授权店铺主账号的常用环境操作，以免关联。</span>
                    </div>
                    <div>
                        2.请先添加店铺再进行广告授权，授权前请切换到对应的站点，无论授权了多少个店铺在哪里登录领星ERP都不存在关联问题。
                    </div>
                    <div>
                        3.亚马逊官方支持北美、欧洲、日本、澳洲、印度、阿联酋、荷兰、新加坡、沙特、波兰和瑞典站。
                    </div>
                    <div class="form_btns">
                        <t-button theme="default" variant="base" type="reset"  @click="advauthisible=false">{{ t('btn.cancel') }}</t-button>
                        <t-button class="submit" theme="primary" @click="onAdvComfirm" :loading="loading">去授权</t-button>
                    </div>
                </t-dialog>
            </t-layout>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, reactive, computed, Ref, ref } from 'vue';
import 'animate.css';
import * as WebApp from '@/utils/webapp';
import { TableProps, DialogProps, ButtonProps, FormProps, MessagePlugin, RadioGroupProps } from 'tdesign-vue-next';
import { getAuthUrl, getStoreInfo, editStoreInfo,asyncdata} from '@/api/projectSetting';
import { amazonSupportedAreaList, amazonCountries } from '@/utils/countryFile'
import { formatDate } from '@/utils/date';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const visible = ref(false);
const adVisible = ref(false)
const emailVisible=ref(false)
const advauthisible = ref(false)


const FORM_RULES: FormProps['rules'] = {
    name: [
        {
            required: true,
            message: '请填写账号名称',
        },
    ],
    zone: [
        {
            required: true,
            message: '请选择区域',
        },
    ],
};
const formData: any = reactive({
    platform: 'sp',
    name: '',
    zone: '',
    marketplaces: [],
});
const adForm: any = reactive({
    platform: 'ad',
    name: '',
    zone: '',
    marketplaces: [],
});
interface Country {
    country_id: number; // 国家ID可以是数字或字符串，取决于数据的实际情况
    country: string; // 国家或区域名称
    code: string; // 国家或地区的代码
    parent?: string; // 父区域名称，可选，只对子国家适用
}
const marketOption: Array<Country> = reactive([])
const loading = ref(true);

const adviceTableList = ref<TableProps['data']>([])
const columnsAdvice = reactive([
    { colKey: 'seller_name', title: '店铺名称',width:160,ellipsis: true },
    {
        colKey: 'countrycode', title: '国家',
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            const country = amazonCountries.find(item => item.code === row.countrycode);
            return country?.chineseName;

        },
    },
    {
        colKey: 'status', title: '状态',
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.status === '1' ? '启用' : '禁用'

        },
    },
    {
        colKey: 'sp_status', title: '店铺授权',
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.sp_status === 1 ? '授权成功' : '暂停同步'

        },
    },
    { colKey: 'ad_status', title: '广告授权' },
    {
        colKey: 'update_time', title: '更新授权时间',width:180,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return formatDate(row.update_time, 'YYYY-MM-DD HH:mm:ss');
        },
    },
    {
        colKey: 'create_time', title: '店铺授权时间',width:180,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss');
        },
    },
    { colKey: 'email', title: '邮箱' },
    { colKey: 'handle', title: '操作' },

]);
const paginationAdvice = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const editForm = reactive({
    id: '',
    action: '',
    // status:'',
    // ad_status:'',
    // sync_status:''
})
const advOptions: RadioGroupProps['options'] = [
    {
        value: '1',
        label: '同步',
    },
    {
        value: '2',
        label: '暂停同步',
    },

];
const emailRules = {
    
    email: [
        { required: true, message: '请填写邮箱！' },
        { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址！' },
    ],
};
const advFormData: any = reactive({ });
const handleOperation = () => {
    alert('operation clicked');
};
const onZoneChange = (value: any) => {
    const region = amazonSupportedAreaList.find(region => region.code === value);
    marketOption.length = 0
    WebApp.toEmpty(formData.marketplaces)
    if (region && region?.children.length > 0) {
        Object.assign(marketOption, region?.children)
        formData.marketplaces = marketOption.map(child => child.code)
    }
};
const onClick: ButtonProps['onClick'] = (context) => {
    visible.value = true;
};
const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
    loading.value = true;
    if (validateResult === true) {
        visible.value = false;
        const form = {
            platform: formData.platform,
            name: formData.name,
            zone: formData.zone,
            marketplaces: JSON.stringify(formData.marketplaces)
        }
        addStoreAuth(form)
    } else {
        loading.value = false;

    }
};
 
const handleChangeAdvice = (pageInfo: any) => {
    paginationAdvice.defaultCurrent = pageInfo.current as number;
    paginationAdvice.defaultPageSize = pageInfo.pageSize as number;
};
onBeforeMount(() => {
    WebApp.isRoleCheck()

})
onMounted(() => {
    getStoreTable();

});
onUnmounted(() => {
});

const SetHandleStore = (row:any) => {
    adVisible.value = true;
    Object.assign(advFormData,row)

}
const saveData = () => {
    
    if(advFormData.sync_status==='1'){
        editAsyncData({shop_id :advFormData.id})
    } else{
        handleStore(advFormData, 'update','sync_status')
    }
}
function findContinentCodeByCountryCode(countryCode) {
    for (const continent of amazonSupportedAreaList) {
        const country = continent.children?.find(country => country.code === countryCode);
        if (country) {
            return continent.code; // 返回找到的大洲 code
        }
    }
    return null; // 如果没有找到，返回 null
}
const setAdvHandle = (row:any) => {
    advauthisible.value = true;
    adVisible.value=false
    adForm.name=row.seller_name;
    adForm.zone=findContinentCodeByCountryCode(row.countrycode)
    adForm.marketplaces.push(row.countrycode)
}
const setEmailHandle=(row:any)=>{
    console.log(row)
    emailVisible.value=true;
    Object.assign(advFormData,row)
}
const onAdvComfirm: DialogProps['onConfirm'] = () => {
    advauthisible.value = false;
    const form = {
            platform: 'ad',
            name: adForm.name,
            zone: adForm.zone,
            marketplaces: JSON.stringify(adForm.marketplaces)
        }
    addStoreAuth(form)

};
const handleStore = (row: any, action: string,type?:string) => {
    editForm.id = row.id;
    editForm.action = action;
    editForm.email = row.email;
    console.log(editForm)
    if (type === 'status') {
        editForm.status = row.status === '0' ? '1' : '0'
    }else if (type === 'ad_status') {
        editForm.ad_status ='0'
    }else if (type === 'sync_status') {
        editForm.sync_status =row.sync_status 
    }
    editStore(editForm)
}
async function addStoreAuth(form: any) {
    const res = await getAuthUrl(form);
    loading.value = false;
    window.open(res)
}
async function getStoreTable() {
    const res = await getStoreInfo();
    loading.value = false;
    adviceTableList.value = res;
    paginationAdvice.total=res.length
    if (res.length === 0) {
        MessagePlugin.warning('暂无数据，请先授权店铺!')
    }
}

async function editAsyncData(formData: any) {
    const res = await asyncdata(formData);
    if (res.code === 200) {
        MessagePlugin.success('同步成功！')
        getStoreTable()
    }
    adVisible.value=false
}
async function editStore(formData: any) {
    const res = await editStoreInfo(formData);
    if (res.code === 200) {
        MessagePlugin.success('操作完成！')
        getStoreTable()
    }
    adVisible.value=false
    emailVisible.value=false
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');

.main_content_one {

    .btn_group {
        margin-bottom: 20px;

        .add_btn {
            background: #E2F3FE;
            color: #237FFA;
            border: none;
            margin-right: 20px;
        }
    }
}

.block_content {
    margin: 100px auto;
    text-align: center;

    button {
        width: 120px;
        border-radius: 5px;
    }
}

.dialog_tip {
    background: #E2F3FE;
    height: 48px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1F2733;

    .icon {
        width: 20px;
        height: 20px;
    }

    p {
        padding: 0 20px;
        flex: 1;
        margin-bottom: 0;
    }

    .operation {
        color: #237FFA;
    }
}

.form_btns {
    display: flex;
    justify-content: flex-end;

    :deep(.t-form__controls-content) {
        justify-content: flex-end;
    }

    .t-button {
        border-radius: 4px;
    }

    .submit {
        margin-left: 20px;
        background: #237FFA;
        border: none;

    }
}

.t-button--variant-base.t-button--theme-primary:not(.t-is-disabled):not(.t-button--ghost) {
    --ripple-color: transparent;
}

.manage_popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
}
</style>
