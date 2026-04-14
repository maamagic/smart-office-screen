import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserAccount, AlertThreshold, SystemConfig, BackupRecord } from '@/mock/types'
import { generateUserAccounts, generateAlertThresholds, generateSystemConfigs, generateBackupRecords } from '@/mock/settings'

export const useSettingsStore = defineStore('settings', () => {
  const users = ref<UserAccount[]>(generateUserAccounts())
  const thresholds = ref<AlertThreshold[]>(generateAlertThresholds())
  const configs = ref<SystemConfig[]>(generateSystemConfigs())
  const backups = ref<BackupRecord[]>(generateBackupRecords())

  // 统计
  const userStats = ref({
    total: users.value.length,
    active: users.value.filter(u => u.status === 'active').length,
    admin: users.value.filter(u => u.role === 'admin').length,
    operator: users.value.filter(u => u.role === 'operator').length,
  })

  const thresholdStats = ref({
    total: thresholds.value.length,
    enabled: thresholds.value.filter(t => t.enabled).length,
    disabled: thresholds.value.filter(t => !t.enabled).length,
  })

  const backupStats = ref({
    total: backups.value.length,
    success: backups.value.filter(b => b.status === 'success').length,
    failed: backups.value.filter(b => b.status === 'failed').length,
    lastBackup: backups.value[0]?.date || '-',
  })

  return {
    users,
    thresholds,
    configs,
    backups,
    userStats,
    thresholdStats,
    backupStats,
  }
})
