import React from 'react';
import styles from './register.less';
import CryptoJS from 'crypto-js';
import { CDN_URL, skins } from '@/config/index';
import { connect, initType } from 'umi';
import { getCookie } from '@/libs/utils';
import { Toast } from 'antd-mobile';

class Register extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  // 跳转至登录页面
  goLogin = () => {
    this.props.changeBoxState({
      loginShow: true,
      registerShow: false,
      chargeShow: false,
    });
  };

  // 一键注册真实注册
  toUserReg = async () => {
    this.props.dispatch({
      type: 'init/setState',
      payload: { loadingstaus: true },
    });
    const params = {
      jh_channel: this.props.init.jh_channel,
      jh_app_id: this.props.init.jh_app_id,
      user_name: this.props.init.regUsername,
      password: CryptoJS.MD5(
        this.props.init.regPassword + CryptoJS.MD5(this.props.init.regPassword),
      ).toString(),
      extra_data: JSON.stringify({
        android_sdk_level: '24',
        android_version: '7.0',
        device_id: '00000000-0000-0000-0000-000000000000',
        device_name: 'HUAWEI NXT-AL10',
        imei: '860482036341443',
        ip_addr: '0.0.0.0',
        jh_channel: 'debug',
        os: 'Android',
        sdk_version: '3.3.1',
      }),
    };
    const flag = await this.props.dispatch({
      type: 'init/toUserRegV3',
      payload: { ...params },
    });
    if (flag) {
      const debug_url = encodeURIComponent(
        decodeURIComponent(getCookie('debug_url')),
      );
      const games_id = decodeURIComponent(getCookie('j_game_id'));
      if (
        debug_url == undefined ||
        games_id == undefined ||
        debug_url == 'null' ||
        games_id == null ||
        debug_url == '' ||
        games_id == ''
      ) {
        Toast.info('签名错误，请核验参数是否正确');
        return;
      }
      const time = Math.floor(new Date().getTime() / 1000);
      const flag2 = await this.props.dispatch({
        type: 'init/doLogin',
        payload: {
          user_name: this.props.init.regUsername,
          password: CryptoJS.MD5(
            this.props.init.regPassword +
              CryptoJS.MD5(this.props.init.regPassword),
          ).toString(),
          jh_app_id: this.props.init.jh_app_id,
          jh_channel: this.props.init.jh_channel,
          time,
        },
      });
      if (!flag2) return;
      this.props.regMsgHandler();
    }
  };

  render() {
    const skin = skins.find(m => {
      return (m.name = this.props.skin);
    });
    const mainColor = skin ? skin.color : '#D43E3E'; // 默认主题色

    return (
      <div className={styles.box}>
        <div className={styles.content}>
          {/* 顶部标题栏 */}
          <div
            style={{ backgroundColor: `${mainColor}` }}
            className={styles.top}
          >
            注 册
          </div>
          {/* 中部账号密码 */}
          <div className={styles.account}>
            <p>{'账号：' + this.props.init.regUsername}</p>
            <p>{'密码：' + this.props.init.regPassword}</p>
          </div>
          {/* 底部按钮 */}
          <div className={styles.bot}>
            <div
              className={styles.btnReg}
              style={{
                border: `1px solid ${mainColor}`,
                color: `${mainColor}`,
              }}
              onClick={this.goLogin}
            >
              {'返回'}
            </div>
            <div
              className={styles.btnLogin}
              style={{ backgroundColor: `${mainColor}` }}
              onClick={() => {
                this.toUserReg();
              }}
            >
              {'一键注册'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(
  connect(({ init }: { init: initType }) => ({
    init: init,
  }))(Register),
);
