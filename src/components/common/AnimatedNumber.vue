<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { CountUp } from 'countup.js'

const props = withDefaults(defineProps<{
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
}>(), {
  duration: 1.5,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
})

const elRef = ref<HTMLSpanElement>()
let countUp: CountUp | null = null

onMounted(() => {
  if (elRef.value) {
    countUp = new CountUp(elRef.value, props.value, {
      duration: props.duration,
      decimalPlaces: props.decimals,
      prefix: props.prefix,
      suffix: props.suffix,
      separator: props.separator,
      useEasing: true,
    })
    if (!countUp.error) {
      countUp.start()
    }
  }
})

watch(() => props.value, (newVal) => {
  if (countUp && !countUp.error) {
    countUp.update(newVal)
  }
})

onUnmounted(() => {
  countUp = null
})
</script>

<template>
  <span ref="elRef" class="font-display font-bold tabular-nums">0</span>
</template>
