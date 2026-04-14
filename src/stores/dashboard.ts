import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  TenantOverview,
  PeopleOverview,
  EnergyOverview,
  EquipmentOverview,
  VisitorOverview,
  FloorStatus,
  MeetingRoom,
  ElevatorStatus,
  TodayEvent,
} from '@/mock/types'
import {
  generateTenantData,
  generatePeopleData,
  generateEnergyData,
  generateEquipmentData,
  generateVisitorData,
} from '@/mock/dashboard'
import { generateFloorData, generateMeetingRooms, generateElevators, generateTodayEvents } from '@/mock/floors'

export const useDashboardStore = defineStore('dashboard', () => {
  const tenants = ref<TenantOverview>(generateTenantData())
  const people = ref<PeopleOverview>(generatePeopleData())
  const energy = ref<EnergyOverview>(generateEnergyData())
  const equipment = ref<EquipmentOverview>(generateEquipmentData())
  const visitors = ref<VisitorOverview>(generateVisitorData())
  const floors = ref<FloorStatus[]>(generateFloorData())
  const meetingRooms = ref<MeetingRoom[]>(generateMeetingRooms())
  const elevators = ref<ElevatorStatus[]>(generateElevators())
  const todayEvents = ref<TodayEvent[]>(generateTodayEvents())
  const isLoading = ref(false)

  let updateTimer: ReturnType<typeof setInterval> | null = null

  function fetchAllData() {
    isLoading.value = true
    tenants.value = generateTenantData()
    people.value = generatePeopleData()
    energy.value = generateEnergyData()
    equipment.value = generateEquipmentData()
    visitors.value = generateVisitorData()
    floors.value = generateFloorData()
    meetingRooms.value = generateMeetingRooms()
    elevators.value = generateElevators()
    todayEvents.value = generateTodayEvents()
    isLoading.value = false
  }

  function startRealTimeUpdates() {
    updateTimer = setInterval(() => {
      // 微调数据模拟实时变化
      const p = people.value
      const delta = Math.floor(Math.random() * 5) - 2
      p.total = Math.max(0, p.total + delta)
      p.employees = Math.max(0, p.employees + Math.floor(delta * 0.8))
      p.visitors = p.total - p.employees

      // 能源微调
      const e = energy.value
      e.daily.electricity += Math.random() * 2 - 0.5
      e.daily.water += Math.random() * 0.5 - 0.1
      e.daily.gas += Math.random() * 0.3 - 0.1

      // 电梯随机移动
      elevators.value = elevators.value.map(el => {
        if (el.status === 'fault') return el
        const dir = Math.random()
        let floor = el.currentFloor
        if (dir < 0.4) floor = Math.min(20, floor + 1)
        else if (dir < 0.8) floor = Math.max(-2, floor - 1)
        return {
          ...el,
          currentFloor: floor,
          direction: floor > el.currentFloor ? 'up' : floor < el.currentFloor ? 'down' : 'idle',
        }
      })
    }, 10000)
  }

  function stopRealTimeUpdates() {
    if (updateTimer) {
      clearInterval(updateTimer)
      updateTimer = null
    }
  }

  return {
    tenants,
    people,
    energy,
    equipment,
    visitors,
    floors,
    meetingRooms,
    elevators,
    todayEvents,
    isLoading,
    fetchAllData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  }
})
