import Vue from 'vue'
import Router from 'vue-router'

import index from './views/index.vue'
import seach from './views/seach.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: index
    },
    {
      path: '/seach',
      component: seach
    }
  ]
})