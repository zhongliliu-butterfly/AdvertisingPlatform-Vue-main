import { request } from '@/utils/request';

const Api = {
    getAuthUrl: '/authurl',
    getStoreInfo:'/storeinfo',
    editStoreInfo:'/editstoreinfo',
    asyncdata:'/asyncdata',
    addbyfile: '/addbyfile',
    adduser: '/adduser',
    edituser: '/edituser',
    account: '/account',
    alluser:'/alluser',
    destroyDown:'/download',
    allasins:'/search_merchant_all_asin_info',
    unuseprofile:'/unuseprofile',
};

// 店铺授权
export function getAuthUrl(formData: object) {
    return request.post({
        url: Api.getAuthUrl,
        data: { ...formData },
    });
}
// 查看授权店铺的信息
export function getStoreInfo() {
    return request.get({
        url: Api.getStoreInfo,
    });
}
// 取消授权，暂停同步等
export function editStoreInfo(formData: object) {
    return request.post({
        url: Api.editStoreInfo,
        data: { ...formData },
    }, { isTransformResponse:false });
}
// 数据同步
export function asyncdata(formData: object) {
    return request.get({
        url: Api.asyncdata,
        data: { ...formData },
    }, { isTransformResponse:false });
}


// 批量导入 组织导入
export function addbyfile(formData: object) {
    return request.post({
        url: Api.addbyfile,
        data: { ...formData },
    });
}

// 新增组织用户
export function adduser(formData: object) {
    return request.post({
        url: Api.adduser,
        data: { ...formData }
    }, { isTransformResponse:false }  );
}

// 编辑组织用户
export function edituser(formData: object) {
    return request.post({
        url: Api.edituser,
        data: { ...formData },
    }, { isTransformResponse:false });
}
// 获取账户角色-超管，管理员，用户
export function account() {
    return request.get({
        url: Api.account,
    });
}
// 获取所有asins
export function allasins(formData: object) {
    return request.get({
        url: Api.allasins,
        data: { ...formData },
    }  );
}
// 获取可分配的店铺列表
export function unuseprofile( ) {
    return request.get({
        url: Api.unuseprofile,
    }  );
}
// 获取用户列表
export function alluser(formData?: object ) {
    return request.get({
        url: Api.alluser,
        data: { ...formData },
    }  );
}
// 销毁下载的线上文件
export function destroyDown(formData?: object) {
    return request.get({
        url: Api.destroyDown,
        data: { ...formData },
    }, { isTransformResponse:false } );
}