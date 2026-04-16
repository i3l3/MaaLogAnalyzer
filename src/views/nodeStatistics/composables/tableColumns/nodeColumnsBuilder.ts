import type { DataTableColumns } from 'naive-ui'
import type { NodeStatistics } from '@windsland52/maa-log-parser/node-statistics'
import { formatDuration } from '../../../../utils/formatDuration'
import { i18n } from '../../../../i18n'
import { renderNodeStatusTags, renderSuccessRateProgress } from './renderers'

export const buildNodeColumns = (isMobile: boolean): DataTableColumns<NodeStatistics> => {
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
        title: i18n.global.t('nodeStats.columns.avgDuration'),
        key: 'avgDuration',
        width: 90,
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.avgDuration - b.avgDuration,
        render: (row) => formatDuration(row.avgDuration),
      },
      {
        title: i18n.global.t('nodeStats.columns.successRate'),
        key: 'successRate',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.successRate - b.successRate,
        render: (row) => `${row.successRate.toFixed(0)}%`,
      },
    ]
  }

  return [
    {
      title: i18n.global.t('nodeStats.columns.nodeName'),
      key: 'name',
      width: 250,
      ellipsis: { tooltip: true },
      render: (row) => row.name,
    },
    {
      title: i18n.global.t('nodeStats.columns.execCount'),
      key: 'count',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.count - b.count,
      render: (row) => row.count,
    },
    {
      title: i18n.global.t('nodeStats.columns.avgDuration'),
      key: 'avgDuration',
      width: 100,
      align: 'right',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.avgDuration - b.avgDuration,
      render: (row) => formatDuration(row.avgDuration),
    },
    {
      title: i18n.global.t('nodeStats.columns.minDuration'),
      key: 'minDuration',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.minDuration - b.minDuration,
      render: (row) => formatDuration(row.minDuration),
    },
    {
      title: i18n.global.t('nodeStats.columns.maxDuration'),
      key: 'maxDuration',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.maxDuration - b.maxDuration,
      render: (row) => formatDuration(row.maxDuration),
    },
    {
      title: i18n.global.t('nodeStats.columns.totalDuration'),
      key: 'totalDuration',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.totalDuration - b.totalDuration,
      render: (row) => formatDuration(row.totalDuration),
    },
    {
      title: i18n.global.t('nodeStats.columns.successRate'),
      key: 'successRate',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.successRate - b.successRate,
      render: (row) => renderSuccessRateProgress(row.successRate),
    },
    {
      title: i18n.global.t('nodeStats.columns.successFailed'),
      key: 'status',
      width: 120,
      align: 'center',
      render: (row) => renderNodeStatusTags(row.successCount, row.failCount),
    },
  ]
}
