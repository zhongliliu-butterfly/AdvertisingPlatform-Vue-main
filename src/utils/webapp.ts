import { LocationQueryRaw, RouteLocationPathRaw } from 'vue-router';
import { MessagePlugin, ResponseType } from 'tdesign-vue-next';
import dayjs from 'dayjs';
import QueryString from 'qs';
import router from '@/router/index';
import { Attachment } from '@/types/model.common';
import { treeLabel, DetailItem, FilterCriteria } from '@/types/model.home';
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
export class GLOBAL {
    static w: any = window;



    static getDefaultTitle = (): string => {
        let title = GLOBAL.w.$app_title;
        if (title === undefined) {
            title = document.title;
            GLOBAL.w.$app_title = title;
        }
        return title;
    };
}

/**
 * 获取地址前缀
 * @returns 地址前缀
 */
export function getHost(): string {
    return import.meta.env.VITE_SERVER_URL || '';
}
/**
 *获取图片地址前缀
 * @returns 图片前缀地址
 */
export function getContext(): string {
    const serverurl = import.meta.env.VITE_SERVER_URL;
    const baseurl = import.meta.env.VITE_REQUEST_BASE_URL;
    return `${serverurl + baseurl}/api` || '';
}
/**
 *获取图片
 * @param url 图片相对/assets/image的路径
 * @returns 图片路径
 */
export function getImage(url: string): string {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}

/**
 * 从浏览器地址栏获取参数
 * @param name  名称
 * @returns 值
 */
export function getQueryFromUrl(name: string): string {
    const { hash } = window.location;
    if (hash) {
        const idx = hash.indexOf('?');
        if (idx > 0) {
            const search = hash.substring(idx + 1);
            const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
            const param = search.match(reg);
            if (param != null) {
                return param[2];
            }
        }
    }
    return '';
}

/**
 * 从查询参数获取浏览器地址
 * @param query  查询参数
 * @returns url
 */
export function getUrlFromRoute(route: RouteLocationPathRaw): string {
    let url = `/#${route.path}`;
    const { query } = route;
    if (query) {
        const qs = QueryString.stringify(query);
        if (qs) {
            url += `?${qs}`;
        }
    }
    return url;
}

/**
 * 获取参数
 * @param name 名称
 * @returns 值
 */
export function getQuery(name: string): string {
    const { query } = router.currentRoute.value;
    const vs = query[name];
    if (vs instanceof Array) {
        return vs[0] || '';
    }
    return vs || '';
}

/**
 * 格式化参数
 * @param fullPath 全路径
 * @returns 参数
 */
export function parseUrl(fullPath: string | RouteLocationPathRaw): RouteLocationPathRaw {
    if (typeof fullPath !== 'string') {
        return fullPath;
    }

    const idx = fullPath.indexOf('?');
    const path = idx >= 0 ? fullPath.substring(0, idx) : fullPath;
    const query: any = {};
    if (idx >= 0) {
        const queryString = fullPath.substring(idx + 1);
        if (queryString) {
            const qs = queryString.split('&');
            qs.forEach((q) => {
                const i = q.indexOf('=');
                if (i < 0) {
                    query[q] = '';
                } else {
                    query[q.substring(0, i)] = q.substring(i + 1);
                }
            });
        }
    }

    return {
        path,
        query,
    };
}

/**
 *跳转到页面
 * @param path 路径,可以带问号
 * @param query 参数,json
 */
export function toPage(path: string | RouteLocationPathRaw, query?: LocationQueryRaw): void {

    const to = parseUrl(path);
    if (query) {
        to.query = {
            ...to.query,
            ...query,
        };
    }

    router.push(to).catch(() => {
        const url = getUrlFromRoute(to);
        window.location.hash = url.substring(1);
        window.location.reload();
    });
}

/**
 *替换当前页面
 * @param path 路径,可以带问号
 * @param query 参数,json
 */
export function replace(path: string | RouteLocationPathRaw, query?: LocationQueryRaw): void {
    const to = parseUrl(path);
    if (query) {
        to.query = {
            ...to.query,
            ...query,
        };
    }

    router.replace(to).catch(() => {
        const url = getUrlFromRoute(to);
        window.location.hash = url.substring(1);
        window.location.reload();
    });
}


/**
 * 提示登录
 *
 */
export function loginMessage() {
    MessagePlugin.warning('暂未登录');
}

/**
 * 清空对象
 * @param obj
 */
export function toEmpty(obj: any) {
    Object.keys(obj).forEach((key) => {
        delete obj[key];
    });
}

/**
 * 转换文件上传报文
 * @param response  原始报文
 */
export function formatUploadResponse(response: any): ResponseType {
    if (!response || response.success === undefined) {
        return { status: 'fail', error: '无法解析' };
    }
    if (!response.success) {
        return { status: 'fail', error: response.error };
    }
    return toUploadFile(response.data);
}

/**
 * 转换附件对象
 * @param attachment 原始附件对象
 * @returns 转换后的对象
 */
export function toUploadFile(attachment: Attachment): Attachment {
    return {
        fileId: attachment.fileId,
        name: attachment.fileName,
        size: attachment.fileSize,
        status: attachment.status ? attachment.status : 'success',
        uploadTime: attachment.createTime ? dayjs(attachment.createTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        url: attachment.url,
    };
}

export function formatDate(datetime: Date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    const o: Recordable = {
        // 季度
        'q+': Math.floor((datetime.getMonth() + 3) / 3),
        'M+': datetime.getMonth() + 1,
        'd+': datetime.getDate(),
        'h+': datetime.getHours(),
        'H+': datetime.getHours(),
        'm+': datetime.getMinutes(),
        's+': datetime.getSeconds(),
        S: datetime.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${datetime.getFullYear()}`.substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    }
    return fmt;
}



// 时间补0
export function formatNum(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * 获取滚动条的宽度
 */
export function getScrollWidth() {
    const scroll = document.createElement('div');
    const scrollIn = document.createElement('div');
    scroll.appendChild(scrollIn);
    scroll.style.width = '100px';
    scroll.style.height = '50px';
    scroll.style.overflow = 'scroll';
    scroll.style.marginLeft = '-100000px';
    document.body.appendChild(scroll);
    const scrollInWidth = scrollIn.offsetWidth;
    const scrollWidth = scroll.offsetWidth;
    const tmp = setTimeout(() => {
        document.body.removeChild(scroll);
        clearTimeout(tmp);
    }, 10);
    return scrollWidth - scrollInWidth;
}

export function parseRoleName(name?: string) {
    if (!name) {
        return '';
    }

    const idx = name.indexOf('-');
    if (idx < 0) {
        return name;
    }

    return name.substring(idx + 1);
}

export function showMeetingCode(meetingCode: any) {
    if (!meetingCode) {
        return '';
    }
    if (meetingCode.length !== 9) {
        return meetingCode;
    }
    const str1 = meetingCode.substring(0, 3);
    const str2 = meetingCode.substring(3, 6);
    const str3 = meetingCode.substring(6, 9);
    return `${str1}-${str2}-${str3}`;
}

export function showNoPermission() {
    MessagePlugin.error('对不起，您没有权限执行该操作\n请切换账号登录');
}

// 转换函数
// 递归转换函数
export function convertData(obj: any, parentKey = '') {
    return Object.keys(obj).map(key => {
        const currentPath = parentKey ? `${parentKey}>${key}` : key;
        const childObj = obj[key];
        const node: treeLabel = {
            label: key,
            value: currentPath,
        };
        if (childObj && typeof childObj === 'object' && Object.keys(childObj).length > 0) {
            node.children = convertData(childObj, currentPath);
        }
        return node;
    });
}


// 通用筛选函数
export const filterDetails = (details: DetailItem[], criteria: FilterCriteria) => {
    return details.filter((item: DetailItem) => {
        const asinMatch = criteria.asin ? item.good_info.asin === criteria.asin : true;
        const campaignNameMatch = criteria.campaign_name ? item.campaign_name === criteria.campaign_name : true;
        const managerNameMatch = criteria.adv_manager_name ? item.adv_manager_name === criteria.adv_manager_name : true;
        const categoryNameMatch = criteria.category_name ? item.category_name === criteria.category_name : true;
        const nameMatch = criteria.good_name ? item.good_info.name.includes(criteria.good_name) : true;
        const departmentNameMatch = criteria.department_name ? item.adv_department_list_name.includes(criteria.department_name) : true;
        const marketplaceNameMatch = criteria.marketplace_name ? item.marketplace_name.includes(criteria.marketplace_name) : true;
        const sellerNameMatch = criteria.seller_name ? item.seller_name.includes(criteria.seller_name) : true;
        const searchTermMatch = criteria.search_term ? item.search_term.includes(criteria.search_term) : true;
        const wordMatch = criteria.word ? item.word.includes(criteria.word) : true;
        const adGroupNameMatch = criteria.ad_group_name ? item.ad_group_name.includes(criteria.ad_group_name) : true;
        const campaignNameListMatch = criteria.campaign_name_list ? item.campaign_name_list.includes(criteria.campaign_name_list) : true;
        const origCampaignTypeMatch = criteria.orig_campaign_match_type ? item.orig_campaign_match_type.includes(criteria.orig_campaign_match_type) : true;
        const newCampaignNameMatch = criteria.new_campaign_name ? item.new_campaign_name.includes(criteria.new_campaign_name) : true;
        const newGroupNameMatch = criteria.new_group_name ? item.new_group_name.includes(criteria.new_group_name) : true;

        return asinMatch && campaignNameMatch && managerNameMatch && categoryNameMatch && nameMatch &&
            departmentNameMatch && marketplaceNameMatch && sellerNameMatch && searchTermMatch && wordMatch &&
            adGroupNameMatch && campaignNameListMatch;
    });
};


export const copyASIN = async (textToCopy: string) => {
    try {
        await toClipboard(textToCopy)
        MessagePlugin.success("文本已复制到剪贴板！");
    } catch (err) {
        MessagePlugin.error("复制失败，错误信息：" + err);
    }
};


export const isRoleCheck = () => {
    const accountData = JSON.parse(localStorage.getItem('account')).account
    if (accountData.role !== 'root') {
        MessagePlugin.warning('您的账号暂无权限访问此页面!')
        toPage('/index/index')
    }
}
// 树状接口获取asin
export function getLeafValues(node) {
    const values = [];
    function recurse(currentNode) {
        if (currentNode.child && currentNode.child.length > 0) {
            currentNode.child.forEach(child => recurse(child));
        } else {
            values.push(currentNode.value);
        }
    }
    recurse(node);
    return values;
}

export function extractData(data: any) {
    return data.map(entry => {
        const marketplaceid = entry.id;
        let asins = [];

        function collectAsins(children) {
            children.forEach(child => {
                if (child.isused && child.value) {
                    asins.push(child.value);
                }
                if (child.child) {
                    collectAsins(child.child);
                }
            });
        }

        if (entry.child) {
            collectAsins(entry.child);
        }

        return {
            marketplaceid,
            asins
        };
    });
}

export function extractMarketplaceAsins(data, targetAsins) {
    let results = [];

    function findAsins(node, marketplaceId) {
        // 检测并收集符合条件的 ASIN

        if ( targetAsins.includes(node.value)) {
            const marketplace = results.find(m => m.marketplaceid === marketplaceId);
            if (marketplace) {
                marketplace.asins.push(node.value);
            } else {

                results.push({
                    marketplaceid: marketplaceId,
                    asins: [node.value]
                });
            }
        }
        // 递归搜索子节点
        if (node.child) {
            node.child.forEach(child => findAsins(child, marketplaceId));
        }
    }

    // 遍历顶层市场节点开始搜索
    data.forEach(marketplace => {
        findAsins(marketplace, marketplace.id);
    });

    return results;
}

export function extractMarketplaceAsins_setting(data, targetAsins) {
    let results = [];

    function findAsins(node, marketplaceId) {
        // 检测并收集符合条件的 ASIN
        if (node.is_used && targetAsins.includes(node.value)) {
            const marketplace = results.find(m => m.marketplaceid === marketplaceId);
            console.log(marketplace)
            if (marketplace) {
                marketplace.asins.push(node.value);
            } else {
                results.push({
                    marketplaceid: marketplaceId,
                    asins: [node.value]
                });
            }
        }
        // 递归搜索子节点
        if (node.child) {
            node.child.forEach(child => findAsins(child, marketplaceId));
        }
    }

    // 遍历顶层市场节点开始搜索
    data.forEach(marketplace => {
        console.log(marketplace)
        findAsins(marketplace, marketplace.market_place_id);
    });

    return results;
}