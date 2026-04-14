<script setup lang="ts">
import DataCard from '@/components/common/DataCard.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import type { PeopleOverview } from '@/mock/types'

defineProps<{
  data: PeopleOverview
  delay: number
}>()
</script>

<template>
  <DataCard title="当前在楼人数" bg-variant="green" :delay="delay">
    <div class="flex items-center gap-2">
      <!-- 左侧数字 -->
      <div class="flex-1">
        <div class="flex items-end gap-1 mb-2">
          <AnimatedNumber :value="data.total" class="text-3xl text-status-green text-glow" />
          <span class="text-sm text-text-secondary mb-1">人</span>
        </div>
        <div class="space-y-1 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent-blue"></span>
            <span class="text-text-secondary">员工 {{ data.employees }}人</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-status-green"></span>
            <span class="text-text-secondary">访客 {{ data.visitors }}人</span>
          </div>
        </div>
      </div>
      <!-- 右侧环形图 -->
      <div class="w-[90px] h-[90px]">
        <DonutChart
          :data="[
            { name: '员工', value: data.employees, color: '#00d4ff' },
            { name: '访客', value: data.visitors, color: '#00ff88' },
          ]"
          :center-value="String(data.total)"
        />
      </div>
    </div>
  </DataCard>
</template>
