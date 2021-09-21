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

import { searchAllocatorsQuery } from './searchAllocatorsQuery'

import { RegionId } from '../../types'
import { QueryContainer, SearchRequest } from '../../lib/api/v1/types'

export function searchAllocatorsSimpleQuery(
  queryId: string,
  regionId: RegionId,
  clauses: QueryContainer,
) {
  const payload: SearchRequest = {
    size: 1000,
    query: clauses,
  }

  return searchAllocatorsQuery(queryId, regionId, payload)
}
