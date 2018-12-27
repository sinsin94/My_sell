// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import sellers from './components/sellers/sellers.vue';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/sellers', component: sellers}
];
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});
/* eslint-disable no-new */
let vue = new Vue({
  template: '<App/>',
  router, // 把声明的router对象作为参数传给vue对象
  components: { App } // 组册组件，这里是一个es6的缩写方法，相当于components:{App:App}
});
vue.$mount('#app'); // 把vue挂载到dom上
router.push('/goods');
