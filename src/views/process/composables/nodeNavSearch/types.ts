import type { NodeInfo } from '../../../../types'

export type NodeNavMatchKind = 'node' | 'next-list' | 'flow'

export interface NodeNavMatchDetail {
  kind: NodeNavMatchKind
  text: string
}

export interface NodeNavViewItem {
  node: NodeInfo
  originalIndex: number
  primaryText: string
  matchDetails: NodeNavMatchDetail[]
  matchKinds: NodeNavMatchKind[]
  matchHint: string
  matchPreview: string
}
