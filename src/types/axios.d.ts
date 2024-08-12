import { AxiosRequestConfig } from 'axios';

export interface RequestOptions {
    apiUrl?: string;
    isJoinPrefix?: boolean;
    urlPrefix?: string;
    joinParamsToUrl?: boolean;
    formatDate?: boolean;
    isTransformResponse?: boolean;
    isReturnNativeResponse?: boolean;
    ignoreRepeatRequest?: boolean;
    joinTime?: boolean;
    withToken?: boolean;
    ignoreError?: boolean;
    showMessage?: (message: string, success: boolean) => void;
}

export interface Result<T = any> {
    success: boolean;
    error?: string;
    errorCode?: string;
    responseType?: string;
    data: T;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    loading?: Ref<boolean>;
}
