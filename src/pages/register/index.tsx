import React from 'react';
import styles from './register.less';
import { CDN_URL, skins } from '@/config/index';
import { history } from 'umi';

export default class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      title: '注 册',
      username: '',
      password: '',
    };
  }

  // 跳转至登录页面
  goLogin = () => {
    const query = this.props.location.query;
    history.push({
      pathname: '/h5sdk/login',
      query: {
        ...query,
      },
    });
  };

  render() {
    const skin = skins.find(m => {
      return (m.name = this.props.location.query.skin);
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
            {this.state.title}
          </div>
          {/* 中部账号密码 */}
          <div className={styles.account}>
            <p>{'账号：' + this.state.username}</p>
            <p>{'密码：' + this.state.password}</p>
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
            >
              {'一键注册'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
