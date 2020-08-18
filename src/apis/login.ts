import { request } from 'umi';

// 获取支付类型
export const getPayType = (params: any) => request('/pay/pay-type', { params });
// 用户登录接口
export const oauthAuthorize = (params: any) => request('/oauth/authorize', { params });
