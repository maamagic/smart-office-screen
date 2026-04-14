<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart as ELineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([ELineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  xData: string[]
  series: { name: string; data: number[]; color?: string }[]
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
    itemWidth: 12,
    itemHeight: 3,
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
    data: props.xData,
    boundaryGap: false,
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
  series: props.series.map((s, i) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: { width: 2, color: s.color || ['#00d4ff', '#00ff88', '#a855f7'][i] },
    itemStyle: { color: s.color || ['#00d4ff', '#00ff88', '#a855f7'][i] },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: (s.color || ['#00d4ff', '#00ff88', '#a855f7'][i]) + '33' },
          { offset: 1, color: (s.color || ['#00d4ff', '#00ff88', '#a855f7'][i]) + '05' },
        ],
      },
    },
    data: s.data,
  })),
}))
</script>

<template>
  <VChart 
    :option="option" 
    autoresize 
    style="width: 100%; height: 100%; min-width: 100px; min-height: 60px;" 
  />
</template>
