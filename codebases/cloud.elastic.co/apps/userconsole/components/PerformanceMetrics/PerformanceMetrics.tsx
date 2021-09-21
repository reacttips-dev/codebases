/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React from 'react'

import loadable from '@loadable/component'

import { EuiLoadingContent } from '@elastic/eui'

import { AsyncRequestState, ElasticsearchCluster } from '../../../../types'

import './performanceMetrics.scss'

const PerformanceMetricsCharts = loadable(() => import(`./PerformanceMetricsCharts`), {
  fallback: <EuiLoadingContent />,
})

type Metrics = {
  cpu: {
    cpuUsage: any[]
    cpuCredits: any[]
    pressurePerNode: any[]
    diskUsagePerNode: any[]
  }
  request: {
    requestCounts: any[]
    statsPerAction: { index: any[]; search: any[] }
  }
  memory: any[]
}

type Props = {
  fetchMetrics: (cluster: ElasticsearchCluster) => Promise<any>
  metrics: Metrics
  metricsRequest: AsyncRequestState
  theme: string
  cluster: ElasticsearchCluster
}

function PerformanceMetrics({ cluster, metrics, metricsRequest, theme }: Props) {
  if (cluster.isStopped) {
    return null
  }

  return (
    <PerformanceMetricsCharts metrics={metrics} metricsRequest={metricsRequest} theme={theme} />
  )
}

export default PerformanceMetrics
