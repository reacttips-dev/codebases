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

import {
  CALL_STORED_PROCEDURE,
  CLEAR_STORED_PROCEDURE,
  SET_STORED_PROCEDURE_PARAMETER,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { ProcedureState, StoredProcedureAction } from './storedProcedureTypes'

export type State = { [procedureName: string]: ProcedureState }

export default function storedProcedures(state: State = {}, action: StoredProcedureAction) {
  switch (action.type) {
    case CALL_STORED_PROCEDURE:
      if (action.inProgress) {
        return replaceIn(state, [action.meta.procedureName, `result`], null)
      }

      if (!action.error && action.payload) {
        const withResponse = replaceIn(
          state,
          [action.meta.procedureName, `result`],
          action.payload.response,
        )
        const withSuccess = replaceIn(
          withResponse,
          [action.meta.procedureName, `ok`],
          action.payload.ok,
        )

        return withSuccess
      }

      return state

    case CLEAR_STORED_PROCEDURE:
      return replaceIn(state, action.payload.procedureName, { parameters: {}, result: null })

    case SET_STORED_PROCEDURE_PARAMETER:
      const { procedureName, name, value } = action.payload
      return replaceIn(state, [procedureName, `parameters`, name], value)

    default:
      return state
  }
}

export function getStoredProcedure(state: State, storedProcedureId: string) {
  return state[storedProcedureId]
}

export function getStoredProcedureResult(state: State, storedProcedureId: string) {
  const storedProcedure = getStoredProcedure(state, storedProcedureId)

  if (!storedProcedure || !storedProcedure.result) {
    return null
  }

  return storedProcedure.result
}
