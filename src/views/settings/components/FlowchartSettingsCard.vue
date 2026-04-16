<script setup lang="ts">
import {
  NCard,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { AppSettings } from '../../../utils/settings'

const { t } = useI18n()

const props = defineProps<{
  settings: AppSettings
  playbackSpeedOptions: Array<{ label: string; value: number }>
  focusZoomOptions: Array<{ label: string; value: number }>
}>()
</script>

<template>
  <n-card size="small" :bordered="true" style="margin-bottom: 12px">
    <n-text strong style="font-size: 16px; display: block; margin-bottom: 16px">{{ t('settings.flowchart.title') }}</n-text>

    <table class="settings-grid" role="presentation">
      <tbody>
        <tr>
          <td>{{ t('settings.flowchart.edgeStyle') }}</td>
          <td>
            <n-radio-group v-model:value="props.settings.flowchartEdgeStyle">
              <n-radio-button value="orthogonal">{{ t('settings.flowchart.orthogonal') }}</n-radio-button>
              <n-radio-button value="default">{{ t('settings.flowchart.smooth') }}</n-radio-button>
            </n-radio-group>
          </td>
        </tr>

        <tr>
          <td>{{ t('settings.flowchart.edgeFlow') }}</td>
          <td><n-switch v-model:value="props.settings.flowchartEdgeFlowEnabled" /></td>
        </tr>

        <tr>
          <td>{{ t('settings.flowchart.relayout') }}</td>
          <td><n-switch v-model:value="props.settings.flowchartRelayoutAfterDrag" /></td>
        </tr>

        <tr>
          <td>{{ t('settings.flowchart.ignoreUnexecuted') }}</td>
          <td><n-switch v-model:value="props.settings.flowchartIgnoreUnexecutedNodes" /></td>
        </tr>

        <tr>
          <td>{{ t('settings.flowchart.playbackSpeed') }}</td>
          <td>
            <n-select
              v-model:value="props.settings.flowchartPlaybackIntervalMs"
              :options="props.playbackSpeedOptions"
              style="width: 180px; margin: 0 auto"
            />
          </td>
        </tr>

        <tr>
          <td>{{ t('settings.flowchart.focusZoom') }}</td>
          <td>
            <n-select
              v-model:value="props.settings.flowchartFocusZoom"
              :options="props.focusZoomOptions"
              style="width: 180px; margin: 0 auto"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </n-card>
</template>

<style scoped src="./settingsGrid.css"></style>
