<template>
    <div  class="main" id="costData"></div>
</template>
<script lang="ts" setup>
import { onMounted,watch,Ref,ref,reactive,computed } from 'vue';

import * as echarts from 'echarts';
// 广告智能投放-降本增效-精准否词-策略明细-cost 广告花费图表
type EChartsOption = echarts.EChartsOption;
const props = withDefaults(
    defineProps<{
        costData:any;
        rowName?:string;
    }>(),
    {},
);
const chartData: any = reactive({});

watch(
    () => props.costData.week_list,
    () => {
      Object.assign(chartData,props.costData)
      getChart();
    },
);
onMounted(() => {
  Object.assign(chartData,props.costData);
  console.log(props.costData,chartData)
  getChart();

});
function getChart(){
  const chartDom = document.getElementById(`costData`) as HTMLElement;
    const myChart = echarts.init(chartDom);
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            type: 'category',
            name:'日',
            data: props.costData.week_list,
            // show: false
          },
          yAxis: {
            type: 'value',
            name:'广告花费'
            // splitLine: { show: false },
            // show: false
          },
          tooltip: {
            trigger: 'axis',
          },
          series: [
            {
              data: props.rowName==='aba_rank'?props.costData.aba_rank_list:props.costData.cost_list,
              type: 'line',
              symbol: 'none',
              color: '#377dff',
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option,true);
}
 
</script>
<style lang="less" scoped>
.main {
    width:600px;
    height: 300px;
}
</style>
