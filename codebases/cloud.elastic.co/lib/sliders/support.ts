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

import { intersection, without } from 'lodash'

import { getConfigForKey } from '../../store'

import {
  alwaysSupportedSliderInstanceTypes,
  getExtraSupportedSliderInstanceTypes,
  getAllKnownSliderInstanceTypes,
  getAllKnownSliderTypes,
} from './sliders'

import { getDedicatedTemplateType } from '../deploymentTemplates/metadata'
import { getDedicatedGlobalTemplateType } from '../globalDeploymentTemplates/metadata'

import { AnyTopologyElement, SliderType, SliderInstanceType, SliderNodeType } from '../../types'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  GlobalDeploymentTemplateInfo,
} from '../api/v1/types'

export function getSupportedSliderInstanceTypes(): SliderInstanceType[] {
  const explicitInstanceTypes = getConfigForKey(`OVERRIDING_INSTANCE_TYPES`)

  const supportedSliderTypes = Array.isArray(explicitInstanceTypes)
    ? explicitInstanceTypes
    : [...alwaysSupportedSliderInstanceTypes, ...getExtraSupportedSliderInstanceTypes()]

  return intersection(getAllKnownSliderInstanceTypes(), supportedSliderTypes)
}

export function getSupportedSliderInstanceTypesWithoutEs(): Array<
  Exclude<SliderInstanceType, 'elasticsearch'>
> {
  return without(getSupportedSliderInstanceTypes(), `elasticsearch`)
}

export function getProductSliderTypes(): SliderType[] {
  return [
    ...getAllKnownSliderInstanceTypes().map((sliderInstanceType) => ({
      sliderInstanceType,
    })),
    {
      sliderInstanceType: `elasticsearch`,
      sliderNodeType: `ml`,
    },
  ]
}

export function getSupportedProductSliderTypes(): SliderType[] {
  return [
    ...getSupportedSliderInstanceTypes().map((sliderInstanceType) => ({
      sliderInstanceType,
    })),
    {
      sliderInstanceType: `elasticsearch`,
      sliderNodeType: `ml`,
    },
  ]
}

export function isSliderInstanceType(type: string): boolean {
  return getAllKnownSliderInstanceTypes().includes(type)
}

export function isSliderInstanceTypeSupportedInPlatform(
  sliderInstanceType: SliderInstanceType,
): boolean {
  const inPlatform = getSupportedSliderInstanceTypes().includes(sliderInstanceType)
  return inPlatform
}

export function isSliderInstanceTypeSupportedInTemplate(
  sliderInstanceType: SliderInstanceType,
  deploymentTemplate: DeploymentTemplateInfoV2 | undefined,
): boolean {
  if (!isSliderInstanceTypeSupportedInPlatform(sliderInstanceType)) {
    return false
  }

  return Boolean(deploymentTemplate?.deployment_template.resources[sliderInstanceType])
}

export function isTemplateSupportedInPlatform(
  deploymentTemplate: DeploymentTemplateInfoV2,
): boolean {
  const dedicatedMetadataItem = getDedicatedTemplateType(deploymentTemplate)

  if (dedicatedMetadataItem == null) {
    return true // no dedicated purpose for this template, so it's fine
  }

  return isSliderInstanceTypeSupportedInPlatform(dedicatedMetadataItem)
}

export function isGlobalTemplateSupportedInPlatform(
  globalTemplate: GlobalDeploymentTemplateInfo,
): boolean {
  const dedicatedMetadataItem = getDedicatedGlobalTemplateType(globalTemplate)

  if (dedicatedMetadataItem == null) {
    return true // no dedicated purpose for this template, so it's fine
  }

  return isSliderInstanceTypeSupportedInPlatform(dedicatedMetadataItem)
}

export function doesSliderInstanceTypeHaveNodeTypes(
  sliderInstanceType: SliderInstanceType,
): boolean {
  const instanceTypesWithoutNodeTypes = [`kibana`, `apm`, `agent`]
  return !instanceTypesWithoutNodeTypes.includes(sliderInstanceType)
}

export function doesTopologyIncludeMl(
  nodeConfigurations: ElasticsearchClusterTopologyElement[],
): boolean {
  return doesTopologyIncludeNodeType({
    nodeConfigurations,
    sliderInstanceType: `elasticsearch`,
    sliderNodeType: `ml`,
  })
}

export function doesTopologyIncludeNodeType({
  nodeConfigurations,
  sliderInstanceType,
  sliderNodeType,
}: {
  nodeConfigurations: AnyTopologyElement[]
  sliderInstanceType: SliderInstanceType
  sliderNodeType: SliderNodeType
}): boolean {
  // manual checking of both node_type and node_roles here to avoid circular dependency
  return nodeConfigurations.some(
    (topologyElement) =>
      topologyElement[sliderInstanceType] &&
      ((topologyElement as ElasticsearchClusterTopologyElement).node_roles?.includes(
        sliderNodeType as any,
      ) ||
        (topologyElement as ElasticsearchClusterTopologyElement).node_type?.[sliderNodeType]),
  )
}

export function isValidSliderNodeType({
  sliderInstanceType,
  sliderNodeType,
}: {
  sliderInstanceType: SliderInstanceType
  sliderNodeType: string
}): boolean {
  const validSliderNodeTypes = getAllKnownSliderTypes()
    .filter((sliderType) => sliderType.sliderInstanceType === sliderInstanceType)
    .map((sliderType) => sliderType.sliderNodeType)
    .filter(Boolean)

  return validSliderNodeTypes.includes(sliderNodeType)
}
