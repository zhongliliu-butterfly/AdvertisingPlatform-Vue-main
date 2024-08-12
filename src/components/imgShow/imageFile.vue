<template>
    <div>
        <img v-if="imageFile" class="image" :src="WebApp.getHost() + imageFile.url" alt="" />
        <img v-else class="image" :src="WebApp.getImage('common/no-img.png')" />
    </div>
</template>
<script lang="ts" setup>
import * as WebApp from '@/utils/webapp';
import { Attachment } from '@/types/model.common';

const props = withDefaults(
    defineProps<{
        imageFile?: Attachment;
    }>(),
    {},
);
</script>
<style lang="less" scoped>
.image {
    width: 100%;
    height: 100%;
}
</style>
