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
import { Action } from '../../types'

export interface State {
  [id: string]: any
}

interface SearchAction extends Action<typeof SEARCH> {
  meta: { id: string; query: any }
}

export default function byId(state: State = {}, action: SearchAction): State {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        [action.meta.id]: action.meta.query,
      }

    default:
      return state
  }
}

export const getQueryById = (state: State, id: string) => state[id]
