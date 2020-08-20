import React from 'react';
import CryptoJS from 'crypto-js';
import styles from './login.less';
import InputItem from '@/components/InputItem/InputItem';
import { CDN_URL, skins } from '@/config/index';
import { history, connect, initType } from 'umi';
import { Toast } from 'antd-mobile';
import { getCookie } from '@/libs/utils';

class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      title: '登 录',
      username: '',
      password: '',
    };
  }

  // 修改父组件state
  changeState = (msg: any) => {
    if (msg.type === 1) {
      this.setState({
        username: msg.username,
      });
    } else if (msg.type === 2) {
      this.setState({
        password: msg.password,
      });
    }
  };

  // 跳转至注册页面
  goReg = () => {
    if (getCookie('username') == '' || getCookie('password') == '') {
      this.props.dispatch({
        type: 'init/toRegister',
        payload: {
          jh_channel: this.props.init.jh_channel,
          jh_app_id: this.props.init.jh_app_id,
        },
      });
    } else {
      const username = getCookie('username') + '';
      const passwords = getCookie('password') + '';
      this.props.dispatch({
        type: 'init/setState',
        payload: {
          regUsername: username,
          regPassword: passwords,
        },
      });
    }
    this.props.changeBoxState({
      loginShow: false,
      registerShow: true,
      chargeShow: false,
    });
  };

  // 点击登录
  toLogin = async () => {
    const debug_url = encodeURIComponent(
      decodeURIComponent(getCookie('debug_url')),
    );
    const games_id = decodeURIComponent(getCookie('j_game_id'));
    // 匹配用户名规则
    if (
      this.state.username == '' ||
      !this.state.username.match(/^[A-Za-z0-9]{6,18}$/)
    ) {
      Toast.info('账号、密码应为6-18位数字字母组合');
      return;
    }
    // 匹配密码规则
    if (
      this.state.password == '' ||
      !this.state.password.match(/^[A-Za-z0-9]{6,18}$/)
    ) {
      Toast.info('账号、密码应为6-18位数字字母组合');
      return;
    }
    // 匹配签名;
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
    this.props.dispatch({
      type: 'init/setState',
      payload: { loadingstaus: true },
    });
    const time = Math.floor(new Date().getTime() / 1000);
    const flag = await this.props.dispatch({
      type: 'init/doLogin',
      payload: {
        user_name: this.state.username,
        password: CryptoJS.MD5(
          this.state.password + CryptoJS.MD5(this.state.password),
        ).toString(),
        jh_app_id: this.props.init.jh_app_id,
        jh_channel: this.props.init.jh_channel,
        time,
      },
    });
    if (flag) {
      this.props.regMsgHandler();
    }
  };

  render() {
    const skin = skins.find(m => {
      return (m.name = this.props.skin);
    });
    const mainColor = skin ? skin.color : '#D43E3E'; // 默认主题色
    const accImg = `${CDN_URL}/skins/account.png`; // 用户名输入框左边图标
    const passImg = `${CDN_URL}/skins/locking.png`; // 密码输入框左边图标

    return (
      <div className={styles.box}>
        <div className={styles.content}>
          {/* 顶部标题栏 */}
          <div
            style={{ backgroundColor: `${mainColor}` }}
            className={styles.top}
          >
            {this.state.title}
          </div>
          {/* 用户名输入框 */}
          <InputItem
            inputType={1}
            changeState={this.changeState}
            type={'text'}
            placeHolder={'请输入用户名'}
            left={{ img: accImg }}
          ></InputItem>
          {/* 密码输入框 */}
          <InputItem
            inputType={2}
            changeState={this.changeState}
            type={'password'}
            placeHolder={'请输入密码'}
            left={{ img: passImg }}
          ></InputItem>
          {/* 底部按钮 */}
          <div className={styles.bot}>
            <div
              className={styles.btnReg}
              style={{
                border: `1px solid ${mainColor}`,
                color: `${mainColor}`,
              }}
              onClick={this.goReg}
            >
              {'注册账号'}
            </div>
            <div
              className={styles.btnLogin}
              style={{ backgroundColor: `${mainColor}` }}
              onClick={this.toLogin}
            >
              {'登录'}
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
  }))(Login),
);
