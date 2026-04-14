<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex items-center gap-3 mb-3">
    <div class="w-1 h-5 bg-accent-blue rounded-full shadow-glow"></div>
    <h2 class="text-base font-semibold text-text-primary">{{ title }}</h2>
    <span v-if="subtitle" class="text-xs text-text-secondary">{{ subtitle }}</span>
    <div class="flex-1 h-px bg-gradient-to-r from-accent-blue/30 to-transparent"></div>
  </div>
</template>
