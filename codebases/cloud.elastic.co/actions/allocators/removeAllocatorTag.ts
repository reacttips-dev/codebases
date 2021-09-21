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
import { REMOVE_ALLOCATOR_TAG } from '../../constants/actions'
import { deleteAllocatorMetadataItemUrl } from '../../lib/api/v1/urls'
import { MetadataItem } from '../../lib/api/v1/types'
import { Allocator } from '../../../public/types'

export function removeAllocatorTag(allocator: Allocator, key: keyof MetadataItem) {
  const { regionId, id } = allocator
  const url = deleteAllocatorMetadataItemUrl({ allocatorId: id, regionId, key })

  return asyncRequest({
    type: REMOVE_ALLOCATOR_TAG,
    method: `DELETE`,
    url,
    meta: { regionId, id, ip: id },
    crumbs: [regionId, id, key],
  })
}

export const resetRemoveAllocatorTagRequest = (...crumbs) =>
  resetAsyncRequest(REMOVE_ALLOCATOR_TAG, crumbs)
