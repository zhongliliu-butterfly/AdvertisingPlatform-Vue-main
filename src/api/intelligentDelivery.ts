// import { Ref } from 'vue';
import { Ref } from 'vue';
import { request } from '@/utils/request';

const Api = {
    getAdvstrategylist:'/advstrategylist',
    getAdvstrategydetail:'/advstrategydetail',
    getListCostData:'/advstrategydetaildata',
    getListCampaignData:'/advstrategycampaigndata',

    addnegkeywords:'/ad/addnegkeywords',
    addnegproducts:'/ad/addnegproducts',
    addtargetproduct:'/ad/addtargetproduct',
    addtargetkeyword:'/ad/addtargetkeyword',
    adjustbid:'/ad/adjustbudget',
    pausekeyword:'/ad/pausekeyword',
    pausetargetproduct: '/ad/pausetargetproduct',
    goodwordcreate:'/ad/goodwordcreate',
    pauseproduct:'/ad/pauseproduct',
    addproduct:'/ad/addproduct',
    // addkeyword:'/ad/addkeyword',
    // goodwordcreate:'/ad/goodwordcreate',
    // goodwordupdate:'/ad/goodwordupdate',
    // addmultitimebud:'/ad/addmultitimebud',
     
};
// 策略列表-所有广告智能投放下面的页面
export function getAdvstrategylist(formData:object) {
    return request.get({
        url: Api.getAdvstrategylist,
        data:{...formData}
    });
} 
// 策略明细-所有getAdvstrategylist前缀的查看详情页面
export function getAdvstrategydetail(formData:object) {
    return request.get({
        url: Api.getAdvstrategydetail,
        data:{...formData}
    });
} 
// 策略明细-点击cost出现的图表接口
export function getListCostData(formData:object) {
    return request.get({
        url: Api.getListCostData,
        data:{...formData}
    });
} 
 
// 策略明细-点击cnt出现的图表
export function getListCampaignData(formData:object) {
    return request.get({
        url: Api.getListCampaignData,
        data:{...formData}
    });
}

 
// 添加否词，添加否词根 执行按钮
export function addnegkeywords(formData:object) {
    return request.post({
        url: Api.addnegkeywords,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}

//批量否品 执行
export function addnegproducts(formData:object) {
    return request.post({
        url: Api.addnegproducts,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}
// 投放品 批量
export function addtargetproduct(formData:object) {
    return request.post({
        url: Api.addtargetproduct,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}
// 添加大小词
export function addtargetkeyword(formData:object) {
    return request.post({
        url: Api.addtargetkeyword,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}

// 预算调整 adjustbid
export function adjustbid(formData:object) {
    return request.post({
        url: Api.adjustbid,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}

// 暂停投放词 
export function pausekeyword(formData:object) {
    return request.post({
        url: Api.pausekeyword,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}
// 暂停投放品
export function pausetargetproduct(formData:object) {
    return request.post({
        url: Api.pausetargetproduct,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}

// 好词晋升
export function goodwordcreate(formData:object) {
    return request.post({
        url: Api.goodwordcreate,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}
// 暂停推广品
export function pauseproduct(formData:object) {
    return request.post({
        url: Api.pauseproduct,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}
// 添加推广品  
export function addproduct(formData:object) {
    return request.post({
        url: Api.addproduct,
        data:{...formData}
    }, { isJoinPrefix: false,isTransformResponse:false });
}