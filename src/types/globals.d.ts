// 通用声明

// Vue
declare module '*.vue' {
    import { DefineComponent } from 'vue';

    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare type ClassName = { [className: string]: any } | ClassName[] | string;

declare module '*.svg' {
    const CONTENT: string;
    export default CONTENT;
}

/**
 * 可枚举
 */
declare type Recordable<T = any> = Record<string, T>;

/**
 * 可为空
 */
declare type Nullable<T> = T | null;

/**
 * DOM元素
 */
declare type DOM = Nullable<HTMLElement>;

/**
 * 回调函数
 */
declare type VoidCallback = (() => void) | null;

/**
 * 分页对象
 */
declare type PageInfo<T = any> = {
    page: number;
    pageSize?: number;
    totalPage?: number;
    totalRecord?: number;
    data?: Array<T>;
};

/**
 * 人员选择框
 */
declare type SelectUser = (InstanceType<typeof EmployeeSelect> & EmployeeSelectBox) | null;
