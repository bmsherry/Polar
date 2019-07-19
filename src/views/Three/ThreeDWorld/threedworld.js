import TWEEN from "tween"
export default class ThreeDWorld {
    constructor(canvasContainer) {
        // canvas容器
        this.container = canvasContainer || document.body;
        // 创建场景
        this.createScene();
        // 创建灯光
        this.createLights();
        // 性能监控插件
        this.initStats();
        // 鼠标交互事件监听
        this.addMouseListener();
        // 物体添加
        this.addObjs();
        // 轨道控制插件（鼠标拖拽视角、缩放等）
        this.orbitControls = new THREE.OrbitControls(this.camera);
        this.orbitControls.autoRotate = true;
        // 循环更新渲染场景
        this.update();
    }
    createScene() {
        this.HEIGHT = this.container.getBoundingClientRect().height;
        this.WIDTH = this.container.getBoundingClientRect().width;
        // 创建场景
        this.scene = new THREE.Scene();
        // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
        this.scene.fog = new THREE.Fog(0x090918, 1, 600);
        // 创建相机
        let aspectRatio = this.WIDTH / this.HEIGHT;
        let fieldOfView = 60;
        let nearPlane = 1;
        let farPlane = 10000;
        /**
         * PerspectiveCamera 透视相机
         * @param fieldOfView 视角
         * @param aspectRatio 纵横比
         * @param nearPlane 近平面
         * @param farPlane 远平面
         */
        this.camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
        );

        // 设置相机的位置
        this.camera.position.x = 0;
        this.camera.position.z = 150;
        this.camera.position.y = 0;
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            // 在 css 中设置背景色透明显示渐变色
            alpha: true,
            // 开启抗锯齿
            antialias: true
        });
        // 渲染背景颜色同雾化的颜色
        this.renderer.setClearColor(this.scene.fog.color);
        // 定义渲染器的尺寸；在这里它会填满整个屏幕
        this.renderer.setSize(this.WIDTH, this.HEIGHT);

        // 打开渲染器的阴影地图
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        // 在 HTML 创建的容器中添加渲染器的 DOM 元素
        this.container.appendChild(this.renderer.domElement);
        // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
        window.addEventListener('resize', this.handleWindowResize.bind(this), false);
    }
    // 窗口大小变动时调用
    handleWindowResize() {
        // 更新渲染器的高度和宽度以及相机的纵横比
        this.HEIGHT = this.container.getBoundingClientRect().height;
        this.WIDTH = this.container.getBoundingClientRect().width;;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
    }
    createLights() {
        // 户外光源
        // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

        // 环境光源
        this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);

        // 方向光是从一个特定的方向的照射
        // 类似太阳，即所有光源是平行的
        // 第一个参数是关系颜色，第二个参数是光源强度
        this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

        // 设置光源的位置方向
        this.shadowLight.position.set(50, 50, 50);

        // 开启光源投影
        this.shadowLight.castShadow = true;

        // 定义可见域的投射阴影
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;

        // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;

        // 为了使这些光源呈现效果，需要将它们添加到场景中
        this.scene.add(this.hemisphereLight);
        this.scene.add(this.shadowLight);
        this.scene.add(this.ambientLight);
    }
    initStats() {
        this.stats = new Stats();
        // 将性能监控屏区显示在左上角
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.zIndex = 100;
        this.container.appendChild(this.stats.domElement);
    }
    addMouseListener() {
        // 层层往上寻找模型的父级，直至它是场景下的直接子元素
        function parentUtilScene(obj) {
            if (obj.parent.type === 'Scene') return obj;
            while (obj.parent && obj.parent.type !== 'Scene') {
                obj = obj.parent;
            }
            return obj;
        }
        // canvas容器内鼠标点击事件添加
        this.container.addEventListener("mousedown", (event) => {
            this.handleRaycasters(event, (objTarget) => {
                // 寻找其对应父级为场景下的直接子元素
                let object = parentUtilScene(objTarget);
                // 调用拾取到的物体的点击事件
                object._click && object._click();
                // 遍历场景中除当前拾取外的其他物体，执行其未被点击到的事件回调
                this.scene.children.forEach((objItem) => {
                    if (objItem !== object) {
                        objItem._clickBack && objItem._clickBack();
                    }
                });
            });
        });
        // canvas容器内鼠标移动事件添加
        this.container.addEventListener("mousemove", (event) => {
            this.handleRaycasters(event, (objTarget) => {
                // 寻找其对应父级为场景下的直接子元素
                let object = parentUtilScene(objTarget);
                // 鼠标移动到拾取物体上且未离开时时，仅调用一次其悬浮事件方法
                !object._hover_enter && object._hover && object._hover();
                object._hover_enter = true;
                // 遍历场景中除当前拾取外的其他物体，执行其未有鼠标悬浮的事件回调
                this.scene.children.forEach((objItem) => {
                    if (objItem !== object) {
                        objItem._hover_enter && objItem._hoverBack && objItem._hoverBack();
                        objItem._hover_enter = false;
                    }
                });
            })
        });
        // 为所有3D物体添加上“on”方法，可监听物体的“click”、“hover”事件
        THREE.Object3D.prototype.on = function (eventName, touchCallback, notTouchCallback) {
            switch (eventName) {
                case "click":
                    this._click = touchCallback ? touchCallback : undefined;
                    this._clickBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                case "hover":
                    this._hover = touchCallback ? touchCallback : undefined;
                    this._hoverBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                default:
                    ;
            }
        }
    }
    // 射线处理
    handleRaycasters(event, callback) {
        let mouse = new THREE.Vector2();
        let raycaster = new THREE.Raycaster();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects(this.scene.children, true)
        if (intersects.length > 0) {
            callback && callback(intersects[0].object);
        }
    }
    // 阴影添加
    onShadow(obj) {
        if (obj.type === 'Mesh') {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
        if (obj.children && obj.children.length > 0) {
            obj.children.forEach((item) => {
                this.onShadow(item);
            })
        }
        return;
    }
    // 自定义模型加载
    loader(pathArr) {
        let fbxLoader = new THREE.FBXLoader();
        let mtlLoader = new THREE.MTLLoader();
        let objLoader = new THREE.OBJLoader();
        let basePath, pathName, pathFomat;
        let promiseArr = pathArr.map((path) => {
            basePath = path.substring(0, path.lastIndexOf('/') + 1);
            pathName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
            pathFomat = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
            switch (pathFomat) {
                case 'fbx':
                    return new Promise(function (resolve) {
                        fbxLoader.load(path, (object) => {
                            resolve(object);
                        });
                    });
                    break;
                case 'obj':
                    return new Promise(function (resolve) {
                        objLoader.load(path, (object) => {
                            resolve(object);
                        });
                    });
                    break;
                case 'mtl':
                    return new Promise(function (resolve) {
                        mtlLoader.setBaseUrl(basePath);
                        mtlLoader.setPath(basePath);
                        mtlLoader.load(pathName + '.mtl', (mtl) => {
                            resolve(mtl);
                        });
                    });
                    break;
                case 'objmtl':
                    return new Promise(function (resolve, reject) {
                        mtlLoader.setBaseUrl(basePath);
                        mtlLoader.setPath(basePath);
                        mtlLoader.load(`${pathName}.mtl`, (mtl) => {
                            mtl.preload();
                            objLoader.setMaterials(mtl);
                            objLoader.setPath(basePath);
                            objLoader.load(pathName + '.obj', resolve, undefined, reject);
                        });
                    });
                    break;
                default:
                    return '';
            }
        });
        return Promise.all(promiseArr);
    }
    addObjs() {
        this.loader(['/three/obj/robot.FBX', '/three/obj/Guitar.FBX']).then((result) => {
            let robot = result[0].children[1].geometry;
            let guitarObj = result[1].children[0].geometry;
            guitarObj.scale(1.5, 1.5, 1.5);
            guitarObj.rotateX(-Math.PI / 2);
            robot.scale(0.08, 0.08, 0.08);
            robot.rotateX(-Math.PI / 2);
            this.addPartices(robot, guitarObj);
        });
    }
    // 几何模型转缓存几何模型
    toBufferGeometry(geometry) {
        if (geometry.type === 'BufferGeometry') return geometry;
        return new THREE.BufferGeometry().fromGeometry(geometry);
    }
    getTexture(canvasSize = 64) {
        let canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.background = "transparent";
        let context = canvas.getContext('2d');
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 8, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
        context.fill();
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    addPartices(obj1, obj2) {
        obj1 = this.toBufferGeometry(obj1);
        obj2 = this.toBufferGeometry(obj2);
        let moreObj = obj1
        let lessObj = obj2;
        // 找到顶点数量较多的模型
        if (obj2.attributes.position.array.length > obj1.attributes.position.array.length) {
            [moreObj, lessObj] = [lessObj, moreObj];
        }
        let morePos = moreObj.attributes.position.array;
        let lessPos = lessObj.attributes.position.array;
        let moreLen = morePos.length;
        let lessLen = lessPos.length;
        // 根据最大的顶点数开辟数组空间，同于存放顶点较少的模型顶点数据
        let position2 = new Float32Array(moreLen);
        // 先把顶点较少的模型顶点坐标放进数组
        position2.set(lessPos);
        // 剩余空间重复赋值
        for (let i = lessLen, j = 0; i < moreLen; i++ , j++) {
            j %= lessLen;
            position2[i] = lessPos[j];
            position2[i + 1] = lessPos[j + 1];
            position2[i + 2] = lessPos[j + 2];
        }
        const vertexShader =
            `
            attribute float size;
            attribute vec3 position2;
            uniform float val;
            // 颜色透明度
            varying float opacity;
            // 传递给片元着色器的颜色值
            varying vec3 vColor;
            void main() {
                // 开始产生模糊的z轴分界
                float border = -150.0;
                // 最模糊的z轴分界
                float min_border = -160.0;
                // 最大透明度
                float max_opacity = 1.0;
                // 最小透明度
                float min_opacity = 0.03;
                // 模糊增加的粒子尺寸范围
                float sizeAdd = 20.0;
                vec3 vPos;
                // 变动的val值引导顶点位置的迁移
                vPos.x = position.x * val + position2.x * (1. - val);
                vPos.y = position.y * val + position2.y * (1. - val);
                vPos.z = position.z * val + position2.z * (1. - val);
                vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
                gl_PointSize = size;
                // z轴坐标越小越模糊，即越远越模糊
                if(mvPosition.z > border){
                    opacity = max_opacity;
                    gl_PointSize = size;
                }else if(mvPosition.z < min_border){
                    opacity = min_opacity;
                    gl_PointSize = size + sizeAdd;
                }else{
                    // 模糊程度随距离远近线性增长
                    float percent = (border - mvPosition.z)/(border - min_border);
                    opacity = (1.0-percent) * (max_opacity - min_opacity) + min_opacity;
                    gl_PointSize = percent * (sizeAdd) + size;  
                }
                float positionY = vPos.y;
                //  根据y轴坐标计算传递的顶点颜色值
                vColor.x = abs(sin(positionY));
                vColor.y = abs(cos(positionY));
                vColor.z = abs(cos(positionY));
                gl_Position = projectionMatrix * mvPosition;
            }`
        const fragmentShader =
            `
            varying float opacity;
            uniform vec3 color;
            uniform sampler2D texture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor * color, opacity);
                // 顶点颜色应用上2D纹理
                gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
            }`
        // sizes用来控制每个顶点的尺寸，初始为4
        let sizes = new Float32Array(moreLen);
        for (let i = 0; i < moreLen; i++) {
            sizes[i] = 4;
        }

        // 挂载属性值
        moreObj.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        moreObj.addAttribute('position2', new THREE.BufferAttribute(position2, 3));
        // 传递给shader共享的的属性值
        let uniforms = {
            // 顶点颜色
            color: {
                value: new THREE.Color(0xffffff)
            },
            // 传递顶点贴图
            texture: {
                value: this.getTexture(64)
            },
            // 传递val值，用于shader计算顶点位置
            val: {
                value: 1.0
            }
        };
        // 着色器材料
        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,// 这个不设置的话，会导致带透明色的贴图始终会有方块般的黑色背景
            transparent: true
        });
        // 创建粒子系统
        let particleSystem = new THREE.Points(moreObj, shaderMaterial);
        let pos = {
            val: 1
        };
        // 使val值从0到1，1到0循环往复变化
        let tween = new TWEEN.Tween(pos).to({
            val: 0
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback).onComplete(completeCallBack.bind(pos, 'go'));
        let tweenBack = new TWEEN.Tween(pos).to({
            val: 1
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback).onComplete(completeCallBack.bind(pos, 'back'));
        tween.chain(tweenBack);
        tweenBack.chain(tween);
        tween.start();
        // 每次都将更新的val值赋值给uniforms，让其传递给shader
        function callback() {
            particleSystem.material.uniforms.val.value = this.val;
            if (this.nextcolor) {
                let val = (this.order === 'back' ? (1 - this.val) : this.val);
                let uColor = particleSystem.material.uniforms.color.value;
                uColor.r = this.color.r + (this.nextcolor.r - this.color.r) * val;
                uColor.b = this.color.b + (this.nextcolor.b - this.color.b) * val;
                uColor.g = this.color.g + (this.nextcolor.g - this.color.g) * val;
            }
        }
        function completeCallBack(order) {
            let uColor = particleSystem.material.uniforms.color.value;
            // 保存动画顺序状态
            this.order = order;
            // 保存旧的粒子颜色
            this.color = {
                r: uColor.r,
                b: uColor.b,
                g: uColor.g
            }
            // 随机生成将要变换后的粒子颜色
            this.nextcolor = {
                r: Math.random(),
                b: Math.random(),
                g: Math.random()
            }
        }
        this.scene.add(particleSystem);
        this.particleSystem = particleSystem;
    }
    update() {
        // 动画插件
        TWEEN.update();
        // 性能监测插件
        this.stats.update();
        if (this.particleSystem) {
            let bufferObj = this.particleSystem.geometry;
            // 粒子系统缓缓旋转
            this.particleSystem.rotation.y += 0.01;
            let sizes = bufferObj.attributes.size.array;
            let len = sizes.length;
            for (let i = 0; i < len; i++) {
                sizes[i] = 1.5 * (2.0 + Math.sin(0.02 * i));
            }
            // 需指定属性需要被更新
            bufferObj.attributes.size.needsUpdate = true;
        }
        // 渲染器执行渲染
        this.renderer.render(this.scene, this.camera);
        // 循环调用
        this.requestAnimationId = requestAnimationFrame(this.update.bind(this));
    }
    destroy() {
        window.removeEventListener("resize", this.handleWindowResize);
        if (this.requestAnimationId) cancelAnimationFrame(this.requestAnimationId)
    }
}
