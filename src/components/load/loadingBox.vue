<template>
    <div ref="loadingBox" class="loadingBox">
        <div v-if="empty" class="no-data">
            <img :src="WebApp.getImage('common/no_list.png')" />
            <p>暂无数据</p>
        </div>
        <div v-show="loading" v-loading="loading" class="load-text">正在加载</div>
        <div v-if="end" class="load-text">{{ noMoreTips }}</div>
        <div v-if="!empty && !loading && !end" class="load-more" @click="loadMore">加载更多</div>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue';
import * as WebApp from '@/utils/webapp';

const props = withDefaults(
    defineProps<{
        modelValue: number;
        pageSize?: number;
        loadData: (pi: PageInfo) => Promise<PageInfo<any>>;
        render: (data: any) => void;
        isScrollLoad?: boolean;
        noMoreTips?: string;
        online?: boolean;
    }>(),
    {
        pageSize: 20,
        isScrollLoad: true,
        noMoreTips: '已经到底啦',
    },
);
const emits = defineEmits(['update:modelValue']);

watch(
    () => props.modelValue,
    (page) => {
        if (page === 0) {
            init();
            loadPage();
        }
    },
);

watch(
    () => props.pageSize,
    (pageSize) => {
        init();
        pageInfo.value.pageSize = pageSize;
        loadPage();
    },
);

const pageInfo: Ref<PageInfo> = ref({ page: 0 });
const loading = ref(false);
const loadingBox: Ref<DOM> = ref(null);
let isScrolled = false;

const empty = computed(() => {
    return pageInfo.value.totalRecord === 0;
});

const end = computed(() => {
    return pageInfo.value.totalPage !== undefined && pageInfo.value.page !== undefined && pageInfo.value.totalPage > 0 && pageInfo.value.totalPage <= pageInfo.value.page;
});

const init = () => {
    pageInfo.value.page = props.modelValue;
    pageInfo.value.pageSize = props.pageSize;
    pageInfo.value.totalPage = -1;
    pageInfo.value.totalRecord = -1;
    isScrolled = false;
};

onMounted(() => {
    init();
    loadPage();
    if (props.isScrollLoad) {
        window.addEventListener('scroll', onScroll);
    }
});

onUnmounted(() => {
    if (props.isScrollLoad) {
        window.removeEventListener('scroll', onScroll);
    }
});

const onScroll = () => {
    isScrolled = true;
    const windowHeight: number = window.innerHeight;
    const top = loadingBox.value ? loadingBox.value.getBoundingClientRect().top : 0;
    if (top < windowHeight + 30 && !loading.value) {
        loadPage();
    }
};

const loadMore = () => {
    loadPage();
};

const loadPage = () => {
    if (pageInfo.value.page < 0 || end.value || empty.value) {
        return;
    }

    const pi: PageInfo = { page: !pageInfo.value.page ? 1 : pageInfo.value.page + 1, pageSize: pageInfo.value.pageSize };

    loading.value = true;
    props
        .loadData(pi)
        .then((value) => {
            pageInfo.value.page = value.page;
            pageInfo.value.totalRecord = value.totalRecord;
            pageInfo.value.totalPage = value.totalPage;
            props.render(value);

            emits('update:modelValue', value.page);
            nextTick(() => {
                const windowHeight: number = window.innerHeight;
                const y = loadingBox.value ? loadingBox.value.getBoundingClientRect().y : 0;
                if (y > 0 && y <= windowHeight && !isScrolled) {
                    loadPage();
                }
            });
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
<style scoped lang="less">
.loadingBox {
    width: 100%;
    text-align: center;
    color: #888;
}

.load-text {
    padding: 20px;
}
.load-more {
    padding: 20px;
    cursor: pointer;
}
.no-data {
    display: flex;
    justify-content: center;
    flex-direction: column;
    img {
        width: 360px;
        height: 360px;
        margin: 0 auto;
    }
    p {
        color: #333;
    }
}
</style>
