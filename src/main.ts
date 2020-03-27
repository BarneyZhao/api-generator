import Vue from 'vue';
import './styleLib';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.prototype.$IS_E = Boolean(window.require);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

declare module 'vue/types/vue' {
  interface Vue {
    $IS_E: boolean
  }
}
