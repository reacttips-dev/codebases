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

import { FETCH_NODE_STATS } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'
import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'

import { StackDeployment } from '../../types'

export function fetchNodeStats(deployment: StackDeployment) {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster

  const elasticsearchPath = `_nodes/stats`
  const url = getEsProxyRequestsUrl({ regionId, clusterId, elasticsearchPath })

  return asyncRequest({
    type: FETCH_NODE_STATS,
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
