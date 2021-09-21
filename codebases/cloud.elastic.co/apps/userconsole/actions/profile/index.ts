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

import { FETCH_PROFILE, FETCH_OKTA_APPLICATIONS } from '../../constants/actions'

import asyncRequest from '../../../../actions/asyncRequests'

import { fetchProfileRequest, getProfile } from '../../reducers'

import { setApmUserContext } from '../../../../lib/apm'
import { getUsersUrl } from '../../../../lib/api/v1/urls'

import { ReduxState, ThunkAction } from '../../../../types'

export function fetchProfile(): ThunkAction {
  const url = getUsersUrl()

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: FETCH_PROFILE,
        url,
      }),
    ).then(
      ({
        payload: {
          user: { user_id, email },
        },
      }) => setApmUserContext(user_id.toString(), email),
    )
}

function shouldFetch(state: ReduxState) {
  const profileRequest = fetchProfileRequest(state)

  if (profileRequest.inProgress) {
    return false
  }

  return getProfile(state) === null
}

export function fetchProfileIfNeeded(): ThunkAction<Promise<any>> {
  return (dispatch, getState) => {
    if (!shouldFetch(getState())) {
      return Promise.resolve()
    }

    return dispatch(fetchProfile())
  }
}

export function fetchOktaApplications(): ThunkAction {
  const url = `/api/v1/saas/user/applications`

  return asyncRequest({
    type: FETCH_OKTA_APPLICATIONS,
    method: `GET`,
    url,
  })
}
