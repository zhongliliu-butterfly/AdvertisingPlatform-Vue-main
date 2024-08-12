import wx from 'weixin-js-sdk';
import type { App } from 'vue';

const wxName = 'wx';
const w: any = window;

const plugin = {
    install(Vue: App): void {
        Vue.config.globalProperties.$wechat = wx;
        Vue.config.globalProperties.wechat = wx;
        w[wxName] = wx;
    },
};

export default plugin;
export const { install } = plugin;
