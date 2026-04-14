<script setup lang="ts">
import DataCard from '@/components/common/DataCard.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import type { VisitorOverview } from '@/mock/types'

defineProps<{
  data: VisitorOverview
  delay: number
}>()
</script>

<template>
  <DataCard title="访客预约数" bg-variant="orange" :delay="delay">
    <div class="flex items-end gap-2 mb-3">
      <AnimatedNumber :value="data.total" class="text-3xl text-status-orange text-glow" />
      <span class="text-sm text-text-secondary mb-1">人</span>
    </div>

    <!-- 核销进度条 -->
    <div class="mb-2">
      <div class="flex items-center justify-between text-xs text-text-secondary mb-1">
        <span>核销率</span>
        <span class="font-display font-bold text-text-primary">{{ data.checkInRate }}%</span>
      </div>
      <div class="h-2 rounded-full bg-bg-primary overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-1000"
          :style="{ width: `${data.checkInRate}%`, background: 'linear-gradient(90deg, #ffa502, #ff6b81)' }"
        ></div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-4 text-xs">
        <span class="text-text-secondary">
          已核销: <span class="text-status-green">{{ data.checkedIn }}人</span>
        </span>
        <span class="text-text-secondary">
          待核销: <span class="text-status-yellow">{{ data.pending }}人</span>
        </span>
      </div>
    </template>
  </DataCard>
</template>
