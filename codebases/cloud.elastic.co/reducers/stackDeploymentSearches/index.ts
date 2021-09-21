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

import { replaceIn } from '../../lib/immutability-helpers'

import { SEARCH_STACK_DEPLOYMENTS } from '../../constants/actions'

import { SearchStackDeploymentsAction } from '../../types'

import { DeploymentsSearchResponse } from '../../lib/api/v1/types'

export type State = {
  [queryId: string]: DeploymentsSearchResponse
}

const initialState: State = {}

export default function stackDeploymentSearchesReducer(
  state: State = initialState,
  action: SearchStackDeploymentsAction,
): State {
  if (action.type === SEARCH_STACK_DEPLOYMENTS) {
    if (!action.error && action.payload) {
      const { queryId } = action.meta
      return replaceIn(state, [queryId], action.payload)
    }
  }

  return state
}

export const getStackDeploymentsFromSearch = (
  state: State,
  queryId: string,
): DeploymentsSearchResponse | null => state[queryId] || null
