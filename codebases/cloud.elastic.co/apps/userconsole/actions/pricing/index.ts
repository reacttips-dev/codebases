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
import { stringify } from 'query-string'
import { isEmpty } from 'lodash'

import asyncRequest from '../../../../actions/asyncRequests'
import { FETCH_BASE_PRICES } from '../../constants/actions'
import { getBasePrices } from '../../reducers'
import { RegionId, ThunkAction, BillingSubscriptionLevel } from '../../../../types'

export function fetchBasePrices({
  regionId,
  level,
  marketplace,
}: {
  regionId: RegionId
  level?: BillingSubscriptionLevel
  marketplace?: boolean
}) {
  const query: any = {
    region: regionId,
  }

  if (level) {
    query.level = level
  }

  // If the is_marketplace parameter does not exists in the api call
  // the API first looks to see if the user is logged in. If the user is logged in
  // the API will read `user.domain` to determine what prices to return
  // This is important for a marketplace user on the Create or Edit pages.
  // However, on the pricing calculator, we want control the marketplace prices
  // based on a UI switch.

  if (marketplace !== undefined) {
    if (marketplace) {
      query.is_marketplace = 1
    } else {
      query.is_marketplace = 0
    }
  }

  const pricesUrl = `api/v0/_dnt_prices?${stringify(query)}`

  return asyncRequest({
    type: FETCH_BASE_PRICES,
    url: pricesUrl,
    meta: { regionId },
    crumbs: [regionId],
  })
}

function shouldFetch(state, regionId: RegionId, level?: BillingSubscriptionLevel) {
  return isEmpty(getBasePrices(state, regionId, level))
}

export function fetchBasePricesIfNeeded({
  regionId,
  level,
  marketplace,
}: {
  regionId: RegionId
  level?: BillingSubscriptionLevel
  marketplace?: boolean
}): ThunkAction {
  return (dispatch, getState) => {
    // We always want to fetch prices when toggling between marketplace
    // prices and non marketplace prices
    if (marketplace === undefined && !shouldFetch(getState(), regionId, level)) {
      return Promise.resolve()
    }

    return dispatch(fetchBasePrices({ regionId, level, marketplace }))
  }
}
