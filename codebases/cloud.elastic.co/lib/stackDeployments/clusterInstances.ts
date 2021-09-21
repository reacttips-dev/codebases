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

import { ClusterInstanceInfo } from '../api/v1/types'

export function getDefaultDiskQuota({ instance }: { instance: ClusterInstanceInfo }): number {
  return get(instance, [`disk`, `storage_multiplier`], 0)
}

export function getCurrentDiskQuota({ instance }: { instance: ClusterInstanceInfo }): number {
  const storage = get(instance, [`disk`, `disk_space_available`], 0)
  const memory = get(instance, [`memory`, `instance_capacity`], 0)
  const currentQuota = storage / memory
  return currentQuota
}
