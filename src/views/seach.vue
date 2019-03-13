<template>
  <div class="container">
    <input v-model="seachText" type="text" size="15" placeholder="输入城市名称" autofocus="autofocus">
    <div class="city-item" v-for="(item, index) in cityList" :key="index" @click="selectedCity(index)">
      {{item.name}}
    </div>
  </div>
</template>

<script>
import config from '../config.js'
var timing = null
export default {
  data: function () {
    return {
      cityList: [],
      seachText: ''
    }
  },
  watch: {
    seachText: function() {
      if (this.seachText === '') {
        if (timing != null) {
          clearTimeout(timing)
          timing = null
        }
        this.cityList = []
        return
      }
      this.cityList = [{name: '搜索中...'}]
      var that = this
      if (timing != null) {
        clearTimeout(timing)
        timing = null
      }
      timing = setTimeout(function(){that.seachCity(that.seachText)}, 1500)
    }
  },
  methods: {
    /**
     * 根据输入内容搜索城市
     * @param {string} input
     */
    seachCity: function(input) {
      console.log('seacing')
      var that = this
      this.cityList = []
      this.$http.get('https://restapi.amap.com/v3/config/district?key=' + config.GAODEKEY + '&keywords=' + input +'&subdistrict=2&extensions=base').then(res => {
        if (res.data.infocode === '10000' || res.data.infocode === 10000) {
          var seachResult = res.data.districts
          // 如果只有一条结果
          if (seachResult.length === 1) {
            // 同时该地区等级为‘city’（市）或‘district’ （区乡镇）
            if (seachResult[0].level === 'city' || seachResult[0].level === 'district') {
              // 直接显示这条结果
              that.cityList = [{
                adcode: seachResult[0].adcode,
                name: seachResult[0].name
              }]
            // 同时该地区等级为‘province’ （省份）
            } else if (seachResult[0].level === 'province') {
              // 显示下一级地区
              that.cityList = seachResult[0].districts
            } else {
              that.cityList = [{name: '未搜索到结果'}]
            }
          } else {
            that.cityList = seachResult
          }
        }
      })
    },

    selectedCity: function(index) {
      this.$store.commit('setAdcode', this.cityList[index].adcode)
      this.$store.commit('clearIndexData')
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
$color-theme: rgba(20, 20, 20, 0.95);
.container {
  input {
    outline: 0;
    border: 2px solid $color-theme;
    border-radius: 45px;
    height: 45px;
    padding: 8px 18px;
    font-size: 18px;
    background-color: unset;
    margin-bottom: 10px;
  }
  .city-item {
    height: 55px;
    padding: 15px 10px;
    margin: 0px 8px;
    border-bottom: 1px solid rgba(221, 221, 221, 0.76);
    font-size: 18px;
    &:last-child {
      margin-bottom: 60px;
    }
  }
}
//mobile
@media screen and (max-width: 959px) {
  .container {
    width: calc(100% - 30px);
    margin: 20px 15px auto 15px;
    input {
      width: 100%;
    }
    .city-item {
      width: calc(100% - 16px);
      &:active {
        background-color: rgba(220, 220, 220, 0.514);
      }
    }
  }
}

//pc
@media screen and (min-width: 960px) {
  .container {
    width: calc(100% - 80px);
    margin: 40px 40px auto 40px;
    display: flex;
    flex-direction: column;
    //justify-content: center;
    align-items: center;
    input {
      width: 500px;
    }
    .city-item {
      width: 484px;
      cursor: pointer;
      &:hover {
        background-color: rgba(220, 220, 220, 0.356)
      }
    }
  }
}
</style>

