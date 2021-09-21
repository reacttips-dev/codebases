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

import { findIndex, filter, keyBy, omit } from 'lodash'

import {
  FETCH_DEPLOYMENT_EXTENSION,
  FETCH_DEPLOYMENT_EXTENSIONS,
  DELETE_DEPLOYMENT_EXTENSION,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { Extension } from '../../lib/api/v1/types'

export type State = {
  list: Extension[] | null
  singles: {
    [extensionId: string]: Extension | null
  }
}

export const initialState: State = {
  list: null,
  singles: {},
}

export default function deploymentExtensionsReducer(state: State = initialState, action) {
  if (action.type === FETCH_DEPLOYMENT_EXTENSIONS) {
    if (!action.error && action.payload) {
      const updatedList = replaceIn(state, `list`, action.payload.extensions)
      const updatedSingles = replaceIn(
        updatedList,
        `singles`,
        keyBy(action.payload.extensions, `id`),
      )
      return updatedSingles
    }
  }

  if (action.type === FETCH_DEPLOYMENT_EXTENSION) {
    if (!action.error && action.payload) {
      const { extensionId } = action.meta

      const listIndex = findIndex(state.list, { id: action.payload.id })

      const updatedList =
        listIndex === -1 ? state : replaceIn(state, [`list`, String(listIndex)], action.payload)

      const updatedSingles = replaceIn(updatedList, [`singles`, extensionId], action.payload)
      return updatedSingles
    }
  }

  if (action.type === DELETE_DEPLOYMENT_EXTENSION) {
    if (!action.error && action.payload) {
      const { extensionId } = action.meta

      const updatedList = replaceIn(
        state,
        `list`,
        filter(state.list, (extension) => extension.id !== extensionId),
      )

      const updatedSingles = replaceIn(updatedList, `singles`, omit(state.singles, extensionId))
      return updatedSingles
    }
  }

  return state
}

export function getDeploymentExtensions(state: State): Extension[] | null {
  return state.list
}

export function getDeploymentExtension(state: State, extensionId: string): Extension | null {
  return state.singles[extensionId] || null
}
