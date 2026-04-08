import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import type { NodeInfo } from '../../../../types'
import { useNodeNavSearch } from '../useNodeNavSearch'

const createNode = (params: {
  nodeId: number
  name: string
  taskId: number
  nextList?: string[]
  status?: NodeInfo['status']
}): NodeInfo => ({
  node_id: params.nodeId,
  name: params.name,
  ts: '2026-04-08 10:00:00.000',
  status: params.status ?? 'success',
  task_id: params.taskId,
  next_list: (params.nextList ?? []).map((name) => ({
    name,
    anchor: false,
    jump_back: false,
  })),
})

describe('useNodeNavSearch', () => {
  it('keeps original pipeline navigation mode by default', () => {
    const nodes = ref<NodeInfo[]>([
      createNode({ nodeId: 1, name: 'A', taskId: 100, nextList: ['B'] }),
      createNode({ nodeId: 2, name: 'B', taskId: 100, nextList: ['C'] }),
      createNode({ nodeId: 3, name: 'CustomInner', taskId: 200, nextList: ['Ignored'] }),
      createNode({ nodeId: 4, name: 'C', taskId: 100, nextList: [] }),
    ])

    const rootTaskId = computed(() => 100)
    const { nodeNavItems, nodeNavMode } = useNodeNavSearch(nodes, rootTaskId)

    expect(nodeNavMode.value).toBe('pipeline')
    expect(nodeNavItems.value.map((item) => item.node.name)).toEqual(['A', 'B', 'CustomInner', 'C'])
    expect(nodeNavItems.value.map((item) => item.originalIndex)).toEqual([0, 1, 2, 3])
  })

  it('builds hit navigation from root-level NextList names and ignores custom nested nodes', () => {
    const nodes = ref<NodeInfo[]>([
      {
        ...createNode({ nodeId: 1, name: 'A', taskId: 100, nextList: ['B'] }),
        node_details: {
          action_id: 1,
          completed: true,
          name: 'B',
          node_id: 1,
          reco_id: 1,
        },
      },
      createNode({ nodeId: 2, name: 'Noise', taskId: 100, nextList: ['X'] }),
      createNode({ nodeId: 3, name: 'CustomInner', taskId: 200, nextList: ['Ignored'] }),
      {
        ...createNode({ nodeId: 4, name: 'CCFlagInCombatMain', taskId: 100, nextList: ['CCCombatEnd', 'CCSkipCombat'] }),
        node_details: {
          action_id: 2,
          completed: true,
          name: 'CCCombatEnd',
          node_id: 4,
          reco_id: 2,
        },
        action_details: {
          action_id: 2,
          action: 'Click',
          box: [0, 0, 1, 1],
          detail: {},
          name: 'CCCombatEnd',
          success: true,
        },
        reco_details: {
          reco_id: 2,
          algorithm: 'OCR',
          box: [0, 0, 1, 1],
          detail: {},
          name: 'CCCombatEnd',
        },
      },
    ])

    const rootTaskId = computed(() => 100)
    const { nodeNavItems, setNodeNavMode } = useNodeNavSearch(nodes, rootTaskId)
    setNodeNavMode('next-list-hit')

    expect(nodeNavItems.value.map((item) => item.node.name)).toEqual(['A', 'CCFlagInCombatMain'])
    expect(nodeNavItems.value.map((item) => item.originalIndex)).toEqual([0, 3])
    expect(nodeNavItems.value.map((item) => item.primaryText)).toEqual(['B', 'CCCombatEnd'])
  })

  it('does not include jump_back or anchor prefixes in hit label', () => {
    const nodes = ref<NodeInfo[]>([
      {
        ...createNode({ nodeId: 21, name: 'A', taskId: 100, nextList: [] }),
        next_list: [{ name: 'B', anchor: true, jump_back: true }],
        node_details: {
          action_id: 1,
          completed: true,
          name: 'B',
          node_id: 21,
          reco_id: 1,
        },
      },
      createNode({ nodeId: 22, name: 'B', taskId: 100, nextList: [] }),
    ])

    const rootTaskId = computed(() => 100)
    const { nodeNavItems, setNodeNavMode } = useNodeNavSearch(nodes, rootTaskId)
    setNodeNavMode('next-list-hit')

    expect(nodeNavItems.value).toHaveLength(1)
    expect(nodeNavItems.value[0]?.primaryText).toBe('B')
  })

  it('returns empty hit list description when no root-level NextList hit exists in hit mode', () => {
    const nodes = ref<NodeInfo[]>([
      createNode({ nodeId: 11, name: 'A', taskId: 100, nextList: ['X'] }),
      createNode({ nodeId: 12, name: 'B', taskId: 100, nextList: [] }),
    ])

    const rootTaskId = computed(() => 100)
    const { nodeNavItems, nodeNavEmptyDescription, setNodeNavMode } = useNodeNavSearch(nodes, rootTaskId)
    setNodeNavMode('next-list-hit')

    expect(nodeNavItems.value).toHaveLength(0)
    expect(nodeNavEmptyDescription.value).toBe('暂无 NextList 命中节点')
  })
})
