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

import { filter, get, map, toNumber } from 'lodash'

import createPlanMessages from './createPlanMessages'

import stringify from '../../lib/stringify'
import { isTopologySized } from '../../lib/deployments/deployment'
import { getRegionId } from '../../lib/stackDeployments'

import { KibanaCluster, KibanaId, RegionId, Url } from '../../types'
import {
  KibanaClusterInfo,
  DeploymentGetResponse,
  ClusterMetadataInfo,
} from '../../lib/api/v1/types'

const createInstanceDisplayName = (rawId) => `Instance #${parseInt(rawId.split(`-`).pop(), 10)}`

function createInstance({ clusterId, instance }) {
  return {
    kind: `kibana`,
    clusterId,
    displayName: createInstanceDisplayName(instance.instance_name),
    name: instance.instance_name,
    capacity: {
      memory: instance.memory ? instance.memory.instance_capacity : 0,
    },
    allocator: {
      id: instance.allocator_id,
      zone: instance.zone,
    },
    status: {
      isStarted: instance.service_running,
      inMaintenanceMode: instance.maintenance_mode,
      nativeFillPercentage: toNumber(get(instance, [`memory`, `native_memory_pressure`])),
    },
    version: instance.service_version,
    instanceConfig: {
      id: get(instance, [`instance_configuration`, `id`]),
      name: get(instance, [`instance_configuration`, `name`]),
      resource: get(instance, [`instance_configuration`, `resource`]),
    },
  }
}

function createHrefs(selfUrl) {
  const kibanaPlan = `${selfUrl}/plan`
  const attempts = `${kibanaPlan}/attempts`

  return {
    'kibana-plan': kibanaPlan,
    'kibana-plan-attempts': attempts,
    upgrade: `${selfUrl}/_upgrade`,
  }
}

export default function createKibana({
  regionId: consumerRegionId,
  kibanaId,
  selfUrl,
  source,
  stackDeployment,
}: {
  regionId: RegionId
  kibanaId: KibanaId
  selfUrl: Url
  source: KibanaClusterInfo
  stackDeployment?: DeploymentGetResponse
}): KibanaCluster {
  const {
    metadata,
    plan_info,
    topology,
    elasticsearch_cluster,
    healthy,
    external_links: externalLinks,
    settings,
  } = source

  const regionId = stackDeployment
    ? getRegionId({ deployment: stackDeployment })!
    : consumerRegionId

  const { instances } = topology

  const currentPlan = get(plan_info, [`current`, `plan`])
  const pendingPlan = get(plan_info, [`pending`, `plan`])
  const clusterTopology = get(currentPlan, [`cluster_topology`], [])

  const currentVersion = get(currentPlan, [`kibana`, `version`])
  const pendingVersion = get(pendingPlan, [`kibana`, `version`])

  const isPending = pendingVersion != null

  const logPath = [isPending ? `pending` : `current`, `plan_attempt_log`]
  const planMessages = createPlanMessages(get(plan_info, logPath, []))
  const runningInstances = filter(instances, (instance) => instance.service_running).length
  const notRunningInstances = filter(instances, (instance) => !instance.service_running).length
  const planAttemptId = getPlanAttemptId(plan_info)
  const isStopped = runningInstances === 0 || !isTopologySized(clusterTopology)
  const isHidden = get(settings, [`metadata`, `hidden`], false)

  return {
    id: kibanaId,
    regionId,
    clusterId: elasticsearch_cluster.elasticsearch_id,
    stackDeploymentId: stackDeployment ? stackDeployment.id : null,
    displayName: kibanaId,
    healthy,
    isHidden,
    isInitializing: isInitializing(source),
    isStopped,
    isStopping: isStopping(source),
    isRestarting: isRestarting(source),
    isForceRestarting: isForceRestarting(plan_info),
    plan: {
      planAttemptId,
      version: currentVersion,
      healthy: plan_info.healthy,
      isActive: currentVersion != null,
      isPending,
      waitingForPending: false,
      status: {
        messages: planMessages,
      },
      pending: {
        _source: isPending && plan_info.pending ? stringify(plan_info.pending.plan) : ``,
      },
    },
    instances: {
      healthy: topology.healthy,
      count: {
        total: runningInstances + notRunningInstances,
        notRunning: notRunningInstances,
        running: runningInstances,
      },
      record: map(topology.instances, (instance) =>
        createInstance({ clusterId: kibanaId, instance }),
      ),
    },
    _raw: {
      // TODO: We ought to store the whole metadata here, as it contains other information such as the data's version number
      data: get<ClusterMetadataInfo, 'raw', any>(metadata, [`raw`], {}) || {},
      plan: plan_info.current && plan_info.current.plan ? plan_info.current.plan : {},
      pendingPlan: plan_info.pending && plan_info.pending.plan ? plan_info.pending.plan : {},
      pendingSource:
        plan_info.pending && plan_info.pending.source ? plan_info.pending.source : null,
    },
    hrefs: createHrefs(selfUrl),
    kind: `kibana`,
    externalLinks,
    settings,
  }
}

function isStopping(source) {
  if (!source.plan_info.pending) {
    return false
  }

  if (source.status === `stopping`) {
    return true
  }

  const clusterTopology = get(source.plan_info, [`pending`, `plan`, `cluster_topology`], [])

  return !isTopologySized(clusterTopology)
}

function isRestarting(source) {
  return source.status === `restarting`
}

function isInitializing(source) {
  return source.status === `initializing`
}

function isForceRestarting(planInfo) {
  const rebootPath = [`pending`, `plan`, `transient`, `plan_configuration`, `cluster_reboot`]
  const reboot = get(planInfo, rebootPath)
  return reboot === `forced`
}

function getPlanAttemptId(planInfo) {
  if (planInfo.current) {
    return planInfo.current.plan_attempt_id
  }

  if (planInfo.pending) {
    return planInfo.pending.plan_attempt_id
  }

  return null
}
