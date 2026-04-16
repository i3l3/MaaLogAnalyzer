import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { getSettings, saveSettings, getDefaultSettings } from '../../../utils/settings'

export const useSettingsState = () => {
  const message = useMessage()
  const { t } = useI18n()
  const settings = getSettings()

  const playbackSpeedOptions = computed(() => [
    { label: t('settings.speed.slow'), value: 1500 },
    { label: t('settings.speed.standard'), value: 900 },
    { label: t('settings.speed.fast'), value: 600 },
    { label: t('settings.speed.ultraFast'), value: 350 },
  ])

  const focusZoomOptions = [
    { label: '0.8x', value: 0.8 },
    { label: '1.0x', value: 1.0 },
    { label: '1.2x', value: 1.2 },
    { label: '1.4x', value: 1.4 },
    { label: '1.6x', value: 1.6 },
  ]

  const handleSave = () => {
    saveSettings(settings)
    message.success(t('settings.savedMessage'))
  }

  const handleReset = () => {
    Object.assign(settings, getDefaultSettings())
    saveSettings(settings)
    message.success(t('settings.resetMessage'))
  }

  return {
    settings,
    playbackSpeedOptions,
    focusZoomOptions,
    handleSave,
    handleReset,
  }
}
