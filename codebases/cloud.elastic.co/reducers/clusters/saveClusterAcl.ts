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

import { SAVE_CLUSTER_ACL } from '../../constants/actions'
import { AsyncAction } from '../../types'

export interface ClusterAclState {
  isSaving: boolean
  isSaved: boolean
  error: any
}

const initialClusterAclState: ClusterAclState = {
  isSaving: false,
  isSaved: false,
  error: undefined,
}

export interface State {
  [descriptor: string]: ClusterAclState
}

interface SaveClusterAclAction extends AsyncAction<typeof SAVE_CLUSTER_ACL> {
  meta: { regionId: string; clusterId: string }
}

function saveClusterAclReducer(
  state: ClusterAclState = initialClusterAclState,
  action: SaveClusterAclAction,
): ClusterAclState {
  if (action.type !== SAVE_CLUSTER_ACL) {
    return state
  }

  if (action.error) {
    return {
      ...state,
      isSaving: false,
      error: action.payload,
    }
  }

  if (action.payload) {
    const body = action.payload

    if (body.ok === false) {
      return {
        ...state,
        isSaving: false,
        error: action.payload,
      }
    }

    return {
      ...state,
      isSaving: false,
      isSaved: true,
      error: undefined,
    }
  }

  return {
    ...state,
    isSaving: true,
    isSaved: false,
  }
}

const createDescriptor = (clusterId, regionId) => `${regionId}/${clusterId}`

export default function saveClusterAclsReducer(
  state: State = {},
  action: SaveClusterAclAction,
): State {
  if (action.type !== SAVE_CLUSTER_ACL) {
    return state
  }

  const { clusterId, regionId } = action.meta
  const descriptor = createDescriptor(regionId, clusterId)

  return {
    ...state,
    [descriptor]: saveClusterAclReducer(state[descriptor], action),
  }
}

export function getSaveClusterAclInformation(
  state: State,
  regionId: string,
  clusterId: string,
): ClusterAclState {
  return state[createDescriptor(regionId, clusterId)] || initialClusterAclState
}
