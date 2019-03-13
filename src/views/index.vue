<template>
  <div>
    <div class="live">
      <div class="big-font">
        <div class="cursor-pointer" @click="toSeachPage">{{ lives.city || '--'}}</div>
      </div>
      <div class="big-font">
        <span @click="unitConversion" class="">{{ temperature.livesTemperature || '--' }}</span>
        <span @click="unitConversion" class="temperature">{{ defaultUnit==='c' ? '℃' : '℉' }}</span>
      </div>
      <div class="big-font">{{ lives.weather || '--' }}</div>
    </div>
    <div class="forecast">
      <div class="day" v-for="(item, index) in forecastsList" :key="index">
        <div class="week">{{ item.week }}</div>
        <div class="temperature">{{temperature.forecastsTemperature[index].nighttemp}}°-{{temperature.forecastsTemperature[index].daytemp}}°</div>
        <div class="weather">{{item.dayweather}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import config from '../config.js'
export default {
  data() {
    return {
      // 实时天气
      lives: {},
      // 预报天气
      forecasts: {
        casts: []
      },
      // 温度单位
      defaultUnit: 'c',
      // 华氏温度
      fahrenheit: {
        livesTemperature: null,
        forecastsTemperature: []
      }
    }
  },
  mounted: function() {
    // 如果缓存中的indexData数据没有被清除，表示没有在搜索页中选择城市，恢复上次数据
    if(this.$store.state.indexData !== null) {
      this.lives = this.$store.state.indexData.lives
      this.forecasts = this.$store.state.indexData.forecasts
      this.fahrenheit = this.$store.state.indexData.fahrenheit
    } else if(this.$store.state.adcode !== '') {
      //在搜索页中选择了城市，这时不会触发侦听器所以需要在这里调用获取天气
      this.getWeatherData(this.$store.state.adcode)
    }
  },
  methods: {
    /**
     * 切换温度的单位
     */
    unitConversion: function () {
      this.defaultUnit = this.defaultUnit==='c'?'f':'c'
    },
    /**
     * 摄氏度转华氏度
     * @param {int} c 摄氏度
     * @return {int} 华氏度
     */
    CtoF: function (c) {
      return parseInt(c * 1.8) + 32
    },
    /**
     * 将数字星期数转为汉字
     * @param {int, string} week
     * @returns {string}
     */
    weekNumToWord: function(week) {
      switch(week) {
        case '1':
        case 1: 
          return '周一'
        case '2':
        case 2: 
          return '周二'
        case '3':
        case 3: 
          return '周三'
        case '4':
        case 4: 
          return '周四'
        case '5':
        case 5: 
          return '周五'
        case '6':
        case 6: 
          return '周六'
        case '7':
        case 7: 
          return '周日'
      }
    },
    /**
     * 获取adcode城市的天气情况
     * @param {string} adcode
     */
    getWeatherData: function(adcode) {
      var that = this
      // 通过城市编码获取实时天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=base&city=' + adcode).then(res => {
        if(res.data.infocode === '10000' || res.data.infocode === 10000) {
          that.lives = res.data.lives[0]
          that.fahrenheit.livesTemperature = that.CtoF(res.data.lives[0].temperature)
        }
      }).catch(() => {
        console.log('获取实时天气失败')
      })
      // 通过城市编码获取预报天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=all&city=' + adcode).then(res => {
        if(res.data.infocode === '10000' || res.data.infocode === 10000) {
          that.forecasts = res.data.forecasts[0]
          for(var i=0; i<that.forecasts.casts.length; i++) {
            var daytemp = that.CtoF(that.forecasts.casts[i].daytemp)
            var nighttemp = that.CtoF(that.forecasts.casts[i].nighttemp)
            that.forecasts.casts[i].week = that.weekNumToWord(that.forecasts.casts[i].week)
            that.fahrenheit.forecastsTemperature.push({
              'daytemp': daytemp,
              'nighttemp': nighttemp
            })
          }
        }
      }).catch(() => {
        console.log('获取预报天气失败')
      })
    },
    /**
     * 
     */
    toSeachPage: function() {
      this.$store.commit('storeIndexData', {
        lives: this.lives,
        forecasts: this.forecasts,
        fahrenheit: this.fahrenheit
      })
      this.$router.push('seach')
    }
  },
  computed: {
    ...mapState([
      'adcode'
    ]),
    temperature: function() {
      if (this.defaultUnit === 'f') {
        return this.fahrenheit
      } else {
        return {
          livesTemperature: this.lives.temperature,
          forecastsTemperature: this.forecasts.casts
        }
      }
    },
    forecastsList: function () {
      return this.forecasts.casts.slice(1, this.forecasts.casts.length)
    }
  },
  watch: {
    // 当adcode的内容改变时（在刚进页面时会调用）
    adcode: function() {
      this.getWeatherData(this.$store.state.adcode)
    }
  }
}
</script>
<style lang="scss" scoped>
.live {
  margin-top: 16vh;
  width: 100%;
  margin-bottom: 28vh;
  
  .big-font {
    font-weight: 500;
    padding: 0.8rem;
    font-size: 30px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    input {
      border: none;
      padding: 0px;
      margin: 0px;
      background-color: unset;
      text-align: center;
      outline: 0;
    }
    .temperature {
      font-size: 14px;
    }
    span {
      cursor: pointer;
    }
  }
}
.forecast {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10vh;
  font-size: 16px;
  .day {
    height: 20vh;
    width: 33%;
    text-align: center;
    .week {
      padding: 0.6rem;
    }
    .temperature {
      padding: 0.6rem;
    }
    .weather {
      padding: 0.6rem;
    }
  }
}
</style>