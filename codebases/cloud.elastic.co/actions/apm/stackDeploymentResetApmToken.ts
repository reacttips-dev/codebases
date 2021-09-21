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

import asyncRequest from '../asyncRequests'

import { fetchDeployment } from '../stackDeployments/crud'

import { RESET_APM_TOKEN } from '../../constants/actions'

import { resetApmSecretTokenUrl } from '../../lib/api/v1/urls'
import { ThunkAction, ThunkDispatch } from '../../types'

export function stackDeploymentResetApmToken(
  regionId: string,
  apmId: string,
  deploymentId: string,
): ThunkAction {
  return (dispatch: ThunkDispatch) => {
    const url = resetApmSecretTokenUrl({ regionId, clusterId: apmId })

    return dispatch(
      asyncRequest({
        type: RESET_APM_TOKEN,
        url,
        method: `POST`,
        meta: { regionId, apmId },
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))
  }
}
