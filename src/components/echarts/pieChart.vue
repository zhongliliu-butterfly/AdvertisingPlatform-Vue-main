<template>
    <div id="main"></div>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

import * as echarts from 'echarts';
import { sequenceRanking } from '@/api/home';

type EChartsOption = echarts.EChartsOption;

const peiColor = reactive(['#2B6CEE', '#4299F0', '#5ABFF2', '#2AEEEE', '#36E28C']);

onMounted(() => {
    getStudyCatalogOption();
});
async function getStudyCatalogOption() {
    const chartDom = document.getElementById('main') as HTMLElement;
    const myChart = echarts.init(chartDom);
    const data = await sequenceRanking(); // 饼图
    let num = 0;
    const color: Array<string> = [];
    data.forEach((element, index) => {
        element.value = Number(element.value);
        num += Number(element.value);
        color.push(peiColor[index]);
    });
    const option: EChartsOption = {
        title: [
            {
                text: `{name|总文件数 }\n{val|${num}}`,
                textStyle: {
                    rich: {
                        name: {
                            color: '#333333',
                            fontSize: 20,
                            lineHeight: 28,
                        },
                        val: {
                            color: '#000000',
                            fontSize: 40,
                            lineHeight: 56,
                        },
                    },
                },
                left: 'center',
                top: 'center',
            },
        ],
        tooltip: {
            trigger: 'item',
        },
        legend: {
            show: false,
            orient: 'horizontal',
            top: '5%',
            left: 'center',
        },
        series: [
            {
                type: 'pie',
                selectedMode: 'single',
                radius: ['40%', '70%'],
                itemStyle: {
                    borderRadius: 0,
                    borderWidth: 1,
                },
                color,

                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                data,
            },
        ],
    };
    myChart.setOption(option);
}
</script>
<style lang="less" scoped>
#main {
    width: 100%;
    height: 360px;
}
</style>
