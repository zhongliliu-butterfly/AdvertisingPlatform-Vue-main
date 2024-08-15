<template>  
  <div class="bar-chart">  
    <div class="bar-top">
      <h2><span style="color: #FF3600;">TOP{{props.adChart.index}}</span> 颜色与描述不符</h2>  
      <t-space>
        <!--  variant="default-filled" -->
        <t-radio-group size="small" v-model="type">
          <t-radio-button value="color">颜色</t-radio-button>
          <t-radio-button value="size">尺寸</t-radio-button>
        </t-radio-group>
      </t-space>
    </div>
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

<style lang="less" scoped>  
.bar-chart {  
  padding: 20px;  
  .bar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;


    :deep(.t-radio-group .t-radio-button__label) {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      text-align: left;
      color: #999999;
    }
    :deep(.t-radio-group .t-radio-button.t-is-checked) {
      border-color: #003469;
      border-width: 1px;
    }
    :deep(.t-radio-group .t-radio-button.t-is-checked .t-radio-button__label) {
      border-color: #003469;
      border-width: 1px;
      color: #003469;
    }
  }

  h2 {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    text-align: left;
    color: #111111;
    margin: 0;
  }
}  
.description {  
  margin-bottom: 20px;  
  p {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #999999;
  }
} 
.bar-chart-item {
  width: 100%;
  height: 200px;
} 
</style>