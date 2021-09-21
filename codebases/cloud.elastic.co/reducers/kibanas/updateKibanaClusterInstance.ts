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

import { KibanaCluster, KibanaClusterInstance } from '../../types'

/**
 * Given a cluster and a string with instance ID, find instance in the cluster
 * and apply an update function to it.
 *
 * @param {Object} oldCluster the cluster to be updated
 * @param {string} instanceIds an array of strings with the instance IDs to be updated
 * @param {Function} updateFn a function which will be supplied a single instance
 * @return {Object} a copy of `oldCluster` with the instances updated.
 */
function updateInstances(
  oldCluster: KibanaCluster,
  instanceIds: string[],
  updateFn: (instance: KibanaClusterInstance) => KibanaClusterInstance,
) {
  return instanceIds.reduce((cluster: KibanaCluster, instanceId) => {
    const indexAtWhichToUpdate = findIndex(cluster.instances.record, { name: instanceId })
    return updateIn(cluster, [`instances`, `record`, String(indexAtWhichToUpdate)], updateFn)
  }, oldCluster)
}

export function updateClusterInstancesMaintenanceMode(
  oldCluster: KibanaCluster,
  instanceIds: string[],
  action: 'start' | 'stop',
) {
  return updateInstances(oldCluster, instanceIds, (instance) =>
    replaceIn(instance, [`status`, `inMaintenanceMode`], action === `start`),
  )
}

export function updateClusterInstancesStatus(
  oldCluster: KibanaCluster,
  instanceIds: string[],
  action: 'start' | 'stop',
) {
  return updateInstances(oldCluster, instanceIds, (instance) =>
    updateIn(instance, [`status`], (status) => ({
      ...status,
      isStarted: action === `start`,
      isRunning: action === `start`,
    })),
  )
}
