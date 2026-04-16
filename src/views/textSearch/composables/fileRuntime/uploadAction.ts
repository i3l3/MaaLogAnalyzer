import { applyUploadedFileToState } from './applyUploadedFile'
import { readUploadedFile } from './fileUpload'
import { i18n } from '../../../../i18n'
import type { HandleRuntimeFileUploadOptions } from './types'

export const handleRuntimeFileUpload = async (
  options: HandleRuntimeFileUploadOptions,
  event: Event,
) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  options.sourceMode.value = 'manual'
  options.isLoadingFile.value = true

  try {
    const loadedFile = await readUploadedFile(file)
    applyUploadedFileToState({
      fileName: options.fileName,
      fileSizeInMB: options.fileSizeInMB,
      isLargeFile: options.isLargeFile,
      fileContent: options.fileContent,
      fileHandle: options.fileHandle,
      totalLines: options.totalLines,
    }, loadedFile)
  } catch (error) {
    alert(i18n.global.t('textSearch.fileReadFailed') + error)
  } finally {
    options.isLoadingFile.value = false
  }
}
