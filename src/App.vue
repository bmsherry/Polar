<template>
  <div id="app">
    <Polar/>
  </div>
</template>

<script>
import Polar from "./components/Polar.vue";

export default {
  name: "app",
  components: {
    Polar
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
