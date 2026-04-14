<script setup lang="ts">
import DataCard from '@/components/common/DataCard.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import type { EnergyOverview } from '@/mock/types'

defineProps<{
  data: EnergyOverview
  delay: number
}>()

function getComparisonClass(val: number) {
  if (val > 0) return 'text-status-red'
  if (val < 0) return 'text-status-green'
  return 'text-text-secondary'
}

function getComparisonText(val: number) {
  if (val > 0) return `+${val}%`
  return `${val}%`
}
</script>

<template>
  <DataCard
    title="能源消耗统计"
    :bg-variant="data.isOverBudget ? 'orange' : 'blue'"
    to="/operations"
    :delay="delay"
  >
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-yellow-400 text-sm">⚡</span>
          <AnimatedNumber :value="data.daily.electricity" :decimals="1" class="text-lg font-bold text-text-primary" />
          <span class="text-xs text-text-secondary">度</span>
        </div>
        <span class="text-xs" :class="getComparisonClass(data.comparison.electricity)">
          {{ getComparisonText(data.comparison.electricity) }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-blue-400 text-sm">💧</span>
          <AnimatedNumber :value="data.daily.water" :decimals="1" class="text-lg font-bold text-text-primary" />
          <span class="text-xs text-text-secondary">吨</span>
        </div>
        <span class="text-xs" :class="getComparisonClass(data.comparison.water)">
          {{ getComparisonText(data.comparison.water) }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-orange-400 text-sm">🔥</span>
          <AnimatedNumber :value="data.daily.gas" :decimals="1" class="text-lg font-bold text-text-primary" />
          <span class="text-xs text-text-secondary">m³</span>
        </div>
        <span class="text-xs" :class="getComparisonClass(data.comparison.gas)">
          {{ getComparisonText(data.comparison.gas) }}
        </span>
      </div>
    </div>
  </DataCard>
</template>
