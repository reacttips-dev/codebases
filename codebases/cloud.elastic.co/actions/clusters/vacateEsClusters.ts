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

import asyncRequest from '../asyncRequests'

import { VACATE_ES_CLUSTER, VACATE_ES_CLUSTER_VALIDATE } from '../../constants/actions'

import { moveEsClusterInstancesUrl } from '../../lib/api/v1/urls'

import { RegionId } from '../../types'
import {
  ClusterCommandResponse,
  TransientElasticsearchPlanConfiguration,
} from '../../lib/api/v1/types'

export interface VacateEsClusterOptions {
  regionId: RegionId
  clusterId: string
  instanceIds: string[]
  ignoreMissing?: boolean | null
  forceUpdate?: boolean | null
  instancesDown?: boolean | null
  moveOnly?: boolean | null
  validateOnly?: boolean | null
  payload?: TransientElasticsearchPlanConfiguration
}

export function vacateEsCluster({
  regionId,
  clusterId,
  instanceIds,
  ignoreMissing,
  forceUpdate,
  instancesDown = null,
  moveOnly = null,
  validateOnly,
  payload,
}: VacateEsClusterOptions) {
  const url = moveEsClusterInstancesUrl({
    regionId,
    clusterId,
    instanceIds,
    ignoreMissing,
    forceUpdate,
    instancesDown,
    moveOnly,
    validateOnly,
  })

  return asyncRequest<ClusterCommandResponse>({
    type: validateOnly ? VACATE_ES_CLUSTER_VALIDATE : VACATE_ES_CLUSTER,
    url,
    method: `POST`,
    meta: { regionId, clusterId, instanceIds },
    crumbs: [regionId, clusterId, instanceIds.join(',')],
    payload,
  })
}
