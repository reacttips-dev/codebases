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

import { REVOKE_API_KEY, REVOKE_API_KEYS } from '../../constants/actions'

import { fetchApiKeys, fetchManagedApiKeys } from '../../actions/apiKeys/fetchApiKeys'

export function revokeApiKey(keyId) {
  return (dispatch) => {
    // TODO: Will need to update once API is merged
    const url = `/api/v1/users/auth/keys/${keyId}`
    return dispatch(
      asyncRequest({
        type: REVOKE_API_KEY,
        method: `DELETE`,
        url,
      }),
    ).then(() => dispatch(fetchApiKeys()))
  }
}

export function revokeApiKeys(keys) {
  return (dispatch) => {
    // TODO: Will need to update once API is merged
    const user_api_keys = keys.map((key) => ({
      api_key_id: key.id,
      user_id: key.user_id,
    }))
    const url = `/api/v1/users/auth/keys/_all`
    return dispatch(
      asyncRequest({
        type: REVOKE_API_KEYS,
        method: `DELETE`,
        payload: { user_api_keys },
        url,
      }),
    ).then(() => dispatch(fetchManagedApiKeys()))
  }
}

export function resetRevokeKeyRequest(...crumbs) {
  return resetAsyncRequest(REVOKE_API_KEY, crumbs)
}

export function resetRevokeKeysRequest(...crumbs) {
  return resetAsyncRequest(REVOKE_API_KEYS, crumbs)
}
