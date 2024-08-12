<template>
    <div id="char"></div>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, watch, reactive } from 'vue';

import * as echarts from 'echarts';
// 大盘总览 blocks 折线图
type EChartsOption = echarts.EChartsOption;
type ECharts = echarts.ECharts;
const props = withDefaults(
    defineProps<{
        adChartList: any;
        shopDataTime: string;
    }>(),
    {},
);
const chartData: any = reactive({});
watch(
    () => [props.adChartList.labels, props.shopDataTime],
    () => {
        Object.assign(chartData, props.adChartList)
        getChart();
    },
);
onMounted(() => {


});
function getChart() {
    const charEle = document.getElementById('char') as HTMLElement;
    const charEch: ECharts = echarts.init(charEle);
    const option: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params: any) {
                // params 是包含当前数据点信息的对象  
                return `${params[0].axisValue}<br/>${params[0].marker}
                     ${params[0].seriesName}: ${params[0].value}<br/>ACOS均值:${chartData.datas[params[0].seriesIndex].acos}`;
            },
            // formatter: '{b}<br />{a0} <h3>{c0}</h3> ',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: chartData.labels
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: [
        ]
    };
    const data = ref({})
    chartData.datas.forEach(element => {
        option.series?.push({
            name: element.good_name,

            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            data: element.data,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(58, 137, 255, 0.8)'
                    },
                    {
                        offset: 0.8,
                        color: 'rgba(58, 137, 255, 0)'
                    }
                ])
            }
        })
    });
    charEch.setOption(option, true);
}
setInterval(function () {


    // // 获取新的数据
    // var newData1 = randomData();
    // var newData2 = randomData();

    // // 更新数据序列
    // option.series[0].data.push(newData1);
    // option.series[1].data.push(newData2);
    // option.xAxis.data.push(label);

    // // 保持数据点数量不超过20
    // if (option.series[0].data.length > 20) {
    //     option.series[0].data.shift();
    //     option.series[1].data.shift();
    //     option.xAxis.data.shift();
    // }

    // myChart.setOption(option);
}, 2000);
</script>
<style lang="less" scoped>
#char {
    width: 96%;
    height: 100%;
}
</style>
