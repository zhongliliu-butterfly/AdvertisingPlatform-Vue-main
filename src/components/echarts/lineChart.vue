<template>
  <div class="main" :id="`main${props.adChart.index}`"></div>
</template>
<script lang="ts" setup>
import { onMounted, watch, Ref, ref, reactive, computed } from 'vue';
import * as _ from "lodash" 
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
  const keys = _.keys(props.adChart.series);
  // 指定图表的配置项和数据
  var option = {
    title: { text: props.adChart.title},
    xAxis: {
      type: 'category',
      data: props.adChart.labels,
      show: true,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true },
      show: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: keys.map(v => ({
        name: props.adChart.series[v].name,
        icon: 'circle'
      }))
    },
    series: keys.map(v => ({
      name: props.adChart.series[v].name,
      data: props.adChart.series[v].data,
      type: 'line',
      symbol: 'circle',
      smooth: true,
      color: props.adChart.series[v].color,// 'rgba(58, 137, 255, 1)',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: props.adChart.series[v].highColor, //'rgba(58, 137, 255, 0.8)'
          },
          {
            offset: 1,
            color: props.adChart.series[v].lowColor, // 'rgba(58, 137, 255, 0)'
          }
        ])
      }
    }))
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}

</script>
<style lang="less" scoped>
.main {
  width: 552px;
  height: 340px;
}
</style>
