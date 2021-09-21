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

import { DEPLOYMENT_WAS_DELETED, HIDE_CLUSTER } from '../../constants/actions'

import history from '../../lib/history'
import { addHiddenDeploymentToast } from '../../lib/toasts'
import { deploymentsUrl } from '../../lib/urlBuilder'

import { shutdownEsClusterUrl } from '../../lib/api/v1/urls'

import { RegionId, ElasticsearchId, ElasticsearchCluster, ThunkAction } from '../../types'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'

const deploymentWasHidden = (regionId: RegionId, clusterId: ElasticsearchId) => {
  history.push(deploymentsUrl())
  addHiddenDeploymentToast()

  return {
    type: DEPLOYMENT_WAS_DELETED,
    meta: { regionId, clusterId },
    payload: {},
  }
}

export function hideClusterResource(cluster: ElasticsearchResourceInfo): ThunkAction {
  const { region, id } = cluster
  return hideClusterImpl(region, id)
}

export function hideCluster(cluster: ElasticsearchCluster): ThunkAction {
  const { regionId, id } = cluster
  return hideClusterImpl(regionId, id)
}

export function hideClusterImpl(regionId: string, clusterId: string): ThunkAction {
  const url = shutdownEsClusterUrl({ regionId, clusterId, hide: true })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: HIDE_CLUSTER,
        url,
        method: `post`,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
      }),
    ).then(() => dispatch(deploymentWasHidden(regionId, clusterId)))
}

export const resetHideClusterStatus = (...crumbs: string[]) =>
  resetAsyncRequest(HIDE_CLUSTER, crumbs)
