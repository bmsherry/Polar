<template>
  <div class="dash-board-main">
    <div id="dash-board-main" ref="dash-board-main"></div>
    <div class="dash-board-bottom-text">
      <div>企业信用预期</div>
      <div :style="styleObject">{{this.bottomText}}</div>
    </div>
    <div class="dash-board-bottom-score">
      <div>该企业当前评分为</div>
      <div :style="styleObject">{{this.busScore|errorScoreFormat}}</div>
    </div>
  </div>
</template>

<script>
import TWEEN from "tween";
import zrender from "zrender";
export default {
  name: "DashBoardMain",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    // 企业分数
    score: {
      type: Number
    }
  },
  data() {
    return {
      drawGroup: null,
      requestAnimationFrameID: null,
      zInstance: null,
      zInstanceStyle: {
        width: 388,
        height: 388
      },
      lineWidth: 18,
      startAngle: Math.PI * 0.75,
      endAngle: Math.PI * 0.25,
      colorSelectObj: {
        bad: "#EE6342",
        general: "#4FBF67",
        excellent: "#487ACB"
      },
      textSelectObj: {
        bad: "差",
        general: "一般",
        excellent: "优秀"
      },
      boardSelectObj: {
        bad: new zrender.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: "#ee6342" },
          { offset: 1, color: "#fb8e74" }
        ]),
        general: new zrender.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: "#4fbf67" },
          { offset: 1, color: "#83ec9a" }
        ]),
        excellent: new zrender.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: "#3E72C7" },
          { offset: 1, color: "#72A2EF" }
        ])
      }
    };
  },
  computed: {
    styleObject() {
      return { color: this.colorSelectObj[this.chargeScore(this.busScore)] };
    },
    // 仪表盘企业信用预期文字
    bottomText() {
      if (this.busScore >= 0) {
        return this.textSelectObj[this.chargeScore(this.busScore)];
      } else {
        return "";
      }
    },
    busScore() {
      this.clearDrawGroup();
      if (this.zInstance && this.score >= 0) {
        this.drawScore(this.score);
      }
      return this.score;
    }
  },
  filters: {
    errorScoreFormat(value) {
      return value >= 0 ? value : "";
    }
  },
  mounted() {
    this.zInstance = zrender.init(this.$refs["dash-board-main"], {
      width: this.zInstanceStyle.width,
      height: this.zInstanceStyle.height
    });
    this.drawBottom();
    this.drawDashBoard();
  },
  destroyed() {
    if (this.requestAnimationFrameID) {
      const cancelAnimationFrame =
        window.cancelAnimationFrame || window.mozCancelAnimationFrame;
      if (cancelAnimationFrame)
        cancelAnimationFrame(this.requestAnimationFrameID);
    }
  },
  methods: {
    chargeScore(score) {
      let key = "general";
      if (score <= 30) {
        key = "bad";
      } else if (score > 30 && score < 80) {
        key = "general";
      } else {
        key = "excellent";
      }
      return key;
    },
    drawBottom() {
      const g = new zrender.Group();
      g.add(
        new zrender.Circle({
          cursor: "default",
          shape: {
            cy: this.zInstanceStyle.height / 2,
            cx: this.zInstanceStyle.width / 2,
            r:
              Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) /
                2 -
              8
          },
          style: {
            opacity: 0.7,
            fill: "#F7FAFF",
            shadowBlur: 10,
            shadowColor: "rgba(83,125,187,0.19)"
          }
        })
      );
      g.add(
        new zrender.Circle({
          cursor: "default",
          shape: {
            cy: this.zInstanceStyle.height / 2,
            cx: this.zInstanceStyle.width / 2,
            r:
              Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) /
                2 -
              35
          },
          style: {
            opacity: 0.7,
            fill: "#F7FAFF",
            shadowBlur: 10,
            shadowColor: "rgba(83,125,187,0.19)"
          }
        })
      );
      g.add(
        new zrender.Circle({
          cursor: "default",
          shape: {
            cy: this.zInstanceStyle.height / 2,
            cx: this.zInstanceStyle.width / 2,
            r:
              Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) /
                2 -
              110
          },

          style: {
            fill: new zrender.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: "#f2f2f2" },
              { offset: 1, color: "#e5e5e5" }
            ]),
            shadowBlur: 7,
            shadowOffsetY: 5,
            shadowColor: "rgba(153,153,153,0.4)"
          }
        })
      );
      this.zInstance.add(g);
    },
    drawDashBoard() {
      const g = new zrender.Group();
      g.add(
        new zrender.Arc({
          cursor: "default",
          shape: {
            cy: this.zInstanceStyle.height / 2,
            cx: this.zInstanceStyle.width / 2,
            r:
              Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) /
                2 -
              76,
            startAngle: this.startAngle,
            endAngle: this.endAngle
          },
          style: {
            lineWidth: this.lineWidth,
            stroke: "#ffffff",
            lineCap: "round",
            shadowBlur: 6,
            shadowOffsetY: 3,
            shadowColor: "rgba(102,102,102,0.3)"
          }
        })
      );
      // 刻度圈外圈半径
      const outR =
        Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) / 2 -
        76 +
        this.lineWidth / 2;
      let currentAngle = this.startAngle;
      // 每一刻度 对应的角度
      const oneForAngle =
        this.startAngle > this.endAngle
          ? (this.endAngle + Math.PI * 2 - this.startAngle) / 100
          : (this.endAngle - this.startAngle) / 100;
      for (let i = 0; i <= 100; i += 5) {
        // 刻度
        if (i !== 0) {
          currentAngle += oneForAngle * 5;
        }
        // 0 和100 不需要刻度
        if (i !== 0 && i !== 100) {
          g.add(
            new zrender.Line({
              cursor: "default",
              shape: {
                x1:
                  outR * Math.cos(currentAngle) + this.zInstanceStyle.width / 2,
                y1:
                  outR * Math.sin(currentAngle) +
                  this.zInstanceStyle.height / 2,
                x2:
                  (outR - (i % 10 === 0 ? 12 : 6)) * Math.cos(currentAngle) +
                  this.zInstanceStyle.width / 2,
                y2:
                  (outR - (i % 10 === 0 ? 12 : 6)) * Math.sin(currentAngle) +
                  this.zInstanceStyle.height / 2
              },
              style: {
                stroke: "#ffffff"
              },
              z: 10
            })
          );
        }
        if (i % 10 === 0) {
          g.add(
            new zrender.Text({
              cursor: "default",
              position: [
                (outR + 13) * Math.cos(currentAngle) +
                  this.zInstanceStyle.width / 2 -
                  8,
                (outR + 13) * Math.sin(currentAngle) +
                  this.zInstanceStyle.height / 2 -
                  8
              ],
              style: {
                text: i,
                fontWeight: 400,
                fontSize: 14,
                textFill: "#666666"
              }
            })
          );
        }
      }
      this.zInstance.add(g);
    },
    clearDrawGroup() {
      if (this.drawGroup) this.drawGroup.removeAll();
      if (this.zInstance) this.zInstance.refresh();
    },
    drawScore(orgScore) {
      // let score = 0;
      const requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      const g = this.drawGroup
        ? this.drawGroup
        : (this.drawGroup = new zrender.Group());
      const boardColor = this.boardSelectObj[this.chargeScore(orgScore)];
      const color = this.colorSelectObj[this.chargeScore(orgScore)];
      const oneForAngle =
        this.startAngle > this.endAngle
          ? (this.endAngle + Math.PI * 2 - this.startAngle) / 100
          : (this.endAngle - this.startAngle) / 100;
      const r =
        Math.min(this.zInstanceStyle.width, this.zInstanceStyle.height) / 2 -
        76;
      const arc = new zrender.Arc({
        cursor: "default",
        shape: {
          cy: this.zInstanceStyle.height / 2,
          cx: this.zInstanceStyle.width / 2,
          r: r,
          startAngle: this.startAngle,
          endAngle: this.startAngle + (this.loop ? 0 : orgScore * oneForAngle)
        },
        style: {
          lineWidth: this.lineWidth,
          stroke: boardColor,
          lineCap: "round"
        }
      });
      g.add(arc);
      const circle = new zrender.Circle({
        cursor: "default",
        shape: {
          cx:
            r *
              Math.cos(
                this.startAngle + (this.loop ? 0 : orgScore * oneForAngle)
              ) +
            this.zInstanceStyle.width / 2,
          cy:
            r *
              Math.sin(
                this.startAngle + (this.loop ? 0 : orgScore * oneForAngle)
              ) +
            this.zInstanceStyle.height / 2,
          r: 10
        },
        style: {
          lineWidth: 4,
          stroke: color,
          fill: "#ffffff",
          shadowBlur: 5,
          shadowColor: "rgba(102,102,102,0.4)"
        },
        z: 20
      });
      g.add(circle);
      this.zInstance.add(g);
      if (this.loop) {
        const animate = () => {
          this.requestAnimationFrameID = requestAnimationFrame(animate); // js/RequestAnimationFrame.js needs to be included too.
          TWEEN.update();
        };
        let coords = { score: 0 };
        const tween = new TWEEN.Tween(coords)
          .to({ score: orgScore }, 800)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            arc.attr({
              shape: {
                endAngle: this.startAngle + coords.score * oneForAngle
              }
            });
            circle.attr({
              shape: {
                cx:
                  r * Math.cos(this.startAngle + coords.score * oneForAngle) +
                  this.zInstanceStyle.width / 2,
                cy:
                  r * Math.sin(this.startAngle + coords.score * oneForAngle) +
                  this.zInstanceStyle.height / 2
              }
            });
          })
          .start();
        animate();
        // 缓动函数
        // const cubicInOut = function(k) {
        //   if ((k *= 2) < 1) {
        //     return 0.5 * k * k * k;
        //   }
        //   return 0.5 * ((k -= 2) * k * k + 2);
        // };
        // const loop = () => {
        //   if (orgScore >= score) {
        //     score++;
        //     arc.attr({
        //       shape: {
        //         endAngle:
        //           this.startAngle +
        //           cubicInOut(score / orgScore) * orgScore * oneForAngle
        //       }
        //     });
        //     circle.attr({
        //       shape: {
        //         cx:
        //           r *
        //             Math.cos(
        //               this.startAngle +
        //                 cubicInOut(score / orgScore) * orgScore * oneForAngle
        //             ) +
        //           this.zInstanceStyle.width / 2,
        //         cy:
        //           r *
        //             Math.sin(
        //               this.startAngle +
        //                 cubicInOut(score / orgScore) * orgScore * oneForAngle
        //             ) +
        //           this.zInstanceStyle.height / 2
        //       }
        //     });
        //     this.requestAnimationFrameID = requestAnimationFrame(loop);
        //   }
        // };
        // loop();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dash-board-main {
  cursor: default;
  height: 388px;
  width: 388px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  .dash-board-bottom-text {
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 58px;
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    color: #666666;
    display: flex;
    justify-content: center;
  }
  .dash-board-bottom-score {
    width: 200px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    color: #666666;
    font-size: 14px;
    font-weight: bold;
    & > div:nth-child(2) {
      margin-top: 10px;
      font-size: 66px;
      line-height: 50px;
    }
  }
  #dash-board-main {
    height: 100%;
    width: 100%;
  }
}
</style>


