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

import { isEmpty } from 'lodash'

import { ElasticsearchResourceInfo } from '../../api/v1/types'
import { ClusterSnapshot } from '../../../types'

export function hasHealthySnapshots({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  return resource.info.snapshots.healthy
}

export function hasEnabledSnapshots({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  const snapshotSettings = resource.info.settings?.snapshot

  if (!snapshotSettings) {
    return true
  }

  if (`enabled` in snapshotSettings) {
    return Boolean(snapshotSettings.enabled)
  }

  if (hasSuspendedSnapshots({ resource })) {
    return false
  }

  return true
}

export function hasSuspendedSnapshots({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  const snapshotSettings = resource.info.settings?.snapshot

  if (!snapshotSettings) {
    return false
  }

  return !isEmpty(snapshotSettings.suspended || {})
}

export function getLatestSnapshotSuccess({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): Date | null {
  const snapshotInfo = resource.info.snapshots
  const latestSuccess = snapshotInfo.latest_successful_end_time
  return latestSuccess ? new Date(latestSuccess) : null
}

function getLatestSnapshotEndTime({ resource }: { resource: ElasticsearchResourceInfo }) {
  const snapshotInfo = resource.info.snapshots
  const latestEndTime = snapshotInfo.latest_end_time
  return latestEndTime ? new Date(latestEndTime) : null
}

export function hasLatestSnapshotSuccess({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  const snapshotInfo = resource.info.snapshots
  return snapshotInfo.latest_status === `SUCCESS`
}

export function getScheduledSnapshotTime({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): Date | null {
  const snapshotInfo = resource.info.snapshots
  const scheduledTime = snapshotInfo.scheduled_time

  if (!scheduledTime) {
    return null
  }

  // legacy bug carry over
  const invalidTime = scheduledTime.match(/^1970-/)

  if (invalidTime) {
    return null
  }

  return new Date(scheduledTime)
}

export function hasScheduledSnapshot({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  return Boolean(getScheduledSnapshotTime({ resource }))
}

export function isPendingInitialSnapshot({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  const latestOverall = getLatestSnapshotEndTime({ resource })
  const latestSuccess = getLatestSnapshotSuccess({ resource })
  return !latestSuccess && !latestOverall
}

export function hasRecentSnapshotSuccess({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): boolean {
  const snapshotInfo = resource.info.snapshots
  return Boolean(snapshotInfo.recent_success)
}

export function hasSlm({ resource }: { resource: ElasticsearchResourceInfo }): boolean {
  return Boolean(resource.info.settings?.snapshot?.slm)
}

export function filterSearchableSnapshots(snapshots: ClusterSnapshot[]): ClusterSnapshot[] {
  return snapshots.filter((snapshot) => snapshot.metadata?.policy === 'cloud-snapshot-policy')
}
