import Vue from 'vue'
import App from './App.vue'
import * as PageHelper from '../src';
// import VideoPlayer from '../dist';
// import '../dist/index.css';

Vue.config.productionTip = false

PageHelper.installAll(Vue);

new Vue({
  render: h => h(App),
}).$mount('#app')
