<template>
    <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as WebApp from '@/utils/webapp';

onMounted(() => {
    let url = WebApp.getQuery('url');
    if (!url) {
        url = WebApp.getQueryFromUrl('url');
    }
    if (!url) {
        url = '/';
    }
    WebApp.replace(url);
});
</script>
