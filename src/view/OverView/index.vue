<template>
  <div class="overview">
    <DeviceList />
    <div class="center">
      <!-- 3D 区域：仅占位，后续由 three 组件替换 -->
      <div class="scene">
        <ThreeStage />
      </div>
      <!-- <LinkPulse /> -->
    </div>
    <DeviceDetail />
  </div>
</template>

<script setup lang="ts">
import DeviceList from './components/DeviceList.vue'
import DeviceDetail from './components/DeviceDetail.vue'
import LinkPulse from './components/LinkPulse.vue'
import ThreeStage from './components/ThreeStage.vue'
</script>

<style scoped lang="less">
.overview {
  display: flex;
  height: 100%;
  overflow: hidden;

  .center {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;

    .scene {
      flex: 1;
      min-height: 0;
      position: relative;
    }
  }
}
</style>
