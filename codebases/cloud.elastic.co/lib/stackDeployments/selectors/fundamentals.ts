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

import { find, findLast, get, isEmpty, flatMap } from 'lodash'

import { getSupportedSliderInstanceTypes } from '../../sliders/support'
import { getPlatform } from '../../platform'
import { isEnabledConfiguration } from '../../deployments/conversion'

import { getEsPlan } from './stackDeployment'
import { getAllKnownSliderInstanceTypes } from '../../sliders/sliders'

import {
  AnyClusterPlanInfo,
  AnyPayload,
  AnyPlan,
  AnyPlanConfiguration,
  AnyResourceInfo,
  AnyTopologyElement,
  SliderInstanceType,
  StackDeployment,
  VersionNumber,
} from '../../../types'

import {
  ApmPlan,
  ApmPlanInfo,
  ApmResourceInfo,
  ApmTopologyElement,
  AppSearchPlan,
  AppSearchPlanInfo,
  AppSearchResourceInfo,
  AppSearchTopologyElement,
  DeploymentCreateRequest,
  DeploymentCreateResources,
  DeploymentResource,
  DeploymentResources,
  DeploymentUpdateRequest,
  ElasticsearchClusterPlan,
  ElasticsearchClusterPlanInfo,
  ElasticsearchClusterSettings,
  ElasticsearchClusterTopologyElement,
  ElasticsearchResourceInfo,
  EnterpriseSearchResourceInfo,
  EnterpriseSearchTopologyElement,
  KibanaClusterPlan,
  KibanaClusterPlanInfo,
  KibanaClusterTopologyElement,
  KibanaResourceInfo,
} from '../../api/v1/types'

export type PlanState =
  | 'best_effort'
  | 'current'
  | 'genesis'
  | 'last_attempt'
  | 'last_history_attempt'
  | 'last_success'
  | 'most_recent'
  | 'pending'
  | 'previous_success'

interface GetPlanInfo {
  (params: { resource: AnyResourceInfo; state?: PlanState }): AnyClusterPlanInfo | null
  (params: {
    resource: ElasticsearchResourceInfo
    state?: PlanState
  }): ElasticsearchClusterPlanInfo | null
  (params: { resource: KibanaResourceInfo; state?: PlanState }): KibanaClusterPlanInfo | null
  (params: { resource: ApmResourceInfo; state?: PlanState }): ApmPlanInfo | null
}

interface GetTopology {
  (params: { resource: ElasticsearchResourceInfo }): ElasticsearchClusterTopologyElement[]
  (params: { resource: KibanaResourceInfo }): KibanaClusterTopologyElement[]
  (params: { resource: ApmResourceInfo }): ApmTopologyElement[]
  (params: { resource: AppSearchResourceInfo }): AppSearchTopologyElement[]
  (params: { resource: EnterpriseSearchResourceInfo }): EnterpriseSearchTopologyElement[]
  (params: { resource: any }): any[]
}

interface GetResources {
  (params: {
    deployment: DeploymentCreateRequest | DeploymentUpdateRequest
    resourceTypes?: string[]
  }): AnyPayload[]
  (params: { deployment: StackDeployment; resourceTypes?: string[] }): AnyResourceInfo[]
}

export function getVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const lastPlanAttempt = getEsPlanFromGet({
    deployment,
    state: `best_effort`,
  })

  return getPlanVersion({ plan: lastPlanAttempt })
}

export function getVersionOnCreate({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): string | null {
  if (!deployment) {
    return null
  }

  const plan = getEsPlan({
    deployment,
  })

  return getPlanVersion({ plan })
}

export function getKibanaVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const { resources } = deployment
  const [resource] = resources.kibana

  return getResourceVersion({ resource })
}

export function getResourceVersion({
  resource,
}: {
  resource: AnyResourceInfo | null | undefined
}): string | null {
  if (!resource) {
    return null
  }

  const planInfo = getPlanInfo({
    resource,
    state: `best_effort`,
  }) as AnyClusterPlanInfo | null

  return getPlanVersion({ plan: planInfo?.plan })
}

export function getPlanVersion({
  plan,
}: {
  plan: AnyPlan | null | undefined
}): VersionNumber | null {
  if (!plan) {
    return null
  }

  // Brute-forcing the lookup here to avoid constantly having to pass instance
  // types around when we know each resource is dedicated to one.
  for (const sliderInstanceType of getAllKnownSliderInstanceTypes()) {
    if (plan[sliderInstanceType]) {
      return (plan[sliderInstanceType].version as VersionNumber) || null
    }
  }

  return null
}

export function getCloudId({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | undefined {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    return undefined
  }

  return esCluster.info.metadata.cloud_id
}

export function getClusterPlanInfo({
  deployment,
  sliderInstanceType,
  state = `current`,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
  state?: PlanState
}): AnyClusterPlanInfo | null {
  const resource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType })

  if (!resource) {
    return null
  }

  const planInfo = getPlanInfo({ resource, state })

  return planInfo
}

export function getSliderPlanFromGet<TPlan extends AnyPlan>({
  deployment,
  sliderInstanceType,
  state = `current`,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
  state?: PlanState
}): TPlan | null {
  const planInfo = getClusterPlanInfo({
    deployment,
    sliderInstanceType,
    state,
  })

  if (planInfo === null) {
    return null
  }

  const plan = getPlanFromPlanInfo(planInfo) as TPlan | null

  return plan
}

export function getEsPlanFromGet({
  deployment,
  state = `current`,
}: {
  deployment: {
    resources: DeploymentResources
  }
  state?: PlanState
}): ElasticsearchClusterPlan | null {
  return getSliderPlanFromGet<ElasticsearchClusterPlan>({
    deployment,
    state,
    sliderInstanceType: `elasticsearch`,
  })
}

export function getSourceAction({ resource }: { resource: AnyResourceInfo }) {
  return resource.info.plan_info.pending?.source?.action
}

function getPlanFromPlanInfo(planInfo?: AnyClusterPlanInfo): AnyPlan | null
function getPlanFromPlanInfo(
  planInfo?: ElasticsearchClusterPlanInfo,
): ElasticsearchClusterPlan | null
function getPlanFromPlanInfo(planInfo?: KibanaClusterPlanInfo): KibanaClusterPlan | null
function getPlanFromPlanInfo(planInfo?: ApmPlanInfo): ApmPlan | null
function getPlanFromPlanInfo(planInfo?: AppSearchPlanInfo): AppSearchPlan | null
function getPlanFromPlanInfo(planInfo?: AnyClusterPlanInfo): AnyPlan | null {
  if (!planInfo) {
    return null
  }

  if (!planInfo.plan) {
    return null
  }

  return planInfo.plan
}

export function getFirstEsClusterFromGet({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): ElasticsearchResourceInfo | null {
  if (isEmpty(deployment.resources.elasticsearch)) {
    return null
  }

  const [firstEs] = deployment.resources.elasticsearch

  return firstEs || null
}

export function getFirstSliderClusterFromGet<TCluster = AnyResourceInfo>({
  deployment,
  sliderInstanceType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
}): TCluster | null {
  if (isEmpty(deployment.resources[sliderInstanceType])) {
    return null
  }

  const [firstCluster] = deployment.resources[sliderInstanceType]

  return firstCluster || null
}

// intended for `DeploymentGetResponse`, `DeploymentSearchResponse` objects
export function getRegionId({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    return null
  }

  return esCluster.region
}

// intended for `DeploymentCreateRequest` objects
export function getRegionIdForCreate({
  deployment,
}: {
  deployment: {
    resources: DeploymentCreateResources
  }
}): string | null {
  const esResources = deployment.resources?.elasticsearch

  if (!esResources) {
    return null
  }

  const [firstEs] = esResources

  return firstEs.region
}

// intended for `DeploymentCreateResponse`, `DeploymentUpdateResponse` objects
export function getRegionIdAfterCrUp({
  deployment,
}: {
  deployment: {
    resources: DeploymentResource[]
  }
}): string | null {
  for (const resource of deployment.resources) {
    if (resource.region) {
      return resource.region
    }
  }

  return null
}

export function getPlatformId({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const regionId = getRegionId({ deployment })

  if (regionId === null) {
    return null
  }

  return getPlatform(regionId)
}

export const getPlanInfo: GetPlanInfo = ({
  resource,
  state = `current`,
}: {
  resource: any
  state?: PlanState
}) => {
  /*
   * The `best_effort` selector is most useful when you need a best effort result.
   * For example, when we want to ascertain the version for a deployment, the best option
   * would be to look at the last successful plan. A second choice might be looking
   * at the last unsuccessful attempt, like in the case of failed genesis plans.
   * A third choice would be the currently pending plan, which hasn't even finalized yet.
   */
  if (state === `best_effort`) {
    return (
      getPlanInfo({ resource, state: `last_success` }) ||
      getPlanInfo({ resource, state: `last_attempt` }) ||
      getPlanInfo({ resource, state: `pending` })
    )
  }

  const planInfos = resource.info.plan_info

  if (state === `most_recent`) {
    const pendingPlan = planInfos.pending

    if (pendingPlan) {
      return pendingPlan
    }

    return getPlanInfo({ resource, state: `last_success` })
  }

  if (state === `last_success`) {
    const currentPlan = planInfos.current

    if (currentPlan && currentPlan.healthy) {
      return currentPlan
    }

    return _getPlanInfoFromHistory({ resource })
  }

  if (state === `previous_success`) {
    const currentPlan = planInfos.current as AnyClusterPlanInfo

    return _getPlanInfoFromHistory({
      resource,
      mustMatch: (planInfo) =>
        // exclude current plan
        !currentPlan.plan_attempt_id || planInfo.plan_attempt_id !== currentPlan.plan_attempt_id,
    })
  }

  if (state === `last_attempt`) {
    const currentPlan = planInfos.current

    if (currentPlan && !currentPlan.healthy) {
      return currentPlan
    }

    return getPlanInfo({ resource, state: `last_history_attempt` })
  }

  if (state === `last_history_attempt`) {
    return _getPlanInfoFromHistory({ resource, mustHealthy: false })
  }

  if (state === `genesis`) {
    const genesisPlanFromHistory = _getPlanInfoFromHistory({ resource, matchOldestFirst: true })

    if (genesisPlanFromHistory) {
      return genesisPlanFromHistory
    }

    const pendingPlan = planInfos.pending

    if (pendingPlan) {
      return pendingPlan
    }

    return null
  }

  const planInfo = planInfos[state]

  if (planInfo) {
    return planInfo
  }

  return null
}

export function _getPlanInfoFromHistory({
  resource,
  mustHealthy = true,
  mustMatch,
  matchOldestFirst = false,
}: {
  resource: AnyResourceInfo
  mustHealthy?: boolean
  mustMatch?: (planInfo: AnyClusterPlanInfo) => boolean
  matchOldestFirst?: boolean
}) {
  const findPlan = matchOldestFirst ? find : findLast
  const plans = resource.info.plan_info.history
  const planInfo = findPlan(plans, matchesCriteria)

  if (!planInfo) {
    return null
  }

  return planInfo

  function matchesCriteria(planInfo: AnyClusterPlanInfo) {
    const healthMatch = mustHealthy !== true || planInfo.healthy
    const clauseMatch = mustMatch === undefined || mustMatch(planInfo)
    return healthMatch && clauseMatch
  }
}

export function getHealthyPlanInfoFromHistory({ resource }: { resource: AnyResourceInfo }) {
  // Check for healthy plans that are sized
  const healthySizedPlan = _getPlanInfoFromHistory({
    resource,
    mustHealthy: true,
    mustMatch: (planInfo) => !!planInfo.plan && isSizedPlan(planInfo.plan),
  })

  if (healthySizedPlan) {
    return healthySizedPlan
  }

  // If none match both criteria, prioritise healthy plans first
  const healthyPlan = _getPlanInfoFromHistory({
    resource,
    mustHealthy: true,
  })

  if (healthyPlan) {
    return healthyPlan
  }

  // In case there are no healthy plans (genesis plan was aborted), check for any non-zero plans that exist
  return _getPlanInfoFromHistory({
    resource,
    mustMatch: (planInfo) => !!planInfo.plan && isSizedPlan(planInfo.plan),
  })
}

export const getTopology: GetTopology = ({ resource }) => {
  const planInfo = resource.info.plan_info.current

  if (!planInfo) {
    return []
  }

  const { plan } = planInfo

  if (!plan) {
    return []
  }

  return plan.cluster_topology || []
}

export const getSizedTopology: GetTopology = ({ resource }) =>
  getTopology({ resource }).filter(isEnabledConfiguration)

export function hasSizedSliderResource({
  deployment,
  resourceType,
}: {
  deployment: StackDeployment
  resourceType: SliderInstanceType
}): boolean {
  const resources: AnyResourceInfo[] = deployment.resources[resourceType]
  return resources.some((resource) => isSizedSliderResource({ resource }))
}

export function isSizedSliderResource({ resource }: { resource: AnyResourceInfo }): boolean {
  const planInfo = resource.info.plan_info.current

  if (!planInfo) {
    return false
  }

  const { plan } = planInfo

  if (!plan) {
    return false
  }

  return isSizedPlan(plan)
}

export function isSizedPlan(plan: AnyPlan): boolean {
  const nodeConfigurations = plan.cluster_topology
  return isSizedTopology(nodeConfigurations)
}

function isSizedTopology(nodeConfigurations: AnyTopologyElement[] | undefined): boolean {
  const emptyResource = isEmpty(nodeConfigurations)

  if (emptyResource) {
    return false
  }

  return nodeConfigurations!.some(isEnabledConfiguration)
}

export function isSliderPlanActive(
  plan: AnyClusterPlanInfo | null,
  sliderInstanceType: SliderInstanceType,
): boolean {
  const configuration: AnyPlanConfiguration = get(plan, [`plan`, sliderInstanceType])

  if (!configuration) {
    return false
  }

  return configuration.version !== null
}

export const getResources: GetResources = ({ deployment, resourceTypes }) => {
  const sliderInstanceTypes = Array.isArray(resourceTypes)
    ? resourceTypes
    : Object.keys(deployment.resources)

  return flatMap(
    sliderInstanceTypes,
    (sliderInstanceType) => deployment.resources[sliderInstanceType],
  )
}

export const getResourceById = ({
  deployment,
  resourceType,
  resourceId,
}: {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  resourceId: string
}): AnyResourceInfo | undefined =>
  find<AnyResourceInfo>(deployment.resources[resourceType], { id: resourceId })

export const getResourceByRefId = ({
  deployment,
  resourceType,
  refId,
}: {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  refId: string
}): AnyResourceInfo | undefined =>
  find<AnyResourceInfo>(deployment.resources[resourceType], { ref_id: refId })

export const getFirstResourceType = ({
  deployment,
}: {
  deployment: StackDeployment
}): SliderInstanceType => Object.keys(deployment.resources)[0]

export function getDeploymentResources({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): AnyResourceInfo[] {
  return flatMap(
    getSupportedSliderInstanceTypes(),
    (sliderInstanceType) => deployment.resources[sliderInstanceType],
  )
}

export function getDeploymentSettingsFromGet({
  deployment,
}: {
  deployment: StackDeployment
}): ElasticsearchClusterSettings | null {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (esCluster === null) {
    return null
  }

  return esCluster.info.settings || null
}
