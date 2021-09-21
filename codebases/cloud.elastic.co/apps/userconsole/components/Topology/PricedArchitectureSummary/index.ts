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

import { connect } from 'react-redux'

import PricedArchitectureSummary, {
  ConsumerProps,
  DispatchProps,
  StateProps,
} from './PricedArchitectureSummary'

import { fetchBasePricesIfNeeded } from '../../../actions/pricing'

import {
  getProfile,
  fetchBasePricesRequest,
  getBasePrices,
  getExternalSubscription,
} from '../../../reducers'

import { isFeatureActivated, getConfigForKey } from '../../../../../selectors'
import Feature from '../../../../../lib/feature'
import { ThunkDispatch } from '../../../../../types/redux'
import { BillingSubscriptionLevel } from '../../../../../types'

const mapStateToProps = (state, { regionId }: ConsumerProps): StateProps => {
  const profile = getProfile(state)
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const isSkuPicker = getConfigForKey(state, `APP_NAME`) === `sku-picker`

  return {
    profile,
    basePrices: getBasePrices(state, regionId),
    fetchBasePricesRequest: fetchBasePricesRequest(state, regionId),
    subscription: getExternalSubscription(state),
    showPrices: !isHeroku && isFeatureActivated(state, Feature.showPrices),
    isSkuPicker,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchBasePrices: ({
    regionId,
    level,
    marketplace,
  }: {
    regionId: string
    level?: BillingSubscriptionLevel
    marketplace?: boolean
  }) => dispatch(fetchBasePricesIfNeeded({ regionId, level, marketplace })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PricedArchitectureSummary)
