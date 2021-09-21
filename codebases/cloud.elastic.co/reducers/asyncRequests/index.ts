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

import { get } from 'lodash'

import { ASYNC_REQUEST_RESPONSE, RESET_ASYNC_REQUEST } from '../../constants/actions'

import { reqIdFactory } from '../../lib/reqId'
import { replaceIn } from '../../lib/immutability-helpers'

import { getConfigForKey } from '../../store'

import { AsyncRequestState, ReduxState } from '../../types'

export interface State {
  buildTagMismatch: boolean
  lastError?: Error
  requestStates: {
    [requestId: string]: AsyncRequestState
  }
}

const initialState: State = {
  buildTagMismatch: false,
  requestStates: {},
}

const initialRequestState: AsyncRequestState = {
  inProgress: false,
  isDone: false,
  error: undefined,
  meta: {},
}

export default function asyncRequestsReducer(state: State = initialState, action): State {
  if (action.type === ASYNC_REQUEST_RESPONSE) {
    if (action.error && action.payload) {
      return replaceIn(state, [`lastError`], action.payload)
    }

    const { headers } = action.meta.response
    const buildTag = headers && headers[`x-ui-tag`]
    const expectedBuildTag = getConfigForKey(`BUILD_TAG`)

    return replaceIn(state, [`buildTagMismatch`], buildTag && buildTag !== expectedBuildTag)
  }

  const reqId = get(action, [`meta`, `reqId`])

  if (reqId == null) {
    return state
  }

  return replaceIn(state, [`requestStates`, reqId], asyncRequestReducer(state[reqId], action))
}

function asyncRequestReducer(state = initialRequestState, action): AsyncRequestState {
  const { type, meta, payload } = action

  if (type === RESET_ASYNC_REQUEST) {
    return initialRequestState
  }

  if (typeof meta.state !== `string`) {
    return legacyAsyncRequestReducer(state, action)
  }

  return {
    inProgress: meta.state === `started`,
    isDone: meta.state === `success`,
    error: meta.state === `failed` ? payload : undefined,
    meta,
  }
}

function legacyAsyncRequestReducer(_state, action): AsyncRequestState {
  const { error, meta, payload } = action

  // the legacy copy/pasted requests that aren't created
  // by asyncRequests.js don't carry a state metaprop
  // thus a responses without a payload becomes hard to handle in reducers
  return {
    inProgress: !error && !payload,
    isDone: !!payload,
    error: error ? payload : undefined,
    meta,
  }
}

export function getAsyncRequestState(
  type: string,
): (state: ReduxState, ...crumbs: Array<string | null>) => AsyncRequestState {
  if (!type) {
    throw new TypeError(`getAsyncRequestState(type): type can't be undefined ${type}.`)
  }

  const reqId = reqIdFactory(type)

  return getAsyncRequestStateImpl

  function getAsyncRequestStateImpl(state, ...crumbs) {
    return getAsyncRequest(state.asyncRequests, reqId(...crumbs))
  }
}

export function getAsyncRequest(state: State = initialState, id: string): AsyncRequestState {
  return state.requestStates[id] || initialRequestState
}

export function getBuildTagMismatch(state: State): boolean {
  return state.buildTagMismatch
}

export function getLastApiError(state: State): Error | undefined {
  return state.lastError
}
