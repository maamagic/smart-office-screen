import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AlertMessage } from '@/mock/types'
import { generateInitialAlerts, generateRandomAlert } from '@/mock/alerts'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<AlertMessage[]>(generateInitialAlerts())

  let alertTimer: ReturnType<typeof setInterval> | null = null

  function startAlertSimulation() {
    alertTimer = setInterval(() => {
      if (Math.random() < 0.4) {
        const newAlert = generateRandomAlert()
        alerts.value = [newAlert, ...alerts.value].slice(0, 50)
      }
    }, 30000)
  }

  function stopAlertSimulation() {
    if (alertTimer) {
      clearInterval(alertTimer)
      alertTimer = null
    }
  }

  function dismissAlert(id: string) {
    alerts.value = alerts.value.filter(a => a.id !== id)
  }

  return {
    alerts,
    startAlertSimulation,
    stopAlertSimulation,
    dismissAlert,
  }
})
