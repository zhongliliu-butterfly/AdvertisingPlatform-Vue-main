<template>
  <div>
    
    <div class="cards">
      <problemAnalysis :adChart="{index: 1}" :shopDataTime="shopDataTime" />
      <problemAnalysis :adChart="{index: 2}" :shopDataTime="shopDataTime" />
      <problemAnalysis :adChart="{index: 3}" :shopDataTime="shopDataTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import problemAnalysis from '@/components/echarts/problemAnalysis.vue'
const shopDataTime = ref('')
</script>

<style lang="less" scoped>

.cards {
  display: flex;
  justify-content: space-evenly;

  .bar-chart {
    background: #fff;
    border-radius: 8px;
  }
}
</style>