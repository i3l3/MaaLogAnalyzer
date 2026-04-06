import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useFlowItemExpandState } from '../useFlowItemExpandState'

describe('useFlowItemExpandState', () => {
  it('applies default collapse, toggle, reset and forceExpand rules', () => {
    const forceExpand = ref<boolean | undefined>(false)
    const defaultCollapsed = ref<boolean | undefined>(true)
    const resetWhen = ref<unknown>(1)

    const state = useFlowItemExpandState({
      forceExpand,
      defaultCollapsed,
      resetWhen,
    })

    expect(state.isExpanded('node-1')).toBe(false)

    state.toggle('node-1')
    expect(state.isExpanded('node-1')).toBe(true)

    resetWhen.value = 2
    expect(state.isExpanded('node-1')).toBe(false)

    defaultCollapsed.value = false
    expect(state.isExpanded('node-1')).toBe(true)

    state.toggle('node-1')
    expect(state.isExpanded('node-1')).toBe(false)

    forceExpand.value = true
    expect(state.isExpanded('node-1')).toBe(true)
  })
})
