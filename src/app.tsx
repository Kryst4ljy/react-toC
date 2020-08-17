import { RequestConfig } from 'umi';
require('./libs/rem');

// 网络请求拦截器
export const request: RequestConfig = {
  timeout: 5000,
  errorConfig: {
    adaptor: resData => {
      const success = resData.ret === 1;
      return {
        ...resData,
        success,
        errorCode: resData.ret,
        errorMessage: resData.msg,
      };
    },
  },
  middlewares: [],
  method: 'post',
  // prefix: API_URL,
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
    (response, options) => {
      return response;
    },
  ],
};
