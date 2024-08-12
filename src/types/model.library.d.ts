import { Dictionary } from 'lodash';
import { Employee } from './model.user';

export interface LibrarySearchVO {
    keyWord?: string;
    businessType?: string;
    publishScope?: string;
    publishDate?: string;
    dataShowType?: number;
    dept?: string;
    majorType?: string;
    fileType?: string;
    atlasCategory?: string;
    atlasType?: string;
    achievementsCategory?: string;
    orderRule?: string; // like 点赞最多，browse 浏览最多
    studyCatalogId?: number;
    secondCompanyId?: number;
    orderPublishDate?: number;
    secondContractName?: string;
}

export interface Library {
    id?: number;
    libraryType?: number; // 2课件 5知识贡献 4产权
    resourceName?: string; // 标题
    businessType?: string; // 业务系统 a,b
    businessTypeList?: Array<string>; // 业务系统list
    majorType?: string; // 专业类型 a,b
    majorTypeList?: Array<string>; // 专业类型list
    createTime?: Date;
    createUserId?: number;
    createUser?: Employee;
    ownerDeptId?: number;
    ownerDept?: Department;
    ownerDeptIds?: string;
    publishDate?: string;
    publishScope?: string;
    publishScopeDict?: Dictionary;
    keyWord?: string;
    introduce?: string;
    introduction?: string;
    fileNo?: string;
    fileType?: string;
    atlasCategory?: string;
    atlasCategoryDict?: Dictionary;
    atlasType?: string;
    atlasTypeDict?: Dictionary;
    atlasNo?: string;
    achievementsCategory?: string;
    achievementsCategoryDict?: Dictionary;
    patentType?: string;
    patentTypeDict?: Dictionary;
    fileSource?: string;
    homeFile?: string;
    classHours?: number; // 课时
    classCredit?: number;
    viewNum?: number;
    favoriteNum?: number;
    likesNum?: number;
    emplName?: string;
    deptName?: string;
    orderNum?: number;
    wordCount?: number;
    pptCount?: number;
    auditReason?: string;
    libraryLevel?: number;
    isDelete?: number;
    isAutoCover?: number;
    isWideCover?: number;
    status?: number;
    statusName?: string;
    evaluationPoints?: string;
    lecturerLevel?: number;
    oldLecturerLevel?: number;
    isContribute?: number;
    auditFinishTime?: Date;
    emplMobile?: string;
    jobName?: string;
    companyName?: string;
    patentAmount?: BigDecimal;
    source?: string;
    isFavorite?: number;
    isLike?: number;
    isChoose?: number;
    courseNum?: number;
    courseGroupId?: string; // 文件id
    courseAttachments?: Array<Attachment>; // 文件
    appendixGroupId?: string; // 附件id
    appendixAttachments?: Array<Attachment>; // 附件
    coverId?: string; // 封面id
    coverAttachment?: Attachment; // 封面
    coverAttachments?: Array<Attachment>; // 封面
    classNum?: number;
    isSpecialAreaFiles?: Boolean;
    specialAreaId?: number;
    specialAreaIds?: string;
    emplNames?: string; // 作者 a,b 产权是多个作者
    emplIds?: string;
    companyNameNew?: string;
    articleId?: number;
    contributeCompanyId?: number;
    contributeCompanyName?: string;
    libraryTypeName?: string;
    createTimeStr?: string;
    examNum?: number;
    keyWords?: Array<string>;
    businessList?: Array<StudyLibraryBusiness>;
    readHours?: number;
    noteList?: Arrat<studyLibraryNote>;
    propertyType?: number; // 产权类别
    gainingMethod?: string;
    gainingMethodDict?: Dictionary;
    scopeRights?: string;
    scopeRightsDict?: Dictionary;
    scopeRightsArr?: Array<string>;
    studyLibraryId?: number;
    copyrightYear?: string;
    // 项目地图库 sta
    projectMapTypeId?: string | number; // 项目类型
    projectMapNameId?: string; // 项目名称
    projectMapCategory?: string; // 资料类型
    firstLevel?: string; // 一级目录
    secondLevel?: string; // 二级目录
    thirdLevel?: string; // 二级目录
    informationType?: number; // 机电总承包的资料类型

    // 项目地图库 end
    keyWords?: Array;
}

export interface studyLibraryNote {
    id?: number;
}

export interface StudyLibraryBusiness {
    studyLibraryId?: number;
    businessType?: string;
    businessTypeDict?: Dictionary;
}

export interface SearchType {
    name?: string;
    value?: string;
}

export interface SearchData {
    // publishScopes?: Array<Dictionary>;
    // majorTypes?: Array<Dictionary>;
    // businessTypes?: Array<Dictionary>;
    // fileTypes?: Array<Dictionary>;
    // achievementsCategorys?: Array<Dictionary>;
    // depts?: Array<Dictionary>;
    // atlasCategorys?: Array<Dictionary>;
    // atlasTypes?: Array<Dictionary>;
    // projectTypes?: Array<Dictionary>;
    // contributeCompanys?: Array<Dictionary>;
    // years?: Array<string>;
    // productLines?: Array<Dictionary>;
    // engineeringTypes?: Array<Dictionary>;
    // resourceCategorys?: Array<Dictionary>;
    // contributeCompanys?: Array<Dictionary>;
    // resources?: Array<Dictionary>;
    // buildTypes?: Array<Dictionary>;
    // areaTypes?: Array<Dictionary>;
    // useTypes?: Array<Dictionary>;
    // majorTypes?: Array<Dictionary>;
    // workTypes?: Array<Dictionary>;
    // priceTypes?: Array<Dictionary>;
    // projectScaleTypes?: Array<Dictionary>;
    // knowledge?: Array<Dictionary>;
    label?: Array<Dictionary>;
    secondCompanys?: Array<any>;
}

export interface LibraryViewVm {
    lib?: Library;
    isLecturer?: Boolean;
    files?: Array<LibraryFile>;
    canApplyDownloadSource?: Boolean;
    isStudyTimeFull?: number;
    isBrowseCode?: number;
    oldBrowseTimeNum?: number;
    isBrowse?: boolean;
    bookmark?: StudyBookMark;
    isTransverse?: number;
}

export interface LibraryFile {
    fileName?: string;
    showName?: string;
    fileType?: string;
    fileIcon?: string;
    auth?: Boolean;
    show?: Boolean;
    preview?: Boolean;
    download?: Boolean;
    downloadSource?: Boolean;
    studyBookMark?: StudyBookMark;
}

export interface StudyBookMark {
    id?: number;
    emplId?: number;
    libId?: number;
    fileName?: string;
    page?: number;
    updateTime?: Date;
}

export interface VrResource {
    cover: Cover;
    coverId: string;
    createTime: string;
    createUser: Employee;
    createUserId: number;
    id: number;
    isDelete: number;
    link: string;
    pointNum: number;
    publishDate: string;
    resourceName: string;
    status: number;
    vrCode: string;
}

export interface Cover {
    createTime: string;
    createUser: number;
    fileId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: number;
    groupId: string;
    isOss: number;
    url: string;
}

export interface VrlinkVM {
    points?: Point[];
    vrResource?: DatavrResource;
}

export interface DatavrResource {
    cover: Cover;
    coverId: string;
    createTime: string;
    createUser: Employee;
    createUserId: number;
    id: number;
    isDelete: number;
    link: string;
    pointNum: number;
    publishDate: string;
    resourceName: string;
    status: number;
    vrCode: string;
}

export interface Point {
    id?: number;
    pointNum?: string;
    standard?: Standard;
    standardId?: number;
    vrResource?: PointvrResource;
    vrResourceId?: number;
}

export interface PointvrResource {
    cover: Cover;
    coverId: string;
    createTime: string;
    createUser: Employee;
    createUserId: number;
    id: number;
    isDelete: number;
    link: string;
    pointNum: number;
    publishDate: string;
    resourceName: string;
    status: number;
    vrCode: string;
}

export interface Standard {
    createTime: string;
    createUser: Employee;
    createUserId: number;
    id: number;
    lib: Lib;
    libId: number;
    linkPage: number;
    standardCode: string;
    standardName: string;
}

export interface PropertyDeclare {
    id?: number;
    studyLibrary?: Library;
    patentStatus?: number;
    declareTime: Date;
}

export interface StudyLibrary {
    resourceName?: string;
    userName?: string;
    dept?: string;
    createUserId?: number;
    ownerDeptId?: number;
    source?: string;
    author?: string;
    maintenanceCycle?: string;
    introduction?: string;
    sequence?: string;
    coverFile?: string;
    coverAttachments?: Array;
    courseAttachments?: Array;
    appendixAttachments?: Array;
    libraryType?: string | number;
    studyCatalogId?: string | number;
    pathName?: string;
    check?: Array<any>;
    id?: number;
}
