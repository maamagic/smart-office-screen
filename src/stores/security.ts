import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Camera, Person, FireDevice, SecurityAlert } from '@/mock/types'
import { generateCameras, generatePersons, generateFireDevices, generateSecurityAlerts } from '@/mock/security'

export const useSecurityStore = defineStore('security', () => {
  const cameras = ref<Camera[]>(generateCameras())
  const persons = ref<Person[]>(generatePersons())
  const fireDevices = ref<FireDevice[]>(generateFireDevices())
  const alerts = ref<SecurityAlert[]>(generateSecurityAlerts())

  // 统计
  const cameraStats = ref({
    total: cameras.value.length,
    online: cameras.value.filter(c => c.status !== 'offline').length,
    offline: cameras.value.filter(c => c.status === 'offline').length,
    recording: cameras.value.filter(c => c.status === 'recording').length,
  })

  const personStats = ref({
    employees: persons.value.filter(p => p.type === 'employee').length,
    visitors: persons.value.filter(p => p.type === 'visitor').length,
    strangers: persons.value.filter(p => p.type === 'stranger').length,
  })

  const fireStats = ref({
    total: fireDevices.value.length,
    normal: fireDevices.value.filter(d => d.status === 'normal').length,
    fault: fireDevices.value.filter(d => d.status === 'fault').length,
    alarm: fireDevices.value.filter(d => d.status === 'alarm').length,
    unchecked: fireDevices.value.filter(d => d.status === 'unchecked').length,
  })

  const alertStats = ref({
    total: alerts.value.length,
    unhandled: alerts.value.filter(a => a.status === 'unhandled').length,
    handling: alerts.value.filter(a => a.status === 'handling').length,
    resolved: alerts.value.filter(a => a.status === 'resolved').length,
  })

  return {
    cameras,
    persons,
    fireDevices,
    alerts,
    cameraStats,
    personStats,
    fireStats,
    alertStats,
  }
})
