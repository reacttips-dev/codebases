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

import { find, flatMap, get, set } from 'lodash'
import { getNumberOfAvailableZones } from './availabilityZones'
import { isEnabledConfiguration } from './conversion'

import { setNodeRoleInPlace } from '../stackDeployments/nodeRoles'
import { isDedicatedIngest, isDedicatedMaster } from '../stackDeployments/selectors'

import {
  CreateElasticsearchClusterRequest,
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  KibanaClusterTopologyElement,
} from '../api/v1/types'

import { Region, ElasticsearchCluster, AnyPlan } from '../../types'

type UpdateDedicatedMastersTopologyBasedOnThresholdParams = {
  dedicatedMastersThreshold: number
  clusterTopology: ElasticsearchClusterTopologyElement[]
  instanceConfigurations: InstanceConfiguration[]
  availableNumberOfZones: number
  currentCluster?: ElasticsearchCluster
}

export function isTopologySized(
  topology: ElasticsearchClusterTopologyElement[] | KibanaClusterTopologyElement[],
) {
  for (const nodeConfiguration of topology) {
    const flexSize = get(nodeConfiguration, [`size`, `value`], 0) > 0

    if (flexSize) {
      return true
    }

    const instanceCount = get(nodeConfiguration, [`node_count_per_zone`], 0) as number
    const instanceCapacity = get(nodeConfiguration, [`memory_per_node`], 0) as number
    const exactSize = instanceCount > 0 && instanceCapacity > 0

    if (exactSize) {
      return true
    }
  }

  return false
}

/**
 * Update the dedicated master configuration in the supplied topology, depending on
 * whether dedicated masters are already active, what is the enable threshold number,
 * and how many nodes are in the topology. If there are fewer nodes than
 * the threshold, dedicated masters are disabled.
 *
 * @param {number} dedicatedMastersThreshold - the node threshold at which dedicated masters are enabled
 * @param {ElasticsearchClusterTopologyElement[]} clusterTopology - a deployment's Elasticsearch topology
 * @param {InstanceConfiguration[]} instanceConfigurations - the instance configurations for this deployment
 * @param {number} availableNumberOfZones - the number of availability zones in the region
 */
function updateDedicatedMastersTopologyBasedOnThreshold({
  dedicatedMastersThreshold = 0,
  clusterTopology,
  instanceConfigurations = [],
  availableNumberOfZones = 1,
  currentCluster,
}: UpdateDedicatedMastersTopologyBasedOnThresholdParams): ElasticsearchClusterTopologyElement[] {
  if (dedicatedMastersThreshold === 0) {
    return clusterTopology
  }

  const alreadyHasDedicatedMastersBelowThreshold = hasDedicatedMastersBelowThreshold(
    currentCluster,
    {
      dedicatedMastersThreshold,
      instanceConfigurations,
    },
  )

  if (alreadyHasDedicatedMastersBelowThreshold) {
    // if dedicated masters exist below the threshold, assume they were manually added and should stay
    return clusterTopology
  }

  const dedicatedMastersTopologyIndex = clusterTopology.findIndex((topologyElement) =>
    isDedicatedMaster({ topologyElement }),
  )

  if (dedicatedMastersTopologyIndex < 0) {
    return clusterTopology
  }

  const updatedTopology = clusterTopology.slice()

  const dedicatedMastersTopology = updatedTopology[dedicatedMastersTopologyIndex]

  updatedTopology[dedicatedMastersTopologyIndex] = dedicatedMastersTopology

  const totalNumberOfDataNodes = getNonMasterNodesTotal(clusterTopology, instanceConfigurations)

  const isDisabled = !isEnabledConfiguration(dedicatedMastersTopology)

  const shouldHaveDedicatedMasters = totalNumberOfDataNodes >= dedicatedMastersThreshold

  if (shouldHaveDedicatedMasters) {
    if (!isDisabled) {
      // Don't need to enable dedicated masters, so return the original topology
      return clusterTopology
    }

    const dedicatedMastersInstanceConfig = instanceConfigurations.find(
      (ic) => ic.id === dedicatedMastersTopology.instance_configuration_id,
    )

    if (dedicatedMastersInstanceConfig == null) {
      return clusterTopology // sanity
    }

    const { default_size, resource } = dedicatedMastersInstanceConfig.discrete_sizes
    dedicatedMastersTopology.size = { value: default_size, resource }
    dedicatedMastersTopology.zone_count = availableNumberOfZones
  } else {
    if (isDisabled) {
      // Don't need to disable dedicated masters, so return the original topology
      return clusterTopology
    }

    if (dedicatedMastersTopology.size) {
      dedicatedMastersTopology.size.value = 0
    }
  }

  return updatedTopology
}

/* If dedicated master is disabled, we need to reinstate `master` for any
   configurations that may have lost it during the last Create/Edit. Similarly,
   if dedicated master is enabled, we need to remove `master` from any other
   nodes.
*/
function flipMasterEligibleDependingOnDedicatedMasters({
  instanceConfigurations,
  nodeConfigurations,
}: {
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: ElasticsearchClusterTopologyElement[]
}) {
  const dedicatedMasterIndex = nodeConfigurations.findIndex((topologyElement) =>
    isDedicatedMaster({ topologyElement }),
  )
  const masterNodeConfiguration = nodeConfigurations[dedicatedMasterIndex]

  const hasDedicatedMaster = Boolean(
    masterNodeConfiguration &&
      masterNodeConfiguration.size &&
      masterNodeConfiguration.size.value > 0,
  )

  const eligibleConfigurations = nodeConfigurations.filter((nodeConfiguration, index) => {
    if (index === dedicatedMasterIndex) {
      return false
    }

    if (!isEnabledConfiguration(nodeConfiguration)) {
      return false
    }

    const { instance_configuration_id } = nodeConfiguration

    const instanceConfiguration = find(instanceConfigurations, {
      id: instance_configuration_id,
    })

    if (instanceConfiguration == null) {
      return false // sanity
    }

    const { instance_type, node_types = [] } = instanceConfiguration

    if (instance_type !== `elasticsearch`) {
      return false
    }

    const isMasterEligible = (node_types || []).includes(`master`)

    return isMasterEligible
  })

  eligibleConfigurations.forEach((topologyElement, index) => {
    /*
     * We always want to disable all master eligible
     * configurations except for (maybe) the first one.
     *
     * [2] When we have dedicated master, we want to
     *     turn off master eligible.
     *
     * [3] When dedicated master is turned off, we want to
     *     turn on a single master eligible.
     */
    const isFirstMasterEligible = index === 0
    const masterEligibleEnabled = hasDedicatedMaster
      ? false // [2]
      : isFirstMasterEligible // [3]

    setNodeRoleInPlace({ topologyElement, role: `master`, value: masterEligibleEnabled })
  })

  return nodeConfigurations
}

/* When a template has included dedicated masters, we need to check whether
   the distro configuration actually carries enough data nodes to warrant
   dedicated masters, per the threshold set forth by the template.
   If it does not, we disable dedicated master nodes by default. The user
   can edit the deployment, adding more data nodes, in which case downstream
   components would take care of re-enabling/re-disabling dedicated masters
   as needed.
*/
export function getDedicatedMasterAwareTopology({
  region,
  cluster,
  instanceConfigurations,
  currentCluster,
}: {
  region: Region
  cluster: CreateElasticsearchClusterRequest
  instanceConfigurations: InstanceConfiguration[]
  currentCluster?: ElasticsearchCluster
}) {
  const topologyPath = [`plan`, `cluster_topology`]
  const topology = get(cluster, topologyPath, []) as ElasticsearchClusterTopologyElement[]

  // We should always flip check; even when no dedicated master configuration is present
  return flipCheck(getThresholdAwareTopology(topology))

  function getThresholdAwareTopology(nodeConfigurations) {
    const masterNodeConfiguration = topology.find((topologyElement) =>
      isDedicatedMaster({ topologyElement }),
    )

    // If we don't have a dedicated master configuration, there's nothing to update
    if (!masterNodeConfiguration) {
      return nodeConfigurations
    }

    const thresholdPath = [`settings`, `dedicated_masters_threshold`]

    // Check whether we need to update the dedicated masters configuration based on a threshold
    const dedicatedMastersThreshold = get(cluster, thresholdPath, 0)

    if (dedicatedMastersThreshold === 0) {
      return nodeConfigurations
    }

    // Update topology based on dedicated masters threshold
    const thresholdAwareTopology = updateDedicatedMastersTopologyBasedOnThreshold({
      dedicatedMastersThreshold,
      clusterTopology: nodeConfigurations,
      instanceConfigurations,
      availableNumberOfZones: getNumberOfAvailableZones(region),
      currentCluster,
    })

    return thresholdAwareTopology
  }

  // Always flip master-elegibility on data nodes based on dedicated masters
  function flipCheck(nodeConfigurations) {
    const dedicatedMasterAwareTopology = flipMasterEligibleDependingOnDedicatedMasters({
      instanceConfigurations,
      nodeConfigurations,
    })

    return dedicatedMasterAwareTopology
  }
}

/**
 * Work out how many nodes are present in the deployment. Where a node's size is greater
 * than the maximum instance configuration size, they size is divided by the maximum to
 * yield the number of nodes requried to provide the total size. The final node count is
 * multiplied by the zone count.
 *
 * @param {ElasticsearchClusterTopologyElement[]} topology - the Elasticsearch topology elements
 * @param {InstanceConfiguration[]} instanceConfigurations - the configurations for the deployment
 */
export function getNonMasterNodesTotal(
  topology: ElasticsearchClusterTopologyElement[],
  instanceConfigurations: InstanceConfiguration[],
) {
  return topology
    .map((nodeConfiguration) => {
      // Don't include dedicated masters in the count
      if (isDedicatedMaster({ topologyElement: nodeConfiguration })) {
        return 0
      }

      const { size, node_count_per_zone, zone_count = 1 } = nodeConfiguration

      if (!isEnabledConfiguration(nodeConfiguration)) {
        return 0
      }

      if (node_count_per_zone) {
        return node_count_per_zone * zone_count
      }

      const instanceSize = size!.value

      const instanceConfig = instanceConfigurations.find(
        (each) => each.id === nodeConfiguration.instance_configuration_id,
      )

      if (!instanceConfig) {
        return 0
      }

      const maxInstanceSize = Math.max(...instanceConfig.discrete_sizes.sizes)

      if (instanceSize <= maxInstanceSize) {
        return zone_count
      }

      const nodeCountPerZone = Math.ceil(instanceSize / maxInstanceSize)

      return nodeCountPerZone * zone_count
    })
    .reduce((result, next) => result + next, 0)
}

export function isPreDntPlan(plan: AnyPlan): boolean {
  const cluster_topology = plan.cluster_topology || []

  return cluster_topology.some((t) => t.node_configuration != null || t.allocator_filter != null)
}

export function getDeploymentNodeConfigurations({ deployment }) {
  if (deployment == null || deployment.plans == null) {
    return []
  }

  // I am sorry, but typing this properly is too hard right now.
  const plans: any = [
    deployment.plans.apm,
    deployment.plans.elasticsearch,
    deployment.plans.kibana,
  ].filter((each) => each != null)

  return flatMap(plans, (plan) => getNodeConfigurationsForPlan(plan.plan))

  function getNodeConfigurationsForPlan(plan) {
    // DNT-FIXME: Kibana topology elements have `zone_count` at the plan level
    if (typeof plan.zone_count === `number`) {
      plan.cluster_topology.forEach((nodeConfiguration) => {
        if (typeof nodeConfiguration.zone_count !== `number`) {
          nodeConfiguration.zone_count = nodeConfiguration.size ? plan.zone_count : 0
        }
      })
    }

    // DNT-FIXME: after removing the special handling above, we'll still need a way to tell the architecture summary to ignore a node configuration that's not Enabled (rather than rely on the default discrete size because it's missing).

    return plan.cluster_topology
  }
}

/*
 * Returns whether the provided cluster has dedicated masters while being below
 * the threshold for them. While not an "expected" state this can happen if they
 * have been manually added. In this case we want to leave them alone. We have
 * no formal way to distinguish auto-added masters (via reaching the threshold)
 * from manually-added ones, so simply preserving dedicated masters when below
 * the threshold is as good as we can manage.
 */
function hasDedicatedMastersBelowThreshold(
  cluster: ElasticsearchCluster | undefined,
  {
    dedicatedMastersThreshold,
    instanceConfigurations,
  }: {
    dedicatedMastersThreshold: number
    instanceConfigurations: InstanceConfiguration[]
  },
) {
  if (cluster == null) {
    return false
  }

  const plan = cluster._raw.plan

  if (plan == null) {
    return false
  }

  const clusterTopology = plan.cluster_topology

  const dedicatedMastersTopologyIndex = clusterTopology.findIndex((topologyElement) =>
    isDedicatedMaster({ topologyElement }),
  )

  if (dedicatedMastersTopologyIndex < 0) {
    // no dedicated masters found in the topology
    return false
  }

  const updatedTopology = clusterTopology.slice()
  const dedicatedMastersTopology = updatedTopology[dedicatedMastersTopologyIndex]
  updatedTopology[dedicatedMastersTopologyIndex] = dedicatedMastersTopology

  const totalNumberOfDataNodes = getNonMasterNodesTotal(clusterTopology, instanceConfigurations)
  const isEnabled = isEnabledConfiguration(dedicatedMastersTopology)

  // true iif enabled dedicated masters found AND the count of data nodes is
  // below the auto-dedicated-masters threshold
  return isEnabled && totalNumberOfDataNodes < dedicatedMastersThreshold
}

/**
 * Following a plan change, if there is a dedicated ingest node then remove
 * the ingest role from all non-dedicated-ingest nodes.
 */
export function updateIngestNodeTypeInDeployment(cluster: { plan: ElasticsearchClusterPlan }) {
  const clusterTopology = cluster.plan.cluster_topology

  const dedicatedIngestNode = clusterTopology.find((topologyElement) =>
    isDedicatedIngest({ topologyElement }),
  )

  if (dedicatedIngestNode && dedicatedIngestNode.size!.value > 0) {
    for (const topologyElement of clusterTopology) {
      if (topologyElement === dedicatedIngestNode) {
        continue
      }

      setNodeRoleInPlace({ topologyElement, role: `ingest`, value: false })
    }
  }

  set(cluster, [`plan`, `cluster_topology`], clusterTopology)
}
