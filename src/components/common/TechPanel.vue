<script setup lang="ts">
defineProps<{
  title?: string
  padding?: string
}>()
</script>

<template>
  <div class="tech-panel" :style="{ padding: padding || '16px' }">
    <div v-if="title" class="flex items-center gap-2 mb-3 pb-2 border-b border-border-glow/30">
      <div class="w-1 h-4 bg-accent-blue rounded-full"></div>
      <span class="text-sm font-medium text-text-primary">{{ title }}</span>
    </div>
    <slot />
  </div>
</template>
