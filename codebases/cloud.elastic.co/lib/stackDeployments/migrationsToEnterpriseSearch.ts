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

import { flatMap, flatten, get, mapKeys, set, without } from 'lodash'

import { getElasticsearchPayloadFromResource } from './conversions'
import {
  getEsPlanFromGet,
  getFirstEsClusterFromGet,
  getResources,
  getSizedTopology,
  getTopology,
  getSliderPlanFromGet,
  getNodeTypes,
  getInstanceConfigurationsFromTemplate,
} from './selectors'
import { createDeploymentFromTemplate, isValidSizeForInstanceConfiguration } from './template'

import { parseUserSettings } from '../deployments/userSettings'
import { isHiddenTemplate, getDedicatedTemplateType } from '../deploymentTemplates/metadata'

import { gte, maxSatisfying } from '../semver'

import {
  getSupportedSliderInstanceTypes,
  isSliderEnabledInStackDeployment,
  isSliderInstanceTypeSupportedInPlatform,
  isSliderInstanceTypeSupportedInTemplate,
} from '../sliders'

import { getInstanceConfigurationById } from '../instanceConfigurations/instanceConfiguration'
import { getTopologiesFromTemplate } from '../deploymentTemplates/getTopologiesFromTemplate'

import { mergeDeep } from '../immutability-helpers'

import { jsonToYaml } from '../yaml'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  StackVersionConfig,
  InstanceConfiguration,
  DeploymentCreateRequest,
  AppSearchPlan,
} from '../api/v1/types'
import {
  AnyResourceInfo,
  AnyTopologyElement,
  Region,
  StackDeployment,
  VersionNumber,
  AnyPayload,
} from '../../types'

// for instance configs that may have been superseded by new versions between
// the source and destination templates
const REPLACED_INSTANCE_CONFIGS = {
  'aws.data.highcpu.m5': 'aws.data.highcpu.m5d',
}

export const canMigrateToEnterpriseSearch = (deployment: StackDeployment): boolean =>
  isSliderEnabledInStackDeployment(deployment, `appsearch`) &&
  isSliderInstanceTypeSupportedInPlatform(`enterprise_search`)

// Returns the supplied deployment templates filtered to those viable for
// migration
export const getCompatibleDeploymentTemplates = ({
  deployment,
  deploymentTemplates,
}: {
  deployment: StackDeployment
  deploymentTemplates?: DeploymentTemplateInfoV2[]
}): DeploymentTemplateInfoV2[] => {
  if (deploymentTemplates == null) {
    return []
  }

  // (In practice, for ESS:) if we have visible dedicated Enterprise Search
  // template(s), return those
  const dedicatedTemplates = deploymentTemplates.filter(
    (deploymentTemplate) =>
      getDedicatedTemplateType(deploymentTemplate) === `enterprise_search` &&
      !isHiddenTemplate(deploymentTemplate),
  )

  if (dedicatedTemplates.length > 0) {
    return dedicatedTemplates
  }

  // (In practice, for ECE:) otherwise, return templates that 1) include
  // enterprise search, and 2) support existing topology in the deployment about
  // to be migrated
  return deploymentTemplates.filter((deploymentTemplate) => {
    const isHidden = isHiddenTemplate(deploymentTemplate)

    if (isHidden) {
      return false
    }

    const supported = isSliderInstanceTypeSupportedInTemplate(
      `enterprise_search`,
      deploymentTemplate,
    )

    if (!supported) {
      return false
    }

    const compatible = isDeploymentCompatableWithDeploymentTemplate({
      deployment,
      deploymentTemplate,
    })

    return compatible
  })
}

export const migrateAppSearchToEnterpriseSearch = ({
  deployment,
  deploymentTemplate,
  snapshotName,
  region,
  stackVersions,
}: {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
  snapshotName: string
  region: Region
  stackVersions: StackVersionConfig[]
}): DeploymentCreateRequest => {
  const { name, settings, metadata } = deployment

  const resource = getFirstEsClusterFromGet({ deployment })!
  const esPayload = getElasticsearchPayloadFromResource({ resource })!
  // esPayload doesn't have a plan, but we need to set one to
  // restore from the previous deployments most recent snapshot
  const esClusterWithPlan = mergeDeep(esPayload, {
    plan: {
      transient: {
        restore_snapshot: {
          snapshot_name: snapshotName,
          source_cluster_id: resource.id,
        },
      },
    },
  })

  const version = getPreferredMigrationDestinationVersion(stackVersions)!

  // Creates an object suitable for sending to the create deployment endpoint
  const migratedDeployment = createDeploymentFromTemplate({
    prevState: {
      name,
      settings,
      metadata,
      resources: {
        elasticsearch: [esClusterWithPlan],
      },
    },
    deploymentTemplate,
    version,
    region,
    stackVersions,
  })

  const withToplologyAndUserSettings = preserveTopologyAndUserSettings({
    sourceDeployment: deployment,
    destinationDeployment: migratedDeployment,
  })

  return withToplologyAndUserSettings
}

// For upgrading from App Search to Enterprise Search, we want to target
// the highest minor version above 7.7.0 that supports Enterprise Search.
export function getPreferredMigrationDestinationVersion(
  stackVersions: StackVersionConfig[],
): VersionNumber | null {
  const minSupportedVersion = `7.7.0`

  const entSearchVersions = stackVersions
    // that support enterprise search
    .filter(({ enterprise_search }) => enterprise_search)
    .map(({ version }) => version!)
    // and are at least 7.7.0, to guard against dev/test/incorrect stack packs
    .filter((version) => gte(version, minSupportedVersion))

  if (entSearchVersions.length === 0) {
    return null
  }

  const [lowestAvailableVersion] = entSearchVersions
  const highestPatchForLowestMinor = maxSatisfying(
    entSearchVersions,
    `^${lowestAvailableVersion}`,
    { ignoreTags: false },
  )

  return highestPatchForLowestMinor
}

export function isDeploymentCompatableWithDeploymentTemplate({
  deployment,
  deploymentTemplate,
}: {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
}): boolean {
  // We don't care about app|enterprise search resources as they're being migrated
  const resourceTypes = without(getSupportedSliderInstanceTypes(), `appsearch`, `enterprise_search`)

  // We only care about migrating over sized topology that's in use
  const sizedDeploymentTopology: AnyTopologyElement[] = flatten(
    getResources({ deployment, resourceTypes }).map((resource) => getSizedTopology({ resource })),
  ).filter(Boolean)

  const instanceConfigurations = getInstanceConfigurationsFromTemplate({ deploymentTemplate })

  const templateEsTopology = getTopologiesFromTemplate({
    deploymentTemplate: deploymentTemplate.deployment_template,
    sliderInstanceType: `elasticsearch`,
  })

  const templateSliderTopology: AnyTopologyElement[] = flatMap(
    resourceTypes,
    (sliderInstanceType) =>
      getTopologiesFromTemplate({
        deploymentTemplate: deploymentTemplate.deployment_template,
        sliderInstanceType,
      }),
  ).filter(Boolean)

  const allTemplateTopology = flatten([...templateEsTopology, ...templateSliderTopology])

  // For every deployment topology entry, we want to make sure we have at least one supported equivalent in the template
  const templateIncludesTopology = sizedDeploymentTopology.every((deploymentTopology) =>
    allTemplateTopology.some((templateToplology) =>
      doesDeploymentTopologyMatchTemplateTopology({
        deploymentTopology,
        templateToplology,
        instanceConfigurations,
      }),
    ),
  )

  return templateIncludesTopology
}

// Due to optional fields being present on deployment topology and not within template topology,
// we just check explicitly for node types and size compatability
function doesDeploymentTopologyMatchTemplateTopology({
  deploymentTopology,
  templateToplology,
  instanceConfigurations,
}: {
  deploymentTopology: AnyTopologyElement
  templateToplology: AnyTopologyElement
  instanceConfigurations: InstanceConfiguration[]
}) {
  const deploymentNodeTypes = getNodeTypes({
    nodeConfiguration: deploymentTopology as ElasticsearchClusterTopologyElement,
  })
  const templateNodeTypes = getNodeTypes({
    nodeConfiguration: templateToplology as ElasticsearchClusterTopologyElement,
  })

  const matchesNodeTypes = deploymentNodeTypes.every((nodeType) =>
    templateNodeTypes.includes(nodeType),
  )

  const instanceConfiguration = getInstanceConfigurationById(
    instanceConfigurations,
    templateToplology.instance_configuration_id!,
  )

  if (!instanceConfiguration) {
    return false // sanity
  }

  const matchesSize = isValidSizeForInstanceConfiguration({
    size: deploymentTopology.size,
    instanceConfiguration,
  })

  return matchesNodeTypes && matchesSize
}

function preserveTopologyAndUserSettings({
  sourceDeployment,
  destinationDeployment,
}: {
  sourceDeployment: StackDeployment
  destinationDeployment: DeploymentCreateRequest
}) {
  const sourceResources = getResources({ deployment: sourceDeployment })
  const sourceTopology = flatMap<AnyResourceInfo[], AnyTopologyElement>(
    sourceResources,
    (resource: AnyResourceInfo) => getTopology({ resource }),
  )

  const destinationResources = getResources({ deployment: destinationDeployment })
  const destinationTopology = flatMap<AnyPayload[], AnyTopologyElement | undefined>(
    destinationResources,
    (payload: AnyPayload) => payload.plan.cluster_topology,
  )

  // copy over all source topology into matching instance configs
  sourceTopology.forEach((topology) => {
    const { instance_configuration_id: sourceInstanceConfigId } = topology

    const matchingTopology = destinationTopology.find((_topology) => {
      const { instance_configuration_id: destInstanceConfigId } = _topology!

      if (!sourceInstanceConfigId || !destInstanceConfigId) {
        return false // sanity
      }

      // go with an identical match if possible
      if (destInstanceConfigId === sourceInstanceConfigId) {
        return true
      }

      // otherwise, check our known deprecated instance configs against their replacements
      const replacedInstanceConfig = REPLACED_INSTANCE_CONFIGS[sourceInstanceConfigId]

      if (replacedInstanceConfig === destInstanceConfigId) {
        return true
      }
    })

    if (matchingTopology) {
      const { size, zone_count } = topology
      matchingTopology.size = size
      matchingTopology.zone_count = zone_count
    }
  })

  const appsearchTopology = flatMap(sourceDeployment.resources.appsearch, (resource) =>
    getTopology({ resource }),
  )
  const enterpriseSearchTopology = flatMap(
    destinationDeployment.resources.enterprise_search,
    (payload) => payload.plan.cluster_topology!,
  )

  // carry over existing app search topology to enterprise search
  appsearchTopology.forEach((topology, i) => {
    const destTopology = enterpriseSearchTopology[i]

    if (destTopology) {
      const { size, zone_count } = topology
      destTopology.size = size
      destTopology.zone_count = zone_count
    }
  })

  const withUserSettings = preserveUserSettings({
    sourceDeployment,
    destinationDeployment,
  })

  return withUserSettings
}

function preserveUserSettings({
  sourceDeployment,
  destinationDeployment,
}: {
  sourceDeployment: StackDeployment
  destinationDeployment: DeploymentCreateRequest
}) {
  // Copy ES user settings
  const esPlan = getEsPlanFromGet({ deployment: sourceDeployment })
  const esUserSettings = esPlan?.elasticsearch.user_settings_yaml

  if (esUserSettings) {
    set(
      destinationDeployment,
      [`resources`, `elasticsearch`, `0`, `plan`, `elasticsearch`, `user_settings_yaml`],
      esUserSettings,
    )
  }

  // Copy slider user settings
  const sliderInstanceTypes = without(
    Object.keys(sourceDeployment.resources),
    `elasticsearch`,
    `appsearch`,
  )

  for (const sliderInstanceType of sliderInstanceTypes) {
    const plan = getSliderPlanFromGet({ deployment: sourceDeployment, sliderInstanceType })
    const userSettings = get(plan, [sliderInstanceType, `user_settings_yaml`])

    if (userSettings) {
      set(
        destinationDeployment,
        [`resources`, sliderInstanceType, `0`, `plan`, sliderInstanceType, `user_settings_yaml`],
        userSettings,
      )
    }
  }

  // Copy app search user settings into enterprise search user settings
  const appSearchPlan = getSliderPlanFromGet<AppSearchPlan>({
    deployment: sourceDeployment,
    sliderInstanceType: `appsearch`,
  })
  const appSearchUserSettings = appSearchPlan?.appsearch.user_settings_yaml

  if (appSearchUserSettings) {
    set(
      destinationDeployment,
      [`resources`, `enterprise_search`, `0`, `plan`, `enterprise_search`, `user_settings_yaml`],
      convertAppSearchNamespaceToEnterpriseSearch(appSearchUserSettings),
    )
  }

  return destinationDeployment
}

function convertAppSearchNamespaceToEnterpriseSearch(yaml: string) {
  const sourceNs = `app_search`
  const destNs = `ent_search`
  const parsedUserSettings = parseUserSettings(yaml)

  const convertedUserSettings = mapKeys(parsedUserSettings, (_, k) => {
    // only replace the top level namespace
    if (k.startsWith(sourceNs)) {
      return k.replace(sourceNs, destNs)
    }

    return k
  })

  return jsonToYaml(convertedUserSettings)
}
