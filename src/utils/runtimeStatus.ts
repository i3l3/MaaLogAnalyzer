import type { NodeInfo } from '../types'
import { i18n } from '../i18n'

export type RuntimeStatus = NodeInfo['status']
export type RuntimeStatusTagType = 'default' | 'success' | 'warning' | 'error' | 'info'

interface RuntimeStatusTagTypeOptions {
  successType?: RuntimeStatusTagType
  runningType?: RuntimeStatusTagType
  failedType?: RuntimeStatusTagType
}

export const getRuntimeStatusText = (status: RuntimeStatus): string => {
  const t = i18n.global.t
  if (status === 'success') return t('status.success')
  if (status === 'running') return t('status.running')
  return t('status.failed')
}

export const getRuntimeStatusTagType = (
  status: RuntimeStatus,
  options: RuntimeStatusTagTypeOptions = {}
): RuntimeStatusTagType => {
  if (status === 'success') return options.successType ?? 'success'
  if (status === 'running') return options.runningType ?? 'warning'
  return options.failedType ?? 'error'
}
