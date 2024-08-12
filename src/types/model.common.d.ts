import { UploadFile } from 'tdesign-vue-next';

export interface Dictionary {
    dictionaryId?: number;
    dictionaryTypeId?: string;
    companyId?: string;
    dictCode?: string;
    dictDesc?: string;
    dictName?: string;
    dictNameE?: string;
    memo?: string;
    dictOrder?: number;
}

export interface Attachment extends UploadFile {
    fileId?: string;
    groupId?: string;
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    createTime?: Date;
    createUser?: number;
    fileType?: number;
    isOss?: number;
    url?: string;
    fileAllPath?: string;
    appFileType?: string;
}

export interface Menu {
    menuId?: number;
    parentId?: number;
    menuCode?: string;
    menuName?: string;
    menuStyle?: string;
    menuType?: number;
    menuUrl?: string;
    isMore?: number;
    isManage?: number;
    orderNum?: number;
    orderCode?: string;
}
