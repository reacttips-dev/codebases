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

import { FETCH_APM } from '../../constants/actions'
import { getApmClusterUrl } from '../../lib/api/v1/urls'
import asyncRequest from '../asyncRequests'

import { ApmId, RegionId, ThunkAction } from '../../types'

export function fetchApm(regionId: RegionId, apmId: ApmId): ThunkAction {
  return (dispatch) => {
    const url = getApmClusterUrl({
      regionId,
      clusterId: apmId,
      showPlanLogs: true,
      showMetadata: true,
    })

    return dispatch(
      asyncRequest({
        type: FETCH_APM,
        url,
        meta: { regionId, apmId, selfUrl: url },
        crumbs: [regionId, apmId],
      }),
    )
  }
}
