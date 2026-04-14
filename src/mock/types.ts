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

// ============ 运维模块 ============

// 运维设备
export interface OpsDevice {
  id: string
  name: string
  category: 'elevator' | 'ac' | 'ventilation' | 'cctv' | 'lighting' | 'plumbing'
  model: string
  location: string
  installDate: string
  status: 'running' | 'stopped' | 'fault' | 'maintenance'
  runHours: number
  nextMaintenance: string
  faultHistory: FaultRecord[]
  maintenanceHistory: MaintenanceRecord[]
}

export interface FaultRecord {
  date: string
  type: string
  description: string
  resolved: boolean
  resolvedDate?: string
}

export interface MaintenanceRecord {
  date: string
  technician: string
  description: string
}

// 能源数据
export interface EnergyData {
  daily: number
  monthly: number
  yearly: number
  yesterday: number
  lastMonth: number
  lastYear: number
}

// 分区能耗
export interface ZoneEnergy {
  name: string
  electricity: number
  water: number
  trend: number // 同比百分比
}

// 环境数据
export interface EnvironmentData {
  zone: string
  temperature: number
  humidity: number
  pm25: number
  co2: number
  formaldehyde: number
  status: 'normal' | 'warning' | 'danger'
}

// ============ 企业服务模块 ============

// 入驻企业
export interface Tenant {
  id: string
  name: string
  floor: string
  area: number
  employees: number
  contact: string
  phone: string
  status: 'normal' | 'pending' | 'expiring'
  leaseEnd: string
}

// 会议室
export interface MeetingRoomInfo {
  id: string
  name: string
  floor: string
  capacity: number
  equipment: string[]
  status: 'available' | 'occupied' | 'maintenance'
}

// 会议室预约
export interface MeetingReservation {
  id: string
  roomName: string
  company: string
  applicant: string
  date: string
  timeRange: string
  topic: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

// 便民服务
export interface ConvenienceService {
  id: string
  name: string
  type: 'food' | 'transport' | 'medical' | 'shopping' | 'repair' | 'other'
  description: string
  location: string
  hours: string
  phone: string
  rating: number
}

// 通知公告
export interface Notice {
  id: string
  title: string
  content: string
  type: 'notice' | 'urgent' | 'maintenance' | 'activity'
  publisher: string
  publishTime: Date
  targetAudience: string
  status: 'published' | 'draft' | 'expired'
}

// ============ 数据统计模块 ============

// 人员统计趋势
export interface PeopleTrendData {
  date: string
  employees: number
  visitors: number
  total: number
}

// 设备使用统计
export interface DeviceUsageStats {
  category: string
  total: number
  usageRate: number
  faultRate: number
  trend: number
}

// 能源统计
export interface EnergyStats {
  type: string
  today: number
  month: number
  year: number
  cost: number
  trend: number
}

// 服务统计
export interface ServiceStats {
  type: string
  count: number
  satisfaction: number
  trend: number
}

// ============ 系统设置模块 ============

// 用户账号
export interface UserAccount {
  id: string
  username: string
  role: 'admin' | 'operator' | 'viewer'
  department: string
  lastLogin: string
  status: 'active' | 'inactive' | 'locked'
}

// 预警阈值配置
export interface AlertThreshold {
  id: string
  category: string
  name: string
  warning: number
  urgent: number
  unit: string
  enabled: boolean
}

// 系统配置
export interface SystemConfig {
  key: string
  name: string
  value: string
  description: string
}

// 数据备份记录
export interface BackupRecord {
  id: string
  date: string
  time: string
  size: string
  type: 'auto' | 'manual'
  status: 'success' | 'failed' | 'in_progress'
}
