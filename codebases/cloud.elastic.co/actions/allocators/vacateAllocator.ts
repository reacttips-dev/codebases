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

import { VACATE_ALLOCATOR } from '../../constants/actions'

import { moveClustersUrl } from '../../lib/api/v1/urls'

import { RegionId } from '../../types'
import { MoveClustersCommandResponse, MoveClustersRequest } from '../../lib/api/v1/types'

export interface VacateAllocatorOptions {
  regionId: RegionId
  allocatorId: string
  allocatorDown?: boolean
  payload?: MoveClustersRequest
}

export function vacateAllocator({
  regionId,
  allocatorId,
  allocatorDown,
  payload,
}: VacateAllocatorOptions) {
  const url = moveClustersUrl({
    regionId,
    allocatorId,
    allocatorDown,
    moveOnly: null,
  })

  return asyncRequest<MoveClustersCommandResponse>({
    type: VACATE_ALLOCATOR,
    url,
    method: `POST`,
    meta: { regionId, allocatorId },
    crumbs: [regionId, allocatorId],
    payload,
  })
}
