<template>
  <div class="flex items-center gap-5 text-xs">
    <div class="flex items-center gap-1.5">
      <span class="w-3 h-2 rounded-sm bg-status-green/30 border border-status-green/50"></span>
      <span class="text-text-secondary">占用</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-3 h-2 rounded-sm bg-status-idle/30 border border-status-idle/50"></span>
      <span class="text-text-secondary">空闲</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-3 h-2 rounded-sm bg-status-red/30 border border-status-red/50"></span>
      <span class="text-text-secondary">故障</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-3 h-2 rounded-sm bg-status-orange/30 border border-status-orange/50"></span>
      <span class="text-text-secondary">施工</span>
    </div>
  </div>
</template>
