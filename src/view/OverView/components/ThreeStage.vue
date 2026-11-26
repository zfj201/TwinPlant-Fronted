<template>
  <div class="three-stage">
    <div ref="el" class="three-stage-container"></div>
    <!-- 加载中 -->
    <div v-if="loading" class="stage-overlay">正在加载三维场景...</div>

    <!-- 加载失败 -->
    <div v-if="error" class="stage-overlay stage-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { createTwinScene } from "@/three";
import modelUrl from "@/assets/model/twinplant_factory.glb?url";

const el = ref<HTMLElement>();
let handle: ReturnType<typeof createTwinScene> | null = null;

const loading = ref(true);
const error = ref('');
let unmounted = false;
onMounted(async () => {
  try {
    if (!el.value) return;
    handle = createTwinScene(el.value, modelUrl);
    await handle.ready;
    if (unmounted) return;
  } catch (e) {
    if (unmounted) return;
    console.error(e);
    error.value = "加载三维场景失败";
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  unmounted = true;
  handle?.dispose();
  handle = null;
});
</script>

<style scoped lang="less">
.three-stage {
  width: 100%;
  height: 100%;
  .three-stage-container {
    width: 100%;
    height: 100%;
  }
  .stage-overlay {
    position: absolute;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, 0.35);
    color: #fff;

    z-index: 10;
  }

  .stage-error {
    color: #ff6b6b;
  }
}
</style>
