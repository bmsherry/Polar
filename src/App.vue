<template>
  <div id="app">
    <Sherry-Polar :datas="datas"></Sherry-Polar>
    <Sherry-PieCustomLabelLine :datas="labelLineDatas"></Sherry-PieCustomLabelLine>
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
      ],
      labelLineDatas: [   
        { value: 20, name: "警告", percent: "20%", key: "warning" },
        { value: 10, name: "高风险", percent: "10%", key: "highrisk" },
        { value: 70, name: "提示", percent: "70%", key: "prompt" }
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
