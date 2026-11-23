<template>
  <header class="main-header">
    <div class="brand">TwinPlant</div>
    <a-menu
      class="menu"
      mode="horizontal"
      :items="menuItems"
      :selected-keys="selectedKeys"
      @click="onMenuClick"
    />
    <a-space class="status" :size="12" split>
      <a-badge status="success" text="EMQX 已连接" />
      <span>延迟 42 ms</span>
    </a-space>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '../../router'

const route = useRoute()
const router = useRouter()

const menuItems = routes
  .filter((r) => r.meta?.title)
  .map((r) => ({ key: r.path, label: r.meta!.title as string }))

const selectedKeys = computed(() => [route.path])

const onMenuClick = ({ key }: { key: string | number }) => {
  router.push(String(key))
}
</script>

<style scoped lang="less">
.main-header {
  display: flex;
  flex: none;
  align-items: center;
  height: 45px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);

  .brand {
    margin-right: 32px;
    font-size: 18px;
    font-weight: 600;
  }

  .menu {
    flex: 1;
    min-width: 0;
    border-bottom: none;
  }

  .status {
    flex: none;
    margin-left: 24px;
  }
}
</style>
