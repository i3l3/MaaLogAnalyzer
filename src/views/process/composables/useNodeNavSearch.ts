import { computed, ref, type Ref } from 'vue'
import type { NodeInfo } from '../../../types'
import {
  collectNodeNavMatchDetails,
  getNodeNavMatchKinds,
  normalizeSearchText as normalizeNodeNavMatchText,
  normalizeSearchText,
} from './nodeNavSearch/match'
import {
  formatNodeNavMatchHint,
  formatNodeNavMatchPreview,
} from './nodeNavSearch/format'
import type { NodeNavViewItem } from './nodeNavSearch/types'

export type {
  NodeNavMatchDetail,
  NodeNavMatchKind,
  NodeNavViewItem,
} from './nodeNavSearch/types'

export type NodeNavMode = 'pipeline' | 'next-list-hit'

type SourceEntry = {
  node: NodeInfo
  originalIndex: number
  primaryText: string
  primaryMatchKind: 'node' | 'next-list'
}

const normalizeOptionalName = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

const resolveNodeNextListHitName = (node: NodeInfo): string | undefined => {
  const nextNames = new Set((node.next_list || []).map((item) => item.name).filter((name) => !!name))
  if (nextNames.size === 0) return undefined

  const candidates: string[] = []
  const pushCandidate = (value: unknown) => {
    const normalized = normalizeOptionalName(value)
    if (!normalized) return
    candidates.push(normalized)
  }

  pushCandidate(node.node_details?.name)
  pushCandidate(node.action_details?.name)
  pushCandidate(node.reco_details?.name)

  for (const flowItem of (node.node_flow || [])) {
    if (flowItem.status !== 'success') continue
    pushCandidate(flowItem.name)
    if (flowItem.type === 'recognition') {
      pushCandidate(flowItem.reco_details?.name)
    }
    if (flowItem.type === 'action') {
      pushCandidate(flowItem.action_details?.name)
    }
  }

  pushCandidate(node.name)

  for (const candidate of candidates) {
    if (nextNames.has(candidate)) return candidate
  }

  return undefined
}

export const useNodeNavSearch = (
  currentNodes: Ref<NodeInfo[]>,
  selectedRootTaskId: Ref<number | null>,
) => {
  const nodeNavSearchText = ref('')
  const normalizedNodeNavSearchText = computed(() => normalizeSearchText(nodeNavSearchText.value))
  const nodeNavFailedOnly = ref(false)
  const nodeNavMode = ref<NodeNavMode>('pipeline')

  const rootTaskEntries = computed(() => {
    const entries = currentNodes.value.map((node, originalIndex) => ({ node, originalIndex }))
    const rootTaskId = selectedRootTaskId.value
    if (rootTaskId == null) return entries
    return entries.filter((entry) => entry.node.task_id === rootTaskId)
  })

  const pipelineEntries = computed<SourceEntry[]>(() => {
    return currentNodes.value.map((node, originalIndex) => ({
      node,
      originalIndex,
      primaryText: node.name || '未命名节点',
      primaryMatchKind: 'node',
    }))
  })

  const nextListHitEntries = computed<SourceEntry[]>(() => {
    const result: SourceEntry[] = []
    for (const entry of rootTaskEntries.value) {
      const hitName = resolveNodeNextListHitName(entry.node)
      if (!hitName) continue
      result.push({
        node: entry.node,
        originalIndex: entry.originalIndex,
        primaryText: hitName,
        primaryMatchKind: 'next-list',
      })
    }
    return result
  })

  const sourceEntries = computed<SourceEntry[]>(() => {
    return nodeNavMode.value === 'pipeline'
      ? pipelineEntries.value
      : nextListHitEntries.value
  })

  const appendPrimaryMatches = (entry: SourceEntry, query: string) => {
    const details = collectNodeNavMatchDetails(entry.node, query)
    if (!query) return details

    const withPrimary = normalizeNodeNavMatchText(entry.primaryText).includes(query)
    if (withPrimary) {
      details.unshift({ kind: entry.primaryMatchKind, text: entry.primaryText })
    }

    return details
  }

  const toggleNodeNavFailedOnly = () => {
    nodeNavFailedOnly.value = !nodeNavFailedOnly.value
  }

  const nodeNavItems = computed<NodeNavViewItem[]>(() => {
    const query = normalizedNodeNavSearchText.value
    return sourceEntries.value
      .map((entry) => ({
        node: entry.node,
        originalIndex: entry.originalIndex,
        primaryText: entry.primaryText,
        matchDetails: appendPrimaryMatches(entry, query),
      }))
      .map((item) => {
        const matchKinds = getNodeNavMatchKinds(item.matchDetails)
        return {
          ...item,
          matchKinds,
          matchHint: formatNodeNavMatchHint(matchKinds),
          matchPreview: formatNodeNavMatchPreview(item.matchDetails),
        }
      })
        .filter((item) => nodeNavMode.value !== 'pipeline' || !nodeNavFailedOnly.value || item.node.status === 'failed')
      .filter((item) => !query || item.matchDetails.length > 0)
  })

  const nodeNavEmptyDescription = computed(() => {
    if (currentNodes.value.length === 0) return '暂无节点数据'
    if (nodeNavMode.value === 'next-list-hit') {
      if (rootTaskEntries.value.length === 0) return '暂无根层节点数据'
      if (nextListHitEntries.value.length === 0) return '暂无 NextList 命中节点'
    }
    if (normalizedNodeNavSearchText.value) return '未找到匹配节点'
    if (nodeNavFailedOnly.value) return '暂无失败节点'
    return '暂无节点数据'
  })

  const setNodeNavMode = (mode: NodeNavMode) => {
    nodeNavMode.value = mode
  }

  return {
    nodeNavSearchText,
    normalizedNodeNavSearchText,
    nodeNavFailedOnly,
    nodeNavMode,
    setNodeNavMode,
    toggleNodeNavFailedOnly,
    nodeNavItems,
    nodeNavEmptyDescription,
    formatNodeNavMatchHint,
    formatNodeNavMatchPreview,
  }
}
