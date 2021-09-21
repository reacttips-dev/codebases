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

import { QueryContainer, SearchRequest } from '../../lib/api/v1/types'
import { major } from '../../lib/semver'

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

export function getDeploymentByIdQuery({ deploymentId }: { deploymentId: string }): SearchRequest {
  const getDeploymentById = {
    bool: {
      should: [
        {
          prefix: {
            id: {
              value: deploymentId,
            },
          },
        },
      ],
    },
  }

  return {
    query: {
      bool: {
        must: [haveAtLeastOneEsResource],
        filter: [getDeploymentById],
      },
    },
  }
}

export function getDeploymentsByIdQuery({
  deploymentIds,
}: {
  deploymentIds: string[]
}): SearchRequest {
  const getDeploymentsById = {
    bool: {
      should: deploymentIds.map((deploymentId) => ({
        prefix: {
          id: {
            value: deploymentId,
          },
        },
      })),
    },
  }

  return {
    query: {
      bool: {
        must: [haveAtLeastOneEsResource],
        filter: [getDeploymentsById],
      },
    },
  }
}

export function getDeploymentsByClusterIdsQuery({
  clusterIds,
}: {
  clusterIds: string[]
}): SearchRequest {
  const getDeploymentsByClusterIds = {
    nested: {
      path: `resources.elasticsearch`,
      query: {
        bool: {
          should: clusterIds.map((clusterId) => ({
            prefix: {
              ['resources.elasticsearch.id']: {
                value: clusterId,
              },
            },
          })),
        },
      },
    },
  }

  return {
    query: {
      bool: {
        must: [haveAtLeastOneEsResource],
        filter: [getDeploymentsByClusterIds],
      },
    },
  }
}

export function searchDeploymentsQuery({
  regionId,
  version,
  searchValue,
  matchOrganizationId,
}: {
  regionId?: string
  version?: string
  searchValue?: string | null
  matchOrganizationId?: string | null
}): SearchRequest {
  const elasticsearchFilters: QueryContainer[] = []

  if (regionId) {
    const prefixRegion = {
      term: {
        ['resources.elasticsearch.region']: {
          value: regionId,
        },
      },
    }

    elasticsearchFilters.push(prefixRegion)
  }

  if (version) {
    const majorVersion = major(version).toString()

    const prefixVersion = {
      prefix: {
        ['resources.elasticsearch.info.plan_info.current.plan.elasticsearch.version']: {
          value: majorVersion,
        },
      },
    }

    elasticsearchFilters.push(prefixVersion)
  }

  const elasticsearchResourceQuery = {
    nested: {
      path: `resources.elasticsearch`,
      query: {
        bool: {
          must: elasticsearchFilters,
        },
      },
    },
  }

  const checkNotTerminated = {
    nested: {
      path: `resources.elasticsearch`,
      query: {
        exists: {
          field: 'resources.elasticsearch.info.topology.instances',
        },
      },
    },
  }

  const notSystemOwned = {
    term: {
      'metadata.system_owned': {
        value: 'false',
      },
    },
  }

  const filterOptions: QueryContainer[] = [notSystemOwned]

  if (matchOrganizationId) {
    const prefixAccount = {
      term: {
        'metadata.organization_id': {
          value: matchOrganizationId,
        },
      },
    }

    filterOptions.push(prefixAccount)
  }

  if (searchValue) {
    const queryText = {
      bool: {
        must: [
          {
            bool: {
              should: [
                { prefix: { id: { value: searchValue } } },
                { match: { name: { query: searchValue } } },
                { prefix: { name: { value: searchValue } } },
              ],
            },
          },
        ],
      },
    }

    filterOptions.push(queryText)
  }

  return {
    query: {
      bool: {
        filter: [
          ...filterOptions,
          {
            bool: {
              must: [elasticsearchResourceQuery, checkNotTerminated],
            },
          },
        ],
      },
    },
    size: 150,
  }
}
