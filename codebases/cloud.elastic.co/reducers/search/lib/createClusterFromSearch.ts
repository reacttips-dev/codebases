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

import { get, filter } from 'lodash'

import createPlanMessages from '../../clusters/createPlanMessages'
import createHighlightsFromSearch from './createHighlightsFromSearch'

export default function createClusterFromSearch({ regionId, id, source, highlight, oldHit }) {
  const { data, plan, status } = source
  const { shards, master, snapshot, instances, blocks } = status

  const name = get(data, [`data`, `name`])
  const currentVersion = get(plan, [`current`, `elasticsearch`, `version`])
  const pendingVersion = get(plan, [`pending`, `elasticsearch`, `version`])
  const pendingSourceAction = get(plan, [`pending`, `source`, `action`])
  const sourceAction = pendingSourceAction
    ? pendingSourceAction
    : get(plan, [`current`, `source`, `action`])

  const userLevel = get(data, [`user_level`])

  const availabilityZones = get(plan, [`current`, `availability_zones`])

  const instanceCapacity = get(plan, [`current`, `instance_capacity`])
  const masterInstanceCapacity = get(plan, [`current`, `master_instance_capacity`])
  const instanceCount = get(plan, [`current`, `instance_count`])

  const isAnyInstanceUnderMaintenance =
    filter(source.instances, (instance) => instance.data.maintenance).length > 0

  const isHidden = get(data, [`hidden`], false)
  const hiddenTimestamp = get(data, [`hidden_timestamp`], false)
  const isStopped = instanceCount === 0 && instanceCapacity === 0

  const highlights = createHighlightsFromSearch({
    highlight,
    oldHit,
    nameField: `data.data.name`,
  })

  const pendingPlanId = get(plan, [`pending`, `plan_id`])
  const statusPlanId = get(plan, [`status`, `plan_id`])

  const planMessages = createPlanMessages(
    get(plan, [`status`, `messages`], []),
    pendingPlanId,
    statusPlanId,
  )

  const isSystemOwned = data.system_owned === true

  let snapshotsEnabled = true
  const snapshotConfig = data.snapshot || {}

  if (snapshotConfig.enabled != null) {
    snapshotsEnabled = snapshotConfig.enabled
  } else if (snapshotConfig.suspended != null) {
    snapshotsEnabled = Object.keys(snapshotConfig.suspended).length === 0
  }

  return {
    type: `cluster`,
    regionId,
    id,
    name,
    highlights,
    displayId: id.substring(0, 6),
    displayName: getClusterName(id, name),
    isStopped: data.hidden || isStopped,
    isStopping: pendingVersion != null ? isStopping(plan) : false,
    healthy: status.healthy,
    user: {
      id: data.user_id,
      level: userLevel,
      isPremium: userLevel === `gold` || userLevel === `platinum`,
    },
    plan: {
      version: currentVersion,
      healthy: status.plan.healthy,
      isActive: currentVersion != null,
      isPending: pendingVersion != null,
      availabilityZones,
      planMessages,
      sourceAction,
    },
    isAnyInstanceUnderMaintenance,
    isSystemOwned,
    isHidden,
    hiddenTimestamp,
    master: {
      healthy: master.healthy,
      count: master.masters_count,
    },
    shards: {
      healthy: shards.healthy,
      count: {
        total: shards.available + shards.unavailable,
        available: shards.available,
        unavailable: shards.unavailable,
      },
    },
    instances: {
      healthy: instances.healthy,
      instanceCapacity,
      masterInstanceCapacity,
      count: {
        expected: instanceCount,
        total: instances.running.length + instances.not_running.length,
        notRunning: instances.not_running.length,
        running: instances.running.length,
      },
    },
    snapshots: {
      enabled: snapshotsEnabled,
      healthy: snapshot.healthy,
      count: {
        total: snapshot.count,
      },
      latest: {
        name: get(snapshot, [`latest`, `snapshot`]),
        success: get(snapshot, [`latest`, `state`]) !== `FAILED`,
        time: get(snapshot, [`latest`, `time`]),
      },
      status: {
        hasRecentEnoughSuccess: snapshot.has_recent_enough_success,
        missingInfo: snapshot.missing_info,
        latestSuccessAt: snapshot.latest_success_end_time,
        nextSnapshotAt: snapshot.next_snapshot_at,
        pendingInitialSnapshot: snapshot.pending_initial_snapshot,
      },
    },

    // blocks are used in ES to block dirty operations done against the cluster
    blocks: {
      healthy: blocks.healthy,
      cluster: blocks.cluster_blocks,
      indices: blocks.index_blocks,
    },
    kibana: {
      enabled: get(data, [`kibana`, `enabled`], false),
    },
    marvel: {
      out: get(data, [`marvel`, `out`]),
    },
  }
}

function allowedName(name) {
  return name != null && name.length > 0
}

function getClusterName(id, name) {
  return allowedName(name) ? name : id
}

function isStopping(plan) {
  const instanceCount = get(plan, [`pending`, `instance_capacity`])
  const instanceCapacity = get(plan, [`pending`, `instance_capacity`])

  return instanceCount === 0 && instanceCapacity === 0
}
