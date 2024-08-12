// i18n.ts
import { createI18n } from 'vue-i18n'
// 导入语言文件
import zh from '../src/locales/zh.json';
import en from '../src/locales/en.json';
 

 
const i18n = createI18n({
    legacy: false,  // for Composition API
    locale: 'zh',   // 默认语言
    fallbackLocale: '', //备用语言
    messages:{
        zh,en
    },       // set locale messages
});

export default i18n;
