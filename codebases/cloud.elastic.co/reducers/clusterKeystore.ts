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

import { FETCH_KEYSTORE } from '../constants/actions'

import { Keystore } from '../types'

export type State = {
  [descriptor: string]: Keystore
}

type Action = {
  type: typeof FETCH_KEYSTORE
  meta: {
    deploymentId: string
    refId: string
  }
  error?: boolean
  payload?: {
    secrets: Keystore
  }
}

const initialState: State = {}

export default function clustersKeystoreReducer(state = initialState, action: Action) {
  if (action.type === FETCH_KEYSTORE) {
    if (!action.error && action.payload) {
      const { deploymentId, refId } = action.meta
      const descriptor = createDescriptor(deploymentId, refId)

      return {
        ...state,
        [descriptor]: action.payload.secrets,
      }
    }
  }

  return state
}

export function getKeystore(
  state: State,
  deploymentId: string,
  refId: string,
): Keystore | undefined {
  return state[createDescriptor(deploymentId, refId)]
}

function createDescriptor(deploymentId: string, refId: string) {
  return `${deploymentId}/${refId}`
}
