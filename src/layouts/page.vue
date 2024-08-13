<template>
    <div class="maintain">
        <leftMenu />
        <div class="right">
            <headMenu />
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as WebApp from '@/utils/webapp';
import leftMenu from '@/components/menu/leftMenu.vue';
import headMenu from '@/components/menu/headMenu.vue';

onMounted(() => {
    // let url = WebApp.getQuery('url');
    // if (!url) {
    //     url = WebApp.getQueryFromUrl('url');
    // }
    // if (!url) {
    //     url = '/';
    // }
    // WebApp.replace(url);
});
</script>

<style lang="less" scoped>
.maintain {
    width: 100%;
    height: 100%;
    display: flex;
    background: #fff;

    .right {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .main {
        width: 100%;
        height: 100%;
        flex: 1;
        background: #EFF0F5;
        border-top-left-radius: 8px;
        padding: 24px;
    }
}
</style>