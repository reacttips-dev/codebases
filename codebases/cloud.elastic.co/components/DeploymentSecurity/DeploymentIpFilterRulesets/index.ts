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

import DeploymentIpFilterRulesets from './DeploymentIpFilterRulesets'

import {
  createRulesetAssociation,
  deleteRulesetAssociation,
  fetchDeploymentRulesetAssociation,
} from '../../../actions/ipFilter'

import {
  createIpFilterRulesetAssociationRequest,
  deleteIpFilterRulesetAssociationRequest,
  getIpFilterAssociationByDeployment,
  getIpFilterRuleset,
  getIpFilterRulesets,
} from '../../../reducers'

import { AsyncRequestState, ReduxState, ThunkDispatch } from '../../../types'
import { IpFilterRuleset } from '../../../lib/api/v1/types'

type StateProps = {
  allRulesets: IpFilterRuleset[]
  deploymentRulesets: IpFilterRuleset[]
  regionId: string
  deploymentId: string
  createIpFilterRulesetAssociationRequest: () => AsyncRequestState
  deleteIpFilterRulesetAssociationRequest: () => AsyncRequestState
  getRuleset: (rulesetId: string) => IpFilterRuleset
}

type DispatchProps = {
  createRulesetAssociation: (args: {
    rulesetId: string
    regionId: string
    associatedEntityId: string
  }) => Promise<void>
  deleteRulesetAssociation: (args: {
    rulesetId: string
    regionId: string
    associatedEntityId: string
  }) => Promise<void>
  fetchDeploymentRulesetAssociation: (args: {
    associatedEntityId: string
    regionId: string
  }) => Promise<void>
}

type ConsumerProps = {
  regionId: string
  deploymentId: string
}

const mapStateToProps = (
  state: ReduxState,
  { regionId, deploymentId }: ConsumerProps,
): StateProps => {
  const allRulesets = getIpFilterRulesets(state) as IpFilterRuleset[]
  const deploymentRulesets = getIpFilterAssociationByDeployment(
    state,
    deploymentId,
  ) as IpFilterRuleset[]

  return {
    allRulesets,
    deploymentRulesets,
    regionId,
    deploymentId,
    createIpFilterRulesetAssociationRequest: () => createIpFilterRulesetAssociationRequest(state),
    deleteIpFilterRulesetAssociationRequest: () => deleteIpFilterRulesetAssociationRequest(state),
    getRuleset: (rulesetId) => getIpFilterRuleset(state, rulesetId)!,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  createRulesetAssociation: (args) => dispatch(createRulesetAssociation(args)),
  deleteRulesetAssociation: (args) => dispatch(deleteRulesetAssociation(args)),
  fetchDeploymentRulesetAssociation: (args) => dispatch(fetchDeploymentRulesetAssociation(args)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentIpFilterRulesets)
