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

import { FETCH_PLATFORM } from '../../constants/actions'

import { getPlatformUrl } from '../../lib/api/v1/urls'

import { fetchPlatformRequest } from '../../reducers'

import { ThunkAction } from '../../types'

export function fetchPlatformOverview() {
  const url = getPlatformUrl()

  return asyncRequest({
    type: FETCH_PLATFORM,
    url,
  })
}

export function fetchPlatformOverviewIfNeeded(): ThunkAction {
  return (dispatch, getState) => {
    const shouldFetch = shouldFetchPlatformOverview(getState())

    if (!shouldFetch) {
      return Promise.resolve()
    }

    return dispatch(fetchPlatformOverview())
  }
}

export function fetchPlatformByRegion(regionId: string) {
  const url = getPlatformUrl({ regionId })

  return asyncRequest({
    type: FETCH_PLATFORM,
    url,
    meta: { regionId },
    crumbs: [regionId],
  })
}

function shouldFetchPlatformOverview(state) {
  const { isDone, inProgress } = fetchPlatformRequest(state)
  return !isDone && !inProgress
}
