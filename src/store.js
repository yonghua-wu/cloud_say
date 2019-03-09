import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    latitude: 0,
    longitude: 0,
    country: ''
  }
})