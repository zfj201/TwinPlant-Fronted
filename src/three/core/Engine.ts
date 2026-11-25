import { Clock ,type Object3D } from "three";
import { createContext, type EngineContext } from "./context";
import { setupEnvironment } from "../stage/Environment";
import { disposeObject } from "../utils/dispose";
import { loadScene } from "../assets/SceneLoader";
import { CameraManager } from "../camera/CameraManager";
import { viewFromBookmark } from "../camera/CameraBookmarks";
import { setupLighting } from "../stage/Lighting";
import type { TwinModule } from "./types";

export class Engine {
  readonly context: EngineContext;
  private cameraManager = new CameraManager();
  private clock = new Clock();
  private modules: TwinModule[] = []; //管理类形式
  private disposers: (() => void)[] = []; //管理setupXxx 返回销毁函数
  private observer: ResizeObserver;
  private modelRoot: Object3D | null = null;
  private disposed: boolean = false; // 是否已销毁
  constructor(container: HTMLElement) {
    this.context = createContext(container);

    const envDisposer = setupEnvironment(this.context);
    this.disposers.push(envDisposer);
    const lightDisposer = setupLighting(this.context);
    this.disposers.push(lightDisposer);

    // 有每帧或尺寸逻辑的模块:统一用 use() 注册
    this.use(this.cameraManager);

    this.observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;

      const { camera, renderer } = this.context;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(this.context.scene, this.context.camera); // 在绘制上屏前补画一帧
    });
    this.observer.observe(container);
  }

  async load(url: string) {
    const root = await loadScene(url)
    if (this.disposed) {            // 加载期间组件已销毁
      disposeObject(root)
      return
    }
    this.context.scene.add(root)
    this.modelRoot = root
    // const cam = root.getObjectByName('CAM_Overview')
    // if (cam) {
    //   const { position, target } = viewFromBookmark(cam)
    //   this.cameraManager.setView(position, target)
    // }
  }

  start() {
    if (this.disposed) return;
  
    const { renderer, scene, camera } = this.context;
  
    renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05);
  
      for (const module of this.modules) {
        module.update?.(dt);
      }
  
      renderer.render(scene, camera);
    });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;

    this.context.renderer.setAnimationLoop(null);
    this.observer.disconnect();
    // 倒序销毁避免依赖关系导致的销毁顺序问题
    this.modules.reverse().forEach((module) => module.dispose?.());
    if (this.modelRoot) {
      this.context.scene.remove(this.modelRoot);
      disposeObject(this.modelRoot);
      this.modelRoot = null;
    }
    this.disposers.reverse().forEach((disposer) => disposer());

    this.context.renderer.dispose();
    this.context.renderer.forceContextLoss();
    this.context.renderer.domElement.remove();
  }
  private use(module: TwinModule) {
    this.modules.push(module);
    module.init?.(this.context);
  }
}
