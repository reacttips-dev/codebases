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

import { flatMap, orderBy } from 'lodash'

import { FETCH_HEAP_DUMPS } from '../../constants/actions'

import { DeploymentHeapDumps } from '../../lib/api/v1/types'

import { HeapDump } from '../../types/heapDump'

export interface State {
  [descriptor: string]: HeapDump[]
}

type Action = {
  type: typeof FETCH_HEAP_DUMPS
  meta: {
    deploymentId: string
  }
  error?: boolean
  payload?: DeploymentHeapDumps
}

export default function deploymentHeapDumpsReducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_HEAP_DUMPS) {
    if (!action.error && action.payload) {
      const { deploymentId: descriptor } = action.meta

      const convertedHeapDumps = flatMap(action.payload?.elasticsearch || [], (resourceHeapDumps) =>
        flatMap(
          resourceHeapDumps.heap_dumps,
          ({ instance_id: instanceId, size, type, status, error, captured }) => ({
            resourceKind: `elasticsearch`,
            refId: resourceHeapDumps.ref_id,
            instanceId,
            size,
            type,
            status,
            error,
            captured,
          }),
        ),
      )

      return {
        ...state,
        [descriptor]: sortHeapDumps(convertedHeapDumps),
      }
    }
  }

  return state
}

export function getDeploymentHeapDumps(state: State, deploymentId: string): HeapDump[] | undefined {
  return state[deploymentId]
}

function sortHeapDumps(heapDumps: HeapDump[]) {
  return orderBy(heapDumps, [`captured`], [`desc`])
}
