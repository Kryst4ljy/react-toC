import { request } from 'umi';

// 获取支付类型
export const getPayType = (params: any) => request('/pay/pay-type', { params });
// 用户登录接口
export const oauthAuthorize = (params: any) => request('/oauth/authorize', { params });
// 创建订单接口
export const payOrder = (params: any) => request('/pay/order', { params });
// 创建角色时进行上报
export const roleUpdate = (params: any) => request('/user/roleUpdate', { params });
// 进入游戏上报
export const roleEnter = (params: any) => request('/notice/normalGame', { params });
// 一键注册申请账号
export const quickRegV3 = (params: any) => request('/user/quickRegV3', { params });
// 一键注册真实注册
export const userRegV3 = (params: any) => request('/user/userRegV3', { params });