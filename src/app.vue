<template>
  <div v-cloak class="bg-theme">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
}
</script>

<style lang="scss">
html, body, p, h1, h2, h3, h4, h5, h6 {
  margin: 0px;
  padding: 0px;
}
[v-cloak] {
  display: none;
}
body {
  background-color: #f9f9f9;
}
</style>

