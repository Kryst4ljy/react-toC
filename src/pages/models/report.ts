import { Effect } from 'umi';
import { roleUpdate, roleEnter } from '@/apis/login';

export interface reportType {
  namespace: string;
  effects: {
    roleUpdata: Effect;
    roleEnter: Effect;
  };
}

const report: reportType = {
  namespace: 'report',
  effects: {
    // 角色升级上报
    *roleUpdata({ payload }, { call }) {
      const r = yield call(roleUpdate, payload);
      if (r.ret !== 1) {
        console.log('角色升级上报失败');
        return;
      }
      console.log('角色升级上报成功');
    },
    // 进入游戏上报
    *roleEnter({ payload }, { call }) {
      const r = yield call(roleEnter, payload);
      if (r.ret !== 1) {
        console.log('进入游戏上报失败');
        return;
      }
      console.log('进入游戏上报成功');
    },
  },
};

export default report;
