<script setup lang="ts">
import {
  NCard,
  NRadioButton,
  NRadioGroup,
  NSwitch,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { AppSettings } from '../../../utils/settings'

const { t } = useI18n()

const props = defineProps<{
  settings: AppSettings
}>()
</script>

<template>
  <n-card size="small" :bordered="true" style="margin-bottom: 12px">
    <n-text strong style="font-size: 16px; display: block; margin-bottom: 16px">{{ t('settings.logAnalysis.title') }}</n-text>

    <table class="settings-grid" role="presentation">
      <tbody>
        <tr>
          <td>{{ t('settings.logAnalysis.displayMode') }}</td>
          <td>
            <n-radio-group v-model:value="props.settings.displayMode">
              <n-radio-button value="detailed">{{ t('settings.logAnalysis.detailed') }}</n-radio-button>
              <n-radio-button value="compact">{{ t('settings.logAnalysis.compact') }}</n-radio-button>
              <n-radio-button value="tree">{{ t('settings.logAnalysis.tree') }}</n-radio-button>
            </n-radio-group>
          </td>
        </tr>
        
        <tr>
          <td>{{ t('settings.logAnalysis.showUnrecognized') }}</td>
          <td><n-switch v-model:value="props.settings.showNotRecognizedNodes" /></td>
        </tr>

        <tr v-if="props.settings.displayMode === 'detailed' || props.settings.displayMode === 'tree'">
          <td>{{ t('settings.logAnalysis.collapseRootRecognition') }}</td>
          <td><n-switch v-model:value="props.settings.defaultCollapseRecognition" /></td>
        </tr>

        <tr v-if="props.settings.displayMode === 'detailed' || props.settings.displayMode === 'tree'">
          <td>{{ t('settings.logAnalysis.collapseRootAction') }}</td>
          <td><n-switch v-model:value="props.settings.defaultCollapseRootActionList" /></td>
        </tr>

        <tr v-if="props.settings.displayMode === 'detailed' || props.settings.displayMode === 'tree'">
          <td>{{ t('settings.logAnalysis.collapseNestedRecognition') }}</td>
          <td><n-switch v-model:value="props.settings.defaultCollapseNestedRecognition" /></td>
        </tr>

        <tr v-if="props.settings.displayMode === 'detailed' || props.settings.displayMode === 'tree'">
          <td>{{ t('settings.logAnalysis.collapseNestedAction') }}</td>
          <td><n-switch v-model:value="props.settings.defaultCollapseNestedActionNodes" /></td>
        </tr>

        <tr>
          <td>{{ t('settings.logAnalysis.expandRawJson') }}</td>
          <td><n-switch v-model:value="props.settings.defaultExpandRawJson" /></td>
        </tr>
      </tbody>
    </table>
  </n-card>
</template>

<style scoped src="./settingsGrid.css"></style>
