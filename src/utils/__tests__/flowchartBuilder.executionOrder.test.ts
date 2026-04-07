import { describe, expect, it } from 'vitest'
import type { NodeInfo, TaskInfo } from '../../types'
import { buildFlowchartData } from '../flowchartBuilder'

const makeNode = (params: {
  nodeId: number
  name: string
  ts: string
  status?: NodeInfo['status']
  nextList?: NodeInfo['next_list']
}): NodeInfo => ({
  node_id: params.nodeId,
  name: params.name,
  ts: params.ts,
  status: params.status ?? 'success',
  task_id: 100,
  next_list: params.nextList ?? [],
})

const makeTask = (nodes: NodeInfo[]): TaskInfo => ({
  task_id: 100,
  entry: 'FlowTask',
  hash: 'h-flow',
  uuid: 'u-flow',
  start_time: '2026-04-07 10:00:00.000',
  status: 'succeeded',
  nodes,
  events: [],
})

describe('buildFlowchartData execution order', () => {
  it('uses global execution order for node badges and execution edges', async () => {
    const task = makeTask([
      makeNode({
        nodeId: 3,
        name: 'NodeC',
        ts: '2026-04-07 10:00:00.300',
        status: 'failed',
      }),
      makeNode({
        nodeId: 1,
        name: 'NodeA',
        ts: '2026-04-07 10:00:00.100',
        status: 'success',
      }),
      makeNode({
        nodeId: 2,
        name: 'NodeB',
        ts: '2026-04-07 10:00:00.200',
        status: 'running',
      }),
    ])

    const { nodes, edges } = await buildFlowchartData(task)

    const nodeA = nodes.find((node) => node.id === 'NodeA')
    const nodeB = nodes.find((node) => node.id === 'NodeB')
    const nodeC = nodes.find((node) => node.id === 'NodeC')
    expect(nodeA?.data.executionOrder).toEqual([1])
    expect(nodeB?.data.executionOrder).toEqual([2])
    expect(nodeC?.data.executionOrder).toEqual([3])

    const edgeAB = edges.find((edge) => edge.id === 'NodeA->NodeB')
    const edgeBC = edges.find((edge) => edge.id === 'NodeB->NodeC')
    expect(edgeAB?.data.executed).toBe(true)
    expect(edgeAB?.data.edgeStatus).toBe('running')
    expect(edgeBC?.data.executed).toBe(true)
    expect(edgeBC?.data.edgeStatus).toBe('failed')
  })

  it('keeps repeated node execution order aligned to sorted timeline', async () => {
    const task = makeTask([
      makeNode({
        nodeId: 11,
        name: 'NodeA',
        ts: '2026-04-07 10:00:00.300',
      }),
      makeNode({
        nodeId: 12,
        name: 'NodeA',
        ts: '2026-04-07 10:00:00.100',
      }),
      makeNode({
        nodeId: 13,
        name: 'NodeB',
        ts: '2026-04-07 10:00:00.200',
      }),
    ])

    const { nodes } = await buildFlowchartData(task)
    const nodeA = nodes.find((node) => node.id === 'NodeA')
    const nodeB = nodes.find((node) => node.id === 'NodeB')

    expect(nodeA?.data.executionOrder).toEqual([1, 3])
    expect(nodeB?.data.executionOrder).toEqual([2])
  })
})
