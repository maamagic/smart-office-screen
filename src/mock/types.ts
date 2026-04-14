// 天气信息
export interface WeatherInfo {
  temperature: number
  humidity: number
  windLevel: number
  windDirection: string
  condition: 'sunny' | 'cloudy' | 'overcast' | 'rain' | 'snow' | 'fog'
  pm25: number
  icon: string
}

// 入驻企业概览
export interface TenantOverview {
  total: number
  newToday: number
  vacancyRate: number
  vacantFloors: number
}

// 人员概览
export interface PeopleOverview {
  total: number
  employees: number
  visitors: number
  floorDistribution: FloorPeople[]
}

export interface FloorPeople {
  floor: string
  count: number
}

// 能源消耗概览
export interface EnergyOverview {
  daily: {
    electricity: number
    water: number
    gas: number
  }
  comparison: {
    electricity: number
    water: number
    gas: number
  }
  isOverBudget: boolean
}

// 设备运行概览
export interface EquipmentOverview {
  total: number
  running: number
  faulty: number
  rate: number
  faultyList: FaultyEquipment[]
}

export interface FaultyEquipment {
  name: string
  location: string
  type: string
}

// 访客预约概览
export interface VisitorOverview {
  total: number
  checkedIn: number
  pending: number
  checkInRate: number
}

// 楼层状态
export interface FloorStatus {
  floorNumber: string
  floorLabel: string
  tenantName: string
  currentPeople: number
  status: 'idle' | 'occupied' | 'fault' | 'construction'
  areas: FloorArea[]
}

export interface FloorArea {
  type: 'elevator' | 'fire-passage' | 'meeting-room' | 'restroom' | 'cctv'
  name: string
  status: 'normal' | 'fault' | 'occupied' | 'idle' | 'offline'
  detail?: string
}

// 预警信息
export interface AlertMessage {
  id: string
  level: 'urgent' | 'warning' | 'info'
  category: 'equipment' | 'safety' | 'energy' | 'notice'
  title: string
  description: string
  timestamp: Date
  location: string
}

// 侧边面板数据
export interface MeetingRoom {
  name: string
  capacity: number
  status: 'idle' | 'occupied' | 'reserved'
  currentMeeting?: string
  timeRange?: string
}

export interface ElevatorStatus {
  id: string
  currentFloor: number
  direction: 'up' | 'down' | 'idle'
  status: 'running' | 'stopped' | 'fault'
}

export interface TodayEvent {
  time: string
  title: string
  type: 'maintenance' | 'meeting' | 'visit' | 'notice'
}

// ============ 安防模块 ============

// 监控摄像头
export interface Camera {
  id: string
  name: string
  zone: string
  status: 'online' | 'offline' | 'recording'
  hasAlert: boolean
}

// 人员信息
export interface Person {
  id: string
  name: string
  type: 'employee' | 'visitor' | 'stranger'
  department?: string
  company?: string
  lastSeen: string
  lastLocation: string
  checkInTime?: string
  checkOutTime?: string
  escort?: string
}

// 消防设备
export interface FireDevice {
  id: string
  name: string
  type: 'smoke' | 'heat' | 'extinguisher' | 'hydrant' | 'emergency-light'
  location: string
  status: 'normal' | 'fault' | 'alarm' | 'unchecked'
  lastCheck?: string
}

// 安防预警
export interface SecurityAlert {
  id: string
  type: 'camera' | 'person' | 'fire' | 'intrusion'
  level: 'urgent' | 'warning' | 'info'
  title: string
  description: string
  location: string
  timestamp: Date
  status: 'unhandled' | 'handling' | 'resolved'
}
