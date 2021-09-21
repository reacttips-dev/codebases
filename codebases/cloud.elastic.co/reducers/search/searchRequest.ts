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

import { SEARCH } from '../../constants/actions'
import { createId } from './lib/createEntity'
import { AsyncAction } from '../../types'

interface State {
  isSearching: boolean
  error?: any
  ids?: string[]
  totalCount?: number
}

type SearchAction = AsyncAction<typeof SEARCH>

const initialSearchRequestState: State = {
  isSearching: false,
  error: undefined,
  ids: undefined,
  totalCount: undefined,
}

const getIds: (response: any) => string[] = ({ hits }) => hits.hits.map(createId)

function searchRequest(state: State = initialSearchRequestState, action: SearchAction): State {
  switch (action.type) {
    case SEARCH:
      if (action.error) {
        return {
          ...state,
          isSearching: false,
          error: action.payload,
        }
      }

      if (action.payload) {
        return {
          ...state,
          isSearching: false,
          error: undefined,
          ids: getIds(action.payload),
          totalCount: action.payload.hits.total,
        }
      }

      return {
        ...state,
        isSearching: true,
        error: undefined,
      }

    default:
      return state
  }
}

export default searchRequest
