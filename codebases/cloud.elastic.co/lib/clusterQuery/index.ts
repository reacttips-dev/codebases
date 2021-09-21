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

import generateCompatibleVersionPrefixes from './generateCompatibleVersionPrefixes'
import generateCompatibleSnapshotVersions from './generateCompatibleSnapshotVersions'

import { SearchRequest, QueryContainer } from '../api/v1/types'

type Params = {
  clauses?: QueryContainer[]
  matchQuery?: string | null
  matchOrganizationId?: string | null
  matchCompatibleVersion?: string | null
  matchCompatibleSnapshotVersion?: string | null
  matchClusterIds?: string[] | null
  excludeClusterIds?: string[] | null
  excludeHidden?: boolean
  excludeStopped?: boolean
  excludeSystemOwned?: boolean
  size?: number
  sort?: string[]
}

const defaultSort = [`cluster_name.keyword`, `cluster_id`]

export function createClusterQuery({
  clauses = [],
  matchQuery = null,
  matchOrganizationId = null,
  matchCompatibleVersion = null,
  matchCompatibleSnapshotVersion = null,
  matchClusterIds = null,
  excludeClusterIds = null,
  excludeHidden = true,
  excludeStopped = true,
  excludeSystemOwned = true,
  size = 10,
  sort = defaultSort,
}: Params): SearchRequest {
  const searchQuery: SearchRequest = {
    size,
    // @ts-ignore: This is fine! Swagger is lying.
    sort,
    query: {
      bool: {
        filter: getFilterClauses(),
      },
    },
  }

  return searchQuery

  function getFilterClauses(): QueryContainer[] {
    const filterClauses = [...clauses]

    if (matchQuery) {
      filterClauses.push(broadMatchClause(matchQuery))
    }

    if (matchCompatibleVersion) {
      filterClauses.push(matchCompatibleVersionClause(matchCompatibleVersion))
    }

    if (matchCompatibleSnapshotVersion) {
      filterClauses.push(matchCompatibleSnapshotVersionClause(matchCompatibleSnapshotVersion))
    }

    if (matchClusterIds) {
      filterClauses.push(matchClusterIdsClause(matchClusterIds))
    }

    if (excludeStopped) {
      filterClauses.push(excludeStoppedClause())
    }

    if (excludeHidden) {
      filterClauses.push(excludeHiddenClause())
    }

    if (excludeSystemOwned) {
      filterClauses.push(excludeSystemOwnedClause())
    }

    if (excludeClusterIds) {
      filterClauses.push(excludeClusterIdsClause(excludeClusterIds))
    }

    if (matchOrganizationId) {
      filterClauses.push(matchOrganizationIdClause(matchOrganizationId))
    }

    return filterClauses
  }
}

function broadMatchClause(query: string): QueryContainer {
  return {
    bool: {
      should: [
        {
          match: {
            cluster_name: { query },
          },
        },
        {
          prefix: {
            cluster_name: { value: query },
          },
        },
        {
          prefix: {
            'cluster_name.keyword': { value: query },
          },
        },
        {
          prefix: {
            cluster_id: { value: query },
          },
        },
        {
          prefix: {
            deployment_id: { value: query },
          },
        },
      ],
    },
  }
}

function excludeHiddenClause(): QueryContainer {
  return {
    bool: {
      must_not: [
        {
          term: {
            'settings.metadata.hidden': {
              value: `true`,
            },
          },
        },
      ],
    },
  }
}

function excludeSystemOwnedClause(): QueryContainer {
  return {
    bool: {
      must_not: [
        {
          term: {
            'settings.metadata.system_owned': {
              value: `true`,
            },
          },
        },
      ],
    },
  }
}

function excludeClusterIdsClause(clusterIds: string[]): QueryContainer {
  return {
    bool: {
      must_not: clusterIds.map((clusterId) => ({
        term: {
          cluster_id: { value: clusterId },
        },
      })),
    },
  }
}

function matchClusterIdsClause(clusterIds: string[]): QueryContainer {
  return {
    bool: {
      should: clusterIds.map((clusterId) => ({
        term: {
          cluster_id: { value: clusterId },
        },
      })),
    },
  }
}

function matchOrganizationIdClause(organizationId: string): QueryContainer {
  return {
    bool: {
      must: [
        {
          term: {
            'settings.metadata.organization_id': {
              value: organizationId,
            },
          },
        },
      ],
    },
  }
}

function excludeStoppedClause(): QueryContainer {
  return {
    exists: {
      field: `topology.instances`,
    },
  }
}

function matchCompatibleSnapshotVersionClause(version): QueryContainer {
  const compatibleVersions = version != null ? generateCompatibleSnapshotVersions(version) : []
  return matchOneOfVersionPrefixClause(compatibleVersions)
}

function matchCompatibleVersionClause(version): QueryContainer {
  const compatibleVersions = version != null ? generateCompatibleVersionPrefixes(version) : []
  return matchOneOfVersionPrefixClause(compatibleVersions)
}

function matchOneOfVersionPrefixClause(versions): QueryContainer {
  return {
    bool: {
      should: versions.map((version) => ({
        prefix: { 'plan_info.current.plan.elasticsearch.version': { value: version } },
      })),
    },
  }
}
