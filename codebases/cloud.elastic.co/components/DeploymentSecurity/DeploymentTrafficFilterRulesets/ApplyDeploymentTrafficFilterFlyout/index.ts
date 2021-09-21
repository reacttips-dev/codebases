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

import ApplyDeploymentTrafficFilterFlyout from './ApplyDeploymentTrafficFilterFlyout'

import { createRulesetAssociation } from '../../../../actions/trafficFilters'

import {
  getTrafficFilterRulesets,
  createTrafficFilterRulesetAssociationRequest,
} from '../../../../reducers'

import { TrafficFilterRulesetInfo } from '../../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../../types'

type StateProps = {
  trafficFilterRulesets: TrafficFilterRulesetInfo[] | null
  createRulesetAssociationRequest: (rulesetId: string) => AsyncRequestState
}

type DispatchProps = {
  createRulesetAssociation: (rulesetId: string) => Promise<void>
}

type ConsumerProps = {
  regionId: string
  deploymentId: string
  onClose: () => void
}

const mapStateToProps = (state, { deploymentId, regionId }: ConsumerProps): StateProps => ({
  trafficFilterRulesets: getTrafficFilterRulesets(state, regionId),
  createRulesetAssociationRequest: (rulesetId: string) =>
    createTrafficFilterRulesetAssociationRequest(state, deploymentId, regionId, rulesetId),
})

const mapDispatchToProps = (
  dispatch,
  { regionId, deploymentId }: ConsumerProps,
): DispatchProps => ({
  createRulesetAssociation: (rulesetId: string) =>
    dispatch(
      createRulesetAssociation({
        regionId,
        rulesetId,
        associatedEntityId: deploymentId,
      }),
    ),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ApplyDeploymentTrafficFilterFlyout)
