import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: () => import('@/components/layout/DashboardLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: '首页', icon: 'home', order: 0 },
      },
      {
        path: 'security',
        name: 'Security',
        component: () => import('@/views/SecurityPage.vue'),
        meta: { title: '智能安防', icon: 'shield', order: 1 },
      },
      {
        path: 'operations',
        name: 'Operations',
        component: () => import('@/views/OperationsPage.vue'),
        meta: { title: '智能运维', icon: 'settings', order: 2 },
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('@/views/ServicesPage.vue'),
        meta: { title: '企业服务', icon: 'briefcase', order: 3 },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/AnalyticsPage.vue'),
        meta: { title: '数据统计', icon: 'chart', order: 4 },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsPage.vue'),
        meta: { title: '系统设置', icon: 'gear', order: 5 },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
