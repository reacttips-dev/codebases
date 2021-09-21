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

import { FETCH_CCS_ELIGIBLE_REMOTES } from '../constants/actions'

import { DeploymentsSearchResponse } from '../lib/api/v1/types'

type SearchCcsEligibleRemotesAction = {
  type: typeof FETCH_CCS_ELIGIBLE_REMOTES
  meta: {
    state: string
    requestNonce: string
    version: string
  }
  error?: string
  payload?: DeploymentsSearchResponse
}

export interface State {
  requestNonce: string | null
  searches: {
    [searchId: string]: DeploymentsSearchResponse | null
  }
}

const initialState: State = {
  requestNonce: null,
  searches: {},
}

export default function ccsEligibleRemotesReducer(
  state: State = initialState,
  action: SearchCcsEligibleRemotesAction,
): State {
  if (action.type === FETCH_CCS_ELIGIBLE_REMOTES) {
    // retain link to most recent request
    if (action.meta.state === `started`) {
      return {
        ...state,
        requestNonce: action.meta.requestNonce,
      }
    }

    // only pay attention to a response if it matches the most recent request
    if (
      action.error == null &&
      action.payload != null &&
      action.meta.requestNonce === state.requestNonce
    ) {
      return {
        requestNonce: null,
        searches: {
          ...state.searches,
          [action.meta.version]: action.payload,
        },
      }
    }
  }

  return state
}

export function getCcsEligibleRemotes(
  state: State,
  version: string,
): DeploymentsSearchResponse | null {
  return state.searches[version]
}
