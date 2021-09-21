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

import { FETCH_CONTAINER, FETCH_CONTAINER_SET, FETCH_CONTAINER_SETS } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { ContainerSetDetails, Container } from '../../lib/api/v1/types'

export type State = {
  containerSets: {
    [regionId: string]: ContainerSetDetails[]
  }
  containerSetById: {
    [containerSetCrumbs: string]: ContainerSetDetails
  }
  containersById: {
    [containerCrumbs: string]: Container
  }
}

const initialState: State = {
  containerSets: {},
  containerSetById: {},
  containersById: {},
}

export default function containerSetsReducer(state: State = initialState, action) {
  if (action.type === FETCH_CONTAINER_SETS) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      return replaceIn(state, [`containerSets`, regionId], action.payload.container_sets)
    }
  }

  if (action.type === FETCH_CONTAINER_SET) {
    if (!action.error && action.payload) {
      const { regionId, containerSetId } = action.meta
      const crumbs = `${regionId}/${containerSetId}`

      return replaceIn(state, [`containerSetById`, crumbs], action.payload)
    }
  }

  if (action.type === FETCH_CONTAINER) {
    if (!action.error && action.payload) {
      const { regionId, containerSetId, containerId } = action.meta
      const crumbs = `${regionId}/${containerSetId}/${containerId}`

      return replaceIn(state, [`containersById`, crumbs], action.payload)
    }
  }

  return state
}

export function getContainerSets(state: State, regionId: string): ContainerSetDetails[] | null {
  return state.containerSets[regionId] || null
}

export function getContainerSet(
  state: State,
  regionId: string,
  containerSetId: string,
): ContainerSetDetails | null {
  const containerSetCrumbs = `${regionId}/${containerSetId}`
  return state.containerSetById[containerSetCrumbs] || null
}

export function getContainer(
  state: State,
  regionId: string,
  containerSetId: string,
  containerId: string,
): Container | null {
  const containerCrumbs = `${regionId}/${containerSetId}/${containerId}`
  return state.containersById[containerCrumbs] || null
}
