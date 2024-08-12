<template>
    <div class="page">
        <t-layout>
                <head-menu :head-title="t('menu6_2')" />
                <t-content>
                    <user-table v-if="isAddVisible" @add-visible="addVisible" />
                    <div class="main_content_one" v-else>
                        <t-row :gutter="12">
                            <t-col :span="2">
                                <t-card title="组织架构" :bordered="false" hover-shadow>
                                    <template #actions>
                                        <t-button class="add_btn" @click="addApartment">
                                            <template #icon>
                                                <img class="icon" :src="WebApp.getImage('common/plus.png')" alt="">
                                            </template>
                                            添加部门</t-button>
                                    </template>
                                    <t-tree @click="onClick" v-model="apartModel" :expand-mutex="true"
                                        :expand-on-click-node="true" :data="apartItem" valueMode="all" activable hover
                                        transition :keys="{ label: 'name', value: 'value', children: 'child' }" />


                                </t-card>
                            </t-col>
                            <t-col :span="10">
                                <t-card title="用户列表" :bordered="false" hover-shadow >
                                    <template #actions>
                                        <t-button v-if="path.length > 0" class="add_btn" @click="addUser"
                                            style="margin-right: 20px">
                                            <template #icon>
                                                <img class="icon" :src="WebApp.getImage('common/plus.png')" alt="">
                                            </template>
                                            添加用户</t-button>
                                        <t-button class="add_btn" @click="downLoad">
                                            <template #icon>
                                                <img class="icon" :src="WebApp.getImage('common/download.png')" alt="">
                                            </template>
                                            数据下载</t-button>

                                    </template>
                                    <t-table  :style="{ width: `${screenWidth}px` }"  row-key="id" :data="adviceTableList" :loading="loading"
                                        table-layout="fixed" :columns="columnsAdvice" :bordered="false"
                                        :pagination="paginationAdvice" cell-empty-content="/"
                                        @page-change="handleChangeAdvice">
                                        <template #handle="{ row }">
                                            <span class="hand_detail" @click="editUserInfo(row)">{{
                                                t('table.handle_edit') }}</span>
                                            <t-popup trigger="click" placement="bottom" show-arrow destroy-on-close>
                                                <span class="hand_detail">{{ t('table.handle_manager') }}</span>
                                                <template #content>
                                                    <div class="manage_popup">
                                                        <span class="hand_detail" @click="deletePwd(row)">{{
                                                            t('table.handle_delete') }}</span>
                                                        <span class="hand_detail" @click="enableUser(row)">{{ row.status
                                                            === 0 ? t('table.handle_enable') : t('table.handle_disable')
                                                            }}</span>
                                                        <span class="hand_detail" @click="updatePwd(row)">重置密码</span>

                                                    </div>
                                                </template>
                                            </t-popup>


                                        </template>
                                    </t-table>
                                </t-card>


                            </t-col>
                        </t-row>

                    </div>

                </t-content>

                <t-dialog v-model:visible="apartVisible" :header="apartTitle" width="45%" :on-close="apartClose"
                    :cancel-btn="null" :confirm-btn="null">
                    <div class="dialog-content">
                        <t-form ref="form" :rules="FORM_RULES" :label-align="'top'" :data="formData" :colon="true"
                            :label-width="80" @reset="apartReset" @submit="apartSubmit">
                            <t-row :gutter="12">
                                <t-col :span="5">
                                    <t-form-item label="一级组织" name="first_org">
                                        <t-input v-if="apartType === 1" v-model="formData.first_org"></t-input>
                                        <t-select v-model="formData.first_org" v-else :disabled="apartType === 2"
                                            clearable @change="changeFirstOrg">
                                            <t-option v-for="(item, index) in apartItem" :key="index" :label="item.name"
                                                :value="item.name" />
                                        </t-select>
                                    </t-form-item>
                                </t-col>
                                <t-col :span="2"></t-col>
                                <t-col :span="5">
                                    <t-form-item label="二级组织" name="second_org">
                                        <t-input v-if="apartType === 1" v-model="formData.second_org"></t-input>

                                        <t-select v-else v-model="formData.second_org"
                                            :disabled="apartType === 2 || !formData.first_org" clearable
                                            @change="changeSecondOrg">
                                            <t-option v-for="(item, index) in secondOrgItem" :key="index"
                                                :label="item.name" :value="item.name" />
                                        </t-select>
                                    </t-form-item>
                                </t-col>

                                <t-col :span="5">
                                    <t-form-item label="三级组织" name="third_org">
                                        <t-input v-if="apartType === 1" v-model="formData.third_org"></t-input>
                                        <t-select v-else v-model="formData.third_org"
                                            :disabled="apartType === 2 || !formData.second_org" clearable>
                                            <t-option v-for="(item, index) in thirdOrgItem" :key="index"
                                                :label="item.name" :value="item.name" />
                                        </t-select>

                                    </t-form-item>
                                </t-col>
                                <t-col :span="2"></t-col>
                                <t-col :span="5">
                                    <t-form-item label="用户名" name="username">
                                        <t-input v-model="formData.username" :disabled="apartType === 3" clearable
                                            placeholder="用于卖家区分各个账号">
                                        </t-input>
                                    </t-form-item>
                                </t-col>

                                <t-col :span="5">
                                    <t-form-item label="真实姓名" name="real_name">
                                        <t-input v-model="formData.real_name" :disabled="apartType === 3" clearable>
                                        </t-input>
                                    </t-form-item>
                                </t-col>
                                <t-col :span="2"></t-col>
                                <t-col :span="5">
                                    <t-form-item label="手机号" name="mobile">
                                        <t-input v-model="formData.mobile" clearable>
                                        </t-input>
                                    </t-form-item>
                                </t-col>

                                <t-col :span="5">
                                    <t-form-item label="邮箱" name="email">
                                        <t-input v-model="formData.email" :disabled="apartType === 3" clearable
                                            @change="isCheckEMail">
                                        </t-input>
                                    </t-form-item>
                                </t-col>
                                <t-col :span="2"></t-col>
                                <t-col :span="5">
                                    <t-form-item label="角色" name="role">
                                        <t-select v-model="formData.role" :options="STATUS_OPTIONS">

                                        </t-select>
                                    </t-form-item>
                                </t-col>
                                <t-col :span="12">
                                    <t-form-item label="关联商品" name="asins">
                                        <t-textarea v-model="formData.asins" placeholder="输入新增asin,用英文逗号分隔">
                                        </t-textarea>

                                    </t-form-item>
                                    <t-form-item>
                                        <t-checkbox-group v-model="formData.marketplaces" @change="onChange1">
                                            <t-checkbox key="all" :check-all="true" label="全选" />
                                            <t-checkbox v-for="(item, index) in marketOption" :key="index"
                                                :value="item">{{ item
                                                }}</t-checkbox>
                                        </t-checkbox-group>
                                    </t-form-item>
                                </t-col>
                                <t-col :span="12">
                                    <t-form-item class="form_btns">
                                        <t-button theme="default" variant="base" type="reset">{{ t('btn.cancel')
                                            }}</t-button>
                                        <t-button class="submit" theme="primary" type="submit" :loading="loading">{{
                                            t('btn.comfirm')
                                            }}</t-button>
                                    </t-form-item>
                                </t-col>
                            </t-row>




                        </t-form>


                    </div>
                </t-dialog>
                <t-dialog v-model:visible="delvisible" :on-confirm="delConfirm">
                    <p>确认要删除该用户吗？</p>

                </t-dialog>
                <t-dialog v-model:visible="pwdVisible" :cancel-btn="null" :confirm-btn="null">
                    <t-form ref="form" :data="pwdForm" :rules="pwdRules" @reset="pwdReset" @submit="pwdSubmit">
                        <t-form-item label="设置密码" name="password">
                            <t-input v-model="pwdForm.password" type="password" autocomplete clearable
                                placeholder="请输入密码">
                            </t-input>
                        </t-form-item>

                        <t-form-item label="确认密码" name="repassword">
                            <t-input v-model="pwdForm.repassword" type="password" autocomplete clearable
                                placeholder="请输入密码">
                            </t-input>
                        </t-form-item>
                        <t-form-item class="form_btns">
                            <t-button theme="default" variant="base" type="reset">{{ t('btn.cancel') }}</t-button>
                            <t-button class="submit" theme="primary" type="submit" :loading="loading">{{
                                t('btn.comfirm') }}</t-button>
                        </t-form-item>
                    </t-form>
                </t-dialog>
            </t-layout>


    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed, onBeforeMount } from 'vue';
import { TreeProps, DialogProps, FormProps, Input, MessagePlugin, TableProps, CustomValidator, CheckboxGroupProps } from 'tdesign-vue-next';
import { allasins, alluser, destroyDown, edituser, adduser, account } from '@/api/projectSetting';
import { Checkexist } from '@/api/login';

import * as WebApp from '@/utils/webapp';
import { formatDate } from '@/utils/date';
import { validateInternationalPhoneNumber } from '@/utils/countryFile';
import axios from 'axios';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

const loading = ref(true);
const isAddVisible = ref(false)
const apartVisible = ref(false) //编辑弹窗
const delvisible = ref(false) //删除用户
const pwdVisible = ref(false)
const apartTitle = ref('添加部门及用户')
const apartType = ref(0)
const apartItem = ref<TreeProps['data']>([]);
const secondOrgItem = ref([])
const thirdOrgItem = ref([])
const apartModel = ref([])
const adviceTableList = ref<TableProps['data']>([])
const adviceTableList_all = ref<TableProps['data']>([])
const columnsAdvice = reactive([
    {
        colKey: 'row-select',
        type: 'multiple',
        width: 50,
    },
    { colKey: 'username', title: '用户名', width: 120, ellipsis: true },
    { colKey: 'real_name', title: '真实姓名', width: 90 },
    { colKey: 'mobile', title: '手机号', width: 140 },
    { colKey: 'email', title: '邮箱', width: 140, ellipsis: true },
    {
        colKey: 'status', title: '状态', width: 100,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.status === 0 ? '禁用' : '启用';
        },
    },
    {
        colKey: 'role', title: '角色', width: 80,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return row.role === 'employ' ? '员工' : '管理员';
        },
    },
    { colKey: 'asins', title: '关联商品', width: 300, ellipsis: true, },
    {
        colKey: 'update_time', title: '最近更改时间', width: 180,
        cell: (h: any, params: { row: any }) => {
            const { row } = params;
            return formatDate(row.update_time, 'YYYY-MM-DD HH:mm:ss');
        },
    },
    { colKey: 'password', title: '密码', width: 90 },
    { colKey: 'handle', title: '操作', width: 120, fixed: 'right' },

]);
const paginationAdvice = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
});
const userInfo = JSON.parse(localStorage.getItem('account')).account

const FORM_RULES: FormProps['rules'] = {
    first_org: [
        {
            required: true,
            message: '请选择一级组织',
        }, {
            max: 10,
            message: '字符数量不能超过 10',
            type: 'warning',
        },
    ],
    username: [
        {
            required: true,
            message: '用户名必填',
        }, {
            max: 10,
            message: '字符数量不能超过 10',
            type: 'warning',
        },
    ],
    real_name: [
        {
            required: true,
            message: '真实姓名必填',
        }, {
            max: 10,
            message: '字符数量不能超过 10',
            type: 'warning',
        },
    ],
    mobile: [
        {
            required: true,
            message: '手机号必填',
        },
        {
            validator: validateInternationalPhoneNumber,
            message: '请输入带国际区号的手机号！',
        },
    ],
    email: [
        {
            required: true,
            message: '邮箱必填',
        },
        { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址！' },

    ],
    role: [
        {
            required: true,
            message: '请选择角色',
        },
    ],
    asins: [
        {
            required: true,
            message: 'asins必填',
        }, {
            max: 200,
            message: '字符数量不能超过 200',
            type: 'warning',
        },
    ],
};

const formData = reactive({
    belong_id: userInfo.user_id,
    company_name: userInfo.company_name,
    first_org: '',
    second_org: '',
    third_org: '',
    username: '',
    real_name: '',
    mobile: '',
    email: '',
    role: '',
    asins: '',
    marketplaces: []
});
const STATUS_OPTIONS = [
    {
        label: '管理员',
        value: 'manager',
    },
    {
        label: '员工',
        value: 'employ',
    },
];
const marketOption = reactive([])

async function isCheckEMail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(formData.email)) {

    } else {
        console.log(`${formData.email} 是有效的邮箱地址`);
        const res = await Checkexist({ email: formData.email });
        if (res.code === 200 && res.msg === 'params exist') {
            MessagePlugin.warning('邮箱地址不能重复，请重新输入！')
            formData.email = ''
        }
    }
}
const editForm: FormProps['data'] = reactive({
    id: '',
    action: '',
});
const pwdForm = reactive({
    password: '',
    repassword: '',
})
const rePassword: CustomValidator = (val) =>
    new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve(pwdForm.password === val);
            clearTimeout(timer);
        });
    });
const pwdRules: FormProps['rules'] = {
    password: [
        {
            required: true,
            message: '请填写密码',
        },
    ],
    repassword: [
        {
            required: true,
            message: '请填写密码',
        },
        {
            validator: rePassword,
            message: '两次密码不一致',
        },
    ],

};
const addVisible = () => {
    isAddVisible.value = false
    console.log(isAddVisible.value)
}
onBeforeMount(() => {
    WebApp.isRoleCheck()

})
const screenWidth = ref(0);

onMounted(() => {
    screenWidth.value = window.innerWidth - 600;
    window.addEventListener('resize', updateScreenWidth);
    getUserAsins();
    getUserList()

});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);

});
function updateScreenWidth() {
    screenWidth.value = (window.innerWidth - 300)*0.8;
}
const onClick: TreeProps['onClick'] = (context) => {
    const { node } = context;
    console.info('onClick', context.node.data, node.label);
    findNodePath(apartItem.value, node.value);
    // 筛选用户列表 adviceTableList adviceTableList_all
    const deepCopiedDetail = JSON.parse(JSON.stringify(adviceTableList_all.value)); // 深拷贝示例数据
    adviceTableList.value = deepCopiedDetail.filter((item: any) => {
        const first_orgMatch = path.value[0] ? item.first_org === path.value[0] : true;
        const second_orgMatch = path.value.length > 1 ? item.second_org === path.value[1] : true;
        const third_orgMatch = path.value.length > 2 ? item.third_org === path.value[2] : true;
        return first_orgMatch && second_orgMatch && third_orgMatch;
    });
    paginationAdvice.total = adviceTableList.value.length
    console.info('onClick22', path.value, adviceTableList.value);


};
const path = ref([]);

function findNodePath(nodes, targetName, currentPath = []) {
    for (const node of nodes) {
        // 当前路径包含当前节点名称
        const newPath = [...currentPath, node.name];

        // 检查当前节点名称是否是目标
        if (node.value === targetName) {
            path.value = newPath;
            return true; // 找到目标，停止搜索
        }

        // 递归搜索子节点
        if (node.child && node.child.length > 0) {
            if (findNodePath(node.child, targetName, newPath)) {
                return true; // 一旦在子节点中找到目标，向上递归返回true
            }
        }
    }
    return false; // 当前分支未找到目标
}
const addApartment = () => {
    apartVisible.value = true;
    apartType.value = 1;
    apartTitle.value = '添加组织部门及用户';
    WebApp.toEmpty(formData)
    formData.belong_id = userInfo.user_id;
    formData.company_name = userInfo.company_name;
    formData.first_org = ''
    formData.second_org = ''
    formData.third_org = ''

}
const addUser = () => {
    apartVisible.value = true;
    apartTitle.value = '添加用户'
    apartType.value = 2;
    WebApp.toEmpty(formData)
    formData.belong_id = userInfo.user_id;
    formData.company_name = userInfo.company_name;
    formData.first_org = path.value[0]
    formData.second_org = path.value.length > 1 ? path.value[1] : ''
    formData.third_org = path.value.length > 2 ? path.value[2] : ''

}
const onChange1: CheckboxGroupProps['onChange'] = (val) => {
    console.log(formData.marketplaces, val);

};





const handleChangeAdvice = (pageInfo: any) => {
    paginationAdvice.defaultCurrent = pageInfo.current as number;
    paginationAdvice.defaultPageSize = pageInfo.pageSize as number;
};


const editUserInfo = (row: any) => {
    console.log('edit===')
    apartVisible.value = true;
    apartTitle.value = '用户信息编辑'
    apartType.value = 3;
    editForm.id = row.id

    WebApp.toEmpty(formData)
    Object.assign(formData, row)
    formData.belong_id = userInfo.user_id;
    formData.company_name = userInfo.company_name;
}
const changeFirstOrg = () => {
    console.log(formData.first_org, apartItem.value);
    apartItem.value?.forEach((ele: any) => {
        if (ele.name === formData.first_org) {
            secondOrgItem.value = ele.child
            console.log(formData.first_org, secondOrgItem.value);

        }
    })

}
const changeSecondOrg = () => {
    console.log(formData.second_org, secondOrgItem.value);
    secondOrgItem.value?.forEach((ele: any) => {
        if (ele.name === formData.second_org) {
            thirdOrgItem.value = ele.child
            console.log(thirdOrgItem.value);

        }
    })

}
const apartClose: DialogProps['onClose'] = (context) => {

    console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
};
const apartReset: FormProps['onReset'] = () => {
    apartVisible.value = false
};
const apartSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
    if (validateResult === true) {
        MessagePlugin.success('提交成功');
        if (formData.marketplaces.length > 0) {
            const array = formData.marketplaces.join(",")
            formData.asins = formData.asins + ',' + array
        }
        if (apartType.value === 3) {
            editForm.action = 'update'
            editForm.first_org = formData.first_org;
            editForm.second_org = formData.second_org;
            editForm.third_org = formData.third_org;
            editForm.mobile = formData.mobile;
            editForm.role = formData.role;
            editForm.asins = formData.asins;
            editUser();

        } else {
            addUserList([formData])
        }
        apartVisible.value = false;

    } else {
        console.log('Validate Errors: ', firstError, validateResult);
        MessagePlugin.warning(firstError);
    }
};

const deletePwd = (row: any) => {
    editForm.id = row.id;
    editForm.action = 'delete'
    delvisible.value = true
}
const delConfirm: DialogProps['onConfirm'] = (context) => {
    console.log('点击了确认按钮', context);
    editUser()
    delvisible.value = false;

};

const enableUser = (row: any) => { //启用，禁用
    editForm.id = row.id;
    editForm.action = 'update'
    editForm.status = row.status === 0 ? 1 : 0
    console.log(editForm)
    editUser()

}
const updatePwd = (row: any) => {
    editForm.id = row.id
    pwdVisible.value = true
}
const pwdReset: FormProps['onReset'] = () => {
    pwdVisible.value = false
};
const pwdSubmit: FormProps['onSubmit'] = ({ validateResult, firstError: any }) => {
    if (validateResult === true) {
        MessagePlugin.success('提交成功');
        console.log(pwdForm)
        editForm.action = 'password'
        editForm.password = pwdForm.password;
        pwdVisible.value = false
        editUser()

    } else {
        MessagePlugin.warning('校验失败，请检查表单');
    }
};

async function getUserAsins() {
    const res = await allasins();
    console.log('allasins==', res)
    Object.assign(marketOption, res)
}
async function editUser() {
    const res = await edituser(editForm);
    console.log('11111edit===')
    loading.value = false
    if (res.code === 200) {
        getUserList()

    }
}
async function addUserList(userData) {
    console.log('提交==', userData)
    const formdata = {
        items: userData
    }
    const res = await adduser(formdata);
    console.log('提交==', res)
    if (res.code === 200) {
        getUserList()

    }
}
function addValueField(orgs, prefix = '') {
    orgs.forEach((org, index) => {
        const currentValue = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
        org.value = currentValue;
        if (org.child && org.child.length > 0) {
            addValueField(org.child, currentValue);
        }
    });
}
// 
async function getUserList() {
    const res = await alluser();
    loading.value = false
    console.log(res.user_info)
    adviceTableList.value = []
    if (res.user_info.length > 0) {
        addValueField(res.orgs_info);
        console.log(res.orgs_info)
        // res.orgs_info
        apartItem.value = res.orgs_info;
        adviceTableList.value = res.user_info;
        adviceTableList_all.value = res.user_info
        paginationAdvice.total = res.user_info.length
        console.log('2333==')

    } else {
        isAddVisible.value = true;
    }

}
async function downLoad() {
    const response = await alluser({ download: true });
    window.open(response)
    const res = await destroyDown({ url: response })


}

</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');



.main_content_one {
    width:96%;
    position: relative;

    :deep(.t-card__title) {
        display: flex;
        flex-direction: row;
        font-size: 16px;
    }

    .card_head {
        padding-right: 10px;
        border-right: 2px solid #EBEDF0;

    }

    .add_line {
        color: #237FFA;
        font-weight: 400;
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
    }

    .delete_line {
        background: #FEE9E5;
        color: #FF5959;
        border: none;
        margin-right: 10px;

        img {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
    }

    .import_line {
        background: #E2F3FE;
        color: #237FFA;
        border: none;

        img {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
    }

}

.add_btn {
    background: #E2F3FE;
    color: #237FFA;
    border: none;

    .icon {
        width: 20px;
        height: 20px;
    }
}

.add_btn:hover {
    background: #E2F3FE;

}

:deep(.t-tree__label) {
    padding: 8px;
    color: #1F2733;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;


}

:deep(.t-is-active .t-tree__label) {
    background: #E2F3FE;
    color: #237FFA;

}

.manage_popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
}

.form_btns {
    margin-top: 20px !important;
    display: flex;
    justify-content: flex-end;

    :deep(.t-form__controls-content) {
        justify-content: flex-end;
    }

    .submit {
        margin-left: 20px;
        background: #237FFA;
        border: none;
    }
}

:deep(.t-dialog__footer) {
    .t-dialog__confirm {
        background: #237FFA;
        border: none;
    }

    .t-dialog__confirm:hover {
        --ripple-color: transparent;

    }
}

.t-button--variant-base.t-button--theme-primary:not(.t-is-disabled):not(.t-button--ghost) {
    --ripple-color: transparent;
}

.t-button {
    border-radius: 3px;
}


.dialog-content {
    width: 100%;
    overflow: hidden;

    .t-col-5 {
        margin-bottom: 20px;
    }
}
</style>
