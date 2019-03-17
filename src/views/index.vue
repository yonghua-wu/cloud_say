<template>
  <div>
    <div class="menu">
      <img @click="showLeftBar=true" class="cursor-pointer" src="../images/menu.png">
    </div>
    <div class="container">
      <div class="left-bar" :class="{'show-left-bar': showLeftBar}">
        <div class="city-group">
          <div class="city-name" v-for="(item, index) in cityList" :key="index">
            <div class="del cursor-pointer" @click="selectCity(item.adcode)"></div>
            <div class="name cursor-pointer" @click="selectCity(item.adcode)">{{item.name}}</div>
            <div class="del cursor-pointer" @click="delCity(index)">×</div>
          </div>
          <div class="city-name" @click="addCity">
            <!-- <img class="plus" src="../images/plus.png" alt=""> -->
            <div class="del cursor-pointer"></div>
            <div class="name cursor-pointer">添加城市</div>
            <div class="del cursor-pointer"></div>
          </div>
        </div>
      </div>
      <div class="content" :class="{'hidden-content': showLeftBar}" @click="showLeftBar=false">
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
      <div class="right-bar"></div>
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
      },
      showLeftBar: false
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
    },
    addCity: function() {
      for(var i=0; i<this.cityList.length; i++) {
        if(this.cityList[i].adcode === this.lives.adcode) {
          return
        }
      }
      this.$store.commit('addCity', {
        adcode: this.lives.adcode,
        name: this.lives.city
      })
    },
    delCity: function(index) {
      console.log(index)
      this.$store.commit('delCity', index)
    },
    selectCity: function(adcode) {
      if (adcode === this.lives.adcode) {
        this.showLeftBar = false
        return
      }
      this.getWeatherData(adcode)
      this.showLeftBar = false
    }
  },
  computed: {
    ...mapState([
      'adcode',
      'cityList'
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
.container {
  display: flex;
  flex-direction: row;
  //height: 100%;
  .left-bar {
    width: 18%;
    height: 100vh;
    color: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-flow: wrap;
    .city-group {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      padding: 0px 20px;
      .city-name {
        width: 100%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        display: flex;
        flex-direction: row;
        &:first-child {
        margin-top: 30px;
        }
        &:last-child {
          margin-bottom: 30px;
        }
        .name {
          width: calc(100% - 52px);
          overflow: hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .del {
          font-size: 26px;
          width: 26px;
        }
      }
    }
  }
  .right-bar {
    width: 18%;
    max-width: 400px;
  }
  .content {
    flex: 1;
    .live {
      margin-top: 16vh;
      margin-bottom: 26vh;
      padding: 10px; 
      height: 26vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .big-font {
        font-weight: 500;
        font-size: 28px;
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
      max-width: 960px;
      margin: 0px auto 16vh auto;
      font-size: 16px;
      .day {
        height: 16vh;
        width: 33%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .week {
          padding: 0.8rem;
        }
        .temperature {
          padding: 0.6rem;
        }
        .weather {
          padding: 0.6rem;
        }
      }
    }
  }
}
// mobile
@media screen and (max-width: 959px) {
  .menu {
    img {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 28px;
      height: 28px;
    }
  }
  .container {
    .left-bar,.right-bar {
      display: none;
    }
    .left-bar {
      width: 65%;
      max-width: 250px;
      display: none;
      position: absolute;
      z-index: 10;
      box-shadow: 0px 0px 6px rgba(31, 31, 31, 0.2);
      background-color: #f9f9f9;
      color: #333;
    }
    .hidden-content {
      position: relative;
      z-index: 1;
      background-color: rgba(117, 117, 117, 0.74);
    }
    .show-left-bar {
      display: flex;
    }
  }
}
// pc
@media screen and (min-width: 960px) {
  .menu {
    img {
      display: none;
    }
  }
  .container {
    .left-bar {
      min-width: 250px;
      max-width: 400px;
      border-right: 1px solid rgba(41, 41, 41, 0.1);
      .city-group {
        .city-name {
          .del {
            opacity: 0;
          }
          &:hover {
            color: #000;
            .del {
              opacity: 1;
              &:hover {
                color: #e73f3f;
              }
            }
          }
        }
      }
      &:hover {
        background-color: rgba(177, 177, 177, 0.08);
      }
    }
  }
}
</style>