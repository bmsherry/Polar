<template>
  <div>
    <House></House>
    <Input
      type="number"
      v-model="inputScore"
      placeholder="请输入分数0-99"
      style="width: 300px"
      @on-enter="enterScore"
    />
    <Sherry-DashBoard :score="score"></Sherry-DashBoard>
    <Sherry-Polar :datas="datas"></Sherry-Polar>
    <Sherry-PieCustomLabelLine :datas="labelLineDatas"></Sherry-PieCustomLabelLine>
    <Sherry-LineCustom></Sherry-LineCustom>
  </div>
</template>

<script>
import House from "@/components/House";
export default {
  name: "home",
  components: {
    House
  },
  data() {
    return {
      score: -1,
      inputScore: "",
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
  },
  methods: {
    enterScore() {
      this.score = parseInt(this.inputScore);
    }
  }
};
</script>

