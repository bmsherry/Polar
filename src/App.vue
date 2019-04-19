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
        { value: 10, name: "直接访问", percent: "10%" },
        { value: 20, name: "邮件营销", percent: "20%" },
        { value: 30, name: "联盟广告", percent: "30%" },
        { value: 40, name: "测试", percent: "40%" }
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
