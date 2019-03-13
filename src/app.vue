<template>
  <div v-cloak>
    <router-view></router-view>
  </div>
</template>
<script>
import config from './config.js'
export default {
  mounted: function() {
    var that = this
    this.$http.get('https://restapi.amap.com/v3/ip?key=' + config.GAODEKEY).then(res => {
      if(res.data.infocode === '10000' || res.data.infocode === 10000) {
        that.$store.commit('setAdcode', res.data.adcode)
      }
    }).catch(() => {
      console.log('获取城市编码失败')
    })
  }
}
</script>

<style lang="scss">
html, body, p, h1, h2, h3, h4, h5, h6, span {
  margin: 0px;
  padding: 0px;
}
body {
  background-color: #f9f9f9;
  color: rgba(20, 20, 20, 0.95);
}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.cursor-pointer {
  cursor: pointer;
}
[v-cloak] {
  display: none;
}
</style>

