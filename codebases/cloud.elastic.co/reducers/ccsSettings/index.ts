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

import { FETCH_CCS_SETTINGS, UPDATE_CCS_SETTINGS } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { RemoteResources } from '../../lib/api/v1/types'

type FetchCcsSettingsAction = {
  type: typeof FETCH_CCS_SETTINGS
  meta: { deploymentId: string }
  error?: boolean
  payload?: RemoteResources
}

type UpdateCcsSettingsAction = {
  type: typeof UPDATE_CCS_SETTINGS
  meta: { deploymentId: string; settings: RemoteResources }
  error?: boolean
  payload?: RemoteResources
}

type Action = FetchCcsSettingsAction | UpdateCcsSettingsAction

export interface State {
  [deploymentIdentifier: string]: RemoteResources
}

const initialState: State = {}

export default function ccsSettingsReducer(state: State = initialState, action: Action): State {
  if (action.type === FETCH_CCS_SETTINGS) {
    if (!action.error && action.payload) {
      const { deploymentId } = action.meta
      return replaceIn(state, deploymentId, action.payload)
    }
  }

  if (action.type === UPDATE_CCS_SETTINGS) {
    if (!action.error && action.payload) {
      const { deploymentId, settings } = action.meta
      return replaceIn(state, deploymentId, settings)
    }
  }

  return state
}

export const getCcsSettings = (state: State, deploymentId: string): RemoteResources | null =>
  state[deploymentId]
