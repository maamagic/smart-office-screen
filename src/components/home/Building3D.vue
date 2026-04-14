<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import type { FloorStatus } from '@/mock/types'

const props = defineProps<{
  floors: FloorStatus[]
}>()

const containerRef = ref<HTMLDivElement>()
const hoveredFloor = ref<string | null>(null)
const tooltipData = ref<{ x: number; y: number; floor: FloorStatus } | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationId: number
let clock: THREE.Clock
let floorMeshes: THREE.Mesh[] = []
let glowMeshes: THREE.Mesh[] = []
let scanLine: THREE.Mesh
let particles: THREE.Points
let mouseX = 0
let mouseY = 0
let targetRotationY = 0
let targetRotationX = 0
let currentRotationY = -0.3
let currentRotationX = 0.15
let buildingGroup: THREE.Group
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
let resizeObserver: ResizeObserver | null = null

const statusColors: Record<string, number> = {
  occupied: 0x00ff88,
  idle: 0x4a90d9,
  fault: 0xff4757,
  construction: 0xffa502,
}

function init() {
  if (!containerRef.value) return

  // 确保容器有明确的尺寸
  const rect = containerRef.value.getBoundingClientRect()
  const width = rect.width || containerRef.value.clientWidth || 800
  const height = rect.height || containerRef.value.clientHeight || 600

  if (width === 0 || height === 0) {
    console.warn('Building3D: Container has no size, retrying...')
    setTimeout(init, 100)
    return
  }

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a1628, 0.008)

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(30, 28, 40)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  containerRef.value.appendChild(renderer.domElement)

  // Clock
  clock = new THREE.Clock()

  // Raycaster
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Lights
  createLights()

  // Building group
  buildingGroup = new THREE.Group()
  scene.add(buildingGroup)

  // Create building
  createBuilding()

  // Ground
  createGround()

  // Particles
  createParticles()

  // Scan line
  createScanLine()

  // Events
  containerRef.value.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
}

function createLights() {
  // Ambient
  const ambient = new THREE.AmbientLight(0x1a2a4a, 0.6)
  scene.add(ambient)

  // Main directional light
  const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.8)
  dirLight.position.set(20, 40, 30)
  scene.add(dirLight)

  // Accent point lights
  const pointLight1 = new THREE.PointLight(0x00d4ff, 1.5, 80)
  pointLight1.position.set(-15, 30, 15)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x00ff88, 0.8, 60)
  pointLight2.position.set(15, 5, -15)
  scene.add(pointLight2)

  // Bottom glow
  const bottomLight = new THREE.PointLight(0x00d4ff, 1.0, 40)
  bottomLight.position.set(0, -2, 0)
  scene.add(bottomLight)
}

function createBuilding() {
  floorMeshes = []
  glowMeshes = []

  // Clear old meshes
  while (buildingGroup.children.length > 0) {
    buildingGroup.remove(buildingGroup.children[0])
  }

  const floorWidth = 12
  const floorDepth = 8
  const floorHeight = 1.0
  const floorGap = 0.12
  const totalFloors = props.floors.length

  // Building base
  const baseGeom = new THREE.BoxGeometry(floorWidth + 2, 0.5, floorDepth + 2)
  const baseMat = new THREE.MeshPhongMaterial({
    color: 0x0a2040,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0.8,
  })
  const baseMesh = new THREE.Mesh(baseGeom, baseMat)
  baseMesh.position.y = -0.5
  buildingGroup.add(baseMesh)

  // Each floor
  props.floors.forEach((floor, i) => {
    const y = i * (floorHeight + floorGap)
    const color = statusColors[floor.status] || 0x4a90d9

    // Main floor body
    const geom = new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth)
    const mat = new THREE.MeshPhongMaterial({
      color: 0x0f2042,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85,
      specular: 0x00d4ff,
      shininess: 30,
    })
    const mesh = new THREE.Mesh(geom, mat)
    mesh.position.y = y
    mesh.userData = { floorIndex: i, floorData: floor }
    buildingGroup.add(mesh)
    floorMeshes.push(mesh)

    // Window grid (wireframe lines on the front face)
    const edgeGeom = new THREE.EdgesGeometry(geom)
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.4,
    })
    const edges = new THREE.LineSegments(edgeGeom, edgeMat)
    edges.position.y = y
    buildingGroup.add(edges)

    // Window emissive panels (front face)
    const windowRows = 2
    const windowCols = 6
    const winW = floorWidth / (windowCols + 1) * 0.7
    const winH = floorHeight * 0.5
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const wGeom = new THREE.PlaneGeometry(winW, winH)
        const litChance = floor.status === 'idle' ? 0.2 : floor.status === 'occupied' ? 0.8 : 0.4
        const isLit = Math.random() < litChance
        const wMat = new THREE.MeshBasicMaterial({
          color: isLit ? color : 0x0a1628,
          transparent: true,
          opacity: isLit ? 0.6 + Math.random() * 0.3 : 0.15,
          side: THREE.DoubleSide,
        })
        const wMesh = new THREE.Mesh(wGeom, wMat)
        const xStart = -floorWidth / 2 + floorWidth / (windowCols + 1) * (col + 0.5) + winW * 0.2
        const yStart = y - floorHeight * 0.2 + row * (winH + 0.05)
        wMesh.position.set(xStart + winW / 2, yStart + winH / 2, floorDepth / 2 + 0.01)
        buildingGroup.add(wMesh)
      }
    }

    // Side glow edge strips
    if (floor.status === 'fault') {
      const glowGeom = new THREE.BoxGeometry(floorWidth + 0.3, floorHeight + 0.1, floorDepth + 0.3)
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeom, glowMat)
      glow.position.y = y
      buildingGroup.add(glow)
      glowMeshes.push(glow)
    }
  })

  // Roof antenna
  const antennaGeom = new THREE.CylinderGeometry(0.05, 0.15, 3, 8)
  const antennaMat = new THREE.MeshPhongMaterial({
    color: 0x334466,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.3,
  })
  const antenna = new THREE.Mesh(antennaGeom, antennaMat)
  antenna.position.y = totalFloors * (floorHeight + floorGap) + 1.5
  buildingGroup.add(antenna)

  // Antenna tip light
  const tipGeom = new THREE.SphereGeometry(0.2, 16, 16)
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xff4757 })
  const tipMesh = new THREE.Mesh(tipGeom, tipMat)
  tipMesh.position.y = totalFloors * (floorHeight + floorGap) + 3.1
  tipMesh.userData = { isAntennaLight: true }
  buildingGroup.add(tipMesh)

  // Center the building vertically
  buildingGroup.position.y = -totalFloors * (floorHeight + floorGap) / 2 + 5
}

function createGround() {
  // Grid ground
  const gridHelper = new THREE.GridHelper(100, 50, 0x003355, 0x001a33)
  gridHelper.position.y = buildingGroup.position.y - 1
  scene.add(gridHelper)

  // Glowing ring around base
  const ringGeom = new THREE.RingGeometry(10, 10.3, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  })
  const ring = new THREE.Mesh(ringGeom, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = buildingGroup.position.y - 0.8
  ring.userData = { isGlowRing: true }
  scene.add(ring)

  // Second outer ring
  const ring2Geom = new THREE.RingGeometry(14, 14.15, 64)
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
  })
  const ring2 = new THREE.Mesh(ring2Geom, ring2Mat)
  ring2.rotation.x = -Math.PI / 2
  ring2.position.y = buildingGroup.position.y - 0.8
  ring2.userData = { isGlowRing2: true }
  scene.add(ring2)
}

function createParticles() {
  const particleCount = 300
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = 15 + Math.random() * 30
    const angle = Math.random() * Math.PI * 2
    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = (Math.random() - 0.3) * 40
    positions[i3 + 2] = Math.sin(angle) * radius

    const c = new THREE.Color(Math.random() > 0.5 ? 0x00d4ff : 0x00ff88)
    colors[i3] = c.r
    colors[i3 + 1] = c.g
    colors[i3 + 2] = c.b

    sizes[i] = Math.random() * 2 + 0.5
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  particles = new THREE.Points(geom, mat)
  scene.add(particles)
}

function createScanLine() {
  const geom = new THREE.PlaneGeometry(20, 0.3)
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })
  scanLine = new THREE.Mesh(geom, mat)
  scanLine.rotation.x = -Math.PI / 2
  scanLine.position.y = buildingGroup.position.y - 0.5
  scene.add(scanLine)
}

function onMouseMove(event: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1

  // Target rotation based on mouse
  targetRotationY = -0.3 + mouseX * 0.5
  targetRotationX = 0.15 - mouseY * 0.2

  // Raycasting for floor hover
  mouse.x = mouseX
  mouse.y = -mouseY
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(floorMeshes)

  if (intersects.length > 0) {
    const obj = intersects[0].object as THREE.Mesh
    const floorData = obj.userData.floorData as FloorStatus
    hoveredFloor.value = floorData.floorNumber

    tooltipData.value = {
      x: event.clientX - (containerRef.value?.getBoundingClientRect().left || 0),
      y: event.clientY - (containerRef.value?.getBoundingClientRect().top || 0),
      floor: floorData,
    }

    // Highlight hovered floor
    floorMeshes.forEach((m) => {
      const mat = m.material as THREE.MeshPhongMaterial
      if (m === obj) {
        mat.emissiveIntensity = 0.5
        mat.opacity = 1.0
      } else {
        mat.emissiveIntensity = 0.15
        mat.opacity = 0.85
      }
    })
  } else {
    hoveredFloor.value = null
    tooltipData.value = null
    floorMeshes.forEach((m) => {
      const mat = m.material as THREE.MeshPhongMaterial
      mat.emissiveIntensity = 0.15
      mat.opacity = 0.85
    })
  }
}

function onResize() {
  if (!containerRef.value || !camera || !renderer) return

  const rect = containerRef.value.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width))
  const height = Math.max(1, Math.floor(rect.height))

  if (width === 0 || height === 0) return

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  const elapsed = clock.getElapsedTime()

  // Smooth camera rotation following mouse
  currentRotationY += (targetRotationY - currentRotationY) * 0.02
  currentRotationX += (targetRotationX - currentRotationX) * 0.02

  camera.position.x = 40 * Math.cos(currentRotationY)
  camera.position.z = 40 * Math.sin(currentRotationY + Math.PI / 2)
  camera.position.y = 28 + currentRotationX * 20
  camera.lookAt(0, 0, 0)

  // Antenna light blink
  buildingGroup.traverse((child) => {
    if (child.userData.isAntennaLight) {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = 0.5 + Math.sin(elapsed * 3) * 0.5
    }
  })

  // Glow ring animation
  scene.traverse((child) => {
    if (child.userData.isGlowRing) {
      const s = 1 + Math.sin(elapsed * 1.5) * 0.05
      child.scale.set(s, s, s);
      (child as THREE.Mesh).material && ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity !== undefined && (((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(elapsed * 2) * 0.15)
    }
    if (child.userData.isGlowRing2) {
      const s = 1 + Math.sin(elapsed * 1.2 + 1) * 0.03
      child.scale.set(s, s, s)
    }
  })

  // Fault floor blink
  glowMeshes.forEach((glow) => {
    const mat = glow.material as THREE.MeshBasicMaterial
    mat.opacity = 0.1 + Math.sin(elapsed * 4) * 0.1
  })

  // Scan line sweep
  if (scanLine) {
    const buildingHeight = props.floors.length * 1.12
    const yBase = buildingGroup.position.y
    const sweep = (elapsed * 2) % (buildingHeight + 4)
    scanLine.position.y = yBase + sweep - 2
    const mat = scanLine.material as THREE.MeshBasicMaterial
    mat.opacity = 0.2 + Math.sin(elapsed * 6) * 0.15
  }

  // Particle drift
  if (particles) {
    particles.rotation.y = elapsed * 0.05
    const positions = particles.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(elapsed + i) * 0.003
    }
    particles.geometry.attributes.position.needsUpdate = true
  }

  // Window shimmer effect
  buildingGroup.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
      const mat = child.material as THREE.MeshBasicMaterial
      if (mat.color && mat.opacity > 0.1 && mat.opacity < 1) {
        // Subtle brightness flicker for lit windows
        const flicker = Math.sin(elapsed * 2 + child.position.x * 5 + child.position.y * 3) * 0.05
        mat.opacity = Math.max(0.15, Math.min(0.95, mat.opacity + flicker * 0.01))
      }
    }
  })

  renderer.render(scene, camera)
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'occupied': return '正常'
    case 'idle': return '空闲'
    case 'fault': return '故障'
    case 'construction': return '施工'
    default: return '未知'
  }
}

function getStatusColorClass(status: string) {
  switch (status) {
    case 'occupied': return 'text-status-green'
    case 'idle': return 'text-status-idle'
    case 'fault': return 'text-status-red'
    case 'construction': return 'text-status-orange'
    default: return 'text-text-secondary'
  }
}

// Watch floor data changes to update building colors
watch(() => props.floors, () => {
  if (floorMeshes.length > 0) {
    props.floors.forEach((floor, i) => {
      if (floorMeshes[i]) {
        const color = statusColors[floor.status] || 0x4a90d9
        const mat = floorMeshes[i].material as THREE.MeshPhongMaterial
        mat.emissive.set(color)
        floorMeshes[i].userData.floorData = floor
      }
    })
  }
}, { deep: true })

onMounted(() => {
  // 使用 ResizeObserver 更可靠地监听容器尺寸变化
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      onResize()
    })
    resizeObserver.observe(containerRef.value)
  }

  init()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (containerRef.value && renderer) {
    containerRef.value.removeEventListener('mousemove', onMouseMove)
    if (renderer.domElement.parentNode === containerRef.value) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <div class="relative w-full h-full">
    <div ref="containerRef" class="w-full h-full" />

    <!-- Floor tooltip -->
    <div
      v-if="tooltipData"
      class="absolute pointer-events-none z-10 px-3 py-2 rounded-md border border-border-glow/50 bg-bg-panel/90 backdrop-blur-sm shadow-glow"
      :style="{ left: `${tooltipData.x + 15}px`, top: `${tooltipData.y - 10}px` }"
    >
      <div class="text-xs font-bold text-accent-blue mb-1">
        {{ tooltipData.floor.floorNumber }} {{ tooltipData.floor.tenantName }}
      </div>
      <div class="flex items-center gap-3 text-[10px]">
        <span class="text-text-secondary">
          人数: <span class="text-text-primary font-display">{{ tooltipData.floor.currentPeople }}</span>
        </span>
        <span :class="getStatusColorClass(tooltipData.floor.status)">
          {{ getStatusLabel(tooltipData.floor.status) }}
        </span>
      </div>
    </div>

    <!-- Legend overlay -->
    <div class="absolute bottom-2 left-2 flex items-center gap-4 px-3 py-1.5 rounded bg-bg-panel/70 border border-border-glow/30 backdrop-blur-sm">
      <div class="flex items-center gap-1.5 text-[10px]">
        <span class="w-2.5 h-2 rounded-sm" style="background: #00ff88;"></span>
        <span class="text-text-secondary">正常</span>
      </div>
      <div class="flex items-center gap-1.5 text-[10px]">
        <span class="w-2.5 h-2 rounded-sm" style="background: #4a90d9;"></span>
        <span class="text-text-secondary">空闲</span>
      </div>
      <div class="flex items-center gap-1.5 text-[10px]">
        <span class="w-2.5 h-2 rounded-sm" style="background: #ff4757;"></span>
        <span class="text-text-secondary">故障</span>
      </div>
      <div class="flex items-center gap-1.5 text-[10px]">
        <span class="w-2.5 h-2 rounded-sm" style="background: #ffa502;"></span>
        <span class="text-text-secondary">施工</span>
      </div>
    </div>
  </div>
</template>
