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

import { replaceIn } from '../../lib/immutability-helpers'

import { UPDATE_STACK_DEPLOYMENT_DRY_RUN } from '../../constants/actions'

import { DeploymentUpdateResponse } from '../../lib/api/v1/types'

export type State = {
  [deploymentId: string]: DeploymentUpdateResponse
}

const initialState: State = {}

export default function stackDeploymentDryRunsReducer(state: State = initialState, action): State {
  if (action.type === UPDATE_STACK_DEPLOYMENT_DRY_RUN) {
    if (!action.error && action.payload) {
      const { deploymentId } = action.meta
      return replaceIn(state, [deploymentId], action.payload)
    }
  }

  return state
}

export function getUpdateDeploymentDryRunResult(
  state: State,
  deploymentId: string,
): DeploymentUpdateResponse | null {
  return state[deploymentId] || null
}
