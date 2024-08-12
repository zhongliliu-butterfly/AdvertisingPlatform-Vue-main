// import { Ref } from 'vue';
import { Ref } from 'vue';
import { request } from '@/utils/request';
import { CostList } from '@/types/model.home';

const Api = {
    getAllUser:'/employers',
    getAllAsins:'/parentasin',
    searchAsin:'/searchasin',
    getAllView:'/allview',
    getAdEffect:'/adeffect',
    getStrategyadopt:'/strategyadopt',
    getCorefocusadv:'/corefocusadv',
    getCorefocusgood:'/corefocusgood',
    getShopInfo:'/shopinfo',
    getShopRank:'/shoprank',
    getGoodRank:'/goodrank',
    showManage: '/index/showManage.do',
     
};
//首页-用户下拉框
export function getAllUser( ) {
    return request.get({
        url: Api.getAllUser,
      
    });
} 
//首页-asins下拉框
export function getAllAsins( ) {
    return request.get({
        url: Api.getAllAsins,
      
    });
} 
//首页-子asin搜对应的父asin
export function searchAsin(formData:object ) {
    return request.get({
        url: Api.searchAsin,
        data:{...formData}
      
    });
} 
//首页-block数据
export function getAllView(formData:object) {
    return request.get<CostList>({
        url: Api.getAllView,
        data:{...formData}
    });
} 
//首页-广告效果评估
export function getAdEffect(formData: object) {
    return request.get<any>({
        url: Api.getAdEffect,
        data:{...formData}
    });
} 
// 首页-策略采纳情况
export function getStrategyadopt(formData: object) {
    return request.get<any>({
        url: Api.getStrategyadopt,
        data:{...formData}
    });
}
// 首页-核心关注-广告
export function getCorefocusadv(formData: object) {
    return request.get<any>({
        url: Api.getCorefocusadv,
        data:{...formData}
    });
}
// 首页-核心关注-商品
export function getCorefocusgood(formData: object) {
    return request.get<any>({
        url: Api.getCorefocusgood,
        data:{...formData}
    });
}
// 首页-商铺店铺经营情况
export function getShopInfo(formData: object) {
    return request.get<any>({
        url: Api.getShopInfo,
        data:{...formData}
    });
}

//首页-商铺销售额top5
export function getShopRank(formData: object) {
    return request.get<any>({
        url: Api.getShopRank,
        data:{...formData}
    });
} 

//首页-商铺-商品销量top10
export function getGoodRank(formData: object) {
    return request.get<any>({
        url: Api.getGoodRank,
        data:{...formData}
    });
} 


// 是否拥有管理后台菜单
export function getShowManage() {
    return request.get<number>({
        url: Api.showManage,
    });
}
