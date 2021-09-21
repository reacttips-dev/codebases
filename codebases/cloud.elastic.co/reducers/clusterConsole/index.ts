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

import hashSum from 'hash-sum'
import { parse } from 'url'
import { findIndex } from 'lodash'

import {
  QUERY_CLUSTER_PROXY,
  CLEAR_CLUSTER_CONSOLE_HISTORY,
  SET_CLUSTER_CONSOLE_HISTORY,
  SET_CLUSTER_CONSOLE_REQUEST,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { Method } from '../../actions/asyncRequests'

import LocalStorageKey from '../../constants/localStorageKeys'

export interface ConsoleRequestState {
  method: Method
  path: string
  body: string
  advancedMode: boolean
  filterBy: 'regex' | 'jq'
  filterRegex: string
  filterJq: string
  invertFilter: boolean
}

export interface State {
  requests: {
    [descriptor: string]: ConsoleRequestState
  }
  history: ConsoleRequestState[]
}

const historyKey = LocalStorageKey.clusterConsoleHistory
const maxHistoryItems = 15

const initialState: State = {
  requests: {},
  history: getStoredHistory(),
}

export default function clusterConsoleReducer(state: State = initialState, action) {
  /* we don't call `setStoredHistory` here because this event
   * is already triggered by a change in localStorage
   */
  if (action.type === SET_CLUSTER_CONSOLE_HISTORY) {
    return replaceIn(state, `history`, action.payload)
  }

  if (action.type === CLEAR_CLUSTER_CONSOLE_HISTORY) {
    setStoredHistory([])
    return replaceIn(state, `history`, [])
  }

  if (action.type === QUERY_CLUSTER_PROXY) {
    if (action.meta.state === `success`) {
      const { clusterId, regionId, isConsoleRequest } = action.meta

      if (!isConsoleRequest) {
        return state
      }

      const descriptor = createDescriptor(regionId, clusterId)
      const request = state.requests[descriptor]
      const history = mergeHistory(state.history, request)

      setStoredHistory(history)

      return replaceIn(state, [`history`], history)
    }
  }

  if (action.type === SET_CLUSTER_CONSOLE_REQUEST) {
    const { clusterId, regionId } = action.meta
    const descriptor = createDescriptor(regionId, clusterId)
    return replaceIn(state, [`requests`, descriptor], action.payload)
  }

  return state
}

function mergeHistory(
  currentHistory: ConsoleRequestState[],
  lastRequest: ConsoleRequestState,
): ConsoleRequestState[] {
  if (lastRequest.method.toUpperCase() === `DELETE`) {
    return currentHistory
  }

  const nextHistory = [...currentHistory]
  const equivRequestIndex = findIndex(nextHistory, compareHashes)

  // remove an older request against the same `METHOD /path`
  if (equivRequestIndex !== -1) {
    nextHistory.splice(equivRequestIndex, 1)
  }

  // add the latest successful request to the top of our recent history
  nextHistory.unshift(lastRequest)

  return nextHistory.slice(0, maxHistoryItems)

  function compareHashes(request) {
    return getHash(request) === getHash(lastRequest)
  }
}

function getHash({ method, path }) {
  const { pathname } = parse(path)
  return hashSum({ method, pathname })
}

export function getClusterConsoleRequest(
  state: State,
  regionId: string,
  clusterId: string,
): ConsoleRequestState | null | undefined {
  const descriptor = createDescriptor(regionId, clusterId)
  const request = state.requests[descriptor]

  if (!request) {
    return null
  }

  return request
}

export function getClusterConsoleRequestHistory(state: State): ConsoleRequestState[] {
  return state.history
}

function createDescriptor(regionId: string, clusterId: string): string {
  return `${regionId}/${clusterId}`
}

function setStoredHistory(history: ConsoleRequestState[]) {
  localStorage.setItem(historyKey, JSON.stringify(history))
}

function getStoredHistory(): ConsoleRequestState[] {
  try {
    const storedHistory = localStorage.getItem(historyKey)

    if (!storedHistory) {
      return []
    }

    const parsedHistory = JSON.parse(storedHistory)

    if (!Array.isArray(parsedHistory)) {
      return []
    }

    return parsedHistory
  } catch (err) {
    return []
  }
}
