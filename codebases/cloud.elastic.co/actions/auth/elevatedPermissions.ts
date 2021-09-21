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

import { ENABLE_ELEVATED_PERMISSIONS, DISABLE_ELEVATED_PERMISSIONS } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { saveToken } from './auth'

import { enableElevatedPermissionsUrl, disableElevatedPermissionsUrl } from '../../lib/api/v1/urls'

export function enableElevatedPermissions({ token }: { token: string }) {
  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: ENABLE_ELEVATED_PERMISSIONS,
        method: `POST`,
        url: enableElevatedPermissionsUrl(),
        payload: { token },
      }),
    ).then((actionResult) => {
      dispatch(saveToken(actionResult.payload.token))
      return actionResult
    })
}

export function disableElevatedPermissions() {
  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: DISABLE_ELEVATED_PERMISSIONS,
        method: `DELETE`,
        url: disableElevatedPermissionsUrl(),
      }),
    ).then((actionResult) => {
      dispatch(saveToken(actionResult.payload.token))
      return actionResult
    })
}
