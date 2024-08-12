import { getHost } from '@/utils/webapp';

export const mailUrlList = [
    {
        oldUrl: '/study/exam/init.do',
        newUrl: '/study/examList',
        type: 1,
    },
    {
        oldUrl: '/study/train/trainSignDetail.do',
        newUrl: '/study/trainNotify',
        type: 1,
    },
    {
        oldUrl: '/study/train/signInit.do',
        newUrl: `${getHost()}/college/study/train/signInit.do`,
        type: 2,
    },
    {
        oldUrl: '/library/file/view.do',
        newUrl: '/library/view',
        type: 1,
    },
    {
        oldUrl: '/personal/master/master/init.do',
        newUrl: '/user/teacherPupil',
        type: 1,
    },
    {
        oldUrl: '/personal/master/master/information.do',
        newUrl: '/user/teacherPupil',
        type: 1,
    },
    {
        oldUrl: '/study/core/choose.do',
        newUrl: '/study/choose',
        type: 1,
    },
    {
        oldUrl: '/train/editEnd.do',
        newUrl: `${getHost()}/college/train/editEnd.do`,
        type: 2,
    },
    {
        oldUrl: '/testcenter/markEdit.do',
        newUrl: `${getHost()}/college/testcenter/markEdit.do`,
        type: 2,
    },
    {
        oldUrl: '/testcenter/markInit.do',
        newUrl: `${getHost()}/college/testcenter/markInit.do`,
        type: 2,
    },
    {
        oldUrl: '/audit/view.do',
        newUrl: `${getHost()}/college/audit/view.do`,
        type: 2,
    },
    {
        oldUrl: '/study/train/trainDetail.do',
        newUrl: '/study/trainNotify',
        type: 1,
    },
    {
        oldUrl: '/personal/master/apprentice/init.do',
        newUrl: '/user/teacherPupil',
        type: 1,
    },
    {
        oldUrl: '/personal/info/init.do',
        newUrl: '/user/info',
        type: 1,
    },
    {
        oldUrl: '/study/train/init.do',
        newUrl: '/study/training',
        type: 1,
    },
    {
        oldUrl: '/library/patentPayment/init.do',
        newUrl: '/library/patentPayment',
        type: 1,
    },
    {
        oldUrl: '/library/declare/viewPatent.do',
        newUrl: `${getHost()}/college/library/declare/viewPatent.do`,
        type: 2,
    },
    {
        oldUrl: '/library/declare/viewCopyright.do',
        newUrl: `${getHost()}/college/library/declare/viewCopyright.do`,
        type: 2,
    },
];
