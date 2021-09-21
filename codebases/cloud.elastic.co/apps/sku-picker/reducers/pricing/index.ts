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

import { get } from 'lodash'

import { FETCH_BASE_PRICES } from '../../constants/actions'

import { replaceIn } from '../../../../lib/immutability-helpers'

import { BasePrice } from '../../../../types'

type RegionPrice = {
  instance_config_name: string
  price: number
  level: string
  is_free?: true

  // Below props only exist if is_free is true
  memory_capacity?: number
  zone_count?: number
}

type Action = {
  type: typeof FETCH_BASE_PRICES
  meta: {
    regionId: string
  }
  error?: boolean
  payload?: {
    prices: {
      [regionId: string]: RegionPrice[]
    }
  }
}

type State = {
  [regionId: string]: BasePrice[]
}

// eslint-disable-next-line no-undef
export { State as AllBasePrices }

export default function pricingReducer(state: State = {}, action: Action) {
  if (action.type === FETCH_BASE_PRICES) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta
      const regionPrices = get(action.payload, [`prices`, regionId]) || []
      const newPrices = regionPrices.map((price) => ({
        sku: price.instance_config_name,
        price: price.price,
        level: price.level,
        free_tier: price.is_free
          ? {
              memory_capacity: price.memory_capacity,
              zone_count: price.zone_count,
            }
          : false,
      }))

      return replaceIn(state, [regionId], newPrices)
    }
  }

  return state
}

export function getBasePrices(
  state: { pricing: State },
  regionId: string,
): BasePrice[] | undefined {
  return get(state.pricing, [regionId])
}

export function getAllBasePrices(state: { pricing: State }): State {
  return state.pricing
}
