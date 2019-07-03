<template>
  <div class="ruler">
    <div class="top">
      <div>差</div>
      <div>一般</div>
      <div>优秀</div>
    </div>
    <div class="middle">
      <div class="box" :style="color('bad')"></div>
      <div class="box" :style="color('general')"></div>
      <div class="box" :style="color('excellent')"></div>
    </div>
    <div class="bottom">
      <div>0</div>
      <div>30</div>
      <div>80</div>
      <div>100</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Ruler",
  data() {
    return {
      colorSelectObj: {
        bad: "#EE6342",
        general: "#4FBF67",
        excellent: "#487ACB"
      }
    };
  },
  methods: {
    color(key) {
      return { borderBottomColor: this.colorSelectObj[key] };
    }
  }
};
</script>

<style lang="less" scoped>
.ruler {
  cursor: default;
  .top {
    display: flex;
    height: 22px;
    font-weight: bold;
    font-size: 14px;
    color: #ffffff;
    margin-left: 5px;
    margin-right: 5px;
    > div {
      &:first-child {
        width: 60px;
        background: #ee6342;
      }
      &:nth-child(2) {
        width: 100px;
        background: #4fbf67;
      }
      &:nth-child(3) {
        width: 40px;
        background: #487acb;
      }
    }
  }
  .middle {
    display: flex;
    .box {
      width: 0px;
      height: 0px;
      border-top: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 3px solid transparent;
      &:nth-child(1) {
        margin-right: 55px;
      }
      &:nth-child(2) {
        margin-right: 95px;
      }
    }
  }
  .bottom {
    font-size: 14px;
    color: #666666;
    display: flex;
    > div {
      &:nth-child(1) {
        margin-right: 50px;
      }
      &:nth-child(2) {
        margin-right: 85px;
      }
      &:nth-child(3) {
        margin-right: 15px;
      }
    }
  }
}
</style>


