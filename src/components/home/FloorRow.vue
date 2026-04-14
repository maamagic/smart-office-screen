<script setup lang="ts">
import type { FloorStatus } from '@/mock/types'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps<{
  floor: FloorStatus
}>()

const statusColorMap: Record<string, string> = {
  idle: 'bg-status-idle/15 border-status-idle/30',
  occupied: 'bg-status-green/10 border-status-green/30',
  fault: 'bg-status-red/10 border-status-red/30',
  construction: 'bg-status-orange/10 border-status-orange/30',
}

const areaIcons: Record<string, string> = {
  elevator: '🛗',
  'fire-passage': '🚪',
  'meeting-room': '📋',
  restroom: '🚻',
  cctv: '📷',
}
</script>

<template>
  <div
    class="flex items-center gap-3 px-3 py-1.5 rounded border transition-all duration-200 hover:brightness-125"
    :class="statusColorMap[floor.status]"
  >
    <!-- 楼层号 -->
    <span class="w-8 text-center text-xs font-display font-bold text-accent-blue flex-shrink-0">
      {{ floor.floorNumber }}
    </span>

    <!-- 分隔线 -->
    <div class="w-px h-5 bg-border-glow/30 flex-shrink-0"></div>

    <!-- 企业名称 -->
    <span class="text-xs text-text-primary truncate min-w-[120px] max-w-[140px]">
      {{ floor.tenantName }}
    </span>

    <!-- 区域状态指示器 -->
    <div class="flex items-center gap-1.5 flex-shrink-0">
      <span
        v-for="area in floor.areas"
        :key="area.name"
        class="text-[10px] cursor-default"
        :class="area.status === 'fault' || area.status === 'offline' ? 'opacity-100' : 'opacity-50'"
        :title="`${area.name}: ${area.status === 'normal' || area.status === 'idle' ? '正常' : area.status === 'occupied' ? '占用' : area.status === 'offline' ? '离线' : '故障'}`"
      >
        <span v-if="area.status === 'fault' || area.status === 'offline'" class="relative">
          {{ areaIcons[area.type] }}
          <span class="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-status-red animate-status-blink"></span>
        </span>
        <span v-else>{{ areaIcons[area.type] }}</span>
      </span>
    </div>

    <!-- 人数 -->
    <span class="ml-auto text-xs font-display text-text-secondary flex-shrink-0">
      <span class="text-text-primary font-bold">{{ floor.currentPeople }}</span> 人
    </span>

    <!-- 状态标签 -->
    <StatusBadge
      :status="floor.status === 'occupied' ? 'normal' : floor.status === 'idle' ? 'idle' : floor.status === 'fault' ? 'fault' : 'warning'"
      :label="floor.status === 'occupied' ? '正常' : floor.status === 'idle' ? '空闲' : floor.status === 'fault' ? '故障' : '施工'"
      :pulse="floor.status === 'fault'"
      class="flex-shrink-0 w-[50px]"
    />
  </div>
</template>
