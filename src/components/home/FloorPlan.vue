<script setup lang="ts">
import type { FloorStatus } from '@/mock/types'
import FloorRow from './FloorRow.vue'
import FloorLegend from './FloorLegend.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'

defineProps<{
  floors: FloorStatus[]
}>()
</script>

<template>
  <div class="tech-panel p-4 h-full flex flex-col">
    <SectionTitle title="楼层状态总览" subtitle="实时监控" />

    <!-- 楼层列表（从顶层到底层） -->
    <div class="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-1">
      <FloorRow
        v-for="floor in [...floors].reverse()"
        :key="floor.floorNumber"
        :floor="floor"
      />
    </div>

    <!-- 图例 -->
    <FloorLegend class="mt-3 pt-2 border-t border-border-glow/20" />
  </div>
</template>
