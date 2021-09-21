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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { FETCH_SNAPSHOTS } from '../../constants/actions'

import { getCluster } from '../../reducers'

import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'

// This is not the same as the name in the UI when configuring a snapshot
// repository. That name is used to identify the config in the UI, but when
// it is passed to Elasticsearch then the name below is used.
const repositoryName = `found-snapshots`

export function fetchSnapshots({ regionId, id }) {
  return (dispatch, getState) => {
    const state = getState()
    const cluster = getCluster(state, regionId, id)
    const queryString = `?ignore_unavailable=true`

    const elasticsearchPath = `_snapshot/${repositoryName}/_all${queryString}`
    const url = getEsProxyRequestsUrl({ clusterId: id, regionId, elasticsearchPath })

    return dispatch(
      asyncRequest({
        type: FETCH_SNAPSHOTS,
        url,
        meta: { regionId, clusterId: id, cluster },
        crumbs: [regionId, id],
        requestSettings: {
          request: {
            headers: {
              'X-Management-Request': true, // required for v0 API
            },
          },
        },
      }),
    )
  }
}

export function resetFetchSnapshots({ regionId, id }) {
  return resetAsyncRequest(FETCH_SNAPSHOTS, [regionId, id])
}
