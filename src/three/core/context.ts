import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from "three";

export interface EngineContext {
  container: HTMLElement;

  scene: Scene;

  camera: PerspectiveCamera;

  renderer: WebGLRenderer;
}

// 统一创建EngineContext，供各个页面使用同一单例
export function createContext(container: HTMLElement): EngineContext {
  const width = container.clientWidth || 1;
  const height = container.clientHeight || 1;

  // 1. 创建 Scene
  const scene = new Scene();

  // 2. 创建 Camera
  const camera = new PerspectiveCamera(40, width / height, 0.1, 200);

  camera.position.set(7, 16, 27);
  camera.lookAt(0, 2, 0);

  // 3. 创建 Renderer
  const renderer = new WebGLRenderer({
    antialias: true, //抗锯齿
    alpha: false,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(width, height);

  //   把任意亮度压缩到 0 到 1，让亮度平滑过渡
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  // 开启阴影
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // 4. 设置 Canvas 样式
  const canvas = renderer.domElement;

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  // 确保父容器能够承载绝对定位的 Canvas
  const position = getComputedStyle(container).position;

  if (position === "static") {
    container.style.position = "relative";
  }

  container.appendChild(canvas);

  return {
    container,
    scene,
    camera,
    renderer,
  };
}
