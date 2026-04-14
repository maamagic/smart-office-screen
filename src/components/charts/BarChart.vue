<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  categories: string[]
  current: number[]
  previous: number[]
  currentLabel?: string
  previousLabel?: string
}>()

const option = computed(() => ({
  // 保持图表比例不变形
  animation: false,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    textStyle: { color: '#e0e8f0', fontSize: 11 },
  },
  legend: {
    top: 0,
    right: 0,
    itemWidth: 10,
    itemHeight: 8,
    textStyle: { color: '#8899aa', fontSize: 10 },
  },
  grid: {
    left: 5,
    right: 5,
    bottom: 5,
    top: 25,
    containLabel: true,
  },
  xAxis: {
    type: 'category' as const,
    data: props.categories,
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisTick: { show: false },
    axisLabel: { color: '#8899aa', fontSize: 10 },
  },
  yAxis: {
    type: 'value' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8899aa', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
  },
  series: [
    {
      name: props.currentLabel || '今日',
      type: 'bar',
      barWidth: 12,
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#0088aa' },
          ],
        },
      },
      data: props.current,
    },
    {
      name: props.previousLabel || '昨日',
      type: 'bar',
      barWidth: 12,
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: 'rgba(74, 144, 217, 0.4)',
      },
      data: props.previous,
    },
  ],
}))
</script>

<template>
  <VChart 
    :option="option" 
    autoresize 
    style="width: 100%; height: 100%; min-width: 100px; min-height: 60px;" 
  />
</template>
