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

import { cloneDeep, get, intersection, isNil, pickBy, pull, tail } from 'lodash'

import { getInstanceConfigurationById } from '../instanceConfigurations/instanceConfiguration'
import { couldHaveCuration } from '../curation'

import {
  defaultApmUserSettings,
  defaultEsUserSettings,
  defaultKibanaUserSettings,
} from '../deployments/userSettings'

import {
  getNodeRoles,
  areAnyDataConfigurationsMasterEligible,
  getFirstSliderResourceFromTemplate,
  getFirstEsResourceFromTemplate,
  hasNodeType,
} from '../stackDeployments/selectors'

import {
  getSupportedSliderInstanceTypesWithoutEs,
  isSliderInstanceTypeSupportedInPlatform,
} from '../sliders'

import {
  DeploymentTemplateInstanceTemplateConfig,
  EsNodeType,
  InstanceTemplateConfig,
  NodeType,
  SliderInstanceType,
  RegionId,
} from '../../types'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  InstanceTypeResource,
  DeploymentCreateRequest,
  ElasticsearchPayload,
  DeploymentTemplateRequestBody,
} from '../api/v1/types'

type CreateDefaultDeploymentTemplateParams = {
  instanceConfigurations: InstanceConfiguration[]
  instanceTypes: InstanceTypeResource[]
}

export const DEFAULT_DEDICATED_MASTERS_THRESHOLD = 3

export function serializeDeploymentTemplate({
  deploymentTemplateInstanceTemplateConfig,
  instanceConfigurations,
  regionId,
}: {
  deploymentTemplateInstanceTemplateConfig: DeploymentTemplateInstanceTemplateConfig
  instanceConfigurations: InstanceConfiguration[]
  regionId: RegionId
}): DeploymentTemplateRequestBody {
  const {
    name,
    description,
    kibana,
    master,
    ingest,
    data,
    ml,
    apm,
    appsearch,
    enterprise_search,
    indexPatterns,
    hotInstanceConfigurationId,
    warmInstanceConfigurationId,
    snapshotRepositoryId,
    observability,
    plugins,
  } = deploymentTemplateInstanceTemplateConfig

  const esTopologies: ElasticsearchClusterTopologyElement[] = []

  const esResource: ElasticsearchPayload = {
    ref_id: `main-elasticsearch`,
    region: regionId,
    plan: {
      cluster_topology: esTopologies,
      elasticsearch: {},
    },
    settings: {},
  }

  const deploymentTemplate: DeploymentCreateRequest = {
    resources: {
      elasticsearch: [esResource],
    },
    settings: {},
  }

  if (master && master.included) {
    const { zones, id, size, resource, settings, dedicatedMastersThreshold } = master
    const masterTopology: ElasticsearchClusterTopologyElement = {
      zone_count: zones,
      instance_configuration_id: id,
      node_type: {
        master: true,
        ingest: false,
        data: false,
      },
      size: {
        value: size,
        resource,
      },
      elasticsearch: {
        user_settings_yaml: settings || undefined,
        enabled_built_in_plugins: plugins,
      },
    }

    esTopologies.push(masterTopology)

    esResource.settings!.dedicated_masters_threshold = dedicatedMastersThreshold
  }

  if (data) {
    esTopologies.push(
      ...data.map((eachData) => {
        const { zones, id, size, resource, settings, nodeAttributes, node_types } = eachData
        const node_type = {
          ingest: false,
          master: false,
          data: false,
        }

        if (!node_types) {
          const configuration = getInstanceConfigurationById(instanceConfigurations, id)
          const configurationNodeTypes = configuration == null ? [`data`] : configuration.node_types

          const finalNodeTypes = intersection(configurationNodeTypes || [], [
            `data`,
            `ingest`,
            `master`,
          ])

          for (const each of finalNodeTypes) {
            node_type[each] = true
          }
        } else {
          for (const each of node_types) {
            node_type[each] = true
          }
        }

        return {
          zone_count: zones,
          instance_configuration_id: id,
          node_type,
          size: {
            value: size,
            resource,
          },
          elasticsearch: {
            node_attributes: nodeAttributes || {},
            user_settings_yaml: settings || undefined,
            enabled_built_in_plugins: plugins,
          },
        }
      }),
    )
  }

  if (ingest && ingest.included) {
    const { zones, id, size, resource, settings } = ingest
    const ingestTopology: ElasticsearchClusterTopologyElement = {
      zone_count: zones,
      instance_configuration_id: id,
      node_type: {
        ingest: true,
        master: false,
        data: false,
      },
      size: {
        value: size,
        resource,
      },
      elasticsearch: {
        user_settings_yaml: settings || undefined,
        enabled_built_in_plugins: plugins,
      },
    }

    esTopologies.push(ingestTopology)
  }

  if (ml && ml.included) {
    const { zones, id, size, resource, settings } = ml
    const mlTopology: ElasticsearchClusterTopologyElement = {
      zone_count: zones,
      instance_configuration_id: id,
      node_type: {
        ml: true,
        ingest: false,
        master: false,
        data: false,
      },
      size: {
        value: size,
        resource,
      },
      elasticsearch: {
        user_settings_yaml: settings || undefined,
        enabled_built_in_plugins: plugins,
      },
    }

    esTopologies.push(mlTopology)
  }

  esResource.plan.cluster_topology = esTopologies

  deploymentTemplate.resources.elasticsearch = [esResource]

  if (kibana && kibana.included) {
    const { zones, id, size, resource, settings } = kibana
    deploymentTemplate.resources.kibana = [
      {
        ref_id: `main-kibana`,
        elasticsearch_cluster_ref_id: esResource.ref_id,
        region: regionId,
        plan: {
          cluster_topology: [
            {
              zone_count: zones,
              instance_configuration_id: id,
              size: {
                value: size,
                resource,
              },
            },
          ],
          kibana: {
            user_settings_yaml: settings || undefined,
          },
        },
      },
    ]
  }

  if (apm && apm.included) {
    const { zones, id, size, resource, settings } = apm
    deploymentTemplate.resources.apm = [
      {
        ref_id: `main-apm`,
        elasticsearch_cluster_ref_id: esResource.ref_id,
        region: regionId,
        plan: {
          cluster_topology: [
            {
              zone_count: zones,
              instance_configuration_id: id,
              size: {
                value: size,
                resource,
              },
            },
          ],
          apm: {
            user_settings_yaml: settings || undefined,
          },
        },
      },
    ]
  }

  if (appsearch && appsearch.included) {
    const { zones, id, size, resource, settings } = appsearch
    const configuration = getInstanceConfigurationById(instanceConfigurations, id)
    const configurationNodeTypes = (configuration && configuration.node_types) || []
    deploymentTemplate.resources.appsearch = [
      {
        ref_id: `main-appsearch`,
        elasticsearch_cluster_ref_id: esResource.ref_id,
        region: regionId,
        plan: {
          cluster_topology: [
            {
              zone_count: zones,
              instance_configuration_id: id,
              size: {
                value: size,
                resource,
              },
              node_type: {
                appserver: configurationNodeTypes.includes(`appserver`),
                worker: configurationNodeTypes.includes(`worker`),
              },
            },
          ],
          appsearch: {
            user_settings_yaml: settings || undefined,
          },
        },
      },
    ]
  }

  if (enterprise_search && enterprise_search.included) {
    const { zones, id, size, resource, settings } = enterprise_search
    const configuration = getInstanceConfigurationById(instanceConfigurations, id)
    const configurationNodeTypes = (configuration && configuration.node_types) || []
    deploymentTemplate.resources.enterprise_search = [
      {
        ref_id: `main-enterprise_search`,
        elasticsearch_cluster_ref_id: esResource.ref_id,
        region: regionId,
        plan: {
          cluster_topology: [
            {
              zone_count: zones,
              instance_configuration_id: id,
              size: {
                value: size,
                resource,
              },
              node_type: {
                appserver: configurationNodeTypes.includes(`appserver`),
                connector: configurationNodeTypes.includes(`connector`),
                worker: configurationNodeTypes.includes(`worker`),
              },
            },
          ],
          enterprise_search: {
            user_settings_yaml: settings || undefined,
          },
        },
      },
    ]
  }

  const curationSettings = {
    dataNodeConfigurations: (data || []).map((fauxTemplateConfiguration) => ({
      instance_configuration_id: fauxTemplateConfiguration.id,
      size: {
        value: fauxTemplateConfiguration.size,
        resource: `memory` as 'memory' | 'storage',
      },
    })),
    instanceConfigurations,
  }

  const hasIndexCuration =
    couldHaveCuration(curationSettings) &&
    hotInstanceConfigurationId !== warmInstanceConfigurationId

  if (hasIndexCuration) {
    esResource.settings!.curation = { specs: indexPatterns }

    esResource.plan.elasticsearch.curation = {
      from_instance_configuration_id: hotInstanceConfigurationId!,
      to_instance_configuration_id: warmInstanceConfigurationId!,
    }
  }

  if (snapshotRepositoryId) {
    esResource.settings!.snapshot = {
      repository: {
        reference: {
          repository_name: snapshotRepositoryId,
        },
      },
    }
  }

  if (observability) {
    deploymentTemplate.settings = {
      observability,
    }
  }

  return {
    name,
    description,
    deployment_template: deploymentTemplate,
  }
}

export function extractInstanceTemplateConfigFieldsForEs(
  topology: ElasticsearchClusterTopologyElement,
  configuration?: InstanceConfiguration,
): Partial<InstanceTemplateConfig> {
  return {
    name: configuration?.name || topology.instance_configuration_id,
    id: topology.instance_configuration_id,
    size: topology.size?.value,
    resource: topology.size?.resource,
    zones: topology.zone_count,
    settings: topology.elasticsearch?.user_settings_yaml,
    node_types: topology.node_type && (Object.keys(pickBy(topology.node_type)) as NodeType[]),
    node_roles: getNodeRoles({ topologyElement: topology }),

    // @ts-ignore
    // TODO: Update api types file once API is complete
    nodeAttributes: topology.elasticsearch?.node_attributes || {},
    autoscalingMax: topology.autoscaling_max,
    autoscalingMin: topology.autoscaling_min,
  }
}

function createInstanceTemplateConfig(
  fields: Partial<InstanceTemplateConfig>,
): InstanceTemplateConfig {
  const {
    name,
    id,
    size,
    resource,
    zones,
    settings,
    node_types,
    node_roles,
    nodeAttributes,
    autoscalingMax,
    autoscalingMin,
  } = fields

  return {
    name: name || id || ``,
    id: id || ``,
    size: isNil(size) ? 1024 : size,
    resource: resource || `memory`,
    zones: zones || 1,
    settings,
    node_types,
    node_roles,
    nodeAttributes: nodeAttributes || {},
    included: true, // DNT-FIXME not in the model from the API
    autoscalingMax,
    autoscalingMin,
  }
}

function extractInstanceTemplateConfigFieldsForSlider({
  deploymentTemplate,
  sliderInstanceType,
}: {
  deploymentTemplate: DeploymentCreateRequest
  sliderInstanceType: SliderInstanceType
}): Partial<InstanceTemplateConfig> | null {
  const resource = getFirstSliderResourceFromTemplate({ deploymentTemplate, sliderInstanceType })
  const topologyElement = resource?.plan.cluster_topology?.[0]

  if (topologyElement == null) {
    return null
  }

  // @ts-ignore ES and Kibana plans should be able to fall back to a legacy top-level zone_count
  const zones = topologyElement.zone_count || resource.plan.zone_count
  const settings = (resource?.plan[sliderInstanceType].user_settings_yaml || null) as string | null

  return {
    id: topologyElement.instance_configuration_id,
    size: topologyElement.size?.value,
    resource: topologyElement.size?.resource,
    zones,
    settings,
  }
}

export function deserializeDeploymentTemplate(
  deploymentTemplateInfo: DeploymentTemplateInfoV2,
  instanceConfigurations: InstanceConfiguration[],
): DeploymentTemplateInstanceTemplateConfig {
  const { id, name, description, deployment_template: deploymentTemplate } = deploymentTemplateInfo
  const esResource = getFirstEsResourceFromTemplate({ deploymentTemplate })
  const nodeConfigurations = esResource?.plan.cluster_topology || []
  const curationPlan = esResource?.plan.elasticsearch.curation
  const curationSettings = esResource?.settings?.curation
  const dedicatedMasterSettings = esResource?.settings?.dedicated_masters_threshold

  const data: InstanceTemplateConfig[] = []
  let master
  let ingest
  let ml

  nodeConfigurations.forEach((nodeConfiguration) => {
    const configuration = getInstanceConfigurationById(
      instanceConfigurations,
      nodeConfiguration.instance_configuration_id!,
    )

    const fields = extractInstanceTemplateConfigFieldsForEs(nodeConfiguration, configuration)
    const instanceTemplateConfig = createInstanceTemplateConfig(fields)

    if (hasNodeType(nodeConfiguration, `data`)) {
      data.push(instanceTemplateConfig)
      return
    }

    if (hasNodeType(nodeConfiguration, `master`)) {
      master = instanceTemplateConfig
      master.dedicatedMastersThreshold = dedicatedMasterSettings
      return
    }

    if (hasNodeType(nodeConfiguration, `ingest`)) {
      ingest = instanceTemplateConfig
      return
    }

    if (hasNodeType(nodeConfiguration, `ml`)) {
      ml = instanceTemplateConfig
      return
    }
  })

  const sliders: Record<SliderInstanceType, Partial<InstanceTemplateConfig>> = {}

  getSupportedSliderInstanceTypesWithoutEs().forEach((sliderInstanceType) => {
    const fields = extractInstanceTemplateConfigFieldsForSlider({
      deploymentTemplate,
      sliderInstanceType,
    })

    if (fields) {
      sliders[sliderInstanceType] = createInstanceTemplateConfig(fields)
    }
  })

  const hotInstanceConfigurationId = get(curationPlan, [`from_instance_configuration_id`])
  const warmInstanceConfigurationId = get(curationPlan, [`to_instance_configuration_id`])
  const indexPatterns = get(curationSettings, [`specs`], [])

  const plugins = get(nodeConfigurations, [`0`, `elasticsearch`, `enabled_built_in_plugins`], [])

  const monitoringDeploymentId = esResource?.settings?.monitoring?.target_cluster_id

  const snapshotRepositoryId =
    esResource?.settings?.snapshot?.repository?.reference?.repository_name

  const observability = deploymentTemplate.settings?.observability

  return {
    name,
    description,
    data,
    master,
    ingest,
    ml,
    ...sliders,
    indexPatterns,
    hotInstanceConfigurationId,
    warmInstanceConfigurationId,
    monitoringDeploymentId,
    snapshotRepositoryId,
    plugins,
    observability,
    id,
  }
}

export function createDefaultDeploymentTemplate({
  instanceConfigurations,
  instanceTypes,
}: CreateDefaultDeploymentTemplateParams): DeploymentTemplateInstanceTemplateConfig {
  if (!instanceTypes) {
    throw new Error(`No instance types loaded`)
  }

  const defaultTemplate: DeploymentTemplateInstanceTemplateConfig = {
    name: ``,
    description: ``,
    data: [createDefaultInstanceTemplateConfig(`data`, instanceTypes, instanceConfigurations)],
    master: createDefaultInstanceTemplateConfig(`master`, instanceTypes, instanceConfigurations),
    ingest: createDefaultInstanceTemplateConfig(`ingest`, instanceTypes, instanceConfigurations),
    ml: createDefaultInstanceTemplateConfig(`ml`, instanceTypes, instanceConfigurations),
    kibana: createDefaultInstanceTemplateConfig(`kibana`, instanceTypes, instanceConfigurations),
    apm: createDefaultInstanceTemplateConfig(`apm`, instanceTypes, instanceConfigurations),
    indexPatterns: [],
    hotInstanceConfigurationId: undefined,
    warmInstanceConfigurationId: undefined,
    observability: undefined,
    plugins: [],
  }

  if (isSliderInstanceTypeSupportedInPlatform(`appsearch`)) {
    defaultTemplate.appsearch = createDefaultInstanceTemplateConfig(
      `appsearch`,
      instanceTypes,
      instanceConfigurations,
    )
  }

  if (isSliderInstanceTypeSupportedInPlatform(`enterprise_search`)) {
    defaultTemplate.enterprise_search = createDefaultInstanceTemplateConfig(
      `enterprise_search`,
      instanceTypes,
      instanceConfigurations,
    )
  }

  return defaultTemplate
}

function createDefaultInstanceTemplateConfig(
  type: EsNodeType | SliderInstanceType,
  instanceTypes: InstanceTypeResource[],
  instanceConfigurations: InstanceConfiguration[],
): InstanceTemplateConfig {
  let defaultConfigId: string | null | undefined

  if (!instanceTypes) {
    throw new Error(`instanceTypes is null`)
  }

  switch (type) {
    case `kibana`: {
      const kibanaInstanceType = instanceTypes.find((each) => each.instance_type === type)
      defaultConfigId = kibanaInstanceType
        ? kibanaInstanceType.default_instance_configuration_id
        : null
      break
    }

    case `appsearch`: {
      const appsearchInstanceType = instanceTypes.find((each) => each.instance_type === type)
      defaultConfigId = appsearchInstanceType
        ? appsearchInstanceType.default_instance_configuration_id
        : null
      break
    }

    case `enterprise_search`: {
      const enterpriseSearchInstanceType = instanceTypes.find((each) => each.instance_type === type)
      defaultConfigId = enterpriseSearchInstanceType
        ? enterpriseSearchInstanceType.default_instance_configuration_id
        : null
      break
    }

    case `apm`: {
      const apmInstanceType = instanceTypes.find((each) => each.instance_type === type)
      defaultConfigId = apmInstanceType ? apmInstanceType.default_instance_configuration_id : null
      break
    }

    default: {
      const matchingInstanceType = instanceTypes.find(
        (each) => each.instance_type === `elasticsearch`,
      )

      if (matchingInstanceType == null) {
        throw new Error(`Couldn't find an instance type for 'elasticsearch'`)
      }

      // Try for an exact node type match, otherwise fall back to `data`.
      defaultConfigId = [type, `data`]
        .map((candidateType) => {
          const matchingNodeType = matchingInstanceType.node_types.find(
            (each) => each.node_type === candidateType,
          )
          return matchingNodeType ? matchingNodeType.default_instance_configuration_id : null
        })
        .reduce((result, candidate) => result || candidate)

      break
    }
  }

  if (defaultConfigId == null) {
    // Without an explicit default, find the first available matching configuration
    const defaultInstanceConfig = instanceConfigurations.find(
      (each) => each.instance_type === type && each.deleted_on == null,
    )
    defaultConfigId = defaultInstanceConfig ? defaultInstanceConfig.id : null
  }

  if (defaultConfigId == null) {
    throw new Error(`Couldn't find a default instance configuration ID for '${type}'`)
  }

  const defaultInstanceConfiguration = instanceConfigurations.find(
    (each) => each.id === defaultConfigId,
  )

  if (!defaultInstanceConfiguration) {
    throw new Error(
      `Can't create a default instance template configuration for type: ${type}, with default config ID ${defaultConfigId}`,
    )
  }

  const typeToDefaultSettingsMap = {
    master: defaultEsUserSettings,
    data: defaultEsUserSettings,
    ingest: defaultEsUserSettings,
    ml: defaultEsUserSettings,
    kibana: defaultKibanaUserSettings,
    apm: defaultApmUserSettings,
  }

  const settings = typeToDefaultSettingsMap[type]

  // Build the instance template config using the properties of the default instance config.
  const {
    name = ``,
    id = ``,
    discrete_sizes: { default_size: size, resource },
    node_types,
  } = defaultInstanceConfiguration

  const instanceTemplateConfig: InstanceTemplateConfig = {
    name,
    id,
    size,
    resource,
    zones: 1,
    included: false,
    settings,
    nodeAttributes: {},
  }

  if (node_types) {
    instanceTemplateConfig.node_types = node_types as NodeType[]
  }

  return instanceTemplateConfig
}

export function ensureOnlyOneMasterEligibleDataConfig(
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig,
  {
    instanceConfigurations,
  }: {
    instanceConfigurations: InstanceConfiguration[]
  },
): DeploymentTemplateInstanceTemplateConfig {
  const masterEligibleDataConfigIndices = (deploymentTemplate.data || [])
    .map((instanceConfig, index) => (instanceConfig.node_types?.includes(`master`) ? index : -1))
    .filter((index) => index !== -1) // discard non master-eligible data config indices

  // if there is a single master-eligible data config, then just return unchanged
  if (masterEligibleDataConfigIndices.length === 1) {
    return deploymentTemplate
  }

  if (masterEligibleDataConfigIndices.length === 0) {
    return thereAreNone()
  }

  return thereAreMany()

  // no master-eligible data configs, flag the first (if any) as master-eligible
  function thereAreNone() {
    const newDeploymentTemplate = cloneDeep(deploymentTemplate)

    const eligibleConfig = newDeploymentTemplate.data!.find((instanceTemplateConfig) => {
      const instanceConfig = instanceConfigurations.find(
        ({ id }) => id === instanceTemplateConfig.id,
      )
      return instanceConfig?.node_types?.includes(`master`)
    })

    if (!eligibleConfig) {
      return deploymentTemplate // not just sanity; there may be no master-eligible data configs
    }

    eligibleConfig.node_types = [...(eligibleConfig.node_types || []), `master`]

    return newDeploymentTemplate
  }

  // multiple master-eligible data configs, strip master eligibility from all but the first
  function thereAreMany() {
    const newDeploymentTemplate = cloneDeep(deploymentTemplate)

    tail(masterEligibleDataConfigIndices).forEach((i) => {
      pull(newDeploymentTemplate.data![i].node_types!, `master`)
    })

    return newDeploymentTemplate
  }
}

// require Kibana when APM is included
export function ensureKibanaIsIncludedForApm(
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig,
): DeploymentTemplateInstanceTemplateConfig {
  const isApmEnabled = get(deploymentTemplate, [`apm`, `included`])

  if (isApmEnabled && deploymentTemplate.kibana && !deploymentTemplate.kibana.included) {
    const newDeploymentTemplate = cloneDeep(deploymentTemplate)

    newDeploymentTemplate.kibana!.included = true

    return newDeploymentTemplate
  }

  return deploymentTemplate
}

export function ensureDedicatedMasterThresholdIsInRange(
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig,
): DeploymentTemplateInstanceTemplateConfig {
  if (deploymentTemplate.master == null) {
    return deploymentTemplate // no dedicated master, :nothingtodohere:
  }

  const anyDataConfigsMasterEligible = areAnyDataConfigurationsMasterEligible(deploymentTemplate)

  return anyDataConfigsMasterEligible ? someMasterEligible() : noneMasterEligible()

  // dedicated master threshold must be greater than 1 if any data configurations are master-eligible
  function someMasterEligible() {
    const { dedicatedMastersThreshold } = deploymentTemplate.master!

    if (dedicatedMastersThreshold! > 1) {
      return deploymentTemplate // already set above 1, leave as is
    }

    // if it *was* 1 and now can't be, set to the default
    const newDeploymentTemplate = cloneDeep(deploymentTemplate)

    newDeploymentTemplate.master!.dedicatedMastersThreshold = DEFAULT_DEDICATED_MASTERS_THRESHOLD

    return newDeploymentTemplate
  }

  // dedicated master threshold must be 1 if no data configurations are master-eligible
  function noneMasterEligible() {
    const newDeploymentTemplate = cloneDeep(deploymentTemplate)

    newDeploymentTemplate.master!.dedicatedMastersThreshold = 1

    return newDeploymentTemplate
  }
}
