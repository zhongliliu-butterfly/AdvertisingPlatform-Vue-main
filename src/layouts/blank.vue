<template>
    <div class="page-wrapper">

       <left-menu v-if="authToken&&authToken.token"  />
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import * as WebApp from '@/utils/webapp';
const authToken = JSON.parse(localStorage.getItem('authToken'));
    
onMounted(() => {
    
});
</script>

<style lang="less" scoped>
.page-wrapper {
    margin: 0 auto;
    padding: 0;
    width: 100%;
    background: #eee;
    display: flex;
}
</style>
