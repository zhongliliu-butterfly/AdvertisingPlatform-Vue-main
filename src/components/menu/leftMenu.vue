<template>
    <t-menu class="top-menu-temp" v-model:expanded="expanded" theme="light" :default-value="checkedValue"
        expand-mutex @change="changeHandler" :collapsed="collapsed">
        <template #logo>
            <img width="28" height="28" :src="WebApp.getImage('common/logo.png')" alt="logo" />
            <div class="logo-info">
                <h3 class="logo-title" v-if="!collapsed">{{ t('projectName') }}</h3>
                <span>{{ t('projectSubName') }}</span>
            </div>
        </template>
        <t-menu-item v-for="item in tabs" :value="item.value" :key="item.value" @click="router.replace(item.url)">
            <template #icon>
                <img class="iconImg" width="auto" height="14"
                    :src="WebApp.getImage(`${curTab === item.value ? item.icon : item.icon+'_gray'}.png`)" />
            </template>
            {{ item.label }}
        </t-menu-item>
        <template #operations>
            <t-button variant="text" shape="square" @click="changeCollapsed">
                <template #icon><t-icon name="view-list" /></template>
            </t-button>
        </template>
    </t-menu>
</template>

<script lang="ts" setup>
import { MessagePlugin, MenuProps, ButtonProps } from 'tdesign-vue-next';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import * as WebApp from '@/utils/webapp';
import { store, useRateStore } from '@/store';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { accountInfo } from '@/types/model.home';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const router = useRouter(), route = useRoute();
const props = withDefaults(
    defineProps<{
        // checkedValue?: any;
        checkedExpanded?: Array<any>;
    }>(),
    {},
);
const curTab = ref(0);
const tabs = ref([{
	icon: 'menu/prds',
	value: 0,
	label: '我的商品',
	url: '/page/products'
},{
	icon: 'menu/msg',
	value: 1,
	label: '原声洞察',
	url: '/page/statistic'
},{
	icon: 'menu/calc',
	value: 2,
	label: '行业分析',
	url: '/page/industryAnalysis'
},{
	icon: 'menu/custom',
	value: 3,
	label: '消费者说',
	url: '/page/custom'
}])
const accountData: accountInfo = JSON.parse(localStorage.getItem('account')).account
const checkedValue:any = ref('') // decodeURI(WebApp.getQueryFromUrl('title'))
const menuKeys = [
    t('menu3_1_1'),
    t('menu3_1_2'),
    t('menu3_1_3'),
    t('menu3_1_4'),
    t('menu3_1_5'),
    t('menu3_1_6'),
    t('menu3_2_1'),
    t('menu3_2_2'),
    t('menu3_2_3'),
    t('menu3_2_4'),
    t('menu3_2_5'),
    t('menu3_3'),
    t('menu3_4')
];
const collapsed = ref(false)
const expanded = ref<MenuProps['expanded']>([]);
const changeHandler: MenuProps['onChange'] = (active) => {
    console.log('change==', active, expanded.value);
		curTab.value = active;
    sessionStorage.setItem('expanded',JSON.stringify(expanded.value))
};
function executeTask() {
    // 这里是你需要执行的任务，比如请求数据或更新视图等
    localStorage.removeItem('rateData');
    const rateStore = useRateStore();
    rateStore.getRateData();
}

let timeoutId;

function setupTimer() {
    const delay = calculateDelay();
    timeoutId = setTimeout(() => {
        executeTask();
        setupTimer(); // 任务执行后重新设置定时器
    }, delay);
}
onMounted(() => {
    setupTimer();
   const a=JSON.parse(sessionStorage.getItem('expanded'));
   if(a&&a.length>0){
    expanded.value=a
   }
    if(route.path.includes('/products')) {
        curTab.value = 0
    } else if(route.path.includes('/statistic')) {
        curTab.value = 1
    } else if(route.path.includes('/industryAnalysis')) {
        curTab.value = 2
    } else if(route.path.includes('/custom')) {
        curTab.value = 3
    }
    checkedValue.value = tabs.value[curTab.value].label;
});
onUnmounted(() => {
    clearTimeout(timeoutId); // 清除定时器，防止内存泄漏
});

onBeforeRouteUpdate((to) => {
    if(to.path.includes('/products')) {
        curTab.value = 0
    } else if(to.path.includes('/statistic')) {
        curTab.value = 1
    } else if(to.path.includes('/industryAnalysis')) {
        curTab.value = 2
    }
    checkedValue.value = tabs.value[curTab.value].label;
})
 
const changeCollapsed = () => {
    collapsed.value = !collapsed.value;

};
function calculateDelay() {
    const now = new Date();
    const next = new Date();

    if (now.getHours() >= 12) {
        next.setDate(next.getDate() + 1);
        next.setHours(0, 0, 0, 0);
    } else {
        next.setHours(12, 0, 0, 0);
    }

    return next.getTime() - now.getTime();
}
</script>

<style lang="less" scoped>
@import url('@/style/style.less');

.top-menu-temp {
    height: 100%;
    min-height: 800px;
    background: @back-bg;
}

:deep(.t-menu__logo) {
	height: 70px !important;
  border-bottom: none !important;
}

.logo-info {
    text-align: left;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    span {
        font-size: 8px;
        line-height: 14px;
        color: #CCCCCC;
    }
}

.logo-title {
    font-size: 20px;
    line-height: 22px;
    font-weight: @font-weight-medium;
    // line-height: @line-height-medium;
    text-align: left;
    color: @color-info;
    // margin: auto 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0px;
}
:deep(.t-menu) {
	padding: 25px 0 0;
}

:deep(.t-menu__content) {
	font-size: 14px;
	color: #999999;
}

:deep(.t-menu__item.t-is-active) {
    background: #F7F7FA !important;
		position: relative;

		&::before {
			content: '';
			width: 4px;
			height: 100%;
			background: #003469;
			// filter: blur(4px);
			position: absolute;
			right: 0px;
			top: 0;
		}

		&::after {
			content: '';
			width: 4px;
			height: 100%;
			background: #003469;
			filter: blur(8px);
			position: absolute;
			right: 0;
			top: 0;
		}

    .t-menu__content {
      color: #111111 !important;// @color-primary !important;
			font-size: 14px;
			font-weight: 600;
    }
}

:deep(.t-menu__item) {
    height: 46px;
    line-height: 46px;
    margin-bottom: 15px;
		padding: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
}

.iconImg {
    margin-right: 10px;
}

.t-demo-collapse-btn {
    color: #fff;

    &:hover {
        background-color: #4b4b4b;
        border-color: transparent;
        --ripple-color: #383838;
    }
}
</style>