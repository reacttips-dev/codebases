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

import { uniqueId } from 'lodash'

import { SEARCH_CLUSTERS } from '../constants/actions'
import { searchEsClustersUrl } from '../lib/api/v1/urls'
import { isFeatureActivated } from '../selectors'
import asyncRequest from './asyncRequests'

import { ElasticsearchClustersInfo, SearchRequest } from '../lib/api/v1/types'
import { ThunkAction } from '../types'
import Feature from '../lib/feature'

export function searchClusters(
  searchId: string,
  request: SearchRequest,
  regionId?: string,
): ThunkAction<Promise<ElasticsearchClustersInfo>> {
  return (dispatch, getState) => {
    const convertLegacyPlans = isFeatureActivated(getState(), Feature.convertLegacyPlans)
    const requestNonce = uniqueId(`searchClusters::${searchId}`)

    return dispatch(
      asyncRequest({
        url: searchEsClustersUrl({ regionId }),
        type: SEARCH_CLUSTERS,
        method: `post`,
        meta: { searchId, requestNonce, convertLegacyPlans },
        crumbs: [searchId],
        payload: request,
      }),
    )
  }
}
