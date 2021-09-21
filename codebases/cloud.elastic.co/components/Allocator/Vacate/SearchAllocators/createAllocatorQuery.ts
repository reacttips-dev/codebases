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

import { SearchRequest } from '../../../../lib/api/v1/types'

export default function createAllocatorQuery({
  query,
  excludedAllocatorIds = [],
}: {
  query
  excludedAllocatorIds?: string[]
}): SearchRequest {
  return {
    size: 25,
    query: {
      bool: {
        should: [
          {
            prefix: {
              allocator_id: { value: query },
            },
          },
        ],
        must_not: [
          ...excludedAllocatorIds.map((target) => ({
            match: {
              allocator_id: { query: target },
            },
          })),

          { match: { healthy: { query: `false` } } },
          { match: { connected: { query: `false` } } },
        ],
      },
    },
  }
}
