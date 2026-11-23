import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/overview' },
  {
    path: '/overview',
    name: 'OverView',
    meta: { title: '实时孪生' },
    component: () => import('../view/OverView/index.vue'),
  },
  {
    path: '/debug',
    name: 'DebugInfo',
    meta: { title: '链路调试' },
    component: () => import('../view/DebugInfo/index.vue'),
  },
  {
    path: '/history',
    name: 'HistoryTrend',
    meta: { title: '历史趋势' },
    component: () => import('../view/HistoryTrend/index.vue'),
  },
  {
    path: '/alerts',
    name: 'AlertCenter',
    meta: { title: '告警中心' },
    component: () => import('../view/AlertCenter/index.vue'),
  },
  {
    path: '/rules',
    name: 'RuleConfig',
    meta: { title: '规则配置' },
    component: () => import('../view/RuleConfig/index.vue'),
  },
  {
    path: '/devices',
    name: 'DeviceOps',
    meta: { title: '设备运维' },
    component: () => import('../view/DeviceOps/index.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
