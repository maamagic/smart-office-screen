<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: { name: string; value: number; color: string }[]
  centerText?: string
  centerValue?: string
}>()

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    textStyle: { color: '#e0e8f0', fontSize: 11 },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    bottom: 0,
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: '#8899aa', fontSize: 10 },
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: () => props.centerValue || '',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: '"DIN Alternate", "Roboto Mono", monospace',
        color: '#e0e8f0',
      },
      emphasis: {
        label: { show: true, fontSize: 20 },
      },
      labelLine: { show: false },
      data: props.data.map(d => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: d.color },
      })),
      animationType: 'scale',
      animationEasing: 'elasticOut',
    },
  ],
}))
</script>

<template>
  <VChart :option="option" autoresize style="width: 100%; height: 100%;" />
</template>
