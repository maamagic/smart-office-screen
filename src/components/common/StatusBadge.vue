<script setup lang="ts">
defineProps<{
  status: 'normal' | 'fault' | 'warning' | 'offline' | 'idle' | 'occupied'
  label?: string
  pulse?: boolean
}>()

const statusConfig: Record<string, { color: string; text: string }> = {
  normal: { color: 'bg-status-green', text: '正常' },
  fault: { color: 'bg-status-red', text: '故障' },
  warning: { color: 'bg-status-yellow', text: '警告' },
  offline: { color: 'bg-text-secondary', text: '离线' },
  idle: { color: 'bg-status-idle', text: '空闲' },
  occupied: { color: 'bg-status-orange', text: '占用' },
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    <span
      class="w-2 h-2 rounded-full flex-shrink-0"
      :class="[statusConfig[status]?.color, pulse ? 'animate-glow-pulse' : '']"
    ></span>
    <span class="text-xs text-text-secondary">{{ label || statusConfig[status]?.text }}</span>
  </span>
</template>
