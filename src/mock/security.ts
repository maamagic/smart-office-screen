import type { Camera, Person, FireDevice, SecurityAlert } from './types'

const zones = ['大厅', '1楼走廊', '5楼走廊', '10楼走廊', '15楼走廊', '电梯厅', '地下车库B1', '地下车库B2', '设备间', '室外入口']

const cameraNames = [
  '大厅正门摄像头', '大厅东侧摄像头', '1楼电梯厅', '5楼东侧走廊', '8楼西侧走廊',
  '10楼电梯厅', '15楼大厅', '地下车库入口', '地下车库B2-东区', '设备间门口',
  '室外大门', '室外停车场', '12楼走廊', '3楼消防通道', '7楼会议室走廊',
  '18楼高管区', '地下车库B1-西区', '2楼电梯厅', '9楼走廊', '屋顶入口',
]

export function generateCameras(): Camera[] {
  return cameraNames.map((name, i) => ({
    id: `CAM-${String(i + 1).padStart(3, '0')}`,
    name,
    zone: zones[i % zones.length],
    status: i === 12 ? 'offline' : i === 3 ? 'recording' : 'online',
    hasAlert: i === 5,
  }))
}

const employeeNames = ['张伟', '李娜', '王强', '刘洋', '陈明', '赵丽', '周杰', '吴芳', '郑浩', '孙丽']
const visitorNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
const strangerIds = ['S-001', 'S-002', 'S-003']
const companies = ['华为技术', '腾讯科技', '阿里巴巴', '字节跳动', '商汤科技', '大疆创新']

export function generatePersons(): Person[] {
  const persons: Person[] = []

  // 员工
  employeeNames.forEach((name, i) => {
    persons.push({
      id: `EMP-${String(i + 1).padStart(4, '0')}`,
      name,
      type: 'employee' as const,
      department: ['研发部', '市场部', '财务部', '人事部', '运营部'][i % 5],
      company: companies[i % companies.length],
      lastSeen: `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      lastLocation: `${Math.floor(Math.random() * 18) + 2}楼`,
    })
  })

  // 访客
  visitorNames.forEach((name, i) => {
    const checkedIn = Math.random() > 0.3
    persons.push({
      id: `VIS-${String(i + 1).padStart(4, '0')}`,
      name,
      type: 'visitor' as const,
      company: companies[i % companies.length],
      lastSeen: `${9 + i}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      lastLocation: `${Math.floor(Math.random() * 10) + 2}楼 ${companies[i % companies.length]}`,
      checkInTime: checkedIn ? `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
      checkOutTime: undefined,
      escort: ['张伟', '李娜', '王强'][i % 3],
    })
  })

  // 陌生人
  strangerIds.forEach((id, i) => {
    persons.push({
      id,
      name: `未登记人员-${id}`,
      type: 'stranger' as const,
      lastSeen: `${10 + i * 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      lastLocation: ['地下车库B2', '15楼走廊', '5楼消防通道'][i],
    })
  })

  return persons
}

export function generateFireDevices(): FireDevice[] {
  const devices: FireDevice[] = []
  let id = 1

  // 每层楼的消防设备
  for (let floor = 1; floor <= 20; floor++) {
    // 烟感 x2
    devices.push({
      id: `SMK-${String(id++).padStart(3, '0')}`,
      name: `${floor}楼烟感-1`,
      type: 'smoke',
      location: `${floor}楼走廊东侧`,
      status: floor === 15 ? 'alarm' : Math.random() < 0.9 ? 'normal' : 'unchecked',
      lastCheck: '2026-04-10',
    })
    devices.push({
      id: `SMK-${String(id++).padStart(3, '0')}`,
      name: `${floor}楼烟感-2`,
      type: 'smoke',
      location: `${floor}楼走廊西侧`,
      status: 'normal',
      lastCheck: '2026-04-10',
    })

    // 温感 x1
    devices.push({
      id: `HT-${String(id++).padStart(3, '0')}`,
      name: `${floor}楼温感`,
      type: 'heat',
      location: `${floor}楼大厅`,
      status: 'normal',
      lastCheck: '2026-04-08',
    })

    // 灭火器 x2
    devices.push({
      id: `EXT-${String(id++).padStart(3, '0')}`,
      name: `${floor}楼灭火器-1`,
      type: 'extinguisher',
      location: `${floor}楼电梯厅`,
      status: Math.random() < 0.95 ? 'normal' : 'fault',
      lastCheck: '2026-03-15',
    })

    // 消防栓 x1
    devices.push({
      id: `HYD-${String(id++).padStart(3, '0')}`,
      name: `${floor}楼消防栓`,
      type: 'hydrant',
      location: `${floor}楼走廊`,
      status: 'normal',
      lastCheck: '2026-03-20',
    })
  }

  // 应急照明
  for (let i = 0; i < 8; i++) {
    devices.push({
      id: `EL-${String(i + 1).padStart(3, '0')}`,
      name: `应急照明-${i + 1}`,
      type: 'emergency-light',
      location: ['大厅', '地下车库B1', '地下车库B2', '5楼', '10楼', '15楼', '18楼', '20楼'][i],
      status: 'normal',
      lastCheck: '2026-04-01',
    })
  }

  return devices
}

export function generateSecurityAlerts(): SecurityAlert[] {
  return [
    {
      id: 'SA-001',
      type: 'fire',
      level: 'urgent',
      title: '15楼烟感报警',
      description: '15楼走廊东侧烟感探测器触发报警，请立即前往查看',
      location: '15楼走廊东侧',
      timestamp: new Date(Date.now() - 300000),
      status: 'handling',
    },
    {
      id: 'SA-002',
      type: 'person',
      level: 'urgent',
      title: '陌生人员逗留超时',
      description: '地下车库B2区域检测到未登记人员逗留超过15分钟',
      location: '地下车库B2',
      timestamp: new Date(Date.now() - 600000),
      status: 'unhandled',
    },
    {
      id: 'SA-003',
      type: 'intrusion',
      level: 'warning',
      title: '消防通道占用',
      description: '5楼东侧消防通道检测到障碍物堆积',
      location: '5楼消防通道',
      timestamp: new Date(Date.now() - 1800000),
      status: 'unhandled',
    },
    {
      id: 'SA-004',
      type: 'camera',
      level: 'warning',
      title: '监控摄像头离线',
      description: '12楼走廊CAM-013摄像头失去连接',
      location: '12楼走廊',
      timestamp: new Date(Date.now() - 3600000),
      status: 'handling',
    },
    {
      id: 'SA-005',
      type: 'person',
      level: 'info',
      title: '访客超时未离开',
      description: '访客张三（VIS-001）已超过预约时间2小时未离开',
      location: '8楼 字节跳动',
      timestamp: new Date(Date.now() - 7200000),
      status: 'resolved',
    },
    {
      id: 'SA-006',
      type: 'intrusion',
      level: 'info',
      title: '夜间人员活动',
      description: '22:30检测到18楼有人员活动，请确认是否为加班人员',
      location: '18楼高管区',
      timestamp: new Date(Date.now() - 86400000),
      status: 'resolved',
    },
    {
      id: 'SA-007',
      type: 'fire',
      level: 'warning',
      title: '灭火器压力不足',
      description: '3楼灭火器EXT-045压力表读数低于标准值',
      location: '3楼电梯厅',
      timestamp: new Date(Date.now() - 172800000),
      status: 'unhandled',
    },
  ]
}
