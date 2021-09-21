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

import { findIndex, get } from 'lodash'
import { updateIn } from '../../lib/immutability-helpers'

import { StackDeployment, SliderInstanceType } from '../../types'
import { ClusterInstanceInfo } from '../../lib/api/v1/types'

/**
 * Given a deployment and a CSV string of instance IDs, find each of the
 * instances in the deployment and apply an update function to them.
 *
 * @param {Object} oldDeployment the deployment to be updated
 * @param {string} resourceId the resource containing the instances
 * @param {string} instanceIds a CSV string of the instance IDS to be updated
 * @param {Function} updateFn a function which will be supplied a single instance
 * @return {Object} a copy of `oldDeployment` with the instances updated.
 */
function updateInstances(
  oldDeployment: StackDeployment,
  kind: SliderInstanceType,
  resourceId: string,
  instanceIds: string,
  updateFn: (instance: ClusterInstanceInfo) => ClusterInstanceInfo,
) {
  return instanceIds.split(/,/).reduce((deployment: StackDeployment, instanceId) => {
    const resourceIndex = findIndex(deployment.resources[kind], ({ id }) => id === resourceId)
    const instanceIndex = findIndex(
      get(deployment, [`resources`, kind, resourceIndex, `info`, `topology`, `instances`]),
      { instance_name: instanceId },
    )

    return updateIn<StackDeployment, ClusterInstanceInfo>(
      deployment,
      [
        `resources`,
        kind,
        String(resourceIndex),
        `info`,
        `topology`,
        `instances`,
        String(instanceIndex),
      ],
      updateFn,
    )
  }, oldDeployment)
}

export function updateStackDeploymentInstancesMaintenanceMode(
  oldDeployment: StackDeployment,
  kind: SliderInstanceType,
  resourceId: string,
  instanceIds: string,
  action: string,
) {
  return updateInstances(oldDeployment, kind, resourceId, instanceIds, (instance) => ({
    ...instance,
    maintenance_mode: action === `start`,
  }))
}

export function updateStackDeploymentInstancesStatus(
  oldDeployment: StackDeployment,
  kind: SliderInstanceType,
  resourceId: string,
  instanceIds: string,
  action: string,
) {
  return updateInstances(oldDeployment, kind, resourceId, instanceIds, (instance) => ({
    ...instance,
    container_started: action === `start`,
    service_running: action === `start`,
  }))
}
