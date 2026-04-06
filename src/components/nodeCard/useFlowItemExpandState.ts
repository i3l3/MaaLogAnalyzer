import { ref, watch, type Ref } from 'vue'

interface UseFlowItemExpandStateParams {
  forceExpand: Ref<boolean | undefined>
  defaultCollapsed: Ref<boolean | undefined>
  resetWhen: Ref<unknown>
}

export const useFlowItemExpandState = (params: UseFlowItemExpandStateParams) => {
  const expandedItems = ref<Map<string, boolean>>(new Map())

  const isExpanded = (flowItemId: string): boolean => {
    if (params.forceExpand.value) return true
    const value = expandedItems.value.get(flowItemId)
    if (value !== undefined) return value
    return !(params.defaultCollapsed.value ?? true)
  }

  const toggle = (flowItemId: string) => {
    expandedItems.value.set(flowItemId, !isExpanded(flowItemId))
  }

  const reset = () => {
    expandedItems.value.clear()
  }

  watch(params.resetWhen, reset, { flush: 'sync' })
  watch(params.defaultCollapsed, reset, { flush: 'sync' })

  return {
    isExpanded,
    toggle,
    reset,
  }
}
