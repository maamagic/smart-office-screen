<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRealTimeClock } from '@/composables/useRealTimeClock'
import { computed } from 'vue'
import dayjs from 'dayjs'

const appStore = useAppStore()
const { date, time, dayOfWeek } = useRealTimeClock()

const weather = computed(() => appStore.weatherData)
const pm25Class = computed(() => weather.value.pm25 > 75 ? 'text-status-red' : 'text-status-green')
const statusClass = computed(() => appStore.systemStatus === 'normal' ? 'text-status-green' : 'text-status-red')
const statusDotClass = computed(() => appStore.systemStatus === 'normal' ? 'bg-status-green' : 'bg-status-red animate-status-blink')
const lastUpdate = computed(() => dayjs(appStore.lastDataUpdate).format('HH:mm'))
</script>

<template>
  <header class="h-[80px] flex items-center justify-between px-6 border-b border-border-glow/50 relative">
    <!-- 装饰线 -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent"></div>

    <!-- 左侧: LOGO + 标题 -->
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-lg bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
        <svg class="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold tracking-wider text-glow">
          {{ appStore.buildingName }}
          <span class="text-accent-blue ml-2">智能管控中心</span>
        </h1>
      </div>
    </div>

    <!-- 右侧: 时间 + 天气 + 状态 -->
    <div class="flex items-center gap-8 text-sm">
      <!-- 时间 -->
      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-text-secondary text-xs">{{ date }} {{ dayOfWeek }}</div>
          <div class="text-xl font-display font-bold text-text-primary tracking-widest">{{ time }}</div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="w-px h-10 bg-border-glow/50"></div>

      <!-- 天气 -->
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ weather.icon }}</span>
        <div class="text-xs leading-relaxed">
          <div class="text-text-primary">{{ weather.temperature }}°C · 湿度{{ weather.humidity }}%</div>
          <div class="text-text-secondary">
            {{ weather.windDirection }}风{{ weather.windLevel }}级 ·
            PM2.5: <span :class="pm25Class">{{ weather.pm25 }}</span>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="w-px h-10 bg-border-glow/50"></div>

      <!-- 系统状态 -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :class="statusDotClass"></span>
          <span class="text-xs" :class="statusClass">
            {{ appStore.systemStatus === 'normal' ? '系统正常' : '系统异常' }}
          </span>
        </div>
        <div class="text-xs text-text-secondary">
          更新于 {{ lastUpdate }}
        </div>
      </div>
    </div>
  </header>
</template>
