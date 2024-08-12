// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import isString from 'lodash/isString';
import merge from 'lodash/merge';

import { MessagePlugin } from 'tdesign-vue-next';
import type { AxiosTransform, CreateAxiosOptions } from './AxiosTransform';
import { VAxios } from './Axios';
import { TOKEN_NAME } from '@/config/global';
import { joinTimestamp, formatRequestDate, setObjToUrlParams } from './utils';
import * as WebApp from '@/utils/webapp';

// 数据处理，方便区分多种处理方式
const transform: AxiosTransform = {
    // 请求前处理配置
    beforeRequestHook: (config, options) => {
        const { apiUrl, isJoinPrefix, urlPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

        // 添加接口前缀
        if (isJoinPrefix && urlPrefix && isString(urlPrefix)) {
            config.url = `${urlPrefix}${config.url}`;
        }

        // 将baseUrl拼接
        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;

        if (formatDate && data && !isString(data)) {
            formatRequestDate(data);
        }
        if (config.method?.toUpperCase() === 'GET') {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
                if (joinParamsToUrl) {
                    config.url = setObjToUrlParams(config.url as string, { ...config.params, ...config.data });
                }
            } else {
                // 兼容restful风格
                config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
                config.params = undefined;
            }
        } else if (!isString(params)) {
            if (formatDate) {
                formatRequestDate(params);
            }
            if (
                Reflect.has(config, 'data') &&
                config.data &&
                (Object.keys(config.data).length > 0 || data instanceof FormData)
            ) {
                config.data = data;
                config.params = params;
            } else {
                // 非GET请求如果没有提供data，则将params视为data
                config.data = params;
                config.params = undefined;
            }
        } else {
            // 兼容restful风格
            config.url += params;
            config.params = undefined;
        }

        return config;
    },

    // 请求拦截器处理
    requestInterceptors: (config, options) => {
        // 请求之前处理config
        return config;
    },

    // 响应拦截器处理
    responseInterceptors: (res) => {
        return res;
    },

    // 处理请求数据。如果数据不是预期格式，可直接抛出错误
    transformRequestHook: (res, options) => {
        // console.log('接口返回数据===',res)
        const { isTransformResponse, isReturnNativeResponse } = options;
        // 如果204无内容直接返回
        const method = res.config.method?.toLowerCase();
        if (res.status === 204 || method === 'put' || method === 'patch') {
            return res;
        }

        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }

        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }

        // 错误的时候返回
        const { data } = res;
        if (!data) {
            throw new Error('请求接口错误');
        }

        // if (data.success) {
        //     return data.data;
        // }
        if (data.data) {
            return data.data;
        }

        
        if (data.error === '没有权限') {
            return data;
        }
        throw new Error(data.error);
    },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
    return new VAxios(
        merge(
            <CreateAxiosOptions>{
                // 例如: authenticationScheme: 'Bearer'
                authenticationScheme: TOKEN_NAME,
                // 超时
                timeout: 60 * 1000,
                // 携带Cookie
                withCredentials: true,
                // 头信息
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-with': 'XMLHttpRequest',
                },
                // 数据处理方式
                transform,
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 接口地址
                    apiUrl: '',
                    // 是否自动添加接口前缀
                    isJoinPrefix: true,
                    // 接口前缀
                    urlPrefix: '/web/api',
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    // 需要对返回数据进行处理
                    isTransformResponse: true,
                    // get请求的时候添加参数到url
                    joinParamsToUrl: true,
                    // 格式化提交参数时间
                    formatDate: true,
                    // 是否加入时间戳
                    joinTime: true,
                    // 忽略重复请求
                    ignoreRepeatRequest: true,
                    // 是否携带token
                    withToken: true,
                    // 是否不弹出异常信息
                    ignoreError: false,
                    // 异常消息提示
                    showMessage: (message, success) => {
                        if (success) {
                            MessagePlugin.success(message);
                        } else {
                            const messageBoxes = document.querySelectorAll('.t-message.t-is-error');
                            let isHave = false;
                            for (let i = 0; i < messageBoxes.length; i++) {
                                if ((messageBoxes[i] as HTMLElement).innerText == message) {
                                    isHave = true;
                                    break;
                                }
                            }
                            if (!isHave) {
                                MessagePlugin.error(message);
                            }
                        }
                    },
                },
            },
            opt || {},
        ),
    );
}

export const request = createAxios();
