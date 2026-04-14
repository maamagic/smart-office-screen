<script setup lang="ts">
import { useRouter } from 'vue-router'
import TechPanel from '@/components/common/TechPanel.vue'

const router = useRouter()

defineProps<{
  icon: string
  title: string
  enTitle: string
  description: string
}>()
</script>

<template>
  <div class="h-full flex items-center justify-center p-8">
    <TechPanel padding="60px" class="text-center max-w-[600px]">
      <div class="text-6xl mb-6 opacity-30">{{ icon }}</div>
      <h2 class="text-2xl font-bold text-text-primary mb-2">{{ title }}</h2>
      <p class="text-sm text-accent-blue-dim mb-4">{{ enTitle }}</p>
      <p class="text-sm text-text-secondary mb-8 leading-relaxed">{{ description }}</p>
      <div class="inline-flex items-center gap-2 px-6 py-2 rounded bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm">
        即将上线
      </div>
      <div class="mt-6">
        <button
          class="text-xs text-text-secondary hover:text-accent-blue transition-colors"
          @click="router.push('/home')"
        >
          ← 返回首页
        </button>
      </div>
    </TechPanel>
  </div>
</template>
