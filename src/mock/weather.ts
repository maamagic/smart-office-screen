import type { WeatherInfo } from './types'

const conditions: WeatherInfo['condition'][] = ['sunny', 'cloudy', 'overcast', 'rain']
const icons: Record<WeatherInfo['condition'], string> = {
  sunny: '☀️',
  cloudy: '⛅',
  overcast: '☁️',
  rain: '🌧️',
  snow: '❄️',
  fog: '🌫️',
}

export function generateWeatherData(): WeatherInfo {
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  return {
    temperature: Math.floor(Math.random() * 15) + 15,
    humidity: Math.floor(Math.random() * 30) + 40,
    windLevel: Math.floor(Math.random() * 4) + 1,
    windDirection: ['东', '南', '西', '北', '东南', '西北'][Math.floor(Math.random() * 6)],
    condition,
    pm25: Math.floor(Math.random() * 80) + 20,
    icon: icons[condition],
  }
}
