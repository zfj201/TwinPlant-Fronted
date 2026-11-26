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
      <a-tooltip :title="connection.lastError || undefined">
        <a-badge :status="statusView.badge" :text="statusView.text" />
      </a-tooltip>
      <span>延迟 {{ connection.rttMs ?? '--' }} ms</span>
    </a-space>
  </header>
</template>

<script setup lang="ts">
import { routes } from '../../router'
import { useConnectionStore, type ConnectionStatus } from '@/stores/connection'

type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

const STATUS_VIEW: Record<ConnectionStatus, { badge: BadgeStatus; text: string }> = {
  idle: { badge: 'default', text: 'EMQX 未连接' },
  connecting: { badge: 'processing', text: 'EMQX 连接中' },
  connected: { badge: 'success', text: 'EMQX 已连接' },
  reconnecting: { badge: 'warning', text: 'EMQX 重连中' },
  disconnected: { badge: 'error', text: 'EMQX 已断开' },
}

const connection = useConnectionStore()
const statusView = computed(() => STATUS_VIEW[connection.status])

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
