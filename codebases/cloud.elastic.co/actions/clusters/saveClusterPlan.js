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

import { merge } from 'lodash'

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { SAVE_CLUSTER_PLAN, WAIT_FOR_PENDING_CLUSTER } from '../../constants/actions'

import { updateEsClusterPlanUrl } from '../../lib/api/v1/urls'
import { cleanOldFailoverOptions } from '../../lib/clusters'
import history from '../../lib/history'
import { deploymentUrl } from '../../lib/urlBuilder'
import { updateIn } from '../../lib/immutability-helpers'
import { removeNonDedicatedMasters } from '../../lib/deployments/nodeTypes'
import { isDedicatedMaster } from '../../lib/stackDeployments'

export const waitForPendingCluster = (regionId, clusterId) => ({
  type: WAIT_FOR_PENDING_CLUSTER,
  meta: { regionId, clusterId },
  payload: {},
})

// Used whenever you need to send the plan as-is. For all other cases use
// `saveClusterPlan`, which makes sure previously applied failover options
// are removed.
export function saveRawClusterPlan({ cluster, plan, redirectTo }) {
  return (dispatch) => {
    const { regionId, id: clusterId, stackDeploymentId } = cluster
    const url = updateEsClusterPlanUrl({ regionId, clusterId })

    return dispatch(
      asyncRequest({
        type: SAVE_CLUSTER_PLAN,
        url,
        method: `post`,
        meta: { regionId, clusterId },
        crumbs: [regionId, clusterId],
        payload: plan,
      }),
    ).then(() => {
      dispatch(waitForPendingCluster(regionId, clusterId))

      return history.push(redirectTo || deploymentUrl(stackDeploymentId))
    })
  }
}

// "Safely" save cluster plan, i.e. remove failover options
// applied previously.
export const saveClusterPlan = (
  cluster,
  plan,
  planOverrides,
  { removeTransient, redirectTo } = {},
) =>
  saveRawClusterPlan({
    cluster,
    plan: preparePlanBeforeUpdateCluster({
      plan,
      planOverrides,
      options: { removeTransient },
    }),
    redirectTo,
  })

export const preparePlanBeforeUpdateCluster = ({
  plan,
  planOverrides,
  options: { removeTransient = true } = {},
}) => {
  const newPlan = removeTransient ? cleanOldFailoverOptions(plan) : { ...plan }

  const mergedPlan = merge(newPlan, planOverrides)

  const hasSize = (each) => each.memory_per_node || (each.size && each.size.value > 0)

  // Remove topology elements with zero size, otherwise the API will reject
  // the request
  const filteredPendingPlan = updateIn(mergedPlan, [`cluster_topology`], (topology) => {
    const nonZeroTopologies = topology.filter(hasSize)

    // If his plan has dedicated master nodes, then we must ensure that none
    // of the other nodes have the `master` role.
    const hasDedicatedMaster = nonZeroTopologies.some((topologyElement) =>
      isDedicatedMaster({ topologyElement }),
    )

    return hasDedicatedMaster ? removeNonDedicatedMasters(nonZeroTopologies) : nonZeroTopologies
  })

  return filteredPendingPlan
}

export const resetSaveClusterPlanStatus = (...crumbs) =>
  resetAsyncRequest(SAVE_CLUSTER_PLAN, crumbs)
