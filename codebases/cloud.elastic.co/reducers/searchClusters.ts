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

import { SEARCH_CLUSTERS } from '../constants/actions'
import createCluster from './clusters/createCluster'

import { ElasticsearchClustersInfo } from '../lib/api/v1/types'
import { ElasticsearchCluster } from '../types'
import { getEsClusterUrl } from '../lib/api/v1/urls'

type Meta = {
  searchId: string
  state: string
  requestNonce: string
  convertLegacyPlans: boolean | null
}

type SearchAction = {
  type: typeof SEARCH_CLUSTERS
  meta: Meta
  error?: string
  payload?: ElasticsearchClustersInfo
}

export type SearchRecord = {
  matchCount?: number
  totalCount: number
  record: ElasticsearchCluster[]
}

export interface State {
  [searchId: string]: {
    searchRecord: SearchRecord | null
    nonce: string | null
  }
}

const initialState: State = {}

export default function searchClustersReducer(
  state: State = initialState,
  action: SearchAction,
): State {
  if (action.type === SEARCH_CLUSTERS) {
    const { searchId, requestNonce } = action.meta

    // retain link to most recent request
    if (action.meta.state === `started`) {
      return {
        ...state,
        [searchId]: {
          ...state[searchId],
          nonce: requestNonce,
        },
      }
    }

    // only pay attention to a response if it matches the most recent request
    if (action.error == null && action.payload != null && requestNonce === state[searchId].nonce) {
      return {
        ...state,
        [searchId]: {
          searchRecord: createSearchRecord(action.payload, action.meta),
          nonce: null,
        },
      }
    }
  }

  return state
}

function createSearchRecord(payload: ElasticsearchClustersInfo, meta: Meta): SearchRecord {
  return {
    matchCount: payload.match_count,
    totalCount: payload.return_count,
    record: payload.elasticsearch_clusters.map((cluster) => {
      const regionId = cluster.region || `ece-region`
      const selfUrl = getEsClusterUrl({
        clusterId: cluster.cluster_id,
        regionId,
        showPlanDefaults: true,
        showPlanLogs: true,
        showMetadata: true,
        showSecurity: true,
        showSystemAlerts: 3,
        showSettings: true,
        convertLegacyPlans: meta.convertLegacyPlans,
        enrichWithTemplate: true,
      })

      return createCluster({
        regionId,
        clusterId: cluster.cluster_id,
        selfUrl,
        source: cluster,
      })
    }),
  }
}

export function getSearchClustersById(state: State, searchId: string): SearchRecord | null {
  return state[searchId] ? state[searchId].searchRecord : null
}
