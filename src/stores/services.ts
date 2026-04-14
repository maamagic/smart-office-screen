import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tenant, MeetingRoomInfo, MeetingReservation, ConvenienceService, Notice } from '@/mock/types'
import { generateTenants, generateMeetingRooms, generateMeetingReservations, generateConvenienceServices, generateNotices } from '@/mock/services'

export const useServicesStore = defineStore('services', () => {
  const tenants = ref<Tenant[]>(generateTenants())
  const meetingRooms = ref<MeetingRoomInfo[]>(generateMeetingRooms())
  const meetingReservations = ref<MeetingReservation[]>(generateMeetingReservations())
  const convenienceServices = ref<ConvenienceService[]>(generateConvenienceServices())
  const notices = ref<Notice[]>(generateNotices())

  // 统计
  const tenantStats = ref({
    total: tenants.value.length,
    pending: tenants.value.filter(t => t.status === 'pending').length,
    expiring: tenants.value.filter(t => t.status === 'expiring').length,
    totalEmployees: tenants.value.reduce((sum, t) => sum + t.employees, 0),
  })

  const meetingRoomStats = ref({
    total: meetingRooms.value.length,
    available: meetingRooms.value.filter(r => r.status === 'available').length,
    occupied: meetingRooms.value.filter(r => r.status === 'occupied').length,
    maintenance: meetingRooms.value.filter(r => r.status === 'maintenance').length,
  })

  const reservationStats = ref({
    total: meetingReservations.value.length,
    confirmed: meetingReservations.value.filter(r => r.status === 'confirmed').length,
    pending: meetingReservations.value.filter(r => r.status === 'pending').length,
    cancelled: meetingReservations.value.filter(r => r.status === 'cancelled').length,
  })

  const noticeStats = ref({
    total: notices.value.length,
    published: notices.value.filter(n => n.status === 'published').length,
    urgent: notices.value.filter(n => n.type === 'urgent').length,
  })

  return {
    tenants,
    meetingRooms,
    meetingReservations,
    convenienceServices,
    notices,
    tenantStats,
    meetingRoomStats,
    reservationStats,
    noticeStats,
  }
})
