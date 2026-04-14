import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PeopleTrendData, DeviceUsageStats, EnergyStats, ServiceStats } from '@/mock/types'
import { generatePeopleTrendData, generateDeviceUsageStats, generateEnergyStats, generateServiceStats, generateMonthlyReport } from '@/mock/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const peopleTrend = ref<PeopleTrendData[]>(generatePeopleTrendData())
  const deviceUsage = ref<DeviceUsageStats[]>(generateDeviceUsageStats())
  const energyStats = ref<EnergyStats[]>(generateEnergyStats())
  const serviceStats = ref<ServiceStats[]>(generateServiceStats())
  const monthlyReport = ref(generateMonthlyReport())

  // 综合统计
  const overview = ref({
    avgPeople: Math.floor(peopleTrend.value.reduce((sum, d) => sum + d.total, 0) / peopleTrend.value.length),
    totalDevices: deviceUsage.value.reduce((sum, d) => sum + d.total, 0),
    avgDeviceUsageRate: Math.floor(deviceUsage.value.reduce((sum, d) => sum + d.usageRate, 0) / deviceUsage.value.length),
    totalEnergyCost: energyStats.value.reduce((sum, e) => sum + e.cost, 0),
    totalServices: serviceStats.value.reduce((sum, s) => sum + s.count, 0),
    avgSatisfaction: Math.floor(serviceStats.value.reduce((sum, s) => sum + s.satisfaction, 0) / serviceStats.value.length),
  })

  return {
    peopleTrend,
    deviceUsage,
    energyStats,
    serviceStats,
    monthlyReport,
    overview,
  }
})
