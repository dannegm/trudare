import '@fortawesome/fontawesome-free/css/all.css';
import '@babel/polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueClipboard from 'vue-clipboard2';

import './plugins/vuetify';
import router from './router';
import App from './App.vue';

Vue.use (Vuex);
Vue.use (VueClipboard);
Vue.use (Vuetify, {
  iconfont: 'fa'
});

const store = new Vuex.Store ({
  state: {
    level: 3
  },
  mutations: {
    level (state, level) {
      state.level = level;
    }
  }
});

Vue.config.productionTip = false;

new Vue ({
  router,
  store,
  render: h => h (App)
}).$mount ('#app');