import { defineConfig } from 'umi';
const px2rem = require('postcss-px2rem');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [
    px2rem({
      remUnit: 75, //基准大小 baseSize，需要和rem.js中相同
    }),
  ],
  routes: [{ path: '/h5sdk', component: '@/pages/index' }],
});
