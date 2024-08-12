<template>
    <div id="shopchar"></div>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, watch, reactive } from 'vue';
import * as echarts from 'echarts';
// 大盘总览 店铺经营情况
type EChartsOption = echarts.EChartsOption;
type ECharts = echarts.ECharts;
const props = withDefaults(
    defineProps<{
        shopChartList: any;
        shopDataType: string;
        shopDataTime: string;
    }>(),
    {},
);
const chartData: any = reactive({});
watch(
    () => [props.shopDataType, props.shopDataTime],
    () => {
        Object.assign(chartData, props.shopChartList)
        getChart();
    },
);
onMounted(() => {
    Object.assign(chartData, props.shopChartList)
    getChart();

});
function getChart() {
    const charEle = document.getElementById('shopchar') as HTMLElement;
    const charEch: ECharts = echarts.init(charEle);
    const option: EChartsOption = {
        tooltip: {
            trigger: 'axis',

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
                data: chartData.date
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: props.shopDataType === 'cust_unit_price' ? '{value} ' : '{value} %'
                }
            }
        ],
        series: [
            {
                name: '',
                type: 'line',
                smooth: true,
                data: props.shopDataType === 'cust_unit_price' ? chartData.cust_unit_price : chartData.pay_conversion_rate,
                color:'#FFD15C',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(255, 224, 144, 0.7)'
                        },
                        {
                            offset: 0.7,
                            color: 'rgba(255, 224, 144, 0)'
                        }
                    ])
                }
            }
        ]
    };



    charEch.setOption(option);
}
setInterval(function () {
}, 2000);
</script>
<style lang="less" scoped>
#shopchar {
    width: 96%;
    height: 100%;
}
</style>
