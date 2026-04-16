import { readContextLinesFromFile } from './contextRead'
import { i18n } from '../../../../i18n'
import type { LoadContextLinesOptions } from './types'

export const loadContextLinesForRuntime = async (
  options: LoadContextLinesOptions,
  targetLine: number,
) => {
  if (!options.fileHandle.value) return

  try {
    const { lines, startLine } = await readContextLinesFromFile({
      file: options.fileHandle.value,
      totalLines: options.totalLines.value,
      targetLine,
    })
    options.contextLines.value = lines
    options.contextStartLine.value = startLine
  } catch (error) {
    alert(i18n.global.t('textSearch.loadContextFailed') + error)
  }
}
