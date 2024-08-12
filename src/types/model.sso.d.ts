import { Menu } from './model.common';

export interface LoginState {
    isLogin: boolean;
    user?: User;
    company?: Department;
}

export interface Department {
    deptId: number;
    parentId?: number;
    childrenCount?: number;
    deptType?: number;
    companyId?: number;
    companyName?: string;
    deptCode?: string;
    deptName?: string;
    shortName?: string;
    showName?: string;
    isHide?: number;
    orderNum?: number;
    orderCode?: string;
    idPath?: string;
    path?: string;
    name?: string;
    contributeCompanyId?: number;
}

export interface Role {
    roleId: number;
    roleName?: string;
    roleGroup?: string;
    roleLevel?: number;
    grantLevel?: number;
    orderNum?: number;
    roleMain?: number;
    isStudy?: number;
    resources: Array<string>;
    menus: Array<string>;
    datas: Array<string>;
}

export interface User {
    userType: number;
    emplId: number;
    deptId?: number;
    dept?: Department;
    accountId?: number;
    emplCode?: string;
    emplName?: string;
    emplSex?: number;
    roles?: Array<Role>;
    role?: Role;
    showManage?: number;
    studyRole?: Role;
    isRequisiteStudyPosition?: number;
    manageMenuDf?: Menu;
    pointBalance?: number;
    isSignAgreement?: number;
    pointBalance?: number;
    deptType?: Number;
    company?: Department;
}
