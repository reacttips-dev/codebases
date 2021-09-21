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

import { Allocator, AllocatorHrefs, AllocatorInstance, RegionId } from '../../types'

import {
  AllocatedInstanceStatus,
  AllocatorHealthStatus,
  AllocatorInfo,
} from '../../lib/api/v1/types'

function getClusterDisplayName(clusterId: string, clusterName: string = ''): string {
  const shortId = clusterId.substring(0, 6)
  const nameIncludesId = clusterName.substring(0, 6) === shortId

  if (nameIncludesId) {
    return clusterName
  }

  if (clusterName) {
    return `${clusterName} (${shortId})`
  }

  return clusterId
}

const createInstance = (
  instance: AllocatedInstanceStatus,
  allocatorId: string,
): AllocatorInstance => {
  const {
    cluster_healthy = false,
    cluster_id,
    cluster_name,
    deployment_id,
    healthy = false,
    instance_configuration_id,
    instance_name,
    moving,
    plans_info,
  } = instance

  return {
    id: `${cluster_id}-${instance_name}`,
    clusterId: cluster_id,
    clusterDisplayName: getClusterDisplayName(cluster_id, cluster_name),
    clusterHealthy: cluster_healthy,
    healthy,
    instanceName: instance_name,
    capacity: instance.node_memory,
    kind: instance.cluster_type,
    availabilityZones: get(plans_info, ['zone_count']) || 1,
    version: get(plans_info, ['version']) || '',
    plan: {
      isPending: get(plans_info, ['pending']) || false,
      allocatorBeingVacated: moving ? allocatorId : undefined,
    },
    instanceConfigurationId: instance_configuration_id,
    stackDeploymentId: deployment_id,
    status: instance,
  }
}

function isHealthy(
  status: AllocatorHealthStatus,
  instances: AllocatedInstanceStatus[] = [],
): boolean {
  if (!status.connected && instances.length > 0) {
    return false
  }

  return status.healthy
}

function createHrefs(selfUrl: string): AllocatorHrefs {
  const vacateAllocator = `${selfUrl}/vacate`
  const deleteAllocator = `${selfUrl}?remove_containers_and_roles={removeInstances}`
  const updateAllocator = `${selfUrl}/_update`

  return {
    'vacate-allocator': vacateAllocator,
    'delete-allocator': deleteAllocator,
    'update-allocator': updateAllocator,
  }
}

export default function createAllocator(
  regionId: RegionId,
  id: string,
  selfUrl: string,
  doc: AllocatorInfo,
): Allocator {
  const defaultStatus = { connected: false, healthy: false, maintenance_mode: false }
  const {
    allocator_id,
    build_info,
    capacity: { memory },
    metadata,
    features,
    host_ip,
    instances,
    public_hostname,
    status = defaultStatus,
    zone_id,
    external_links: externalLinks,
  } = doc

  return {
    id,
    regionId,
    availabilityZone: zone_id,
    healthy: isHealthy(status, instances),
    connected: status.connected,
    capacity: memory,
    instances: instances.map((instance) => createInstance(instance, allocator_id)),

    // TODO: move this up out of the attributes object
    attributes: {
      allocator_id,
      features,
      public_hostname,
      host_ip,
      zone_id,
    },
    build: build_info,

    // TODO: Once search is converted to the v1 API, we can consolidate
    // tags/metadata into a single prop for usages downstream.
    metadata,
    tags: metadata,
    isInMaintenanceMode: status.maintenance_mode,
    hrefs: createHrefs(selfUrl),
    externalLinks: externalLinks || [],
  }
}
