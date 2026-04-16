import { executeAndCommitSearch } from './executeAndCommit'
import { ensureSearchPreconditions } from './preconditions'
import { i18n } from '../../../../i18n'
import type { TextSearchSearchExecutorOptions } from './executorTypes'

export const createPerformSearchAction = (options: TextSearchSearchExecutorOptions) => {
  return async () => {
    const preconditionsReady = await ensureSearchPreconditions(options)
    if (!preconditionsReady) {
      return
    }

    options.isSearching.value = true
    options.abortSearch.value = false

    try {
      await executeAndCommitSearch(options)
    } catch (error) {
      alert(i18n.global.t('textSearch.searchFailed') + error)
    } finally {
      options.isSearching.value = false
    }
  }
}
