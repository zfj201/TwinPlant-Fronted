import { Vector3, MathUtils } from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import type { EngineContext } from "../core/context";
import type { TwinModule } from "../core/types";

export class CameraManager implements TwinModule {
  private controls!: OrbitControls;

  private camera!: EngineContext["camera"];

  init(ctx: EngineContext) {
    this.camera = ctx.camera;

    this.controls = new OrbitControls(ctx.camera, ctx.renderer.domElement);

    // 阻尼
    this.controls.enableDamping = true;

    // 允许旋转、缩放、平移
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;

    // 限制俯仰角
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = MathUtils.degToRad(88);

    // 限制相机距离
    this.controls.minDistance = 2;
    this.controls.maxDistance = 70;

    // 初始观察目标
    
    this.camera.position.set(7, 16, 27);
    this.controls.target.set(0, 2, 0);

    this.controls.update();
  }

  /**
   * 每帧更新
   */
  update(_dt: number) {
    this.controls.update();
  }

  /**
   * 设置相机视角
   */
  setView(position: Vector3, target: Vector3) {
    this.camera.position.copy(position);

    this.controls.target.copy(target);

    this.controls.update();
  }

  /**
   * 销毁
   */
  dispose() {
    this.controls?.dispose();
  }
}
