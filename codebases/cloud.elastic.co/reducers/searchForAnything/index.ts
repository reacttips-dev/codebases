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

import { SEARCH_FOR_ANYTHING } from '../../constants/actions'

import { SearchResults } from '../../lib/api/v1/types'
import { RefinedSearchResult } from '../../types'

type Meta = {
  searchId: string
  requestNonce: string
  state: string
}

type SearchForAnythingAction = {
  type: typeof SEARCH_FOR_ANYTHING
  meta: Meta
  error?: string
  payload?: SearchResults
}

export interface State {
  [searchId: string]: {
    results: RefinedSearchResult[] | undefined
    nonce: string | null
  }
}

const initialState: State = {}

export default function searchClustersReducer(
  state: State = initialState,
  action: SearchForAnythingAction,
): State {
  if (action.type === SEARCH_FOR_ANYTHING) {
    const { searchId, requestNonce } = action.meta

    // retain link to most recent request
    if (action.meta.state === `started`) {
      return {
        ...state,
        [searchId]: {
          ...state[searchId],
          nonce: requestNonce,
        },
      }
    }

    // only pay attention to a response if it matches the most recent request
    if (!action.error && action.payload && requestNonce === state[searchId].nonce) {
      // cast to `RefinedSearchResult` because the Swagger typing is unfortunately broken
      const results = action.payload.results as unknown as RefinedSearchResult[]

      return {
        ...state,
        [searchId]: {
          results,
          nonce: null,
        },
      }
    }
  }

  return state
}

export function getSearchForAnythingById(
  state: State,
  searchId: string,
): RefinedSearchResult[] | undefined {
  return state[searchId] ? state[searchId].results : undefined
}
