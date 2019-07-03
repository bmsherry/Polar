<template>
  <div class="dashboard">
    <DashBoardMain :score="score"></DashBoardMain>
    <Ruler class="ruler-container"></Ruler>
  </div>
</template>

<script>
import DashBoardMain from "./DashBoardMain";
import Ruler from "./Ruler";
export default {
  name: "SherryDashBoard",
  components: {
    DashBoardMain,
    Ruler
  },
  props: {
    score: {
      type: Number
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard {
  height: 400px;
  width: 1200px;
  position: relative;
  background: linear-gradient(
    -45deg,
    rgba(216, 228, 250, 1) 0%,
    rgba(245, 248, 255, 0.3) 100%
  );
  .ruler-container {
    position: absolute;
    right: 142px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>



