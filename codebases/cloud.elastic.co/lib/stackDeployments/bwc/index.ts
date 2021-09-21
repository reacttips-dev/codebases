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

import { sumBy, unionBy, groupBy, map } from 'lodash'

import { getFirstEsClusterFromGet } from '../selectors'

import { InstanceConfigurationAggregates } from '../../../types'

import {
  ElasticsearchClusterInfo,
  ClusterInstanceInfo,
  DeploymentSearchResponse,
} from '../../../lib/api/v1/types'

export function getBwcInstanceConfigurationAggs({
  deployment,
}: {
  deployment: DeploymentSearchResponse
}): InstanceConfigurationAggregates[] {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    return []
  }

  return mapInstanceConfigurations(esCluster.info.topology.instances)
}

export function mapInstanceConfigurations(
  instances: ClusterInstanceInfo[],
): InstanceConfigurationAggregates[] {
  if (instances.length > 0 && instances[0].instance_configuration == null) {
    // This is for pre-dnt legacy clusters that for some reason weren't re-indexed by the API
    // We only care about the first instance because either the every topology element (instance) has instance_configuration defined
    // or none of them do.
    const memorySum = sumBy(instances, (instance) =>
      instance.memory != null ? instance.memory.instance_capacity : 0,
    )
    const diskSum = sumBy(instances, (instance) =>
      instance.disk != null && instance.disk.disk_space_available
        ? instance.disk.disk_space_available
        : 0,
    )
    const zoneCount = unionBy(instances, `zone`).length
    return [
      {
        maintModeInstances: {
          nodeCount: 0,
        },
        unHealthyInstances: {
          nodeCount: 0,
        },
        memorySum,
        zoneCount,
        diskSum,
        nodeCount: instances.length,
        instanceConfig: {
          id: `data.default`,
          name: `data.default`,
          resource: `memory`,
        },
      },
    ]
  }

  // ignore ZK issues so that we don't blow things up!
  const configuredInstances = instances.filter((instance) => instance.instance_configuration)

  const instanceConfigs = groupBy(configuredInstances, `instance_configuration.id`)

  const mappedInstanceConfigs = map(
    instanceConfigs,
    (instanceConfigInstances: ClusterInstanceInfo[]): InstanceConfigurationAggregates => {
      const memorySum = sumBy(instanceConfigInstances, (instance) =>
        instance.memory != null ? instance.memory.instance_capacity : 0,
      )
      const diskSum = sumBy(instanceConfigInstances, (instance) =>
        instance.disk != null && instance.disk.disk_space_available
          ? instance.disk.disk_space_available
          : 0,
      )
      const zoneCount = unionBy(instanceConfigInstances, `zone`).length

      return {
        maintModeInstances: {
          nodeCount: instanceConfigInstances.filter((instance) => instance.maintenance_mode).length,
        },
        unHealthyInstances: {
          nodeCount: instanceConfigInstances.filter((instance) => !instance.healthy).length,
        },
        memorySum,
        diskSum,
        zoneCount,
        nodeCount: instanceConfigInstances.length,
        instanceConfig: instanceConfigInstances[0].instance_configuration!,
      }
    },
  )

  return mappedInstanceConfigs
}

// because CCS for example needs to pull the deployment template ID, this might die or improve with Deployment Templates API
export function getEsDeploymentTemplateId({
  resource,
}: {
  resource: {
    info: ElasticsearchClusterInfo
  }
}): string | undefined {
  return (
    (resource.info.plan_info.current &&
      resource.info.plan_info.current.plan &&
      resource.info.plan_info.current.plan.deployment_template &&
      resource.info.plan_info.current.plan.deployment_template.id) ||
    undefined
  )
}
