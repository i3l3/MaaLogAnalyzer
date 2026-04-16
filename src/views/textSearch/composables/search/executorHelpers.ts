import type { Ref } from 'vue'
import type { SearchResult } from '../types'
import type { SourceMode } from '../loadedSource/types'
import { i18n } from '../../../../i18n'

interface SearchResultState {
  searchResults: Ref<SearchResult[]>
  totalMatches: Ref<number>
}

export const clearSearchResultState = (state: SearchResultState) => {
  state.searchResults.value = []
  state.totalMatches.value = 0
}

export const showSourceNotReadyMessage = (sourceMode: SourceMode) => {
  if (sourceMode === 'loaded') {
    alert(i18n.global.t('textSearch.selectLoadedTargetFirst'))
  } else {
    alert(i18n.global.t('textSearch.selectFileFirst'))
  }
}

export const isManualSourceMissing = (
  sourceMode: SourceMode,
  fileName: string,
  fileContent: string,
  fileHandle: File | null,
) => {
  return sourceMode !== 'loaded' && (!fileName || (!fileContent && !fileHandle))
}

export const commitSearchResults = (state: SearchResultState, results: SearchResult[] | null) => {
  if (!results) return
  state.searchResults.value = results
  state.totalMatches.value = results.length
}
