<script setup lang="ts">
import DataCard from '@/components/common/DataCard.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import type { TenantOverview } from '@/mock/types'

defineProps<{
  data: TenantOverview
  delay: number
}>()
</script>

<template>
  <DataCard title="入驻企业数" bg-variant="cyan" to="/services" :delay="delay">
    <div class="flex items-end gap-2">
      <AnimatedNumber :value="data.total" class="text-3xl text-accent-blue text-glow" />
      <span class="text-sm text-text-secondary mb-1">家</span>
    </div>
    <template #footer>
      <div class="flex items-center gap-4 text-xs">
        <span class="text-text-secondary">
          新增: <span class="text-status-green">{{ data.newToday }}家</span>
        </span>
        <span class="text-text-secondary">
          空置率: <span :class="data.vacancyRate > 10 ? 'text-status-yellow' : 'text-status-green'">{{ data.vacancyRate }}%</span>
        </span>
      </div>
    </template>
  </DataCard>
</template>
