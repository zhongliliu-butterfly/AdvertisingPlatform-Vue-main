<template>
  <div class="main" :id="'main' + props.adChart.index"></div>
</template>
<script lang="ts" setup>
import { onMounted, watch, Ref, ref, reactive, computed } from 'vue';

import * as echarts from 'echarts';
// 大盘总览 blocks 折线图
type EChartsOption = echarts.EChartsOption;
const props = withDefaults(
  defineProps<{
    adChart: any;
    shopDataTime: string;
  }>(),
  {},
);
const chartData: any = reactive({});

watch(
  () => props.adChart.labels,
  () => {
    Object.assign(chartData, props.adChart)
    getChart();
  },
);
onMounted(() => {
  Object.assign(chartData, props.adChart);
  getChart();

});
function getChart() {
  const chartDom = document.getElementById(`main${props.adChart.index}`) as HTMLElement;
  const myChart = echarts.init(chartDom);
  // 指定图表的配置项和数据
  var option = {
    xAxis: {
      type: 'category',
      data: props.adChart.labels,
      show: false
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      show: false
    },
    tooltip: {
      trigger: 'axis',
      
    },
    series: [
      {
        data: props.adChart.updateChart,
        type: 'line',
        symbol: 'none',
        smooth: true,
        color:'rgba(58, 137, 255, 1)',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58, 137, 255, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(58, 137, 255, 0)'
            }
          ])
        }
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}

</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 80px;
}
</style>
