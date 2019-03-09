<template>
  <div>
    <div class="main-info">
      <h1>{{ lives.city || '定位中' }}</h1>
      <h1>{{ lives.temperature || '--' }}℃</h1>
      <h1>{{ lives.weather || '--' }}</h1>
    </div>
  </div>
</template>

<script>
import config from '../config.js'
export default {
  data() {
    return {
      // 城市编码
      adcode: '431000',
      // 实时天气
      lives: {},
      // 预报天气
      forecasts: {}
    }
  },
  mounted: function() {
    let that = this
    //获取当前IP的城市编码
    this.$http.get('https://restapi.amap.com/v3/ip?key=' + config.GAODEKEY).then(res => {
      if(res.data.infocode === '10000') {
        that.adcode = res.data.adcode
      }
      // 通过城市编码获取实时天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=base&city=' + that.adcode).then(res => {
        if(res.data.infocode === '10000') {
          that.lives = res.data.lives[0]
        }
      }).catch(() => {
        console.log('获取实时天气失败')
      })
      // 通过城市编码获取预报天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=all&city=' + that.adcode).then(res => {
        if(res.data.infocode === '10000') {
          that.forecasts = res.data.forecasts[0]
        }
      }).catch(() => {
        console.log('获取预报天气失败')
      })
    }).catch(() => {
      console.log('获取城市编码失败')
    })
  },
  methods: {
    
  }
}
</script>
<style lang="scss" scoped>
$marginTop: 16vh;
.main-info {
  margin-top: $marginTop;
  width: 100%;
  text-align: center;
  h1 {
    padding: 1.5vh;
  }
}
</style>

