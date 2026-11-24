import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const GLASS_OPACITY: Record<string, number> = {
  MAT_Glass: 0.16,
  MAT_RoofGlass: 0.3,
};

export async function loadScene(url: string): Promise<THREE.Group> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;
//   预处理一些场景，把不可见的Mesh隐藏掉，再替换掉一些高开销的玻璃材质。
  prepareScene(root);
  return root;
}

function prepareScene(root: THREE.Object3D): void {
  // 每次加载都新建，避免复用已被 dispose 的材质
  const invisible = new THREE.MeshBasicMaterial({
    name: "MAT_Invisible",
    visible: false,
  });
  const glassCache = new Map<string, THREE.MeshStandardMaterial>();

  const getGlass = (name: string) => {
    let mat = glassCache.get(name);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        name,
        roughness: 0.05,
        transparent: true,
        opacity: GLASS_OPACITY[name],
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      glassCache.set(name, mat);
    }
    return mat;
  };

//   记录的是不显示，仅供点击检测的Mesh。
  const proxyMeshes = new Set<THREE.Mesh>();
  // 两次遍历，第一遍找标签。找到 HIT_Tank01 这个盒子有 proxy，就把盒子里的 HIT_Tank01_1、HIT_Tank01_2 写进"代理名单"。
  root.traverse((node) => {
    if (node.userData.defaultVisible === false) {
      node.visible = false;
    }
    // 模型规定，所有点击区域都设置了Proxy代理为true。
    // Group下的Mesh不会有UserData记录。
    if (node.userData.proxy === true) {
      node.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) proxyMeshes.add(child as THREE.Mesh);
      });
    }
  });

  // 第二遍改材质。走到 HIT_Tank01_1 时查名单，发现它在名单上，就换成隐形材质。
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;

    if (proxyMeshes.has(mesh)) {
      mesh.material = invisible;
    //   不产生阴影，同时也不接受别人的阴影。
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      return;
    }

   // 走到这里说明是普通物体。
    // GLB 读进来的 Mesh 只有一种材质，直接取出来
    let mat = mesh.material as THREE.Material;

    // 1. 是玻璃，就换成简单玻璃
    if (mat.name === "MAT_Glass" || mat.name === "MAT_RoofGlass") {
      mat = getGlass(mat.name);
      mesh.material = mat;
    }

    // 2. 半透明的，关掉深度写入
    if (mat.transparent) {
      mat.depthWrite = false;
    }

    // 3. 不透明的才投影
    if (mat.transparent) {
      mesh.castShadow = false;
    } else {
      mesh.castShadow = true;
    }

    // 4. 所有物体都接收影子
    mesh.receiveShadow = true;
  });
}
