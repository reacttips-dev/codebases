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

import { getFilterQuery, transformIdQuery } from './DeploymentFilterContext'

export default function searchDeploymentsQuery({
  esQuery = null,
  deletedDeploymentIds = [],
  size = 150,
}: {
  esQuery?: any
  deletedDeploymentIds?: string[]
  size?: number
} = {}): SearchRequest {
  const matchDeletedDeploymentIds = deletedDeploymentIds.map(transformIdQuery)
  const filterQuery = getFilterQuery(esQuery)

  // deployments without at least an ES resource are effectively deleted for UI purposes
  const haveAtLeastOneEsResource = {
    nested: {
      path: `resources.elasticsearch`,
      query: {
        exists: {
          field: `resources.elasticsearch.id`,
        },
      },
    },
  }

  const query = {
    bool: {
      must: [haveAtLeastOneEsResource],
      must_not: matchDeletedDeploymentIds,
      filter: filterQuery === null ? [] : [filterQuery],
    },
  }

  return { size, query }
}
