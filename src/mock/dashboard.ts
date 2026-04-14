import type {
  TenantOverview,
  PeopleOverview,
  EnergyOverview,
  EquipmentOverview,
  VisitorOverview,
} from './types'

export function generateTenantData(): TenantOverview {
  return {
    total: 32,
    newToday: Math.floor(Math.random() * 2),
    vacancyRate: +(Math.random() * 10 + 5).toFixed(1),
    vacantFloors: Math.floor(Math.random() * 2) + 1,
  }
}

export function generatePeopleData(): PeopleOverview {
  const hour = new Date().getHours()
  let base: number
  if (hour >= 9 && hour < 12) base = 850
  else if (hour >= 12 && hour < 14) base = 620
  else if (hour >= 14 && hour < 18) base = 900
  else if (hour >= 18 && hour < 20) base = 350
  else base = 80

  const total = base + Math.floor(Math.random() * 100) - 50
  const employees = Math.floor(total * 0.82)
  const visitors = total - employees

  return {
    total,
    employees,
    visitors,
    floorDistribution: Array.from({ length: 20 }, (_, i) => ({
      floor: i < 2 ? `B${2 - i}` : `${i - 1}F`,
      count: Math.floor(Math.random() * 60) + 10,
    })),
  }
}

export function generateEnergyData(): EnergyOverview {
  const electricity = +(Math.random() * 500 + 800).toFixed(1)
  const water = +(Math.random() * 50 + 60).toFixed(1)
  const gas = +(Math.random() * 30 + 25).toFixed(1)

  return {
    daily: { electricity, water, gas },
    comparison: {
      electricity: +(Math.random() * 20 - 10).toFixed(1),
      water: +(Math.random() * 16 - 8).toFixed(1),
      gas: +(Math.random() * 12 - 6).toFixed(1),
    },
    isOverBudget: Math.random() < 0.15,
  }
}

export function generateEquipmentData(): EquipmentOverview {
  const total = 128
  const faulty = Math.floor(Math.random() * 3)
  const running = total - faulty

  const faultyNames = [
    { name: '3号电梯', location: '大厅', type: '门机故障' },
    { name: '15楼空调', location: '15楼办公区', type: '压缩机异常' },
    { name: '8楼新风机组', location: '8楼设备间', type: '风机故障' },
    { name: '监控摄像头#12', location: '地下车库B1', type: '离线' },
    { name: '5楼照明控制器', location: '5楼走廊', type: '通信异常' },
  ]

  return {
    total,
    running,
    faulty,
    rate: +((running / total) * 100).toFixed(1),
    faultyList: faultyNames.slice(0, faulty),
  }
}

export function generateVisitorData(): VisitorOverview {
  const total = Math.floor(Math.random() * 15) + 22
  const checkedIn = Math.floor(total * (Math.random() * 0.3 + 0.55))
  const pending = total - checkedIn

  return {
    total,
    checkedIn,
    pending,
    checkInRate: +((checkedIn / total) * 100).toFixed(1),
  }
}
