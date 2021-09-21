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

import { waitForPendingApm } from './waitForPendingApm'
import asyncRequest from '../asyncRequests'
import { RESET_APM_TOKEN, CLEAR_APM_TOKEN } from '../../constants/actions'
import { resetApmSecretTokenUrl } from '../../lib/api/v1/urls'
import { Action, ApmCluster, ApmId, RegionId, ThunkAction } from '../../types'

export function resetApmToken(apm: ApmCluster): ThunkAction {
  return (dispatch) => {
    const { id, regionId, clusterId } = apm
    const url = resetApmSecretTokenUrl({ regionId, clusterId: id })

    return dispatch(
      asyncRequest({
        type: RESET_APM_TOKEN,
        url,
        method: `post`,
        meta: { regionId, apmId: id },
      }),
    ).then(() => dispatch(waitForPendingApm(regionId, clusterId, id)))
  }
}

export function clearApmToken(regionId: RegionId, apmId: ApmId): Action<typeof CLEAR_APM_TOKEN> {
  return {
    type: CLEAR_APM_TOKEN,
    meta: { regionId, apmId },
  }
}
