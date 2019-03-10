<template>
  <div>
    <div class="live">
      <div class="big-font">{{ lives.city || '定位中' }}</div>
      <div class="big-font">
        <span @click="unitConversion" class="">{{ temperature || '--' }}</span>
        <span @click="unitConversion" class="temperature">{{ defaultUnit==='c' ? '℃' : '℉' }}</span>
      </div>
      <div class="big-font">{{ lives.weather || '--' }}</div>
    </div>
    <div class="forecast">
      <div class="day">
        <div class="week">星期一</div>
        <div class="temperature">18-25</div>
        <div class="weather">多云</div>
      </div>
      <div class="day">
        <div class="week">星期一</div>
        <div class="temperature">18-25</div>
        <div class="weather">晴</div>
      </div>
      <div class="day">
        <div class="week">星期一</div>
        <div class="temperature">18-25</div>
        <div class="weather">晴</div>
      </div>
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
      forecasts: {},
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
      // 通过城市编码获取实时天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=base&city=' + that.adcode).then(res => {
        if(res.data.infocode === '10000') {
          that.lives = res.data.lives[0]
          that.fahrenheit.livesTemperature = that.CtoF(res.data.lives[0].temperature)
        }
      }).catch(() => {
        console.log('获取实时天气失败')
      })
      // 通过城市编码获取预报天气
      that.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?key='+ config.GAODEKEY +'&extensions=all&city=' + that.adcode).then(res => {
        if(res.data.infocode === '10000') {
          that.forecasts = res.data.forecasts[0]
          for(var i=0; i<that.forecasts.casts.length; i++) {
            var daytemp = that.CtoF(that.forecasts.casts[i].daytemp)
            var nighttemp = that.CtoF(that.forecasts.casts[i].nighttemp)
            that.fahrenheit.forecastsTemperature.push({
              'daytemp': daytemp,
              'nighttemp': nighttemp
            })
          }
        }
      }).catch(() => {
        console.log('获取预报天气失败')
      })
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
          return '星期一'
        case '2':
        case 2: 
          return '星期二'
        case '3':
        case 3: 
          return '星期三'
        case '4':
        case 4: 
          return '星期四'
        case '5':
        case 5: 
          return '星期五'
        case '6':
        case 6: 
          return '星期六'
        case '7':
        case 7: 
          return '星期日'
      }
    }
  },
  computed: {
    temperature: function() {
      if (this.defaultUnit === 'f') {
        return parseInt(this.lives.temperature*1.8)+32
      } else {
        return this.lives.temperature
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$marginTop: 16vh;
.live {
  margin-top: $marginTop;
  width: 100%;
  margin-bottom: 20vh;
  .big-font {
    font-weight: 500;
    padding: 0.8rem;
    font-size: 3rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    .temperature {
      font-size: 1.5rem;
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
  font-size: 1.4rem;
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

