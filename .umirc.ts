import { defineConfig } from 'umi';
const px2rem = require('postcss-px2rem');

// icon
const iconLink = 'https://static.52ywan.com/favicon.ico';

export default defineConfig({
  dva: {
    immer: true,
    hmr: false,
    skipModelValidate: true,
  },
  title: 'JHdebugDemo',
  links: [{ rel: 'icon', href: iconLink }],
  nodeModulesTransform: {
    type: 'none',
  },
  extraPostCSSPlugins: [
    px2rem({
      remUnit: 75, //基准大小 baseSize，需要和rem.js中相同
    }),
  ],
  routes: [
    {
      path: '/h5sdk',
      component: '@/pages/index',
      routes: [
        {
          path: 'login',
          component: '@/pages/login/index',
        },
        {
          path: 'register',
          component: '@/pages/register/index',
        },
      ],
    },
  ],
});
