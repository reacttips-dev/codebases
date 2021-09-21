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
  CLEAR_CLUSTER_CONSOLE_HISTORY,
  SET_CLUSTER_CONSOLE_HISTORY,
  SET_CLUSTER_CONSOLE_REQUEST,
} from '../../constants/actions'

import { queryClusterProxy } from '../clusterProxy'

import { ConsoleRequestState } from '../../reducers/clusterConsole'
import { ElasticsearchCluster } from '../../types'

export function queryClusterProxyForConsole(
  { regionId, id: clusterId }: { regionId: string; id: string },
  request: ConsoleRequestState,
) {
  const { path, method, body } = request

  return queryClusterProxy({
    regionId,
    clusterId,
    method,
    path,
    body,
    meta: {
      isConsoleRequest: true,
    },
  })
}

export function setClusterConsoleRequest(
  request: ConsoleRequestState,
  cluster: ElasticsearchCluster,
) {
  const { id: clusterId, regionId } = cluster
  return {
    type: SET_CLUSTER_CONSOLE_REQUEST,
    meta: { clusterId, regionId },
    payload: request,
  }
}

export function clearClusterConsoleHistory() {
  return {
    type: CLEAR_CLUSTER_CONSOLE_HISTORY,
  }
}

export function setClusterConsoleRequestHistory(history: ConsoleRequestState[]) {
  return {
    type: SET_CLUSTER_CONSOLE_HISTORY,
    payload: history,
  }
}
