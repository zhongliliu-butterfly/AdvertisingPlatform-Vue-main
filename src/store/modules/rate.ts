import { defineStore } from 'pinia';
import { Ref,ref } from 'vue';
import { store } from '@/store';
import { getExchangeRate } from '@/api/sso';
import { amazonCurrencies } from '@/utils/countryFile';


export const useRateStore = defineStore('rateStore', {
    state: () => ({
        rateData: {}
    }),
    actions: {
       
        async getRateData() {
            const res = await getExchangeRate();
            console.log(res)
            const data = res
            amazonCurrencies.forEach(currency => {
                const found = data.find((item:any) => item.currency_name === currency.currency);
                if (found) {
                    currency.rate = found.buy_in_foreign_exchange;
                }
            });
            console.log(amazonCurrencies)
            this.rateData=amazonCurrencies;
            const now = new Date();
            const expiresIn = ref(1);
            const expiryTime = new Date(now.getTime() + expiresIn.value * 24 * 3600 * 1000); // 转换为毫秒
            const rateData = {
                rate: amazonCurrencies,
                expiry: expiryTime.toISOString() // 将过期时间转换为 ISO 格式的字符串
            };
        
            localStorage.setItem('rateData', JSON.stringify(rateData));
        },
    },
});

export function getRateStore() {
    return useRateStore(store);
}
