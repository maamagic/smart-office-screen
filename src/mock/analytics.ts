import type { PeopleTrendData, DeviceUsageStats, EnergyStats, ServiceStats } from './types'

export function generatePeopleTrendData(): PeopleTrendData[] {
  const data: PeopleTrendData[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const employees = Math.floor(Math.random() * 300) + 800
    const visitors = Math.floor(Math.random() * 50) + 30
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      employees,
      visitors,
      total: employees + visitors,
    })
  }
  return data
}

export function generateDeviceUsageStats(): DeviceUsageStats[] {
  const categories = ['电梯系统', '空调系统', '通风系统', '监控系统', '照明系统', '给排水系统']
  return categories.map(cat => ({
    category: cat,
    total: Math.floor(Math.random() * 30) + 10,
    usageRate: Math.floor(Math.random() * 20) + 75,
    faultRate: Math.floor(Math.random() * 8),
    trend: Math.floor(Math.random() * 20) + 85,
  }))
}

export function generateEnergyStats(): EnergyStats[] {
  return [
    {
      type: '电力',
      today: Math.floor(Math.random() * 200) + 400,
      month: Math.floor(Math.random() * 5000) + 12000,
      year: Math.floor(Math.random() * 20000) + 60000,
      cost: Math.floor(Math.random() * 5000) + 15000,
      trend: Math.floor(Math.random() * 10) - 3,
    },
    {
      type: '水',
      today: +(Math.random() * 30 + 50).toFixed(1),
      month: Math.floor(Math.random() * 500) + 1500,
      year: Math.floor(Math.random() * 3000) + 8000,
      cost: Math.floor(Math.random() * 2000) + 5000,
      trend: Math.floor(Math.random() * 8) - 2,
    },
    {
      type: '燃气',
      today: Math.floor(Math.random() * 50) + 100,
      month: Math.floor(Math.random() * 800) + 2000,
      year: Math.floor(Math.random() * 5000) + 15000,
      cost: Math.floor(Math.random() * 3000) + 8000,
      trend: Math.floor(Math.random() * 12) - 4,
    },
  ]
}

export function generateServiceStats(): ServiceStats[] {
  return [
    { type: '会议室预约', count: Math.floor(Math.random() * 100) + 200, satisfaction: Math.floor(Math.random() * 10) + 85, trend: Math.floor(Math.random() * 15) + 90 },
    { type: '访客预约', count: Math.floor(Math.random() * 50) + 100, satisfaction: Math.floor(Math.random() * 8) + 88, trend: Math.floor(Math.random() * 10) + 92 },
    { type: '便民服务', count: Math.floor(Math.random() * 200) + 500, satisfaction: Math.floor(Math.random() * 12) + 80, trend: Math.floor(Math.random() * 8) + 88 },
    { type: '报修处理', count: Math.floor(Math.random() * 30) + 50, satisfaction: Math.floor(Math.random() * 15) + 78, trend: Math.floor(Math.random() * 10) + 85 },
    { type: '投诉建议', count: Math.floor(Math.random() * 20) + 10, satisfaction: Math.floor(Math.random() * 10) + 85, trend: Math.floor(Math.random() * 12) + 82 },
  ]
}

// 月度报表数据
export function generateMonthlyReport() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return {
    peopleMonthly: months.map(m => ({
      month: m,
      avgPeople: Math.floor(Math.random() * 200) + 900,
      peakDay: Math.floor(Math.random() * 300) + 1200,
    })),
    energyMonthly: months.map(m => ({
      month: m,
      electricity: Math.floor(Math.random() * 3000) + 10000,
      water: Math.floor(Math.random() * 500) + 1000,
    })),
    serviceMonthly: months.map(m => ({
      month: m,
      services: Math.floor(Math.random() * 500) + 800,
      satisfaction: Math.floor(Math.random() * 10) + 85,
    })),
  }
}
