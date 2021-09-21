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

import Rulesets from './Rulesets'

import {
  createIpFilterRule,
  createIpFilterRuleset,
  deleteIpFilterRule,
  deleteIpFilterRuleset,
  fetchIpFilterRulesets,
  fetchRulesetDeploymentAssociation,
  updateIpFilterRule,
  updateIpFilterRuleset,
} from '../../actions/ipFilter'

import {
  getIpFilterRuleset,
  getIpFilterRulesets,
  deleteIpFilterRuleRequest,
  deleteIpFilterRulesetRequest,
  getIpFilterRulesetsRequest,
} from '../../reducers'

import { AsyncRequestState, ReduxState, ThunkDispatch } from '../../types'
import { IpFilterRule, IpFilterRuleset } from '../../lib/api/v1/types'

type StateProps = {
  regionId: string
  getRulesetsRequest: AsyncRequestState
  deleteRuleRequest: () => AsyncRequestState
  deleteRulesetRequest: () => AsyncRequestState
  rulesets: IpFilterRuleset[]
  getRuleset: (ruleId: string) => IpFilterRuleset
}

type DispatchProps = {
  fetchIpFilterRulesets: (args: { regionId: string }) => Promise<void>
  updateIpFilterRuleset: (args: {
    rulesetId: string
    regionId: string
    payload: IpFilterRuleset
  }) => Promise<void>
  createIpFilterRuleset: (args: { regionId: string; payload: IpFilterRuleset }) => Promise<void>
  deleteIpFilterRuleset: (args: {
    rulesetId: string
    regionId: string
    ignoreAssociations?: boolean
  }) => Promise<void>
  fetchRulesetDeploymentAssociation: (args: {
    rulesetId: string
    regionId: string
  }) => Promise<void>
  updateIpFilterRule: (args: {
    regionId: string
    rule: IpFilterRule
    ruleset: IpFilterRuleset
  }) => Promise<void>
  createIpFilterRule: (args: {
    regionId: string
    rule: IpFilterRule
    ruleset: IpFilterRuleset
  }) => Promise<void>
  deleteIpFilterRule: (args: {
    regionId: string
    ruleId: string
    ruleset: IpFilterRuleset
  }) => Promise<void>
}

type ConsumerProps = {
  regionId: string
}

const mapStateToProps = (state: ReduxState, { regionId }: ConsumerProps): StateProps => {
  const rulesets = getIpFilterRulesets(state) as IpFilterRuleset[]

  return {
    regionId,
    getRulesetsRequest: getIpFilterRulesetsRequest(state, regionId),
    deleteRuleRequest: () => deleteIpFilterRuleRequest(state, regionId),
    deleteRulesetRequest: () => deleteIpFilterRulesetRequest(state, regionId),
    rulesets,
    getRuleset: (rulesetId) => getIpFilterRuleset(state, rulesetId)!,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  updateIpFilterRule: (args) => dispatch(updateIpFilterRule(args)),

  createIpFilterRule: (args) => dispatch(createIpFilterRule(args)),
  deleteIpFilterRule: (args) => dispatch(deleteIpFilterRule(args)),
  fetchIpFilterRulesets: (args) => dispatch(fetchIpFilterRulesets(args)),
  fetchRulesetDeploymentAssociation: (args) => dispatch(fetchRulesetDeploymentAssociation(args)),
  updateIpFilterRuleset: (args) => dispatch(updateIpFilterRuleset(args)),
  createIpFilterRuleset: (args) => dispatch(createIpFilterRuleset(args)),
  deleteIpFilterRuleset: (args) => dispatch(deleteIpFilterRuleset(args)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Rulesets)
