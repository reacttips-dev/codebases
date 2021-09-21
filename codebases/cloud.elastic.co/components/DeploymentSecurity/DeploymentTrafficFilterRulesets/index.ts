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
import { withRouter, RouteComponentProps } from 'react-router-dom'

import DeploymentTrafficFilterRulesets from './DeploymentTrafficFilterRulesets'

import {
  fetchTrafficFilterRulesets,
  deleteRulesetAssociation,
} from '../../../actions/trafficFilters'

import {
  fetchTrafficFilterRulesetsRequest,
  getStackDeployment,
  getTrafficFilterRulesets,
  deleteTrafficFilterRulesetAssociationRequest,
} from '../../../reducers'

import { AsyncRequestState, StackDeployment } from '../../../types'
import { TrafficFilterRulesetInfo } from '../../../lib/api/v1/types'

type StateProps = {
  deployment: StackDeployment | null
  fetchTrafficFilterRulesetsRequest: AsyncRequestState
  trafficFilterRulesets: TrafficFilterRulesetInfo[] | null
  deleteRulesetAssociationRequest: (rulesetId: string) => AsyncRequestState
}

type DispatchProps = {
  fetchTrafficFilterRulesets: () => void
  deleteRulesetAssociation: (rulesetId: string) => Promise<void>
}

type QueryParams = {
  deploymentId: string
}

type ConsumerProps = RouteComponentProps<QueryParams> & {
  regionId: string
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { deploymentId },
    },
    regionId,
  }: ConsumerProps,
): StateProps => ({
  deployment: getStackDeployment(state, deploymentId),
  fetchTrafficFilterRulesetsRequest: fetchTrafficFilterRulesetsRequest(state, regionId),
  deleteRulesetAssociationRequest: (rulesetId: string) =>
    deleteTrafficFilterRulesetAssociationRequest(state, deploymentId, regionId, rulesetId),
  trafficFilterRulesets: getTrafficFilterRulesets(state, regionId),
})

const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { deploymentId },
    },
    regionId,
  }: ConsumerProps,
): DispatchProps => ({
  fetchTrafficFilterRulesets: () => dispatch(fetchTrafficFilterRulesets({ regionId })),
  deleteRulesetAssociation: (rulesetId: string) =>
    dispatch(
      deleteRulesetAssociation({
        regionId,
        rulesetId,
        associatedEntityId: deploymentId,
      }),
    ),
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentTrafficFilterRulesets),
)
