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

import { AjaxResult } from '../../lib/ajax'
import { DOWNLOAD_CLUSTER_LOGS } from '../../constants/actions'
import { AsyncAction } from '../../types'

export interface State {
  [descriptor: string]: AjaxResult
}

interface DownloadLogsAction extends AsyncAction<typeof DOWNLOAD_CLUSTER_LOGS, AjaxResult> {
  meta: {
    regionId: string
    clusterId: string
  }
}

export default function clustersLogsReducer(state: State = {}, action: DownloadLogsAction): State {
  if (action.type === DOWNLOAD_CLUSTER_LOGS) {
    if (!action.error && action.payload) {
      const { clusterId, regionId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        ...state,
        [descriptor]: action.payload,
      }
    }
  }

  return state
}

export function getClusterLogs(state: State, regionId: string, clusterId: string) {
  return state[createDescriptor(regionId, clusterId)]
}

function createDescriptor(regionId: string, clusterId: string) {
  return `${regionId}/${clusterId}`
}
