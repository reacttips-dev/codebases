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
import { GENERATE_API_KEY } from '../../constants/actions'

// TODO: Import typings once API is finished
export function generateApiKey(key) {
  return (dispatch) => {
    const payload = {
      description: key.description,
    }

    // TODO: Import url once API is finished
    const url = `/api/v1/users/auth/keys`
    return dispatch(
      asyncRequest({
        type: GENERATE_API_KEY,
        method: `POST`,
        payload,
        url,
      }),
    )
  }
}

export function resetGenerateKeyRequest(...crumbs) {
  return resetAsyncRequest(GENERATE_API_KEY, crumbs)
}
