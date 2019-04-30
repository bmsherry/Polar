<template>
  <div class="polarbox">
    <div id="polar"></div>
    <div class="tooltip" :style="toolTipStyle">
      <div class="tooltip-title">{{toolTip.title}}</div>
      <div class="tooltip-list">
        <div>
          <span
            style="background-color:rgba(253,137,24,1);width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"
          ></span>
          <span
            class="tooltip-value"
            style="display: inline-block; float: right; margin-left: 30px;"
          >{{toolTip.value}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import zrender from "zrender";
export default {
  name: "SherryPolar",
  props: {
    datas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      zr: null,
      radius: 300,
      position: { x: 350, y: 350 },
      elementStyle: {
        stroke: "#ccc",
        lineDash: [3]
      },
      interval: 5,
      toolTip: {
        value: 0,
        title: ""
      },
      toolTipStyle: {
        left: 0,
        top: 0,
        visibility: "hidden"
      },
      barStyle: {
        normal: {
          fill: new zrender.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: "#FD8918" },
            { offset: 1, color: "#FFA853" }
          ])
        },
        emphasis: {
          fill: new zrender.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: "#fd9f42" },
            { offset: 1, color: "#ffb873" }
          ])
        }
      }
    };
  },
  mounted() {
    const container = document.getElementById("polar");
    this.zr = zrender.init(container);
    this.zr.add(
      this.addpolar({
        clockwise: true,
        startAngle: Math.PI,
        endAngle: (Math.PI * 3) / 2
      })
    );
  },
  methods: {
    intervalInstance(data) {
      const dataArr = [];
      this.datas.forEach(val => {
        dataArr.push(val.value);
      });
      let max = Math.max(...dataArr);
      if (max === 0) {
        return { interval: [1, 0], max: 1 };
      } else if (max < 4) {
        const arr = [];
        let copyMax = max;
        while (max >= 0) {
          arr.push(max);
          max--;
        }
        return { interval: arr, max: copyMax };
      }
      max = Math.round(
        Math.ceil(max / this.interval) + max - (max % this.interval)
      );
      const instance = Math.round(max / this.interval);
      const arr = [];
      for (let i = 0; i < this.interval + 1; i++) {
        arr.push(Math.round(max - instance * i));
      }
      return { interval: arr, max: max };
    },
    addpolar(shape) {
      let mergeShape = {
        clockwise: true,
        startAngle: 0,
        endAngle: Math.PI / 2
      };
      zrender.util.merge(mergeShape, shape, true);
      const self = this;
      const intervalInfo = this.intervalInstance(this.data);
      const group = new zrender.Group();
      const line1 = new zrender.Line({
        shape: {
          x1: this.position.x,
          y1: this.position.y - this.radius,
          x2: this.position.x,
          y2: this.position.y
        },
        cursor: "default",
        style: this.elementStyle
      });
      const lineStyle = {
        fill: "#aaaaaa"
      };
      const line2 = new zrender.Line({
        shape: {
          x1: this.position.x - this.radius,
          y1: this.position.y,
          x2: this.position.x,
          y2: this.position.y
        },
        cursor: "default",
        style: lineStyle
      });
      const len = this.datas.length;
      const intervalSpan = mergeShape.endAngle - mergeShape.startAngle;
      let angle = intervalSpan / len;
      let targetAngle = mergeShape.startAngle + angle / 2;
      for (let i = 0; i < len; i++) {
        group.add(
          new zrender.Line({
            shape: {
              x1: this.position.x,
              y1: this.position.y,
              x2: this.position.x + Math.cos(targetAngle) * this.radius,
              y2: this.position.y + Math.sin(targetAngle) * this.radius
            },
            cursor: "default",
            style: this.elementStyle
          })
        );
        group.add(
          new zrender.Line({
            shape: {
              x1: this.position.x + Math.cos(targetAngle) * this.radius,
              y1: this.position.y + Math.sin(targetAngle) * this.radius,
              x2: this.position.x + Math.cos(targetAngle) * (this.radius + 5),
              y2: this.position.y + Math.sin(targetAngle) * (this.radius + 5)
            },
            cursor: "default",
            style: lineStyle
          })
        );
        group.add(
          new zrender.Text({
            style: {
              text: this.datas[i].name,
              textDistance: 20
            },
            cursor: "default",
            position: [
              this.position.x + Math.cos(targetAngle) * (this.radius + 5) - 30,
              this.position.y + Math.sin(targetAngle) * (this.radius + 5) - 20
            ]
          })
        );
        targetAngle += angle;
      }
      const everyRInstance = this.radius / (intervalInfo.interval.length - 1);
      intervalInfo.interval.forEach((val, index) => {
        group.add(
          new zrender.Line({
            shape: {
              x1: this.position.x - this.radius + everyRInstance * index,
              y1: this.position.y,
              x2: this.position.x - this.radius + everyRInstance * index,
              y2: this.position.y + 5
            },
            cursor: "default",
            style: lineStyle
          })
        );
        group.add(
          new zrender.Text({
            style: {
              text: val,
              textDistance: 20
            },
            cursor: "default",
            position: [
              this.position.x - this.radius + everyRInstance * index - 5,
              this.position.y + 15
            ]
          })
        );
        group.add(
          new zrender.Arc({
            shape: {
              cx: this.position.x,
              cy: this.position.y,
              r: this.radius - everyRInstance * index,
              startAngle: mergeShape.startAngle,
              endAngle: mergeShape.endAngle,
              clockwise: mergeShape.clockwise
            },
            cursor: "default",
            style: this.elementStyle
          })
        );
      });
      const innerGroup = new zrender.Group();
      this.datas.forEach((val, index) => {
        innerGroup.add(
          new zrender.Sector({
            shape: {
              cx: this.position.x,
              cy: this.position.y,
              r: (val.value / intervalInfo.max) * this.radius,
              r0: 0,
              startAngle:
                mergeShape.startAngle + angle * index + (Math.PI * 1) / 360,
              endAngle:
                mergeShape.startAngle +
                angle * (index + 1) -
                (Math.PI * 1) / 360
            },
            style: {
              fill: this.barStyle.normal.fill
            },
            z: 100,
            data: val,
            index: index
          })
        );
        group.add(
          new zrender.Text({
            style: {
              text:
                (val.value / intervalInfo.max) * this.radius - 5 > 20
                  ? val.value
                  : "",
              textFill: "#ffffff"
            },
            cursor: "default",
            position: [
              this.position.x +
                Math.cos(
                  mergeShape.startAngle +
                    angle * (index + 1 / 2) -
                    (Math.PI * 2) / 360
                ) *
                  ((val.value / intervalInfo.max) * this.radius - 5) +
                3,
              this.position.y +
                Math.sin(
                  mergeShape.startAngle +
                    angle * (index + 1 / 2) -
                    (Math.PI * 2) / 360
                ) *
                  ((val.value / intervalInfo.max) * this.radius - 5)
            ],
            z: 101
          })
        );
      });
      const hoverGroup = new zrender.Group()
        .on("mousemove", function(event) {
          self.toolTip.title = event.target.data.name;
          self.toolTip.value = event.target.data.value;
          self.toolTipStyle = {
            left: `${event.offsetX + 30}px`,
            top: `${event.offsetY + 30}px`,
            visibility: "visible"
          };
          innerGroup._children[event.target.index].attr({
            style: { fill: self.barStyle.emphasis.fill }
          });
        })
        .on("mouseout", function(event) {
          self.toolTipStyle.visibility = "hidden";
          innerGroup._children[event.target.index].attr({
            style: { fill: self.barStyle.normal.fill }
          });
        });
      this.datas.forEach((val, index) => {
        hoverGroup.add(
          new zrender.Sector({
            shape: {
              cx: this.position.x,
              cy: this.position.y,
              r: this.radius,
              r0: 0,
              startAngle: mergeShape.startAngle + angle * index,
              endAngle: mergeShape.startAngle + angle * (index + 1)
            },
            invisible: true,
            z: 101,
            data: val,
            index: index
          })
        );
      });
      group.add(hoverGroup);
      group.add(innerGroup);
      group.add(line1);
      group.add(line2);
      return group;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.polarbox {
  position: relative;
}
#polar {
  width: 400px;
  height: 400px;
}
.tooltip {
  background: #ffffff;
  border-radius: 5px;
  transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  position: absolute;
  padding: 5px;
}
.tooltip > .tooltip-title {
  text-align: left;
}
</style>
