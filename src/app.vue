<template>
  <div v-cloak>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
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

