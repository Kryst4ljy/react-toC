import { Effect, Reducer } from 'umi';
import { initData } from '@/config/init';
import {
  getPayType,
  oauthAuthorize,
  payOrder,
  quickRegV3,
  userRegV3,
} from '@/apis/login';
import { Toast } from 'antd-mobile';
import { isSysName } from '@/libs/utils';
import { getCookie, setCookie, delCookie } from '@/libs/utils';

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
  session_id: number;
  username: string;
  user_id: number;
  src_game: string;
  chargeData: Array<object>;
  access_token: string;
  moneyr: any;
  order_data: any;
  order_src: string;
  orderShow: boolean;
  regUsername: string;
  regPassword: string;
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
    toCharge: Effect;
    toRegister: Effect;
    toUserRegV3: Effect;
  };
}

const orderArr = [11, 6, 9, 12, 23, 24];

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
    session_id: 0,
    username: '',
    user_id: 0,
    src_game: '',
    chargeData: [],
    access_token: '',
    moneyr: undefined,
    order_data: undefined,
    order_src: '',
    orderShow: false,
    regUsername: '',
    regPassword: '',
  },
  reducers: {
    setState(state, action) {
      const { payload } = action;
      return Object.assign({}, state, payload);
    },
    clearState(state) {
      return {
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
        localStorage.setItem('open', '1');
        let chargeData: Array<object> = [];
        r.content.info.forEach((item: any) => {
          const obj = {
            pay_type: item.pay_type,
            unite_name: item.unite_name,
            img_class_name: item.img_class_name,
          };
          chargeData.push(obj);
        });
        yield put({
          type: 'setState',
          payload: {
            open: 1,
            chargeData,
          },
        });
      }
    },
    // 登录
    *doLogin({ payload }, { call, put, select }) {
      const r = yield call(oauthAuthorize, payload);
      if (r.ret !== 1) {
        return false;
      }
      const debug_url = encodeURIComponent(
        decodeURIComponent(getCookie('debug_url')),
      );
      const games_id = decodeURIComponent(getCookie('j_game_id'));
      // 设置数据
      yield put({
        type: 'setState',
        payload: {
          session_id: r.content.code,
          username: r.content.user_name,
          user_id: r.content.user_id,
          src_game: `http://static.52ywan.com/Lianyun/page/jh_debug.html?gameUrl=${debug_url}&game_id=${games_id}`,
        },
      });
      localStorage.setItem('user_id', r.content.user_id);
      localStorage.setItem('user_name', r.content.user_name);
      return true;
    },
    // 请求订单号
    *toCharge({}, { call, put, select }) {
      const time = Math.floor(new Date().getTime() / 1000);
      const extra_data = yield select((state: any) => state.init.extra_data);
      const payType = yield select((state: any) => state.init.pay_type);
      const userId = yield select((state: any) => state.init.user_id);
      const JH_APP_ID = yield select((state: any) => state.init.jh_app_id);
      const sdk_v = yield select(
        (state: any) => state.init.extra_data.sdk_version,
      );
      const access_token = yield select(
        (state: any) => state.init.access_token,
      );
      const params = {
        extra_data: JSON.stringify(extra_data),
        jh_app_id: JH_APP_ID,
        pay_type: payType,
        sdk_version: sdk_v,
        order_data: yield select((state: any) => state.init.order_data),
        time_stamp: time,
        uid: userId,
        access_token: access_token,
      };
      const r = yield call(payOrder, params);
      if (r.ret !== 1) {
        return;
      }
      // 支付
      setCookie('order_sn', r.content.order_sn);
      const os = yield select((state: any) => state.init.extra_data.os);
      if (orderArr.includes(payType)) {
        Toast.info('正在支付中...', 0);
      }
      const url = `http://h5.game-props.com/pay/pay?order_sn=${r.content.order_sn}&os=${os}&access_token=${access_token}&uid=${userId}&jh_app_id=${JH_APP_ID}&sdk_version=${sdk_v}`;
      yield put({
        type: 'setState',
        payload: { order_src: url, orderShow: true },
      });
    },
    // 一键注册申请账号
    *toRegister({ payload }, { call, put }) {
      const r = yield call(quickRegV3, payload);
      if (r.ret !== 1) return;
      yield put({
        type: 'setState',
        payload: {
          regUsername: r.content.user_name + '',
          regPassword: r.content.password + '',
        },
      });
      setCookie('username', r.content.user_name + '', 1);
      setCookie('password', r.content.password + '', 1);
    },
    // 一键注册真实注册
    *toUserRegV3({ payload }, { call, put }) {
      const r = yield call(userRegV3, payload);
      if (r.ret !== 1) {
        return false;
      }
      delCookie('username');
      delCookie('password');
      return true;
    },
  },
};

export default init;
