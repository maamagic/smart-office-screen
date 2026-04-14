<script setup lang="ts">
import DataCard from '@/components/common/DataCard.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import type { EquipmentOverview } from '@/mock/types'

defineProps<{
  data: EquipmentOverview
  delay: number
}>()
</script>

<template>
  <DataCard title="设备运行率" bg-variant="purple" to="/operations" :delay="delay">
    <div class="flex items-center gap-2">
      <!-- 左侧仪表盘 -->
      <div class="w-[100px] h-[80px]">
        <GaugeChart :value="data.rate" />
      </div>
      <!-- 右侧信息 -->
      <div class="flex-1 space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-text-secondary">运行中</span>
          <span class="text-status-green font-display font-bold">{{ data.running }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-text-secondary">故障</span>
          <span class="font-display font-bold" :class="data.faulty > 0 ? 'text-status-red' : 'text-status-green'">{{ data.faulty }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-text-secondary">总计</span>
          <span class="text-text-primary font-display font-bold">{{ data.total }}</span>
        </div>
      </div>
    </div>
    <template v-if="data.faultyList.length > 0" #footer>
      <div v-for="fault in data.faultyList" :key="fault.name" class="text-xs text-status-red flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-status-red animate-status-blink"></span>
        {{ fault.name }}：{{ fault.type }}
      </div>
    </template>
  </DataCard>
</template>
