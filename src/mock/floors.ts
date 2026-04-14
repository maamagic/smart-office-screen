import type { FloorStatus, MeetingRoom, ElevatorStatus, TodayEvent } from './types'

const tenantNames = [
  '停车场', '停车场',
  '大厅/前台', '华为技术有限公司', '腾讯科技（深圳）', '阿里巴巴网络技术',
  '字节跳动科技', '中科创达软件', '商汤科技有限公司', '大疆创新科技',
  '蔚来汽车科技', '比亚迪电子', '中兴通讯股份', '紫光展锐科技',
  '京东方科技集团', '小米科技有限公司', '百度在线网络技术', '网易（杭州）网络',
  '美团科技有限公司', '快手科技有限公司', '行政中心/会议层', '行政中心/高管层',
]

export function generateFloorData(): FloorStatus[] {
  return Array.from({ length: 22 }, (_, i) => {
    const floorNumber = i < 2 ? `B${2 - i}` : `${i - 1}F`
    const floorLabel = i < 2 ? `地下${2 - i}层` : `${i - 1}层`
    const statusPool: FloorStatus['status'][] = ['occupied', 'occupied', 'occupied', 'idle', 'fault', 'construction']
    let status: FloorStatus['status'] = 'occupied'
    if (i < 2) status = 'occupied'
    else if (i >= 20) status = 'occupied'
    else status = statusPool[Math.floor(Math.random() * (Math.random() < 0.8 ? 4 : 6))]

    return {
      floorNumber,
      floorLabel,
      tenantName: tenantNames[i] || '空置',
      currentPeople: i < 2 ? 0 : Math.floor(Math.random() * 50) + 5,
      status,
      areas: generateFloorAreas(i),
    }
  })
}

function generateFloorAreas(floorIndex: number): FloorStatus['areas'] {
  const areas: FloorStatus['areas'] = []

  // 电梯
  if (floorIndex >= 2) {
    areas.push({
      type: 'elevator',
      name: '客梯',
      status: Math.random() < 0.95 ? 'normal' : 'fault',
    })
  }

  // 消防通道
  areas.push({
    type: 'fire-passage',
    name: '消防通道',
    status: Math.random() < 0.9 ? 'normal' : 'occupied',
  })

  // 会议室
  if (floorIndex >= 2) {
    const meetingStatus: FloorStatus['areas'][0]['status'][] = ['idle', 'occupied', 'occupied', 'idle']
    areas.push({
      type: 'meeting-room',
      name: '会议室',
      status: meetingStatus[Math.floor(Math.random() * meetingStatus.length)],
    })
  }

  // 监控
  areas.push({
    type: 'cctv',
    name: '监控',
    status: Math.random() < 0.92 ? 'normal' : 'offline',
  })

  return areas
}

export function generateMeetingRooms(): MeetingRoom[] {
  const names = ['和风厅', '明月厅', '星辰厅', '碧波厅', '晨曦厅', '云端厅', '翠竹厅', '锦绣厅']
  const statuses: MeetingRoom['status'][] = ['idle', 'occupied', 'reserved', 'idle', 'occupied', 'idle', 'reserved', 'idle']
  return names.map((name, i) => ({
    name,
    capacity: [10, 20, 8, 30, 12, 15, 8, 20][i],
    status: statuses[i],
    currentMeeting: statuses[i] === 'occupied' ? ['项目评审会', '产品讨论会'][i % 2] : undefined,
    timeRange: statuses[i] !== 'idle' ? [`${9 + i}:00-${10 + i}:30`][0] : undefined,
  }))
}

export function generateElevators(): ElevatorStatus[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `${i + 1}号梯`,
    currentFloor: Math.floor(Math.random() * 20) - 1,
    direction: (['up', 'down', 'idle'] as const)[Math.floor(Math.random() * 3)],
    status: i === 2 && Math.random() < 0.3 ? 'fault' : 'running' as const,
  }))
}

export function generateTodayEvents(): TodayEvent[] {
  return [
    { time: '08:30', title: '保洁人员到岗签到', type: 'notice' },
    { time: '09:00', title: '华为技术 - 项目评审会 (和风厅)', type: 'meeting' },
    { time: '10:00', title: '3号电梯年度维保', type: 'maintenance' },
    { time: '10:30', title: '腾讯科技 - 访客接待 (5人)', type: 'visit' },
    { time: '14:00', title: '阿里巴巴 - 产品演示会 (星辰厅)', type: 'meeting' },
    { time: '15:00', title: '消防设备月度巡检', type: 'maintenance' },
    { time: '16:30', title: '比亚迪电子 - 客户来访 (3人)', type: 'visit' },
    { time: '18:00', title: '公共区域照明节能模式开启', type: 'notice' },
  ]
}
