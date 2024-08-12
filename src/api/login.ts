import { requestData } from '@/types/model.login';
import { request } from '@/utils/request';

const Api = {
    Checkexist:'/checkexist',
    Sendsmscode:'/sendsmscode',
    Register:'/register',
    Sendaccount:'/sendaccount',
    Login:'/login',
    account: '/account',

};
export function Checkexist(formData:object) {
    return request.get (
        {
            url: Api.Checkexist,
            data:formData,
        },{ isTransformResponse:false, withToken:false }
        
    );
}
export function Sendsmscode(formData:object) {
    return request.get (
        {
            url: Api.Sendsmscode,
            data:formData,
        },{  withToken:false }
        
    );
}

export function Register(formData:object) {
    return request.post<requestData>(  {
            url: Api.Register,
            data:formData,
        },{ isTransformResponse:false,withToken:false });
} 
export function Sendaccount(formData:object) {
    return request.get (
        {
            url: Api.Sendaccount,
            data:formData,
        },{  withToken:false }
        
    );
}
export function Login(formData:object) {
    return request.post<requestData>(  {
            url: Api.Login,
            data:formData,
        },{isTransformResponse:false });
} 