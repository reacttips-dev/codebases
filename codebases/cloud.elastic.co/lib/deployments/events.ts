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

import { ElasticsearchCluster } from '../../types'
import { ClusterSystemAlert } from '../api/v1/types'

function hasNoEventList(deployment: ElasticsearchCluster | null | undefined): boolean {
  return deployment == null || deployment.events == null || deployment.events.slain == null
}

function getEvents(deployment: ElasticsearchCluster | null | undefined): ClusterSystemAlert[] {
  if (hasNoEventList(deployment)) {
    return []
  }

  return deployment!.events.slain
}

export function getRecentSlainEvents(
  deployment: ElasticsearchCluster | null | undefined,
): ClusterSystemAlert[] {
  return getEvents(deployment)
    .filter((event) => event.alert_type !== `heap_dump`)
    .slice(0, 3)
}
