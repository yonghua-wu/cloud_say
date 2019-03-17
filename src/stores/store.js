import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 温度单位
    temperatureUnit: 'c',
    // 城市编码
    adcode: '',
    // index页面的数据
    indexData: null,
    cityList: [{name: '长沙', adcode: '430000'},{name: '广州', adcode: '430000'},{name: '上海', adcode: '430000'}]
  },
  mutations: {
    // 设置adcode城市编码
    setAdcode: function(state, payload) {
      state.adcode = payload
    },
    // 保存index页面数据
    storeIndexData: function(state, payload) {
      state.indexData = payload
    },
    // 清除index页面数据
    clearIndexData: function(state) {
      state.indexData = null
    },
    setCityList: function(state, payload) {
      state.cityList = payload
    },
    addCity: function(state, payload) {
      state.cityList.push(payload)
      localStorage.setItem('cityList', JSON.stringify(state.cityList))
    },
    delCity: function(state, payload) {
      state.cityList.splice(payload, 1)
      localStorage.setItem('cityList', JSON.stringify(state.cityList))
    }
  }
})