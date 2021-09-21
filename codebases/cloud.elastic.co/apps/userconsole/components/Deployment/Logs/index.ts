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

import { parse } from 'querystring'
import { connect } from 'react-redux'

import { withTransaction } from '@elastic/apm-rum-react'

import DeploymentLogs from './DeploymentLogs'

import { fetchLogs } from '../../../actions/clusters/logs'

import { getLogs, fetchLogsRequest, ClusterLogs } from '../../../reducers'
import { getStackDeployment } from '../../../../../reducers'

import { withStackDeploymentRouteParams } from '../../../../../components/StackDeploymentEditor'

import { AsyncRequestState, ElasticsearchId, RegionId, StackDeployment } from '../../../../../types'

function normalizeQueryParams(location) {
  const query = parse(location.search.slice(1))
  const { q = ``, offset = 0, limit = 20, filter = [] } = query

  return {
    q,
    offset: parseInt(String(offset), 10),
    limit: parseInt(String(limit), 10),
    filter: Array.isArray(filter) ? filter : [filter],
  }
}

type Params = {
  offset: number
  limit: number
  q: string | string[]
  filter: string[]
}

type StateProps = {
  deployment: StackDeployment | null
  clusterLogs: ClusterLogs | null
  fetchLogsRequest: AsyncRequestState
  queryParams: Params
}

type DispatchProps = {
  fetchLogs: (regionId: RegionId, clusterId: ElasticsearchId, params: Params) => void
}

const mapStateToProps = (
  state,
  { regionId, deploymentId, location, stackDeploymentId },
): StateProps => ({
  deployment: getStackDeployment(state, stackDeploymentId),
  clusterLogs: getLogs(state, regionId, deploymentId),
  fetchLogsRequest: fetchLogsRequest(state, regionId, deploymentId),
  queryParams: normalizeQueryParams(location),
})

const mapDispatchToProps: DispatchProps = {
  fetchLogs,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Deployment logs`, `component`)(DeploymentLogs)),
)
