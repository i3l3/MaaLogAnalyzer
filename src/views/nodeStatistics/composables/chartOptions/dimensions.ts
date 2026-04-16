import { i18n } from '../../../../i18n'

export type NodeChartDimension = 'count' | 'totalDuration' | 'avgDuration' | 'maxDuration'
export type RecognitionActionChartDimension =
  | 'avgRecognitionDuration'
  | 'maxRecognitionDuration'
  | 'avgActionDuration'
  | 'maxActionDuration'
  | 'avgRecognitionAttempts'

export const nodeChartDimensionOptions = [
  { label: i18n.global.t('nodeStats.chart.count'), value: 'count' },
  { label: i18n.global.t('nodeStats.chart.totalDuration'), value: 'totalDuration' },
  { label: i18n.global.t('nodeStats.chart.avgDuration'), value: 'avgDuration' },
  { label: i18n.global.t('nodeStats.chart.maxDuration'), value: 'maxDuration' },
]

export const recognitionActionChartDimensionOptions = [
  { label: i18n.global.t('nodeStats.chart.avgRecognitionDuration'), value: 'avgRecognitionDuration' },
  { label: i18n.global.t('nodeStats.chart.maxRecognitionDuration'), value: 'maxRecognitionDuration' },
  { label: i18n.global.t('nodeStats.chart.avgActionDuration'), value: 'avgActionDuration' },
  { label: i18n.global.t('nodeStats.chart.maxActionDuration'), value: 'maxActionDuration' },
  { label: i18n.global.t('nodeStats.chart.avgRecognitionAttempts'), value: 'avgRecognitionAttempts' },
]
