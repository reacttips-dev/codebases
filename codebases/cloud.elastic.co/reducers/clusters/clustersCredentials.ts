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
  CLEAR_CLUSTER_CREDENTIALS,
  CREATE_CLUSTER,
  CREATE_DEPLOYMENT,
  RESET_CLUSTER_PASSWORD,
} from '../../constants/actions'

import { ClusterCredentialsAction } from './clusterTypes'

import { NewDeploymentCredentials } from '../../types'

export interface State {
  [descriptor: string]: NewDeploymentCredentials | null
}

function reduceCredentials_v1(
  state: NewDeploymentCredentials | undefined | null = null,
  action,
): NewDeploymentCredentials | null {
  const username = get(action, [`payload`, `credentials`, `username`])
  const password = get(action, [`payload`, `credentials`, `password`])

  if (username != null && password != null) {
    const apmToken = get(action, [`payload`, `apm`, `secret_token`])

    return {
      username,
      password,
      apmToken,
    }
  }

  return state
}

function reduceCredentials_v0_1(
  state: NewDeploymentCredentials | undefined | null = null,
  action,
): NewDeploymentCredentials | null {
  const username = get(action, [`payload`, `username`], `elastic`)
  const password = get(action, [`payload`, `password`])

  if (username != null && password != null) {
    return {
      username,
      password,
      resetPassword: true,
    }
  }

  return state
}

function createDescriptor(id, refId) {
  return refId == null || id == null ? null : `${id}/${refId}`
}

export default function clustersCredentialsReducer(
  state: State = {},
  action: ClusterCredentialsAction,
): State {
  if (action.error) {
    return state
  }

  if (action.type === CREATE_DEPLOYMENT || action.type === CREATE_CLUSTER) {
    const descriptor = createDescriptor(action.meta.id, action.meta.refId)

    // We only have the cluster id when the create cluster request has succeeded
    if (!descriptor) {
      return state
    }

    return {
      ...state,
      [descriptor]: reduceCredentials_v1(state[descriptor], action),
    }
  }

  if (action.type === RESET_CLUSTER_PASSWORD) {
    const { id, refId } = action.meta
    const descriptor = createDescriptor(id, refId)

    if (!descriptor) {
      return state
    }

    return {
      ...state,
      [descriptor]: reduceCredentials_v0_1(state[descriptor], action),
    }
  }

  if (action.type === CLEAR_CLUSTER_CREDENTIALS) {
    const { id, refId } = action.meta
    const descriptor = createDescriptor(id, refId)

    if (!descriptor) {
      return state
    }

    return {
      ...state,
      [descriptor]: null,
    }
  }

  return state
}

export function getClusterCredentials(state: State, id: string, refId: string) {
  const descriptor = createDescriptor(id, refId)
  return descriptor == null ? null : state[descriptor]
}
