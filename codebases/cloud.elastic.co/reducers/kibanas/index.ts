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

import {
  FETCH_STACK_DEPLOYMENT,
  FETCH_KIBANA,
  WAIT_FOR_PENDING_KIBANA,
  SET_KIBANA_MAINTENANCE_MODE,
  SET_KIBANA_INSTANCE_STATUS,
} from '../../constants/actions'

import createKibana from './createKibana'

import {
  updateClusterInstancesMaintenanceMode,
  updateClusterInstancesStatus,
} from './updateKibanaClusterInstance'

import { replaceIn } from '../../lib/immutability-helpers'
import { getRegionId } from '../../lib/stackDeployments'

import {
  AsyncAction,
  FetchDeploymentAction,
  KibanaCluster,
  KibanaId,
  KibanaMetadata,
  RegionId,
  Url,
} from '../../types'

import { KibanaClusterInfo, DeploymentGetResponse } from '../../lib/api/v1/types'
import { getKibanaClusterUrl } from '../../lib/api/v1/urls'

export interface State {
  [kibanaId: string]: KibanaCluster
}

type FetchKibanaAction = {
  type: typeof FETCH_KIBANA
  error?: string
  meta: {
    regionId: RegionId
    kibanaId: KibanaId
    selfUrl: Url
  }
  payload: KibanaClusterInfo
}

type WaitForPendingKibanaAction = {
  type: typeof WAIT_FOR_PENDING_KIBANA
  error?: void
  meta: {
    regionId: RegionId
    kibanaId: KibanaId
  }
}

interface SetMaintenanceModeAction extends AsyncAction<typeof SET_KIBANA_MAINTENANCE_MODE> {
  meta: {
    regionId: RegionId
    clusterId: KibanaId
    instanceIds: string[]
    action: 'start' | 'stop'
  }
}

interface SetInstanceStatusAction extends AsyncAction<typeof SET_KIBANA_INSTANCE_STATUS> {
  meta: {
    regionId: RegionId
    clusterId: KibanaId
    instanceIds: string[]
    action: 'start' | 'stop'
  }
}

export type Action =
  | FetchKibanaAction
  | WaitForPendingKibanaAction
  | FetchDeploymentAction
  | SetMaintenanceModeAction
  | SetInstanceStatusAction

function kibanaReducer(kibana: KibanaCluster, action: Action): KibanaCluster {
  if (action.type === WAIT_FOR_PENDING_KIBANA) {
    return replaceIn(kibana, [`plan`, `waitingForPending`], true)
  }

  if (action.type === FETCH_STACK_DEPLOYMENT) {
    const regionId = getRegion(action)
    const stackDeployment = action.payload as DeploymentGetResponse
    const kibCluster = stackDeployment.resources.kibana[0]

    if (kibCluster) {
      const { id, info } = kibCluster
      const selfUrl = getSelfUrl(regionId, id)
      return createKibana({
        regionId,
        kibanaId: id,
        selfUrl,
        source: info,
        stackDeployment,
      })
    }

    return kibana
  }

  if (action.type === FETCH_KIBANA) {
    if (!action.error && action.payload) {
      const { regionId, kibanaId, selfUrl } = action.meta

      return createKibana({
        regionId,
        kibanaId,
        selfUrl,
        source: action.payload,
      })
    }

    return kibana
  }

  if (kibana && action.type === SET_KIBANA_MAINTENANCE_MODE) {
    return updateClusterInstancesMaintenanceMode(
      kibana,
      action.meta.instanceIds,
      action.meta.action,
    )
  }

  if (kibana && action.type === SET_KIBANA_INSTANCE_STATUS) {
    return updateClusterInstancesStatus(kibana, action.meta.instanceIds, action.meta.action)
  }

  throw new Error(`Unexpected action type: ${action.type}`)
}

export default function kibanasReducer(state: State = {}, action: Action): State {
  if (
    action.type === WAIT_FOR_PENDING_KIBANA ||
    action.type === FETCH_KIBANA ||
    (action.type === FETCH_STACK_DEPLOYMENT && !action.error && action.payload) ||
    action.type === SET_KIBANA_MAINTENANCE_MODE ||
    action.type === SET_KIBANA_INSTANCE_STATUS
  ) {
    const kibanaId = getClusterId()
    const regionId = getRegion(action)

    return {
      ...state,
      [createDescriptor(regionId, kibanaId)]: kibanaReducer(
        getKibana(state, regionId, kibanaId),
        action,
      ),
    }
  }

  return state

  function getClusterId() {
    if (
      action.type === FETCH_STACK_DEPLOYMENT &&
      !action.error &&
      action.payload &&
      action.payload.resources.kibana[0]
    ) {
      return action.payload.resources.kibana[0].id
    }

    const fetchAction = action as FetchKibanaAction

    return fetchAction.meta.kibanaId
  }
}

function getRegion(action: Action) {
  const { regionId } = action.meta

  if (regionId) {
    return regionId
  }

  // assume Stack deployments API action
  const stackDeploymentsAction = action as FetchDeploymentAction
  return getRegionId({ deployment: stackDeploymentsAction.payload! })!
}

function createDescriptor(regionId, kibanaId) {
  return `${regionId}/${kibanaId}`
}

/**
 * Fetches a kibana object from a state object, keying on the supplied IDs
 * @param {Object} state the Redux state to interrogate
 * @param {string} regionId the region identifier
 * @param {string} kibanaId the Kibana identifier
 * @return {Object} the Kibana state
 */
export function getKibana(state: State, regionId: RegionId, kibanaId: KibanaId): KibanaCluster {
  return state[createDescriptor(regionId, kibanaId)]
}

/**
 * Fetches metadata for the supplied Kibana state
 * @param {Object} kibana the state to interrogate
 * @return {Object} the metadata
 */
export function getKibanaMetadata(kibana: KibanaCluster): KibanaMetadata {
  return kibana._raw.data
}

function getSelfUrl(regionId: string, id: string): string {
  return getKibanaClusterUrl({ regionId, clusterId: id })
}
