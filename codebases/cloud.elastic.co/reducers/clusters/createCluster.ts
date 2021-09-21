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

import { get, isInteger, map, mapValues, maxBy, minBy, some, startsWith } from 'lodash'

import moment from 'moment'

import stringify from '../../lib/stringify'
import { isTopologySized } from '../../lib/deployments/deployment'
import { isEmptyDeployment } from '../../lib/deployments/conversion'

import { parseWeirdApiTimeAsMs } from '../../lib/weirdTime'
import { getPlatform, getPlatformInfoById } from '../../lib/platform'

import { mapInstanceConfigurations, getRegionId } from '../../lib/stackDeployments'

import { fsMultiplierDefault } from '../../constants/fsMultiplier'

import { getConfigForKey } from '../../store'

import {
  DeploymentGetResponse,
  ElasticsearchClusterInfo,
  ElasticsearchClusterPlansInfo,
} from '../../lib/api/v1/types'

import {
  ElasticsearchCluster,
  ElasticsearchClusterInstance,
  ElasticsearchId,
  RegionId,
  Url,
} from '../../types'

function isAllowedName(name) {
  return name != null && name.length > 0
}

function getClusterName(id, name) {
  return isAllowedName(name) ? name : id
}

function getEvents(source) {
  const events = get(source, [`system_alerts`], [])

  return {
    slain: events,
  }
}

function getCloudId(metadata): string | null {
  return get(metadata, [`cloud_id`])
}

const toNumber = (str) => {
  if (str == null) {
    return undefined
  }

  if (isInteger(str)) {
    return str
  }

  const stringToNumber = parseInt(str, 10)

  if (isNaN(stringToNumber)) {
    return undefined
  }

  return stringToNumber
}

export const createInstanceDisplayName = (rawId: string, withoutHash?: boolean) => {
  const idArray = rawId.split(`-`).pop() || ``
  const id = parseInt(idArray, 10)

  if (startsWith(rawId, `tiebreaker`)) {
    return withoutHash ? `Tiebreaker ${id}` : `Tiebreaker #${id}`
  }

  return withoutHash ? `Instance ${id}` : `Instance #${id}`
}

function createInstance({ clusterId, masterInfo, instance }) {
  const nodeTypes = (instance.service_roles || []).reduce((result, role) => {
    result[role] = true
    return result
  }, {})

  // This is an optional field in the response, since for pending plans an instance
  // may not be available yet
  const instanceCapacity = get(instance, [`memory`, `instance_capacity`], 0)
  const instanceCapacityPlanned = get(instance, [`memory`, `instance_capacity_planned`])

  // Check the list of masters to see if this instance is acting as a master
  const isMaster = some(
    masterInfo.masters,
    (master) => master.master_instance_name === instance.instance_name,
  )

  const elasticsearchClusterInstance: ElasticsearchClusterInstance = {
    kind: `elasticsearch`,
    clusterId,
    name: instance.instance_name,
    displayName: createInstanceDisplayName(instance.instance_name),
    capacity: {
      memory: instanceCapacity,
      memoryPlanned: instanceCapacityPlanned,
      storage: toNumber(get(instance, [`disk`, `disk_space_available`])),
    },
    storageMultiplier: toNumber(get(instance, [`disk`, `storage_multiplier`])),
    status: {
      inMaintenanceMode: instance.maintenance_mode,
      isStarted: instance.container_started,
      isRunning: instance.service_running,
      diskSpaceUsed: toNumber(get(instance, [`disk`, `disk_space_used`])),
      oldGenFillPercentage: toNumber(get(instance, [`memory`, `memory_pressure`])),
      nativeFillPercentage: toNumber(get(instance, [`memory`, `native_memory_pressure`])),
    },
    allocator: {
      id: instance.allocator_id,
      zone: instance.zone,
    },
    elasticsearch: {
      version: instance.service_version,
      nodeTypes,
    },
    serviceRoles: instance.service_roles,
    isMaster,
    instanceConfig: {
      id: get(instance, [`instance_configuration`, `id`]),
      name: get(instance, [`instance_configuration`, `name`]),
      resource: get(instance, [`instance_configuration`, `resource`]),
    },
  }

  return elasticsearchClusterInstance
}

function createUser(user, username) {
  return {
    username,
    validUntil: user.valid_until,
  }
}

function createSecurityConfig(config, version) {
  const users = get(config, [`users`], [])
  const rolesPerUser = get(config, [`users_roles`], [])

  const mappedUsers = {}

  users.forEach((user) => {
    mappedUsers[user.username] = user.password_hash
  })

  const usersPerRole = {}

  rolesPerUser.forEach(({ username, roles }) => {
    roles.forEach((role) => {
      if (usersPerRole[role] == null) {
        usersPerRole[role] = []
      }

      usersPerRole[role].push(username)
    })
  })

  return {
    version,
    allowAnonymous: config.allow_anonymous,
    roles: get(config, [`roles`], {}),
    users: mappedUsers,
    usersPerRole: mapValues(usersPerRole, (v: string[]) => v.join(`, `)),
  }
}

function createHrefs(selfUrlRaw) {
  const selfUrl = selfUrlRaw.replace(/\?.*/, ``) // strip any query params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const oldApiUrl = useOldApi(selfUrl)

  const data = `${selfUrl}/metadata/raw`
  const comments = `${oldApiUrl}/comments`
  const comment = `${oldApiUrl}/comments/{commentId}`
  const plan = `${selfUrl}/plan`
  const planAttempts = `${selfUrl}/plan/activity?show_plan_defaults=true`
  const createKibana = `${selfUrl}/kibana`
  const clusterAcl = `${oldApiUrl}/acl?version={version}`
  const setMaintenanceMode = `${selfUrl}/instances/{instanceIds}/maintenance-mode/_{action}`
  const setInstanceStatus = `${selfUrl}/instances/{instanceIds}/_{action}`
  const resetPassword = `${oldApiUrl}/_reset_password`
  const cancelPlan = `${selfUrl}/plan/pending`
  const proxy = getProxy()

  return {
    data,
    comments,
    comment,
    plan,
    'cancel-plan': cancelPlan,
    'plan-attempts': planAttempts,
    'create-kibana': createKibana,
    'cluster-acl': clusterAcl,
    'set-maintenance-mode': setMaintenanceMode,
    'set-instance-status': setInstanceStatus,
    proxy,
    'reset-password': resetPassword,
  }

  function getProxy() {
    const baseProxyUrl = `${oldApiUrl}/proxy/_cluster`

    if (getConfigForKey(`APP_NAME`) !== `userconsole`) {
      return baseProxyUrl
    }

    const clusterPartsRegex = /regions\/([^/]+)\/clusters\/([^/]+)\/proxy\/_cluster$/

    return baseProxyUrl.replace(clusterPartsRegex, userconsoleProxyReplacer)

    function userconsoleProxyReplacer(_, regionId, clusterId) {
      return `clusters/${regionId}/${clusterId}/proxy`
    }
  }

  function useOldApi(link) {
    return link.replace(/api\/v1/, `api/v0.1`).replace(`clusters/elasticsearch`, `clusters`)
  }
}

function mapSnapshots(snapshots, data) {
  const snapshotConfig = data.snapshot || {}

  let snapshotsEnabled = true

  if (snapshotConfig.enabled != null) {
    snapshotsEnabled = snapshotConfig.enabled
  } else if (snapshotConfig.suspended != null) {
    snapshotsEnabled = Object.keys(snapshotConfig.suspended).length === 0
  }

  const hasRecentEnoughSuccess = getRecentSuccess()

  const nextSnapshotAt =
    snapshots.scheduled_time == null || snapshots.scheduled_time.match(/^1970-/)
      ? null
      : snapshots.scheduled_time

  const snapshotStatus = {
    enabled: snapshotsEnabled,
    healthy: snapshots.healthy,
    latest: {
      state: snapshots.latest_status,
      success: snapshots.latest_status === `SUCCESS`,
      time: snapshots.latest_end_time,
    },
    status: {
      currentStatusHealthy: snapshots.healthy,
      totalCount: snapshots.count,
      latestSuccessAt: snapshots.latest_successful_end_time,
      nextSnapshotAt,
      pendingInitialSnapshot:
        snapshots.latest_successful_end_time == null && snapshots.latest_end_time == null,
      hasRecentEnoughSuccess,
    },
    snapshotRepositoryId: get(data, [`snapshot`, `repository`, `config`, `repository_id`]),
  }

  return snapshotStatus

  function getRecentSuccess() {
    if (typeof snapshots.recent_success === `boolean`) {
      return snapshots.recent_success
    }

    // legacy code, scared of removing this, although fairly inoccuous — @nico
    const snapshotInterval = get(snapshotConfig, [`interval`], 30 * 60 * 1000)
    const recentEnoughFactor = get(snapshotConfig, [`recent_enough_factor`], 4)
    const recentEnough = Date.now() - parseWeirdApiTimeAsMs(snapshotInterval) * recentEnoughFactor

    const recentSuccess =
      snapshots.latest_end_time != null && Date.parse(snapshots.latest_end_time) > recentEnough

    return recentSuccess
  }
}

function getAvailabilityZones(planInfo) {
  const clusterTopology = get(planInfo, [`current`, `plan`, `cluster_topology`])

  if (clusterTopology) {
    const maxZoneCount = Math.max(...clusterTopology.map((t) => t.zone_count || 0))

    if (maxZoneCount > 0) {
      return maxZoneCount
    }
  }

  return get(planInfo, [`current`, `plan`, `zone_count`])
}

function mapPlan(planInfo, { source }) {
  let planAttemptId = null
  let planAttemptEndTime

  if (planInfo.current) {
    planAttemptId = planInfo.current.plan_attempt_id

    if (planInfo.current.attempt_end_time) {
      planAttemptEndTime = moment(planInfo.current.attempt_end_time).toDate()
    }
  } else if (planInfo.pending) {
    planAttemptId = planInfo.pending.plan_attempt_id
  }

  const currentVersion = get(planInfo, [`current`, `plan`, `elasticsearch`, `version`])
  const pendingPlan = get(planInfo, [`pending`, `plan`])
  const pendingVersion = get(planInfo, [`pending`, `plan`, `elasticsearch`, `version`])
  const isPending = pendingVersion != null

  const planMessages = get(planInfo, [`pending`, `plan_attempt_log`], [])

  const availabilityZones = getAvailabilityZones(planInfo)
  const isActive = currentVersion != null
  const initializing = isInitializing(source)
  const isCreating = initializing || (isPending && !isActive && !isEmptyDeployment(pendingPlan))

  return {
    isCreating,
    planAttemptId,
    planAttemptEndTime,
    version: currentVersion,
    availabilityZones,
    healthy: planInfo.healthy,
    isActive,
    isPending,
    waitingForPending: false,
    status: {
      failed: planMessages.filter((each) => each.status === `error`).length,
      messages: planMessages,
    },
    pending: {
      _source: stringify(planInfo.pending),
    },
  }
}

function mapSecurity(source) {
  const {
    metadata: { raw: data },
  } = source

  const internalUsers = get(data, [`shield`, `found_users`], {})
  const securityConfig = get(source, [`security`], {})
  const aclVersion = get(source, [`security`, `version`])

  return {
    isConfigured: get(data, [`shielded`], false),
    internalUsers: Object.keys(internalUsers).map((username) =>
      createUser(internalUsers[username], username),
    ),
    config: createSecurityConfig(securityConfig, aclVersion),
  }
}

function mapCuration(source) {
  return {
    plan: get(source, [`plan_info`, `current`, `plan`, `elasticsearch`, `curation`], {}),
    settings: get(source, [`settings`, `curation`], {}),
  }
}

function mapInstances(clusterId, topology, planInfo, instances, masterInfo) {
  const instanceCapacity = get(planInfo, [
    `current`,
    `plan`,
    `cluster_topology`,
    `0`,
    `memory_per_node`,
  ])
  const instanceCount = get(planInfo, [
    `current`,
    `plan`,
    `cluster_topology`,
    `0`,
    `node_count_per_zone`,
  ])

  const runningInstances = instances.filter((instance) => instance.service_running).length
  const notRunningInstances = instances.filter((instance) => !instance.service_running).length

  return {
    healthy: topology.healthy,
    instanceCapacity,
    count: {
      expected: instanceCount,
      total: runningInstances + notRunningInstances,
      notRunning: notRunningInstances,
      running: runningInstances,
    },
    record: instances.map((instance) => createInstance({ clusterId, masterInfo, instance })),
  }
}

function mapShards(shardInfo) {
  const available = minBy(map(shardInfo.available_shards, `shard_count`)) || 0
  const unavailable = maxBy(map(shardInfo.unavailable_shards, `shard_count`)) || 0

  return {
    healthy: shardInfo.healthy,
    count: {
      total: available + unavailable,
      available,
      unavailable,
    },
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

function isForceRestarting(planInfo) {
  const rebootPath = [`pending`, `plan`, `transient`, `plan_configuration`, `cluster_reboot`]
  const reboot = get(planInfo, rebootPath)
  return reboot === `forced`
}

function isInitializing(source) {
  return source.status === `initializing`
}

function getMonitoringInfo(elasticsearchMonitoringInfo, regionId) {
  if (
    elasticsearchMonitoringInfo === undefined ||
    elasticsearchMonitoringInfo.destination_cluster_ids.length === 0
  ) {
    return {
      enabled: false,
      out: null,
    }
  }

  return {
    enabled: true,

    // we currently only support 1 destination cluster
    out: `${regionId}/${elasticsearchMonitoringInfo.destination_cluster_ids[0]}`,
  }
}

export function getDeploymentTemplateId(planInfo: ElasticsearchClusterPlansInfo): string | null {
  const deploymentTemplateIdPath = [`plan`, `deployment_template`, `id`]

  let id = get(planInfo, [`pending`].concat(deploymentTemplateIdPath))

  if (!id) {
    id = get(planInfo, [`current`].concat(deploymentTemplateIdPath))
  }

  return id
}

export default function createCluster({
  regionId: consumerRegionId,
  clusterId,
  selfUrl,
  source,
  oldCluster,
  stackDeployment,
}: {
  regionId: RegionId
  clusterId: ElasticsearchId
  selfUrl: Url
  source: ElasticsearchClusterInfo
  oldCluster?: ElasticsearchCluster | null
  stackDeployment?: DeploymentGetResponse
}): ElasticsearchCluster {
  const {
    deployment_id,
    metadata,
    plan_info,
    cluster_name,
    elasticsearch,
    healthy,
    associated_kibana_clusters,
    associated_apm_clusters,
    snapshots,
    topology,
    external_links: externalLinks,
    elasticsearch_monitoring_info,
  } = source

  const regionId = stackDeployment
    ? getRegionId({ deployment: stackDeployment })!
    : consumerRegionId

  // N.B. there are no default metadata values at the moment - see #5358
  const data = metadata.raw || {}

  const metadataSettings = get(source, [`settings`, `metadata`], {})

  const { shard_info, master_info, blocking_issues } = elasticsearch
  const { instances } = topology

  const kibana = get(associated_kibana_clusters, [`0`])
  const apm = get(associated_apm_clusters, [`0`])

  const proxyLogging = get(data, [`proxy`, `logging`], true)

  const userLevel = get(data, [`user_level`])

  // persist deleted flag to avoid a deleted cluster showing up again on a scheduled re-fetch
  const wasDeleted = oldCluster != null && oldCluster.wasDeleted === true

  const isStopped = instances.length === 0
  const platformId = getPlatform(regionId)
  const { iconType: platformLogo } = getPlatformInfoById(platformId)

  const name = stackDeployment ? stackDeployment.name : cluster_name
  const displayName = getClusterName(clusterId, name)
  const displayId = (stackDeployment ? stackDeployment.id : clusterId).substring(0, 6)

  const isAnyInstanceUnderMaintenance = instances.some((instance) => instance.maintenance_mode)
  const initializing = isInitializing(source)
  const isInitialPlanFailed = initializing && !plan_info.healthy
  const stackDeploymentId = getStackDeploymentId()

  return {
    id: clusterId,
    stackDeploymentId,
    platform: {
      id: platformId,
      logoString: platformLogo,
    },
    regionId,
    name,
    displayId,
    cloudId: getCloudId(metadata),
    displayName,
    isHidden: metadataSettings.hidden,
    isInitializing: initializing,
    isInitialPlanFailed,
    isStopped,
    isStopping: isStopping(source),
    isRestarting: isRestarting(source),
    isForceRestarting: isForceRestarting(plan_info),
    hiddenTimestamp: get(data, [`hidden_timestamp`]),
    healthy,

    remoteClusters: {
      enabled: Boolean(source.ccs),
      healthy: get(source, [`ccs`, `healthy`], false),
      list: get(source, [`ccs`, `remote_clusters`], []),
    },

    user: {
      // deprecated, use `profile` where possible
      id: get(data, [`user_id`]),
      level: userLevel,
      isPremium: userLevel === `gold` || userLevel === `platinum`,
    },
    profile: {
      userId: metadataSettings.owner_id,
      level: metadataSettings.subscription_level,
    },
    plan: mapPlan(plan_info, { source }),
    master: {
      healthy: master_info.healthy,
      count: master_info.masters.filter((entry) => entry.master_node_id !== `null`).length,
      instancesWithNoMaster: master_info.instances_with_no_master,
    },
    shards: mapShards(shard_info),
    instances: mapInstances(clusterId, topology, plan_info, instances, master_info),
    instanceConfigurations: mapInstanceConfigurations(instances),
    snapshots: mapSnapshots(snapshots, data),
    kibana: {
      enabled: get(kibana, [`enabled`], false),
      id: get(kibana, [`kibana_id`]),
    },
    apm: {
      enabled: get(apm, [`enabled`], false),
      id: get(apm, [`apm_id`]),
    },
    marvel: getMonitoringInfo(elasticsearch_monitoring_info, regionId),
    monitoringInfo: elasticsearch_monitoring_info,
    security: mapSecurity(source),
    curation: mapCuration(source),
    externalLinks: externalLinks || [],
    events: getEvents(source),
    _raw: {
      plan: plan_info.current && plan_info.current.plan ? plan_info.current.plan : null,
      pendingPlan: plan_info.pending && plan_info.pending.plan ? plan_info.pending.plan : null,
      pendingSource:
        plan_info.pending && plan_info.pending.source ? plan_info.pending.source : null,

      // As cname is generated by the backend we must make sure to not keep it around
      // and potentially save it to the backend.
      data: metadata,

      // FIXME: no acl in v1 response - Alex P says it's deprecated
      acl: get(source, [`acl`, `data`], {}),
    },
    hrefs: createHrefs(selfUrl),
    isSystemOwned: get(source, [`settings`, `metadata`, `system_owned`], false),
    proxyLogging,
    kind: `elasticsearch`,
    fsMultiplier: get(
      data,
      [`overrides`, `resources`, `quota`, `fs_multiplier`],
      fsMultiplierDefault,
    ),
    isAnyInstanceUnderMaintenance,
    wasDeleted,
    deploymentTemplateId: getDeploymentTemplateId(plan_info),
    settings: source.settings || {},
    blocks: {
      healthy: blocking_issues ? blocking_issues.healthy : undefined,
      indices: blocking_issues ? blocking_issues.index_level : [],
      cluster: blocking_issues ? blocking_issues.cluster_level : [],
    },
    cpuHardLimit: get(data, [`resources`, `cpu`, `hard_limit`]),
    isLocked: Boolean(source.locked),
  }

  function getStackDeploymentId() {
    if (deployment_id) {
      return deployment_id
    }

    if (stackDeployment) {
      return stackDeployment.id
    }

    return null
  }
}
