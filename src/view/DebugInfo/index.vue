<template>
  <div class="debug-info">
    <div class="main">
      <PacketToolbar />
      <PacketTable />
    </div>
    <PacketDetail />
  </div>
</template>

<script setup lang="ts">
import PacketToolbar from './components/PacketToolbar.vue'
import PacketTable from './components/PacketTable.vue'
import PacketDetail from './components/PacketDetail.vue'
</script>

<style scoped lang="less">
.debug-info {
  display: flex;
  height: 100%;
  overflow: hidden;

  .main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
}
</style>
