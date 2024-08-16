<template>
  <div class="chart">
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
      text: '946',
      subtext: '评价量',
      left: '20%',
      top: '42%',  
      textStyle: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        color: '#111111'  
      },  
      subtextStyle: {  
        fontSize: 12,  
        color: '#aaa'  
      } 
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
            show: false,
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
          // borderColor: '#fff',
          // borderWidth: 2,
          normal: {  
            // borderRadius: [0, 12, 12, 0],
            // borderWidth: 4,
            // borderColor: '#edf5ff',
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
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        
        label: {  
          show: true,  
          position: [0, -2], // 外部展示  
          formatter: '{b}:{c}', // 显示名称和数值  
          overflow: 'break',
          verticalAlign: 'bottom'
        },
        itemStyle: {
          color: '#5470C6', 
          normal: {  
            borderRadius: [0, 12, 12, 0],
            // borderWidth: 4,
            // borderColor: '#edf5ff',
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
        barWidth: '8'
      },
    ],
    grid: // [
      { left: '50%', right: '5%', top: '18%', height: '70%', containLabel: true  }, // 核心区域  
    // ],
    yAxis: {
      type: 'category',
      data: ['53%', '45%', '32%', '24%'],
      position: 'right',
      show: true,
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
  width: 100%;
  height: 270px;
}
</style>