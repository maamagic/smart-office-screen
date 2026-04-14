<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { GaugeChart as EGaugeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([EGaugeChart, TooltipComponent, CanvasRenderer])

const props = withDefaults(defineProps<{
  value: number
  label?: string
}>(), {
  label: '运行率',
})

const option = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      radius: '85%',
      center: ['50%', '60%'],
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.6, '#ff4757'],
            [0.8, '#ffa502'],
            [1, '#00ff88'],
          ],
        },
      },
      pointer: {
        length: '55%',
        width: 3,
        itemStyle: { color: '#00d4ff' },
      },
      axisTick: { show: false },
      splitLine: {
        distance: -6,
        length: 4,
        lineStyle: { color: 'rgba(255,255,255,0.3)', width: 1 },
      },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: '#e0e8f0',
        fontSize: 13,
        fontFamily: '"DIN Alternate", "Roboto Mono", monospace',
        fontWeight: 'bold',
        offsetCenter: [0, '40%'],
      },
      title: { show: false },
      data: [{ value: props.value, name: props.label }],
    },
  ],
}))
</script>

<template>
  <VChart :option="option" autoresize style="width: 100%; height: 100%;" />
</template>
