import * as THREE from "three";

// 释放 Material 并不代表它使用的 Texture 也会被自动释放。

// 所以还需要遍历材质属性，把关联的贴图找出来。

export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.geometry.dispose();

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    for (const mat of materials) {
      // 材质上的贴图存放在 map、normalMap、roughnessMap 等属性里，挨个检查
      for (const value of Object.values(mat)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      mat.dispose();
    }
  });
}
