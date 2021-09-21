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

import { getFilterQuery } from './searchClustersQueryParser'

export default function searchClustersQuery({
  esQuery = null,
  deletedClusters = [],
  size = 150,
}: {
  esQuery?: any
  deletedClusters: string[]
  size?: number
}): SearchRequest {
  const matchDeletedClusters = deletedClusters.map((id) => ({
    term: {
      cluster_id: { value: id },
    },
  }))

  const filterQuery = getFilterQuery(esQuery)

  const query = {
    bool: {
      must_not: matchDeletedClusters,
      filter: filterQuery === null ? [] : [filterQuery],
    },
  }

  return { size, query }
}
