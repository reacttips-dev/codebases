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

import { captureApmError, startHttpSpan } from '../../lib/apm'
import { reqIdFactory } from '../../lib/reqId'
import { del, get, patch, post, put, AjaxResult } from '../../lib/ajax'
import requiredParam from '../../lib/requiredParam'
import { ASYNC_REQUEST_RESPONSE, RESET_ASYNC_REQUEST } from '../../constants/actions'
import { getAsyncRequestState } from '../../reducers/asyncRequests'
import { Action, AsyncAction, ThunkAction, Url } from '../../types'

const methods = { get, post, put, delete: del, patch }

type AsyncRequestSpec<T extends string> = {
  type: T
  reqId: string
  meta?: { [key: string]: any }
}

type AsyncRequestActions<T extends string> = {
  start: () => AsyncAction<T>
  failed: (error: any) => AsyncAction<T>
  success: (response: unknown) => AsyncAction<T>
}

export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'

type AsyncParams = {
  type: string
  method?: Method
  url: Url
  meta?: { [key: string]: any }
  crumbs?: string[]
  payload?: unknown | string
  requestSettings?: unknown
  responseMapper?: (payload: AjaxResult) => unknown
  abortIfInProgress?: boolean
  handleUnauthorized?: boolean
  includeHeaders?: boolean
}

export default function asyncRequest<P = any>({
  type = requiredParam(`type`),
  method = `get`,
  url = requiredParam(`url`),
  meta = {},
  crumbs = [],
  payload,
  requestSettings = {},
  responseMapper = defaultResponseMapper,
  abortIfInProgress = false,
  handleUnauthorized = false,
  includeHeaders = false,
}: AsyncParams): ThunkAction<Promise<P>> {
  const reqIdBuilder = reqIdFactory(type)
  const reqId = reqIdBuilder(...crumbs)
  const { start, failed, success } = asyncRequestActions({ reqId, type, meta })

  return (dispatch, getState) => {
    if (abortIfInProgress) {
      const requestState = getAsyncRequestState(type)(getState(), ...crumbs)

      if (requestState.inProgress) {
        return Promise.resolve()
      }
    }

    dispatch(start())

    const lowerMethod = method.toLowerCase()
    const isGet = lowerMethod === `get`
    const request = methods[lowerMethod]
    const options = { settings: requestSettings, includeHeaders: true }
    const params = isGet ? [url, options] : [url, payload, options]

    const httpSpan = startHttpSpan(method, url)

    return request(...params).then(
      (response) => {
        httpSpan.end()

        dispatch(asyncRequestResponse(response, responseMapper))

        const { headers } = response
        const successAction = success(responseMapper(response))

        if (includeHeaders) {
          Object.assign(successAction.meta, headers)
        }

        return dispatch(successAction)
      },
      (error) => {
        if (error.response) {
          captureApmError(
            new Error(
              `${lowerMethod} failed: [${error.message}] [${error.response.status}] [${error.response.statusText}] [${reqId}]`,
            ),
          )
        } else {
          captureApmError(new Error(`${lowerMethod} failed: [${error.message}] [${reqId}]`))
        }

        httpSpan.end()

        const failAction = failed(error)

        if (handleUnauthorized) {
          failAction.meta.handleUnauthorized = true
        }

        dispatch(asyncRequestFailureResponse(failAction))
        dispatch(failAction)
        throw error
      },
    )
  }
}

export function asyncRequestActions<T extends string>(
  shape: AsyncRequestSpec<T>,
): AsyncRequestActions<T> {
  return {
    start: () => asyncRequestStart(shape),
    failed: (error: any) => asyncRequestFailed(shape, error),
    success: (response: unknown) => asyncRequestSuccess(shape, response),
  }
}

export function resetAsyncRequest(
  type: string,
  crumbs: string[] = [],
): Action<typeof RESET_ASYNC_REQUEST> {
  const reqIdBuilder = reqIdFactory(type)
  const reqId = reqIdBuilder(...crumbs)

  return {
    type: RESET_ASYNC_REQUEST,
    meta: { reqId },
  }
}

function asyncRequestShape<T extends string>(
  state: 'started' | 'failed' | 'success',
  { type, reqId, meta = {} }: AsyncRequestSpec<T>,
) {
  return {
    type,
    meta: { ...meta, reqId, state },
  }
}

function asyncRequestStart<T extends string>(shape: AsyncRequestSpec<T>): AsyncAction<T> {
  return asyncRequestShape(`started`, shape)
}

function asyncRequestFailed<T extends string>(
  shape: AsyncRequestSpec<T>,
  payload: any,
): AsyncAction<T> {
  return {
    ...asyncRequestShape(`failed`, shape),
    payload,

    // kept for legacy reasons; eventually Start/Failed/Success merge into one
    error: true,
  }
}

function asyncRequestSuccess<T extends string>(
  shape: AsyncRequestSpec<T>,
  payload: any,
): AsyncAction<T> {
  return {
    ...asyncRequestShape(`success`, shape),
    payload,
  }
}

export function asyncRequestResponse(
  response,
  responseMapper = defaultResponseMapper,
): AsyncAction<typeof ASYNC_REQUEST_RESPONSE> {
  return {
    type: ASYNC_REQUEST_RESPONSE,
    payload: responseMapper(response),
    meta: { response },
  }
}

export function asyncRequestFailureResponse(payload): AsyncAction<typeof ASYNC_REQUEST_RESPONSE> {
  return {
    type: ASYNC_REQUEST_RESPONSE,
    error: true,
    payload,
    meta: { response: payload.response },
  }
}

function defaultResponseMapper(response: AjaxResult) {
  if (response.blob) {
    // blob consumers expect to be able to look at `blob` and `blobUrl` fields
    return response
  }

  return response.body
}
