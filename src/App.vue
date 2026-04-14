<script setup lang="ts">
import { computed } from 'vue'
import { useScreenAdapter } from '@/composables/useScreenAdapter'

const { scaleX, scaleY, designWidth, designHeight } = useScreenAdapter()

const wrapperStyle = computed(() => ({
  width: `${designWidth}px`,
  height: `${designHeight}px`,
  transform: `scale(${scaleX.value}, ${scaleY.value})`,
  transformOrigin: 'top left',
}))
</script>

<template>
  <div class="screen-root">
    <div class="screen-wrapper" :style="wrapperStyle">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.screen-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a1628;
}
</style>
