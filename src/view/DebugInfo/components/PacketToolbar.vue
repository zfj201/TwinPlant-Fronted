<template>
  <div class="packet-toolbar">
    <div class="inner">
      <a-input-search
        v-model:value="keyword"
        class="search"
        allow-clear
        placeholder="筛选设备 / 类型 / 链路段 / payload"
      />
      <a-radio-group v-model:value="direction" button-style="solid">
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="up">上行</a-radio-button>
        <a-radio-button value="down">下行</a-radio-button>
      </a-radio-group>
      <a-checkbox v-model:checked="onlyError">仅错误</a-checkbox>
      <span class="grow"></span>
      <a-button @click="paused = !paused">{{ paused ? '继续' : '暂停' }}</a-button>
      <a-button>导出</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const direction = ref<'all' | 'up' | 'down'>('all')
const onlyError = ref(false)
const paused = ref(false)
</script>

<style scoped lang="less">
.packet-toolbar {
  flex: none;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);

  .inner {
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    min-width: 800px;
    height: 56px;
    padding: 0 16px;
  }

  .search {
    flex: none;
    width: 280px;
  }

  .grow {
    flex: 1;
  }
}
</style>
