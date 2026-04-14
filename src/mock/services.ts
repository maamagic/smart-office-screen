import type { Tenant, MeetingRoomInfo, MeetingReservation, ConvenienceService, Notice } from './types'

const tenantNames = [
  '华为技术有限公司', '腾讯科技有限公司', '阿里巴巴集团', '字节跳动科技', '商汤科技',
  '大疆创新科技', '小米科技', '百度在线网络', '京东集团', '美团点评',
  '网易公司', '携程旅行网', '滴滴出行', '拼多多', '快手科技',
]

const contactNames = ['张总', '李总', '王经理', '赵总监', '刘主管', '陈总', '林经理', '黄总监']

export function generateTenants(): Tenant[] {
  const floors = ['5F', '8F', '10F', '12F', '15F', '18F', '19F', '20F']
  const statuses: Array<'normal' | 'pending' | 'expiring'> = ['normal', 'normal', 'normal', 'normal', 'pending', 'expiring']

  return tenantNames.map((name, i) => ({
    id: `TEN-${String(i + 1).padStart(4, '0')}`,
    name,
    floor: floors[i % floors.length],
    area: Math.floor(Math.random() * 500) + 200,
    employees: Math.floor(Math.random() * 100) + 20,
    contact: contactNames[i % contactNames.length],
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    leaseEnd: `2027-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }))
}

const meetingRoomNames = [
  '会议室A-小型', '会议室B-小型', '会议室C-中型', '会议室D-中型', '会议室E-大型',
  '会议室F-大型', '培训室G', 'VIP会议室H', '视频会议室I', '多功能厅J',
]

const equipmentOptions = ['投影仪', '白板', '电视', '视频会议系统', '音响', '麦克风', '空气净化器']

export function generateMeetingRooms(): MeetingRoomInfo[] {
  const floors = ['5F', '8F', '10F', '15F', '18F']
  const statuses: Array<'available' | 'occupied' | 'maintenance'> = ['available', 'available', 'available', 'occupied', 'occupied', 'maintenance']

  return meetingRoomNames.map((name, i) => ({
    id: `MR-${String(i + 1).padStart(3, '0')}`,
    name,
    floor: floors[i % floors.length],
    capacity: [6, 6, 10, 10, 20, 20, 30, 8, 12, 50][i],
    equipment: equipmentOptions.slice(0, Math.floor(Math.random() * 4) + 2),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}

const companyNames = ['华为', '腾讯', '阿里', '字节', '商汤', '大疆', '小米', '百度']
const applicantNames = ['张三', '李四', '王五', '赵六', '刘七', '陈八', '林九', '黄十']
const meetingTopics = [
  '产品需求评审', '技术架构讨论', '季度总结会议', '客户接待', '团队周会',
  '项目启动会', '设计评审', '代码审查', '培训讲座', '股东会',
]

export function generateMeetingReservations(): MeetingReservation[] {
  const reservations: MeetingReservation[] = []
  const statuses: Array<'confirmed' | 'pending' | 'cancelled'> = ['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled']
  const timeRanges = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00']

  for (let i = 0; i < 15; i++) {
    reservations.push({
      id: `RES-${String(i + 1).padStart(4, '0')}`,
      roomName: meetingRoomNames[Math.floor(Math.random() * meetingRoomNames.length)],
      company: companyNames[Math.floor(Math.random() * companyNames.length)],
      applicant: applicantNames[Math.floor(Math.random() * applicantNames.length)],
      date: `2026-04-${String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')}`,
      timeRange: timeRanges[Math.floor(Math.random() * timeRanges.length)],
      topic: meetingTopics[Math.floor(Math.random() * meetingTopics.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    })
  }
  return reservations
}

const serviceNames = [
  { name: '楼内咖啡厅', type: 'food' as const, desc: '现磨咖啡、茶饮、糕点' },
  { name: '员工餐厅', type: 'food' as const, desc: '早中晚三餐，自助选餐' },
  { name: '便利店', type: 'shopping' as const, desc: '日常用品、食品饮料' },
  { name: '医务室', type: 'medical' as const, desc: '基础医疗咨询、急救' },
  { name: '班车站点', type: 'transport' as const, desc: '上下班通勤班车' },
  { name: '停车场', type: 'transport' as const, desc: 'B1-B2地下停车场' },
  { name: '快递柜', type: 'other' as const, desc: '顺丰、京东快递柜' },
  { name: '打印服务中心', type: 'other' as const, desc: '打印、复印、装订' },
  { name: '健身房', type: 'other' as const, desc: '24小时健身' },
  { name: 'ATM机', type: 'other' as const, desc: '工商银行、建设银行' },
]

export function generateConvenienceServices(): ConvenienceService[] {
  return serviceNames.map((s, i) => ({
    id: `SVC-${String(i + 1).padStart(3, '0')}`,
    name: s.name,
    type: s.type,
    description: s.desc,
    location: ['1F东侧', '2F', '1F大厅', '3F', '楼外东侧', 'B1', '1F大厅', '2F西侧', '4F', '1F大厅'][i],
    hours: ['08:00-20:00', '07:00-19:00', '24小时', '09:00-18:00', '07:30-09:00, 17:00-19:00', '24小时', '24小时', '09:00-18:00', '24小时', '24小时'][i],
    phone: i === 0 ? '010-88886001' : i === 1 ? '010-88886002' : '-',
    rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
  }))
}

const noticeTemplates = [
  { title: '关于五一劳动节放假通知', type: 'notice' as const, content: '根据国务院办公厅通知精神，结合公司实际情况，现将2026年劳动节放假安排通知如下...' },
  { title: '消防演练通知', type: 'urgent' as const, content: '为提高员工消防安全意识，定于本周四下午15:00进行消防疏散演练...' },
  { title: '电梯维护保养通知', type: 'maintenance' as const, content: '为保障电梯安全运行，将于本周六对2号、3号电梯进行定期维护保养...' },
  { title: '楼内网络升级通知', type: 'maintenance' as const, content: '为提升网络服务质量，将于本周日凌晨2:00-5:00进行网络设备升级...' },
  { title: '春季运动会报名通知', type: 'activity' as const, content: '为丰富员工业余生活，增强体质，公司将于下月举办春季运动会...' },
  { title: '停车场收费调整通知', type: 'notice' as const, content: '根据市场价格变动，自5月1日起调整停车场收费标准...' },
  { title: '新员工入驻欢迎通知', type: 'notice' as const, content: '欢迎商汤科技入驻15楼，祝大家合作愉快...' },
]

export function generateNotices(): Notice[] {
  return noticeTemplates.map((t, i) => ({
    id: `NOT-${String(i + 1).padStart(4, '0')}`,
    title: t.title,
    content: t.content,
    type: t.type,
    publisher: ['行政部', '安保部', '物业部', 'IT部', '工会', '物业部', '行政部'][i],
    publishTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    targetAudience: ['全体员工', '全体员工', '全体员工', '全体员工', '全体员工', '车主', '全体员工'][i],
    status: i < 6 ? 'published' as const : 'draft' as const,
  }))
}
