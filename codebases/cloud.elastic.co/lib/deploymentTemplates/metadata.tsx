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

import { SliderInstanceType } from '../../types'

import { MetadataItem, GlobalDeploymentTemplateInfo } from '../api/v1/types'

// Hides default templates in userconsole
export function isHiddenTemplate(template: { metadata?: MetadataItem[] }): boolean {
  if (!template.metadata) {
    return false
  }

  return template.metadata.some((item) => item.key === `hidden` && item.value === `true`)
}

export function isTrialEligibleTemplate(template: { metadata?: MetadataItem[] }): boolean {
  if (!template.metadata) {
    return false
  }

  return template.metadata.some((item) => item.key === `trial-eligible` && item.value === `true`)
}

export function isRecommendedTemplate(template: { metadata?: MetadataItem[] }): boolean {
  if (!template.metadata) {
    return false
  }

  return template.metadata.some((item) => item.key === `recommended` && item.value === `true`)
}

export function getDedicatedTemplateType(
  deploymentTemplate: { metadata?: MetadataItem[] } | undefined,
): SliderInstanceType | null {
  if (deploymentTemplate == null) {
    return null
  }

  const dedicatedMetadataValue = getTemplateMetadataItem(deploymentTemplate, `cluster_dedicated`)
  return dedicatedMetadataValue as SliderInstanceType | null
}

export function isBetaTemplate(deploymentTemplate: GlobalDeploymentTemplateInfo): boolean {
  const betaTemplates: SliderInstanceType[] = [] // none at present
  const dedicatedType = getDedicatedTemplateType(deploymentTemplate) || ``
  return betaTemplates.includes(dedicatedType)
}

export function getTemplateMetadataItem(
  deploymentTemplate: { metadata?: MetadataItem[] } | undefined,
  key: string,
): string | null {
  const dedicatedMetadataItem = deploymentTemplate?.metadata?.find((item) => item.key === key)

  if (!dedicatedMetadataItem) {
    return null
  }

  return dedicatedMetadataItem.value
}
