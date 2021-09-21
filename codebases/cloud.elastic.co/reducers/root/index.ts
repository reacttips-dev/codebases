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

import createRoot from './createRoot'
import { FETCH_ROOT } from '../../constants/actions'
import { AsyncAction, RootConfig } from '../../types'

interface FetchRootAction extends AsyncAction<typeof FETCH_ROOT> {
  meta: {
    rootUrl: string
  }
}

const initialState: RootConfig = {
  isFetching: false,
  error: undefined,
  hrefs: undefined,
}

export default function rootReducer(
  state: RootConfig = initialState,
  action: FetchRootAction,
): RootConfig {
  if (action.type !== FETCH_ROOT) {
    return state
  }

  if (action.error) {
    return {
      ...state,
      isFetching: false,
      error: action.payload,
    }
  }

  if (action.payload) {
    return {
      ...state,
      isFetching: false,
      error: undefined,
      hrefs: createRoot(action.payload.hrefs, action.meta.rootUrl),
    }
  }

  return {
    ...state,
    isFetching: true,
  }
}
