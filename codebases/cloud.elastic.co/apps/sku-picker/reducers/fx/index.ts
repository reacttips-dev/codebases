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

import { FETCH_FX_RATES } from '../../constants/actions'

type State = {
  fiscal_year?: string
  rates: {
    [currency: string]: number
  }
}

const initialState: State = {
  rates: {
    USD: 1,
  },
}

export default function fxReducer(state: State = initialState, action) {
  if (action.type === FETCH_FX_RATES) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export function getFxCurrencies(state) {
  return Object.keys(state.fx.rates).sort()
}

export function getFxRates(state) {
  return state.fx.rates
}

export function getFxFiscalYear(state) {
  return state.fx.fiscal_year
}
