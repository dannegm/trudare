import Vue from 'vue';
import Router from 'vue-router';

import Cards from './views/Cards';
import List from './views/List';
import About from './views/About';

Vue.use (Router);

export default new Router ({
  routes: [
    {
      path: '/',
      name: 'cards',
      component: Cards
    },
    {
      path: '/cards/:uuid',
      name: 'cards',
      component: Cards
    },
    {
      path: '/list',
      name: 'list',
      component: List
    },
  ]
});
