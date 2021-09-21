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
import React, { ReactElement } from 'react'
import { get, find, isUndefined } from 'lodash'
import { FormattedMessage } from 'react-intl'

import { getInstanceConfigurationById } from '../../instanceConfigurations/instanceConfiguration'
import { isHiddenTemplate } from '../../deploymentTemplates/metadata'

import prettySize from '../../prettySize'

import {
  isTemplateSupportedInPlatform,
  getProductSliderTypes,
  sortSliderTypes,
} from '../../sliders'
import { getTopologiesFromTemplate } from '../../deploymentTemplates/getTopologiesFromTemplate'

import { getEsPlanFromGet, getVersion } from './fundamentals'
import { getConfigForKey } from '../../../store'
import { satisfies } from '../../semver'
import { isSliderEnabled } from '../sliderPrimitives'

import {
  DeploymentTemplateInstanceTemplateConfig,
  SliderInstanceType,
  AnyPayload,
  AnyTopologyElement,
  SliderNodeType,
  SliderType,
  StackDeployment,
  VersionNumber,
} from '../../../types'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  DeploymentCreateRequest,
  ElasticsearchPayload,
  KibanaPayload,
  ApmPayload,
  EnterpriseSearchPayload,
  AppSearchPayload,
  ElasticsearchClusterSettings,
} from '../../api/v1/types'

export function getDeploymentTemplateId({
  deployment,
}: {
  deployment: StackDeployment
}): string | null {
  const esPlan = getEsPlanFromGet({
    deployment,
    state: `best_effort`,
  })

  if (!esPlan || !esPlan.deployment_template) {
    return null
  }

  return esPlan.deployment_template.id
}

export function usesDedicatedEntSearchTemplate({
  deployment,
}: {
  deployment: StackDeployment
}): boolean {
  const deploymentTemplateId = getDeploymentTemplateId({ deployment })

  if (!deploymentTemplateId) {
    return false
  }

  const matchesDedicatedEntSearchTemplate = deploymentTemplateId.endsWith(
    `enterprise-search-dedicated`,
  )

  return matchesDedicatedEntSearchTemplate
}

export function isKibanaSupported({
  deployment,
  deploymentTemplate,
}: {
  deployment?: StackDeployment
  deploymentTemplate?: DeploymentCreateRequest | null
}): boolean {
  if (!deployment) {
    return false // avoid intermittence until we have the deployment
  }

  if (!getDeploymentTemplateId({ deployment })) {
    return true
  }

  return Boolean(deploymentTemplate?.resources.kibana)
}

export function isApmSupported({
  deployment,
  deploymentTemplate,
}: {
  deployment?: StackDeployment
  deploymentTemplate?: DeploymentCreateRequest | null
}): boolean {
  if (!deployment) {
    return false
  }

  const isHeroku = getConfigForKey(`APP_FAMILY`) === `heroku`

  if (isHeroku) {
    return false
  }

  const version = getVersion({ deployment })

  if (!version) {
    return false
  }

  const apmSupportedRange = getConfigForKey(`APM_SUPPORTED_VERSION_RANGE`)

  if (!apmSupportedRange) {
    return false
  }

  // hide APM if not in the supported version range
  if (!satisfies(version, apmSupportedRange)) {
    return false
  }

  const agentSupportedRange = getConfigForKey(`AGENT_SUPPORTED_VERSION_RANGE`)

  if (!agentSupportedRange) {
    return false
  }

  // hide APM if it's not enabled but Agent is supported
  if (
    !isSliderEnabled({ deployment, sliderInstanceType: `apm` }) &&
    satisfies(version, agentSupportedRange)
  ) {
    return false
  }

  return Boolean(deploymentTemplate?.resources.apm)
}

export function isAgentSupported(_params: {
  deployment?: StackDeployment
  deploymentTemplate?: DeploymentCreateRequest | null
}): boolean {
  return false
}

export function isSliderSupportedForDeployment({
  deployment,
  deploymentTemplate,
  sliderInstanceType,
}: {
  deployment?: StackDeployment
  deploymentTemplate?: DeploymentCreateRequest | null
  sliderInstanceType: SliderInstanceType
}): boolean {
  if (sliderInstanceType === `elasticsearch`) {
    return true
  }

  if (sliderInstanceType === `kibana`) {
    return isKibanaSupported({ deployment, deploymentTemplate })
  }

  if (sliderInstanceType === `apm`) {
    return isApmSupported({ deployment, deploymentTemplate })
  }

  if (sliderInstanceType === `agent`) {
    return isAgentSupported({ deployment, deploymentTemplate })
  }

  return Boolean(deploymentTemplate?.resources[sliderInstanceType])
}

export function isApmSupportedForNewDeployment({
  version,
  deploymentTemplate,
}: {
  version: VersionNumber
  deploymentTemplate?: DeploymentCreateRequest | null
}): boolean {
  const isHeroku = getConfigForKey(`APP_FAMILY`) === `heroku`

  if (isHeroku) {
    return false
  }

  // hide APM if Agent is supported
  if (isAgentSupportedForNewDeployment({ version, deploymentTemplate })) {
    return false
  }

  const apmSupportedRange = getConfigForKey(`APM_SUPPORTED_VERSION_RANGE`)

  if (!apmSupportedRange) {
    return false
  }

  // hide APM if not in the supported version range
  if (!satisfies(version, apmSupportedRange)) {
    return false
  }

  return Boolean(deploymentTemplate?.resources.apm)
}

export function isAgentSupportedForNewDeployment(_params: {
  version: VersionNumber
  deploymentTemplate?: DeploymentCreateRequest | null
}): boolean {
  return false
}

export function isSliderSupportedForNewDeployment({
  version,
  deploymentTemplate,
  sliderInstanceType,
}: {
  version: VersionNumber
  deploymentTemplate?: DeploymentCreateRequest | null
  sliderInstanceType: SliderInstanceType
}): boolean {
  if (sliderInstanceType === `elasticsearch`) {
    return true
  }

  if (sliderInstanceType === `apm`) {
    return isApmSupportedForNewDeployment({ version, deploymentTemplate })
  }

  if (sliderInstanceType === `agent`) {
    return isAgentSupportedForNewDeployment({ version, deploymentTemplate })
  }

  return Boolean(deploymentTemplate?.resources[sliderInstanceType])
}

export function hasNodeType(
  clusterTopology: AnyTopologyElement,
  nodeType: SliderNodeType,
): boolean {
  return get(clusterTopology, [`node_type`, nodeType]) === true
}

export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: `elasticsearch`
}): ElasticsearchPayload | null
export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: `kibana`
}): KibanaPayload | null
export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: `apm`
}): ApmPayload | null
export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: `appsearch`
}): AppSearchPayload | null
export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: `enterprise_search`
}): EnterpriseSearchPayload | null
export function getFirstSliderResourceFromTemplate(args: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: SliderInstanceType
}): AnyPayload | null
export function getFirstSliderResourceFromTemplate({
  deploymentTemplate,
  sliderInstanceType,
}: {
  deploymentTemplate?: DeploymentCreateRequest
  sliderInstanceType: SliderInstanceType
}): AnyPayload | null {
  return deploymentTemplate?.resources[sliderInstanceType]?.[0] || null
}

export function getFirstEsResourceFromTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate?: DeploymentCreateRequest
}): ElasticsearchPayload | null {
  return getFirstSliderResourceFromTemplate({
    deploymentTemplate,
    sliderInstanceType: `elasticsearch`,
  })
}

export function getEsSettingsFromTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate?: DeploymentCreateRequest
}): ElasticsearchClusterSettings | null {
  return (
    getFirstSliderResourceFromTemplate({
      deploymentTemplate,
      sliderInstanceType: `elasticsearch`,
    })?.settings || null
  )
}

type HasMasterEligibleInstanceParams = {
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig
  instanceConfigurations: InstanceConfiguration[]
}

export function hasMasterEligibleInstance({
  deploymentTemplate: { master, data },
  instanceConfigurations,
}: HasMasterEligibleInstanceParams): boolean {
  if (master && master.included) {
    return true
  }

  if (!data) {
    return false
  }

  return data.some((instanceTemplateConfig) => {
    const configuration = getInstanceConfigurationById(
      instanceConfigurations,
      instanceTemplateConfig.id,
    )

    if (configuration == null) {
      return false
    }

    return (configuration.node_types || []).includes(`master`)
  })
}

function describeDataNode(instanceConfigsById, topology): TemplateDescriptionItem {
  const instanceConfig = instanceConfigsById[topology.instance_configuration_id || ``]

  const sizeValue =
    topology.size && topology.size.value
      ? topology.size.value
      : instanceConfig.discrete_sizes.sizes[0]

  const resource = topology.size ? topology.size.resource : `memory`
  const optional = Boolean(topology.size && topology.size.value === 0)

  let memorySize
  let storageSize

  if (resource === `memory`) {
    memorySize = sizeValue
    storageSize = sizeValue * instanceConfig.storage_multiplier
  } else {
    memorySize = sizeValue / instanceConfig.storage_multiplier
    storageSize = sizeValue
  }

  return {
    description: (
      <FormattedMessage
        id='deployment-template.topology.data.description'
        defaultMessage='{zoneCount, number} {times} {memorySize} {memory} / {storageSize} {storage} {zoneCount, plural, one {instance} other {instances}} of {instanceName}'
        values={{
          zoneCount: topology.zone_count || 1,
          times: <span>&times;</span>,
          memorySize: prettySize(memorySize),
          memory: (
            <FormattedMessage
              id='deployment-template.topology.description.memory'
              defaultMessage='RAM'
            />
          ),
          storageSize: prettySize(storageSize),
          storage: (
            <FormattedMessage
              id='deployment-template.topology.description.storage'
              defaultMessage='storage'
            />
          ),
          instanceName: <code>{instanceConfig.name}</code>,
        }}
      />
    ),
    optional,
  }
}

function describeOtherNode(instanceConfigsById, topology): TemplateDescriptionItem {
  const instanceConfig = instanceConfigsById[topology.instance_configuration_id || ``]

  const sizeValue =
    topology.size && topology.size.value
      ? topology.size.value
      : instanceConfig.discrete_sizes.default_size

  const resource = topology.size ? topology.size.resource : `memory`
  const optional = Boolean(topology.size && topology.size.value === 0)

  const resourceDescription =
    resource === `memory` ? (
      <FormattedMessage id='deployment-template.topology.description.memory' defaultMessage='RAM' />
    ) : (
      <FormattedMessage
        id='deployment-template.topology.description.storage'
        defaultMessage='storage'
      />
    )

  return {
    description: (
      <FormattedMessage
        id='deployment-template.topology.other.description'
        defaultMessage='{zoneCount, number} {times} {size} {resource} {zoneCount, plural, one {instance} other {instances}} of {instanceName}'
        values={{
          zoneCount: topology.zone_count || 1,
          times: <span>&times;</span>,
          size: prettySize(sizeValue),
          resource: resourceDescription,
          instanceName: <code>{instanceConfig.name}</code>,
        }}
      />
    ),
    optional,
  }
}

type TemplateDescriptionItem = {
  description: ReactElement<typeof FormattedMessage>
  optional?: boolean
}

export function describeTemplate(template: DeploymentTemplateInfoV2): TemplateDescriptionItem[] {
  const instanceConfigsById = (template.instance_configurations || []).reduce((result, config) => {
    if (config.id) {
      result[config.id] = config
    }

    return result
  }, {})

  const topologyElements = getTopologiesFromTemplate({
    deploymentTemplate: template.deployment_template,
  })

  const topologyElementsWithConfiguration: AnyTopologyElement[] = topologyElements.filter(
    (topology) => {
      const instanceConfig = instanceConfigsById[topology.instance_configuration_id || ``]
      return Boolean(instanceConfig)
    },
  )

  const description: TemplateDescriptionItem[] = topologyElementsWithConfiguration.map(
    (topology) => {
      let isDataNode = false

      if (Object.keys(topology).includes('node_type')) {
        const nodeType = (topology as ElasticsearchClusterTopologyElement).node_type

        isDataNode = nodeType != null && nodeType.data === true
      }

      if (isDataNode) {
        return describeDataNode(instanceConfigsById, topology)
      }

      return describeOtherNode(instanceConfigsById, topology)
    },
  )

  return description
}

export function getSupportedDeploymentTemplates(
  deploymentTemplates?: DeploymentTemplateInfoV2[],
): DeploymentTemplateInfoV2[] | undefined {
  if (!Array.isArray(deploymentTemplates)) {
    return deploymentTemplates
  }

  return deploymentTemplates.filter(isTemplateSupportedInPlatform)
}

export function areAnyDataConfigurationsMasterEligible(
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig,
): boolean {
  if (deploymentTemplate.data == null) {
    return false
  }

  return deploymentTemplate.data.some(({ node_types = [] }) => node_types.includes(`master`))
}

export function getInstanceConfigurationsFromTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate?: DeploymentTemplateInfoV2
}): InstanceConfiguration[] {
  if (!deploymentTemplate) {
    return []
  }

  const instanceConfigurations = deploymentTemplate.instance_configurations

  if (!instanceConfigurations) {
    return []
  }

  return instanceConfigurations
}

export function getInstanceConfigurationInfoFromTemplate({
  deploymentTemplate,
  instanceConfigurationId,
}: {
  deploymentTemplate: DeploymentTemplateInfoV2
  instanceConfigurationId: string
}): InstanceConfiguration {
  return find(deploymentTemplate.instance_configurations, { id: instanceConfigurationId })!
}

export const isSliderInTemplate = function ({
  deploymentTemplate,
  sliderInstanceType,
  sliderNodeType,
}: {
  deploymentTemplate: DeploymentCreateRequest
  sliderInstanceType: SliderInstanceType
  sliderNodeType?: SliderNodeType
}): boolean {
  const topologies = getTopologiesFromTemplate({ deploymentTemplate, sliderInstanceType })

  if (topologies.length === 0) {
    return false
  }

  if (sliderNodeType == null) {
    return true
  }

  return topologies.some((topology) => get(topology, [`node_type`, sliderNodeType]))
}

export function getProductSliderTypesForTemplate(
  deploymentTemplate: DeploymentCreateRequest,
): SliderType[] {
  const supportedTypes = getProductSliderTypes().filter(({ sliderInstanceType, sliderNodeType }) =>
    isSliderInTemplate({ deploymentTemplate, sliderInstanceType, sliderNodeType }),
  )

  return sortSliderTypes(supportedTypes)
}

export function getVisibleTemplates(globalDeploymentTemplates) {
  if (globalDeploymentTemplates == null) {
    return null
  }

  return globalDeploymentTemplates
    .filter((template) => !isHiddenTemplate(template))
    .sort((a, b) => {
      if (!isUndefined(a.order) && !isUndefined(b.order)) {
        return a.order - b.order
      }

      return 0
    })
}
