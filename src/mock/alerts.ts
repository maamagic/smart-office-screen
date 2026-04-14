import type { AlertMessage } from './types'

const alertTemplates: Omit<AlertMessage, 'id' | 'timestamp'>[] = [
  { level: 'urgent', category: 'equipment', title: '电梯3号门机故障', description: '大厅3号电梯门机异常，建议立即停机检修', location: '大厅' },
  { level: 'urgent', category: 'safety', title: '15楼走廊烟感异常', description: '15楼东侧走廊烟感探测器触发报警，请立即前往查看', location: '15楼走廊' },
  { level: 'urgent', category: 'safety', title: '地下车库陌生人员逗留', description: '地下车库B2区域检测到未登记人员逗留超过10分钟', location: '地下车库B2' },
  { level: 'warning', category: 'energy', title: '8楼今日用电量超标', description: '8楼今日用电量超出预算20%，请检查空调使用情况', location: '8楼' },
  { level: 'warning', category: 'energy', title: '整体用水量同比增长', description: '本月用水量同比增长18%，建议排查管道漏水', location: '全楼' },
  { level: 'warning', category: 'equipment', title: '15楼空调压缩机异常', description: '15楼中央空调压缩机运行温度偏高，建议安排检修', location: '15楼设备间' },
  { level: 'warning', category: 'equipment', title: '新风系统滤网更换提醒', description: '8楼新风系统滤网使用已达90天，建议更换', location: '8楼' },
  { level: 'warning', category: 'safety', title: '5楼消防通道占用', description: '5楼东侧消防通道检测到障碍物，请及时清理', location: '5楼' },
  { level: 'info', category: 'notice', title: '电梯维保通知', description: '今日18:00-22:00进行3号电梯维保，请避开使用', location: '大厅' },
  { level: 'info', category: 'notice', title: '明日暴雨预警', description: '气象台发布暴雨黄色预警，请注意关闭窗户', location: '全楼' },
  { level: 'info', category: 'notice', title: '会议室系统升级', description: '今晚22:00-次日6:00会议室预约系统升级维护', location: '全楼' },
  { level: 'info', category: 'notice', title: '物业费缴纳提醒', description: '本月物业费缴纳截止日期为4月25日', location: '全楼' },
  { level: 'warning', category: 'equipment', title: '监控摄像头离线', description: '地下车库B1区域3号摄像头离线，请检查网络连接', location: '地下车库B1' },
  { level: 'info', category: 'notice', title: '节能模式启动', description: '公共区域照明已切换至节能模式，亮度降低30%', location: '公共区域' },
  { level: 'warning', category: 'energy', title: '12楼电费超标预警', description: '12楼今日用电量超标25%，疑似空调未及时关闭', location: '12楼' },
]

let alertCounter = 0

function createAlert(template: Omit<AlertMessage, 'id' | 'timestamp'>): AlertMessage {
  alertCounter++
  return {
    ...template,
    id: `alert-${alertCounter}-${Date.now()}`,
    timestamp: new Date(),
  }
}

export function generateInitialAlerts(): AlertMessage[] {
  const selected = alertTemplates.slice(0, 8)
  return selected.map((t, i) => {
    const alert = createAlert(t)
    alert.timestamp = new Date(Date.now() - i * 300000)
    return alert
  })
}

export function generateRandomAlert(): AlertMessage {
  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)]
  return createAlert(template)
}
