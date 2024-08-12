export interface TreeBean {
    id?: string;
    parentId?: string;
    name?: string;
    checked?: boolean;
    open?: boolean;
    isHidden?: boolean;
    nocheck?: boolean;
    iconSkin?: string;
    url?: string;
    target?: string;
    order?: string;
    other?: string;
    data?: any;
}
