<template>
    <div class="page">
        <img class="bg_img" :src="WebApp.getImage('common/login_bg.png')" alt="">

        <div class="register_block">
            <div class="register_box">
                <h3 class="register_title">欢迎免费注册试用</h3>
                <div class="register_form">
                    <t-form ref="form" :data="formData" :rules="registerRules" :label-width="10" @submit="onSubmit">
                        <t-form-item name="username">
                            <t-input v-model="formData.username" clearable placeholder="请输入用户名">
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
                        <t-form-item name="company_name">
                            <t-input v-model="formData.company_name" clearable placeholder="请输入企业名称">
                                <template #prefix-icon>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M7.6665 0.666992C8.77107 0.666992 9.6665 1.56242 9.6665 2.66699V12.0003C9.6665 12.7367 9.06955 13.3337 8.33317 13.3337H2.6665C1.56193 13.3337 0.666504 12.4382 0.666504 11.3337V2.66699C0.666504 1.56242 1.56193 0.666992 2.6665 0.666992H7.6665ZM12.3332 5.33366C13.0695 5.33366 13.6665 5.93061 13.6665 6.66699V12.0003C13.6665 12.7367 13.0695 13.3337 12.3332 13.3337H11.6665C10.9301 13.3337 10.3332 12.7367 10.3332 12.0003V6.66699C10.3332 5.93061 10.9301 5.33366 11.6665 5.33366H12.3332ZM5.6665 10.0003H4.6665C4.49556 10.0003 4.35467 10.129 4.33541 10.2948L4.33317 10.3337V11.667C4.33317 11.8379 4.46185 11.9788 4.62763 11.9981L4.6665 12.0003H5.6665C5.83745 12.0003 5.97834 11.8716 5.99759 11.7059L5.99984 11.667V10.3337C5.99984 10.1496 5.8506 10.0003 5.6665 10.0003ZM4.33317 6.33366H3.6665C3.49556 6.33366 3.35467 6.46234 3.33541 6.62812L3.33317 6.66699V7.33366C3.33317 7.5046 3.46185 7.64549 3.62763 7.66475L3.6665 7.66699H4.33317C4.50412 7.66699 4.64501 7.53831 4.66426 7.37253L4.6665 7.33366V6.66699C4.6665 6.4829 4.51727 6.33366 4.33317 6.33366ZM6.6665 6.33366H5.99984C5.82889 6.33366 5.688 6.46234 5.66875 6.62812L5.6665 6.66699V7.33366C5.6665 7.5046 5.79518 7.64549 5.96096 7.66475L5.99984 7.66699H6.6665C6.83745 7.66699 6.97834 7.53831 6.99759 7.37253L6.99984 7.33366V6.66699C6.99984 6.4829 6.8506 6.33366 6.6665 6.33366ZM4.33317 4.33366H3.6665C3.49556 4.33366 3.35467 4.46234 3.33541 4.62812L3.33317 4.66699V5.33366C3.33317 5.5046 3.46185 5.64549 3.62763 5.66475L3.6665 5.66699H4.33317C4.50412 5.66699 4.64501 5.53831 4.66426 5.37253L4.6665 5.33366V4.66699C4.6665 4.4829 4.51727 4.33366 4.33317 4.33366ZM6.6665 4.33366H5.99984C5.82889 4.33366 5.688 4.46234 5.66875 4.62812L5.6665 4.66699V5.33366C5.6665 5.5046 5.79518 5.64549 5.96096 5.66475L5.99984 5.66699H6.6665C6.83745 5.66699 6.97834 5.53831 6.99759 5.37253L6.99984 5.33366V4.66699C6.99984 4.4829 6.8506 4.33366 6.6665 4.33366Z"
                                            fill="#5F6A7A" />
                                    </svg>
                                </template>
                            </t-input>
                        </t-form-item>
                        <t-form-item name="mobile">
                            <t-input-group separate>
                                <t-select style="width: 30%;" v-model="formData.countryCode" placeholder="请先选择区号"
                                    @change="getPhoneCountryCode(formData.countryCode)">
                                    <t-option v-for="item in amazonSupportedCountries" :key="item.label"
                                        :label="item.value" :value="item.value" />
                                </t-select>
                                <t-input :disabled="!formData.countryCode ? true : false" style="width: 70%;"
                                    v-model="formData.mobile" clearable placeholder="请输入手机号">
                                </t-input>

                            </t-input-group>
                        </t-form-item>
                        <t-form-item name="email">
                            <t-auto-complete v-model="formData.email" :options="emailOptions" placeholder="请输入邮箱"
                                @change="isExistEmail">
                                <template #prefix-icon>
                                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.66683 2.66667C5.29864 2.66667 5.00016 2.96514 5.00016 3.33333C5.00016 3.70152 5.29864 4 5.66683 4H8.3335C8.70169 4 9.00016 3.70152 9.00016 3.33333C9.00016 2.96514 8.70169 2.66667 8.3335 2.66667H5.66683Z"
                                            fill="#5F6A7A" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M11.6668 1.33333C11.6668 0.596954 11.0699 0 10.3335 0H3.66683C2.93045 0 2.3335 0.596954 2.3335 1.33333V2.66667C1.91724 2.66667 1.53068 2.79383 1.21056 3.01143C1.03727 3.04397 0.877131 3.14478 0.773783 3.3045C0.725095 3.37974 0.693499 3.46113 0.678017 3.54409C0.460566 3.86415 0.333496 4.25057 0.333496 4.66667V10C0.333496 11.1046 1.22893 12 2.3335 12H11.6668C12.7714 12 13.6668 11.1046 13.6668 10V4.66667C13.6668 4.25057 13.5398 3.86415 13.3223 3.54409C13.3068 3.46113 13.2752 3.37975 13.2265 3.3045C13.1232 3.14478 12.9631 3.04397 12.7898 3.01143C12.4696 2.79383 12.0831 2.66667 11.6668 2.66667V1.33333ZM10.3335 4.38231V1.33333H3.66683V4.38231L7.00016 6.539L10.3335 4.38231Z"
                                            fill="#5F6A7A" />
                                    </svg>

                                </template>
                            </t-auto-complete>

                        </t-form-item>
                        <t-form-item name="sms_code">
                            <t-input style="width: 72%;" v-model="formData.sms_code" clearable
                                placeholder="请输入邮箱收到的验证码">
                            </t-input>
                            <t-button class="button-primary" :disabled="countdown > 0" @click="checkEmail">{{ countdown > 0
                                ? `${countdown}秒后重试` :
                                '获取验证码' }}</t-button>
                        </t-form-item>
                        <t-form-item>
                            <t-checkbox v-model="isAgree">阅读并同意 <span  class="hand_detail">服务条款</span> </t-checkbox>
                        </t-form-item>
                        <t-form-item>
                            <t-button class="button-primary login_button"   type="submit" block
                                :loading="loading">开始试用</t-button>
                        </t-form-item>

                        <t-form-item>
                            <p>已有账号？ <span  class="hand_detail" @click="WebApp.toPage(`/login/index`)"  >去登录</span> </p>
                        </t-form-item>
                    </t-form>

                </div>

            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import * as WebApp from '@/utils/webapp';
import { MessagePlugin, FormProps, AutoCompleteProps } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { Checkexist, Sendsmscode, Register, Sendaccount } from '@/api/login';
import { amazonSupportedCountries, validateInternationalPhoneNumber } from '@/utils/countryFile';
import { registerModel } from '@/types/model.login';
const loading = ref(false);
const countdown = ref(0);
const formData: registerModel = reactive({
    username: '',
    countryCode: '',
    mobile: '',
    company_name: '',
    email: '',
    sms_code: ''
});
const form = ref<FormInstanceFunctions>(null);
const emailSuffix = ['@qq.com', '@163.com', '@gmail.com', '@outlook.com'];
const registerRules = {
    username: [
        { required: true, message: '请填写用户名!' },
        { min: 2, message: '至少需要两个字符，一个中文等于两个字符' },
        { max: 10, message: '字符长度超出' },
    ],
    company_name: [
        { required: true, message: '企业名称必填' },
        { min: 2, message: '至少需要两个字符，一个中文等于两个字符' },
        { max: 50, message: '字符长度超出' },
    ],
    email: [
        { required: true, message: '请填写邮箱！' },
        { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址！' },
    ],
    mobile: [{ required: true, message: '请填写手机号！' },
    {
        validator: validateInternationalPhoneNumber,
        message: '请输入正确的手机号！',
    },
    ],
    sms_code: [{ required: true, message: '请输入邮箱验证码！' }],

};

const isAgree = ref(false)
const getPhoneCountryCode = (countrycode: string) => {
    console.log(countrycode)
    sessionStorage.setItem('countrycode', countrycode)
}
onMounted(() => {
});
onUnmounted(() => {
    sessionStorage.removeItem('countrycode')
})

const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
    if (validateResult === true) {
        if (!isAgree.value) {
            MessagePlugin.warning('请同意服务条款!');

        } else {
            loading.value = true;

            getRegister()
        }
    } else {
        loading.value = false;

        console.log('Validate Errors: ', firstError, validateResult);
    }
};

function checkEmail() {
    if (countdown.value > 0) {
        return; // 如果当前倒计时还没结束，不进行操作
    }
    if (formData.email) {
        startCountdown();
        getSmsCode();
    } else {
        MessagePlugin.warning('请输入正确的邮箱地址！')
    }
}
// 开始倒计时
function startCountdown() {
    countdown.value = 60; // 设置倒计时秒数
    const intervalId = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(intervalId); // 倒计时结束，清除定时器
        }
    }, 1000);
}
const emailOptions = computed<AutoCompleteProps['options']>(() => {
    const emailPrefix = formData.email.split('@')[0];
    if (!emailPrefix) return [];
    return emailSuffix.map((suffix) => emailPrefix + suffix);

});
async function isExistEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(formData.email)) {

    } else {
        const res = await Checkexist({ email: formData.email });
        if (res.code === 200 && res.msg === 'params exist') {
            MessagePlugin.warning('邮箱已存在，请重新输入！');

        }
    }
}
async function getSmsCode() {
    const res = await Sendsmscode({ email: formData.email });
    if (res.code === 200) {
        MessagePlugin.success('验证码已发送！');
    }
}
async function getRegister() {
    const res = await Register(formData);
    loading.value = false;
    if (res.code === 200) {
        MessagePlugin.success('注册成功,审核通过后会向您的邮箱发送账户密码！');
        WebApp.toPage(`/login/index`)
    } else if (res.msg === 'username exist') {
        MessagePlugin.warning('注册失败，用户已存在！')
        form.value?.reset();
    }
}
</script>
<style lang="less" scoped>
@import url('@/style/login.less');

</style>
