<template>
  <div>
    <button @click='getLoction'>按钮</button>
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  methods: {
    getLoction: function() {
      var that = this
      console.log('click')
      if (!navigator.geolocation){
        return
      }
      navigator.geolocation.getCurrentPosition(position => {
        that.msg = position.coords.longitude + ';' + position.coords.latitude
      }, () => {
        that.msg = '地理位置获取失败'
      }, {
        enableHighAccuracy: false,
        timeout: 5000,
      })
    }
  }
}
</script>

