<template>  
  <div class="bar-chart">  
    <h2>TOP{{props.adChart.index}} 颜色与描述不符</h2>  
    <div class="description">  
      <p>反馈量：34，占全部反馈占比：3.68%，<br/>在蓝色上反馈最多，在红色上该问题反馈占比最大</p>  
    </div>  
    <div class="bar-chart-item" :id="`bar-${props.adChart.index}`"></div>
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
  const chartDom = document.getElementById(`bar-${props.adChart.index}`) as HTMLElement;
  const myChart = echarts.init(chartDom);
  const keys = _.keys(props.adChart.series);
  // 指定图表的配置项和数据
  var option = {
    // title: {  
    //   text: '反应量',  
    // },  
    tooltip: {},  
    xAxis: {  
      type: 'category',  
      data: ['黑色', '红色', '绿色', '深蓝色', '棕色'],  
      axisLine: {  
        show: false // 隐藏 X 轴底部的线条  
      }, 
      axisTick: {  
        show: false // 显示刻度  
      },
      axisLabel: {
        fontSize: '12px',
        color: "#666666"
      }, 
    },  
    yAxis: {  
      type: 'value', 
      axisLabel: {
        fontSize: '12px',
        color: "#CCC"
      }, 
      splitLine: { 
        show: true,
        lineStyle: {
          type: 'solid',
          color: '#f5f5f5',
        }
      }
    },  
    grid: {
      top: '3%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    series: [  
      {  
        name: '反馈量',  
        type: 'bar',  
        data: [34, 20, 15, 10, 5],  
        barWidth: 26,
        itemStyle: {  
          normal: {  
            borderRadius: [12, 12, 0, 0],
            borderWidth: 4,
            borderColor: '#edf5ff',
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#50A5FF' // 0% 处的颜色
              }, {
                  offset: 1, color: '#0073EB' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            shadowColor: 'rgb(237, 245, 255, 0.8)', // 投影颜色  
            shadowBlur: 2, // 投影模糊程度  
            shadowOffsetX: 0, // 投影水平偏移  
            shadowOffsetY: 0 // 投影垂直偏移  
          } 
        },  
      },  
    ],  
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}
</script>  

<style scoped>  
.bar-chart {  
  padding: 20px;  
}  
.description {  
  margin-bottom: 20px;  
} 
.bar-chart-item {
  width: 360px;
  height: 200px;
} 
</style>