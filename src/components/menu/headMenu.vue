<template>
    <t-header>
        <div class="header">
            <p class="title">{{ headTitle }}</p>
            <t-auto-complete 
                v-model="keyword" 
                clearable 
                :placeholder="t('top_search')" 
                :options="['商品', '评论', '消费者声音', '标签', '店铺']" >
                <template #suffix-icon>
                    <img :src="WebApp.getImage('menu/search.png')" alt="">
                </template>
            </t-auto-complete>
            <span class="nav-item">{{ t('timeZone') }}</span>
            <span class="nav-item" @click="changeLang">中/EN</span>
            <div class="nav-item1">
                <img width="40" height="40" :src="WebApp.getImage('menu/unread.png')" />
            </div>
            <t-popup placement="bottom" trigger="click">
                <div class="user">
                    <span>{{accountData ? accountData.real_name : ''}}</span>
                    <img width="20" height="20" :src="WebApp.getImage('menu/avatar.png')" />
                </div>
                <template #content>
                    <div class="userInfo">
                        <div class="userBlock">
                            <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/avatar.png')" />
                            <div>
                                <p class="title">{{ accountData ? accountData.real_name : '' }} </p>
                                <p class="email">{{ accountData ? accountData.email : '' }}</p>
                            </div>
                        </div>
                        <div class="quitLogin" @click="logOutUser">
                            <img class="iconImg" width="20" height="20" :src="WebApp.getImage('menu/quit.png')" />
                            <div>
                                <p class="title">{{t('btn.exit')}} </p>
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
const { t, locale } = useI18n();
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
const changeLang = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
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
    min-width: 820px;
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

    .t-input__wrap, .t-auto-complete {
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
    .nav-item1 {
        padding: 0;
        background: #F7F7FA;
        margin-left: 10px;
        border-radius: 4px;

        img {
            margin: 0px;
        }
    }
    .user {
        margin-left: 10px;
        span {
            color: #666666;
            font-size: 12px;
        }

        img {
            height: 40px;
            width: auto;
            margin: 0 50px 0 10px;
        }
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
