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

import { combineReducers } from 'redux'

import rulesets, { State as RulesetsState, getRulesetById, getRulesetRulesById } from './rulesets'

import associations, {
  State as AssociationsState,
  associationsByRuleset,
  associationsByDeployment,
} from './associations'

export interface State {
  rulesets: RulesetsState
  associations: AssociationsState
}

export default combineReducers<State>({
  rulesets,
  associations,
})

export function getRuleset(state: State, rulesetId) {
  return getRulesetById(state.rulesets, rulesetId)
}

export function getRulesets(state: State) {
  return state.rulesets.allIds.map((id) => getRuleset(state, id))
}

export function getRulesetsById(state: State) {
  return state.rulesets.byId
}

export function getRulesByRuleset(state: State, rulesetId: string) {
  return getRulesetRulesById(state.rulesets, rulesetId)
}

export function getAssociationsByDeployment(state: State, deploymentId: string) {
  const ruleset = associationsByDeployment(state.associations, deploymentId)

  if (!ruleset) {
    return []
  }

  return ruleset.map((el) => getRuleset(state, el))
}

export function getAssociationsByRuleset(state: State, rulesetId: string) {
  const ruleset = associationsByRuleset(state.associations, rulesetId)

  if (!ruleset) {
    return []
  }

  return ruleset.map((el) => getRuleset(state, el))
}
