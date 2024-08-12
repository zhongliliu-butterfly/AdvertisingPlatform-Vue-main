<template>
    <t-header>
        <div class="header">
            <p class="title">{{ headTitle }}</p>
            
            <t-input v-model="keyword" clearable placeholder="请输入您想搜索内容的关键词">
                <template #suffix-icon>
                    <img :src="WebApp.getImage('menu/search.png')" alt="">
                </template>
            </t-input>
            <span class="nav-item">时区</span>
            <span class="nav-item">中/EN</span>
            <!-- <t-popup placement="bottom">
                <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/rmb.svg')" />
                <template #content>
                    <t-radio-group :default-value="changeCurrency" class="changeCur" @change="getCurrencyChange">
                        <t-radio-button value="USD">美元</t-radio-button>
                        <t-radio-button value="CNY">人民币</t-radio-button>
                        <t-radio-button value="EUR">欧元</t-radio-button>
                        <t-radio-button value="GBP">英镑</t-radio-button>
                    </t-radio-group>

                </template>
            </t-popup>
            <t-popup placement="bottom">
                <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/global.svg')" />
                <template #content>
                    <t-radio-group :default-value="changeLanguage" class="changeCur" @change="getLanguageChange">
                        <t-radio-button value="zh">简体中文-ZH</t-radio-button>
                        <t-radio-button value="en">English-EN</t-radio-button>
                    </t-radio-group>

                </template>
            </t-popup> -->
            <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/bell.svg')" />
            <t-popup placement="bottom" trigger="click">
                <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/customer.png')" />
                <template #content>
                    <div class="userInfo">
                        <div class="userBlock">
                            <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/customer.png')" />
                            <div>
                                <p class="title">{{ accountData ? accountData.real_name : '' }} </p>
                                <p class="email">{{ accountData ? accountData.email : '' }}</p>
                            </div>
                        </div>
                        <div class="quitLogin" @click="logOutUser">
                            <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/quit.png')" />
                            <div>
                                <p class="title">退出登录 </p>
                            </div>
                        </div>
                    </div>

                </template>
            </t-popup>
        </div>

    </t-header>
</template>

<script lang="ts" setup>
import { MessagePlugin, MenuProps, ButtonProps, RadioGroupProps } from 'tdesign-vue-next';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as WebApp from '@/utils/webapp';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const props = withDefaults(
    defineProps<{
        headTitle: string;
    }>(),
    {},
);
const accountData = JSON.parse(localStorage.getItem('account')).account

const changeCurrency: any = ref('')
const changeLanguage = ref('')
const keyword = ref('')
const logOutUser = () => {
    MessagePlugin.success('退出登录！')
    localStorage.removeItem('authToken'); // 清除本地存储中的Token
    localStorage.removeItem('rateData'); // 清除本地存储中的Token
    localStorage.removeItem('account'); // 清除本地存储中的Token
    sessionStorage.removeItem('changeLanguage'); // 清除本地存储中的Token
    sessionStorage.removeItem('changeCurrency'); // 清除本地存储中的Token
    // sessionStorage.removeItem('profileList'); // 清除本地存储中的Token
    sessionStorage.removeItem('expanded'); // 清除本地存储中的Token
    WebApp.toPage('/login/index');
}
onMounted(() => {
    if (accountData === null) {
        logOutUser()
    }
    changeCurrency.value = sessionStorage.getItem('changeCurrency');
    locale.value=sessionStorage.getItem('changeLanguage')!==null?sessionStorage.getItem('changeLanguage'):'zh'
    changeLanguage.value = locale.value;
    console.log(sessionStorage.getItem('changeLanguage'), locale.value)
    if (changeCurrency.value === null) {
        changeCurrency.value = 'USD'
        sessionStorage.setItem('changeCurrency', 'USD')
    }
})
const getCurrencyChange: RadioGroupProps['onChange'] = (checkedValues) => {
    sessionStorage.setItem('changeCurrency', checkedValues)
    window.location.reload();

};
const getLanguageChange = (checkedLang) => {
    sessionStorage.setItem('changeLanguage', checkedLang)
    locale.value = checkedLang
}
</script>
<style lang="less" scoped>
// @import url('@/style/common.less');
@import url('@/style/style.less');
.t-layout__header {
    background: @back-bg;
    height: 70px;
}
.header {
    // padding: 10px;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title {
        flex: 1;
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

    .iconImg {
        margin: 6px 10px;
        cursor: pointer;
    }

    .t-input__wrap {
        width: 440px !important;;
        height: 40px !important;
        line-height: 40px !important;
        background: #F7F7FA !important;
    }
    :deep(.t-input) {
        width: 440px !important;;
        height: 40px !important;
        line-height: 40px !important;
        background: #F7F7FA !important;
        border: none !important;
    }
    .nav-item {
        height: 40px;
        line-height: 40px;
        background: #F7F7FA;
        color: #666666;
        font-size: 14px;
        padding: 0 12px;
        margin-left: 10px;
        border-radius: 4px;
    }
}

.changeCur {
    display: flex;
    flex-direction: column;

    :deep(.t-radio-button) {
        border: none;
    }
}

.userInfo {

    .userBlock,
    .quitLogin {
        display: flex;
        align-items: center;
        margin: 10px;
        padding: 0 10px;

        p {
            margin: 0;
        }

        img {
            margin-right: 20px;
        }

        .title {
            color: #1F2733;
            font-size: 16px;
        }

        .email {
            color: #9299A6;
        }
    }

    .userBlock {
        padding-bottom: 10px;
        border-bottom: 1px solid #e6e6e6;
    }

    .quitLogin {
        cursor: pointer;
    }

}
</style>
