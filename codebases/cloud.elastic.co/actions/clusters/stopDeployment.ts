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

import { waitForPendingCluster } from './saveClusterPlan'
import { deploymentWasDeleted } from './deleteDeployment'

import { STOP_DEPLOYMENT } from '../../constants/actions'

import { shutdownEsClusterUrl } from '../../lib/api/v1/urls'

import { ThunkAction } from '../../types'

export function stopDeployment(cluster, hide = false): ThunkAction {
  const { regionId, id: clusterId } = cluster
  return stopDeploymentById(regionId, clusterId, hide)
}

export function stopDeploymentById(
  regionId: string,
  clusterId: string,
  hide: boolean = false,
): ThunkAction {
  return (dispatch) => {
    const url = shutdownEsClusterUrl({
      regionId,
      clusterId,
      hide,

      // if we're hiding instead of just stopping, don't let the chance of a snapshot failure interfere
      skipSnapshot: hide,
    })

    return dispatch(
      asyncRequest({
        type: STOP_DEPLOYMENT,
        url,
        method: `post`,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
      }),
    ).then(() => {
      dispatch(waitForPendingCluster(regionId, clusterId))

      if (!hide) {
        return null
      }

      return dispatch(deploymentWasDeleted(regionId, clusterId))
    })
  }
}

export const resetStopDeploymentStatus = (...crumbs: string[]) =>
  resetAsyncRequest(STOP_DEPLOYMENT, crumbs)
