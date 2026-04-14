import type { OpsDevice, ZoneEnergy, EnvironmentData } from './types'

// 设备数据
const deviceTemplates = [
  { category: 'elevator', name: '电梯', count: 6, locations: ['大厅', '2楼', '5楼', '10楼', '15楼', '18楼'] },
  { category: 'ac', name: '中央空调', count: 22, locations: Array.from({ length: 20 }, (_, i) => `${i + 1}楼空调`) },
  { category: 'ventilation', name: '新风系统', count: 10, locations: Array.from({ length: 10 }, (_, i) => `${(i + 1) * 2}楼新风机组`) },
  { category: 'cctv', name: '监控设备', count: 36, locations: Array.from({ length: 36 }, (_, i) => `CAM-${String(i + 1).padStart(3, '0')}`) },
  { category: 'lighting', name: '照明设备', count: 48, locations: Array.from({ length: 20 }, (_, i) => `${i + 1}楼公共区域照明`) },
  { category: 'plumbing', name: '给排水设备', count: 6, locations: ['B1水泵房', 'B2水泵房', '1楼', '10楼', '15楼', '20楼'] },
]

const modelMap: Record<string, string[]> = {
  elevator: ['OTIS-3200', 'Mitsubishi NEX', 'Schindler 5500'],
  ac: ['Daikin VRV-X', 'Gree GMV', 'Midea MDV'],
  ventilation: ['Honeywell ERV', 'Panasonic FY', 'Blueair 600'],
  cctv: ['Hikvision DS-2CD', 'Dahua IPC', 'Uniview IPC'],
  lighting: ['Philips Hue Pro', 'Opple Smart'],
  plumbing: ['Grundfos CR', 'Wilo MVI', 'Xylem e-SV'],
}

const faultTypes = ['通信异常', '电源故障', '机械故障', '传感器故障', '过热保护', '漏水']
const technicians = ['张工', '李工', '王工', '刘工', '陈工']

export function generateOpsDevices(): OpsDevice[] {
  const devices: OpsDevice[] = []
  let id = 1

  deviceTemplates.forEach(template => {
    for (let i = 0; i < Math.min(template.count, template.locations.length); i++) {
      const isFault = Math.random() < 0.05
      const isMaintenance = !isFault && Math.random() < 0.08

      // 故障历史
      const faultCount = isFault ? 0 : Math.floor(Math.random() * 3)
      const faultHistory: typeof template extends { faultHistory: any } ? any : any[] = []
      for (let f = 0; f < faultCount; f++) {
        const resolved = Math.random() > 0.2
        faultHistory.push({
          date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          type: faultTypes[Math.floor(Math.random() * faultTypes.length)],
          description: `${template.name}出现异常`,
          resolved,
          resolvedDate: resolved ? `2026-0${Math.floor(Math.random() * 3) + 2}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : undefined,
        })
      }

      // 当前故障（如果状态是fault）
      if (isFault) {
        faultHistory.push({
          date: `2026-04-${String(Math.floor(Math.random() * 13) + 1).padStart(2, '0')}`,
          type: faultTypes[Math.floor(Math.random() * faultTypes.length)],
          description: `${template.name}当前故障`,
          resolved: false,
        })
      }

      devices.push({
        id: `${template.category.slice(0, 3).toUpperCase()}-${String(id++).padStart(3, '0')}`,
        name: `${template.name}-${i + 1}`,
        category: template.category as OpsDevice['category'],
        model: modelMap[template.category][Math.floor(Math.random() * modelMap[template.category].length)],
        location: template.locations[i],
        installDate: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: isFault ? 'fault' : isMaintenance ? 'maintenance' : 'running',
        runHours: Math.floor(Math.random() * 10000) + 500,
        nextMaintenance: `2026-05-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        faultHistory,
        maintenanceHistory: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
          date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          technician: technicians[Math.floor(Math.random() * technicians.length)],
          description: ['定期保养', '故障修复', '部件更换', '系统检测'][Math.floor(Math.random() * 4)],
        })),
      })
    }
  })

  return devices
}

// 分区能耗数据
export function generateZoneEnergy(): ZoneEnergy[] {
  const zones = ['5楼 华为', '8楼 腾讯', '10楼 阿里', '12楼 字节', '15楼 商汤', '18楼 大疆', '1楼大厅', 'B1车库']
  return zones.map(name => ({
    name,
    electricity: Math.floor(Math.random() * 200) + 80,
    water: +(Math.random() * 15 + 3).toFixed(1),
    trend: Math.floor(Math.random() * 40) - 20,
  })).sort((a, b) => b.electricity - a.electricity)
}

// 环境数据
export function generateEnvironmentData(): EnvironmentData[] {
  const zones = ['1楼大厅', '5楼办公区', '10楼办公区', '15楼办公区', '3楼会议室', '8楼会议室', '地下车库']

  return zones.map(zone => {
    const temperature = +(Math.random() * 5 + 23).toFixed(1)
    const humidity = Math.floor(Math.random() * 20 + 45)
    const pm25 = Math.floor(Math.random() * 50 + 15)
    const co2 = Math.floor(Math.random() * 300 + 400)
    const formaldehyde = +(Math.random() * 0.08 + 0.01).toFixed(2)

    let status: EnvironmentData['status'] = 'normal'
    if (temperature > 28 || co2 > 650 || pm25 > 55 || formaldehyde > 0.08) {
      status = 'warning'
    }
    if (temperature > 30 || co2 > 800 || pm25 > 75 || formaldehyde > 0.1) {
      status = 'danger'
    }

    return { zone, temperature, humidity, pm25, co2, formaldehyde, status }
  })
}

// 设备分类统计
export function getDeviceCategoryStats(devices: OpsDevice[]) {
  const categories = ['elevator', 'ac', 'ventilation', 'cctv', 'lighting', 'plumbing'] as const
  const labels: Record<string, string> = {
    elevator: '电梯', ac: '空调', ventilation: '新风', cctv: '监控', lighting: '照明', plumbing: '给排水',
  }

  return categories.map(cat => {
    const catDevices = devices.filter(d => d.category === cat)
    return {
      key: cat,
      label: labels[cat],
      total: catDevices.length,
      running: catDevices.filter(d => d.status === 'running').length,
      fault: catDevices.filter(d => d.status === 'fault').length,
      maintenance: catDevices.filter(d => d.status === 'maintenance').length,
    }
  })
}
