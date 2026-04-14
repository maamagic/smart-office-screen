<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
  icon?: string
  bgVariant?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan'
  to?: string
  delay?: number
}>()

const router = useRouter()

const variantColors: Record<string, string> = {
  blue: '#4a90d9',
  green: '#00ff88',
  purple: '#a855f7',
  orange: '#ffa502',
  cyan: '#00d4ff',
}

const accentColor = variantColors[props.bgVariant || 'cyan']

function handleClick() {
  if (props.to) {
    router.push(props.to)
  }
}
</script>

<template>
  <div
    class="data-card animate-fade-in-up"
    :style="{
      animationDelay: `${(delay || 0) * 100}ms`,
      borderLeftColor: accentColor,
      borderLeftWidth: '3px',
    }"
    @click="handleClick"
  >
    <!-- 标题行 -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-text-secondary font-medium tracking-wide">{{ title }}</span>
      <div
        v-if="to"
        class="text-xs text-text-secondary hover:text-accent-blue transition-colors"
      >
        详情 &rarr;
      </div>
    </div>

    <!-- 内容插槽 -->
    <div class="card-content">
      <slot />
    </div>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="mt-3 pt-2 border-t border-border-glow/20">
      <slot name="footer" />
    </div>
  </div>
</template>
