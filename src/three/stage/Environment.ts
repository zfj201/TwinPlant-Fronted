import {
  Color,
  Fog,
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  WebGLRenderer,
  Scene,
} from "three";

import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import type { EngineContext } from "../core/context";

export function setupEnvironment(ctx: EngineContext) {
  const { scene, renderer } = ctx;

  // 1. 背景颜色
  const backgroundColor = new Color("#0E1116");

  scene.background = backgroundColor;

  // 2. 雾效
  scene.fog = new Fog(backgroundColor, 45, 90);

  // 3. 环境贴图
  const pmremGenerator = new PMREMGenerator(renderer);

  const roomEnvironment = new RoomEnvironment();

  const environmentTarget = pmremGenerator.fromScene(roomEnvironment);

  scene.environment = environmentTarget.texture;

  // 环境反射强度
  scene.environmentIntensity = 0.55;

  // 4. 地面
  const groundGeometry = new CircleGeometry(80, 64);

  const groundMaterial = new MeshStandardMaterial({
    color: "#12161c",
    roughness: 1,
    metalness: 0,
  });

  const ground = new Mesh(groundGeometry, groundMaterial);

  // CircleGeometry 默认位于 XY 平面
  // 旋转到 XZ 平面
  ground.rotation.x = -Math.PI / 2;

  ground.position.y = -0.76;

  ground.receiveShadow = true;

  scene.add(ground);

  // 返回销毁函数
  return () => {
    scene.remove(ground);

    groundGeometry.dispose();
    groundMaterial.dispose();

    // 清除环境贴图引用
    if (scene.environment === environmentTarget.texture) {
      scene.environment = null;
    }

    // 释放 PMREM 生成的 GPU 资源
    environmentTarget.dispose();

    // 释放 PMREMGenerator
    pmremGenerator.dispose();

    // RoomEnvironment 是程序生成的场景，
    // 释放它创建的几何体和材质
    roomEnvironment.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      object.geometry.dispose();

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => material.dispose());
    });
  };
}
