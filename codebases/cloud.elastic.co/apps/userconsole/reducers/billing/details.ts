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

import { ReduxState } from '../../../../types'
import {
  RECURLY_REQUEST_REJECTED,
  RECURLY_TOKEN_RECEIVED,
  RECURLY_TOKEN_REQUESTED,
} from '../../constants/actions'

import { BillingAction, BillingState, RecurlyError } from './billingTypes'

const initialState: BillingState = {
  recurlyInProgress: false,
  recurlyError: null,
  recurlyToken: null,
}

function reduceRecurlyErrors(error): RecurlyError {
  if (error.code === `validation`) {
    return {
      type: `missingOrInvalid`,
      fields: error.fields,
    }
  }

  if (error.code === `invalid-parameter`) {
    return {
      type: `invalidParameters`,
      fields: error.fields,
      message: error.message,
    }
  }

  return {
    type: `unknownError`,
  }
}

export default function billingDetailsReducer(
  state: BillingState = initialState,
  action: BillingAction,
): BillingState {
  switch (action.type) {
    case RECURLY_TOKEN_REQUESTED:
      return {
        ...state,
        recurlyInProgress: true,
      }

    case RECURLY_REQUEST_REJECTED:
      return {
        ...state,
        recurlyInProgress: false,
        recurlyError: reduceRecurlyErrors(action.payload),
      }

    case RECURLY_TOKEN_RECEIVED:
      return {
        ...state,
        recurlyInProgress: false,
        recurlyError: null,
        recurlyToken: action.payload.id,
      }

    default:
      return state
  }
}

export function getBillingDetails(state: ReduxState): BillingState {
  // @ts-ignore
  return state.billingDetails
}
