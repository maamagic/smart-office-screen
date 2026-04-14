<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import TechPanel from '@/components/common/TechPanel.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'

const store = useAnalyticsStore()
const activeTab = ref('people')

const tabs = [
  { key: 'people', label: '人员趋势', icon: '👥' },
  { key: 'device', label: '设备统计', icon: '⚙️' },
  { key: 'energy', label: '能源统计', icon: '⚡' },
  { key: 'service', label: '服务统计', icon: '🛎️' },
  { key: 'report', label: '月度报表', icon: '📊' },
]

// 人员趋势图表数据
const peopleDates = computed(() => store.peopleTrend.map(d => d.date))
const peopleEmployeeData = computed(() => store.peopleTrend.map(d => d.employees))
const peopleVisitorData = computed(() => store.peopleTrend.map(d => d.visitors))

// 设备使用率图表数据
const deviceCategories = computed(() => store.deviceUsage.map(d => d.category))
const deviceUsageData = computed(() => store.deviceUsage.map(d => d.usageRate))
const deviceFaultData = computed(() => store.deviceUsage.map(d => d.faultRate))

// 能源趋势数据
const energyTypes = computed(() => store.energyStats.map(e => e.type))

// 服务统计图表
const serviceNames = computed(() => store.serviceStats.map(s => s.type))
const serviceCounts = computed(() => store.serviceStats.map(s => s.count))
const serviceSatisfaction = computed(() => store.serviceStats.map(s => s.satisfaction))

// 月度报表图表
const reportMonths = computed(() => store.monthlyReport.peopleMonthly.map(m => m.month))
const reportPeopleData = computed(() => store.monthlyReport.peopleMonthly.map(m => m.avgPeople))
const reportEnergyElec = computed(() => store.monthlyReport.energyMonthly.map(m => m.electricity))
const reportEnergyWater = computed(() => store.monthlyReport.energyMonthly.map(m => m.water))
const reportServiceData = computed(() => store.monthlyReport.serviceMonthly.map(m => m.services))
const reportSatisfactionData = computed(() => store.monthlyReport.serviceMonthly.map(m => m.satisfaction))
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

    <!-- 总览卡片 -->
    <div class="grid grid-cols-6 gap-3">
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-accent-blue">{{ store.overview.avgPeople }}</div>
        <div class="text-[10px] text-text-secondary mt-1">日均人数</div>
      </TechPanel>
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-status-green">{{ store.overview.totalDevices }}</div>
        <div class="text-[10px] text-text-secondary mt-1">设备总数</div>
      </TechPanel>
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-accent-blue">{{ store.overview.avgDeviceUsageRate }}%</div>
        <div class="text-[10px] text-text-secondary mt-1">设备使用率</div>
      </TechPanel>
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-status-orange">¥{{ (store.overview.totalEnergyCost / 10000).toFixed(1) }}w</div>
        <div class="text-[10px] text-text-secondary mt-1">能源总费用</div>
      </TechPanel>
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-accent-blue">{{ store.overview.totalServices }}</div>
        <div class="text-[10px] text-text-secondary mt-1">服务总次数</div>
      </TechPanel>
      <TechPanel class="text-center">
        <div class="text-xl font-display font-bold text-status-green">{{ store.overview.avgSatisfaction }}%</div>
        <div class="text-[10px] text-text-secondary mt-1">满意度</div>
      </TechPanel>
    </div>

    <!-- 人员趋势 -->
    <div v-if="activeTab === 'people'" class="flex-1 flex flex-col gap-3 min-h-0">
      <TechPanel class="flex-1">
        <div class="text-sm text-text-primary mb-2">30天人员变化趋势</div>
        <LineChart
          :x-data="peopleDates"
          :series="[
            { name: '员工', data: peopleEmployeeData, color: '#00d4ff' },
            { name: '访客', data: peopleVisitorData, color: '#a855f7' },
          ]"
        />
      </TechPanel>
    </div>

    <!-- 设备统计 -->
    <div v-if="activeTab === 'device'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-2 gap-3 flex-1">
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">设备分类使用率</div>
          <BarChart
            :categories="deviceCategories"
            :current="deviceUsageData"
            :previous="deviceFaultData"
            current-label="使用率(%)"
            previous-label="故障率(%)"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">设备分布</div>
          <DonutChart
            :data="store.deviceUsage.map((d, i) => ({
              name: d.category,
              value: d.total,
              color: ['#00d4ff', '#22c55e', '#a855f7', '#f97316', '#eab308', '#06b6d4'][i % 6]
            }))"
          />
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">设备明细</div>
        <div class="overflow-y-auto no-scrollbar max-h-[300px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">设备分类</th>
                <th class="py-2 px-3 text-center">数量</th>
                <th class="py-2 px-3 text-center">使用率</th>
                <th class="py-2 px-3 text-center">故障率</th>
                <th class="py-2 px-3 text-center">趋势</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in store.deviceUsage" :key="d.category" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-primary">{{ d.category }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ d.total }}</td>
                <td class="py-2 px-3 text-center text-status-green">{{ d.usageRate }}%</td>
                <td class="py-2 px-3 text-center" :class="d.faultRate > 5 ? 'text-status-red' : 'text-text-secondary'">{{ d.faultRate }}%</td>
                <td class="py-2 px-3 text-center" :class="d.trend >= 90 ? 'text-status-green' : 'text-status-yellow'">{{ d.trend }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>

    <!-- 能源统计 -->
    <div v-if="activeTab === 'energy'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-3 gap-3">
        <TechPanel v-for="e in store.energyStats" :key="e.type" class="flex flex-col">
          <div class="text-xs text-text-secondary mb-2">{{ e.type }}消耗</div>
          <div class="grid grid-cols-2 gap-2 flex-1">
            <div class="text-center">
              <div class="text-lg font-display font-bold text-accent-blue">{{ e.today }}</div>
              <div class="text-[10px] text-text-secondary">今日</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-display font-bold text-text-primary">{{ e.month }}</div>
              <div class="text-[10px] text-text-secondary">本月</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-display font-bold text-text-secondary">{{ e.year }}</div>
              <div class="text-[10px] text-text-secondary">本年</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-display font-bold text-status-orange">¥{{ e.cost }}</div>
              <div class="text-[10px] text-text-secondary">费用</div>
            </div>
          </div>
          <div class="mt-2 text-center text-xs" :class="e.trend < 0 ? 'text-status-green' : 'text-status-red'">
            同比 {{ e.trend > 0 ? '↑' : '↓' }}{{ Math.abs(e.trend) }}%
          </div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1">
        <div class="text-sm text-text-primary mb-2">能源费用对比</div>
        <BarChart
          :categories="energyTypes"
          :current="store.energyStats.map(e => e.cost)"
          :previous="store.energyStats.map(e => Math.floor(e.cost * 0.9))"
          current-label="本期费用"
          previous-label="上期费用"
        />
      </TechPanel>
    </div>

    <!-- 服务统计 -->
    <div v-if="activeTab === 'service'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-2 gap-3 flex-1">
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">服务类型统计</div>
          <BarChart
            :categories="serviceNames"
            :current="serviceCounts"
            :previous="serviceCounts.map(c => Math.floor(c * 0.85))"
            current-label="本期"
            previous-label="上期"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">服务满意度</div>
          <LineChart
            :x-data="serviceNames"
            :series="[{ name: '满意度(%)', data: serviceSatisfaction, color: '#22c55e' }]"
          />
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">服务明细</div>
        <div class="overflow-y-auto no-scrollbar max-h-[300px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">服务类型</th>
                <th class="py-2 px-3 text-center">服务次数</th>
                <th class="py-2 px-3 text-center">满意度</th>
                <th class="py-2 px-3 text-center">趋势</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in store.serviceStats" :key="s.type" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-primary">{{ s.type }}</td>
                <td class="py-2 px-3 text-center text-accent-blue">{{ s.count }}</td>
                <td class="py-2 px-3 text-center" :class="s.satisfaction >= 90 ? 'text-status-green' : s.satisfaction >= 80 ? 'text-status-yellow' : 'text-status-red'">
                  {{ s.satisfaction }}%
                </td>
                <td class="py-2 px-3 text-center text-status-green">{{ s.trend }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>

    <!-- 月度报表 -->
    <div v-if="activeTab === 'report'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-3 gap-3">
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">月度平均人数</div>
          <LineChart
            :x-data="reportMonths"
            :series="[{ name: '平均人数', data: reportPeopleData, color: '#00d4ff' }]"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">月度能源消耗</div>
          <LineChart
            :x-data="reportMonths"
            :series="[
              { name: '电力(kWh)', data: reportEnergyElec, color: '#00d4ff' },
              { name: '水(m³)', data: reportEnergyWater, color: '#22d3ee' },
            ]"
          />
        </TechPanel>
        <TechPanel>
          <div class="text-sm text-text-primary mb-2">月度服务统计</div>
          <LineChart
            :x-data="reportMonths"
            :series="[
              { name: '服务次数', data: reportServiceData, color: '#a855f7' },
              { name: '满意度', data: reportSatisfactionData, color: '#22c55e' },
            ]"
          />
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">年度数据汇总</div>
        <div class="overflow-y-auto no-scrollbar max-h-[350px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">月份</th>
                <th class="py-2 px-3 text-center">平均人数</th>
                <th class="py-2 px-3 text-center">峰值人数</th>
                <th class="py-2 px-3 text-center">电力(kWh)</th>
                <th class="py-2 px-3 text-center">水(m³)</th>
                <th class="py-2 px-3 text-center">服务次数</th>
                <th class="py-2 px-3 text-center">满意度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in reportMonths" :key="m" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-primary font-medium">{{ m }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ store.monthlyReport.peopleMonthly[i].avgPeople }}</td>
                <td class="py-2 px-3 text-center text-accent-blue">{{ store.monthlyReport.peopleMonthly[i].peakDay }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ store.monthlyReport.energyMonthly[i].electricity }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ store.monthlyReport.energyMonthly[i].water }}</td>
                <td class="py-2 px-3 text-center text-status-green">{{ store.monthlyReport.serviceMonthly[i].services }}</td>
                <td class="py-2 px-3 text-center text-status-green">{{ store.monthlyReport.serviceMonthly[i].satisfaction }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>
  </div>
</template>
