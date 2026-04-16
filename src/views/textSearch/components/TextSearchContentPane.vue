<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NButton,
  NEmpty,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import TextSearchLargeFileContext from './TextSearchLargeFileContext.vue'
import TextSearchLargeFileEmpty from './TextSearchLargeFileEmpty.vue'
import TextSearchVirtualFileContent from './TextSearchVirtualFileContent.vue'

const { t } = useI18n()

interface FileLineItem {
  key: number
  content: string
}

const props = defineProps<{
  isDark: boolean
  isLargeFile: boolean
  fileName: string
  fileContent: string
  showFileContent: boolean
  totalLines: number
  fileSizeInMB: number
  contextLines: string[]
  contextStartLine: number
  selectedLine: number | null
  fileLines: FileLineItem[]
  filterDebugInfo: (line: string) => string
}>()

const emit = defineEmits<{
  'update:showFileContent': [value: boolean]
  'update:selectedLine': [value: number | null]
}>()

const virtualContentRef = ref<{ scrollToLine: (lineNumber: number) => void } | null>(null)

const scrollToLine = (lineNumber: number) => {
  virtualContentRef.value?.scrollToLine(lineNumber)
}

defineExpose({
  scrollToLine,
})
</script>

<template>
  <n-card
    data-tour="textsearch-content"
    :title="props.isLargeFile ? t('textSearch.largeFileInfo') : t('textSearch.fileContent')"
    size="small"
    style="height: 100%"
    content-style="height: 100%; overflow: hidden; padding: 0"
  >
    <template #header-extra>
      <n-button
        v-if="props.fileContent && !props.isLargeFile"
        size="tiny"
        :type="props.showFileContent ? 'primary' : 'default'"
        @click="emit('update:showFileContent', !props.showFileContent)"
      >
        {{ props.showFileContent ? t('textSearch.hideContent') : t('textSearch.showContent') }}
      </n-button>
    </template>

    <div style="height: 100%; display: flex; flex-direction: column">
      <div v-if="!props.fileName" style="padding: 40px 20px; text-align: center; flex: 1">
        <n-empty :description="t('textSearch.loadFileFirst')" />
      </div>

      <div v-else-if="props.isLargeFile" style="height: 100%; display: flex; flex-direction: column">
        <text-search-large-file-context
          v-if="props.contextLines.length > 0"
          :is-dark="props.isDark"
          :context-lines="props.contextLines"
          :context-start-line="props.contextStartLine"
          :selected-line="props.selectedLine"
          :filter-debug-info="props.filterDebugInfo"
        />

        <text-search-large-file-empty
          v-else
          :file-name="props.fileName"
          :file-size-in-m-b="props.fileSizeInMB"
          :total-lines="props.totalLines"
        />
      </div>

      <div v-else-if="!props.showFileContent" style="padding: 40px 20px; text-align: center; flex: 1">
        <n-empty :description="t('textSearch.clickToShowContent')">
          <template #extra>
            <n-text depth="3" style="font-size: 12px">
              {{ t('textSearch.fileLoaded', { n: props.totalLines }) }}
            </n-text>
          </template>
        </n-empty>
      </div>

      <text-search-virtual-file-content
        v-else
        ref="virtualContentRef"
        :is-dark="props.isDark"
        :file-lines="props.fileLines"
        :selected-line="props.selectedLine"
        @update:selected-line="emit('update:selectedLine', $event)"
      />
    </div>
  </n-card>
</template>
