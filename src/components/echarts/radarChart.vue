<template>
    <div id="char"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
// Echarts 为init（dom元素后的类型）
// EChartsOption 为 option 的类型
import { ECharts, EChartsOption, init } from 'echarts';

onMounted(() => {
    const charEle = document.getElementById('char') as HTMLElement;
    const charEch: ECharts = init(charEle);
    const option: EChartsOption = {
        radar: {
            // shape: 'circle',
            indicator: [
                { name: '工作年限', max: 50 },
                { name: '工作岗位', max: 100 },
                { name: '岗位证书', max: 100 },
                { name: '个人荣誉', max: 100 },
                { name: '团队荣誉', max: 100 },
                { name: '学习情况', max: 100 },
                { name: '知识贡献', max: 100 },
                { name: '特殊贡献', max: 100 },
                { name: '综合评价', max: 100 },
            ],
        },
        tooltip: { show: true },
        series: [
            {
                name: '',
                type: 'radar',
                data: [
                    {
                        value: [3, 60, 60, 60, 60, 60, 60, 60, 60],
                        name: '小云',
                    },
                ],
            },
        ],
    };
    charEch.setOption(option);
});
</script>
<style lang="less" scoped>
#char {
    width: 400px;
    height: 220px;
}
</style>
