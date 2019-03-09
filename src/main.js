import Vue from 'vue'
import App from './app.vue'
import router from './router.js'
import store from './store.js'
// eslint-disable-next-line no-unused-vars
import axios from 'axios'

Vue.prototype.$http = axios.create({
  timeout: 10000
})

new Vue({
  router,
  store,
  el: '#root',
  render: h => h(App)
})