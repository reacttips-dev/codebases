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

import { cloneDeep } from 'lodash'
import { stringify } from 'query-string'

import asyncRequest from '../../../../actions/asyncRequests'
import { FETCH_LOGS } from '../../constants/actions'

import { ElasticsearchId, RegionId, ThunkAction, PlainHashMap } from '../../../../types'

export function fetchLogs(
  regionId: RegionId,
  clusterId: ElasticsearchId,
  query: PlainHashMap,
): ThunkAction {
  /*
   * the API expects filter[], which is super weird,
   * so we ignore it all the way through,
   * except when making the actual API call
   */
  const params = cloneDeep(query)

  if ('filter' in params) {
    params[`filter[]`] = params.filter
    delete params.filter
  }

  const url = `/api/v0/logs/${regionId}/${clusterId}/_search?${stringify(params)}`

  return asyncRequest({
    type: FETCH_LOGS,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    abortIfInProgress: true,
    includeHeaders: true,
  })
}
