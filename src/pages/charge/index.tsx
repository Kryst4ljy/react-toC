import React from 'react';
import { connect, initType } from 'umi';
import styles from './charge.less';
import { CDN_URL, CDN_FONT, skins } from '@/config/index';

class Charge extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      chooseIndex: 0,
    };
  }

  changeIndex = (index: number) => {
    this.setState({ chooseIndex: index });
  };

  closeCharge = () => {
    this.props.changeBoxState({ chargeShow: false });
  };

  toCharge = () => {
    // console.log(this.props.init.chargeData[this.state.chooseIndex]);
    this.props.dispatch({
      type: 'init/setState',
      payload: {
        pay_type: this.props.init.chargeData[this.state.chooseIndex][
          'pay_type'
        ],
      },
    });
    this.props.dispatch({
      type: 'init/toCharge',
    });
  };

  render() {
    const skin = skins.find(m => {
      return (m.name = this.props.skin);
    });
    const mainColor = skin ? skin.color : '#D43E3E'; // 默认主题色
    const closeImg = `${CDN_FONT}/font_end/HeiMiaoPlatform/packet/close.png`;

    const payIcon = {
      alipay: 'zfb',
      wechat: 'wx',
      e_pay: 'visa',
    };
    let chargeItem: Array<object> = [];
    this.props.init.chargeData.forEach((item: object, index: number) => {
      const obj = (
        <li
          key={index}
          className={styles.payItem}
          onClick={() => {
            this.changeIndex(index);
          }}
        >
          <img
            src={`${CDN_URL}/common/${payIcon[item['img_class_name']]}.png`}
            alt=""
          />
          <span className={styles.payName}>{item['unite_name']}</span>
          <span
            style={{
              backgroundColor: `${
                index == this.state.chooseIndex ? mainColor : '#cccccc'
              }`,
            }}
            className={styles.checked}
          ></span>
        </li>
      );
      chargeItem.push(obj);
    });

    return (
      <div className={styles.box}>
        <div className={styles.content}>
          <img
            className={styles.close}
            onClick={() => {
              this.closeCharge();
            }}
            src={closeImg}
            alt=""
          />
          {/* 标题 */}
          <div
            style={{ backgroundColor: `${mainColor}` }}
            className={styles.top}
          >
            支 付
          </div>
          {/* 支付金额 */}
          <p className={styles.payTitle}>
            支付金额：{this.props.init.moneyr}元
          </p>
          <ul>{chargeItem}</ul>
          <div
            style={{ backgroundColor: `${mainColor}` }}
            className={styles.toCharge}
            onClick={() => {
              this.toCharge();
            }}
          >
            确认支付
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(
  connect(({ init }: { init: initType }) => ({
    init: init,
  }))(Charge),
);
