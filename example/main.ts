import Vue from 'vue'
import App from './App.vue'
import EwanAdmin from '@ewan/ewan-admin';
import '@ewan/ewan-admin/dist/ewan-admin.css';
import EwanUI from '@ewan/ewan-ui';
import '@ewan/ewan-ui/lib/theme-chalk/index.css'
import * as PageHelper from '../src';
import '../src/styles/index.scss'
import store from './store/index.js';
import router, {asyncRouterMap, constantRouterMap} from './router/index.js';

Vue.config.productionTip = false

PageHelper.install(Vue);

Vue.use(EwanUI, {size: 'mini'});

Vue.use(EwanAdmin, {
  appID: 185,
  systemCode: 'ads',
  systemName: 'ADS',
  systemCName: '广告营销中心',
  store,
  router,
  constantRouterMap,
  asyncRouterMap,
  // appBaseApi: process.env.VUE_APP_BASE_API,
  // adminAssets
})

new Vue({
  render: h => h(App),
}).$mount('#app')
