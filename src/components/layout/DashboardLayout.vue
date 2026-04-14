<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import HeaderBar from './HeaderBar.vue'
import ModuleNav from './ModuleNav.vue'
import AlertTicker from './AlertTicker.vue'
import { useAppStore } from '@/stores/app'
import { useDashboardStore } from '@/stores/dashboard'
import { useAlertStore } from '@/stores/alert'

const appStore = useAppStore()
const dashboardStore = useDashboardStore()
const alertStore = useAlertStore()

onMounted(() => {
  appStore.startClock()
  dashboardStore.fetchAllData()
  dashboardStore.startRealTimeUpdates()
  alertStore.startAlertSimulation()
})

onUnmounted(() => {
  appStore.stopClock()
  dashboardStore.stopRealTimeUpdates()
  alertStore.stopAlertSimulation()
})
</script>

<template>
  <div class="dashboard-layout flex flex-col w-full h-full bg-bg-primary">
    <!-- 顶部标题区 -->
    <HeaderBar />

    <!-- 模块导航 -->
    <ModuleNav />

    <!-- 内容区 -->
    <div class="flex-1 overflow-hidden px-4 pb-1">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 底部预警 -->
    <AlertTicker />
  </div>
</template>

<style scoped>
.dashboard-layout {
  background: linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
