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

import { get, set, find, minBy, pick, intersection } from 'lodash'

import { ensureDedicatedMasterAwareTopology } from './dedicatedMasters'
import { ensureDedicatedCoordinatingAwareTopology } from './dedicatedCoordinatingNodes'
import { ensureIngestPluginAwareTopology } from './ingestPlugins'

import {
  getRegionIdForCreate,
  getDeploymentNodeConfigurations,
  getEsPlan,
  getFirstEsCluster,
} from './selectors'

import { isPreDntPlan } from '../deployments/deployment'
import { getNumberOfAvailableZones } from '../deployments/availabilityZones'
import {
  getSupportedSliderInstanceTypes,
  getSupportedSliderInstanceTypesWithoutEs,
} from '../sliders'

import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
  InstanceConfiguration,
  StackVersionConfig,
} from '../api/v1/types'

import { Region, AnyPayload, AnyNonEsPayload } from '../../types'

type PlanMightHaveGlobalZoneCount = {
  zone_count?: number
}

type AnyNonEsPlanTransientConfiguration = NonNullable<
  NonNullable<AnyNonEsPayload['plan']['transient']>
>
type AnyNonEsPlanTransientPlanConfiguration = NonNullable<
  AnyNonEsPlanTransientConfiguration['plan_configuration']
>
type AnyNonEsPlanTransientConfigurationKeys = keyof AnyNonEsPlanTransientConfiguration
type AnyNonEsPlanTransientPlanConfigurationKeys = keyof AnyNonEsPlanTransientPlanConfiguration

const sharedSliderTransientSettings: AnyNonEsPlanTransientConfigurationKeys[] = [
  'strategy',
  'plan_configuration',
]

const sharedSliderTransientPlanConfigurationSettings: AnyNonEsPlanTransientPlanConfigurationKeys[] =
  [
    'timeout',
    'calm_wait_time',
    'move_instances',
    'move_allocators',
    'reallocate_instances',
    'preferred_allocators',
    'extended_maintenance',
    'cluster_reboot',
  ]

export function setDeploymentToSmallestSizeInTemplate({
  deployment,
  instanceConfigurations,
}: {
  deployment: DeploymentCreateRequest
  instanceConfigurations: InstanceConfiguration[]
}) {
  const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })

  nodeConfigurations.forEach((nodeConfiguration) => {
    nodeConfiguration.zone_count = 1

    if (nodeConfiguration.size == null) {
      return
    }

    if (nodeConfiguration.size.value === 0) {
      return
    }

    const { instance_configuration_id } = nodeConfiguration
    const instanceConfiguration = find(instanceConfigurations, {
      id: instance_configuration_id,
    })

    if (instanceConfiguration == null) {
      return // sanity, shouldn't ever happen
    }

    const { resource, sizes } = instanceConfiguration.discrete_sizes

    if (sizes.length === 0) {
      return // sanity, shouldn't ever happen because it's absurd
    }

    const value = minBy(sizes)!

    nodeConfiguration.size = {
      resource,
      value,
    }
  })
}

export function ensureSatisfiesRegionConstraints({
  region,
  deployment,
}: {
  region: Region
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}) {
  if (!deployment.resources) {
    return
  }

  const availableZoneCount = getNumberOfAvailableZones(region)
  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = Object.keys(deployment.resources)
  const supportedResourceTypes = intersection(resourceTypes, sliderInstanceTypes)

  for (const resourceType of supportedResourceTypes) {
    const resources: AnyPayload[] = deployment.resources[resourceType]

    for (const resource of resources) {
      if (!Array.isArray(resource.plan.cluster_topology)) {
        continue
      }

      for (const nodeConfiguration of resource.plan.cluster_topology) {
        if (nodeConfiguration.zone_count && nodeConfiguration.zone_count > availableZoneCount) {
          nodeConfiguration.zone_count = availableZoneCount
        }
      }
    }
  }
}

export function ensureSatisfiesDeploymentConstraints({
  region,
  deployment,
  deploymentTemplate,
  instanceConfigurations,
  stackVersions,
}: {
  region: Region
  deployment: DeploymentCreateRequest
  deploymentTemplate: DeploymentTemplateInfoV2
  instanceConfigurations: InstanceConfiguration[]
  stackVersions: StackVersionConfig[]
}) {
  if (!deployment.resources) {
    return
  }

  const esClusters = deployment.resources.elasticsearch

  if (!Array.isArray(esClusters)) {
    return
  }

  for (const esCluster of esClusters) {
    ensureDedicatedCoordinatingAwareTopology({
      esCluster,
      deploymentTemplate,
    })

    ensureDedicatedMasterAwareTopology({
      region,
      deploymentTemplate,
      cluster: esCluster,
      instanceConfigurations,
      onlySized: false,
    })

    ensureIngestPluginAwareTopology({
      cluster: esCluster,
      instanceConfigurations,
      stackVersions,
    })
  }
}

/* Pre-DNT plans relied on a global `plan.zone_count` field, whereas nowadays
 * we prefer to set `zone_count` individually in topology elements.
 * For every topology element in `plan.cluster_topology` without an explicit `zone_count`,
 * we assign the global `zone_count` to it. Then we remove the global value to reduce confusion.
 * If a plan is pre-DNT, however, we can't get rid of the global `zone_count`.
 * (unless we upgrade the plan to DNT, which is out of scope here)
 */
export function moveZoneCountInsideTopologyElements({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}) {
  if (!deployment.resources) {
    return
  }

  /* We want to normalize `zone_count` to be inside `cluster_topology` elements
   * For pre-DNT plans, however, we can't, because back then `zone_count` was
   * only read when it was outside topology elements.
   * Without this check, the API would 400 for pre-DNT plan editing.
   */
  const esPlan = getEsPlan({ deployment })
  const canRemoveGlobalZoneCount = !esPlan || !isPreDntPlan(esPlan)

  if (!canRemoveGlobalZoneCount) {
    return
  }

  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = Object.keys(deployment.resources)
  const supportedResourceTypes = intersection(resourceTypes, sliderInstanceTypes)

  for (const resourceType of supportedResourceTypes) {
    const resources: AnyPayload[] = deployment.resources[resourceType]

    for (const resource of resources) {
      const resourcePlan = resource.plan as PlanMightHaveGlobalZoneCount
      const globalZoneCount = resourcePlan.zone_count

      if (typeof globalZoneCount !== `number`) {
        continue
      }

      // We can't be sure this isn't a pre-DNT Kibana — fml
      if (resourceType !== `kibana`) {
        delete resourcePlan.zone_count
      }

      if (!Array.isArray(resource.plan.cluster_topology)) {
        continue
      }

      for (const nodeConfiguration of resource.plan.cluster_topology) {
        if (typeof nodeConfiguration.zone_count !== `number`) {
          nodeConfiguration.zone_count = globalZoneCount
        }
      }
    }
  }
}

export function preservePrevCreateFormState({
  deployment,
  prevState,
}: {
  deployment: DeploymentCreateRequest
  prevState: DeploymentCreateRequest
}) {
  const esCluster = getFirstEsCluster({ deployment })
  const esPlan = getEsPlan({ deployment })
  const prevEsCluster = getFirstEsCluster({ deployment: prevState })
  const prevEsPlan = getEsPlan({ deployment: prevState })
  const prevMonitoringSettings = get(prevEsCluster, [`settings`, `monitoring`])
  const prevSnapshotSettings = get(prevEsCluster, [`settings`, `snapshot`])
  const prevSnapshotTransientSettings = get(prevEsPlan, [`transient`, `restore_snapshot`])
  const prevDeploymentSettings = prevState.settings
  const prevEsUserSettings = prevEsPlan?.cluster_topology.map(
    (topology) => topology.elasticsearch?.user_settings_yaml,
  )[0]

  if (esCluster && prevMonitoringSettings) {
    set(esCluster, [`settings`, `monitoring`], prevMonitoringSettings)
  }

  if (esCluster && prevSnapshotSettings) {
    set(esCluster, [`settings`, `snapshot`], prevSnapshotSettings)
  }

  if (esPlan && prevSnapshotTransientSettings) {
    set(esPlan, [`transient`, `restore_snapshot`], prevSnapshotTransientSettings)
  }

  if (esPlan && prevEsUserSettings) {
    for (const topology of esPlan.cluster_topology) {
      set(topology, [`elasticsearch`, `user_settings_yaml`], prevEsUserSettings)
    }
  }

  if (prevDeploymentSettings && prevDeploymentSettings.traffic_filter_settings) {
    if (getRegionIdForCreate({ deployment }) === getRegionIdForCreate({ deployment: prevState })) {
      set(
        deployment,
        [`settings`, `traffic_filter_settings`],
        prevDeploymentSettings.traffic_filter_settings,
      )
    }
  }
}

/*
 * `createUpdateRequestFromGetResponse` might result in copying `transient` settings that are meant to
 * configure Elasticsearch resources into other kinds of resources, like Kibana, or Enterprise Search.
 * This sanitization step ensures non-ES sliders only have transient settings that are valid when configuring them.
 */
export function sanitizeTransientResourceConfiguration({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): DeploymentCreateRequest | DeploymentUpdateRequest {
  if (!deployment.resources) {
    return deployment
  }

  for (const sliderInstanceType of getSupportedSliderInstanceTypesWithoutEs()) {
    const resources: AnyNonEsPayload[] = deployment.resources[sliderInstanceType]

    if (!Array.isArray(resources)) {
      // might not have resources of this kind
      continue
    }

    for (const resource of resources) {
      if (!resource.plan) {
        // might not have an update plan
        continue
      }

      if (!resource.plan.transient) {
        // might not have transient settings
        continue
      }

      resource.plan.transient = pick(resource.plan.transient, sharedSliderTransientSettings)

      if (!resource.plan.transient.plan_configuration) {
        // might not have transient plan configuration
        continue
      }

      resource.plan.transient.plan_configuration = pick(
        resource.plan.transient.plan_configuration,
        sharedSliderTransientPlanConfigurationSettings,
      )
    }
  }

  return deployment
}
