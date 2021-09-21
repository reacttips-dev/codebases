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

import { DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE } from '../../constants/actions'
import { AsyncAction, ElasticsearchId, RegionId } from '../../types'

export interface State {
  [descriptor: string]: any
}

interface DownloadAction extends AsyncAction<typeof DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE, string> {
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
  }
}

export default function clustersDiagnosticBundlesReducer(
  state: State = {},
  action: DownloadAction,
): State {
  if (action.type === DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE) {
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

export function getClusterDiagnosticBundle(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) {
  return state[createDescriptor(regionId, clusterId)]
}

function createDescriptor(regionId: RegionId, clusterId: ElasticsearchId) {
  return `${regionId}/${clusterId}`
}
