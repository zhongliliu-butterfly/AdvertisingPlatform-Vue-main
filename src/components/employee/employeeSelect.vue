<template>
    <div>
        <t-dialog class="dialog-box" :header="title" :top="'50px'" :confirm-btn="`确认(${selectedRows.length})`" :visible="visible" :on-close="onCancel" :on-cancel="onCancel" @confirm="onConfirm">
            <div class="dialog-body-box">
                <div class="tree">
                    <t-tree :data="treeData" :activable="true" :line="true" expand-all :icon="true" :default-expanded="[1]" :load="onLoad" :on-click="checkDept" :expand-level="1" :keys="{ label: 'name', value: 'id', children: 'isParent' }" />
                </div>
                <div class="table">
                    <div class="search">
                        <div class="search-item">
                            <div class="search-title">姓名</div>
                            <div class="search-input">
                                <t-input v-model="emplName" class="from-control"></t-input>
                            </div>
                        </div>
                        <div class="search-item">
                            <t-button @click="loadDatas(true)">搜索</t-button>
                        </div>
                    </div>
                    <div class="table-content">
                        <t-table height="calc(100% - 50px)" class="table-item" :loading="loading" row-key="emplId" :data="data" :columns="columns" :bordered="true" table-layout="auto" :hover="true" size="medium" :pagination="pagination" cell-empty-content="-" :selected-row-keys="selectedRowKeys" :on-select-change="rehandleSelectChange" @page-change="onPageChange"></t-table>
                    </div>
                </div>
            </div>
        </t-dialog>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, Ref, ref } from 'vue';
import { SelectOptions, TableRowData } from 'tdesign-vue-next/es/table';
import { TreeNodeModel } from 'tdesign-vue-next/es/tree';
import { TreeOptionData } from 'tdesign-vue-next/es/common';
import { Employee } from '@/types/model.user';
import { request } from '@/utils/request';
import { TreeBean } from '@/types/model.tree';

export interface EmployeeSelectBox {
    open: () => void;
}
const visible = ref(false);
const selectedRowKeys: Ref<Array<number | string>> = ref([]);
const selectedRows: Ref<Array<Employee>> = ref([]);
const open = () => {
    deptId.value = 1;
    emplName.value = '';
    selectedRowKeys.value.length = 0;
    if (props.modelValue) {
        Object.assign(selectedRowKeys.value, props.modelValue.split(','));
    }
    initData();
    loadDatas(true);
    loadTree().then(() => {
        visible.value = true;
    });
};

const Api = {
    Employee: '/system/employee/select/page.do',
    Tree: '/system/department/select/tree.do',
    Init: '/system/employee/select/init.do',
};
const props = withDefaults(
    defineProps<{
        modelValue?: string;
        echoData?: Function;
        multiple?: boolean;
        title?: string;
    }>(),
    { modelValue: '', echoData: () => {}, multiple: false, title: '选择人员' },
);

const emits = defineEmits(['update:modelValue']);

onMounted(() => {});

const emplName = ref('');
const deptId: Ref<number | string> = ref(1);
const children = ref(true);
const loading = ref(true);
const data: Array<Employee> = reactive([]);
const treeData: Ref<Array<TreeBean>> = ref([]);
const columns: Ref<Array<any>> = ref([
    { colKey: 'row-select', type: props.multiple ? 'multiple' : 'single' },
    // { colKey: 'index', title: '序号' },
    { colKey: 'emplName', title: '姓名', width: '120' },
    { colKey: 'dept.path', title: '所属组织' },
]);
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
});

defineExpose<EmployeeSelectBox>({ open });

const initData = async () => {
    const res = await request.post<Array<Employee>>({
        url: Api.Init,
        data: { selected: selectedRowKeys.value },
    });
    if (res) {
        selectedRows.value.length = 0;
        selectedRowKeys.value.length = 0;
        for (let i = 0; i < res.length; i++) {
            const element = res[i];
            selectedRows.value.push(element);
            selectedRowKeys.value.push(element.emplId || 0);
        }
    }
};

const onLoad = async (node: TreeNodeModel<TreeOptionData>) => {
    const res = await request.post<Array<TreeOptionData>>({
        url: Api.Tree,
        data: { parentId: node.value },
    });
    return res;
};

const loadTree = async () => {
    const res = await request.post<Array<TreeBean>>({
        url: Api.Tree,
        data: { parentId: 0 },
    });
    if (res) {
        treeData.value.length = 0;

        treeData.value = [];
        const expendDatas = [];
        let firstData: any = {};
        for (let i = 0; i < res.length; i++) {
            if (res[i].parentId === '0') {
                firstData = res[i];
            } else {
                expendDatas.push(res[i]);
            }
        }
        firstData.isParent = expendDatas;
        treeData.value.push(firstData);
    }
};

const checkDept = (context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) => {
    if (context.node.value && context.node.value && (context.e.target as HTMLElement).innerText) {
        deptId.value = context.node.value;
        loadDatas(true);
    }
};

const loadDatas = async (clear: boolean) => {
    loading.value = true;
    if (clear) {
        pagination.value.current = 1;
    }
    const res = await request.post<PageInfo<Employee>>({
        url: Api.Employee,
        data: { page: pagination.value.current, pageSize: pagination.value.pageSize, emplName: emplName.value, deptId: deptId.value, children: children.value },
    });
    if (res) {
        data.length = 0;
        loading.value = false;
        Object.assign(data, res.data);
        pagination.value.total = res.totalRecord || 0;
    }
};

const onPageChange = (pageInfo: any) => {
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    loadDatas(false);
};

const rehandleSelectChange = (value: Array<number | string>, selectData: SelectOptions<TableRowData>) => {
    selectedRowKeys.value = value;

    const tempRows: Array<Employee> = [];
    if (value) {
        for (let index = 0; index < selectedRows.value.length; index++) {
            const element = selectedRows.value[index];
            if (selectedRowKeys.value && selectedRowKeys.value.indexOf(element.emplId || 0) >= 0) {
                tempRows.push(element);
            }
        }
    }
    if (selectData && selectData.selectedRowData) {
        for (let i = 0; i < selectData.selectedRowData.length; i++) {
            const element = selectData.selectedRowData[i];
            if (element) {
                const empl: Employee = {};
                Object.assign(empl, element);
                let flag = 0;
                for (let index = 0; index < tempRows.length; index++) {
                    const temp = tempRows[index];
                    if (temp.emplId === element.emplId) {
                        flag = 1;
                    }
                }
                if (flag === 0) {
                    tempRows.push(empl);
                }
            }
        }
    }
    selectedRows.value.length = 0;
    Object.assign(selectedRows.value, tempRows);
};

function onConfirm() {
    emits('update:modelValue', selectedRowKeys.value.join(','));
    if (props.echoData) {
        props.echoData(selectedRows.value);
    }
    visible.value = false;
}
function onCancel() {
    visible.value = false;
}
</script>
<style scoped lang="less">
:deep(.t-dialog__body) {
    height: 70vh;
}

.tree {
    width: 20%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    flex-shrink: 0;
    flex-grow: 0;
    border-right: 1px solid #e5e5e5;
    padding: 5px 0;
}
.table {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
}

.table-content {
    flex-grow: 1;
    flex-basis: 0;
    height: 0;
}

.table-item {
    height: 100%;
}
:deep(.t-table__header--fixed:not(.t-table__header--multiple) > tr > th) {
    position: relative;
    height: 48px;
}
:deep(.t-table__th-cell-inner) {
    position: absolute;
}
.search {
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    padding-top: 15px;
}

.search-item {
    float: left;
    margin: 0 0 15px 0;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    width: 26%;

    .search-title {
        flex-grow: 0;
        flex-shrink: 0;
        display: block;
        height: 34px;
        line-height: 34px;
        padding-right: 0.5em;
        text-align: justify;
        text-align-last: justify;
        width: 3.5em;
    }
    .search-input {
        flex-grow: 1;

        .form-control {
            display: block;
            width: 100%;
            height: 34px;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.42857143;
            color: #555;
            background-color: #fff;
            background-image: none;
            border: 1px solid #ccc;
            border-radius: 4px;
            -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
            box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
            -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
            -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
            -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
            transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
            transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
            transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
        }
    }
}

:deep(.t-input--auto-width) {
    min-width: 100px;
}

.dialog-body-box {
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: 0 10px;
}

:deep(.t-dialog__footer) {
    padding: 0;
}

:deep(.t-table__pagination) {
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l) 0 var(--td-comp-paddingLR-l);
}
</style>
