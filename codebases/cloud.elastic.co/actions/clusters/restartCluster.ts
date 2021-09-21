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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { RESTART_CLUSTER } from '../../constants/actions'

import { waitForPendingCluster } from './saveClusterPlan'

import history from '../../lib/history'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { deploymentUrl } from '../../lib/urlBuilder'
import { restartEsClusterUrl } from '../../lib/api/v1/urls'

import { StackDeployment, ElasticsearchCluster, RestartStrategy, ThunkAction } from '../../types'

export function restartEsCluster(
  deployment: StackDeployment,
  restartStrategy?: RestartStrategy,
): ThunkAction {
  const stackDeploymentId = deployment.id
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster

  return restartClusterImpl({ regionId, clusterId, stackDeploymentId, restartStrategy })
}

export function restartCluster(
  cluster: ElasticsearchCluster,
  restartStrategy?: RestartStrategy,
): ThunkAction {
  const { regionId, id: clusterId, stackDeploymentId } = cluster
  return restartClusterImpl({ regionId, clusterId, stackDeploymentId, restartStrategy })
}

export function restartClusterImpl({
  regionId,
  clusterId,
  stackDeploymentId,
  restartStrategy = `__all__`,
}: {
  regionId: string
  clusterId: string
  stackDeploymentId: string | null
  restartStrategy?: RestartStrategy
}): ThunkAction {
  return (dispatch) => {
    const url = restartEsClusterUrl({
      regionId,
      clusterId,
      groupAttribute: restartStrategy,
    })

    return dispatch(
      asyncRequest({
        type: RESTART_CLUSTER,
        method: `POST`,
        url,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
      }),
    ).then(() => {
      dispatch(waitForPendingCluster(regionId, clusterId))
      return history.push(deploymentUrl(stackDeploymentId!))
    })
  }
}

export const resetRestartClusterStatus = (...crumbs: string[]) =>
  resetAsyncRequest(RESTART_CLUSTER, crumbs)
