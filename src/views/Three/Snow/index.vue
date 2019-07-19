<template>
  <div ref="snow" id="snow" touch-action="none"></div>
</template>

<script>
import Snow from "./snow";
export default {
  name: "snow",
  data() {
    return {
      snow: null,
    };
  },
  mounted() {
    this.snow = new Snow(this.$refs["snow"]);
  },
  destroyed() {
    this.snow.destroy();
  }
};
</script>

<style lang="less" scoped>
#snow {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

