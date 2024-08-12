<template>
    <t-select v-model="value" :multiple="multiple" :style="style" :placeholder="placeholder">
        <t-option v-for="item in options" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" />
    </t-select>
</template>
<script lang="ts">
export default {
    name: 'Selector',
};
</script>
<script lang="ts" setup>
import { reactive, onMounted, WritableComputedRef, computed } from 'vue';
import { Dictionary } from '@/types/model.common';
import { request } from '@/utils/request';

const Api = {
    Init: '/system/select/select.do',
};
const options: Array<Dictionary> = reactive([]);

const props = withDefaults(
    defineProps<{
        modelValue?: string | Array<string>;
        dictType: string;
        multiple?: boolean;
        disabled?: boolean;
        style?: string;
        placeholder?: string;
    }>(),
    { multiple: false, disabled: false, placeholder: '请选择' },
);

const emits = defineEmits(['update:modelValue']);

const value: WritableComputedRef<string | Array<string>> = computed({
    get() {
        if (props.multiple) {
            if (props.modelValue) {
                if (typeof props.modelValue === 'string') {
                    return props.modelValue.split(',');
                }
                return props.modelValue;
            }
            return [];
        }
        return props.modelValue || '';
    },
    set(val) {
        emits('update:modelValue', val);
    },
});

onMounted(() => {
    loadOptions();
});

const loadOptions = async () => {
    const res = await request.post<Array<Dictionary>>({
        url: Api.Init,
        data: { typeCode: props.dictType },
    });
    if (res) {
        Object.assign(options, res);
    }
};
</script>

<style scoped></style>
