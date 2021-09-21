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

import PricingRates from './PricingRates'

import { getConfigForKey, isFeatureActivated } from '../../../../../selectors'

import { fetchBasePricesIfNeeded } from '../../../../../apps/userconsole/actions/pricing'
import {
  getProfile,
  fetchBasePricesRequest,
  getBasePrices,
} from '../../../../../apps/userconsole/reducers'

import Feature from '../../../../../lib/feature'

import { AsyncRequestState, ProfileState, BasePrice, RegionId } from '../../../../../types'
import { DeploymentTemplateInfoV2, DeploymentCreateRequest } from '../../../../../lib/api/v1/types'
import { ThunkDispatch } from '../../../../../types/redux'

type StateProps = {
  showPrice: boolean
  profile: ProfileState
  basePrices?: BasePrice[]
  fetchBasePricesRequest: AsyncRequestState
}

interface DispatchProps {
  fetchBasePrices: ({ regionId }) => Promise<any>
}

type ConsumerProps = {
  regionId: RegionId
  deployment: DeploymentCreateRequest
  deploymentTemplate?: DeploymentTemplateInfoV2
}

const mapStateToProps = (state, { regionId }): StateProps => {
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const showPrice =
    getConfigForKey(state, `APP_NAME`) === `userconsole` &&
    isFeatureActivated(state, Feature.showPrices) &&
    !isHeroku

  return {
    showPrice,
    basePrices: getBasePrices(state, regionId),
    fetchBasePricesRequest: fetchBasePricesRequest(state, regionId),
    profile: getProfile(state),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchBasePrices: ({ regionId }: { regionId: string }) =>
    dispatch(fetchBasePricesIfNeeded({ regionId })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PricingRates)
