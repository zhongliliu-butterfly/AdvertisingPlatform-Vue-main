<template>
    <div class="page">
        <img class="bg_img" :src="WebApp.getImage('common/login_bg.png')" alt="">
        <div class="register_block">
            <div class="register_box">

                <h3 class="register_title">登录</h3>
                <div class="register_form">
                    <t-form ref="form" :data="formData" :reset-type="'empty'" :rules="registerRules" :label-width="10"
                        @submit="onSubmit">
                        <t-form-item name="email">
                            <t-input v-model="formData.email" clearable placeholder="请输入邮箱">
                                <template #prefix-icon>
                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.3334 3.66634C10.3334 1.82539 8.84103 0.333008 7.00008 0.333008C5.15913 0.333008 3.66675 1.82539 3.66675 3.66634C3.66675 5.50729 5.15913 6.99967 7.00008 6.99967C8.84103 6.99967 10.3334 5.50729 10.3334 3.66634Z"
                                            fill="#5F6A7A" />
                                        <path
                                            d="M13.3334 10.333C13.3334 8.86025 12.1395 7.66634 10.6667 7.66634H3.33341C1.86066 7.66634 0.666748 8.86025 0.666748 10.333C0.666748 11.8058 1.86066 12.9997 3.33341 12.9997H10.6667C12.1395 12.9997 13.3334 11.8058 13.3334 10.333Z"
                                            fill="#5F6A7A" />
                                    </svg>
                                </template>

                            </t-input>
                        </t-form-item>

                        <t-form-item name="password">
                            <t-input v-model="formData.password" autocomplete type="password" clearable
                                placeholder="请输入密码">
                                <template #prefix-icon>
                                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M2.66659 3.66634C2.66659 1.82539 4.15897 0.333008 5.99992 0.333008C7.84087 0.333008 9.33325 1.82539 9.33325 3.66634V4.99967H9.66659C10.7712 4.99967 11.6666 5.8951 11.6666 6.99967V11.6663C11.6666 12.7709 10.7712 13.6663 9.66659 13.6663H2.33325C1.22868 13.6663 0.333252 12.7709 0.333252 11.6663V6.99967C0.333252 5.8951 1.22868 4.99967 2.33325 4.99967H2.66659V3.66634ZM7.99992 3.66634V4.99967H3.99992V3.66634C3.99992 2.56177 4.89535 1.66634 5.99992 1.66634L6.0749 1.66772C7.14473 1.70715 7.99992 2.58688 7.99992 3.66634ZM5.99992 8.33301C5.63173 8.33301 5.33325 8.63148 5.33325 8.99967V9.66634C5.33325 10.0345 5.63173 10.333 5.99992 10.333C6.36811 10.333 6.66659 10.0345 6.66659 9.66634V8.99967C6.66659 8.63148 6.36811 8.33301 5.99992 8.33301Z"
                                            fill="#5F6A7A" />
                                    </svg>
                                </template>
                            </t-input>
                        </t-form-item>
                        <t-form-item>
                            <div class="forgetpwd">
                                <t-checkbox v-model="isAgree" class="text-info">5天内自动登录</t-checkbox>
                                <span class="hand_detail" variant="outline" @click="openMsg">忘记密码？</span>
                            </div>
                        </t-form-item>
                        <t-form-item>
                            <t-button class="button-primary login_button" type="submit" :loading="loading"
                                block>登录</t-button>
                        </t-form-item>
                        <t-form-item>
                            <p>没有账号？ <span class="hand_detail"
                                    @click="WebApp.toPage(`/register/index`)">去注册</span> </p>
                        </t-form-item>
                    </t-form>

                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import * as WebApp from '@/utils/webapp';
import { MessagePlugin, FormProps, FormInstanceFunctions, ButtonProps } from 'tdesign-vue-next';
import { Login } from '@/api/login';
import { account, getStoreInfo } from '@/api/projectSetting';
import { useRateStore } from '@/store';
import { useI18n } from 'vue-i18n';
const { t,locale } = useI18n();
const formData = reactive({
    email: '',
    password: ''
});
const form = ref<FormInstanceFunctions>(null);
const loading = ref(false);
const storeInfo = ref([])
const registerRules = {

    email: [
        { required: true, message: '邮箱必填' },
        { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址' },
    ],

    password: [{ required: true, message: '密码必填' }],

};
const isAgree = ref(true)
const openMsg: ButtonProps['onClick'] = () => {
    MessagePlugin.warning('请联系官方客服或超级管理员!');
};

const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
    loading.value = true;

    if (validateResult === true) {
        getLogin();
    } else {
        loading.value = false;

        console.log('Validate Errors: ', firstError, validateResult);

    }
};

onMounted(() => {
    sessionStorage.setItem('changeCurrency', 'USD')
    sessionStorage.setItem('changeLanguage', 'zh')
    locale.value='zh'
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    if (authToken && authToken.token) {
        MessagePlugin.success('您已登录！')
        WebApp.toPage(`/index/index?title=`+t('menu1'))
    }
})

async function getLogin() {
    const res = await Login(formData);
    if (res.code === 200) {
        loading.value = false;
        handleLoginSuccess(res)

    } else {
        loading.value = false;
        MessagePlugin.error('账号或密码错误，请重试')
        form.value?.reset({
            fields: ['password'],
        });
    }
}
// 假设在登录成功后执行此函数-存token，汇率，account数据
function handleLoginSuccess(response: any) {
    const token = response.token; // 假设token在返回的数据中
    const now = new Date();
    const expiresIn = ref(5);
    // expiresIn 通常是以秒为单位，比如 3600 表示一个小时后过期
    if (isAgree.value !== true) {
        expiresIn.value = 1
    }
    const expiryTime = new Date(now.getTime() + expiresIn.value * 24 * 3600 * 1000); // 转换为毫秒

    const tokenData = {
        token: token,
        expiry: expiryTime.toISOString() // 将过期时间转换为 ISO 格式的字符串
    };

    localStorage.setItem('authToken', JSON.stringify(tokenData));
    const rateStore = useRateStore();
    rateStore.getRateData();


    getAccountData(expiryTime);



}
async function getStoreInfoData() {
    const res = await getStoreInfo();
    storeInfo.value = res
    // const profileList = ref([])
    // res.forEach(element => {
    //     if (element.profile_id) {
    //         profileList.value.push(element.profile_id)
    //     }
    // });
    // sessionStorage.setItem('profileList', JSON.stringify(profileList.value))
    if (storeInfo.value.length > 0) {
        WebApp.toPage(`/page/products`)
    } else {
        WebApp.toPage(`/projectSetting/authorization?title=`+t('menu6_1'))
    sessionStorage.setItem('expanded',JSON.stringify(["projectSetting"]))
    }
}
async function getAccountData(expiryTime: any) {
    const res = await account();
    const accountData = {
        account: res,
        expiry: expiryTime.toISOString() // 将过期时间转换为 ISO 格式的字符串
    };
    localStorage.setItem('account', JSON.stringify(accountData));
   
    MessagePlugin.success('登录成功');
    if (res.role === 'root') {
        getStoreInfoData()
    } else {
        WebApp.toPage(`/page/products`)
    }
}
</script>
<style lang="less" scoped>
@import url('@/style/login.less');

</style>
