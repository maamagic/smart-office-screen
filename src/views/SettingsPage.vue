<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import TechPanel from '@/components/common/TechPanel.vue'

const store = useSettingsStore()
const activeTab = ref('user')

const tabs = [
  { key: 'user', label: '账号管理', icon: '👤' },
  { key: 'threshold', label: '预警阈值', icon: '⚠️' },
  { key: 'config', label: '系统配置', icon: '⚙️' },
  { key: 'backup', label: '数据备份', icon: '💾' },
]

function getRoleLabel(role: string) {
  const map: Record<string, string> = { admin: '管理员', operator: '操作员', viewer: '查看者' }
  return map[role] || role
}

function getRoleColor(role: string) {
  const map: Record<string, string> = { admin: 'text-status-red', operator: 'text-status-yellow', viewer: 'text-accent-blue' }
  return map[role] || 'text-text-secondary'
}

function getUserStatusText(status: string) {
  const map: Record<string, string> = { active: '活跃', inactive: '停用', locked: '锁定' }
  return map[status] || status
}

function getUserStatusColor(status: string) {
  const map: Record<string, string> = { active: 'text-status-green', inactive: 'text-text-secondary', locked: 'text-status-red' }
  return map[status] || 'text-text-secondary'
}

function getBackupStatusText(status: string) {
  const map: Record<string, string> = { success: '成功', failed: '失败', in_progress: '进行中' }
  return map[status] || status
}

function getBackupStatusColor(status: string) {
  const map: Record<string, string> = { success: 'text-status-green', failed: 'text-status-red', in_progress: 'text-status-yellow animate-status-blink' }
  return map[status] || 'text-text-secondary'
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
        :class="activeTab === tab.key
          ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue shadow-glow'
          : 'bg-bg-panel/50 border-border-glow/20 text-text-secondary hover:text-text-primary'"
        @click="activeTab = tab.key"
      >
        <span class="text-base">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- 账号管理 -->
    <div v-if="activeTab === 'user'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.userStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">用户总数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.userStats.active }}</div>
          <div class="text-xs text-text-secondary mt-1">活跃用户</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red">{{ store.userStats.admin }}</div>
          <div class="text-xs text-text-secondary mt-1">管理员</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-yellow">{{ store.userStats.operator }}</div>
          <div class="text-xs text-text-secondary mt-1">操作员</div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm text-text-primary">用户列表</div>
          <button class="px-3 py-1.5 rounded bg-accent-blue/20 text-accent-blue text-xs hover:bg-accent-blue/30 transition-all">
            + 新增用户
          </button>
        </div>
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">用户名</th>
                <th class="py-2 px-3 text-center">角色</th>
                <th class="py-2 px-3 text-center">部门</th>
                <th class="py-2 px-3 text-center">最后登录</th>
                <th class="py-2 px-3 text-center">状态</th>
                <th class="py-2 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in store.users" :key="user.id" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px]">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-text-primary font-medium">{{ user.username }}</span>
                  </div>
                </td>
                <td class="py-2 px-3 text-center">
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="getRoleColor(user.role) + ' bg-bg-panel/40'">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ user.department }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ user.lastLogin }}</td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="getUserStatusColor(user.status)">
                    <span class="w-2 h-2 rounded-full"
                      :class="user.status === 'active' ? 'bg-status-green' : user.status === 'inactive' ? 'bg-text-secondary' : 'bg-status-red animate-status-blink'"></span>
                    {{ getUserStatusText(user.status) }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center">
                  <button class="text-accent-blue hover:underline mr-2">编辑</button>
                  <button v-if="user.status !== 'locked'" class="text-status-red hover:underline">锁定</button>
                  <button v-else class="text-status-green hover:underline">解锁</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>

    <!-- 预警阈值 -->
    <div v-if="activeTab === 'threshold'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-3 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.thresholdStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">阈值规则</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.thresholdStats.enabled }}</div>
          <div class="text-xs text-text-secondary mt-1">已启用</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-text-secondary">{{ store.thresholdStats.disabled }}</div>
          <div class="text-xs text-text-secondary mt-1">未启用</div>
        </TechPanel>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">预警阈值配置</div>
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">分类</th>
                <th class="py-2 px-3 text-left">指标名称</th>
                <th class="py-2 px-3 text-center">警告阈值</th>
                <th class="py-2 px-3 text-center">紧急阈值</th>
                <th class="py-2 px-3 text-center">单位</th>
                <th class="py-2 px-3 text-center">状态</th>
                <th class="py-2 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in store.thresholds" :key="t.id" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-secondary">{{ t.category }}</td>
                <td class="py-2 px-3 text-text-primary font-medium">{{ t.name }}</td>
                <td class="py-2 px-3 text-center text-status-yellow">{{ t.warning }}</td>
                <td class="py-2 px-3 text-center text-status-red">{{ t.urgent }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ t.unit }}</td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="t.enabled ? 'text-status-green' : 'text-text-secondary'">
                    <span class="w-2 h-2 rounded-full" :class="t.enabled ? 'bg-status-green' : 'bg-text-secondary'"></span>
                    {{ t.enabled ? '启用' : '停用' }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center">
                  <button class="text-accent-blue hover:underline mr-2">编辑</button>
                  <button class="text-text-secondary hover:underline">{{ t.enabled ? '停用' : '启用' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>

    <!-- 系统配置 -->
    <div v-if="activeTab === 'config'" class="flex-1 flex flex-col gap-3 min-h-0">
      <TechPanel class="flex-1 overflow-hidden">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm text-text-primary">系统参数配置</div>
          <button class="px-3 py-1.5 rounded bg-status-green/20 text-status-green text-xs hover:bg-status-green/30 transition-all">
            💾 保存配置
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar min-h-[600px] max-h-[750px] p-2">
          <div
            v-for="config in store.configs"
            :key="config.key"
            class="tech-panel p-4"
          >
            <div class="text-xs font-medium text-text-primary mb-1">{{ config.name }}</div>
            <div class="text-[10px] text-text-secondary mb-2">{{ config.description }}</div>
            <input
              type="text"
              :value="config.value"
              class="w-full px-3 py-2 rounded bg-bg-primary/60 border border-border-glow/30 text-xs text-text-primary focus:border-accent-blue/50 focus:outline-none"
            />
          </div>
        </div>
      </TechPanel>
    </div>

    <!-- 数据备份 -->
    <div v-if="activeTab === 'backup'" class="flex-1 flex flex-col gap-3 min-h-0">
      <div class="grid grid-cols-4 gap-3">
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-accent-blue">{{ store.backupStats.total }}</div>
          <div class="text-xs text-text-secondary mt-1">备份次数</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-green">{{ store.backupStats.success }}</div>
          <div class="text-xs text-text-secondary mt-1">成功</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-2xl font-display font-bold text-status-red">{{ store.backupStats.failed }}</div>
          <div class="text-xs text-text-secondary mt-1">失败</div>
        </TechPanel>
        <TechPanel class="text-center">
          <div class="text-lg font-display font-bold text-text-primary">{{ store.backupStats.lastBackup }}</div>
          <div class="text-xs text-text-secondary mt-1">最近备份</div>
        </TechPanel>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-4 py-2 rounded bg-accent-blue/20 text-accent-blue text-sm hover:bg-accent-blue/30 transition-all">
          💾 立即备份
        </button>
        <button class="px-4 py-2 rounded bg-status-green/20 text-status-green text-sm hover:bg-status-green/30 transition-all">
          🔄 恢复数据
        </button>
      </div>

      <TechPanel class="flex-1 overflow-hidden">
        <div class="text-sm text-text-primary mb-3">备份记录</div>
        <div class="overflow-y-auto no-scrollbar min-h-[500px] max-h-[700px]">
          <table class="w-full text-xs">
            <thead class="text-text-secondary border-b border-border-glow/30">
              <tr>
                <th class="py-2 px-3 text-left">备份ID</th>
                <th class="py-2 px-3 text-center">日期</th>
                <th class="py-2 px-3 text-center">时间</th>
                <th class="py-2 px-3 text-center">大小</th>
                <th class="py-2 px-3 text-center">类型</th>
                <th class="py-2 px-3 text-center">状态</th>
                <th class="py-2 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in store.backups" :key="b.id" class="border-b border-border-glow/10 hover:bg-bg-panel/30">
                <td class="py-2 px-3 text-text-secondary font-display">{{ b.id }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ b.date }}</td>
                <td class="py-2 px-3 text-center text-text-secondary">{{ b.time }}</td>
                <td class="py-2 px-3 text-center text-text-primary">{{ b.size }}</td>
                <td class="py-2 px-3 text-center">
                  <span class="text-text-secondary">{{ b.type === 'auto' ? '自动' : '手动' }}</span>
                </td>
                <td class="py-2 px-3 text-center">
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="getBackupStatusColor(b.status)">
                    <span class="w-2 h-2 rounded-full"
                      :class="b.status === 'success' ? 'bg-status-green' : b.status === 'failed' ? 'bg-status-red' : 'bg-status-yellow animate-status-blink'"></span>
                    {{ getBackupStatusText(b.status) }}
                  </span>
                </td>
                <td class="py-2 px-3 text-center">
                  <button class="text-accent-blue hover:underline mr-2">下载</button>
                  <button class="text-status-orange hover:underline">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechPanel>
    </div>
  </div>
</template>
