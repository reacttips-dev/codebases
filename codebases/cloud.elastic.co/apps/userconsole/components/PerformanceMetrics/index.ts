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

import { connect } from 'react-redux'

import PerformanceMetrics from './PerformanceMetrics'

import { fetchMetrics } from '../../actions/clusters/metrics'

import { getCluster, getTheme } from '../../../../reducers'
import { fetchMetricsRequest, getMetrics } from '../../reducers'

import withPolling from '../../../../lib/withPolling'
import { withStackDeploymentRouteParams } from '../../../../components/StackDeploymentEditor'

import { ThunkDispatch } from '../../../../types'

const mapStateToProps = (state, { regionId, deploymentId }) => {
  const cluster = getCluster(state, regionId, deploymentId)

  return {
    metrics: cluster ? getMetrics(state, cluster.regionId, cluster.id) : null,
    metricsRequest: cluster ? fetchMetricsRequest(state, cluster.regionId, cluster.id) : null,
    theme: getTheme(state),
    cluster,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchMetrics: (cluster) => dispatch(fetchMetrics(cluster)),
})

const pollingComponent = withPolling(
  PerformanceMetrics,
  ({ fetchMetrics: refreshMetrics, cluster }) => ({
    onPoll: cluster.isStopped ? () => Promise.resolve() : () => refreshMetrics(cluster),
    pollImmediately: [
      [`region`, `id`],
      [`cluster`, `id`],
    ],
  }),
)

export default withStackDeploymentRouteParams(
  connect(mapStateToProps, mapDispatchToProps)(pollingComponent),
)
