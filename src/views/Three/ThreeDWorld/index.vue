<template>
  <div ref="threedworld" id="threedworld"></div>
</template>

<script>
import ThreeDWorld from "./threedworld";
export default {
  name: "threedworld",
  data() {
    return {
      threedworld: null
    };
  },
  mounted() {
    this.threedworld = new ThreeDWorld(this.$refs["threedworld"]);
  },
  destroyed() {
    this.threedworld.destroy();
  }
};
</script>

<style lang="less" scoped>
#threedworld {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

