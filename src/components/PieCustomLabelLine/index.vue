<template>
  <div id="sherryPieCustomLabelLine"></div>
</template>

<script>
import echarts from "echarts";
import { deepClone } from "@/assets/js/utils";
export default {
  name: "SherryPieCustomLabelLine",
  props: {
    datas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      startAngle: -Math.PI / 2 + (Math.PI * 5) / 12,
      center: { x: 250, y: 250 },
      chartOptions: {
        graphic: {
          elements: []
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "inside",
                fontSize: 14,
                fontWeight: "bold",
                color: "#fff",
                formatter: function(params) {
                  return params.data.percent;
                }
              }
            },
            startAngle: 15,
            labelLine: {
              normal: {
                show: false
              }
            },
            silent: true,
            data: []
          },
          {
            type: "pie",
            cursor: "default",
            label: {
              normal: {
                show: false
              }
            },
            startAngle: 15,
            labelLine: {
              normal: {
                show: false
              }
            },
            silent: true,
            tooltip: false,
            data: []
          }
        ]
      },
      radius: 131,
      OFFSET: 40,
      LINELENGTH: 80,
      FONTHEIGHT: 20
    };
  },
  mounted() {
    if (this.datas.length > 0) {
      this.init(this.datas);
    } else {
      this.startAngle = Math.PI / 4;
      this.init([{ value: 0, name: "", percent: "100%", key: "nodata" }]);
    }
  },
  methods: {
    init(datas) {
      this.chartOptions.series.forEach((serie, index) => {
        const data = deepClone(datas);
        let nodata = false;
        if (index === 0) {
          serie.data = data.map(val => {
            val.itemStyle = {
              color: this.getLinearColor(val.key),
              shadowBlur: 10,
              shadowOffsetX: 3,
              shadowColor: "rgba(0,120,213,0.21)"
            };
            if (val.key === "nodata") {
              nodata = true;
              val.itemStyle.shadowColor = "rgba(204,204,204,1)";
            }
            return val;
          });
          if (nodata) {
            serie.label.normal.show = false;
          }
          serie.radius = [this.radius - 74, this.radius - 17];
        } else {
          serie.data = data.map(val => {
            val.itemStyle = {
              color: this.getColor(val.key)
            };
            return val;
          });
          serie.radius = [this.radius - 3, this.radius - 0];
        }
      });
      this.setLabelAndLine(datas);
      this.addCircle();
      this.chart = echarts.init(
        document.getElementById("sherryPieCustomLabelLine")
      );
      this.chart.setOption(this.chartOptions);
    },
    addCircle() {
      this.chartOptions.graphic.elements.push({
        type: "circle",
        shape: {
          cx: this.center.x,
          cy: this.center.y,
          r: 30
        },
        style: { stroke: "#efefef", fill: "#ffffff" },
        silent: true
      });
    },
    setLabelAndLine(data) {
      this.addPieLabel(data).forEach(label => {
        let offset = this.LINELENGTH;
        let left = label._router.x;
        if (label._side === "leftTop" || label._side === "leftEnd") {
          offset = -this.LINELENGTH;
          left = label._router.x + offset;
        }
        this.chartOptions.graphic.elements.push({
          type: "polyline",
          shape: {
            points: [
              [label._anchor.x, label._anchor.y],
              [label._router.x, label._router.y],
              [label._router.x + offset, label._router.y]
            ]
          },
          style: {
            lineWidth: 1,
            stroke: label.stroke
          },
          silent: true
        });

        this.chartOptions.graphic.elements.push({
          type: "text",
          left: left,
          top: label._router.y - this.FONTHEIGHT,
          style: {
            text:
              label._data.key === "nodata"
                ? `${label._data.value}条`
                : `${label._data.name}: ${label._data.value}条`,
            font: 'bold 14px "Microsoft YaHei"',
            fill: this.getColor(label._data.key)
          },
          silent: true
        });
      });
    },
    getEndPoint(center, angle, r) {
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      };
    },
    addPieLabel(data) {
      const halves = [];
      let angle = this.startAngle;
      const r = this.radius;
      for (let i = 0; i < data.length; i++) {
        const percent = parseFloat(data[i].percent) / 100;
        const targetAngle = angle + Math.PI * 2 * percent;
        const middleAngle = angle + (targetAngle - angle) / 2;
        angle = targetAngle;
        const edgePoint = this.getEndPoint(this.center, middleAngle, r);
        const routerPoint = this.getEndPoint(
          this.center,
          middleAngle,
          r + this.OFFSET
        );
        //label
        const label = {
          _anchor: edgePoint,
          _router: routerPoint,
          _data: data[i],
          x: routerPoint.x,
          y: routerPoint.y,
          r: r + this.OFFSET,
          stroke: "#aaaaaa"
        };
        // 判断文本的方向
        if (edgePoint.x <= this.center.x && edgePoint.y <= this.center.y) {
          label._side = "leftTop";
        } else if (
          edgePoint.x <= this.center.x &&
          edgePoint.y > this.center.y
        ) {
          label._side = "leftEnd";
        } else if (
          edgePoint.x > this.center.x &&
          edgePoint.y <= this.center.y
        ) {
          label._side = "rightTop";
        } else {
          label._side = "rightEnd";
        }

        halves.push(label);
      } // end of for
      // var maxCountForOneSide = parseInt(canvasHeight / LINEHEIGHT, 10);
      return halves;
    },
    getColor(key) {
      let color;
      switch (key) {
        case "prompt":
          color = "#0080E3";
          break;
        case "warning":
          color = "#FAC117";
          break;
        case "highrisk":
          color = "#FC433A";
          break;
        case "nodata":
          color = "#CCCCCC";
          break;
        default:
          break;
      }
      return color;
    },
    getLinearColor(key) {
      let color = {
        type: "linear"
      };
      switch (key) {
        case "prompt":
          color.colorStops = [
            {
              offset: 0,
              color: "#007FE0" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#4BB0FF" // 100% 处的颜色
            }
          ];
          break;
        case "warning":
          color.colorStops = [
            {
              offset: 0,
              color: "#FFD453" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#FFB400" // 100% 处的颜色
            }
          ];
          break;
        case "highrisk":
          color.colorStops = [
            {
              offset: 0,
              color: "#FF342A" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#FD7D77" // 100% 处的颜色
            }
          ];
          break;
        case "nodata":
          color.colorStops = [
            {
              offset: 0,
              color: "#CCCCCC" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#EEEEEE" // 100% 处的颜色
            }
          ];
          break;
        default:
          break;
      }
      return color;
    }
  }
};
</script>

<style scoped>
#sherryPieCustomLabelLine {
  width: 500px;
  height: 500px;
}
</style>


