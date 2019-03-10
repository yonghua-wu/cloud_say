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
html {
  font-size: 100%;
}
body {
  background-color: #f9f9f9;
  box-sizing:border-box;
}
[v-cloak] {
  display: none;
}
</style>

