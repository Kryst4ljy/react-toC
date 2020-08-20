import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Login from './login/index';
import Register from './register/index';
import Charge from './charge/index';
import { initType, connect, useDispatch, reportType } from 'umi';
import { CDN_URL } from '@/config/index';
import { setCookie } from '@/libs/utils';
import { Toast } from 'antd-mobile';

const app = (props: any) => {
  const [state, updateState] = useState({
    loginShow: true,
    registerShow: false,
    chargeShow: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    // 信息初始化
    dispatch({ type: 'init/initState' });
  }, []);

  const loadingImg = `${CDN_URL}/loading.gif`;
  const skin = props.location.query.skin;

  const changeBoxState = (data: object) => {
    const newState = Object.assign(state, data);
    updateState({
      ...newState,
    });
  };

  // 监听游戏消息
  const regMsgHandler = () => {
    window.addEventListener('message', e => {
      const obj = e.data;
      if (!obj || !obj.action || !obj.params) {
        console.log('params error');
        return;
      }
      // console.log(JSON.stringify(obj));
      switch (obj.action) {
        case 'logout':
          doLogout();
          break;
        case 'getUser':
          const callback = obj.params.callback;
          const user = {
            session_id: props.init.session_id,
            type: props.init.app_key,
            os: props.init.attributeReportParams.os,
          };
          console.log(user);
          sendToGame(callback, user);
          break;
        case 'setUser':
          doSetUser(obj.params);
          break;
        case 'showOrder':
          doShowOrderView(obj.params);
          break;
        case 'cancelOrder':
          doCancelOrder(obj.params);
          break;
        case 'orderOk':
          doOrderOk(obj.params);
          break;
        case 'shutDown':
          shutDown(obj.params);
          break;
        case 'YWPlayerStatusCreate':
          YWPlayerStatusCreate(obj.params);
          break;
        case 'YWPlayerStatusLevelUp':
          YWPlayerStatusLevelUp(obj.params);
          break;
        case 'YWPlayerStatusEnterServer':
          ywGameEnterServer(obj.params);
        default:
          console.log('error action:' + obj.params);
      }
    });
  };

  //注销
  const doLogout = () => {
    location.reload();
  };
  const sendToGame = (o: any, e: object) => {
    const n = {
      action: o,
      params: e,
    };
    window.frames['gameFrame'].postMessage(n, '*');
  };
  // 二次验证
  const doSetUser = (userInfo: any) => {
    localStorage.user_id = userInfo.uid;
    localStorage.user_name = userInfo.name;
    localStorage.access_token = userInfo.session_id;
    props.dispatch({
      type: 'init/setState',
      payload: {
        loadingstaus: false,
        access_token: userInfo.session_id,
      },
    });
    changeBoxState({
      loginShow: false,
      registerShow: false,
      chargeShow: false,
    });
  };
  const doShowOrderView = (data: any) => {
    const info = JSON.parse(data);
    const access_token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    const moneyr = parseFloat(Number(info.zfAmount) / 100).toFixed(2);
    const order = {
      cp_trade_no: info.orderId,
      notify_url: info.notifyUrl,
      body: info.zfDesc,
      product_id: info.productId,
      product: info.productName,
      exchange_rate: info.rate,
      app_role_id: info.roleId,
      app_role_name: info.roleName,
      server_id: info.serverId,
      total_fee: info.zfAmount,
    };
    const orderJSON = JSON.stringify(order);
    props.dispatch({
      type: 'init/setState',
      payload: {
        access_token: access_token,
        user_id: user_id,
        moneyr: moneyr,
        order_data: orderJSON,
      },
    });
    if (props.init.open == 0) {
      props.dispatch({
        type: 'init/toCharge',
      });
    }
    changeBoxState({
      loginShow: false,
      registerShow: false,
      chargeShow: true,
    });
  };
  // 支付失败
  const doCancelOrder = (data: any) => {
    dispatch({
      type: 'init/setState',
      payload: {
        order_src: '',
        orderShow: false,
      },
    });
    setCookie('order_sn', '');
    Toast.info('支付失败');
    changeBoxState({
      chargeShow: false,
    });
  };
  // 支付成功
  const doOrderOk = (data: any) => {
    dispatch({
      type: 'init/setState',
      payload: {
        order_src: '',
        orderShow: false,
      },
    });
    Toast.info('支付成功');
    setCookie('order_sn', '');
    changeBoxState({
      chargeShow: false,
    });
  };
  // 注销
  const shutDown = (data: any) => {};
  // 创角
  const YWPlayerStatusCreate = (data: any) => {
    const params = {
      user_id: props.init.user_id,
      appkey: props.init.jh_app_id || '100000001',
      server_id: data.serverId,
      server_name: data.serverName,
      role_id: data.roleId,
      role_name: data.roleName,
      role_level: data.roleLevel,
      guild: data.partyName,
      money: data.balance,
      access_token: localStorage.access_token,
    };
    dispatch({
      type: 'report/roleUpdata',
      payload: {
        ...params,
      },
    });
  };
  // 角色升级
  const YWPlayerStatusLevelUp = (data: any) => {
    const params = {
      user_id: props.init.user_id,
      appkey: props.init.jh_app_id || '100000001',
      server_id: data.serverId,
      server_name: data.serverName,
      role_id: data.roleId,
      role_name: data.roleName,
      role_level: data.roleLevel,
      guild: data.partyName,
      money: data.balance,
      access_token: localStorage.access_token,
    };
    dispatch({
      type: 'report/roleUpdata',
      payload: {
        ...params,
      },
    });
  };
  // 进入游戏
  const ywGameEnterServer = (data: any) => {
    const params = {
      jh_app_id: props.init.jh_app_id,
      user_id: props.init.user_id,
    };
    props.dispatch({
      type: 'report/roleEnter',
      payload: { ...params },
    });
  };

  return (
    <div className={styles.box}>
      {/* loading蒙层 */}
      <div
        className={styles.loading}
        style={{ display: props.init.loadingstaus ? 'inline-block' : 'none' }}
      >
        <img src={loadingImg} alt="" />
      </div>
      {/* 游戏frame */}
      <iframe
        className={styles.gameFrame}
        name="gameFrame"
        src={props.init.src_game}
      ></iframe>
      {/* 支付frame */}
      <iframe
        style={{ display: props.init.orderShow ? 'inline-block' : 'none' }}
        className={styles.orderFrame}
        name="orderFrame"
        src={props.init.order_src}
      ></iframe>
      {/* 登录框 */}
      <div
        className={styles.contentBox}
        style={{ display: state.loginShow ? 'inline-block' : 'none' }}
      >
        <Login
          skin={skin}
          changeBoxState={changeBoxState}
          regMsgHandler={regMsgHandler}
        ></Login>
      </div>
      {/* 注册框 */}
      <div
        className={styles.contentBox}
        style={{ display: state.registerShow ? 'inline-block' : 'none' }}
      >
        <Register
          skin={skin}
          regMsgHandler={regMsgHandler}
          changeBoxState={changeBoxState}
        ></Register>
      </div>
      {/* 支付框 */}
      <div
        className={styles.contentBox}
        style={{ display: state.chargeShow ? 'inline-block' : 'none' }}
      >
        <Charge skin={skin} changeBoxState={changeBoxState}></Charge>
      </div>
    </div>
  );
};

export default React.memo(
  connect(({ init, report }: { init: initType; report: reportType }) => ({
    init: init,
    report: report,
  }))(app),
);
