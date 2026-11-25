import { HemisphereLight, DirectionalLight } from "three";

import type { EngineContext } from "../core/context";

export function setupLighting(ctx: EngineContext) {
  const { scene } = ctx;

  // 1. 半球光
  const hemisphereLight = new HemisphereLight("#cfd8e3", "#20242b", 0.6);

  scene.add(hemisphereLight);

  // 2. 方向光
  const directionalLight = new DirectionalLight("#fff4e5", 2.2);

  directionalLight.position.set(-14, 26, 18);

  // 阴影总开关开启
  // light设置castShadow
  // cube设置castShadow
  // ground设置receiveShadow
  directionalLight.castShadow = true;

  // 3. 阴影配置
  const shadow = directionalLight.shadow;
  // 阴影边缘精细度
  shadow.mapSize.set(2048, 2048);

  shadow.camera.left = -18;
  shadow.camera.right = 18;
  shadow.camera.top = 14;
  shadow.camera.bottom = -14;

  shadow.camera.near = 1;
  shadow.camera.far = 70;

  shadow.bias = -0.0004;
  shadow.normalBias = 0.02;

  // 4. 将方向光和目标都加入场景
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  // 返回销毁函数
  return () => {
    scene.remove(hemisphereLight);

    scene.remove(directionalLight);
    scene.remove(directionalLight.target);

    directionalLight.dispose();
  };
}
