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

import { get, omit } from 'lodash'

import { replaceIn } from '../../lib/immutability-helpers'

import {
  CLEAR_STACK_DEPLOYMENT_CREATE_RESPONSE,
  CREATE_STACK_DEPLOYMENT,
  DELETE_STACK_DEPLOYMENT,
  FETCH_STACK_DEPLOYMENT,
  SET_DISK_QUOTA,
  SET_INSTANCE_CAPACITY,
  SET_INSTANCE_STATUS,
  SET_MAINTENANCE_MODE,
} from '../../constants/actions'

import {
  updateStackDeploymentInstancesMaintenanceMode,
  updateStackDeploymentInstancesStatus,
} from './updateStackDeploymentInstance'

import setStackDeploymentInstanceCapacity from './setStackDeploymentInstanceCapacity'
import setStackDeploymentDiskQuota from './setStackDeploymentDiskQuota'

import { AnyStackDeploymentsAction, AnyStackDeploymentsInstanceAction } from '../../types'

import { DeploymentCreateResponse, DeploymentGetResponse } from '../../lib/api/v1/types'

type DeploymentMap<TResponse> = {
  [deploymentId: string]: TResponse
}

export type State = {
  regular: DeploymentMap<DeploymentGetResponse>
  creates: DeploymentMap<DeploymentCreateResponse>
  deletes: string[]
}

const initialState: State = {
  deletes: [],
  regular: {},
  creates: {},
}

export default function stackDeploymentsReducer(
  state: State = initialState,
  action: AnyStackDeploymentsAction | AnyStackDeploymentsInstanceAction,
): State {
  if (action.type === CREATE_STACK_DEPLOYMENT) {
    if (!action.error && action.payload) {
      const { id } = action.payload as DeploymentCreateResponse
      return replaceIn(state, [`creates`, id], action.payload)
    }
  }

  if (action.type === CLEAR_STACK_DEPLOYMENT_CREATE_RESPONSE) {
    const { deploymentId } = action.meta
    return replaceIn(state, [`creates`], omit(state.creates, deploymentId))
  }

  if (action.type === FETCH_STACK_DEPLOYMENT) {
    if (!action.error && action.payload) {
      const { id } = action.payload

      return replaceIn(state, [`regular`, id], action.payload)
    }
  }

  if (action.type === SET_INSTANCE_STATUS) {
    const {
      action: statusAction,
      kind: sliderType,
      resourceId,
      instanceIds,
      stackDeploymentId,
    } = action.meta

    const deploymentPath = [`regular`, stackDeploymentId]
    const stackDeployment = get(state, deploymentPath)

    if (!stackDeployment) {
      return state // sanity
    }

    return replaceIn(
      state,
      deploymentPath,
      updateStackDeploymentInstancesStatus(
        stackDeployment,
        sliderType,
        resourceId,
        instanceIds,
        statusAction,
      ),
    )
  }

  if (action.type === SET_MAINTENANCE_MODE) {
    const {
      action: maintenanceAction,
      kind: sliderType,
      resourceId,
      instanceIds,
      stackDeploymentId,
    } = action.meta
    const deploymentPath = [`regular`, stackDeploymentId]
    const stackDeployment = get(state, deploymentPath)

    if (!stackDeployment) {
      return state // sanity
    }

    return replaceIn(
      state,
      deploymentPath,
      updateStackDeploymentInstancesMaintenanceMode(
        stackDeployment,
        sliderType,
        resourceId,
        instanceIds,
        maintenanceAction,
      ),
    )
  }

  if (action.type === SET_INSTANCE_CAPACITY) {
    const { stackDeploymentId } = action.meta
    const deploymentPath = [`regular`, stackDeploymentId]
    const stackDeployment = get(state, deploymentPath)

    if (!stackDeployment) {
      return state // sanity
    }

    return replaceIn(
      state,
      deploymentPath,
      setStackDeploymentInstanceCapacity(stackDeployment, action),
    )
  }

  if (action.type === SET_DISK_QUOTA && action.payload) {
    const { stackDeploymentId } = action.meta
    const deploymentPath = [`regular`, stackDeploymentId]
    const stackDeployment = get(state, deploymentPath)

    if (!stackDeployment) {
      return state // sanity
    }

    return replaceIn(state, deploymentPath, setStackDeploymentDiskQuota(stackDeployment, action))
  }

  if (action.type === DELETE_STACK_DEPLOYMENT && action.payload) {
    return replaceIn(state, `deletes`, [...state.deletes, action.meta.deploymentId])
  }

  return state
}

export const getStackDeployment = (
  state: State,
  deploymentId: string,
): DeploymentGetResponse | null => state.regular[deploymentId] || null

export const getStackDeploymentCreateResponse = (
  state: State,
  deploymentId: string,
): DeploymentCreateResponse | null => state.creates[deploymentId] || null

export const getDeletedStackDeploymentIds = (state: State): string[] => state.deletes
