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
  FETCH_APM,
  WAIT_FOR_PENDING_APM,
  SET_APM_MAINTENANCE_MODE,
  SET_APM_INSTANCE_STATUS,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'
import { getRegionId } from '../../lib/stackDeployments'

import createApm from './createApm'

import {
  updateClusterInstancesMaintenanceMode,
  updateClusterInstancesStatus,
} from './updateApmClusterInstance'

import {
  ApmCluster,
  ApmId,
  ApmMetadata,
  AsyncAction,
  FetchDeploymentAction,
  RegionId,
  Url,
} from '../../types'

import { ApmInfo, DeploymentGetResponse } from '../../lib/api/v1/types'

export interface State {
  [apmId: string]: ApmCluster
}

type FetchApmAction = {
  type: typeof FETCH_APM | typeof WAIT_FOR_PENDING_APM
  error?: string
  meta: {
    regionId: RegionId
    apmId: ApmId
    selfUrl: Url
  }
  payload: ApmInfo
}

interface SetMaintenanceModeAction extends AsyncAction<typeof SET_APM_MAINTENANCE_MODE> {
  meta: {
    regionId: RegionId
    clusterId: ApmId
    instanceIds: string[]
    action: 'start' | 'stop'
  }
}

interface SetInstanceStatusAction extends AsyncAction<typeof SET_APM_INSTANCE_STATUS> {
  meta: {
    regionId: RegionId
    clusterId: ApmId
    instanceIds: string[]
    action: 'start' | 'stop'
  }
}

type Action =
  | FetchApmAction
  | FetchDeploymentAction
  | SetMaintenanceModeAction
  | SetInstanceStatusAction

function createDescriptor(regionId, apmId) {
  return `${regionId}/${apmId}`
}

function apmReducer(apm: ApmCluster | null, action: Action): ApmCluster | null {
  if (action.type === WAIT_FOR_PENDING_APM) {
    return replaceIn(apm!, [`plan`, `waitingForPending`], true)
  }

  if (action.type === FETCH_STACK_DEPLOYMENT) {
    const stackDeployment = action.payload as DeploymentGetResponse
    const apmCluster = stackDeployment.resources.apm[0]

    if (apmCluster) {
      const { id, info } = apmCluster
      const regionId = getRegion(action)
      const selfUrl = getSelfUrl(regionId, id)
      return createApm({
        regionId,
        apmId: id,
        selfUrl,
        source: info,
        stackDeployment: action.payload,
      })
    }
  }

  if (action.type === FETCH_APM) {
    if (!action.error && action.payload) {
      const { regionId, apmId, selfUrl } = action.meta
      return createApm({
        regionId,
        apmId,
        selfUrl,
        source: action.payload,
      })
    }
  }

  if (apm && action.type === SET_APM_MAINTENANCE_MODE) {
    return updateClusterInstancesMaintenanceMode(apm, action.meta.instanceIds, action.meta.action)
  }

  if (apm && action.type === SET_APM_INSTANCE_STATUS) {
    return updateClusterInstancesStatus(apm, action.meta.instanceIds, action.meta.action)
  }

  return apm
}

export default function apmsReducer(state: State = {}, action: Action) {
  if (
    action.type === WAIT_FOR_PENDING_APM ||
    action.type === FETCH_APM ||
    (action.type === FETCH_STACK_DEPLOYMENT && !action.error && action.payload) ||
    action.type === SET_APM_MAINTENANCE_MODE ||
    action.type === SET_APM_INSTANCE_STATUS
  ) {
    const regionId = getRegion(action)
    const apmId = getClusterId()
    return {
      ...state,
      [createDescriptor(regionId, apmId)]: apmReducer(getApm(state, regionId, apmId), action),
    }
  }

  return state

  function getClusterId() {
    if (
      action.type === FETCH_STACK_DEPLOYMENT &&
      !action.error &&
      action.payload &&
      action.payload.resources.apm[0]
    ) {
      return action.payload.resources.apm[0].id
    }

    const fetchAction = action as FetchApmAction

    return fetchAction.meta.apmId
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

export function getApm(state: State, regionId: RegionId, apmId: ApmId): ApmCluster | null {
  return state[createDescriptor(regionId, apmId)]
}

export function getApmPlanAttempts(
  state: State,
  regionId: RegionId,
  apmId: ApmId,
): ApmCluster | null {
  return state[createDescriptor(regionId, apmId)]
}

export function getApmMetadata(apm: ApmCluster): ApmMetadata {
  return apm._raw.data
}

function getSelfUrl(regionId: string, id: string): string {
  return `/api/v1/regions/${regionId}/clusters/apm/${id}`
}
