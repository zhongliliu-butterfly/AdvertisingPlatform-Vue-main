import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { stringify } from 'qs';
import isFunction from 'lodash/isFunction';
import cloneDeep from 'lodash/cloneDeep';
import { CreateAxiosOptions } from './AxiosTransform';
import { AxiosCanceler } from './AxiosCancel';
import { CustomAxiosRequestConfig, RequestOptions, Result } from '@/types/axios';
import { RequestErrors } from './utils';
import { toPage } from '@/utils/webapp';

// Axios模块
export class VAxios {
    // axios句柄
    private instance: AxiosInstance;

    // axios选项
    private readonly options: CreateAxiosOptions;

    constructor(options: CreateAxiosOptions) {
        this.options = options;
        this.instance = axios.create(options);
        this.setupInterceptors();
    }

    // 创建axios句柄
    private createAxios(config: CreateAxiosOptions): void {
        this.instance = axios.create(config);
    }

    // 获取数据处理
    private getTransform() {
        const { transform } = this.options;
        return transform;
    }

    // 获取句柄
    getAxios(): AxiosInstance {
        return this.instance;
    }

    // 配置 axios
    configAxios(config: CreateAxiosOptions) {
        if (!this.instance) {
            return;
        }
        this.createAxios(config);
    }

    // 设置通用头信息
    setHeader(headers: Record<string, string>): void {
        if (!this.instance) {
            return;
        }
        Object.assign(this.instance.defaults.headers, headers);
    }

    // 设置拦截器
    private setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) {
            return;
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
            transform;
        const axiosCanceler = new AxiosCanceler();

        // 请求配置处理
        this.instance.interceptors.request.use((config) => {
            // console.log('config===',config)
           // 从本地存储获取token
           const authToken = JSON.parse(localStorage.getItem('authToken'));
        //    console.log('token==',authToken)
           if (authToken&&authToken.token) {
               config.headers.Authorization = `Bearer ${authToken.token}`; // 设置Bearer token认证头部
           }
            const {
                headers: { ignoreRepeatRequest },
            } = config;

            const ignoreRepeat = ignoreRepeatRequest ?? this.options.requestOptions?.ignoreRepeatRequest;
            if (!ignoreRepeat) axiosCanceler.addPending(config);

            if (requestInterceptors && isFunction(requestInterceptors)) {
                return requestInterceptors(config, this.options);
            }
            

            return config;
        }, undefined);

        // 请求错误处理
        if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
            this.instance.interceptors.request.use(undefined, requestInterceptorsCatch);
        }

        // 响应结果处理
        this.instance.interceptors.response.use((res) => {
            if (res) axiosCanceler.removePending(res.config);
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res);
            }
            return res;
        }, undefined);

        this.instance.interceptors.response.use(response => response, error => {
            if (error.response && error.response.status === 401) {
                console.log('token过期===')
                // Token无效或已过期
                localStorage.removeItem('authToken'); // 清除本地存储中的Token
                toPage('/login/index');  
            }
            return Promise.reject(error);
        });

        // 响应错误处理
        if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
            this.instance.interceptors.response.use(undefined, responseInterceptorsCatch);
        }
    }

    // 支持Form Data
    supportFormData(config: AxiosRequestConfig) {
        const headers = config.headers || this.options.headers;
        const contentType = headers?.['Content-Type'] || headers?.['content-type'];

        if (
            contentType !== 'application/json;charset=UTF-8' ||
            !Reflect.has(config, 'data') ||
            config.method?.toUpperCase() === 'GET'
        ) {
            return config;
        }

        return {
            ...config,
            data: stringify(config.data, { arrayFormat: 'brackets' }),
        };
    }

    get<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'GET' }, options);
    }

    post<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'POST' }, options);
    }

    put<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'PUT' }, options);
    }

    delete<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'DELETE' }, options);
    }

    patch<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'PATCH' }, options);
    }

    // 请求
    async request<T = any>(config: CustomAxiosRequestConfig, options?: RequestOptions): Promise<T> {
        let conf: CreateAxiosOptions = cloneDeep(config);
        const transform = this.getTransform();

        const { requestOptions } = this.options;

        const opt: RequestOptions = { ...requestOptions, ...options };

        const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }
        conf.requestOptions = opt;

        conf = this.supportFormData(conf);

        if (config.loading) {
            config.loading.value = true;
        }
        return new Promise((resolve, reject) => {
            this.instance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (config.loading) {
                        config.loading.value = false;
                    }
                    if (transformRequestHook && isFunction(transformRequestHook)) {
                        try {
                            const ret = transformRequestHook(res, opt);
                            resolve(ret);
                        } catch (err: any) {
                            if (Reflect.has(err, 'message')) {
                                if (err.message && opt.showMessage) {
                                    opt.showMessage(err.message, false);
                                }
                                reject(err);
                            } else {
                                const e = typeof err === 'string' ? new Error(err) : new Error('请求错误');
                                if (opt.showMessage) {
                                    opt.showMessage(e.message, false);
                                }
                                reject(e);
                            }
                        }
                        return;
                    }
                    resolve(res as unknown as Promise<T>);
                })
                .catch((e: Error | AxiosError) => {
                    if (config.loading) {
                        config.loading.value = false;
                    }
                    if (requestCatchHook && isFunction(requestCatchHook)) {
                        reject(requestCatchHook(e, opt));
                        return;
                    }
                    if (axios.isAxiosError(e)) {
                        console.error(e);

                        if (e.code) {
                            const msg = Reflect.get(RequestErrors, e.code);
                            if (msg) {
                                e = new Error(msg);
                            }
                        }
                    }

                    if (e && !opt.ignoreError && opt.showMessage) {
                        opt.showMessage(e.message, false);
                    }
                    reject(e);
                });
        });
    }
}
