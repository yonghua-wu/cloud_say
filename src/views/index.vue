<template>
  <div>
    <div class="live">
      <div class="big-font">{{ lives.city || '定位中' }}</div>
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
      <!-- <div class="day">
        <div class="week">{{ forecasts.casts[2].week }}</div>
        <div class="temperature">{{temperature.forecastsTemperature[2].nighttemp}}°-{{temperature.forecastsTemperature[2].daytemp}}°</div>
        <div class="weather">{{forecasts.casts[2].dayweather}}</div>
      </div>
      <div class="day">
        <div class="week">{{ forecasts.casts[3].week }}</div>
        <div class="temperature">{{temperature.forecastsTemperature[3].nighttemp}}°-{{temperature.forecastsTemperature[3].daytemp}}°</div>
        <div class="weather">{{forecasts.casts[3].dayweather}}</div>
      </div> -->
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
    let that = this
    //获取当前IP的城市编码
    this.$http.get('https://restapi.amap.com/v3/ip?key=' + config.GAODEKEY).then(res => {
      if(res.data.infocode === '10000') {
        that.adcode = res.data.adcode
      }
      that.getWeatherData(that.adcode)
    }).catch(() => {
      console.log('获取城市编码失败')
    })
  },
  methods: {
    // 切换温度的单位
    unitConversion: function () {
      this.defaultUnit = this.defaultUnit==='c'?'f':'c'
    },
    // 摄氏度转华氏度
    CtoF: function (c) {
      return parseInt(c * 1.8) + 32
    },
    // 将数字星期数转为汉字
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
    getWeatherData: function(adcode) {
      var that = this
      // 通过城市编码获取实时天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=base&city=' + adcode).then(res => {
        if(res.data.infocode === '10000') {
          that.lives = res.data.lives[0]
          that.fahrenheit.livesTemperature = that.CtoF(res.data.lives[0].temperature)
        }
      }).catch(() => {
        console.log('获取实时天气失败')
      })
      // 通过城市编码获取预报天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=all&city=' + adcode).then(res => {
        if(res.data.infocode === '10000') {
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
    }
  },
  computed: {
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
  }
}
</script>
<style lang="scss" scoped>
.live, .forecast {
  color: rgba(20, 20, 20, 0.95);
}
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