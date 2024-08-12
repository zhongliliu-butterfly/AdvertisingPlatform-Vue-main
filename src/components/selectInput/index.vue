<template>
    <t-space direction="vertical" class="tdesign-demo__select-input-multiple" style="width: 100%">
        <!-- :popup-props="{ trigger: 'hover' }" -->
        <t-select-input
            v-model:inputValue="inputValue"
            :value="keyValue"
            :allow-input="true"
            placeholder="请选择或输入"
            :popup-props="{
                overlayInnerClassName: ['narrow-scrollbar'],
                overlayInnerStyle: {
                    maxHeight: '280px',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    padding: '6px',
                },
            }"
            clearable
            multiple
            @tag-change="onTagChange"
            @input-change="onInputChange"
        >
            <template #panel>
                <t-checkbox-group v-if="options.length" :value="checkboxValue" :options="options" class="tdesign-demo__panel-options-multiple" @change="onCheckedChange" />
                <div v-else class="tdesign-demo__select-empty-multiple">暂无数据</div>
            </template>
            <template #suffixIcon>
                <chevron-down-icon />
            </template>
        </t-select-input>
    </t-space>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue';
import { ChevronDownIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { request } from '@/utils/request';

const Api = {
    Init: '/words/selectPage.do',
};
const inputValue = ref('');
const wordsName = ref('');
const props = withDefaults(
    defineProps<{
        modelValue?: Array<string>;
        multiple?: boolean;
        placeholder?: string;
    }>(),
    { placeholder: '请选择' },
);
// 全量数据
const options: Array<any> = reactive([]);
const emit = defineEmits(['getValue']);

const keyValue = ref([]);
if (props.modelValue && props.modelValue.length > 0) {
    props.modelValue.forEach((e: any) => {
        const dict = { label: `${e}`, value: e };
        keyValue.value.push(dict);
    });
    console.log(keyValue);
}

const checkboxValue = computed(() => {
    const arr = [];
    const list = keyValue.value;
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = list.length; i < len; i++) {
        list[i].value && arr.push(list[i].value);
    }
    return arr;
});
// 直接 checkboxgroup 组件渲染输出下拉选项
const onCheckedChange = (val, { current, type }) => {
    // 新增/删除标签
    if (type === 'check' && keyValue.value.length < 5) {
        const option = options.find((t) => t.value === current);
        keyValue.value.push(option);
    } else if (type === 'check' && keyValue.value.length > 4) {
        MessagePlugin.warning('最多可选择五个标签！');
    } else {
        keyValue.value = keyValue.value.filter((v) => v.value !== current);
    }
    changeVal();
};
// 可以根据触发来源，自由定制标签变化时的筛选器行为
const onTagChange = (currentTags: any, context: any) => {
    const { trigger, index, item } = context;
    if (trigger === 'clear') {
        keyValue.value = [];
    }
    if (['tag-remove', 'backspace'].includes(trigger)) {
        keyValue.value.splice(index, 1);
    }
    // 如果允许创建新条目
    if (trigger === 'enter' && keyValue.value.length < 5) {
        // 判断去重
        const option = options.find((t) => t.value === context.item);
        console.log(option);
        const keyLen = context.item.length;
        if (keyLen > 10) {
            MessagePlugin.warning('关键字不能超过10个字！');
        } else if (!option) {
            console.log(1111);

            const current = { label: item, value: item };
            keyValue.value.push(current);
            const newOptions = options.concat(current);
            options.length = 0;
            Object.assign(options, newOptions);
            inputValue.value = '';
        } else {
            const isMore = keyValue.value.find((t) => t.value === context.item);
            console.log(2222, isMore, keyValue);
            if (!isMore) {
                const current = { label: item, value: item };
                keyValue.value.push(current);
            }
            inputValue.value = '';
        }
    } else if (keyValue.value.length > 4) {
        MessagePlugin.warning('最多可选择五个标签！');
    }
    changeVal();
};
const onInputChange = (val, context) => {
    wordsName.value = val;
    loadOptions();
};
const changeVal = () => {
    const keyWords: any = ref([]);
    keyValue.value.forEach((e: any) => {
        keyWords.value.push(e.label);
    });
    console.log(keyWords.value);
    inputValue.value = '';
    emit('getValue', keyWords.value.join('、'));
};
onMounted(() => {
    loadOptions();
});

const loadOptions = async () => {
    const res = await request.post<any>({
        url: Api.Init,
        data: { isSelect: 1, pageSize: 10, wordsName: wordsName.value },
    });
    if (res.data) {
        const dicts: Array<any> = [];
        options.length = 0;
        res.data.forEach((e: any) => {
            const dict = { label: `${e.wordsName}`, value: e.wordsName };
            dicts.push(dict);
        });
        Object.assign(options, dicts);
    }
};
</script>
<style scoped>
.tdesign-demo__panel-options-multiple {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.tdesign-demo__panel-options-multiple .t-checkbox {
    display: flex;
    border-radius: 3px;
    line-height: 22px;
    cursor: pointer;
    padding: 3px 8px;
    color: var(--td-text-color-primary);
    transition: background-color 0.2s linear;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}
.tdesign-demo__panel-options-multiple .t-checkbox:hover {
    background-color: var(--td-bg-color-container-hover);
}
</style>
