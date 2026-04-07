import type { NodeInfo } from '../../../types'
import type { NodeNavViewItem } from './useNodeNavSearch'

export const resolveNodeByOriginalIndex = (
  items: NodeNavViewItem[],
  originalIndex: number,
): NodeInfo | null => {
  const item = items.find((entry) => entry.originalIndex === originalIndex)
  return item?.node ?? null
}
