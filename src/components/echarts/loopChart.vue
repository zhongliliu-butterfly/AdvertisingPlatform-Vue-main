<template>
    <div  class="main" :id="'main'+props.updateChart.index"></div>
</template>
<script lang="ts" setup>
import { onMounted,watch,Ref,ref } from 'vue';
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;
// 广告智能诊断页面环形图
const props = withDefaults(
    defineProps<{
        updateChart:any;
    }>(),
    {},
);
const datas: Ref<Array<any>> = ref([]);
const labels: Ref<Array<any>> = ref([]);
const index=ref(0);
watch(
    () => props.updateChart.index,
    () => {
      console.log('linechart',props)
      // 没走进来
    },
);
onMounted(() => {
  datas.value = props.updateChart.updateChart;
  labels.value = props.updateChart.labels;
  index.value = props.updateChart.index;
  getChart();

});
function getChart(){
  const chartDom = document.getElementById(`main${index.value}`) as HTMLElement;
    const myChart = echarts.init(chartDom);
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            type: 'category',
            data: labels.value,
            show: false
          },
          yAxis: {
            type: 'value',
            splitLine: { show: false },
            show: false
          },
          tooltip: {
            trigger: 'axis',
          },
          series: [
            {
              data: datas.value,
              type: 'line',
              symbol: 'none',
              color: '#377dff',
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
}
 
</script>
<style lang="less" scoped>
.main {
    width: 100%;
    height: 80px;
}
</style>
