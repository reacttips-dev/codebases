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

import { SEARCH_ALL_CLUSTERS } from '../../constants/actions'

import createCluster from '../clusters/createCluster'
import createKibana from '../kibanas/createKibana'
import createApm from '../apms/createApm'

import { createAttempt as createEsAttempt } from '../plans'
import { createAttempt as createKibanaAttempt } from '../kibanaPlans'
import { createAttempt as createApmAttempt } from '../apmPlans'

import { getApmClusterUrl, getEsClusterUrl, getKibanaClusterUrl } from '../../lib/api/v1/urls'

import { SearchAllClusters, SearchAllClustersRecord } from './searchAllClustersTypes'

import {
  ApmInfo,
  ApmPlanInfo,
  ClustersInfo,
  ElasticsearchClusterInfo,
  ElasticsearchClusterPlanInfo,
  KibanaClusterInfo,
  KibanaClusterPlanInfo,
} from '../../lib/api/v1/types'

export interface State {
  [searchId: string]: SearchAllClustersRecord
}

const initialState: State = {}

export default function searchAllClustersReducer(
  state: State = initialState,
  action: SearchAllClusters,
): State {
  switch (action.type) {
    case SEARCH_ALL_CLUSTERS:
      if (!action.error && action.payload) {
        return {
          ...state,
          [action.meta.searchId]: reducePayload(action.payload, action.meta),
        }
      }

      break

    default:
      break
  }

  return state
}

export function getSearchAllClustersById(state: State, searchId: string) {
  return state[searchId]
}

function reducePayload(payload: ClustersInfo, meta: SearchAllClusters['meta']) {
  const result: SearchAllClustersRecord = {
    matchCount: payload.match_count || 0,
    totalCount: payload.return_count,
    record: [],
  }

  for (const item of payload.clusters) {
    const reducerCluster = getCluster(item)

    // ignore objects you don't understand
    if (reducerCluster === null) {
      continue
    }

    const { type, cluster, reducedCluster, createAttempt } = reducerCluster
    const clusterAttempt = getClusterAttempt(cluster)
    const planAttempt = clusterAttempt ? createAttempt(clusterAttempt) : null

    /* this endpoint is only used in the Activity Feed,
     * which revolves around plan attempts.
     */
    if (planAttempt === null) {
      continue
    }

    result.record.push({
      // @ts-ignore not sure what TS inference wants
      type,
      cluster: reducedCluster,
      planAttemptId: (clusterAttempt && clusterAttempt.plan_attempt_id) || null,
      planAttempt,
    })
  }

  return result

  function getCluster(anyCluster) {
    const { elasticsearch, kibana, apm } = anyCluster

    if (elasticsearch) {
      const cluster = elasticsearch
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
      })

      const reducedCluster = createCluster({
        regionId,
        clusterId: cluster.cluster_id,
        selfUrl,
        source: cluster,
      })

      return {
        type: `elasticsearch`,
        cluster,
        reducedCluster,
        createAttempt: createEsAttempt,
      }
    }

    if (kibana) {
      const cluster = kibana
      const regionId = cluster.region || `ece-region`
      const selfUrl = getKibanaClusterUrl({
        clusterId: cluster.cluster_id,
        regionId,
        showPlanLogs: true,
        showMetadata: true,
        showSettings: true,
        convertLegacyPlans: meta.convertLegacyPlans,
      })

      const reducedCluster = createKibana({
        regionId,
        kibanaId: cluster.cluster_id,
        selfUrl,
        source: cluster,
      })

      return {
        type: `kibana`,
        cluster,
        reducedCluster,
        createAttempt: createKibanaAttempt,
      }
    }

    if (apm) {
      const cluster = apm

      const regionId = cluster.region || `ece-region`
      const selfUrl = getApmClusterUrl({
        clusterId: cluster.id,
        regionId,
        showPlanLogs: true,
        showMetadata: true,
      })

      const reducedCluster = createApm({
        regionId,
        apmId: cluster.id,
        selfUrl,
        source: cluster,
      })

      return {
        type: `apm`,
        cluster,
        reducedCluster,
        createAttempt: createApmAttempt,
      }
    }

    return null
  }
}

function getClusterAttempt(
  cluster: ElasticsearchClusterInfo | KibanaClusterInfo | ApmInfo,
): ElasticsearchClusterPlanInfo | KibanaClusterPlanInfo | ApmPlanInfo | null {
  const { plan_info } = cluster

  if (plan_info.pending) {
    return plan_info.pending
  }

  if (plan_info.current) {
    return plan_info.current
  }

  return null
}
