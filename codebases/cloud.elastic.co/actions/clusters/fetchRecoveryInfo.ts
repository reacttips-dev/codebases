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

import {
  FETCH_RECOVERY_INFO,
  FETCH_CLUSTER_HEALTH,
  FETCH_SHARD_COUNTS,
} from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'
import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'

import { StackDeployment } from '../../types'

export function fetchRecoveryInfo(deployment: StackDeployment) {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster

  const elasticsearchPath = `_recovery?active_only&human`
  const url = getEsProxyRequestsUrl({ regionId, clusterId, elasticsearchPath })

  return asyncRequest({
    type: FETCH_RECOVERY_INFO,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    requestSettings: {
      request: {
        headers: {
          'X-Management-Request': true,
        },
      },
    },
    handleUnauthorized: true,
  })
}

export function fetchClusterHealth(deployment: StackDeployment) {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster

  const elasticsearchPath = `_cluster/health`
  const url = getEsProxyRequestsUrl({ clusterId, regionId, elasticsearchPath })

  return asyncRequest({
    type: FETCH_CLUSTER_HEALTH,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    requestSettings: {
      request: {
        headers: {
          'X-Management-Request': true,
        },
      },
    },
    handleUnauthorized: true,
  })
}

export function fetchShardCounts(deployment: StackDeployment) {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster

  const queryString = `?h=state,unassigned.reason&format=json`

  const url = getEsProxyRequestsUrl({
    clusterId,
    regionId,
    elasticsearchPath: `_cat/shards${queryString}`,
  })

  return asyncRequest({
    type: FETCH_SHARD_COUNTS,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    requestSettings: {
      request: {
        headers: {
          'X-Management-Request': true,
        },
      },
    },
    handleUnauthorized: true,
  })
}
