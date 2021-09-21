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

import { SearchRequest } from '../../lib/api/v1/types'
import { searchAllocatorsUrl } from '../../lib/api/v1/urls'
import asyncRequest from '../asyncRequests'
import { SEARCH_ALLOCATORS } from '../../constants/actions'

import { RegionId } from '../../types'

export function searchAllocators({
  regionId,
  queryId,
  query = getQueryPayload(),
}: {
  regionId?: RegionId
  queryId: string
  query: SearchRequest
}) {
  const url = searchAllocatorsUrl({ regionId })

  return asyncRequest({
    type: SEARCH_ALLOCATORS,
    method: `POST`,
    url,
    payload: query,
    meta: { regionId, queryId },
    crumbs: [regionId || `regionless`, queryId],
  })
}

function getQueryPayload(): SearchRequest {
  return {
    size: 5000,
  }
}
