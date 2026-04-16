import {
  clearSearchResultState,
  isManualSourceMissing,
  showSourceNotReadyMessage,
} from './executorHelpers'
import { buildSearchResultState, buildSourceReadyOptions } from './optionBuilders'
import { ensureSearchSourceReady } from './sourceGuard'
import { i18n } from '../../../../i18n'
import type { TextSearchSearchExecutorOptions } from './executorTypes'

export const ensureSearchPreconditions = async (
  options: TextSearchSearchExecutorOptions,
): Promise<boolean> => {
  if (!options.searchText.value) {
    clearSearchResultState(buildSearchResultState(options))
    return false
  }

  if (options.isLoadingFile.value) {
    return false
  }

  const sourceReady = await ensureSearchSourceReady(buildSourceReadyOptions(options))
  if (!sourceReady) {
    showSourceNotReadyMessage(options.sourceMode.value)
    return false
  }

  if (isManualSourceMissing(
    options.sourceMode.value,
    options.fileName.value,
    options.fileContent.value,
    options.fileHandle.value,
  )) {
    alert(i18n.global.t('textSearch.selectFileFirst'))
    return false
  }

  return true
}
