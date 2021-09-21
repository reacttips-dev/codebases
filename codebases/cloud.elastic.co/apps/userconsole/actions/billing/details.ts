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

import recurly from 'recurly'
import asyncRequest, {
  asyncRequestActions,
  resetAsyncRequest,
} from '../../../../actions/asyncRequests'
import { reqIdFactory } from '../../../../lib/reqId'

import { getFeaturesUsageUrl } from '../../../../lib/api/v1/urls'

import {
  RECURLY_REQUEST_REJECTED,
  RECURLY_TOKEN_RECEIVED,
  RECURLY_TOKEN_REQUESTED,
  SAVE_BILLING_DETAILS,
  FETCH_USAGE_DETAILS,
} from '../../constants/actions'
import { fetchAccountDetails } from '../account'
import { fetchProfile } from '../profile'

import { ThunkAction, AsyncRequestState, BillingSubscriptionLevel } from '../../../../types'

type SaveBillingRequestMetadata = {
  canCall3DSecure?: boolean
  state?: string
}

export type SaveBillingRequest = AsyncRequestState<SaveBillingRequestMetadata>

export type SaveBillingDetailsProps = {
  formElement: HTMLFormElement
  employees_number: string
  business: string
  domain: string
  level?: BillingSubscriptionLevel
}

export type RetrySaveBillingDetailsWith3DSecureProps = {
  oldToken: string
  threeDSecureToken: string
  employees_number: string
  business: string
  domain: string
  level?: BillingSubscriptionLevel
}

function generateToken(formElement) {
  return (dispatch) => {
    dispatch({ type: RECURLY_TOKEN_REQUESTED, meta: {} })

    return new Promise((resolve, reject) => {
      recurly.token(formElement, (err, token) => {
        if (err) {
          dispatch({
            type: RECURLY_REQUEST_REJECTED,
            meta: {},
            payload: err,
          })
          reject()
        } else if (token == null) {
          dispatch({
            type: RECURLY_REQUEST_REJECTED,
            meta: {},
            payload: {
              code: `no-token-received`,
              message: `The request was successful but Recurly did not return a token`,
            },
          })
          reject()
        } else {
          dispatch({
            type: RECURLY_TOKEN_RECEIVED,
            meta: {},
            payload: token,
          })
          resolve(token.id)
        }
      })
    })
  }
}

export function saveBillingDetails({
  formElement,
  employees_number,
  business,
  domain,
  level,
}: SaveBillingDetailsProps): ThunkAction {
  const url = `/api/v0/_recurly/_billing_updated`

  const type = SAVE_BILLING_DETAILS
  return (dispatch) =>
    dispatch(generateToken(formElement))
      .then((token) =>
        dispatch(
          asyncRequest({
            type,
            url,
            method: `post`,
            payload: {
              token,
              company_info: {
                employees_number,
                business,
                domain,
              },
              level,
            },
            meta: { canCall3DSecure: true },
            requestSettings: {
              request: {
                headers: {
                  'X-Recurly-Version': `v4`,
                },
              },
            },
          }),
        ).then(() => {
          dispatch(fetchAccountDetails())
          dispatch(fetchProfile())
          return
        }),
      )
      .catch((error) => {
        const reqIdBuilder = reqIdFactory(type)
        const reqId = reqIdBuilder()
        const { failed } = asyncRequestActions({ reqId, type })
        dispatch(failed(error))
      })
}

export function retrySaveBillingDetailsWith3DSecure({
  oldToken,
  threeDSecureToken,
  employees_number,
  business,
  domain,
  level,
}: RetrySaveBillingDetailsWith3DSecureProps): ThunkAction {
  const url = `/api/v0/_recurly/_billing_updated`
  const type = SAVE_BILLING_DETAILS

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type,
        url,
        method: `post`,
        payload: {
          threeDSecureToken,
          token: oldToken,
          company_info: {
            employees_number,
            business,
            domain,
          },
          level,
        },
        requestSettings: {
          request: {
            headers: {
              'X-Recurly-Version': `v4`,
            },
          },
        },
      }),
    ).then(() => {
      dispatch(fetchAccountDetails())
      dispatch(fetchProfile())
      return
    })
}

export function fetchUsageDetails() {
  const url = getFeaturesUsageUrl()

  return asyncRequest({
    type: FETCH_USAGE_DETAILS,
    url,
  })
}

export const resetSaveBillingDetailsRequest = () => resetAsyncRequest(SAVE_BILLING_DETAILS)
