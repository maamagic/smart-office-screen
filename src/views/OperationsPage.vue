<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOperationsStore } from '@/stores/operations'
import TechPanel from '@/components/common/TechPanel.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const store = useOperationsStore()
const activeTab = ref('device')

const tabs = [
  { key: 'device', label: '设备运维', icon: '⚙️' },
  { key: 'energy', label: '能源管理', icon: '⚡' },
  { key: 'environment', label: '环境管控', icon: '🌡️' },
]

const deviceFilter = ref<'all' | 'running' | 'fault' | 'maintenance'>('all')
const filteredDevices = computed(() =>
  deviceFilter.value === 'all'
    ? store.devices
    : store.devices.filter(d => d.status === deviceFilter.value)
)

const categoryFilter = ref<string>('all')
const filteredByCategory = computed(() => {
  let devices = filteredDevices.value
  if (categoryFilter.value !== 'all') {
    devices = devices.filter(d => d.category === categoryFilter.value)
  }
  return devices
})

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    running: '运行中', stopped: '已停机', fault: '故障', maintenance: '维保中',
    normal: '正常', warning: '警告', danger: '危险',
  }
  return map[status] || status
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    running: 'text-status-green', stopped: 'text-text-secondary', fault: 'text-status-red', maintenance: 'text-status-yellow',
    normal: 'text-status-green', warning: 'text-status-yellow', danger: 'text-status-red',
  }
  return map[status] || 'text-text-secondary'
}

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    elevator: '🛗', ac: '❄️', ventilation: '💨', cctv: '📷', lighting: '💡', plumbing: '🔧',
  }
  return map[category] || '⚙️'
}

function getCategoryLabel(category: string) {
  const map: Record<string, string> = {
    elevator: '电梯系统', ac: '空调系统', ventilation: '通风系统', cctv: '监控系统', lighting: '照明系统', plumbing: '给排水系统',
  }
  return map[category] || category
}

// 能源趋势数据
const energyTrendDays = ['4-8', '4-9', '4-10', '4-11', '4-12', '4-13', '4-14']
const electricityTrend = energyTrendDays.map(() => Math.floor(Math.random() * 200) + 300)
const waterTrend = energyTrendDays.map(() => Math.floor(Math.random() * 50) + 80)

// 环境趋势数据
const envTrendHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const temperatureTrend = envTrendHours.map(() => +(Math.random() * 5 + 22).toFixed(1))
const co2Trend = envTrendHours.map(() => Math.floor(Math.random() * 400) + 400)
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

    <!-- 设备运维 -->
    <div v-if="activeTab === 'device'" class="flex-1 flex flex-col gap-3 min-h-0">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-5 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.deviceSummary.total }}</div>
          <div class="text-xs text-text-secondary mt-1">设备总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.deviceSummary.running }}</div>
          <div class="text-xs text-text-secondary mt-1">运行中</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red animate-status-blink">{{ store.deviceSummary.fault }}</div>
          <div class="text-xs text-text-secondary mt-1">故障</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">{{ store.deviceSummary.maintenance }}</div>
          <div class="text-xs text-text-secondary mt-1">维保中</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-text-secondary">{{ store.deviceSummary.stopped }}</div>
          <div class="text-xs text-text-secondary mt-1">已停机</div>
        </TechPanel>
      </div>

      <!-- 分类统计 -->
      <div class="grid grid-cols-6 gap-3">
        <TechPanel
          v-for="stat in store.categoryStats"
          :key="stat.key"
          class="text-center cursor-pointer transition-all"
          :class="categoryFilter === stat.key ? 'border-accent-blue/50 bg-accent-blue/5' : ''"
          @click="categoryFilter = categoryFilter === stat.key ? 'all' : stat.key"
        >
          <div class="text-2xl">{{ getCategoryIcon(stat.key) }}</div>
          <div class="text-xs text-text-secondary mt-1">{{ stat.label }}</div>
          <div class="text-lg font-display font-bold text-text-primary mt-1">{{ stat.total }}</div>
          <div class="text-[10px] text-status-green">运行 {{ stat.running }}</div>
        </TechPanel>
      </div>

      <!-- 筛选 -->
      <div class="flex items-center gap-2">
        <button
          v-for="f in [{key:'all',label:'全部'},{key:'running',label:'运行中'},{key:'fault',label:'故障'},{key:'maintenance',label:'维保中'}]"
          :key="f.key"
          class="px-3 py-1 rounded text-xs transition-all"
          :class="deviceFilter === f.key
            ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40'
            : 'text-text-secondary border border-transparent hover:border-border-glow/30'"
          @click="deviceFilter = f.key as any"
        >
          {{ f.label }}
        </button>
        <span v-if="categoryFilter !== 'all'" class="text-xs text-text-secondary ml-2">
          分类: {{ getCategoryLabel(categoryFilter) }}
          <button class="ml-1 text-accent-blue hover:underline" @click="categoryFilter = 'all'">清除</button>
        </span>
      </div>

      <!-- 设备列表 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div class="overflow-y-auto no-scrollbar min-h-[420px] max-h-[670px] space-y-1.5">
          <div
            v-for="device in filteredByCategory"
            :key="device.id"
            class="flex items-center gap-3 px-3 py-2 rounded bg-bg-primary/40"
            :class="device.status === 'fault' ? 'border border-status-red/50' : device.status === 'maintenance' ? 'border border-status-yellow/30' : ''"
          >
            <!-- 图标 -->
            <div class="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 bg-bg-panel/60">
              <span class="text-lg">{{ getCategoryIcon(device.category) }}</span>
            </div>
            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-text-primary">{{ device.name }}</span>
                <span class="text-[10px] font-display text-text-secondary">{{ device.model }}</span>
              </div>
              <div class="flex items-center gap-3 text-[10px] text-text-secondary">
                <span>位置: {{ device.location }}</span>
                <span>运行: {{ device.runHours }}h</span>
              </div>
            </div>
            <!-- 状态 -->
            <div class="flex-shrink-0 text-right">
              <span class="inline-flex items-center gap-1.5 text-xs" :class="getStatusColor(device.status)">
                <span class="w-2 h-2 rounded-full"
                  :class="device.status === 'running' ? 'bg-status-green' : device.status === 'fault' ? 'bg-status-red animate-status-blink' : device.status === 'maintenance' ? 'bg-status-yellow' : 'bg-text-secondary'"></span>
                {{ getStatusLabel(device.status) }}
              </span>
              <div class="text-[10px] text-text-secondary mt-0.5">
                下次维保: {{ device.nextMaintenance }}
              </div>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 能源管理 -->
    <div v-if="activeTab === 'energy'" class="flex-1 flex flex-col gap-3 min-h-0">
      <!-- 能源概览 -->
      <div class="grid grid-cols-3 gap-3">
        <TechPanel>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-text-secondary">今日用电</div>
              <div class="text-2xl font-display font-bold text-accent-blue mt-1">
                {{ store.zoneEnergy.reduce((sum, z) => sum + z.electricity, 0) }} <span class="text-sm text-text-secondary">kWh</span>
              </div>
              <div class="text-[10px] text-status-green mt-1">较昨日 ↓3.2%</div>
            </div>
            <div class="text-4xl opacity-30">⚡</div>
          </div>
        </TechPanel>
        <TechPanel>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-text-secondary">今日用水</div>
              <div class="text-2xl font-display font-bold text-cyan-400 mt-1">
                {{ store.zoneEnergy.reduce((sum, z) => sum + z.water, 0).toFixed(1) }} <span class="text-sm text-text-secondary">m³</span>
              </div>
              <div class="text-[10px] text-status-red mt-1">较昨日 ↑1.8%</div>
            </div>
            <div class="text-4xl opacity-30">💧</div>
          </div>
        </TechPanel>
        <TechPanel>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-text-secondary">本月能耗</div>
              <div class="text-2xl font-display font-bold text-status-orange mt-1">
                {{ (store.zoneEnergy.reduce((sum, z) => sum + z.electricity, 0) * 30 / 1000).toFixed(1) }} <span class="text-sm text-text-secondary">MWh</span>
              </div>
              <div class="text-[10px] text-status-green mt-1">预算使用率 78%</div>
            </div>
            <div class="text-4xl opacity-30">📊</div>
          </div>
        </TechPanel>
      </div>

      <!-- 7天趋势 -->
      <div class="grid grid-cols-2 gap-3 h-[320px]">
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">7天用电趋势</div>
          <LineChart
            :x-data="energyTrendDays"
            :series="[{ name: '用电量(kWh)', data: electricityTrend, color: '#00d4ff' }]"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">7天用水趋势</div>
          <LineChart
            :x-data="energyTrendDays"
            :series="[{ name: '用水量(m³)', data: waterTrend, color: '#22d3ee' }]"
          />
        </TechPanel>
      </div>

      <!-- 分区能耗排行 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">分区能耗排行</div>
        <div class="grid grid-cols-2 gap-3 h-[300px]">
          <!-- 排行列表 -->
          <div class="overflow-y-auto no-scrollbar space-y-2">
            <div
              v-for="(zone, index) in store.zoneEnergy"
              :key="zone.name"
              class="flex items-center gap-3 px-3 py-2 rounded bg-bg-primary/40"
            >
              <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                :class="index === 0 ? 'bg-status-orange/80 text-white' : index === 1 ? 'bg-text-secondary/60 text-white' : index === 2 ? 'bg-status-orange/40 text-white' : 'bg-bg-panel/60 text-text-secondary'">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs text-text-primary truncate">{{ zone.name }}</div>
                <div class="text-[10px] text-text-secondary">{{ zone.electricity }} kWh / {{ zone.water }} m³</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-xs font-display font-bold text-accent-blue">{{ zone.electricity }}</div>
                <div class="text-[10px]" :class="zone.trend > 100 ? 'text-status-red' : 'text-status-green'">
                  {{ zone.trend > 100 ? '↑' : '↓' }}{{ Math.abs(zone.trend - 100) }}%
                </div>
              </div>
            </div>
          </div>
          <!-- 柱状图 -->
          <BarChart
            :categories="store.zoneEnergy.slice(0, 8).map(z => z.name.split(' ')[0])"
            :current="store.zoneEnergy.slice(0, 8).map(z => z.electricity)"
            :previous="store.zoneEnergy.slice(0, 8).map(() => Math.floor(Math.random() * 200) + 80)"
          />
        </div>
      </TechPanel>
    </div>

    <!-- 环境管控 -->
    <div v-if="activeTab === 'environment'" class="flex-1 flex flex-col gap-3 min-h-0">
      <!-- 环境状态统计 -->
      <div class="grid grid-cols-3 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.envSummary.normal }}</div>
          <div class="text-xs text-text-secondary mt-1">环境正常</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">{{ store.envSummary.warning }}</div>
          <div class="text-xs text-text-secondary mt-1">存在预警</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red animate-status-blink">{{ store.envSummary.danger }}</div>
          <div class="text-xs text-text-secondary mt-1">环境异常</div>
        </TechPanel>
      </div>

      <!-- 实时环境数据 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">实时环境数据</div>
        <div class="overflow-y-auto no-scrollbar min-h-[240px] max-h-[300px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">区域</th>
                <th class="py-2 px-3 text-center">温度(°C)</th>
                <th class="py-2 px-3 text-center">湿度(%)</th>
                <th class="py-2 px-3 text-center">PM2.5</th>
                <th class="py-2 px-3 text-center">CO₂(ppm)</th>
                <th class="py-2 px-3 text-center">甲醛(mg/m³)</th>
                <th class="py-2 px-3 text-center">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="env in store.environment"
                :key="env.zone"
                class="border-b border-border-glow/10 hover:bg-bg-panel/30"
              >
                <td class="py-2 px-3 text-text-primary">{{ env.zone }}</td>
                <td class="py-2 px-3 text-center" :class="env.temperature > 28 ? 'text-status-red' : env.temperature > 26 ? 'text-status-yellow' : 'text-text-primary'">
                  {{ env.temperature }}
                </td>
                <td class="py-2 px-3 text-center text-text-primary">{{ env.humidity }}</td>
                <td class="py-2 px-3 text-center" :class="env.pm25 > 70 ? 'text-status-red' : env.pm25 > 50 ? 'text-status-yellow' : 'text-status-green'">
                  {{ env.pm25 }}
                </td>
                <td class="py-2 px-3 text-center" :class="env.co2 > 1000 ? 'text-status-red' : env.co2 > 700 ? 'text-status-yellow' : 'text-text-primary'">
                  {{ env.co2 }}
                </td>
                <td class="py-2 px-3 text-center" :class="env.formaldehyde > 0.08 ? 'text-status-red' : env.formaldehyde > 0.05 ? 'text-status-yellow' : 'text-text-primary'">
                  {{ env.formaldehyde }}
                </td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="getStatusColor(env.status)">
                    <span class="w-2 h-2 rounded-full"
                      :class="env.status === 'normal' ? 'bg-status-green' : env.status === 'warning' ? 'bg-status-yellow' : 'bg-status-red animate-status-blink'"></span>
                    {{ getStatusLabel(env.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>

      <!-- 环境趋势 -->
      <div class="grid grid-cols-2 gap-3 h-[320px]">
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">24小时温度趋势</div>
          <LineChart
            :x-data="envTrendHours"
            :series="[{ name: '温度(°C)', data: temperatureTrend, color: '#f97316' }]"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">24小时CO₂趋势</div>
          <LineChart
            :x-data="envTrendHours"
            :series="[{ name: 'CO₂(ppm)', data: co2Trend, color: '#22c55e' }]"
          />
        </TechPanel>
      </div>
    </div>
  </div>
</template>
