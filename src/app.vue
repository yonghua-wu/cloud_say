<template>
  <div v-cloak>
    <div class="position">
      <img v-if="isLocation" src="./images/favicon.png" alt="">
    </div>
    <transition name="page">
      <router-view v-if="!isLocation" class="page"></router-view>
    </transition>
  </div>
</template>
<script>
import config from './config.js'
export default {
  data: function() {
    return {
      // 正在定位
      isLocation: true,
    }
  },
  mounted: function() {
    this.getLocation()
  },
  methods: {
    getLocation: function() {
      var that = this
      if (navigator.geolocation) {
        // 定位成功后的处理函数
        var updateLocation = function(position) {
          var longitude = position.coords.longitude
          var latitude = position.coords.latitude
          // 获取到GPS坐标就可以查询城市了
          that.getAdcodeFromGPS(longitude, latitude)
        }
        // 定位失败的处理函数
        var handleLocationError = function(error) {
          console.log(error)
          switch (error.code) {
            case 0:
              console.log('尝试获取您的位置信息时发生错误：' + error.messag)
              break
            case 1:
              console.log('用户拒绝了获取位置信息请求。')
              break
            case 2:
              console.log('浏览器无法获取您的位置信息。')
              break
            case 3:
              console.log('获取您位置信息超时。')
              break
          }
          // GPS坐标获取失败，使用IP定位
          that.getAdcodeFromIP()
        }
        // 开始定位
        navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError,{
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAcuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 30000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 1000
        })
      } else { 
        //不支持GPS定位，使用IP定位
        this.getAdcodeFromIP()
      }
    },
    getAdcodeFromIP: function() {
      var that = this
      this.$http.get('https://restapi.amap.com/v3/ip?key=' + config.GAODEKEY).then(res => {
        if(res.data.infocode === '10000' || res.data.infocode === 10000) {
          that.$store.commit('setAdcode', res.data.adcode)
        } else {
          console.log('通过IP获取adcode失败，infocode：', res.data.infocode)
          that.$router.push('/seach')
        }
        that.isLocation = false
      }).catch(() => {
        console.log('通过IP获取adcode失败，请求失败')
        that.$router.push('/seach')
        that.isLocation = false
      })
    },
    getAdcodeFromGPS: function(longitude, latitude) {
      var that = this
      longitude = String(parseInt(longitude*1000000)/1000000)
      latitude = String(parseInt(latitude*1000000)/1000000)
      console.log('longitude:', longitude, 'latitude', latitude)
      this.$http.get('https://restapi.amap.com/v3/geocode/regeo?key=' + config.GAODEKEY + '&location=' + longitude + ',' + latitude).then(res => {
        if(res.data.infocode === '10000' || res.data.infocode === 10000) {
          // 如果adcode为空，则通过IP定位
          if(res.data.regeocode.addressComponent.adcode.length === 0) {
            that.getAdcodeFromIP()
          } else {
            that.$store.commit('setAdcode', res.data.regeocode.addressComponent.adcode)
            that.isLocation = false
          }
        }
      }).catch(() => {
        console.log('通过GPS获取adcode失败，请求失败')
      })
    }
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
.page {
  position: absolute;
  width: 100%;
}
.page-enter-active, .page-leave-active {
  transition: opacity 300ms 100ms;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
.position {
  // 动画 1、关键帧名称，动画时间，动画过程效果
  animation: breathing 1000ms ease-in-out;
  // 反向播放
  animation-direction: alternate;
  // 重复播放
  animation-iteration-count: infinite;
  width: 100%;
  display:flex;
  justify-content: center;
  img {
    margin-top: calc(35vh - 100px);
    // box-shadow: 0px 0px 2px rgba(20, 20, 20, 0.3);
    filter: drop-shadow(0 0 2px rgba(43, 0, 43, 0.1));
    width: 101px;
    height: 101px;
  }
}
@keyframes breathing {
  100% {
    opacity: 0.1;
  }
  0% {
    opacity: 1;
  }
}
</style>

