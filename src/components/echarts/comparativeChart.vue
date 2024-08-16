<template>
  <div class="chart">
    <t-space class="chart-nav" :size="4">
      <img width="auto" height="14" :src="WebApp.getImage(`products/index_${props.adChart.index}.png`)" alt="">
      <span class="chart-nav-title">{{ titleMap[props.adChart.index] }}级标签占比</span>
      <div class="chart-nav-tag" v-if="props.adChart.index > 1">
        <span>所属上级标签</span>
        <t-select size="small" v-model="tag" placeholder="请选择"
          style="width: 98px; display: inline-block; margin-right: 20px" clearable>
          <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
            {{ item.label }}
          </t-option>
        </t-select>
      </div>
    </t-space>
    <div class="echarts-box" :id="`radar-${props.adChart.index}`"></div>
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
const options = ref([
  { label: '袖子', value: '1' },
  { label: '肩膀', value: '2' },
  { label: '胸口', value: '3' },
]);
const tag = ref('');
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
  const chartDom = document.getElementById(`radar-${props.adChart.index}`) as HTMLElement;
  const myChart = echarts.init(chartDom);
  const keys = _.keys(props.adChart.series);
  const defaultColor = {
    1: ['#0073eb', '#3088e3', '#419cee', '#85b7ec'],
    2: ['#eb3f00', '#ff5516', '#ff8558', '#ffa483'],
    3: ['#ebab00', '#ffc427', '#ffd566', '#ffe6a2']
  }
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '单位：%（百分比）',
      bottom: 0,
      textStyle: {
        fontSize: 10,
        // fontWeight: 'bold',  
        color: '#AAAAAA'
      },
    },
    tooltip: {
      trigger: 'item'
    },
    legend: [
      {
        orient: 'vertical', // 垂直排列  
        left: 'left',       // 图例位置：左边  
        data: [{
          name: '我方',
          icon: 'circle'
        }], // 图例名  
        itemWidth: 6, // 设置图标宽度  
        itemHeight: 6, // 设置图标高度,
        itemStyle: {
          color: '#0073EB'
        },
        textStyle: {
          fontSize: 12,  
          color: '#999999',
        }
      },
      {
        orient: 'vertical', // 垂直排列  
        right: 'right',     // 图例位置：右边  
        data: ['对方'], // 图例名  
        itemWidth: 0, // 设置图标宽度  
        itemHeight: 0, // 设置图标高度,
        formatter: function (name) {  
          // 在这里自定义图例的显示格式  
          return `{text|${name}}  {icon|}`;  
        }, 
        textStyle: {
          rich: {
            text: {
              fontSize: 12,  
              color: '#999999',
            },
            icon: {
              width: 6,
              height: 6,
              backgroundColor: '#FF3600', // 设置图例图标的颜色
              borderRadius: 6,   
            }
          }
        }
      }
    ],
    graphic: [
      {
        type: 'text',
        left: '3%',
        top: '13%', // 根据需要调整位置  
        style: {
          text: '评价数：529',
          fill: '#0073EB',
          font: '12px PingFang SC'
        }
      },
      {
        type: 'text',
        right: '4%',
        top: '13%', // 根据需要调整位置  
        style: {
          text: '评价数：870',
          fill: '#FF3600',
          font: '12px PingFang SC'
        }
      }
    ],
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    radar: {
      center: ['50%', '50%'],
      radius: '66%',
      indicator: [
        { name: '版型', max: 100 },
        { name: '类型', max: 100 },
        { name: '其他', max: 100 },
        { name: '维度', max: 100 },
        // { name: '版型', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 5,
      name: {
        textStyle: {
          color: '#111111',
          fonsSize: 12,
          backgroundColor: '#fff',
          borderRadius: 3,
          // padding: [0, 5]
        }
      },
      splitLine: {
        lineStyle: {
          color: '#EEEEEE'
        }
      },
      splitArea: {
        areaStyle: {
          color: '#ffffff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#EEEEEE'
        }
      }
    },
    series: [{
      name: '对比',
      type: 'radar',
      lineSmooth: true, 
      data: [
        {
          value: [74, 60, 40, 80],
          name: '我方',
          lineStyle: {
            color: '#0073EB',
            cap: 'round',
            join: 'round',
            width: 1
          },
          symbol: 'none',
          itemStyle: {
            borderCap: 'round',
            borderJoin: 'round'
          },
          areaStyle: {
            color: 'rgba(0, 115, 235, 0.2)'
            // color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
            //   {
            //     color: 'rgba(0, 115, 235, 0.1)',
            //     offset: 0
            //   },
            //   {
            //     color: 'rgba(0, 115, 235, 0.9)',
            //     offset: 1
            //   }
            // ])
          }
        },
        {
          value: [36, 85, 45, 65],
          name: '对方',
          lineStyle: {
            color: '#FF3600'
          },
          symbol: 'none',
          areaStyle: {
            color: 'rgba(255, 54, 0, 0.2)'
          }
        }
      ],
    }]
  };
  
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}
</script>

<style lang="less" scoped>
.chart {
  padding: 10px 16px;
}

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
  margin-top: 20px;
}
</style>