<template>
  <div class="main-layout">
    <MainHeader />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
</script>

<style scoped lang="less">
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
