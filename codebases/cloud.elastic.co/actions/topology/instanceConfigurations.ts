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

import { get } from 'lodash'

import {
  CLEAR_INSTANCE_CONFIGURATIONS,
  CREATE_INSTANCE_CONFIGURATION,
  DELETE_INSTANCE_CONFIGURATION,
  FETCH_INSTANCE_CONFIGURATION,
  FETCH_INSTANCE_CONFIGURATIONS,
  UPDATE_INSTANCE_CONFIGURATION,
} from '../../constants/actions'

import history from '../../lib/history'

import {
  createInstanceConfigurationUrl,
  deleteInstanceConfigurationUrl,
  getInstanceConfigurationsUrl,
  getInstanceConfigurationUrl,
  setInstanceConfigurationUrl,
} from '../../lib/api/v1/urls'

import {
  topologyInstanceConfigurationsUrl,
  topologyViewInstanceConfigurationUrl,
} from '../../lib/urlBuilder'

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { InstanceConfiguration } from '../../lib/api/v1/types'
import { Action, RegionId, ThunkAction } from '../../types'

export function clearInstanceConfigurations(
  regionId: RegionId,
): Action<typeof CLEAR_INSTANCE_CONFIGURATIONS> {
  return {
    type: CLEAR_INSTANCE_CONFIGURATIONS,
    meta: { regionId },
  }
}

export function fetchInstanceConfiguration(regionId: RegionId, id: string) {
  const url = getInstanceConfigurationUrl({ regionId, id, showDeleted: true })

  return asyncRequest<InstanceConfiguration>({
    type: FETCH_INSTANCE_CONFIGURATION,
    method: `GET`,
    url,
    meta: { regionId, id },
    crumbs: [regionId, id],
  })
}

export function fetchInstanceConfigurationIfNeeded(regionId: RegionId, id: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState()
    const shouldFetch = get(state, [regionId, id], null) === null

    if (!shouldFetch) {
      return Promise.resolve()
    }

    return dispatch(fetchInstanceConfiguration(regionId, id))
  }
}

export function fetchInstanceConfigurations(regionId: RegionId) {
  const url = getInstanceConfigurationsUrl({ regionId, showDeleted: true })

  return asyncRequest<InstanceConfiguration[]>({
    type: FETCH_INSTANCE_CONFIGURATIONS,
    method: `GET`,
    url,
    meta: { regionId },
    crumbs: [regionId],
  })
}

export function fetchInstanceConfigurationsIfNeeded(regionId: RegionId): ThunkAction {
  return (dispatch, getState) => {
    // @ts-ignore until we have the whole reducer tree typed
    const shouldFetch = getState().instanceConfigurations[regionId] == null

    if (shouldFetch) {
      return dispatch(fetchInstanceConfigurations(regionId))
    }

    return Promise.resolve()
  }
}

export function createInstanceConfiguration(
  regionId: RegionId,
  instanceConfiguration: InstanceConfiguration,
): ThunkAction {
  return (dispatch) => {
    const url = createInstanceConfigurationUrl({ regionId })

    return dispatch(
      asyncRequest({
        method: `POST`,
        type: CREATE_INSTANCE_CONFIGURATION,
        url,
        payload: instanceConfiguration,
        meta: { regionId, selfUrl: url },
        crumbs: [regionId],
      }),
    ).then((response) => {
      // See the instance configuration you just created.
      const {
        payload: { id: instanceId },
      } = response
      return history.push(topologyViewInstanceConfigurationUrl(regionId, instanceId))
    })
  }
}

export const resetCreateInstanceConfiguration = (regionId: RegionId) =>
  resetAsyncRequest(CREATE_INSTANCE_CONFIGURATION, [regionId])

export function deleteInstanceConfiguration(regionId: RegionId, id: string): ThunkAction {
  return (dispatch) => {
    const url = deleteInstanceConfigurationUrl({ id, regionId })

    return dispatch(
      asyncRequest({
        method: `DELETE`,
        type: DELETE_INSTANCE_CONFIGURATION,
        url,
        meta: { regionId, id },
        crumbs: [regionId, id],
      }),
    ).then(() => history.push(topologyInstanceConfigurationsUrl(regionId)))
  }
}

export function updateInstanceConfiguration(
  regionId: RegionId,
  instanceConfiguration: InstanceConfiguration,
): ThunkAction {
  const instanceId = instanceConfiguration.id || ``
  const url = setInstanceConfigurationUrl({ regionId, id: instanceId })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_INSTANCE_CONFIGURATION,
        method: `PUT`,
        url,
        payload: instanceConfiguration,
        meta: { regionId, instanceId },
        crumbs: [regionId, instanceId],
      }),
    ).then(() => history.push(topologyViewInstanceConfigurationUrl(regionId, instanceId)))
}
