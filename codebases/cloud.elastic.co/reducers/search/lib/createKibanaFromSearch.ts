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

import createPlanMessages from '../../clusters/createPlanMessages'
import createHighlightsFromSearch from './createHighlightsFromSearch'

export default function createKibanaFromSearch({ regionId, id, source, highlight, oldHit }) {
  const { data, plan, status } = source
  const { instances } = status

  const clusterId = get(data, [`data`, `elasticsearch_cluster_id`])
  const currentVersion = get(plan, [`current`, `kibana`, `version`])
  const pendingVersion = get(plan, [`pending`, `kibana`, `version`])

  const pendingSourceAction = get(plan, [`pending`, `source`, `action`])
  const sourceAction = pendingSourceAction
    ? pendingSourceAction
    : get(plan, [`current`, `source`, `action`])

  const availabilityZones = get(plan, [`current`, `availability_zones`])

  const instanceCount = get(plan, [`current`, `instance_count`])
  const instanceCapacity = get(plan, [`current`, `instance_capacity`])

  const totalInstances = Object.keys(instances.started).length
  const runningInstances = Object.keys(instances.running).length

  const isHidden = get(status, [`hidden`], false)
  const isStopped = instanceCount === 0 || instanceCapacity === 0

  const highlights = createHighlightsFromSearch({
    highlight,
    oldHit,
    nameField: `id`,
  })

  const pendingPlanId = get(plan, [`pending`, `plan_id`])
  const statusPlanId = get(plan, [`status`, `plan_id`])

  const planMessages = createPlanMessages(
    get(plan, [`status`, `messages`], []),
    pendingPlanId,
    statusPlanId,
  )

  return {
    type: `kibana`,
    regionId,
    id,
    highlights,
    displayId: id.substring(0, 6),
    displayName: id,
    clusterId,
    isHidden,
    isStopped: data.hidden || isStopped,
    healthy: status.healthy,
    plan: {
      version: currentVersion,
      healthy: status.plan.healthy,
      isActive: currentVersion != null,
      isPending: pendingVersion != null,
      availabilityZones,
      planMessages,
      sourceAction,
    },
    instances: {
      healthy: instances.healthy,
      instanceCapacity,
      count: {
        expected: instanceCount,
        total: totalInstances,
        notRunning: totalInstances - runningInstances,
        running: runningInstances,
      },
    },
  }
}
