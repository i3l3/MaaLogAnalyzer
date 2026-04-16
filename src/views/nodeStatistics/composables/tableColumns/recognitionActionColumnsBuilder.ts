import type { DataTableColumns } from 'naive-ui'
import type { RecognitionActionStatistics } from '@windsland52/maa-log-parser/node-statistics'
import { formatDuration } from '../../../../utils/formatDuration'
import { i18n } from '../../../../i18n'
import { renderSuccessRateProgress } from './renderers'

export const buildRecognitionActionColumns = (
  isMobile: boolean,
): DataTableColumns<RecognitionActionStatistics> => {
  if (isMobile) {
    return [
      {
        title: i18n.global.t('nodeStats.columns.nodeName'),
        key: 'name',
        width: 150,
        ellipsis: { tooltip: true },
        render: (row) => row.name,
      },
      {
        title: i18n.global.t('nodeStats.columns.count'),
        key: 'count',
        width: 60,
        align: 'center',
        sorter: (a, b) => a.count - b.count,
        render: (row) => row.count,
      },
      {
        title: i18n.global.t('nodeStats.columns.recognitionDuration'),
        key: 'avgRecognitionDuration',
        width: 90,
        align: 'right',
        sorter: (a, b) => a.avgRecognitionDuration - b.avgRecognitionDuration,
        render: (row) => row.recognitionCount > 0 ? formatDuration(row.avgRecognitionDuration) : '-',
      },
      {
        title: i18n.global.t('nodeStats.columns.actionDuration'),
        key: 'avgActionDuration',
        width: 90,
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.avgActionDuration - b.avgActionDuration,
        render: (row) => row.actionCount > 0 ? formatDuration(row.avgActionDuration) : '-',
      },
    ]
  }

  return [
    {
      title: i18n.global.t('nodeStats.columns.nodeName'),
      key: 'name',
      width: 200,
      ellipsis: { tooltip: true },
      render: (row) => row.name,
    },
    {
      title: i18n.global.t('nodeStats.columns.execCount'),
      key: 'count',
      width: 90,
      align: 'center',
      sorter: (a, b) => a.count - b.count,
      render: (row) => row.count,
    },
    {
      title: i18n.global.t('nodeStats.columns.avgRecognitionAttempts'),
      key: 'avgRecognitionAttempts',
      width: 110,
      align: 'center',
      sorter: (a, b) => a.avgRecognitionAttempts - b.avgRecognitionAttempts,
      render: (row) => row.avgRecognitionAttempts.toFixed(1),
    },
    {
      title: i18n.global.t('nodeStats.columns.avgRecognitionDuration'),
      key: 'avgRecognitionDuration',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.avgRecognitionDuration - b.avgRecognitionDuration,
      render: (row) => row.recognitionCount > 0 ? formatDuration(row.avgRecognitionDuration) : '-',
    },
    {
      title: i18n.global.t('nodeStats.columns.maxRecognitionDuration'),
      key: 'maxRecognitionDuration',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.maxRecognitionDuration - b.maxRecognitionDuration,
      render: (row) => row.recognitionCount > 0 ? formatDuration(row.maxRecognitionDuration) : '-',
    },
    {
      title: i18n.global.t('nodeStats.columns.avgActionDuration'),
      key: 'avgActionDuration',
      width: 120,
      align: 'right',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.avgActionDuration - b.avgActionDuration,
      render: (row) => row.actionCount > 0 ? formatDuration(row.avgActionDuration) : '-',
    },
    {
      title: i18n.global.t('nodeStats.columns.maxActionDuration'),
      key: 'maxActionDuration',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.maxActionDuration - b.maxActionDuration,
      render: (row) => row.actionCount > 0 ? formatDuration(row.maxActionDuration) : '-',
    },
    {
      title: i18n.global.t('nodeStats.columns.successRate'),
      key: 'successRate',
      width: 130,
      align: 'center',
      sorter: (a, b) => a.successRate - b.successRate,
      render: (row) => renderSuccessRateProgress(row.successRate),
    },
  ]
}
