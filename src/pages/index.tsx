import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { initType, connect, useDispatch } from 'umi';
import { CDN_URL } from '@/config/index';

const app = (props: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // 信息初始化
    dispatch({ type: 'init/initState' });
  }, []);

  const loadingImg = `${CDN_URL}/loading.gif`;

  return (
    <div className={styles.box}>
      <div
        className={styles.loading}
        style={{ display: props.init.loadingstaus ? 'inline-block' : 'none' }}
      >
        <img src={loadingImg} alt="" />
      </div>
      {props.children}
    </div>
  );
};

export default React.memo(
  connect(({ init }: { init: initType }) => ({
    init: init,
  }))(app),
);
