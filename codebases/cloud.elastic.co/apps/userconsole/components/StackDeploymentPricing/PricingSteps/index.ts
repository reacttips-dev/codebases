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

import PricingSteps from './PricingSteps'

import {
  fetchVersionsRequest,
  getRegionsByProvider,
  getRegionIdsByProvider,
  getProvidersNames,
  getProviderIdByRegion,
} from '../../../../../reducers'

import { fetchBasePricesIfNeeded } from '../../../actions/pricing'

import { AsyncRequestState, BillingSubscriptionLevel, Region } from '../../../../../types'
import { PlatformId } from '../../../../../lib/platform'
import { RegionState } from '../../../../../reducers/providers'

type StateProps = {
  fetchVersionsRequest: AsyncRequestState
  getRegionsByProvider: (provider: PlatformId) => RegionState[] | null
  getRegionIdsByProvider: (provider: PlatformId) => string[]
  getProviderIdByRegion: (regionId: string | null) => PlatformId | null
  providers: PlatformId[]
}

interface DispatchProps {
  fetchBasePrices: ({
    regionId,
    level,
    marketplace,
  }: {
    regionId: string
    level?: BillingSubscriptionLevel
    marketplace?: boolean
  }) => void
}

type ConsumerProps = {
  region?: Region
}

const mapStateToProps = (state, { region }: ConsumerProps): StateProps => ({
  fetchVersionsRequest: fetchVersionsRequest(state, region ? region.id : null),
  getRegionsByProvider: (provider) => getRegionsByProvider(state, provider),
  getRegionIdsByProvider: (provider) => getRegionIdsByProvider(state, provider),
  getProviderIdByRegion: (regionId) => getProviderIdByRegion(state, regionId),
  providers: getProvidersNames(state),
})

const mapDispatchToProps: DispatchProps = {
  fetchBasePrices: fetchBasePricesIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PricingSteps)
