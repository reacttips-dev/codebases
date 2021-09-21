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

import { get, values } from 'lodash'
import createCluster from './createCluster'

import {
  updateClusterInstancesMaintenanceMode,
  updateClusterInstancesStatus,
} from './updateClusterInstance'

import updateClusterName from './updateClusterName'

import disableSnapshotsForCluster from './disableSnapshotsForCluster'
import setSnapshotRepository from './setSnapshotRepository'
import setDiskQuota from './setDiskQuota'
import setInstanceCapacity from './setInstanceCapacity'
import setClusterToHidden from './setClusterToHidden'
import updateMonitoring from './updateMonitoring'
import cancelMonitoring from './cancelMonitoring'
import { enableHeapDumps, disableHeapDumps } from './heapDumps'
import { updateMetadataVersion } from './metadata'

import { otherPaths } from '../../config/clusterPaths'

import { getRegionId } from '../../lib/stackDeployments'

import {
  CANCEL_CLUSTER_MONITORING,
  DELETE_APM,
  DELETE_KIBANA,
  DEPLOYMENT_WAS_DELETED,
  DISABLE_HEAP_DUMPS_ON_OOM,
  DISABLE_SNAPSHOTS_FOR_CLUSTER,
  ENABLE_HEAP_DUMPS_ON_OOM,
  FETCH_CLUSTER,
  FETCH_STACK_DEPLOYMENT,
  HIDE_CLUSTER,
  RENAME_CLUSTER,
  SAVE_CLUSTER_MONITORING,
  SET_DISK_QUOTA,
  SET_INSTANCE_CAPACITY,
  SET_INSTANCE_STATUS,
  SET_MAINTENANCE_MODE,
  SET_PROXY_LOGGING,
  SET_SNAPSHOT_REPOSITORY,
  UPDATE_CURATION_INDEX_PATTERNS,
  WAIT_FOR_PENDING_CLUSTER,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import {
  ElasticsearchCluster,
  ElasticsearchId,
  RegionId,
  VersionNumber,
  FetchDeploymentAction,
} from '../../types'

import { ElasticsearchClusterPlan, DeploymentGetResponse } from '../../lib/api/v1/types'

import { ClusterAction } from './clusterTypes'

export type State = { [descriptor: string]: ElasticsearchCluster | null }

type Action = ClusterAction | FetchDeploymentAction

function clusterReducer(
  cluster: ElasticsearchCluster | null,
  action: Action,
): ElasticsearchCluster | null {
  if (action.type === FETCH_STACK_DEPLOYMENT) {
    const stackDeployment = action.payload as DeploymentGetResponse
    const esCluster = stackDeployment.resources.elasticsearch[0]
    const { id, info } = esCluster
    const regionId = getRegion(action)
    const selfUrl = getSelfUrl(regionId, id)

    return createCluster({
      regionId,
      clusterId: id,
      selfUrl,
      source: info,
      oldCluster: cluster,
      stackDeployment,
    })
  }

  if (action.type === FETCH_CLUSTER) {
    const { clusterId, regionId, selfUrl } = action.meta
    return createCluster({
      regionId,
      clusterId,
      selfUrl,
      source: action.payload,
      oldCluster: cluster,
    })
  }

  if (cluster == null) {
    return cluster
  }

  if (action.type === SET_MAINTENANCE_MODE) {
    return updateClusterInstancesMaintenanceMode(
      cluster,
      action.meta.instanceIds,
      action.meta.action,
    )
  }

  if (action.type === SET_INSTANCE_STATUS) {
    return updateClusterInstancesStatus(cluster, action.meta.instanceIds, action.meta.action)
  }

  if (action.type === RENAME_CLUSTER) {
    return updateClusterName(cluster, action)
  }

  if (action.type === DELETE_KIBANA) {
    // Rather than just setting `enabled` to false, replace the object so that the
    // Kibana ID is removed as well.
    return replaceIn(cluster, [`kibana`], { enabled: false })
  }

  if (action.type === DELETE_APM) {
    // Rather than just setting `enabled` to false, replace the object so that the
    // APM ID is removed as well.
    return replaceIn(cluster, [`apm`], { enabled: false })
  }

  if (action.type === SET_PROXY_LOGGING) {
    return updateMetadataVersion(
      replaceIn(cluster, [`proxyLogging`], action.payload.proxy.logging),
      action,
    )
  }

  if (action.type === DISABLE_SNAPSHOTS_FOR_CLUSTER) {
    return updateMetadataVersion(disableSnapshotsForCluster(cluster), action)
  }

  if (action.type === SET_SNAPSHOT_REPOSITORY) {
    return updateMetadataVersion(setSnapshotRepository(cluster, action), action)
  }

  if (action.type === SET_DISK_QUOTA) {
    return setDiskQuota(cluster, action)
  }

  if (action.type === SET_INSTANCE_CAPACITY) {
    return setInstanceCapacity(cluster, action)
  }

  if (action.type === HIDE_CLUSTER) {
    return setClusterToHidden(cluster)
  }

  if (action.type === WAIT_FOR_PENDING_CLUSTER) {
    return replaceIn(cluster, [`plan`, `waitingForPending`], true)
  }

  if (action.type === DEPLOYMENT_WAS_DELETED) {
    return replaceIn(cluster, [`wasDeleted`], true)
  }

  if (action.type === UPDATE_CURATION_INDEX_PATTERNS) {
    const { specs } = action.payload
    const curationPath = [`curation`, `settings`, `specs`]
    const settingPath = [`settings`, `curation`, `specs`]
    const updatedCuration = replaceIn(cluster, curationPath, specs)
    const updatedSettings = replaceIn(updatedCuration, settingPath, specs)
    return updatedSettings
  }

  if (action.type === SAVE_CLUSTER_MONITORING) {
    return updateMonitoring(cluster, action.meta.regionId, action.meta.destClusterId)
  }

  if (action.type === CANCEL_CLUSTER_MONITORING) {
    return cancelMonitoring(cluster)
  }

  if (action.type === ENABLE_HEAP_DUMPS_ON_OOM) {
    return updateMetadataVersion(enableHeapDumps(cluster, action), action)
  }

  if (action.type === DISABLE_HEAP_DUMPS_ON_OOM) {
    return updateMetadataVersion(disableHeapDumps(cluster), action)
  }

  return cluster
}

function createDescriptor(regionId, clusterId) {
  return `${regionId}/${clusterId}`
}

export default function clustersReducer(clusters: State = {}, action: Action): State {
  switch (action.type) {
    case CANCEL_CLUSTER_MONITORING:
    case DELETE_APM:
    case DELETE_KIBANA:
    case DEPLOYMENT_WAS_DELETED:
    case DISABLE_HEAP_DUMPS_ON_OOM:
    case DISABLE_SNAPSHOTS_FOR_CLUSTER:
    case ENABLE_HEAP_DUMPS_ON_OOM:
    case FETCH_CLUSTER:
    case FETCH_STACK_DEPLOYMENT:
    case HIDE_CLUSTER:
    case RENAME_CLUSTER:
    case SAVE_CLUSTER_MONITORING:
    case SET_DISK_QUOTA:
    case SET_INSTANCE_CAPACITY:
    case SET_INSTANCE_STATUS:
    case SET_MAINTENANCE_MODE:
    case SET_PROXY_LOGGING:
    case SET_SNAPSHOT_REPOSITORY:
    case UPDATE_CURATION_INDEX_PATTERNS:
    case WAIT_FOR_PENDING_CLUSTER:
      if (action.error || !action.payload) {
        return clusters
      }

      const descriptor = createDescriptor(getRegion(action), getClusterId())

      return {
        ...clusters,
        [descriptor]: clusterReducer(clusters[descriptor], action),
      }

    default:
      return clusters
  }

  function getClusterId() {
    const { clusterId } = action.meta as any

    if (clusterId) {
      return clusterId
    }

    // assume Stack deployments API action
    const stackDeploymentsAction = action as FetchDeploymentAction
    return stackDeploymentsAction.payload!.resources.elasticsearch[0].id
  }
}

function getRegion(action: Action) {
  const { regionId } = action.meta

  if (regionId) {
    return regionId
  }

  // assume Stack deployments API action
  const stackDeploymentsAction = action as FetchDeploymentAction
  return getRegionId({ deployment: stackDeploymentsAction.payload! })!
}

export function getCluster(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
): ElasticsearchCluster | null {
  return state[createDescriptor(regionId, clusterId)]
}

export function getDeletedClusters(state: State): string[] {
  const clusters = values(state)
  const deletedClusters = clusters.filter(
    (cluster) => cluster && cluster.wasDeleted === true,
  ) as ElasticsearchCluster[]
  const deletedClusterIds = deletedClusters.map((cluster) => cluster.id)

  return deletedClusterIds
}

/**
 * Selector that extracts the current metadata version from the cluster state
 * @param {Object} cluster the cluster to interrogate
 */
export function getClusterMetadataVersion(cluster: ElasticsearchCluster): number {
  return get(cluster, [`_raw`, `data`, `version`])
}

/**
 * Selector that extracts the current raw metadata from the cluster state.
 * @param {Object} cluster the cluster to interrogate
 */
export function getClusterMetadata(cluster: ElasticsearchCluster): any {
  return get(cluster, [`_raw`, `data`, `raw`])!
}

/**
 * Fetches the version number from the supplied cluster
 *
 * @param {Object} cluster the cluster to interrogate
 * @return {Number} the version number
 */
export function getVersion(cluster: { plan: ElasticsearchClusterPlan | null }): VersionNumber {
  return get(cluster, [`plan`, `elasticsearch`, `version`])
}

export function getName(cluster: ElasticsearchCluster) {
  return get(cluster, otherPaths.name, ``)
}

export function getSelfUrl(regionId: string, id: string): string {
  return `/api/v1/regions/${regionId}/clusters/elasticsearch/${id}`
}
