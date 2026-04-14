<script setup lang="ts">
import { ref, computed } from "vue";
import { useSecurityStore } from "@/stores/security";
import TechPanel from "@/components/common/TechPanel.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import dayjs from "dayjs";

const store = useSecurityStore();
const activeTab = ref("camera");

const tabs = [
  { key: "camera", label: "视频监控", icon: "📷" },
  { key: "person", label: "人员管控", icon: "👥" },
  { key: "fire", label: "消防管控", icon: "🔥" },
  { key: "alert", label: "安防预警", icon: "⚠️" },
];

const personFilter = ref<"all" | "employee" | "visitor" | "stranger">("all");
const filteredPersons = computed(() =>
  personFilter.value === "all"
    ? store.persons
    : store.persons.filter((p) => p.type === personFilter.value),
);

const fireFilter = ref<"all" | "normal" | "fault" | "alarm" | "unchecked">(
  "all",
);
const filteredDevices = computed(() =>
  fireFilter.value === "all"
    ? store.fireDevices
    : store.fireDevices.filter((d) => d.status === fireFilter.value),
);

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    online: "在线",
    offline: "离线",
    recording: "录制中",
    normal: "正常",
    fault: "故障",
    alarm: "报警",
    unchecked: "未巡检",
    unhandled: "未处理",
    handling: "处理中",
    resolved: "已处理",
    employee: "员工",
    visitor: "访客",
    stranger: "陌生人",
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    online: "text-status-green",
    offline: "text-status-red",
    recording: "text-accent-blue",
    normal: "text-status-green",
    fault: "text-status-red",
    alarm: "text-status-red",
    unchecked: "text-status-yellow",
    unhandled: "text-status-red",
    handling: "text-status-yellow",
    resolved: "text-status-green",
    employee: "text-accent-blue",
    visitor: "text-status-orange",
    stranger: "text-status-red",
  };
  return map[status] || "text-text-secondary";
}

function formatTime(date: Date) {
  return dayjs(date).format("HH:mm:ss");
}
</script>

<template>
  <div class="h-full flex flex-col gap-3 py-2">
    <!-- 子模块切换 -->
    <div class="flex items-center gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border"
        :class="
          activeTab === tab.key
            ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue shadow-glow'
            : 'bg-bg-panel/50 border-border-glow/20 text-text-secondary hover:text-text-primary'
        "
        @click="activeTab = tab.key"
      >
        <span class="text-base">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- 视频监控 -->
    <div
      v-if="activeTab === 'camera'"
      class="flex-1 grid grid-cols-1 gap-3 min-h-0"
    >
      <!-- 统计卡片 -->
      <div class="col-span-4 grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">
            {{ store.cameraStats.total }}
          </div>
          <div class="text-xs text-text-secondary mt-1">监控总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">
            {{ store.cameraStats.online }}
          </div>
          <div class="text-xs text-text-secondary mt-1">在线</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue-dim">
            {{ store.cameraStats.recording }}
          </div>
          <div class="text-xs text-text-secondary mt-1">录制中</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div
            class="text-2xl font-display font-bold text-status-red animate-status-blink"
          >
            {{ store.cameraStats.offline }}
          </div>
          <div class="text-xs text-text-secondary mt-1">离线</div>
        </TechPanel>
      </div>

      <!-- 监控网格 -->
      <div class="col-span-4 grid grid-cols-4 gap-3 h-[680px] overflow-auto">
        <div
          v-for="cam in store.cameras"
          :key="cam.id"
          class="tech-panel p-2 flex flex-col cursor-pointer transition-all duration-200 h-[320px] overflow-hidden"
          :class="
            cam.hasAlert
              ? 'border-status-red/50'
              : 'hover:border-accent-blue/50'
          "
        >
          <!-- 模拟画面 -->
          <div
            class="flex-1 min-h-[240px] rounded bg-bg-primary/80 flex items-center justify-center relative overflow-hidden"
          >
            <div class="text-center">
              <div class="text-3xl mb-1 opacity-40">📷</div>
              <div class="text-xs text-text-secondary">{{ cam.name }}</div>
            </div>
            <!-- 在线状态 -->
            <div
              v-if="cam.status === 'offline'"
              class="absolute inset-0 bg-bg-primary/70 flex items-center justify-center"
            >
              <span class="text-status-red font-bold text-sm">离线</span>
            </div>
            <!-- 录制标识 -->
            <div
              v-if="cam.status === 'recording'"
              class="absolute top-2 right-2 flex items-center gap-1"
            >
              <span
                class="w-2 h-2 rounded-full bg-status-red animate-status-blink"
              ></span>
              <span class="text-[10px] text-status-red">REC</span>
            </div>
            <!-- 异常标记 -->
            <div v-if="cam.hasAlert" class="absolute top-2 left-2">
              <span
                class="text-[10px] px-1.5 py-0.5 rounded bg-status-red/80 text-white"
                >异常</span
              >
            </div>
          </div>
          <!-- 信息 -->
          <div class="flex items-center justify-between mt-1.5">
            <span class="text-[10px] text-text-secondary">{{ cam.zone }}</span>
            <StatusBadge
              :status="cam.status === 'offline' ? 'offline' : 'normal'"
              :label="getStatusLabel(cam.status)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 人员管控 -->
    <div
      v-if="activeTab === 'person'"
      class="flex-1 flex flex-col gap-3 min-h-0"
    >
      <!-- 统计 -->
      <div class="grid grid-cols-3 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">
            {{ store.personStats.employees }}
          </div>
          <div class="text-xs text-text-secondary mt-1">在楼员工</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-orange">
            {{ store.personStats.visitors }}
          </div>
          <div class="text-xs text-text-secondary mt-1">在楼访客</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div
            class="text-2xl font-display font-bold text-status-red animate-status-blink"
          >
            {{ store.personStats.strangers }}
          </div>
          <div class="text-xs text-text-secondary mt-1">陌生人员</div>
        </TechPanel>
      </div>

      <!-- 筛选 -->
      <div class="flex items-center gap-2">
        <button
          v-for="f in [
            { key: 'all', label: '全部' },
            { key: 'employee', label: '员工' },
            { key: 'visitor', label: '访客' },
            { key: 'stranger', label: '陌生人' },
          ]"
          :key="f.key"
          class="px-3 py-1 rounded text-xs transition-all"
          :class="
            personFilter === f.key
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40'
              : 'text-text-secondary border border-transparent hover:border-border-glow/30'
          "
          @click="personFilter = f.key as any"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- 人员列表 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div
          class="overflow-y-auto no-scrollbar mix-h-[420px] max-h-[670px] space-y-1.5"
        >
          <div
            v-for="person in filteredPersons"
            :key="person.id"
            class="flex items-center gap-3 px-3 py-2 rounded bg-bg-primary/40"
            :class="
              person.type === 'stranger' ? 'border border-status-red/30' : ''
            "
          >
            <!-- 头像占位 -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="
                person.type === 'employee'
                  ? 'bg-accent-blue/20'
                  : person.type === 'visitor'
                    ? 'bg-status-orange/20'
                    : 'bg-status-red/20'
              "
            >
              <span class="text-xs">{{
                person.type === "employee"
                  ? "👤"
                  : person.type === "visitor"
                    ? "👥"
                    : "⚠️"
              }}</span>
            </div>
            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-text-primary">{{
                  person.name
                }}</span>
                <span class="text-[10px] font-display text-text-secondary">{{
                  person.id
                }}</span>
              </div>
              <div
                class="flex items-center gap-3 text-[10px] text-text-secondary"
              >
                <span v-if="person.department || person.company">{{
                  person.department || person.company
                }}</span>
                <span>{{ person.lastLocation }}</span>
                <span>最后出现 {{ person.lastSeen }}</span>
              </div>
            </div>
            <!-- 状态 -->
            <div class="flex-shrink-0 text-right">
              <span
                class="inline-flex items-center gap-1.5 text-xs"
                :class="getStatusColor(person.type)"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    person.type === 'employee'
                      ? 'bg-accent-blue'
                      : person.type === 'visitor'
                        ? 'bg-status-orange'
                        : 'bg-status-red'
                  "
                ></span>
                {{ getStatusLabel(person.type) }}
              </span>
              <div
                v-if="person.checkInTime"
                class="text-[10px] text-text-secondary mt-0.5"
              >
                入场 {{ person.checkInTime }}
              </div>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 消防管控 -->
    <div v-if="activeTab === 'fire'" class="flex-1 flex flex-col gap-3 min-h-0">
      <!-- 统计 -->
      <div class="grid grid-cols-5 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">
            {{ store.fireStats.total }}
          </div>
          <div class="text-xs text-text-secondary mt-1">设备总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">
            {{ store.fireStats.normal }}
          </div>
          <div class="text-xs text-text-secondary mt-1">正常</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div
            class="text-2xl font-display font-bold text-status-red animate-status-blink"
          >
            {{ store.fireStats.alarm }}
          </div>
          <div class="text-xs text-text-secondary mt-1">报警</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red">
            {{ store.fireStats.fault }}
          </div>
          <div class="text-xs text-text-secondary mt-1">故障</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">
            {{ store.fireStats.unchecked }}
          </div>
          <div class="text-xs text-text-secondary mt-1">未巡检</div>
        </TechPanel>
      </div>

      <!-- 筛选 -->
      <div class="flex items-center gap-2">
        <button
          v-for="f in [
            { key: 'all', label: '全部' },
            { key: 'alarm', label: '报警' },
            { key: 'fault', label: '故障' },
            { key: 'unchecked', label: '未巡检' },
            { key: 'normal', label: '正常' },
          ]"
          :key="f.key"
          class="px-3 py-1 rounded text-xs transition-all"
          :class="
            fireFilter === f.key
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40'
              : 'text-text-secondary border border-transparent hover:border-border-glow/30'
          "
          @click="fireFilter = f.key as any"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- 设备列表 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div
          class="overflow-y-auto no-scrollbar mix-h-[420px] max-h-[670px] space-y-1.5"
        >
          <div
            v-for="device in filteredDevices"
            :key="device.id"
            class="flex items-center gap-3 px-3 py-2 rounded bg-bg-primary/40"
            :class="
              device.status === 'alarm'
                ? 'border border-status-red/50'
                : device.status === 'fault'
                  ? 'border border-status-red/30'
                  : ''
            "
          >
            <div
              class="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
              :class="
                device.type === 'smoke'
                  ? 'bg-blue-500/20'
                  : device.type === 'heat'
                    ? 'bg-orange-500/20'
                    : device.type === 'extinguisher'
                      ? 'bg-red-500/20'
                      : device.type === 'hydrant'
                        ? 'bg-cyan-500/20'
                        : 'bg-yellow-500/20'
              "
            >
              <span class="text-sm">
                {{
                  device.type === "smoke"
                    ? "💨"
                    : device.type === "heat"
                      ? "🌡️"
                      : device.type === "extinguisher"
                        ? "🧯"
                        : device.type === "hydrant"
                          ? "🚒"
                          : "💡"
                }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-text-primary">{{
                  device.name
                }}</span>
                <span class="text-[10px] font-display text-text-secondary">{{
                  device.id
                }}</span>
              </div>
              <div class="text-[10px] text-text-secondary">
                {{ device.location }}
              </div>
            </div>
            <div class="flex-shrink-0 text-right">
              <span
                class="inline-flex items-center gap-1.5 text-xs"
                :class="getStatusColor(device.status)"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    device.status === 'normal'
                      ? 'bg-status-green'
                      : device.status === 'alarm'
                        ? 'bg-status-red animate-status-blink'
                        : device.status === 'fault'
                          ? 'bg-status-red'
                          : 'bg-status-yellow'
                  "
                ></span>
                {{ getStatusLabel(device.status) }}
              </span>
              <div
                v-if="device.lastCheck"
                class="text-[10px] text-text-secondary mt-0.5"
              >
                巡检 {{ device.lastCheck }}
              </div>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 安防预警 -->
    <div
      v-if="activeTab === 'alert'"
      class="flex-1 flex flex-col gap-3 min-h-0"
    >
      <!-- 统计 -->
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">
            {{ store.alertStats.total }}
          </div>
          <div class="text-xs text-text-secondary mt-1">预警总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div
            class="text-2xl font-display font-bold text-status-red animate-status-blink"
          >
            {{ store.alertStats.unhandled }}
          </div>
          <div class="text-xs text-text-secondary mt-1">未处理</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">
            {{ store.alertStats.handling }}
          </div>
          <div class="text-xs text-text-secondary mt-1">处理中</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">
            {{ store.alertStats.resolved }}
          </div>
          <div class="text-xs text-text-secondary mt-1">已处理</div>
        </TechPanel>
      </div>

      <!-- 预警列表 -->
      <TechPanel class="flex-1 overflow-hidden">
        <div
          class="overflow-y-auto no-scrollbar mix-h-[420px] max-h-[720px] space-y-2"
        >
          <div
            v-for="alert in store.alerts"
            :key="alert.id"
            class="p-3 rounded border transition-all duration-200"
            :class="
              alert.status === 'unhandled' && alert.level === 'urgent'
                ? 'bg-status-red/10 border-status-red/40'
                : alert.status === 'unhandled'
                  ? 'bg-status-yellow/5 border-status-yellow/30'
                  : 'bg-bg-primary/40 border-border-glow/20'
            "
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">
                  {{
                    alert.type === "camera"
                      ? "📷"
                      : alert.type === "person"
                        ? "👤"
                        : alert.type === "fire"
                          ? "🔥"
                          : "⚠️"
                  }}
                </span>
                <div>
                  <span class="text-xs font-medium text-text-primary">{{
                    alert.title
                  }}</span>
                  <span class="text-[10px] text-text-secondary ml-2">{{
                    alert.location
                  }}</span>
                </div>
              </div>
              <span
                class="text-[10px] font-display text-text-secondary flex-shrink-0"
              >
                {{ formatTime(alert.timestamp) }}
              </span>
            </div>
            <div class="text-[10px] text-text-secondary mt-1.5 ml-7">
              {{ alert.description }}
            </div>
            <div class="flex items-center justify-between mt-2 ml-7">
              <span
                class="inline-flex items-center gap-1.5 text-xs"
                :class="
                  alert.level === 'urgent'
                    ? 'text-status-red'
                    : alert.level === 'warning'
                      ? 'text-status-yellow'
                      : 'text-status-green'
                "
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    alert.level === 'urgent'
                      ? 'bg-status-red animate-status-blink'
                      : alert.level === 'warning'
                        ? 'bg-status-yellow'
                        : 'bg-status-green'
                  "
                ></span>
                {{
                  alert.level === "urgent"
                    ? "紧急"
                    : alert.level === "warning"
                      ? "警告"
                      : "通知"
                }}
              </span>
              <span
                class="inline-flex items-center gap-1.5 text-xs"
                :class="
                  alert.status === 'unhandled'
                    ? 'text-status-red'
                    : alert.status === 'handling'
                      ? 'text-status-yellow'
                      : 'text-status-green'
                "
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    alert.status === 'unhandled'
                      ? 'bg-status-red animate-status-blink'
                      : alert.status === 'handling'
                        ? 'bg-status-yellow'
                        : 'bg-status-green'
                  "
                ></span>
                {{ getStatusLabel(alert.status) }}
              </span>
            </div>
          </div>
        </div>
      </TechPanel>
    </div>
  </div>
</template>
