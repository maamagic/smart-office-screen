<script setup lang="ts">
import { ref } from 'vue'
import { useServicesStore } from '@/stores/services'
import TechPanel from '@/components/common/TechPanel.vue'
import dayjs from 'dayjs'

const store = useServicesStore()
const activeTab = ref('tenant')

const tabs = [
  { key: 'tenant', label: '入驻企业', icon: '🏢' },
  { key: 'meeting', label: '会议室', icon: '📅' },
  { key: 'reservation', label: '预约管理', icon: '📋' },
  { key: 'service', label: '便民服务', icon: '🛎️' },
  { key: 'notice', label: '通知公告', icon: '📢' },
]

function getTenantStatusLabel(status: string) {
  const map: Record<string, string> = { normal: '正常', pending: '待入驻', expiring: '即将到期' }
  return map[status] || status
}

function getTenantStatusColor(status: string) {
  const map: Record<string, string> = { normal: 'text-status-green', pending: 'text-status-yellow', expiring: 'text-status-red' }
  return map[status] || 'text-text-secondary'
}

function getRoomStatusText(status: string) {
  const map: Record<string, string> = { available: '可用', occupied: '使用中', maintenance: '维护中' }
  return map[status] || status
}

function getReservationStatusText(status: string) {
  const map: Record<string, string> = { confirmed: '已确认', pending: '待确认', cancelled: '已取消' }
  return map[status] || status
}

function getServiceTypeIcon(type: string) {
  const map: Record<string, string> = { food: '☕', transport: '🚌', medical: '🏥', shopping: '🛒', repair: '🔧', other: '📦' }
  return map[type] || '📦'
}

function getNoticeTypeIcon(type: string) {
  const map: Record<string, string> = { notice: '📢', urgent: '⚠️', maintenance: '🔧', activity: '🎉' }
  return map[type] || '📢'
}

function formatNoticeTime(date: Date) {
  return dayjs(date).format('MM-DD HH:mm')
}
</script>

<template>
  <div class="h-full flex flex-col gap-3 py-2">
    <!-- 子模块切换 -->
    <div class="flex items-center gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border"
        :class="activeTab === tab.key
          ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue shadow-glow'
          : 'bg-bg-panel/50 border-border-glow/20 text-text-secondary hover:text-text-primary'"
        @click="activeTab = tab.key"
      >
        <span class="text-base">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- 入驻企业 -->
    <div v-if="activeTab === 'tenant'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.tenantStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">入驻企业</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.tenantStats.pending }}</div>
          <div class="text-xs text-text-secondary mt-1">待入驻</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red animate-status-blink">{{ store.tenantStats.expiring }}</div>
          <div class="text-xs text-text-secondary mt-1">即将到期</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.tenantStats.totalEmployees }}</div>
          <div class="text-xs text-text-secondary mt-1">企业总人数</div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">企业名称</th>
                <th class="py-2 px-3 text-center">楼层</th>
                <th class="py-2 px-3 text-center">面积(m²)</th>
                <th class="py-2 px-3 text-center">员工数</th>
                <th class="py-2 px-3 text-center">联系人</th>
                <th class="py-2 px-3 text-center">租期至</th>
                <th class="py-2 px-3 text-center">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in store.tenants" :key="t.id" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-primary font-medium">{{ t.name }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ t.floor }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ t.area }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ t.employees }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ t.contact }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ t.leaseEnd }}</td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="getTenantStatusColor(t.status)">
                    <span class="w-2 h-2 rounded-full"
                      :class="t.status === 'normal' ? 'bg-status-green' : t.status === 'pending' ? 'bg-status-yellow' : 'bg-status-red animate-status-blink'"></span>
                    {{ getTenantStatusLabel(t.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>

    <!-- 会议室 -->
    <div v-if="activeTab === 'meeting'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.meetingRoomStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">会议室总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.meetingRoomStats.available }}</div>
          <div class="text-xs text-text-secondary mt-1">可用</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-orange">{{ store.meetingRoomStats.occupied }}</div>
          <div class="text-xs text-text-secondary mt-1">使用中</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-text-secondary">{{ store.meetingRoomStats.maintenance }}</div>
          <div class="text-xs text-text-secondary mt-1">维护中</div>
        </TechPanel>
      </div>

      <div class="grid grid-cols-5 gap-3 flex-1 min-h-0">
        <TechPanel
          v-for="room in store.meetingRooms"
          :key="room.id"
          class="flex flex-col cursor-pointer transition-all"
          :class="room.status === 'occupied' ? 'border-status-orange/40' : room.status === 'maintenance' ? 'opacity-60' : 'hover:border-accent-blue/50'"
        >
          <div class="text-center">
            <div class="text-3xl mb-2">{{ room.status === 'available' ? '🚪' : room.status === 'occupied' ? '👥' : '🔧' }}</div>
            <div class="text-xs font-medium text-text-primary">{{ room.name }}</div>
            <div class="text-[10px] text-text-secondary mt-1">{{ room.floor }} · 容纳{{ room.capacity }}人</div>
          </div>
          <div class="flex-1 mt-2">
            <div class="text-[10px] text-text-secondary">设备:</div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="eq in room.equipment.slice(0, 3)" :key="eq" class="text-[9px] px-1 py-0.5 rounded bg-bg-panel/60 text-text-secondary">
                {{ eq }}
              </span>
              <span v-if="room.equipment.length > 3" class="text-[9px] text-text-secondary">+{{ room.equipment.length - 3 }}</span>
            </div>
          </div>
          <div class="mt-2 text-center">
            <span class="text-xs px-2 py-0.5 rounded"
              :class="room.status === 'available' ? 'bg-status-green/20 text-status-green' : room.status === 'occupied' ? 'bg-status-orange/20 text-status-orange' : 'bg-text-secondary/20 text-text-secondary'">
              {{ getRoomStatusText(room.status) }}
            </span>
          </div>
        </TechPanel>
      </div>
    </div>

    <!-- 预约管理 -->
    <div v-if="activeTab === 'reservation'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.reservationStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">预约总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.reservationStats.confirmed }}</div>
          <div class="text-xs text-text-secondary mt-1">已确认</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">{{ store.reservationStats.pending }}</div>
          <div class="text-xs text-text-secondary mt-1">待确认</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-text-secondary">{{ store.reservationStats.cancelled }}</div>
          <div class="text-xs text-text-secondary mt-1">已取消</div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px] space-y-2">
          <div
            v-for="res in store.meetingReservations"
            :key="res.id"
            class="p-3 rounded bg-bg-primary/40 border border-border-glow/20 hover:border-accent-blue/30 transition-all"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded bg-accent-blue/20 flex items-center justify-center">
                  <span class="text-lg">📅</span>
                </div>
                <div>
                  <div class="text-xs font-medium text-text-primary">{{ res.topic }}</div>
                  <div class="text-[10px] text-text-secondary mt-0.5">
                    {{ res.company }} · {{ res.applicant }}
                  </div>
                </div>
              </div>
              <span class="text-xs px-2 py-0.5 rounded"
                :class="res.status === 'confirmed' ? 'bg-status-green/20 text-status-green' : res.status === 'pending' ? 'bg-status-yellow/20 text-status-yellow' : 'bg-text-secondary/20 text-text-secondary'">
                {{ getReservationStatusText(res.status) }}
              </span>
            </div>
            <div class="flex items-center gap-4 mt-2 text-[10px] text-text-secondary ml-13">
              <span>📍 {{ res.roomName }}</span>
              <span>📆 {{ res.date }}</span>
              <span>🕐 {{ res.timeRange }}</span>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 便民服务 -->
    <div v-if="activeTab === 'service'" class="flex-1 flex flex-col gap-3 min-h-0">
      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">便民服务设施</div>
        <div class="grid grid-cols-5 gap-3 overflow-y-auto no-scrollbar min-h-[600px] max-h-[750px]">
          <div
            v-for="svc in store.convenienceServices"
            :key="svc.id"
            class="tech-panel p-3 flex flex-col hover:border-accent-blue/50 transition-all"
          >
            <div class="text-center mb-2">
              <div class="text-3xl">{{ getServiceTypeIcon(svc.type) }}</div>
              <div class="text-xs font-medium text-text-primary mt-1">{{ svc.name }}</div>
            </div>
            <div class="flex-1 space-y-1.5 text-[10px]">
              <div class="text-text-secondary">{{ svc.description }}</div>
              <div class="text-text-secondary">📍 {{ svc.location }}</div>
              <div class="text-text-secondary">🕐 {{ svc.hours }}</div>
              <div v-if="svc.phone !== '-'" class="text-text-secondary">📞 {{ svc.phone }}</div>
            </div>
            <div class="mt-2 flex items-center justify-center gap-1">
              <span v-for="i in 5" :key="i" class="text-xs" :class="i <= Math.round(svc.rating) ? 'text-status-orange' : 'text-text-secondary/30'">★</span>
              <span class="text-[10px] text-text-secondary ml-1">{{ svc.rating }}</span>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 通知公告 -->
    <div v-if="activeTab === 'notice'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-3 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.noticeStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">公告总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.noticeStats.published }}</div>
          <div class="text-xs text-text-secondary mt-1">已发布</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red animate-status-blink">{{ store.noticeStats.urgent }}</div>
          <div class="text-xs text-text-secondary mt-1">紧急通知</div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px] space-y-3">
          <div
            v-for="notice in store.notices"
            :key="notice.id"
            class="p-4 rounded border transition-all"
            :class="notice.type === 'urgent'
              ? 'border-status-red/40 bg-status-red/5'
              : notice.type === 'maintenance'
                ? 'border-status-yellow/30 bg-status-yellow/5'
                : 'border-border-glow/20 bg-bg-primary/40'"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ getNoticeTypeIcon(notice.type) }}</span>
                <div>
                  <div class="text-sm font-medium text-text-primary">{{ notice.title }}</div>
                  <div class="text-[10px] text-text-secondary mt-0.5">
                    发布: {{ notice.publisher }} · {{ formatNoticeTime(notice.publishTime) }} · {{ notice.targetAudience }}
                  </div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded flex-shrink-0"
                :class="notice.status === 'published' ? 'bg-status-green/20 text-status-green' : 'bg-text-secondary/20 text-text-secondary'">
                {{ notice.status === 'published' ? '已发布' : '草稿' }}
              </span>
            </div>
            <div class="text-xs text-text-secondary mt-3 ml-8 leading-relaxed">{{ notice.content }}</div>
          </div>
        </div>
      </TechPanel>
    </div>
  </div>
</template>
