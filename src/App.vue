<template>
  <div id="app">
    <Sherry-Polar :datas="datas"></Sherry-Polar>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      datas: [
        { value: 12, name: "测试1" },
        { value: 5, name: "测试2" },
        { value: 52, name: "测试3" },
        { value: 0, name: "测试4" }
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
