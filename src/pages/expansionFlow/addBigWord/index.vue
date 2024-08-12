<template>
    <!-- 添加投放大词，小词，投放品，好词晋升 -->
    <div class="page">
        <t-layout>
            <head-menu :head-title="decodeURI(WebApp.getQueryFromUrl('title'))" />
            <t-content>
                <t-card :bordered="false" class="main_content_one">
                    <strategy-table  />
                </t-card>
            </t-content>
        </t-layout>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted} from 'vue';
import 'animate.css';
import * as WebApp from '@/utils/webapp';

onMounted(() => {

});
onUnmounted(() => {
});

</script>
<style lang="less" scoped>
@import url('@/style/common.less');
</style>
