import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OpsDevice, ZoneEnergy, EnvironmentData } from '@/mock/types'
import { generateOpsDevices, generateZoneEnergy, generateEnvironmentData, getDeviceCategoryStats } from '@/mock/operations'

export const useOperationsStore = defineStore('operations', () => {
  const devices = ref<OpsDevice[]>(generateOpsDevices())
  const zoneEnergy = ref<ZoneEnergy[]>(generateZoneEnergy())
  const environment = ref<EnvironmentData[]>(generateEnvironmentData())
  const categoryStats = ref(getDeviceCategoryStats(devices.value))

  // 设备统计
  const deviceSummary = ref({
    total: devices.value.length,
    running: devices.value.filter(d => d.status === 'running').length,
    fault: devices.value.filter(d => d.status === 'fault').length,
    maintenance: devices.value.filter(d => d.status === 'maintenance').length,
    stopped: devices.value.filter(d => d.status === 'stopped').length,
  })

  // 环境统计
  const envSummary = ref({
    normal: environment.value.filter(e => e.status === 'normal').length,
    warning: environment.value.filter(e => e.status === 'warning').length,
    danger: environment.value.filter(e => e.status === 'danger').length,
  })

  return {
    devices,
    zoneEnergy,
    environment,
    categoryStats,
    deviceSummary,
    envSummary,
  }
})
