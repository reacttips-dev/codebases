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

import { FETCH_ESS_PRICES } from '../../../../constants/actions'
import { AsyncAction, ReduxState } from '../../../../types'
import { Prices } from '../../../../lib/api/v1/types'

const initialState = null

export type ElasticSearchServicePricesState = any

interface Action extends AsyncAction<typeof FETCH_ESS_PRICES, Prices> {}

export default function elasticSearchServicePricesReducer(state = initialState, action: Action) {
  if (action.type === FETCH_ESS_PRICES) {
    if (action.error) {
      return { values: [] }
    }

    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export function getElasticSearchServicePrices(state: ReduxState): Prices[] {
  return state.elasticSearchServicePrices
}
