import React from 'react';
import styles from './inputItem.less';

interface InputItemProps {
  inputType: number;
  type: string;
  placeHolder: string;
  left: {
    img: string;
  };
  right?: {
    type: Number;
    img?: string;
    imgTrans?: Boolean;
    text?: string;
    cb: Function;
  };
  changeState: Function;
}

export default class InputItem extends React.Component<InputItemProps> {
  constructor(props: InputItemProps) {
    super(props);
  }

  // 向上传值
  changeInput = (val: string, type: number) => {
    if (type === 1) {
      this.props.changeState({
        type,
        username: val,
      });
    } else if (type === 2) {
      this.props.changeState({
        type,
        password: val,
      });
    }
  };

  handleChange = (e: any) => {
    this.changeInput(e.target.value, this.props.inputType);
  };

  render() {
    const leftImg = this.props.left.img; // 输入框左边图标
    const rightImg = this.props.right ? this.props.right.img : ''; // 输入框右边图标
    const rightText = this.props.right ? this.props.right.text : ''; // 输入框右边文字
    const rightType = this.props.right ? this.props.right.type : 0; // 输入框右边图标
    const rightImgTrans = this.props.right ? this.props.right.imgTrans : false; // 输入框右边图标是否要翻转
    const rightCB = this.props.right ? this.props.right.cb : () => {}; // 输入框右边回调函数

    return (
      <div className={styles.box}>
        <div className={styles.left}>
          <img src={leftImg} alt="" />
        </div>
        <input
          type={this.props.type}
          placeholder={this.props.placeHolder}
          onChange={this.handleChange}
        />
        <div
          className={styles.right}
          onClick={() => {
            rightCB();
          }}
        >
          <img
            style={{
              display: rightType === 1 ? 'inline-block' : 'none',
              transform: rightImgTrans && `rotateZ(90deg)`,
            }}
            src={rightImg}
            alt=""
          />
          <span>{rightType === 2 ? rightText : ''}</span>
        </div>
      </div>
    );
  }
}
