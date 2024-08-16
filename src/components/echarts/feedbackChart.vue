<template>
  <div class="chart">
    <t-space class="chart-nav" :size="4">
      <img width="auto" height="14" :src="WebApp.getImage(`products/index_${props.adChart.index}.png`)" alt="">
      <span class="chart-nav-title">{{ titleMap[props.adChart.index] }}级标签占比</span>
      <div class="chart-nav-tag" v-if="props.adChart.index > 1">
        <span>所属上级标签</span>
        <t-select
          size="small"
          v-model="tag"
          placeholder="请选择"
          style="width: 98px; display: inline-block; margin-right: 20px"
          clearable
        >
          <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
            {{ item.label }}
          </t-option>
        </t-select>
      </div>
    </t-space>
    <div class="echarts-box" :id="`feedbar-${props.adChart.index}`"></div>
  </div>
</template>

<script lang="ts" setup>
import * as WebApp from '@/utils/webapp';
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
const titleMap = ref({
  1: '一',
  2: '二',
  3: '三'
});
const options = ref( [
  { label: '袖子', value: '1' },
  { label: '肩膀', value: '2' },
  { label: '胸口', value: '3' },
]);
const tag= ref('');
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
  const defaultColor = {
    1: ['#0073eb', '#3088e3', '#419cee','#85b7ec'],
    2: ['#eb3f00', '#ff5516', '#ff8558', '#ffa483'],
    3: ['#ebab00', '#ffc427','#ffd566', '#ffe6a2']
  }
  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '946',
      subtext: '评价量',
      left: '14%',
      top: '38%',  
      textStyle: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        color: '#111111'  
      },  
      subtextStyle: {  
        fontSize: 12,  
        color: '#aaa' ,
        // align: 'center' 
      } ,
      textAlign: 'center'
    },
    tooltip: {},
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: ['45%', '55%'],
        center: ['16%', '50%'], // 设置饼图的位置 
        avoidLabelOverlap: false,
        color: defaultColor[props.adChart?.index!],
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
          { value: 123, name: '缝制' },
          { value: 84, name: '其他' }
        ],
        itemStyle: {
          // borderRadius: 10,
          // normal: {  
          //   color: {
          //     type: 'linear',
          //     x: 0,
          //     y: 0,
          //     x2: 0,
          //     y2: 1,
          //     colorStops: [{
          //       offset: 0, color: '#50A5FF' // 0% 处的颜色
          //     }, {
          //       offset: 1, color: '#0073EB' // 100% 处的颜色
          //     }],
          //     global: false // 缺省为 false
          //   },
          //   shadowColor: 'rgb(237, 245, 255, 0.8)', // 投影颜色  
          //   shadowBlur: 2, // 投影模糊程度  
          //   shadowOffsetX: 0, // 投影水平偏移  
          //   shadowOffsetY: 0 // 投影垂直偏移  
          // } 
        }
      },
      {
        name: '条形图',
        type: 'bar',
        data: [
          { value: 296, name: '版本' },
          { value: 198, name: '面料' },
          { value: 123, name: '缝制' },
          { value: 84, name: '其他' }
        ],
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        color: defaultColor[props.adChart?.index!],
        label: {  
          show: true,  
          position: [0, -2], // 外部展示  
          formatter: '{b} {c}', // 显示名称和数值  
          overflow: 'break',
          verticalAlign: 'bottom',
          color: '#111111'
        },
        // itemStyle: {
        //   color: '#5470C6', 
        //   normal: {  
        //     borderRadius: [0, 12, 12, 0],
        //     color: {
        //       type: 'linear',
        //       x: 0,
        //       y: 0,
        //       x2: 1,
        //       y2: 0,
        //       colorStops: [{
        //           offset: 0, color: '#50A5FF' // 0% 处的颜色
        //       }, {
        //           offset: 1, color: '#0073EB' // 100% 处的颜色
        //       }],
        //       global: false // 缺省为 false
        //     },
        //     shadowColor: 'rgb(237, 245, 255, 0.8)', // 投影颜色  
        //     shadowBlur: 2, // 投影模糊程度  
        //     shadowOffsetX: 0, // 投影水平偏移  
        //     shadowOffsetY: 0 // 投影垂直偏移  
        //   } 
        // },
        barWidth: '5'
      },
    ],
    grid: { 
      left: '40%', 
      right: '10%', 
      top: '10%', 
      height: '90%', 
      containLabel: true  
    }, // 核心区域  
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
.chart-nav {
  display: flex;
  align-items: center;

  :deep(.t-space-item:nth-child(2)) {
    flex: 1;
  }

  .chart-nav-title {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    text-align: left;
    color: #111111;
  }

  .chart-nav-tag {
    span {
      font-family: PingFang SC;
      font-size: 11px;
      font-weight: 400;
      line-height: 12px;
      text-align: left;
      color: #CCCCCC;
      margin-right: 5px;
    }
  }
}
.echarts-box {
  width: 100%;
  height: 200px;
}
</style>