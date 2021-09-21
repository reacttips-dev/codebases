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

import { filter } from 'lodash'

import {
  CREATE_IP_FILTER_RULESET_ASSOCIATION,
  DELETE_IP_FILTER_RULESET_ASSOCIATIONS,
  FETCH_IP_FILTER_DEPLOYMENT_RULESET_ASSOCIATIONS,
  FETCH_IP_FILTER_RULESET_DEPLOYMENT_ASSOCIATIONS,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { IpFilteringSettings, RulesetAssociations } from '../../lib/api/v1/types'

type RulesetAssociation = { entity_type: string; id: string }

export interface State {
  byDeploymentId: { [deploymentId: string]: string[] }
  byRulesetId: { [rulesetId: string]: RulesetAssociation[] }
}

type CreateIpFilterRulesetAssociationAction = {
  type: typeof CREATE_IP_FILTER_RULESET_ASSOCIATION
  meta: {
    associatedEntityId: string
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
}

type DeleteIpFilterRulesetAssociationsAction = {
  type: typeof DELETE_IP_FILTER_RULESET_ASSOCIATIONS
  meta: {
    associatedEntityId: string
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
}

type FetchIpFilterDeploymentRulesetAssociationsActions = {
  type: typeof FETCH_IP_FILTER_DEPLOYMENT_RULESET_ASSOCIATIONS
  meta: {
    associatedEntityId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
  payload?: IpFilteringSettings
}

type FetchIpFilterDeploymentRulesetDeploymentAssociationsActions = {
  type: typeof FETCH_IP_FILTER_RULESET_DEPLOYMENT_ASSOCIATIONS
  meta: {
    rulesetId: string
    state: 'started' | 'failed' | 'success'
  }
  error?: boolean
  payload?: RulesetAssociations
}

type AssociationActions =
  | CreateIpFilterRulesetAssociationAction
  | DeleteIpFilterRulesetAssociationsAction
  | FetchIpFilterDeploymentRulesetAssociationsActions
  | FetchIpFilterDeploymentRulesetDeploymentAssociationsActions

const initialState: State = {
  byDeploymentId: {},
  byRulesetId: {},
}

export default function associationsReducer(
  state: State = initialState,
  action: AssociationActions,
): State {
  const { byDeploymentId, byRulesetId } = state

  if (action.type === CREATE_IP_FILTER_RULESET_ASSOCIATION) {
    if (action.meta.state === `success`) {
      const { rulesetId, associatedEntityId } = action.meta
      const associationById = [
        ...(byDeploymentId[associatedEntityId] ? byDeploymentId[associatedEntityId] : []),
        rulesetId,
      ]

      return replaceIn(state, ['byDeploymentId', associatedEntityId], associationById)
    }
  }

  if (action.type === DELETE_IP_FILTER_RULESET_ASSOCIATIONS) {
    if (action.meta.state === `success`) {
      const { rulesetId, associatedEntityId } = action.meta
      return {
        byRulesetId,
        byDeploymentId: {
          ...byDeploymentId,
          [action.meta.associatedEntityId]: filter(
            byDeploymentId[associatedEntityId],
            (id) => id !== rulesetId,
          ),
        },
      }
    }
  }

  if (action.type === FETCH_IP_FILTER_DEPLOYMENT_RULESET_ASSOCIATIONS) {
    if (action.meta.state === `success` && action.payload) {
      return {
        byRulesetId,
        byDeploymentId: {
          ...byDeploymentId,
          [action.meta.associatedEntityId]: action.payload.rulesets,
        },
      }
    }
  }

  if (action.type === FETCH_IP_FILTER_RULESET_DEPLOYMENT_ASSOCIATIONS) {
    if (action.meta.state === `success` && action.payload) {
      return {
        byDeploymentId,
        byRulesetId: {
          ...byRulesetId,
          [action.meta.rulesetId]: action.payload.associations,

          // should we get rid of association_type for now and keep an array of ids
        },
      }
    }
  }

  return state
}

export const associationsByRuleset = (state: State, rulesetId: string) =>
  state.byRulesetId[rulesetId]

export const associationsByDeployment = (state: State, deploymentId: string) =>
  state.byDeploymentId[deploymentId]
