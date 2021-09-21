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

import { DELETE_SECRET } from '../../constants/actions'

import { fetchKeystore } from './fetchKeystore'

import asyncRequest from '../asyncRequests'

import { setDeploymentEsResourceKeystoreUrl } from '../../lib/api/v1/urls'

import { Keystore, ThunkAction } from '../../types'

export function deleteSecretFromKeystore(
  deploymentId: string,
  refId: string,
  key: string,
): ThunkAction {
  const url = setDeploymentEsResourceKeystoreUrl({ deploymentId, refId })

  const secretPayload: { secrets: Keystore } = {
    secrets: {
      [key]: {},
    },
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: DELETE_SECRET,
        method: `PATCH`,
        url,
        payload: secretPayload,
        meta: { deploymentId, refId },
        crumbs: [deploymentId, refId, key],
      }),
    ).then(() => dispatch(fetchKeystore(deploymentId, refId)))
}
