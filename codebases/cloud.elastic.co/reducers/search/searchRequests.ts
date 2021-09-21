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

import stringify from 'json-stable-stringify'

import { SEARCH } from '../../constants/actions'
import searchRequest from './searchRequest'
import { Action } from '../../types'

export interface State {
  [query: string]: any
}

interface SearchAction extends Action<typeof SEARCH> {
  meta: { query: any }
}

export default function searchRequests(state: State = {}, action: SearchAction): State {
  switch (action.type) {
    case SEARCH:
      const query = stringify(action.meta.query)
      return {
        ...state,
        [query]: searchRequest(state[query], action),
      }

    default:
      return state
  }
}

export const getSearchRequest = (state: State, query: any) => state[stringify(query)]
