// 获取常用时间
import { reactive, ref } from 'vue';
// import { CountryFile } from '@/types/model.home';
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import axios from 'axios';

interface CountryFile {
    country: string;
    chineseName: string;
    code: string;
    currency: string;
    symbol: string;
    flagUrl: string;
}

interface CountrySymbol {
    currency: string;
    symbol: string;
    rate?: number;
}

interface CountryCode {
    label: string;
    value: string;
}
interface Country {
    country_id: number; // 国家ID可以是数字或字符串，取决于数据的实际情况
    country: string; // 国家或区域名称
    code: string; // 国家或地区的代码
    parent?: string; // 父区域名称，可选，只对子国家适用
}

interface Region {
    country_id: string | number; // 区域ID，通常为字符串
    code: string; // 区域代码，如"NA"表示北美洲
    country: string; // 区域名称，如"北美洲"
    children: Country[]; // 子国家数组
}

export const amazonCountries: Array<CountryFile> = reactive([
    { country: "United States", chineseName: "美国", code: "US", currency: "USD", symbol: "$", flagUrl: "https://flagcdn.com/w320/us.png" },
    { country: "Canada", chineseName: "加拿大", code: "CA", currency: "CAD", symbol: "C$", flagUrl: "https://flagcdn.com/w320/ca.png" },
    { country: "United Kingdom", chineseName: "英国", code: "GB", currency: "GBP", symbol: "£", flagUrl: "https://flagcdn.com/w320/gb.png" },
    { country: "Germany", chineseName: "德国", code: "DE", currency: "EUR", symbol: "€", flagUrl: "https://flagcdn.com/w320/de.png" },
    { country: "France", chineseName: "法国", code: "FR", currency: "EUR", symbol: "€", flagUrl: "https://flagcdn.com/w320/fr.png" },
    { country: "Italy", chineseName: "意大利", code: "IT", currency: "EUR", symbol: "€", flagUrl: "https://flagcdn.com/w320/it.png" },
    { country: "Spain", chineseName: "西班牙", code: "ES", currency: "EUR", symbol: "€", flagUrl: "https://flagcdn.com/w320/es.png" },
    { country: "Japan", chineseName: "日本", code: "JP", currency: "JPY", symbol: "¥", flagUrl: "https://flagcdn.com/w320/jp.png" },
    { country: "Australia", chineseName: "澳大利亚", code: "AU", currency: "AUD", symbol: "A$", flagUrl: "https://flagcdn.com/w320/au.png" },
    { country: "India", chineseName: "印度", code: "IN", currency: "INR", symbol: "₹", flagUrl: "https://flagcdn.com/w320/in.png" },
    { country: "Brazil", chineseName: "巴西", code: "BR", currency: "BRL", symbol: "R$", flagUrl: "https://flagcdn.com/w320/br.png" },
    { country: "Mexico", chineseName: "墨西哥", code: "MX", currency: "MXN", symbol: "Mex$", flagUrl: "https://flagcdn.com/w320/mx.png" },
    { country: "Netherlands", chineseName: "荷兰", code: "NL", currency: "EUR", symbol: "€", flagUrl: "https://flagcdn.com/w320/nl.png" },
    { country: "Singapore", chineseName: "新加坡", code: "SG", currency: "SGD", symbol: "S$", flagUrl: "https://flagcdn.com/w320/sg.png" },
    { country: "Turkey", chineseName: "土耳其", code: "TR", currency: "TRY", symbol: "₺", flagUrl: "https://flagcdn.com/w320/tr.png" },
    { country: "United Arab Emirates", chineseName: "阿联酋", code: "AE", currency: "AED", symbol: "د.إ", flagUrl: "https://flagcdn.com/w320/ae.png" },
    { country: "Saudi Arabia", chineseName: "沙特阿拉伯", code: "SA", currency: "SAR", symbol: "﷼", flagUrl: "https://flagcdn.com/w320/sa.png" },
    { country: "Sweden", chineseName: "瑞典", code: "SE", currency: "SEK", symbol: "kr", flagUrl: "https://flagcdn.com/w320/se.png" },
    { country: "Poland", chineseName: "波兰", code: "PL", currency: "PLN", symbol: "zł", flagUrl: "https://flagcdn.com/w320/pl.png" }
]);

export const amazonCurrencies: Array<CountrySymbol> = reactive([
    { currency: "USD", symbol: "$" },
    { currency: "CAD", symbol: "C$" },
    { currency: "GBP", symbol: "£" },
    { currency: "EUR", symbol: "€" },
    { currency: "JPY", symbol: "¥" },
    { currency: "AUD", symbol: "A$" },
    { currency: "INR", symbol: "₹" },
    { currency: "BRL", symbol: "R$" },
    { currency: "MXN", symbol: "Mex$" },
    { currency: "SGD", symbol: "S$" },
    { currency: "TRY", symbol: "₺" },
    { currency: "AED", symbol: "د.إ" },
    { currency: "SAR", symbol: "﷼" },
    { currency: "SEK", symbol: "kr" },
    { currency: "PLN", symbol: "zł" }
]);

export const amazonSupportedCountries: Array<CountryCode> = [
    { label: "China", value: "+86" }, // Note: Amazon closed its marketplace in China but still operates AWS and other services.
    { label: "United States|Canada", value: "+1" },
    { label: "United Kingdom", value: "+44" },
    { label: "Germany", value: "+49" },
    { label: "France", value: "+33" },
    { label: "Italy", value: "+39" },
    { label: "Spain", value: "+34" },
    { label: "Japan", value: "+81" },
    { label: "Australia", value: "+61" },
    { label: "Brazil", value: "+55" },
    { label: "India", value: "+91" },
    { label: "Mexico", value: "+52" },
    { label: "Netherlands", value: "+31" },
    { label: "Singapore", value: "+65" },
    { label: "Turkey", value: "+90" },
    { label: "United Arab Emirates", value: "+971" },
    { label: "Saudi Arabia", value: "+966" },
    { label: "Sweden", value: "+46" },
    { label: "Poland", value: "+48" },
    { label: "Belgium", value: "+32" }
];

export const amazonSupportedAreaList: Array<Region> = [{
    country_id: "NA",
    code: "NA",
    country: "北美洲",
    children: [{
        parent: "北美洲",
        country_id: 1,
        country: "美国",
        code: "US"
    }, {
        parent: "北美洲",
        country_id: 2,
        country: "加拿大",
        code: "CA"
    }, {
        parent: "北美洲",
        country_id: 3,
        country: "墨西哥",
        code: "MX"
    }, {
        parent: "北美洲",
        country_id: 17,
        country: "巴西",
        code: "BR"
    }]
}, {
    country_id: "EU",
    code: "EU",
    country: "欧洲",
    children: [{
        parent: "欧洲",
        country_id: 4,
        country: "英国",
        code: "UK"
    }, {
        parent: "欧洲",
        country_id: 7,
        country: "意大利",
        code: "IT"
    }, {
        parent: "欧洲",
        country_id: 5,
        country: "德国",
        code: "DE"
    }, {
        parent: "欧洲",
        country_id: 6,
        country: "法国",
        code: "FR"
    }, {
        parent: "欧洲",
        country_id: 8,
        country: "西班牙",
        code: "ES"
    }, {
        parent: "欧洲",
        country_id: 15,
        country: "荷兰",
        code: "NL"
    }, {
        parent: "欧洲",
        country_id: 18,
        country: "瑞典",
        code: "SE"
    }, {
        parent: "欧洲",
        country_id: 19,
        country: "波兰",
        code: "PL"
    }, {
        parent: "欧洲",
        country_id: 21,
        country: "比利时",
        code: "BE"
    }, {
        parent: "欧洲",
        country_id: 9,
        country: "印度",
        code: "IN"
    }, {
        parent: "欧洲",
        country_id: 20,
        country: "土耳其",
        code: "TR"
    }]
}, {
    country_id: 10,
    code: "JP",
    country: "日本",
    children: []
}, {
    country_id: 12,
    code: "AU",
    country: "澳洲",
    children: []
}, {
    country_id: 13,
    code: "AE",
    country: "阿联酋",
    children: []
}, {
    country_id: 14,
    code: "SG",
    country: "新加坡",
    children: []
}, {
    country_id: 22,
    code: "SA",
    country: "沙特阿拉伯",
    children: []
}]

export function getCountrySymbol(currency: string) {
    for (const item of amazonCurrencies) {
        if (currency === item.currency) {
            return item.symbol;
        }
    }
    return null
}

export function getCountryFlag(name: string) {
    for (const item of amazonCountries) {
        if (name === item.chineseName) {
            return item.flagUrl;
        }
    }
    return null
}
 

// 校验国际区号方法
export function validateInternationalPhoneNumber(phoneNumber: string) {
    if (sessionStorage.getItem('countrycode') !== null) {
        phoneNumber = sessionStorage.getItem('countrycode') + phoneNumber
    }
    try {
        return isValidPhoneNumber(phoneNumber);
    } catch (error) {
        return false;
    }
}


export function exchangeRate(cash: number|string, currency: string) {
    if(cash===null||cash===undefined){
        return 0
    }
    console.log(cash,currency)
    const changeCurrency=sessionStorage.getItem('changeCurrency'); // 目标货币符号
    const rateData = JSON.parse(localStorage.getItem('rateData')); // 接口获取的数组
    rateData.rate.push({currency: "CNY", symbol: "¥", rate: 100});
    const amazonCurrenciesRate = rateData.rate;
    const oldCurrency = amazonCurrenciesRate.find(item => item.currency === currency);
    const oldCash = oldCurrency ? oldCurrency.rate : undefined;
    const newCurrency = amazonCurrenciesRate.find(item => item.currency === changeCurrency);
    const newCash = newCurrency ? newCurrency.rate : undefined;
    const newCurrencySymbol= newCurrency ? newCurrency.symbol : undefined;
    // 计算货币转换
    const changeCash = oldCash && newCash ? parseFloat(((oldCash / newCash) * cash).toFixed(2)) : undefined;
    // console.log('汇率转换',changeCurrency,newCurrencySymbol, cash, changeCash);

    return newCurrencySymbol+changeCash
}


