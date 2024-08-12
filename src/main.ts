import { createApp } from 'vue';
import 'reset-css/less/reset.less';
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/icon/iconfont.css';
import { Loading, MessagePlugin } from 'tdesign-vue-next';
import * as echarts from 'echarts';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import { Button } from 'ant-design-vue';
import App from './App.vue';
import { store,useRateStore } from './store';

import router from './router';
// import './permission';
import 'default-passive-events';
import wxsdk from './plugin/wxsdk';
import { title } from './directive/title';
import { login } from './directive/login';
import { unscale } from './directive/unscale';
import 'ant-design-vue/dist/antd.css';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import 'tdesign-vue-next/es/style/index.css'; 
import i18n from './i18n'
const app = createApp(App);

// 单个修改标题
app.directive('title', title);
app.directive('login', login);
app.directive('unscale', unscale);
app.config.globalProperties.$echarts = echarts;
app.use(router);
app.use(store);
app.use(wxsdk);
app.use(Loading);
app.use(MessagePlugin);
app.use(PerfectScrollbar);
app.use(i18n)
 
app.mount('#app');
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // 禁用Promise reject输出控制台
    event.preventDefault();
});
