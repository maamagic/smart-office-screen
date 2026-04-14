import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export function useRealTimeClock() {
  const appStore = useAppStore()

  const date = computed(() => dayjs(appStore.currentTime).format('YYYY年MM月DD日'))
  const time = computed(() => dayjs(appStore.currentTime).format('HH:mm:ss'))
  const dayOfWeek = computed(() => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return days[dayjs(appStore.currentTime).day()]
  })

  return { date, time, dayOfWeek }
}
