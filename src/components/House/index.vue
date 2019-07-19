<template>
  <div ref="house" id="house"></div>
</template>

<script>
import TWEEN from "tween";
const windowPNG = require("@/assets/image/window.png");
const rightDoorPNG = require("@/assets/image/rightdoor.png");
const rightDoorReversePNG = require("@/assets/image/rightdoor_reverse.png");
const plantPNG = require("@/assets/image/plant.png");
export default {
  name: "house",
  data() {
    return {
      status: "close",
      house: null,
      boxWidth: 1200,
      boxHeight: 600,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      matArray: [],
      // 窗户
      window_cube: null,
      // 门
      door_cube: null,
      // 出去门框的内部门
      in_door_cube: null,
      mouse: null,
      raycaster: null
    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initMouseEvent();
      this.bindMouse();
      this.drawHouse();
    },
    initMouseEvent() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
    },
    bindMouse() {
      document
        .getElementById("house")
        .firstChild.addEventListener("click", this.onClick, false);
    },
    onClick(event) {
      event.preventDefault();
      this.mouse.x = (event.offsetX / this.boxWidth) * 2 - 1;
      this.mouse.y = -(event.offsetY / this.boxHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.house, true);
      if (intersects.length > 0) {
        const res = intersects.filter(function(res) {
          return res && res.object;
        })[0];
        // 找到门 做操作
        if (res && res.object && res.object.name === "in_door") {
          const obj3D = res.object.parent;
          this.doorOpera(obj3D);
        }
      }
    },
    doorOpera(door) {
      if (this.status === "close") {
        this.status = "open";
        new TWEEN.Tween(door.rotation)
          .to({ y: -Math.PI / 2 }, 1000)
          .easing(TWEEN.Easing.Elastic.Out)
          .start();
      } else {
        this.status = "close";
        new TWEEN.Tween(door.rotation)
          .to({ y: 0 }, 1000)
          .easing(TWEEN.Easing.Elastic.Out)
          .start();
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      TWEEN.update();
      this.renderer.render(this.scene, this.camera);
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.boxWidth / this.boxHeight,
        0.1,
        1000
      );
      this.camera.position.set(70, 30, 0);
      this.camera.lookAt({ x: 0, y: 0, z: 0 });
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.update();
    },
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setSize(this.boxWidth, this.boxHeight);
      this.$refs["house"].appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
    },
    initLight() {
      this.light = new THREE.SpotLight(0x404040);
      this.light.position.set(50, 20, -20);
      this.light.castShadow = true;
      this.scene.add(this.light);
      const light2 = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      light2.position.set(50, 20, -20);
      this.scene.add(light2);
      // const lightHelper = new THREE.PointLight(this.light);
      // this.scene.add(lightHelper);
    },
    drawHouse() {
      // 坐标轴
      // const axis = new THREE.AxesHelper(20);
      // 在场景中添加坐标轴
      // this.scene.add(axis);

      this.house = new THREE.Group();
      this.drawFloor();
      this.drawEmptyWall();
      this.drawWindow();
      this.drawDoor();
      this.drawDoorWall();
      // 画4个花盆
      this.drawPlant([21, 0, 37]);
      this.drawPlant([21, 0, -37]);
      this.drawPlant([-21, 0, 37]);
      this.drawPlant([-21, 0, -37]);
      this.scene.add(this.house);
    },
    drawFloor() {
      // 地面
      const floor = new THREE.BoxGeometry(90, 140, 2);
      const material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
      const floorCube = new THREE.Mesh(floor, material);
      floorCube.receiveShadow = true;
      this.house.add(floorCube);
      floorCube.rotation.x += 0.5 * Math.PI;
    },
    // 墙
    wallFactory(cubeGeometry, mergeTrans) {
      const material = new THREE.MeshLambertMaterial({ color: 0x62737d });
      // material.metalness = 0;
      // material.roughness = 0;
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = mergeTrans.x || 0;
      cube.position.y = mergeTrans.y || 0;
      cube.position.z = mergeTrans.z || 0;
      cube.rotation.x += mergeTrans.rotationX || 0;
      cube.rotation.y += mergeTrans.rotationY || 0;
      cube.rotation.z += mergeTrans.rotationZ || 0;
      return cube;
    },
    drawEmptyWall() {
      this.house.add(
        this.wallFactory(new THREE.BoxGeometry(2, 20, 80), {
          x: -24,
          y: 11,
          z: 0,
          rotationY: Math.PI
        })
      );
      this.house.add(
        this.wallFactory(new THREE.BoxGeometry(2, 20, 50), {
          x: 0,
          y: 11,
          z: 41,
          rotationY: -0.5 * Math.PI
        })
      );
      this.house.add(
        this.wallFactory(new THREE.BoxGeometry(2, 20, 50), {
          x: 0,
          y: 11,
          z: -41,
          rotationY: 0.5 * Math.PI
        })
      );
    },
    drawDoorWall() {
      // 有门的墙
      const doorWall = this.wallFactory(new THREE.BoxGeometry(2, 20, 80), {
        x: 24,
        y: 11,
        z: 0,
        rotationY: Math.PI
      });
      const door = new THREE.BoxGeometry(2, 15, 8);
      const door_cube = new THREE.Mesh(door);
      door_cube.position.set(24, 8.5, 15);
      const sphere1BSP = new ThreeBSP(doorWall);
      const cube1BSP = new ThreeBSP(this.window_cube);
      const cube2BSP = new ThreeBSP(door_cube);
      const resultBSP = sphere1BSP.subtract(cube1BSP).subtract(cube2BSP);
      const result = resultBSP.toMesh(
        new THREE.MeshLambertMaterial({ color: 0x62737d })
      );
      result.material.flatShading = THREE.FlatShading;
      result.geometry.computeFaceNormals();
      result.geometry.computeVertexNormals();
      result.material.needsUpdate = true;
      result.geometry.buffersNeedUpdate = true;
      result.geometry.uvsNeedUpdate = true;
      this.house.add(result);
    },
    drawWindow() {
      const window = new THREE.BoxGeometry(2, 15, 30);
      this.window_cube = new THREE.Mesh(window);
      // 设置窗位置
      this.window_cube.position.x = 24;
      this.window_cube.position.y = 12;
      this.window_cube.position.z = -20;

      const windowInside = new THREE.BoxGeometry(0.5, 15, 30);
      const texture = new THREE.TextureLoader().load(windowPNG);
      // 立即使用纹理进行材质创建
      const windowMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xd6e4ec,
        opacity: 0.6,
        transparent: true
      });
      const window_cube = new THREE.Mesh(windowInside, windowMaterial);
      window_cube.position.x = 23.8;
      window_cube.position.y = 12;
      window_cube.position.z = -20;
      window_cube.castShadow = true;
      this.house.add(window_cube);
    },
    drawDoor() {
      const door = new THREE.BoxGeometry(1, 15, 8);
      this.door_cube = new THREE.Mesh(door);
      // 设置整体门位置
      this.door_cube.position.set(23.5, 8.5, 15);
      // 门包含门框 和门
      const in_door = new THREE.BoxGeometry(1, 14.5, 7);

      const textureFront = new THREE.TextureLoader().load(rightDoorPNG);
      // 立即使用纹理进行材质创建
      const doorMaterialFront = new THREE.MeshBasicMaterial({
        map: textureFront
      });
      const textureReverse = new THREE.TextureLoader().load(
        rightDoorReversePNG
      );
      // 立即使用纹理进行材质创建
      const doorMaterialReverse = new THREE.MeshStandardMaterial({
        map: textureReverse
      });
      const doorOtherMaterial = new THREE.MeshBasicMaterial({
        color: 0x684840
      });
      this.in_door_cube = new THREE.Mesh(in_door, [
        doorMaterialFront,
        doorMaterialReverse,
        doorOtherMaterial,
        doorOtherMaterial,
        doorOtherMaterial,
        doorOtherMaterial
      ]);
      const copy_in_door_cube = this.in_door_cube.clone();
      copy_in_door_cube.position.set(23.5, 8.5, 15);
      this.in_door_cube.name = "in_door";
      // 设置门位置
      this.in_door_cube.position.set(0.5, 0, 3.5);

      const obj3D = new THREE.Object3D();
      obj3D.position.set(23, 8.5, 11.5);
      obj3D.add(this.in_door_cube);
      this.house.add(obj3D);
      const doorCubeBSP = new ThreeBSP(this.door_cube);
      const inDoorCubeBSP = new ThreeBSP(copy_in_door_cube);
      // 门框
      const door_frame = doorCubeBSP
        .subtract(inDoorCubeBSP)
        .toMesh(new THREE.MeshBasicMaterial({ color: 0x392421 }));
      door_frame.material.flatShading = THREE.FlatShading;
      door_frame.geometry.computeFaceNormals();
      door_frame.geometry.computeVertexNormals();
      door_frame.material.needsUpdate = true;
      door_frame.geometry.buffersNeedUpdate = true;
      door_frame.geometry.uvsNeedUpdate = true;
      this.house.add(door_frame);
    },
    drawPlant(position) {
      const plant = new THREE.Object3D();
      const geometry = new THREE.CylinderBufferGeometry(2, 1, 2, 22);
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.set(0, 2, 0);
      plant.add(cylinder);

      const leafTexture = new THREE.TextureLoader().load(plantPNG);
      const leafMaterial = new THREE.MeshBasicMaterial({
        map: leafTexture,
        side: THREE.DoubleSide,
        transparent: true
      });
      const geom = new THREE.PlaneGeometry(4, 8);
      let leaf = null;
      for (let i = 0; i < 4; i++) {
        leaf = new THREE.Mesh(geom, leafMaterial);
        leaf.position.y = 6;
        leaf.rotation.y = -Math.PI / (i + 1);
        plant.add(leaf);
      }
      plant.position.set(...position);
      this.house.add(plant);
    }
  }
};
</script>



