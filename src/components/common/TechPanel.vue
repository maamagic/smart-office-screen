<script setup lang="ts">
defineProps<{
  title?: string
  padding?: string
}>()
</script>

<template>
  <div class="tech-panel flex flex-col min-h-0">
    <div v-if="title" class="flex items-center gap-2 px-4 py-3 border-b border-border-glow/30 flex-shrink-0">
      <div class="w-1 h-4 bg-accent-blue rounded-full"></div>
      <span class="text-sm font-medium text-text-primary">{{ title }}</span>
    </div>
    <div class="flex-1 min-h-0 overflow-hidden" :style="{ padding: padding || '16px' }">
      <div class="h-full overflow-y-auto no-scrollbar">
        <slot />
      </div>
    </div>
  </div>
</template>
