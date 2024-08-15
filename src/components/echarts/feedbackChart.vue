<template>
  <div>
    <div class="echarts-box" :id="`feedbar-${props.adChart.index}`"></div>
  </div>
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
const type = ref('color');
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
  const chartDom = document.getElementById(`feedbar-${props.adChart.index}`) as HTMLElement;
  const myChart = echarts.init(chartDom);
  const keys = _.keys(props.adChart.series);
  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '一级标签占比',
      // subtext: '946 评价量',
      // left: 'center'
    },
    tooltip: {},
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: ['45%', '55%'],
        center: ['26%', '50%'], // 设置饼图的位置 
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 296, name: '版本' },
          { value: 198, name: '面料' },
          { value: 123, name: '维制' },
          { value: 84, name: '其他' }
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      {
        name: '条形图',
        type: 'bar',
        data: [
          { value: 296, name: '版本' },
          { value: 198, name: '面料' },
          { value: 123, name: '维制' },
          { value: 84, name: '其他' }
        ],
        itemStyle: {
          color: '#5470C6'
        },
        barWidth: '40%'
      },
    ],
    grid: // [
      { left: '55%', right: '5%', top: '18%', height: '70%', containLabel: true  }, // 核心区域  
    // ],
    yAxis: {
      type: 'category',
      data: ['版本', '面料', '维制', '其他'],
      axisLabel: {
        interval: 0  // 防止标签重叠  
      },
      axisLine: {  
        show: false // 隐藏 X 轴底部的线条  
      }, 
      axisTick: {  
        show: false // 显示刻度  
      },
    },
    xAxis: {
      type: 'value',
      show: false
    }
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}
</script>

<style lang="less" scoped>
.echarts-box {
  width: 400px;
  height: 270px;
}
</style>