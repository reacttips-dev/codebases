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

import { get } from 'lodash'

import {
  getFirstEsClusterFromGet,
  getPlanInfo,
  getDeploymentResources,
  PlanState,
} from './fundamentals'

import { getSupportedSliderInstanceTypes } from '../../sliders/support'
import { isEmptyDeployment } from '../../deployments/conversion'

import { AnyResourceInfo, SliderInstanceType } from '../../../types'

import { DeploymentResources, ClusterPlanStepInfo, ChangeSourceInfo } from '../../api/v1/types'

export function hasOngoingConfigurationChange({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return getSupportedSliderInstanceTypes().some((resourceType) =>
    hasOngoingResourceTypeConfigurationChange({ deployment, resourceType }),
  )
}

export function hasOngoingResourceTypeConfigurationChange({
  deployment,
  resourceType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  resourceType: SliderInstanceType
}): boolean {
  const resources = get(deployment, [`resources`, resourceType], []) as AnyResourceInfo[]
  return resources.some((resource) => hasOngoingResourceConfigurationChange({ resource }))
}

export function hasOngoingResourceConfigurationChange({
  resource,
}: {
  resource: AnyResourceInfo
}): boolean {
  return Boolean(resource.info.plan_info.pending)
}

export function isStarted({ resource }: { resource: AnyResourceInfo }): boolean {
  return resource.info.status === `started`
}

export function isEveryResourceStarted({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return Object.keys(deployment.resources).every((sliderInstanceType) =>
    deployment.resources[sliderInstanceType].every((resource) => isStarted({ resource })),
  )
}

export function isRestarting({ resource }: { resource: AnyResourceInfo }): boolean {
  return resource.info.status === `restarting`
}

export function isForceRestarting({ resource }: { resource: AnyResourceInfo }): boolean {
  const pendingPlanInfo = resource.info.plan_info.pending

  if (!pendingPlanInfo) {
    return false
  }

  const pendingPlan = pendingPlanInfo.plan

  if (!pendingPlan) {
    return false
  }

  if (!pendingPlan.transient || !pendingPlan.transient.plan_configuration) {
    return false
  }

  const forced = pendingPlan.transient.plan_configuration.cluster_reboot === `forced`
  return forced
}

export function isStopping({ resource }: { resource: AnyResourceInfo }): boolean {
  const pendingPlanInfo = resource.info.plan_info.pending

  if (!pendingPlanInfo) {
    return false
  }

  if (resource.info.status === `stopping`) {
    return true
  }

  const pendingPlan = pendingPlanInfo.plan

  if (!pendingPlan) {
    return false
  }

  const stopping = isEmptyDeployment(pendingPlan)
  return stopping
}

export function isStopped({ resource }: { resource: AnyResourceInfo }): boolean {
  return resource.info.status === `stopped`
}

export function isEsRestarting({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const esResource = getFirstEsClusterFromGet({ deployment })

  if (!esResource) {
    return false
  }

  return isRestarting({ resource: esResource })
}

export function isEsForceRestarting({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const esResource = getFirstEsClusterFromGet({ deployment })

  if (!esResource) {
    return false
  }

  return isForceRestarting({ resource: esResource })
}

export function isEsStopping({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const esResource = getFirstEsClusterFromGet({ deployment })

  if (!esResource) {
    return false
  }

  return isStopping({ resource: esResource })
}

export function isEsStopped({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const esResource = getFirstEsClusterFromGet({ deployment })

  if (!esResource) {
    return false
  }

  return isStopped({ resource: esResource })
}

export function isAnyResourceChanging({
  deployment,
}: {
  deployment: { resources: DeploymentResources }
}): boolean {
  return getDeploymentResources({ deployment }).some((resource) =>
    hasOngoingResourceConfigurationChange({ resource }),
  )
}

export function isAnyRestarting({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return getDeploymentResources({ deployment }).some((resource) => isRestarting({ resource }))
}

export function isAnyForceRestarting({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return getDeploymentResources({ deployment }).some((resource) => isForceRestarting({ resource }))
}

export function isAnyStopping({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return getDeploymentResources({ deployment }).some((resource) => isStopping({ resource }))
}

export function isAnyStopped({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return getDeploymentResources({ deployment }).some((resource) => isStopped({ resource }))
}

export function getPlanLog({
  resource,
  state,
}: {
  resource: AnyResourceInfo
  state?: PlanState
}): ClusterPlanStepInfo[] {
  const planInfo = getPlanInfo({ resource: resource as any, state })

  if (!planInfo || !Array.isArray(planInfo.plan_attempt_log)) {
    return []
  }

  return planInfo.plan_attempt_log
}

export function getPendingSource({
  resource,
}: {
  resource: AnyResourceInfo
}): ChangeSourceInfo | null {
  const planInfo = getPlanInfo({ resource: resource as any, state: `pending` })

  if (!planInfo || !planInfo.source) {
    return null
  }

  return planInfo.source
}
