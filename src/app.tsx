import { RequestConfig } from 'umi';
import { API_URL } from '@/config';
import { Toast } from 'antd-mobile';
require('./libs/rem');

// 网络请求拦截器
export const request: RequestConfig = {
  timeout: 5000,
  middlewares: [],
  method: 'post',
  prefix: API_URL,
  useCache: true,
  ttl: 1000,
  requestInterceptors: [
    (url, options) => {
      return {
        url,
        options,
      };
    },
  ],
  responseInterceptors: [
    async (response, options) => {
      const data = await response.clone().json();
      if (data.ret !== 1) {
        Toast.fail(data.msg);
      }
      return response;
    },
  ],
};
