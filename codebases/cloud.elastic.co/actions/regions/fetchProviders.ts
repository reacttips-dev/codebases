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
import { FETCH_PROVIDERS } from '../../constants/actions'
import { fetchProvidersRequest } from '../../reducers'
import { getSaasProvidersUrl } from '../../lib/api/v1/urls'
import { ThunkAction } from '../../types'

export function fetchProviders() {
  return asyncRequest({
    type: FETCH_PROVIDERS,
    url: getSaasProvidersUrl(),
  })
}

function shouldFetchProviders(state) {
  const { isDone, inProgress } = fetchProvidersRequest(state)
  return !isDone && !inProgress
}

export function fetchProvidersIfNeeded(): ThunkAction {
  return (dispatch, getState) => {
    const shouldFetch = shouldFetchProviders(getState())

    if (!shouldFetch) {
      return Promise.resolve()
    }

    return dispatch(fetchProviders())
  }
}
