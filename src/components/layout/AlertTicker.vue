<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import dayjs from 'dayjs'

const alertStore = useAlertStore()
const isPaused = ref(false)

const sortedAlerts = computed(() =>
  [...alertStore.alerts].sort((a, b) => {
    const priority = { urgent: 0, warning: 1, info: 2 }
    return priority[a.level] - priority[b.level]
  })
)

function getLevelClass(level: string) {
  switch (level) {
    case 'urgent': return 'alert-urgent'
    case 'warning': return 'alert-warning'
    default: return 'alert-info'
  }
}

function formatTime(date: Date) {
  return dayjs(date).format('HH:mm')
}
</script>

<template>
  <div
    class="h-[48px] border-t border-border-glow/50 bg-bg-primary/80 flex items-center overflow-hidden relative z-50"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- 左侧标签 -->
    <div class="flex-shrink-0 px-4 flex items-center gap-2 border-r border-border-glow/30 h-full">
      <svg class="w-4 h-4 text-status-yellow animate-glow-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span class="text-xs font-medium text-status-yellow whitespace-nowrap">预警信息</span>
    </div>

    <!-- 滚动区域 -->
    <div class="flex-1 overflow-hidden">
      <div
        class="flex gap-12 whitespace-nowrap"
        :class="isPaused ? '' : 'animate-scroll-left'"
        :style="{ animationDuration: `${Math.max(20, sortedAlerts.length * 5)}s` }"
      >
        <template v-for="alert in sortedAlerts" :key="alert.id">
          <span class="inline-flex items-center gap-2 text-xs" :class="getLevelClass(alert.level)">
            <span class="text-text-secondary">{{ formatTime(alert.timestamp) }}</span>
            <span>【{{ alert.location }}】{{ alert.title }}</span>
          </span>
        </template>
        <!-- 复制一份实现无缝滚动 -->
        <template v-for="alert in sortedAlerts" :key="'dup-' + alert.id">
          <span class="inline-flex items-center gap-2 text-xs" :class="getLevelClass(alert.level)">
            <span class="text-text-secondary">{{ formatTime(alert.timestamp) }}</span>
            <span>【{{ alert.location }}】{{ alert.title }}</span>
          </span>
        </template>
      </div>
    </div>

    <!-- 装饰线 -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent"></div>
  </div>
</template>
