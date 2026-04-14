import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenAdapter() {
  const scaleX = ref(1)
  const scaleY = ref(1)

  const designWidth = 1920
  const designHeight = 1080

  function updateScale() {
    const w = window.innerWidth
    const h = window.innerHeight
    scaleX.value = w / designWidth
    scaleY.value = h / designHeight
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScale)
  })

  return { scaleX, scaleY, designWidth, designHeight }
}
