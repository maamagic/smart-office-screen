import type { UserAccount, AlertThreshold, SystemConfig, BackupRecord } from './types'

const usernames = ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'liqi', 'huangba', 'linjiu']
const roles: Array<'admin' | 'operator' | 'viewer'> = ['admin', 'operator', 'operator', 'viewer', 'viewer', 'operator', 'viewer', 'viewer']
const departments = ['物业管理部', '安保部', 'IT部', '行政部', '工程部']
const userStatuses: Array<'active' | 'inactive' | 'locked'> = ['active', 'active', 'active', 'active', 'active', 'inactive', 'locked', 'active']

export function generateUserAccounts(): UserAccount[] {
  return usernames.map((username, i) => ({
    id: `USR-${String(i + 1).padStart(4, '0')}`,
    username,
    role: roles[i],
    department: departments[i % departments.length],
    lastLogin: `2026-04-${String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    status: userStatuses[i],
  }))
}

export function generateAlertThresholds(): AlertThreshold[] {
  return [
    { id: 'THR-001', category: '环境', name: '温度上限', warning: 28, urgent: 32, unit: '°C', enabled: true },
    { id: 'THR-002', category: '环境', name: '湿度下限', warning: 30, urgent: 20, unit: '%', enabled: true },
    { id: 'THR-003', category: '环境', name: 'PM2.5上限', warning: 75, urgent: 150, unit: 'μg/m³', enabled: true },
    { id: 'THR-004', category: '环境', name: 'CO₂上限', warning: 1000, urgent: 2000, unit: 'ppm', enabled: true },
    { id: 'THR-005', category: '环境', name: '甲醛上限', warning: 0.08, urgent: 0.15, unit: 'mg/m³', enabled: true },
    { id: 'THR-006', category: '能源', name: '日用电上限', warning: 600, urgent: 800, unit: 'kWh', enabled: true },
    { id: 'THR-007', category: '能源', name: '日用水上限', warning: 100, urgent: 150, unit: 'm³', enabled: false },
    { id: 'THR-008', category: '设备', name: '设备故障率', warning: 5, urgent: 10, unit: '%', enabled: true },
    { id: 'THR-009', category: '人员', name: '在楼人数上限', warning: 1200, urgent: 1500, unit: '人', enabled: true },
    { id: 'THR-010', category: '安防', name: '离线摄像头数', warning: 2, urgent: 5, unit: '个', enabled: true },
  ]
}

export function generateSystemConfigs(): SystemConfig[] {
  return [
    { key: 'building_name', name: '楼宇名称', value: '智慧科技大厦', description: '显示在大屏顶部的楼宇名称' },
    { key: 'screen_resolution', name: '大屏分辨率', value: '1920x1080', description: '大屏目标分辨率' },
    { key: 'alert_ticker_speed', name: '预警滚动速度', value: '30', description: '预警信息滚动速度（秒/圈）' },
    { key: 'data_refresh_interval', name: '数据刷新间隔', value: '60', description: '自动刷新数据的时间间隔（秒）' },
    { key: 'weather_api_key', name: '天气API密钥', value: 'sk-xxxxxxx', description: '天气数据API密钥' },
    { key: 'logo_url', name: 'Logo地址', value: '/logo.png', description: '大屏左上角Logo图片路径' },
    { key: 'theme_color', name: '主题色', value: '#00d4ff', description: '大屏主题强调色' },
    { key: 'map_center', name: '地图中心点', value: '116.40,39.90', description: '3D地图中心坐标' },
  ]
}

export function generateBackupRecords(): BackupRecord[] {
  const records: BackupRecord[] = []
  const types: Array<'auto' | 'manual'> = ['auto', 'auto', 'auto', 'manual', 'auto', 'auto', 'manual', 'auto']
  const statuses: Array<'success' | 'failed' | 'in_progress'> = ['success', 'success', 'success', 'success', 'success', 'failed', 'success', 'success']

  for (let i = 0; i < 8; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    records.push({
      id: `BKP-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      size: `${(Math.random() * 500 + 50).toFixed(1)} MB`,
      type: types[i],
      status: statuses[i],
    })
  }
  return records
}
