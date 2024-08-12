import { Ref } from 'vue';
import md5 from 'js-md5';
import { request } from '@/utils/request';

const Api = {
    
    
    getExchangeRate:'/cn_bank/latest_currency_exchange_rate'

};

  
// 获取当日汇率接口
export function getExchangeRate() {
    return request.get({
        url:  Api.getExchangeRate,
    } , { isJoinPrefix:false });
}

 