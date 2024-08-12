// import { Ref } from 'vue';
import { Ref } from 'vue';
import { request } from '@/utils/request';

const Api = {
    getShopList:'/shops',
    getShopDetail:'/shopdetail',
    getAssociateAsin:'/associateasin',
    getAssociateManager:'/associatemanager',
    getAdvstrategySuggest:'/advstrategysuggest',
    upload:'/upload'
    

     
};
// 商铺 select
export function getShopList(formData:object) {
    return request.get({
        url: Api.getShopList,
        data:{...formData}
    });
} 
// 商铺详情
export function getShopDetail(formData:object) {
    return request.get({
        url: Api.getShopDetail,
        data:{...formData}
    });
} 
export function getAssociateAsin(formData:object) {
    return request.get({
        url: Api.getAssociateAsin,
        data:{...formData}
    }, { isTransformResponse:false });
} 
export function getAssociateManager(formData:object) {
    return request.get({
        url: Api.getAssociateManager,
        data:{...formData}
    });
} 

export function getAdvstrategySuggest(formData:object) {
    return request.get({
        url: Api.getAdvstrategySuggest,
        data:{...formData}
    }, { isTransformResponse:false });
} 

export function upload(formData:object) {
    return request.post({
        url: Api.upload,
        data:{...formData}
    });
}
 
 