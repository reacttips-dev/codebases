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

import { findIndex } from 'lodash'
import { replaceIn, updateIn } from '../../lib/immutability-helpers'

import { ElasticsearchCluster } from '../../types'

/**
 * Given a cluster and a CSV string of instance IDs, find each of the instances
 * in the cluster and apply an update function to them.
 *
 * @param {Object} oldCluster the cluster to be updated
 * @param {string} instanceIds a CSV string of the instance IDS to be updated
 * @param {Function} updateFn a function which will be supplied a single instance
 * @return {Object} a copy of `oldCluster` with the instances updated.
 */
function updateInstances(oldCluster: ElasticsearchCluster, instanceIds: string, updateFn) {
  return instanceIds.split(/,/).reduce((cluster: ElasticsearchCluster, instanceId) => {
    const indexAtWhichToUpdate = findIndex(cluster.instances.record, { name: instanceId })
    return updateIn(cluster, [`instances`, `record`, String(indexAtWhichToUpdate)], updateFn)
  }, oldCluster)
}

export function updateClusterInstancesMaintenanceMode(
  oldCluster: ElasticsearchCluster,
  instanceIds: string,
  action: string,
) {
  return updateInstances(oldCluster, instanceIds, (instance) =>
    replaceIn(instance, [`status`, `inMaintenanceMode`], action === `start`),
  )
}

export function updateClusterInstancesStatus(
  oldCluster: ElasticsearchCluster,
  instanceIds: string,
  action: string,
) {
  return updateInstances(oldCluster, instanceIds, (instance) =>
    updateIn(instance, [`status`], (status) => ({
      ...status,
      isStarted: action === `start`,
      isRunning: action === `start`,
    })),
  )
}
