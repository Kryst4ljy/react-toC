import CryptoJS from 'crypto-js';
import { Effect, Reducer } from 'umi';
import { initData } from '@/config/init';
import { getPayType, oauthAuthorize } from '@/apis/login';
import { Toast } from 'antd-mobile';
import { isSysName } from '@/libs/utils';

interface initStateType {
  jh_app_id: string;
  initInfo: object;
  attributeReportParams: object;
  app_key: string;
  jh_channel: string;
  extra_data: object;
  loadingstaus: boolean;
  game_version: string;
  open: number;
  pay_type: number;
}

export interface initType {
  namespace: string;
  state: initStateType;
  reducers: {
    setState: Reducer;
    clearState: Reducer;
  };
  effects: {
    initState: Effect;
    getPayType: Effect;
    doLogin: Effect;
  };
}

const init: initType = {
  namespace: 'init',
  state: {
    jh_app_id: '',
    initInfo: {},
    attributeReportParams: {},
    app_key: '',
    jh_channel: '',
    extra_data: {},
    loadingstaus: false,
    game_version: '',
    open: 0,
    pay_type: 0,
  },
  reducers: {
    setState(state, action) {
      const { payload } = action;
      return Object.assign({}, state, payload);
    },
    clearState(state) {
      // xxx
      return {
        ...state,
      };
    },
  },
  effects: {
    // 初始化信息
    *initState({}, { put }) {
      yield put({
        type: 'setState',
        payload: {
          jh_app_id: '100000001',
          initInfo: initData,
          attributeReportParams: initData.attributeReportParams,
          app_key: initData.jh_app_id,
          jh_channel: initData.jh_channel,
          extra_data: initData.extra_data,
          loadingstaus: false,
          game_version: initData.game_version,
        },
      });
      const attributeReportParams = JSON.stringify(
        initData.attributeReportParams,
      );
      const extraData = JSON.stringify(initData.extra_data);
      localStorage.setItem('jh_app_id', initData.jh_app_id);
      localStorage.setItem('game_version', initData.game_version);
      localStorage.setItem('attributeReportParams', attributeReportParams);
      localStorage.setItem('extra_data', extraData);
      // 请求支付方式
      yield put({
        type: 'getPayType',
      });
    },
    // 请求支付方式
    *getPayType({}, { call, put, select }) {
      const JH_APP_ID = yield select((state: any) => state.init.jh_app_id);
      const GAME_VERSION = yield select(
        (state: any) => state.init.game_version,
      );
      const params = {
        jh_app_id: JH_APP_ID,
        game_version: GAME_VERSION,
      };
      const r = yield call(getPayType, params);
      if (r.ret !== 1) {
        Toast.info(r.msg);
        return;
      }
      // 三方SDK上报信息
      let thirdLibs = JSON.stringify(r.content.thirdLibs);
      localStorage.setItem('thirdLibs', thirdLibs);
      // 三方支付打开状态，0关闭，1打开
      if (r.content.open == 0) {
        localStorage.setItem('open', '0');
        if (isSysName() == 'android') {
          yield put({
            type: 'setState',
            payload: {
              pay_type: 22,
            },
          });
        } else {
          yield put({
            type: 'setState',
            payload: {
              pay_type: 7,
            },
          });
        }
      } else {
        const anoState: any = {};
        localStorage.setItem('open', '1');
        anoState.open = 1;
        //  xxx 根据返回设置icon
      }
    },
    // 登录
    *doLogin({ payload }, { call, put, select }) {
      const { username, password, time } = payload;
      // const EXTRA_DATA = yield select((state: any) => state.init.extra_data);
      const params = {
        user_name: username,
        password: CryptoJS.MD5(password + CryptoJS.MD5(password)).toString(),
        jh_app_id: yield select((state: any) => state.init.jh_app_id),
        jh_channel: yield select((state: any) => state.init.jh_channel),
        // device_id: JSON.parse(EXTRA_DATA).device_id,
        time,
      };
      console.log(params);
      // yield call(oauthAuthorize, params);
    },
  },
};

export default init;
