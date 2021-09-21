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
import { FETCH_ALLOCATOR } from '../../constants/actions'
import { RegionId } from '../../types'
import { getAllocatorUrl } from '../../lib/api/v1/urls'

export function fetchAllocator(regionId: RegionId, ip: string) {
  const url = getAllocatorUrl({ regionId, allocatorId: ip })

  return asyncRequest({
    type: FETCH_ALLOCATOR,
    url,
    meta: { regionId, ip, selfUrl: url },
    crumbs: [regionId, ip],
  })
}
