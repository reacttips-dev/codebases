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

import { find } from 'lodash'

import {
  getDedicatedMasterThresholdFromTemplate,
  getNodeRoles,
  isDedicatedMaster,
} from './selectors'
import { setNodeRoleInPlace } from './nodeRoles'

import { getNumberOfAvailableZones } from '../deployments/availabilityZones'
import { isEnabledConfiguration } from '../deployments/conversion'

import { Region } from '../../types'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  ElasticsearchClusterPlan,
  ElasticsearchPayload,
  InstanceConfiguration,
} from '../api/v1/types'

type UpdateDedicatedMastersTopologyBasedOnThresholdParams = {
  availableNumberOfZones: number
  clusterTopology: ElasticsearchClusterTopologyElement[]
  clusterPlanUnderEdit?: ElasticsearchClusterPlan | null
  dedicatedMastersThreshold: number
  instanceConfigurations: InstanceConfiguration[]
}

export function ensureDedicatedMasterAwareTopology({
  region,
  cluster,
  clusterPlanUnderEdit,
  deploymentTemplate,
  instanceConfigurations,
  onlySized = true,
}: {
  region: Region
  cluster: ElasticsearchPayload
  clusterPlanUnderEdit?: ElasticsearchClusterPlan | null
  deploymentTemplate?: DeploymentTemplateInfoV2
  instanceConfigurations: InstanceConfiguration[]
  onlySized?: boolean
}): ElasticsearchClusterTopologyElement[] {
  const nodeConfigurations = cluster.plan.cluster_topology

  // In create flows we look at the template, afterwards we look exclusively at the cluster
  const dedicatedMastersThreshold = getDedicatedMasterThresholdFromTemplate({
    deploymentTemplate: deploymentTemplate?.deployment_template,
  })

  return _ensureDedicatedMasterAwareTopology({
    clusterPlanUnderEdit,
    dedicatedMastersThreshold,
    instanceConfigurations,
    nodeConfigurations,
    onlySized,
    region,
  })
}

function _ensureDedicatedMasterAwareTopology({
  region,
  clusterPlanUnderEdit,
  instanceConfigurations,
  nodeConfigurations,
  dedicatedMastersThreshold = 0,
  onlySized = true,
}: {
  region: Region
  clusterPlanUnderEdit?: ElasticsearchClusterPlan | null
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: ElasticsearchClusterTopologyElement[]
  dedicatedMastersThreshold?: number
  onlySized?: boolean
}): ElasticsearchClusterTopologyElement[] {
  // We should always flip check; even when no dedicated master configuration is present
  const flipChecked = flipCheck(getThresholdAwareTopology(nodeConfigurations))

  if (onlySized) {
    return flipChecked.filter(isEnabledConfiguration)
  }

  return flipChecked

  function getThresholdAwareTopology(nodeConfigurations) {
    const masterNodeConfiguration = nodeConfigurations.find((topologyElement) =>
      isDedicatedMaster({ topologyElement }),
    )

    // If we don't have a dedicated master configuration, there's nothing to update
    if (!masterNodeConfiguration) {
      return nodeConfigurations
    }

    // Check whether we need to update the dedicated masters configuration based on a threshold
    if (dedicatedMastersThreshold === 0) {
      return nodeConfigurations
    }

    // Update topology based on dedicated masters threshold
    const thresholdAwareTopology = updateDedicatedMastersTopologyBasedOnThreshold({
      availableNumberOfZones: getNumberOfAvailableZones(region),
      clusterPlanUnderEdit,
      clusterTopology: nodeConfigurations,
      dedicatedMastersThreshold,
      instanceConfigurations,
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
  availableNumberOfZones = 1,
  clusterTopology,
  clusterPlanUnderEdit,
  dedicatedMastersThreshold = 0,
  instanceConfigurations = [],
}: UpdateDedicatedMastersTopologyBasedOnThresholdParams): ElasticsearchClusterTopologyElement[] {
  if (dedicatedMastersThreshold === 0) {
    return clusterTopology
  }

  const alreadyHadDedicatedMastersBelowThreshold = hadDedicatedMastersBelowThreshold({
    clusterPlanUnderEdit,
    dedicatedMastersThreshold,
    instanceConfigurations,
  })

  // if dedicated masters exist below the threshold, assume they were manually added and should stay
  if (alreadyHadDedicatedMastersBelowThreshold) {
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
      return false // sanity because flow
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

    if (getNodeRoles({ topologyElement }).length > 0) {
      setNodeRoleInPlace({ topologyElement, role: `master`, value: masterEligibleEnabled })
    }
  })

  return nodeConfigurations
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

      const { autoscaling_min, size, node_count_per_zone, zone_count = 1 } = nodeConfiguration

      if (!isEnabledConfiguration(nodeConfiguration)) {
        return 0
      }

      if (node_count_per_zone) {
        return node_count_per_zone * zone_count
      }

      const instanceSize = size?.value || autoscaling_min?.value || 0

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

/*
 * Returns whether the provided cluster has dedicated masters while being below
 * the threshold for them. While not an "expected" state this can happen if they
 * have been manually added. In this case we want to leave them alone. We have
 * no formal way to distinguish auto-added masters (via reaching the threshold)
 * from manually-added ones, so simply preserving dedicated masters when below
 * the threshold is as good as we can manage.
 */
function hadDedicatedMastersBelowThreshold({
  clusterPlanUnderEdit,
  dedicatedMastersThreshold,
  instanceConfigurations,
}: {
  clusterPlanUnderEdit?: ElasticsearchClusterPlan | null
  dedicatedMastersThreshold: number
  instanceConfigurations: InstanceConfiguration[]
}): boolean {
  if (!clusterPlanUnderEdit) {
    return false
  }

  const nodeConfigurations = clusterPlanUnderEdit.cluster_topology

  if (!nodeConfigurations) {
    return false
  }

  const dedicatedMastersTopology = find(nodeConfigurations, (topologyElement) =>
    isDedicatedMaster({ topologyElement }),
  )

  // no dedicated masters found in the existing cluster
  if (!dedicatedMastersTopology) {
    return false
  }

  const totalNumberOfDataNodes = getNonMasterNodesTotal(nodeConfigurations, instanceConfigurations)
  const isEnabled = isEnabledConfiguration(dedicatedMastersTopology)

  /* had dedicated masters below threshold if:
   * - enabled dedicated masters found
   * - amount of data nodes is below the auto-dedicated-masters threshold
   */
  return isEnabled && totalNumberOfDataNodes < dedicatedMastersThreshold
}
