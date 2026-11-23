<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <MainLayout />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import MainLayout from './layouts/index.vue'

const theme = {
  components: {
    Layout: { colorBgBody: '#ffffff', colorBgHeader: '#ffffff' },
  },
}
</script>
