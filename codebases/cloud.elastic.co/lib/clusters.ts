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

import { get, merge, omit } from 'lodash'

import { isTopologySized } from './deployments/deployment'
import { isEnabledConfiguration } from './deployments/conversion'
import { removeNonDedicatedMasters } from './deployments/nodeTypes'
import { isDedicatedMaster, isDedicatedML } from './stackDeployments/selectors'

import { updateIn } from './immutability-helpers'

import { ApmPlan, ElasticsearchClusterPlan, KibanaClusterPlan } from './api/v1/types'
import { ElasticsearchCluster, PlanAttempt } from '../types'

export function isClusterActive(cluster: ElasticsearchCluster): boolean {
  return cluster.plan.isActive
}

export function findRunningPlanAttempt(attempts: PlanAttempt[]) {
  for (const attempt of attempts) {
    const { healthy } = attempt

    if (!healthy) {
      continue
    }

    const topology = get(attempt, [`plan`, `_source`, `cluster_topology`], [])

    if (isTopologySized(topology)) {
      return attempt
    }
  }

  return null
}

export function cleanOldFailoverOptions<
  T extends ElasticsearchClusterPlan | KibanaClusterPlan | ApmPlan,
>(plan: T | null): T | null {
  return omit(plan, `failover`, `migrate`, `transient`) as T | null
}

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
    const isAutoscaling = plan.autoscaling_enabled

    if (isAutoscaling) {
      const machineLearning = topology.find((topologyElement) => isDedicatedML({ topologyElement }))

      if (machineLearning) {
        delete machineLearning.size
      }
    }

    const filteredTopologies = isAutoscaling ? topology : topology.filter(hasSize)

    // If his plan has dedicated master nodes, then we must ensure that none
    // of the other nodes have the `master` role.
    const hasDedicatedMaster = filteredTopologies.some((topologyElement) => {
      if (isAutoscaling) {
        return isDedicatedMaster({ topologyElement }) && isEnabledConfiguration(topologyElement)
      }

      return isDedicatedMaster({ topologyElement })
    })

    return hasDedicatedMaster ? removeNonDedicatedMasters(filteredTopologies) : filteredTopologies
  })

  return filteredPendingPlan
}

export function restoreSnapshot(plan, snapshotName = `__latest_success__`) {
  return {
    ...plan,
    failover: {
      ...plan.failover,
      restore_snapshot: snapshotName,
      extended_maintenance: true,
    },
  }
}

export function areSameCluster(
  left?: ElasticsearchCluster | null,
  right?: ElasticsearchCluster | null,
) {
  return left && right && left.regionId === right.regionId && left.id === right.id
}

// This function is used to find any sized kibana plan attempt in case
// the user aborts the original plan leaving them with one unhealthy plan
export function findAnyNonZeroSizedPlanAttempt(attempts) {
  for (const attempt of attempts) {
    const topology = get(attempt, [`plan`, `_source`, `cluster_topology`], [])

    if (isTopologySized(topology)) {
      return attempt
    }
  }
}
