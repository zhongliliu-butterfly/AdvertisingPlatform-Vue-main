<template>
    <div class="no-data">
        <img :src="WebApp.getImage('common/no_list.png')" />
        <p>暂无数据，待后续补充</p>
    </div>
</template>
<script lang="ts" setup>
import * as WebApp from '@/utils/webapp';
</script>
<style lang="less" scoped>
@import url('@/style/common.less');
.no-data {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 20px;
    img {
        width: 360px;
        height: 360px;
        margin: 0 auto;
    }
    p {
        color: #333;
        font-size: 18px;
    }
}
</style>
