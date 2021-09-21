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

import { FETCH_KEYSTORE } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { getDeploymentEsResourceKeystoreUrl } from '../../lib/api/v1/urls'

import { ThunkAction } from '../../types'

export function fetchKeystore(deploymentId: string, refId: string): ThunkAction {
  return (dispatch) => {
    const url = getDeploymentEsResourceKeystoreUrl({
      deploymentId,
      refId,
    })

    return dispatch(
      asyncRequest({
        type: FETCH_KEYSTORE,
        url,
        meta: { deploymentId, refId, selfUrl: url },
        crumbs: [deploymentId, refId],
      }),
    )
  }
}
