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

import { combineReducers } from 'redux'

import queryById, { State as QueryByIdState, getQueryById } from './queryById'
import searchRequests, { State as SearchRequestsState, getSearchRequest } from './searchRequests'
import entities, { getEntityById } from './entities'

// Example state:
//
// const state = {
//   queryById: {
//     global: query
//   },
//   searchRequests: {
//     'stringified query': [{
//       isSearching: true,
//       error: undefined,
//       ids: ['entity1', 'entity2']
//     }]
//   },
//   entities: {
//     entity1: {},
//     entity2: {}
//   }
// }

export interface State {
  queryById: QueryByIdState
  searchRequests: SearchRequestsState
  entities: any
}

export default combineReducers({
  // @ts-ignore
  queryById,

  // @ts-ignore
  searchRequests,

  // @ts-ignore
  entities,
})

export const getSearchById = (state: State, id: string) => {
  const query = getQueryById(state.queryById, id)

  if (query == null) {
    return undefined
  }

  const searchRequest = getSearchRequest(state.searchRequests, query)

  if (searchRequest == null) {
    return undefined
  }

  const { ids, ...request } = searchRequest

  if (ids == null) {
    return {
      ...request,
      record: undefined,
    }
  }

  return {
    ...request,
    record: ids.map((entityId) => getEntityById(state.entities, entityId)),
  }
}
