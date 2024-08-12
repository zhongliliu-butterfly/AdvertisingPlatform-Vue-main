import { Department } from './model.sso';
import { Library } from './model.library';
import { Attachment } from './model.common';

export interface Employee {
    emplId?: number;
    deptId?: number;
    dept?: Department;
    accountId?: number;
    account?: Account;
    emplCode?: string;
    emplName?: string;
    emplSex?: number;
    emplEmail?: string;
    emplMobile?: string;
    idcard?: string;
    isEnabled?: number;
    orderNum?: number;
    wxNumber?: string;
    emplAge?: string;
    pointTotal?: number;
    isTeacher?: number;
    teacherLevel?: string;
    coursewareNum?: number;
    yearTeachNum?: number;
    teachNum?: number;
    externalId?: string;
    azUserId?: string;
    serviceYear?: number;
    emplType?: string;
    administrativeRank?: string;
    worktime?: Date;
    companyWorktime?: Date;
    theTitle?: string;
    rankSequences?: string;
    rankSequencesLevel?: string;
    practicingCertificate?: string;
    politicsStatus?: string;
    firstDegree?: string;
    firstSchool?: string;
    firstProfessional?: string;
    firstGraduationDate?: Date;
    isFirstFulltime?: string;
    highestSchooling?: string;
    highestDegreeGraduation?: string;
    highestDegreeMajor?: string;
    highestGraduationDate?: Date;
    isHighestFulltime?: string;
    partyTime?: Date;
    roles?: Array<Role>;
    role?: Role;
    noStudyMainRole?: Role;
    company?: Department;
    roleId?: number;
    other?: number;
    birthDay?: string;
    classHours?: number;
    totalHours?: number;
    studyRole?: Role;
    isRequisiteStudyPosition?: number;
    pointBalance?: number;
    trainYearTeachNum?: number;
    trainTeachNum?: number;
}

export interface Role {
    roleId?: number;
    roleName?: string;
    roleMain?: number;
    isStudy?: number;
}

// 我的积分 item
export interface PointItemType {
    createTime: string; // 日期 date类型
    pointContent: string; // 内容
    pointId: number;
    pointNum: number;
    totalPoint: number;
    totalBalance: number;
}

// 积分使用
export interface PointUseItemType {
    createTime: string; // 日期 date类型
    pointContent: string; // 内容
    pointUseId: number;
    pointNum: number;
    totalPoint: number;
}

// 积分排行榜 item
export interface RankItemType {
    rankNum: number;
    emplId: number;
    pointTotal: number;
    empl: Employee;
    emplName?: string;
    companyName?: string;
}
// 贡献排行榜

export interface ConItemType {
    contributeRankNum: number;
    emplId: number;
    empl: Employee;
    emplName?: string;
    companyName?: string;
    contributeNum?: number;
}
// 我的收藏 item
export interface CollectItemType {
    collectId?: number;
    studyLibraryId?: number;
    studyLibrary?: Library;
    resourceName?: string;
    id?: number; // 保存studyLibraryId
}
// 我的收藏夹 item
export interface CollectArrType {
    collectArrId?: number;
    collectArrName?: string;
    collectCount?: number;
    updateTime?: Date;
}

// 我的足迹-浏览 item 浏览日期和记录
export interface FootMarkItemType {
    viewDate: string;
    footmarks: FootMarkItemListType[];
}

// 日浏览记录
export interface FootMarkItemListType {
    createTime?: string;
    emplId?: number;
    footmarkId?: number;
    studyLibrary: Library;
    studyLibraryId: number;
}

// 我的足迹-参与的考试
export interface ExamItemType {
    testId: number;
    testName: string; // 考试名字
    testMinute: number; // 考试时长
    testStaTime: string; // 开始时间
    testEndTime: string; // 截止时间
    testNum: number; // 考试次数
    answerStatus: number; // 3 已答题
}

// 我的贡献
export interface ContributeItemType {
    id: number;
    resourceName: string;
    studyLibraryId?: number;
}

// 流程中心
export interface flowData {
    audit?: audit;
    receiveTime?: string;
    auditUsers?: Array;
    emplName?: string;
    currentAuditEmpl?: currentAuditEmpl;
}
export interface currentAuditEmpl {
    emplName?: string;
}
export interface audit {
    auditType?: string;
    auditName?: string;
}
// 我的贡献-我的回答
export interface AnswerItemType {
    ask?: askType;
    content?: string;
    publishDate?: string;
    createEmplId?: number;
    createEmpl?: Employee;
    imgFiles?: Array<Attachment>;
}

export interface AskType {
    theme?: string;
    content?: string;
    createEmpl?: AnserType;
}

export interface AnserType {
    emplName?: string;
}

// 我的信箱
export interface MailItemType {
    messageId: number;
    messageType: string;
    messageTitle: string;
    isRead: number;
    createTime: string;
    recordId: number;
    messageUrl: string;
}
export interface MailType {
    messageType: number;
    isRead: number;
    num: number;
    noReadNum: number;
}
export interface DoneInfo {
    employee: object;
    studyInfo: object;
    types: Array<aduitType>;
}

export interface aduitType {
    key: string;
    value: string;
}

export interface planData {
    id?: number;
    company?: Company;
    masterApprentice?: MasterApprentice;
    monthNum?: string;
    monthPlan?: string;
    monthProblems?: string;
    answersQuestions?: string;
    studySummary?: string;
    nextPlan?: string;
    masterApprenticeId?: number;
    isEdit?: number;
    isSupplementEdit?: number;
}
export interface Company {
    companyName?: string;
    deptName?: string;
    name?: string;
}
export interface MasterApprentice {
    occupationalMaster?: occupationalMaster;
    practicalStage?: string;
}
export interface occupationalMaster {
    employee?: Employee;
}
