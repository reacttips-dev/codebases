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

import { setEsClusterInstancesSettingsOverridesUrl } from '../../lib/api/v1/urls'

import { SET_INSTANCE_CAPACITY } from '../../constants/actions'

export function setInstanceCapacity({ deployment, instanceIds, instanceCapacity }) {
  const { regionId, id: clusterId } = deployment

  const url = setEsClusterInstancesSettingsOverridesUrl({
    regionId,
    clusterId,
    instanceIds,
    restartAfterUpdate: true,
  })

  return asyncRequest({
    type: SET_INSTANCE_CAPACITY,
    url,
    method: `PUT`,
    meta: { regionId, clusterId, instanceIds, instanceCapacity },
    crumbs: [regionId, clusterId],
    payload: {
      instance_capacity: instanceCapacity,
    },
  })
}

export const resetSetInstanceCapacityRequest = (...crumbs) =>
  resetAsyncRequest(SET_INSTANCE_CAPACITY, crumbs)
