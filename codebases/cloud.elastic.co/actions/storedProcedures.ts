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

import asyncRequest, { resetAsyncRequest } from './asyncRequests'

import {
  CALL_STORED_PROCEDURE,
  CLEAR_STORED_PROCEDURE,
  SET_STORED_PROCEDURE_PARAMETER,
} from '../constants/actions'

export function callStoredProcedure({
  procedureName,
  parameters,
  userId,
}: {
  procedureName: string
  parameters: any[]
  userId?: string
}) {
  const url = `/api/v0.1/database/_stored/${procedureName}`
  const payload = {
    args: parameters,
  }
  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: CALL_STORED_PROCEDURE,
        method: `POST`,
        url,
        payload,
        meta: { procedureName, parameters, userId },
        crumbs: [procedureName],
      }),
    )
}

export function clearProcedure(procedureName) {
  return {
    type: CLEAR_STORED_PROCEDURE,
    payload: {
      procedureName,
    },
  }
}

export function setParameter(procedureName, name, value) {
  return {
    type: SET_STORED_PROCEDURE_PARAMETER,
    payload: {
      procedureName,
      name,
      value,
    },
  }
}

export function resetCallStoredProcedureRequest(procedureName: string) {
  return resetAsyncRequest(CALL_STORED_PROCEDURE, [procedureName])
}
