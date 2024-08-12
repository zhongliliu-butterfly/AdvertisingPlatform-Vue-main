<template>
    <div>
        <t-card :bordered="false" header-bordered class="main_content_one">
            <template #title>
                <p class="card_head">已选择{{ selectedRowKeys.length }}项</p>
                <span @click="addTableLine" class="add_line">+ 添加一行</span>
            </template>
            <template #actions>
                <t-button class="delete_line" @click="delectTableLine">
                    <template #icon>
                        <img :src="WebApp.getImage('common/delete.png')" alt="">
                    </template>
                    {{ t('table.handle_delete') }}</t-button>
                <t-button class="import_line" @click="addFile">
                    <template #icon>
                        <img :src="WebApp.getImage('common/import.png')" alt="">
                    </template>
                    批量导入</t-button>

            </template>
            <t-table ref="tableRef" row-key="key" :columns="columns" :data="data" :selected-row-keys="selectedRowKeys"
                @select-change="rehandleSelectChange" bordered lazy-load />
            <br />

            <!-- 示例代码有效，勿删 -->
            <div class="foot_btn">
                <t-button theme="default" variant="base">{{ t('btn.cancel') }}</t-button>
                <t-button :loading="loading" @click="validateTableData">校验并提交</t-button>
            </div>
            <div>
                <p>填写说明：</p>
                <p>1）未选择上级部门时，默认当前部门为顶级部门</p>
                <p>2）用户名、邮箱一旦填写不可更改</p>
                <p>3）账户名为邮箱，提交后系统会自动生成初始密码</p>
                <p>4）在线填写支持按照店铺或asin维度进行人员管理（批量导入只支持asin维度）</p>
                <p>5）每个店铺或asin只能分配给唯一负责人，不可重复分配给多人，一个人可负责多个店铺或asin</p>
            </div>
        </t-card>
        <t-dialog v-model:visible="fileVisible" header="批量导入" width="600px" :cancel-btn="null" :confirm-btn="null">
            <!-- <uploader></uploader> -->
            <span @click="downTemplate" class="downTemplate">下载模版</span>

            <t-upload ref="uploadRef" v-model="files" action="/web/api/addbyfile" :accept="'.xls,.xlsx'"
                theme="file-flow" multiple :headers="headerToken" :abridge-name="[8, 6]" :auto-upload="false" :max="10"
                :allow-upload-duplicate-file="false" :format-response="formatResponse" @one-file-success="fileSuccess">
            </t-upload>

        </t-dialog>

    </div>
</template>

<script lang="tsx" setup>
import { ref, computed, onMounted, reactive } from 'vue';
import {
    Input,
    Select,
    MessagePlugin,
    TableProps,
    TableInstanceFunctions,
    ButtonProps,
    UploadProps,
    UploadInstanceFunctions,
    Cascader
} from 'tdesign-vue-next';
import { validateInternationalPhoneNumber } from '@/utils/countryFile';
import { adduser } from '@/api/projectSetting';
import * as WebApp from '@/utils/webapp';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const props = withDefaults(
    defineProps<{
        asinOptions?: Array<any>;
        shopOptions?: Array<any>;
    }>(),
    {},
);

interface userIn {
    user_id: number,
    role: string,
    company_name: string
}
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
const LEVEL_OPTION = [
    {
        label: '关联ASIN',
        value: 'asin',
    },
    {
        label: '关联店铺',
        value: 'shop',
    },
];

const userInfo: userIn = JSON.parse(localStorage.getItem('account')).account

const loading = ref(false)
const emits = defineEmits(['addVisible']);
const rowIndex = ref(0)
const data = ref<TableProps['data']>([
    {
        key: String(rowIndex.value),
        belong_id: userInfo.user_id,
        company_name: userInfo.company_name,
        first_org: ' ',
        second_org: ' ',
        third_org: ' ',
        username: ' ',
        real_name: ' ',
        mobile: '',
        email: '',
        role: '',
        asin_ids: [],
        asins: [],
        level:'',
        shop_id:''
    }
]);
const selectedRowKeys = ref<TableProps['selectedRowKeys']>([]);


const tableRef = ref<TableInstanceFunctions>();
const rehandleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value
};
const delectTableLine = () => {
    if (selectedRowKeys.value && !selectedRowKeys.value.length) {
        MessagePlugin.error("未选择删除行！");
        return;
    }
    data.value = data.value.filter(item => !selectedRowKeys.value.includes(item.key.toString()));
}
function handleValidationResult(isValid, userData) {
    if (isValid) {
        console.log('submit==', data.value)
        return
        addUserList(userData)
    } else {
        loading.value = false
        MessagePlugin.warning('填写有误，请修改！');
    }
}

function removeInvalidKeys(result, keys) {
    Object.keys(result).forEach(key => {
        const isKeyInvalid = keys.some(item => key.includes(item));
        if (isKeyInvalid) {
            delete result[key];
        }
    });
}
// 用于提交前校验数据 
const validateTableData: ButtonProps['onClick'] = () => {

    tableRef.value.validateTableData().then((result) => {
        console.log('submit==', result.result)

        if (selectedRowKeys.value.length > 0) {
            removeInvalidKeys(result.result, selectedRowKeys.value);
        }
        const isValid = Object.keys(result.result).length === 0;
        if (data.value.length > 0) {
            loading.value = true
            loading.value = false
            handleValidationResult(isValid, data.value);
        } else {
            MessagePlugin.error('请填写组织架构信息！')
        }
    });
};
 

const columns = computed<TableProps['columns']>(() => [
    {
        colKey: 'row-select',
        type: 'multiple',
        width: 50,
    },
    {
        colKey: 'first_org', title: '一级组织',
        edit: {

            component: Input,

            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
            abortEditOnEvent: ['onEnter'],
            // 编辑完成，退出编辑态后触发
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
                {
                    max: 10,
                    message: '字符数量不能超过 10',
                    type: 'warning',
                },
            ],
            // 默认是否为编辑状态
            defaultEditable: true,
        },
    },
    {
        colKey: 'second_org', title: '二级组织',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {
                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            defaultEditable: true,
        },
    },
    {
        colKey: 'third_org', title: '三级组织',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            defaultEditable: true,
        },
    },
    {
        colKey: 'username', title: '用户名',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
                {
                    max: 10,
                    message: '字符数量不能超过 10',
                    type: 'warning',
                },
            ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'real_name', title: '真实姓名',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
                {
                    max: 10,
                    message: '字符数量不能超过 10',
                    type: 'warning',
                },
            ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'mobile', title: '手机号',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
                {
                    validator: validateInternationalPhoneNumber,
                    message: '请输入带国际区号的手机号！',
                },
            ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'email', title: '邮箱',
        edit: {
            component: Input,
            props: {
                clearable: true,
                autofocus: true,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
                { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址！' },
            ],
            defaultEditable: true,
        },
    },

    {
        colKey: 'role', title: '角色',
        edit: {
            component: Select,
            props: {
                clearable: true,
                options: STATUS_OPTIONS,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
                onChange: () => {
                    console.log('change', editContext.editedRow);
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },

            ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'level', title: '关联',
        edit: {
            component: Select,
            props: {
                clearable: true,
                options: LEVEL_OPTION,
            },
            validateTrigger: 'change',
            on: (editContext) => ({

                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {

                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
            rules: [
                {
                    required: true,
                    message: '不能为空',
                },
            ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'asin_ids', title: '关联ASIN',
        
        edit: {
            component: Cascader,
            props: {
                clearable: true,
                options: props.asinOptions,
                multiple: true,
                showAllLevels: false,
                keys: { label: 'value', value: 'value', disabled: 'isused', children: 'child' }
            },
            validateTrigger: 'change',
            on: (editContext) => ({
                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
                onChange: () => {
                    console.log('change', editContext.editedRow.asin_ids);
                    const asindata = WebApp.extractMarketplaceAsins(props.asinOptions, editContext.editedRow.asin_ids);
                    editContext.editedRow.asins = asindata
                },
            }),
            abortEditOnEvent: ['onEnter'],
            onEdited: (context) => {
                const newData = [...data.value];
                newData.splice(context.rowIndex, 1, context.newRowData);
                data.value = newData;
            },
          
            // rules: [
            //     {
            //         required: true,
            //         message: '不能为空',
            //     },

            // ],
            defaultEditable: true,
        },
    },
    {
        colKey: 'shop_id', title: '关联店铺',
        edit: {
            component: Cascader,
            props: {
                clearable: true,
                options: props.shopOptions,
                showAllLevels: false,
                keys: { label: 'value', value: 'id', disabled: 'isused', children: 'child' }
            },
            validateTrigger: 'change',
            on: (editContext) => ({
                onEnter: (ctx: {
                    e: {
                        preventDefault: () => void;
                    };
                }) => {
                    ctx?.e?.preventDefault();
                },
            }),
            abortEditOnEvent: ['onEnter'],
            defaultEditable: true,
        },
    },



]);

const addTableLine = () => {
    rowIndex.value += 1;
    data.value.push({
        key: String(rowIndex.value),
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
        asin_ids: [],
        asins: [],
        level:'',
        shop_id:''
    })
    tableRef.value.validateTableData().then((result) => {
        console.log('validate result: ', result, data.value);

    });
}
const downTemplate = () => {
    window.open('https://amz-filestore.oss-cn-beijing.aliyuncs.com/%E7%BB%84%E7%BB%87%E6%9E%B6%E6%9E%84%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%E5%8F%8A%E7%A4%BA%E4%BE%8B.xlsx')
}

const fileVisible = ref(false)
const files = ref<UploadProps['value']>([]);
const headerToken = computed(() => {
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    if (authToken === null) {
        WebApp.toPage('/login/index');
    }
    return { 'Authorization': 'Bearer ' + authToken.token }
})
const uploadRef = ref<UploadInstanceFunctions>();
const upload: ButtonProps['onClick'] = () => {
    uploadRef.value.triggerUpload();
};
const formatResponse: UploadProps['formatResponse'] = (res) => {
    if (!res) {
        return {
            status: 'fail',
            error: '上传失败，原因：文件过大或网络不通',
        };
    }
    return res;
};
const fileSuccess = (context: Pick<SuccessContext, 'e' | 'file' | 'response' | 'XMLHttpRequest'>) => {
    console.log('上传成功', context)
    if (context.response.code === 200) {
        MessagePlugin.success('上传成功')
        fileVisible.value = false
    } else {
        MessagePlugin.error(context.response.msg)
    }
}
const addFile = () => {
    fileVisible.value = true;
}
onMounted(() => {
})

async function addUserList(userData: any) {
    const formdata = {
        items: userData
    }
    const res = await adduser(formdata);
    loading.value = false
    MessagePlugin.success('提交成功！');
    emits('addVisible', false);
}
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
@import url('@/assets/css/theme.css');
@import url('@/assets/vendor/hs-mega-menu/dists/hs-mega-menu.min.css');

.main_content_one {

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

    .foot_btn {
        width: 20%;
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

.t-button--variant-base.t-button--theme-primary:not(.t-is-disabled):not(.t-button--ghost) {
    --ripple-color: transparent;
}

.downTemplate {
    color: #237FFA;
    font-weight: 400;
    margin-left: 10px;
    cursor: pointer;
    font-size: 16px;
    position: absolute;
    top: 75px;
    left: 160px;
}
</style>