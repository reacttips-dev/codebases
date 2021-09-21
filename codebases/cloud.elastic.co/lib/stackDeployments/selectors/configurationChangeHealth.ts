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

import { get, intersection, isEmpty } from 'lodash'

import { _getPlanInfoFromHistory, getSliderPlanFromGet, getSourceAction } from './fundamentals'

import { isEmptyDeployment } from '../../deployments/conversion'
import { getSupportedSliderInstanceTypes } from '../../sliders/support'

import { AnyResourceInfo, AnyClusterPlanInfo } from '../../../types'

import { DeploymentResources, ElasticsearchClusterPlanInfo } from '../../api/v1/types'

export function hasHealthyEsPlan({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}) {
  const { resources } = deployment
  const [esResource] = resources.elasticsearch

  return hasHealthyResourcePlan({ resource: esResource })
}

export function hasHealthyResourcePlan({ resource }: { resource?: AnyResourceInfo }) {
  // not having a resource is not unhealthy: nothing actually failed
  if (!resource) {
    return true
  }

  return resource.info.plan_info.healthy
}

export function hasUnhealthyIlmMigrationPlan({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const ilmMigrationPlan = getLastPlanOnlyIfIlmMigration({ deployment })
  return ilmMigrationPlan ? !ilmMigrationPlan.healthy : false
}

export function hasHealthyIlmMigrationPlan({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const ilmMigrationPlan = getLastPlanOnlyIfIlmMigration({ deployment })
  return ilmMigrationPlan ? ilmMigrationPlan.healthy : false
}

function getLastPlanOnlyIfIlmMigration({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): ElasticsearchClusterPlanInfo | null {
  const { resources } = deployment
  const [esResource] = resources.elasticsearch

  if (!esResource) {
    return null
  }

  const lastPlan = _getPlanInfoFromHistory({
    resource: esResource,
    mustHealthy: false,
  })

  const lastIlmMigrationPlan = _getPlanInfoFromHistory({
    resource: esResource,
    mustHealthy: false,
    mustMatch: isIlmMigration,
  })

  if (lastPlan !== lastIlmMigrationPlan) {
    return null
  }

  return lastIlmMigrationPlan as ElasticsearchClusterPlanInfo | null

  function isIlmMigration(planInfo: AnyClusterPlanInfo): boolean {
    if (!planInfo.source) {
      return false
    }

    return (
      planInfo.source.action === 'elasticsearch.enable-ilm-cluster' ||
      planInfo.plan_attempt_log.some((step) => step.step_id === `migrate-to-ilm`)
    )
  }
}

export function hasCreatePlan({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const { resources } = deployment

  if (isEmpty(resources)) {
    return false
  }

  const [esResource] = resources.elasticsearch

  if (!esResource) {
    return false
  }

  const { status } = esResource.info
  const initializing = status === `initializing`

  if (initializing) {
    return true
  }

  const pending = hasAnyPendingPlan({ deployment })

  if (!pending) {
    return false
  }

  const pendingFromCreate = hasAnyPendingFromCreate({ deployment })
  return pendingFromCreate
}

function hasAnyPendingPlan({
  deployment,
}: {
  deployment: { resources: DeploymentResources }
}): boolean {
  const { resources } = deployment
  const resourceTypes = intersection(getSupportedSliderInstanceTypes(), Object.keys(resources))

  return resourceTypes.some((resourceType) =>
    getSliderPlanFromGet({ deployment, sliderInstanceType: resourceType, state: `pending` }),
  )
}

function hasAnyPendingFromCreate({
  deployment,
}: {
  deployment: { resources: DeploymentResources }
}): boolean {
  const { resources } = deployment

  const resourceTypes = intersection(getSupportedSliderInstanceTypes(), Object.keys(resources))
  return resourceTypes.some((resourceType) => {
    const plan = getSliderPlanFromGet({ deployment, sliderInstanceType: resourceType })
    const pendingPlan = getSliderPlanFromGet({
      deployment,
      sliderInstanceType: resourceType,
      state: `pending`,
    })
    const active = Boolean(get(plan, [resourceType, `version`]))
    const pending = Boolean(get(pendingPlan, [resourceType, `version`]))
    const emptyPendingPlan = pendingPlan ? isEmptyDeployment(pendingPlan) : true
    const pendingInactiveNonEmptyCreate = pending && !active && !emptyPendingPlan

    if (pendingInactiveNonEmptyCreate) {
      return (
        getSourceAction({ resource: resources[resourceType][0] }) ===
        `deployments.create-deployment`
      )
    }

    return false
  })
}

export function hasFailedCreatePlan({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  return hasCreatePlan({ deployment }) && !hasHealthyEsPlan({ deployment })
}

export function isAnyResourcePlanUnhealthy({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const { resources } = deployment
  const resourceTypes = intersection(getSupportedSliderInstanceTypes(), Object.keys(resources))

  return resourceTypes.some((resourceType) =>
    resources[resourceType].some(
      (resource: AnyResourceInfo) => !hasHealthyResourcePlan({ resource }),
    ),
  )
}
