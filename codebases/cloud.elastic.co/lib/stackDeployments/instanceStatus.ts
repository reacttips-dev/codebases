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

import { ClusterInstanceInfo } from '../api/v1/types'

export function hasStoppedRoutingRequests(instance: ClusterInstanceInfo) {
  return instance.maintenance_mode
}

export function isNodePausedByUser(instance: ClusterInstanceInfo) {
  return !instance.container_started && !instance.service_running
}

export function isUnhealthy(instance: ClusterInstanceInfo) {
  return !instance.healthy && !hasStoppedRoutingRequests(instance) && !isNodePausedByUser(instance)
}
