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

import { filter, flatMap, negate, matches, findIndex, reject, groupBy, isEmpty } from 'lodash'

import {
  DELETE_TRAFFIC_FILTER_RULESET,
  FETCH_TRAFFIC_FILTER_RULESET,
  FETCH_TRAFFIC_FILTER_RULESETS,
  CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
  DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { TrafficFilterRulesetInfo, TrafficFilterRulesets } from '../../lib/api/v1/types'

export type State = {
  [regionId: string]: TrafficFilterRulesetInfo[]
}

type FetchTrafficFilterRulesetsAction = {
  type: typeof FETCH_TRAFFIC_FILTER_RULESETS
  meta: {
    regionId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: TrafficFilterRulesets
  error?: boolean
}

type FetchTrafficFilterRulesetAction = {
  type: typeof FETCH_TRAFFIC_FILTER_RULESET
  meta: {
    regionId: string
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: TrafficFilterRulesetInfo
  error?: boolean
}

type DeleteTrafficFilterRulesetAction = {
  type: typeof DELETE_TRAFFIC_FILTER_RULESET
  meta: {
    regionId: string
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
}

type CreateTrafficFilterRulesetAssociationAction = {
  type: typeof CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION
  meta: {
    regionId: string
    rulesetId: string
    associationType: string
    associatedEntityId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
}

type DeleteTrafficFilterRulesetAssociationAction = {
  type: typeof DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION
  meta: {
    regionId: string
    rulesetId: string
    associationType: string
    associatedEntityId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
}

type Actions =
  | DeleteTrafficFilterRulesetAction
  | FetchTrafficFilterRulesetAction
  | FetchTrafficFilterRulesetsAction
  | CreateTrafficFilterRulesetAssociationAction
  | DeleteTrafficFilterRulesetAssociationAction

export default function rulesetsReducer(state: State = {}, action: Actions): State {
  if (action.type === FETCH_TRAFFIC_FILTER_RULESETS) {
    if (action.meta.state === `success`) {
      const { regionId } = action.meta
      const { rulesets } = action.payload
      const rulesetsByRegion = groupBy(rulesets, `region`)

      if (isEmpty(rulesetsByRegion[regionId])) {
        rulesetsByRegion[regionId] = []
      }

      return Object.keys(rulesetsByRegion).reduce(
        (nextState, regionId) => replaceIn(nextState, [regionId], rulesetsByRegion[regionId]),
        state,
      )
    }
  }

  if (action.type === FETCH_TRAFFIC_FILTER_RULESET) {
    if (action.meta.state === `success`) {
      const { id, region } = action.payload

      if (!id) {
        return state // sanity
      }

      const rulesets = state[region] || []
      const affectedIndex = findIndex(rulesets, { region, id: action.payload.id })
      const updateIndex = affectedIndex === -1 ? rulesets.length : affectedIndex

      return replaceIn(state, [region, String(updateIndex)], action.payload)
    }
  }

  if (action.type === DELETE_TRAFFIC_FILTER_RULESET) {
    if (action.meta.state === `success`) {
      const { regionId, rulesetId } = action.meta
      const nextRulesets = reject(state[regionId], { region: regionId, id: rulesetId })
      return replaceIn(state, [regionId], nextRulesets)
    }
  }

  if (action.type === CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION) {
    if (action.meta.state === `success`) {
      const { regionId, rulesetId, associationType, associatedEntityId } = action.meta

      const rulesets = state[regionId]
      const rulesetIndex = findIndex(rulesets, { region: regionId, id: rulesetId })

      if (rulesetIndex === -1) {
        return state
      }

      const ruleset = rulesets[rulesetIndex]
      const associations = Array.isArray(ruleset.associations) ? ruleset.associations : []

      const nextAssociations = [
        ...associations,
        {
          entity_type: associationType,
          id: associatedEntityId,
        },
      ]

      const nextRuleset = replaceIn(ruleset, [`associations`], nextAssociations)

      return replaceIn(state, [regionId, String(rulesetIndex)], nextRuleset)
    }
  }

  if (action.type === DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION) {
    if (action.meta.state === `success`) {
      const { regionId, rulesetId, associationType, associatedEntityId } = action.meta

      const rulesets = state[regionId]
      const rulesetIndex = findIndex(rulesets, { region: regionId, id: rulesetId })

      if (rulesetIndex === -1) {
        return state
      }

      const ruleset = rulesets[rulesetIndex]
      const associations = Array.isArray(ruleset.associations) ? ruleset.associations : []

      const nextAssociations = filter(
        associations,
        negate(
          matches({
            entity_type: associationType,
            id: associatedEntityId,
          }),
        ),
      )

      const nextRuleset = replaceIn(ruleset, [`associations`], nextAssociations)

      return replaceIn(state, [regionId, String(rulesetIndex)], nextRuleset)
    }
  }

  return state
}

export function getTrafficFilterRulesets(
  state: State,
  regionId?: string,
): TrafficFilterRulesetInfo[] | null {
  if (regionId) {
    return state[regionId] || null
  }

  if (!isEmpty(state)) {
    return flatMap(state)
  }

  return null
}
