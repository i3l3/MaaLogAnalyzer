import type { NodeNavMatchDetail, NodeNavMatchKind } from './types'
import { i18n } from '../../../../i18n'

export const formatNodeNavMatchHint = (kinds: NodeNavMatchKind[]): string => {
  const labels = kinds.map((kind) => {
    if (kind === 'next-list') return 'Next'
    if (kind === 'flow') return i18n.global.t('process.flow')
    return i18n.global.t('process.node')
  })
  return labels.join('/')
}

const formatNodeNavMatchDetail = (detail: NodeNavMatchDetail): string => {
  if (detail.kind === 'next-list') return `Next: ${detail.text}`
  if (detail.kind === 'flow') return `${i18n.global.t('process.flowPrefix')}${detail.text}`
  return `${i18n.global.t('process.nodePrefix')}${detail.text}`
}

export const formatNodeNavMatchPreview = (details: NodeNavMatchDetail[]): string => {
  if (details.length === 0) return ''
  const shown = details.slice(0, 2).map(formatNodeNavMatchDetail).join('；')
  if (details.length <= 2) return shown
  return `${shown}（共 ${details.length} 处）`
}
