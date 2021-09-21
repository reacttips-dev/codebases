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

import { filter, get, keyBy, omit } from 'lodash'

import {
  DELETE_IP_FILTER_RULESET,
  FETCH_IP_FILTER_RULESET,
  FETCH_IP_FILTER_RULESETS,
  SET_IP_FILTER_RULESET,
} from '../../constants/actions'

import { IpFilterRuleset, IpFilterRulesets } from '../../lib/api/v1/types'

export interface State {
  byId: { [id: string]: IpFilterRuleset | null }
  allIds: string[]
}

type FetchIpFilterRulesetAction = {
  type: typeof FETCH_IP_FILTER_RULESET
  meta: {
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: IpFilterRuleset
  error?: boolean
}

type FetchIpFilterRulesetsAction = {
  type: typeof FETCH_IP_FILTER_RULESETS
  meta: {
    regionId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: IpFilterRulesets
  error?: boolean
}

type DeleteIpFilterRulesetsAction = {
  type: typeof DELETE_IP_FILTER_RULESET
  meta: {
    regionId: string
    state: 'started' | 'failed' | 'success'
    rulesetId: string
  }
  error?: boolean
}

type SetIpFilterRulesetsAction = {
  type: typeof SET_IP_FILTER_RULESET
  meta: {
    regionId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: IpFilterRuleset
  error?: boolean
}

type RulesetActions =
  | FetchIpFilterRulesetAction
  | FetchIpFilterRulesetsAction
  | DeleteIpFilterRulesetsAction
  | SetIpFilterRulesetsAction

const initialState = {
  byId: {},
  allIds: [],
}

export default function rulesetsReducer(
  state: State = initialState,
  action: RulesetActions,
): State {
  if (action.type === FETCH_IP_FILTER_RULESET) {
    if (action.meta.state === `success`) {
      if (!action.payload.id) {
        return state
      }

      const { byId, allIds } = state

      const { rulesetId } = action.meta
      const newAllIds = byId[action.payload.id] ? [...allIds] : [...allIds, action.payload.id]
      const newState = {
        byId: {
          ...byId,
          [rulesetId]: action.payload,
        },
        allIds: newAllIds,
      }
      return newState
    }
  }

  if (action.type === FETCH_IP_FILTER_RULESETS) {
    if (action.meta.state === `success`) {
      const byId = keyBy(action.payload.rulesets, (ruleset) => ruleset.id!)
      const allIds = action.payload.rulesets.map((ruleset) => ruleset.id!)

      return {
        byId,
        allIds,
      }
    }
  }

  if (action.type === SET_IP_FILTER_RULESET) {
    if (!action.payload.id) {
      return state
    }

    const allIds = state.byId[action.payload.id]
      ? [...state.allIds]
      : [...state.allIds, action.payload.id]

    return {
      allIds,
      byId: {
        ...state.byId,
        [action.payload.id]: action.payload,
      },
    }
  }

  if (action.type === DELETE_IP_FILTER_RULESET) {
    if (action.meta.state === `success`) {
      const { rulesetId } = action.meta
      return {
        byId: { ...omit(state.byId, rulesetId) },
        allIds: [...filter(state.allIds, (id) => id !== rulesetId)],
      }
    }
  }

  return state
}

export function getRulesetById(state: State, rulesetId: string): IpFilterRuleset | null {
  return state.byId[rulesetId] || null
}

export function getRulesetRulesById(
  state: State,
  rulesetId: string,
): IpFilterRuleset['rules'] | null {
  return get(getRulesetById(state, rulesetId), ['rules']) || null
}
