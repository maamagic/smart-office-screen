<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import CoreOverview from '@/components/home/CoreOverview.vue'
import Building3D from '@/components/home/Building3D.vue'
import TechPanel from '@/components/common/TechPanel.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

const store = useDashboardStore()

const eventTypeColors: Record<string, string> = {
  maintenance: 'bg-status-orange',
  meeting: 'bg-accent-blue',
  visit: 'bg-status-green',
  notice: 'bg-status-idle',
}
</script>

<template>
  <div class="h-full flex flex-col gap-3 py-2">
    <!-- 核心数据概览区 -->
    <CoreOverview />

    <!-- 主内容区: 楼层可视化 + 侧边面板 -->
    <div class="flex-1 grid grid-cols-5 gap-4 min-h-0 overflow-hidden">
      <!-- 3D 楼宇模型 (3列) -->
      <div class="col-span-3">
        <Building3D :floors="store.floors" />
      </div>

      <!-- 侧边面板 (2列) -->
      <div class="col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">
        <!-- 会议室状态 -->
        <TechPanel title="会议室状态" class="flex-1 min-h-0">
          <div class="space-y-2">
            <div
              v-for="room in store.meetingRooms"
              :key="room.name"
              class="flex items-center justify-between px-2 py-1.5 rounded bg-bg-primary/50"
            >
              <div class="flex items-center gap-2">
                <span class="text-xs text-text-primary font-medium">{{ room.name }}</span>
                <span class="text-[10px] text-text-secondary">{{ room.capacity }}人</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="room.currentMeeting" class="text-[10px] text-text-secondary truncate max-w-[100px]">
                  {{ room.currentMeeting }}
                </span>
                <StatusBadge
                  :status="room.status === 'idle' ? 'idle' : room.status === 'occupied' ? 'occupied' : 'warning'"
                  :label="room.status === 'idle' ? '空闲' : room.status === 'occupied' ? '使用中' : '已预约'"
                />
              </div>
            </div>
          </div>
        </TechPanel>

        <!-- 电梯状态 -->
        <TechPanel title="电梯状态" class="flex-shrink-0">
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="el in store.elevators"
              :key="el.id"
              class="flex flex-col items-center gap-1 p-2 rounded bg-bg-primary/50"
            >
              <span class="text-[10px] text-text-secondary">{{ el.id }}</span>
              <span
                class="text-lg font-display font-bold"
                :class="el.status === 'fault' ? 'text-status-red animate-status-blink' : 'text-accent-blue'"
              >
                {{ el.currentFloor < 0 ? `B${Math.abs(el.currentFloor)}` : `${el.currentFloor}F` }}
              </span>
              <span class="text-[10px]" :class="el.status === 'fault' ? 'text-status-red' : 'text-text-secondary'">
                {{ el.status === 'fault' ? '故障' : el.direction === 'up' ? '▲ 上行' : el.direction === 'down' ? '▼ 下行' : '— 待机' }}
              </span>
            </div>
          </div>
        </TechPanel>

        <!-- 今日事件 -->
        <TechPanel title="今日事件" class="flex-1 min-h-0">
          <div class="space-y-2">
            <div
              v-for="(event, index) in store.todayEvents"
              :key="index"
              class="flex items-start gap-3 pl-1"
            >
              <!-- 时间轴 -->
              <div class="flex flex-col items-center gap-1 flex-shrink-0">
                <span class="w-2 h-2 rounded-full" :class="eventTypeColors[event.type]"></span>
                <div v-if="index < store.todayEvents.length - 1" class="w-px h-4 bg-border-glow/30"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-display text-accent-blue-dim">{{ event.time }}</span>
                  <span class="text-xs text-text-primary truncate">{{ event.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </TechPanel>
      </div>
    </div>
  </div>
</template>
