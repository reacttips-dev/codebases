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

import { omit } from 'lodash'

import { replaceIn } from '../../lib/immutability-helpers'

import {
  CREATE_TRUST_RELATIONSHIP,
  DELETE_TRUST_RELATIONSHIP,
  FETCH_TRUST_RELATIONSHIP,
  FETCH_TRUST_RELATIONSHIPS,
  UPDATE_TRUST_RELATIONSHIP,
} from '../../constants/actions'

import {
  TrustRelationshipCreateResponse,
  TrustRelationshipGetResponse,
  TrustRelationshipsListResponse,
  TrustRelationshipUpdateResponse,
} from '../../lib/api/v1/types'

type FetchAllAction = {
  type: typeof FETCH_TRUST_RELATIONSHIPS
  meta: {
    regionId: string
  }
  error?: boolean
  payload?: TrustRelationshipsListResponse
}

type FetchAction = {
  type: typeof FETCH_TRUST_RELATIONSHIP
  meta: {
    regionId: string
    trustRelationshipId: string
  }
  error?: boolean
  payload?: TrustRelationshipGetResponse
}

type CreateAction = {
  type: typeof CREATE_TRUST_RELATIONSHIP
  meta: {
    regionId: string
  }
  error?: boolean
  payload?: TrustRelationshipCreateResponse
}

type DeleteAction = {
  type: typeof DELETE_TRUST_RELATIONSHIP
  meta: {
    regionId: string
    trustRelationshipId: string
  }
  error?: boolean
}

type UpdateAction = {
  type: typeof UPDATE_TRUST_RELATIONSHIP
  meta: {
    regionId: string
    trustRelationshipId: string
  }
  error?: boolean
  payload?: TrustRelationshipUpdateResponse
}

type Action = FetchAllAction | FetchAction | CreateAction | DeleteAction | UpdateAction

export type State = {
  [regionId: string]: {
    [trustRelationshipId: string]: TrustRelationshipGetResponse
  }
}

const initialState: State = {}

export default function trustRelationshipReducer(
  state: State = initialState,
  action: Action,
): State {
  if (action.type === FETCH_TRUST_RELATIONSHIP || action.type === CREATE_TRUST_RELATIONSHIP) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta
      const { id } = action.payload

      return replaceIn(state, [regionId, id], action.payload)
    }
  }

  if (action.type === FETCH_TRUST_RELATIONSHIPS) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      // We reduce down to the list to merge into the existing relationships where possible, as they may include
      // the certificate from individual GET requests which don't want to override from the list request response.
      return action.payload.trust_relationships.reduce(
        (nextState, trustRelationship) =>
          replaceIn(nextState, [regionId, trustRelationship.id], trustRelationship),
        state,
      )
    }
  }

  if (action.type === DELETE_TRUST_RELATIONSHIP) {
    if (!action.error) {
      const { regionId, trustRelationshipId } = action.meta

      const nextRelationshipsInRegion = omit(state[regionId], trustRelationshipId)

      return replaceIn(state, [regionId], nextRelationshipsInRegion)
    }
  }

  if (action.type === UPDATE_TRUST_RELATIONSHIP) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta
      const { id } = action.payload

      const trustRelationship = getTrustRelationship(state, regionId, id)

      // Additional fields can exist on a GET request, so we don't want to do a straight replacement
      const updatedTrustRelationship = {
        ...trustRelationship,
        ...action.payload,
      }

      return replaceIn(state, [regionId, id], updatedTrustRelationship)
    }
  }

  return state
}

export const getTrustRelationships = (
  state: State,
  regionId: string,
): TrustRelationshipGetResponse[] => Object.values(state[regionId] || [])

export const getTrustRelationshipsWithoutLocal = (
  state: State,
  regionId: string,
): TrustRelationshipGetResponse[] =>
  getTrustRelationships(state, regionId).filter((trustRelationship) => !trustRelationship.local)

export const getTrustRelationship = (
  state: State,
  regionId: string,
  trustRelationshipId: string,
): TrustRelationshipGetResponse | null => state[regionId]?.[trustRelationshipId] || null

export const getLocalTrustRelationship = (
  state: State,
  regionId: string,
): TrustRelationshipGetResponse | null =>
  getTrustRelationships(state, regionId).find((trustRelationship) => trustRelationship.local) ||
  null
