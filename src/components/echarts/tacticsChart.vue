<template>
  <div id="tactics"></div>
</template>
<script lang="ts" setup>
import { onMounted, watch, reactive } from 'vue';
import * as echarts from 'echarts';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
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
  const option: EChartsOption  = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  
  legend: {
    data: [t('menu1_details.stablock_t3'),t('menu1_details.stablock_t4')]
  },
  xAxis: [
    {
      type: 'category',
      data: chartData.names,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: t('menu1_details.stablock_t3'),
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: t('menu1_details.stablock_t4'),
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} %'
      }
    }
  ],
  series: [
    {
      name:t('menu1_details.stablock_t3'),
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + '';
        }
      },
      itemStyle: {
        color: '#4A9EFF'
      },
      data:chartData.strategy_adopt_counts
    },
    
    {
      name: t('menu1_details.stablock_t4'),
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + '%';
        }
      },
      itemStyle: {
        color: '#FFD15C'
      },
      data:chartData.strategy_adopt_rates
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
