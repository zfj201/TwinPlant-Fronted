<template>
  <div class="packet-table">
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="[]"
        size="small"
        row-key="key"
        :pagination="false"
        :scroll="{ x: 880, y: 1 }"
      />
    </div>
    <div class="pager">
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        size="small"
        show-size-changer
        :show-total="(count: number) => `共 ${count} 条`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'

const columns: TableColumnsType = [
  { title: '时间', dataIndex: 'time', width: '12%', ellipsis: true },
  { title: '方向', dataIndex: 'dir', width: '8%', ellipsis: true },
  { title: '链路段', dataIndex: 'hop', width: '12%', ellipsis: true },
  { title: '设备', dataIndex: 'deviceId', width: '11%', ellipsis: true },
  { title: '类型', dataIndex: 'type', width: '11%', ellipsis: true },
  { title: 'seq', dataIndex: 'seq', width: '8%', ellipsis: true },
  { title: '延迟', dataIndex: 'latency', width: '8%', ellipsis: true },
  { title: '质量', dataIndex: 'quality', width: '8%', ellipsis: true },
  { title: 'payload', dataIndex: 'payload', width: '22%', ellipsis: true },
]

const current = ref(1)
const pageSize = ref(20)
const total = ref(0)
</script>

<style scoped lang="less">
.packet-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0 16px;
  overflow: hidden;

  // 表格区域占满分页以外的剩余高度。scroll.y 只用来触发固定表头，
  // 其写在行内的 max-height 在这里被覆盖，高度完全由 flex 决定。
  .table-area {
    flex: 1;
    min-height: 0;

    :deep(.ant-table-wrapper),
    :deep(.ant-spin-nested-loading),
    :deep(.ant-spin-container),
    :deep(.ant-table),
    :deep(.ant-table-container) {
      height: 100%;
    }

    :deep(.ant-spin-container),
    :deep(.ant-table-container) {
      display: flex;
      flex-direction: column;
    }

    :deep(.ant-table-header) {
      flex: none;
    }

    :deep(.ant-table-body) {
      flex: 1;
      min-height: 0;
      max-height: none !important;

      table {
        height: 100%;
      }
    }

    // 空状态：占位行拉满表体，内容居中
    :deep(.ant-table-placeholder) {
      height: 100%;

      > td {
        vertical-align: middle;
      }
    }
  }

  .pager {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: flex-end;
    height: 56px;
  }
}
</style>
