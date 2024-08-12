<template>
    <t-menu class="top-menu-temp" v-model:expanded="expanded" theme="light" :default-value="props.checkedValue"
        expand-mutex @change="changeHandler" :collapsed="collapsed">
        <template #logo>
            <img width="28" height="28" :src="WebApp.getImage('common/logo.png')" alt="logo" />
            <h3 class="logo-title" v-if="!collapsed">{{ t('projectName') }}</h3>
        </template>
        <t-menu-item value="grand_overview" @click=" WebApp.toPage('/index/index')">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedValue === 'grand_overview' ? 'menu/home_active.png' : 'menu/home.png')" />
            </template>
            {{ t('menu1') }}
        </t-menu-item>
        <t-menu-item value="intelligentDiagnosis" @click="WebApp.toPage('/intelligentDiagnosis/index')">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedValue === 'intelligentDiagnosis' ? 'menu/webpage_active.png' : 'menu/webpage.png')" />
            </template>
            {{ t('menu2') }}
        </t-menu-item>
        <t-submenu value="3">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedExpanded && props.checkedExpanded[0] === '3' ? 'menu/filter_active.png' : 'menu/filter.png')" />
            </template>
            <template #title>
                <span>{{ t('menu3') }}</span>
            </template>
            <t-submenu value="3-1" :title="t('menu3_1')">

                <t-menu-item value="negativeWord"  @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_1')+'&check=negativeWord')"> {{ t('menu3_1_1') }}
                </t-menu-item>
                <t-menu-item value="negativeCategory"  @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_2')+'&check=negativeCategory')"> {{ t('menu3_1_2') }}
                </t-menu-item>
                <t-menu-item value="negativeRoot" @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_3')+'&check=negativeRoot')"> {{ t('menu3_1_3') }}
                </t-menu-item>
                <t-menu-item value="pauseWord" @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_4')+'&check=pauseWord')"> {{ t('menu3_1_4') }}
                </t-menu-item>
                <t-menu-item value="pauseCategory" @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_5')+'&check=pauseCategory')"> {{ t('menu3_1_5') }}（？）
                </t-menu-item>
                <t-menu-item value="pausePromotion" @click="WebApp.toPage('/reduceCost/negativeWord?title='+t('menu3_1_6')+'&check=pausePromotion')"> {{ t('menu3_1_6') }}
                </t-menu-item>
            </t-submenu>
            <t-submenu value="3-2" :title="t('menu3_2')">

                <t-menu-item value="addBigWord" @click="WebApp.toPage('/expansionFlow/addBigWord?title='+t('menu3_2_1')+'&check=addBigWord')">  {{ t('menu3_2_1') }}
                </t-menu-item>
                <t-menu-item value="addSmallWord"  @click="WebApp.toPage('/expansionFlow/addBigWord?title='+t('menu3_2_2')+'&check=addSmallWord')">  {{ t('menu3_2_2') }}
                </t-menu-item>
                <t-menu-item value="addCategory"   @click="WebApp.toPage('/expansionFlow/addBigWord?title='+t('menu3_2_3')+'&check=addCategory')"> {{ t('menu3_2_3') }}
                </t-menu-item>
                <t-menu-item value="addPromotion" @click="WebApp.toPage('/expansionFlow/addPromotion?title='+t('menu3_2_4')+'&check=addPromotion')">{{ t('menu3_2_4') }}
                </t-menu-item>
                <t-menu-item value="goodWord"  @click="WebApp.toPage('/expansionFlow/addBigWord?title='+t('menu3_2_5')+'&check=goodWord')">  {{ t('menu3_2_5') }}
                </t-menu-item>
            </t-submenu>
            <t-menu-item value="adjustPrice" @click="WebApp.toPage('/intelligentDelivery/adjustPrice?title='+t('menu3_3')+'&check=adjustPrice')"> {{ t('menu3_3') }}（？）
            </t-menu-item>
            <t-menu-item value="adjustingBudget" @click="WebApp.toPage('/intelligentDelivery/adjustingBudget?title='+t('menu3_4')+'&check=adjustingBudget')">  {{ t('menu3_4') }}
            </t-menu-item>
        </t-submenu>
        <t-menu-item value="strategyEffect">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedValue === 'strategyEffect' ? 'menu/shield_active.png' : 'menu/shield.png')" />
            </template>
            {{ t('menu4') }}
        </t-menu-item>
        <t-submenu value="strategyManage" v-if="accountData&&accountData.role==='root'">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedExpanded && props.checkedExpanded[0] === 'strategyManage' ? 'menu/bookmark_active.png' : 'menu/bookmark.png')" />
            </template>
            <template #title>
                <span>{{ t('menu5') }}</span>
            </template>
            <t-menu-item value="addStrategy" @click="WebApp.toPage('/strategyManage/addStrategy')">  {{ t('menu5_1') }}
            </t-menu-item>
            <t-menu-item value="strategyMan" @click="WebApp.toPage('/strategyManage/strategyMan')"> {{ t('menu5_2') }}
            </t-menu-item>
        </t-submenu>
        <t-submenu value="projectSetting" v-if="accountData&&accountData.role==='root'">
            <template #icon>
                <img class="iconImg" width="20" height="20"
                    :src="WebApp.getImage(props.checkedExpanded && props.checkedExpanded[0] === 'projectSetting' ? 'menu/setting_active.png' : 'menu/setting.png')" />
            </template>
            <template #title>
                <span>{{ t('menu6') }}</span>
            </template>
            <t-menu-item value="authorization" @click="WebApp.toPage('/projectSetting/authorization')"> {{ t('menu6_1') }}
            </t-menu-item>
            <t-menu-item value="organization" @click="WebApp.toPage('/projectSetting/organization')"> {{ t('menu6_2') }}
            </t-menu-item>
        </t-submenu>


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
import { accountInfo } from '@/types/model.home';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
const props = withDefaults(
    defineProps<{
        checkedValue: any;
        checkedExpanded?: Array<any>;
    }>(),
    {},
);
const accountData: accountInfo = JSON.parse(localStorage.getItem('account')).account

const collapsed = ref(false)
const expanded = ref<MenuProps['expanded']>([]);
const iconUrl = ref('https://tdesign.gtimg.com/site/baseLogo-light.png');
const changeHandler: MenuProps['onChange'] = (active) => {
    console.log('change==', active, expanded.value);
};
function executeTask() {
    console.log('任务执行了 —— ' + new Date().toLocaleString());
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
    expanded.value = props.checkedExpanded;
    setupTimer();
   
});
onUnmounted(() => {
    clearTimeout(timeoutId); // 清除定时器，防止内存泄漏
});
 
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
    min-height: 800px;
    background: @back-info2;
}

.logo-title {
    font-size: 18px;
    font-weight: @font-weight-medium;
    line-height: @line-height-medium;
    text-align: left;
    color: @color-info;
    margin: auto 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.t-menu__content) {
    font-size: 16px;
    color: @color-info;

}

:deep(.t-menu__item.t-is-active) {
    background: @back-info2;

    .t-menu__content {
        color: @color-primary !important;

    }
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