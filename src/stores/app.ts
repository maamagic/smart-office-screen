import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeatherInfo } from '@/mock/types'
import { generateWeatherData } from '@/mock/weather'

export const useAppStore = defineStore('app', () => {
  const currentTime = ref(new Date())
  const systemStatus = ref<'normal' | 'abnormal'>('normal')
  const lastDataUpdate = ref(new Date())
  const buildingName = ref('XX智慧办公楼')
  const weatherData = ref<WeatherInfo>(generateWeatherData())

  let clockTimer: ReturnType<typeof setInterval> | null = null

  function startClock() {
    clockTimer = setInterval(() => {
      currentTime.value = new Date()
    }, 1000)
  }

  function stopClock() {
    if (clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }

  function updateWeather() {
    weatherData.value = generateWeatherData()
  }

  function updateDataTimestamp() {
    lastDataUpdate.value = new Date()
  }

  return {
    currentTime,
    systemStatus,
    lastDataUpdate,
    buildingName,
    weatherData,
    startClock,
    stopClock,
    updateWeather,
    updateDataTimestamp,
  }
})
