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

import { FETCH_CLUSTER_FOR_ADVANCED_EDITING } from '../../constants/actions'
import { ElasticsearchClusterInfo } from '../../lib/api/v1/types'
import { ElasticsearchId, RegionId } from '../../types'

type Action = {
  type: string
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
  }
  error?: string
  payload?: ElasticsearchClusterInfo
}

export interface State {
  [descriptor: string]: ElasticsearchClusterInfo
}

export default function reducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_CLUSTER_FOR_ADVANCED_EDITING) {
    if (!action.error && action.payload) {
      const {
        meta: { regionId, clusterId },
        payload,
      } = action

      return {
        ...state,
        [`${regionId}/${clusterId}`]: payload,
      }
    }
  }

  return state
}

export function getClusterForAdvancedEditing(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
): ElasticsearchClusterInfo | null {
  return state[`${regionId}/${clusterId}`]
}
