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

import ManageTrafficFilters from './ManageTrafficFilters'

import { searchDeployments } from '../../actions/stackDeployments'
import { fetchRegionListIfNeeded } from '../../actions/regionEqualizer'

import searchDeploymentsQuery from '../StackDeploymentSearch/searchDeploymentsQuery'

import {
  fetchTrafficFilterRulesets,
  deleteTrafficFilterRuleset,
} from '../../actions/trafficFilters'

import {
  fetchTrafficFilterRulesetsRequest,
  deleteTrafficFilterRulesetRequest,
  getTrafficFilterRulesets,
  searchStackDeploymentsRequest,
  getStackDeploymentsFromSearch,
  getRegionName,
} from '../../reducers'

import { AsyncRequestState } from '../../types'
import { DeploymentsSearchResponse, TrafficFilterRulesetInfo } from '../../lib/api/v1/types'

type StateProps = {
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
  fetchTrafficFilterRulesetsRequest: AsyncRequestState
  deleteTrafficFilterRulesetRequest: (ruleset: TrafficFilterRulesetInfo) => AsyncRequestState
  rulesets: TrafficFilterRulesetInfo[] | null
  getRegionName: (regionId: string) => string
}

type DispatchProps = {
  searchDeployments: () => void
  fetchTrafficFilterRulesets: () => void
  deleteTrafficFilterRuleset: (ruleset: TrafficFilterRulesetInfo) => Promise<void>
  fetchRegionList: () => Promise<any>
}

type ConsumerProps = {
  regionId?: string
  renderOwnHeader?: boolean
}

const queryId = `count-deployments-for-traffic-filtering`

const mapStateToProps = (state, { regionId }: ConsumerProps): StateProps => ({
  fetchTrafficFilterRulesetsRequest: fetchTrafficFilterRulesetsRequest(state, regionId!),
  deleteTrafficFilterRulesetRequest: (ruleset: TrafficFilterRulesetInfo) =>
    deleteTrafficFilterRulesetRequest(state, ruleset.region, ruleset.id!),
  rulesets: getTrafficFilterRulesets(state, regionId),
  searchResults: getStackDeploymentsFromSearch(state, queryId),
  searchResultsRequest: searchStackDeploymentsRequest(state, queryId),
  getRegionName: (regionId) => getRegionName(state, regionId),
})

const mapDispatchToProps = (dispatch, { regionId }: ConsumerProps): DispatchProps => ({
  fetchTrafficFilterRulesets: () => dispatch(fetchTrafficFilterRulesets({ regionId })),
  deleteTrafficFilterRuleset: (ruleset: TrafficFilterRulesetInfo) =>
    dispatch(deleteTrafficFilterRuleset({ regionId: ruleset.region, rulesetId: ruleset.id! })),
  searchDeployments: () =>
    dispatch(searchDeployments({ queryId, query: searchDeploymentsQuery() })),
  fetchRegionList: () => dispatch(fetchRegionListIfNeeded()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ManageTrafficFilters)
