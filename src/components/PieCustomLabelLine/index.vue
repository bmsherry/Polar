<template>
  <div id="sherryPieCustomLabelLine"></div>
</template>

<script>
import echarts from "echarts";
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
      startAngle: -Math.PI / 2,
      center: { x: 250, y: 250 },
      chartOptions: {
        tooltip: {
          show: false,
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        graphic: {
          elements: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: function(params) {
                  return params.data.percent;
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            tooltip: {
              show: true,
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            data: []
          },
          {
            name: "访问来源",
            type: "pie",
            cursor: "default",
            label: {
              normal: {
                show: false
              }
            },
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
      radius: 100,
      OFFSET: 40,
      LINELENGTH: 80,
      FONTHEIGHT: 20
    };
  },
  mounted() {
    this.chartOptions.series.forEach((serie, index) => {
      serie.data = this.datas;
      if (index === 0) {
        serie.radius = [this.radius - 50, this.radius - 20];
      } else {
        serie.radius = [this.radius - 10, this.radius - 0];
      }
    });
    this.setLabelAndLine(this.datas);
    this.chart = echarts.init(
      document.getElementById("sherryPieCustomLabelLine")
    );
    this.chart.setOption(this.chartOptions);
  },
  methods: {
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
            text: `${label._data.name}: ${label._data.value}`
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


