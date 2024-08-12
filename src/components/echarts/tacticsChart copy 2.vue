<template>
  <div id="tactics"></div>
</template>
<script lang="ts" setup>
import { onMounted, watch, reactive } from 'vue';
import * as echarts from 'echarts';
// 大盘总览 策略情况
type EChartsOption = echarts.EChartsOption;
type ECharts = echarts.ECharts;
const props = withDefaults(
  defineProps<{
    strategyChartList: any;
    tacticDataType: string;

  }>(),
  {},
);
const chartData: any = reactive({});
watch(
  () => [props.tacticDataType,props.strategyChartList ],
  () => {
  console.log('watch===', props.strategyChartList, chartData)

    Object.assign(chartData, props.strategyChartList)
    getChart();
  },
);
onMounted(() => {
  Object.assign(chartData, props.strategyChartList)
  console.log('onMounted===', props.strategyChartList, chartData)
  getChart();
});
function getChart() {
  const charEle = document.getElementById('tactics') as HTMLElement;
  const charEch: ECharts = echarts.init(charEle);
  const option: EChartsOption =  {
  xAxis: {
    type: 'category',
    data: chartData.names
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data:   chartData.strategy_adopt_counts  ,
      type: 'bar'
    }
  ]
};
  charEch.setOption(option);
}
</script>
<style lang="less" scoped>
#tactics {
  width: 96%;
  height: 100%;
}
</style>
