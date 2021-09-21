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

import { DeploymentCreateRequest, DeploymentObservabilitySettings } from '../../api/v1/types'
import { DeploymentTemplateInstanceTemplateConfig, StackDeployment } from '../../../types'

export function hasEnabledObservability({
  deployment,
}: {
  deployment: DeploymentCreateRequest
}): boolean {
  const { settings } = deployment

  if (!settings) {
    return false
  }

  if (!settings.observability) {
    return false
  }

  return true
}

export function hasEnabledObservabilityOption({
  deployment,
  option,
}: {
  deployment: DeploymentCreateRequest
  option: string
}): boolean {
  const { settings } = deployment

  if (!option) {
    return false
  }

  if (!settings) {
    return false
  }

  if (!settings.observability) {
    return false
  }

  if (settings.observability[option]?.destination) {
    return true
  }

  return false
}

export function hasEnabledObservabilityTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig
}): boolean {
  if (!deploymentTemplate.observability) {
    return false
  }

  return true
}

export function hasEnabledObservabilityTemplateOption({
  deploymentTemplate,
  option,
}: {
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig
  option: string
}): boolean {
  const { observability } = deploymentTemplate

  if (!option) {
    return false
  }

  if (!observability) {
    return false
  }

  if (observability[option]?.destination?.deployment_id) {
    return true
  }

  return false
}

export function hasEnabledMonitoring({ deployment }: { deployment: StackDeployment }): boolean {
  const { settings } = deployment

  const isMonitoring = settings?.observability?.metrics || settings?.observability?.logging

  if (!isMonitoring) {
    return false
  }

  return true
}

export function getObservabilityDeploymentId({
  observability,
}: {
  observability: DeploymentObservabilitySettings
}): string | undefined {
  if (!observability) {
    return undefined
  }

  const monitoringDeploymentId = [
    observability.logging?.destination.deployment_id,
    observability.metrics?.destination.deployment_id,
  ].find(Boolean)

  return monitoringDeploymentId
}
