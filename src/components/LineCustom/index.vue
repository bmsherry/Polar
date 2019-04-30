<template>
  <div id="linecustom"></div>
</template>

<script>
import { formatDate } from "@/assets/js/utils";
import echarts from "echarts";
const image = require("@/assets/image/button.png");
export default {
  name: "SherryLineCustom",
  data() {
    return {
      chart: null,
      mock: [
        { time: "2019-03-01", eventNum: 22 },
        { time: "2019-03-08", eventNum: 52 },
        { time: "2019-03-15", eventNum: 32 },
        { time: "2019-03-22", eventNum: 12 },
        { time: "2019-03-29", eventNum: 122 },
        { time: "2019-04-05", eventNum: 99 },
        { time: "2019-04-12", eventNum: 0 },
        { time: "2019-04-19", eventNum: 1 },
        { time: "2019-04-26", eventNum: 3 }
      ],
      chartOptions: {
        grid: {
          left: "100",
          right: "100",
          bottom: "100",
          top: "50",
          containLabel: true
        },
        xAxis: {
          type: "time",
          name: "测试1",
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#999999"
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            //坐标轴刻度标签的相关设置
            formatter: function(value) {
              return formatDate(value, "yyyy-MM-dd");
            },
            textStyle: {
              color: "#999999",
              margin: 15
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#999999"
            }
          }
        },
        yAxis: {
          name: "Y轴",
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#EAEAEA",
              type: "dotted"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#999999"
            }
          },
          axisLabel: {
            margin: 20,
            textStyle: {
              color: "#999999"
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#999999"
            }
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            realtime: true,
            labelFormatter: function(value) {
              return formatDate(value, "yyyy-MM-dd");
            },
            filterMode: "none",
            throttle: 0,
            backgroundColor: "#FFFFFF",
            fillerColor: "rgba(65,172,255,0.1)",
            borderColor: "rgba(234,234,234,1)",
            height: 16,
            minValueSpan: 3600 * 24 * 2000,
            bottom: 30,
            handleIcon: `image://${image}`,
            handleSize: "140%",
            handleStyle: {
              color: "#61BAFF",
              shadowBlur: 3,
              shadowColor: "rgba(179,222,255,1)",
              shadowOffsetX: 0,
              shadowOffsetY: 1
            },
            xAxisIndex: 0,
            fiterMode: "empty"
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              type: "dashed",
              color: "#239CFA"
            }
          },
          extraCssText: `background-color: #ffffff;
          box-shadow:0px 2px 7px 1px rgba(102,102,102,0.3);
          opacity:0.95;
          border-radius:5px;
          padding:10px 16px;`,
          formatter: function(params) {
            return `<div class="chart-tooltip">
            <div class="tootip-title">${params[0].data[0]}</div>
            <div class="space-between"><span><span class="with-dot"></span>事件数</span> <span>${
              params[0].data[1]
            }</span></div>
          </div>`;
          }
        },
        series: [
          {
            name: "测试",
            type: "line",
            smooth: true, //是否平滑曲线显示
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
              color: "#0080E3"
            },
            symbolSize: 9,
            itemStyle: {
              color: "#ffffff",
              borderColor: "#087ACA",
              borderWidth: 1
            },
            lineStyle: {
              normal: {
                color: "#239CFA", // 线条颜色
                width: 3,
                shadowColor: "rgba(51,51,51,0.15)", //阴影颜色
                shadowBlur: 3,
                shadowOffsetY: 3
              }
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    { offset: 0, color: "rgba(195,229,255,1)" },
                    { offset: 1, color: "rgba(207,235,255,0)" }
                  ],
                  false
                )
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    setOptions() {
      if (this.mock.length > 0) {
        this.chartOptions.dataZoom[0].startValue = this.mock[
          this.mock.length - 6 >= 0 ? this.mock.length - 6 : 0
        ].time;
        this.chartOptions.dataZoom[0].endValue = this.mock[
          this.mock.length - 1
        ].time;
        this.chartOptions.xAxis.min = this.mock[0].time;
        this.chartOptions.xAxis.max = this.mock[this.mock.length - 1].time;
        this.chartOptions.xAxis.interval = 3600 * 24 * 7000;
      }
      this.chartOptions.series[0].data = this.mock.map(val => [
        val.time,
        val.eventNum
      ]);
    },
    init() {
      this.setOptions();
      this.chart = echarts.init(document.getElementById("linecustom"));
      this.chart.setOption(this.chartOptions);
    }
  }
};
</script>

<style>
#linecustom {
  width: 1000px;
  height: 500px;
}
#linecustom .chart-tooltip {
  /* max-width: 168px; */
  white-space: normal;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}
#linecustom .chart-tooltip .space-between {
  display: flex;
  justify-content: space-between;
}
#linecustom .chart-tooltip .space-between .tootip-title {
  line-height: 15px;
  margin-bottom: 4px;
}
#linecustom .chart-tooltip .space-between .with-dot::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #0080e3;
  margin-right: 5px;
  margin-bottom: 1px;
}
</style>


