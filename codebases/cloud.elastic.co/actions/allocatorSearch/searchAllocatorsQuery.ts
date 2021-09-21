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

import { searchAllocatorsUrl } from '../../lib/api/v1/urls'
import { SEARCH_ALLOCATORS } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { RegionId } from '../../types'
import { AllocatorOverview, SearchRequest } from '../../lib/api/v1/types'

export function searchAllocatorsQuery(queryId: string, regionId: RegionId, payload: SearchRequest) {
  const url = searchAllocatorsUrl({ regionId })

  return asyncRequest<AllocatorOverview>({
    type: SEARCH_ALLOCATORS,
    method: `POST`,
    url,
    payload,
    meta: { regionId, queryId },
    crumbs: [regionId, queryId],
  })
}
