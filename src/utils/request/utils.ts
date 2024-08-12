import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import { TOKEN_NAME } from '@/config/global';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const RequestErrors = {
    ERR_FR_TOO_MANY_REDIRECTS: '过多跳转',
    ERR_BAD_OPTION_VALUE: '参数错误',
    ERR_BAD_OPTION: '参数错误',
    ERR_NETWORK: '网络错误',
    ERR_DEPRECATED: '已过时',
    ERR_BAD_RESPONSE: '响应错误',
    ERR_BAD_REQUEST: '请求错误',
    ERR_NOT_SUPPORT: '请求不支持',
    ERR_INVALID_URL: '链接不安全',
    ERR_CANCELED: '取消请求',
    ECONNABORTED: '请求中断',
    ETIMEDOUT: '请求超时',
};

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
    if (!join) {
        return restful ? '' : {};
    }
    const now = new Date().getTime();
    if (restful) {
        return `?_t=${now}`;
    }
    return { _t: now };
}

// 格式化提交参数时间
export function formatRequestDate(params: Recordable) {
    if (Object.prototype.toString.call(params) !== '[object Object]') {
        return;
    }

    for (const key in params) {
        // eslint-disable-next-line no-underscore-dangle
        if (params[key] && params[key]._isAMomentObject) {
            params[key] = params[key].format(DATE_TIME_FORMAT);
        }
        if (isString(key)) {
            const value = params[key];
            if (value) {
                try {
                    params[key] = isString(value) ? value.trim() : value;
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }
        if (isObject(params[key])) {
            formatRequestDate(params[key]);
        }
    }
}

// 将对象转为Url参数
export function setObjToUrlParams(baseUrl: string, obj: Recordable): string {
    let parameters = '';
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            parameters += `${key}=${encodeURIComponent(obj[key])}&`;
        }
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * 获取默认请求头
 * @param headers
 * @returns
 */
export function getHeaders(headers?: Recordable<string>): Recordable<string> {
    if (!headers) {
        headers = {};
    }
    headers[TOKEN_NAME] = sessionStorage.getItem(TOKEN_NAME) || '';
    headers['x-requested-with'] = 'XMLHttpRequest';
    return headers;
}
