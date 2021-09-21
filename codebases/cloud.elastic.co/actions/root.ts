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

import asyncRequest from './asyncRequests'
import { FETCH_ROOT } from '../constants/actions'
import { AppConfig } from '../../config/types'
import { ReduxState, ThunkAction } from '../types'

export function fetchRoot(config: AppConfig) {
  const rootUrl = config.ROOT_URL

  return asyncRequest({
    type: FETCH_ROOT,
    url: rootUrl,
    meta: { rootUrl },
  })
}

function shouldFetch({ root }: ReduxState) {
  if (root.isFetching) {
    return false
  }

  if (root.hrefs !== undefined) {
    return false
  }

  return true
}

export function fetchRootIfNeeded(config: AppConfig): ThunkAction<Promise<any>> {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      return dispatch(fetchRoot(config))
    }

    return Promise.resolve()
  }
}
