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

import { fromPairs, cloneDeep, get, omitBy, isEmpty, isUndefined } from 'lodash'

import { getElasticsearchPayloadFromResource, getSliderPayload } from './conversions'
import { filterUnsizedResources, filterUnsupportedEsTiers, removeIllegalProperties } from './crud'
import {
  moveZoneCountInsideTopologyElements,
  sanitizeTransientResourceConfiguration,
} from './sanitize'

import { getRegionId, getFirstEsClusterFromGet, PlanState } from './selectors'

import {
  getSupportedSliderInstanceTypes,
  getSupportedSliderInstanceTypesWithoutEs,
  isSliderInstanceTypeSupportedInTemplate,
} from '../sliders'
import { sanitizeForAutoscaling } from './autoscaling'
import { normalizeNodeRoles } from './nodeRoles'

import { isNonNull } from '../ts-utils'

import {
  AnyNonEsResourceInfo,
  AnyPlan,
  OmitProperties,
  SliderInstanceType,
  StackDeployment,
} from '../../types'

import {
  DeploymentCreateRequest,
  DeploymentMetadata,
  DeploymentSettings,
  DeploymentTemplateInfoV2,
  DeploymentUpdateMetadata,
  DeploymentUpdateRequest,
  DeploymentUpdateResources,
  DeploymentUpdateSettings,
  ElasticsearchPayload,
} from '../api/v1/types'

type ExactDeploymentUpdateMetadata = OmitProperties<
  DeploymentUpdateMetadata,
  OmitProperties<DeploymentMetadata, DeploymentUpdateMetadata>
>

type ExactDeploymentUpdateSettings = OmitProperties<
  DeploymentUpdateSettings,
  OmitProperties<DeploymentSettings, DeploymentUpdateSettings>
>

type SliderPlanTuple = [string, AnyPlan]

// Maps a GET response to our initial state for an update request
export function createUpdateRequestFromGetResponse({
  deployment,
  deploymentTemplate,
  planSourceState,
  planAttemptUnderRetry,
  planAttemptSliderInstanceType = `elasticsearch`,
  omitResources = false,
  pruneOrphans = true,
}: {
  deployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
  planSourceState?: PlanState
  planAttemptUnderRetry?: AnyPlan | null
  planAttemptSliderInstanceType?: SliderInstanceType
  omitResources?: boolean
  pruneOrphans?: boolean
}): DeploymentUpdateRequest {
  const { name, alias, metadata, settings } = deployment

  const updateRequest: DeploymentUpdateRequest = {
    name,
    alias,
    prune_orphans: omitResources ? false : pruneOrphans,
    metadata: getUpdatedMetadata(metadata),
    settings: getUpdatedSettings(settings),
    resources: getUpdatedResources({
      deployment,
      deploymentTemplate,
      planSourceState,
      planAttemptUnderRetry,
      planAttemptSliderInstanceType,
      omitResources,
    }),
  }

  moveZoneCountInsideTopologyElements({ deployment: updateRequest })

  return updateRequest
}

function getUpdatedResources({
  deployment,
  deploymentTemplate,
  planSourceState,
  planAttemptUnderRetry,
  planAttemptSliderInstanceType,
  omitResources,
}: {
  deployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
  planSourceState?: PlanState
  planAttemptUnderRetry?: AnyPlan | null
  planAttemptSliderInstanceType: SliderInstanceType
  omitResources?: boolean
}): DeploymentUpdateResources | undefined {
  if (omitResources) {
    return undefined
  }

  // this clone is super important, otherwise we'd mutate the original response object
  const clonedResources = cloneDeep(deployment.resources)

  const resources: DeploymentUpdateResources = {}

  const esResources = getEsResources()
  const [firstEsResource] = esResources

  if (!isEmpty(esResources)) {
    resources.elasticsearch = esResources
  }

  for (const sliderInstanceType of getSupportedSliderInstanceTypesWithoutEs()) {
    const sliderResources = getSliderResources(sliderInstanceType)

    if (!isEmpty(sliderResources)) {
      resources[sliderInstanceType] = sliderResources
    }
  }

  return resources

  function getEsResources() {
    const { elasticsearch } = clonedResources

    const _esResources = elasticsearch
      .map((resource) =>
        getElasticsearchPayloadFromResource({
          resource,
          planSourceState,
          planAttemptUnderRetry,
          planAttemptSliderInstanceType,
        }),
      )
      .filter(Boolean) as ElasticsearchPayload[]

    return _esResources
  }

  function getSliderResources(sliderInstanceType) {
    const supportedInTemplate = isSliderInstanceTypeSupportedInTemplate(
      sliderInstanceType,
      deploymentTemplate,
    )

    const existingResources: AnyNonEsResourceInfo[] = get(clonedResources, [sliderInstanceType], [])

    // existing clusters, so we base our payload on each of those clusters
    if (!isEmpty(existingResources)) {
      const payloads = existingResources.map((resource) =>
        getSliderPayload({
          sliderInstanceType,
          deploymentTemplate,
          resource,
          planSourceState,
          planAttemptUnderRetry,
          planAttemptSliderInstanceType,
        }),
      )

      const validPayloads = payloads.filter(isNonNull)

      return validPayloads
    }

    /* disabled slider, but the template supports it: make a disabled payload
     * we rely on `firstEsResource` to connect the slider to an ES `ref_id`,
     * and as a hack too (to pick a `region`).
     */
    if (supportedInTemplate) {
      const disabledSliderResource = getSliderPayload({
        sliderInstanceType,
        deploymentTemplate,
        planSourceState,
        planAttemptUnderRetry,
        planAttemptSliderInstanceType,
        templateBlank: true,
        firstEsResource,
      })

      if (disabledSliderResource === null) {
        return []
      }

      return [disabledSliderResource]
    }

    return []
  }
}

function getUpdatedMetadata(
  metadata?: DeploymentMetadata,
): ExactDeploymentUpdateMetadata | undefined {
  if (!metadata) {
    return undefined
  }

  const updateMetadataRequest: ExactDeploymentUpdateMetadata = omitBy(
    {
      system_owned: metadata.system_owned,
      hidden: metadata.hidden,
      tags: metadata.tags,
    },
    isUndefined,
  )

  if (isEmpty(updateMetadataRequest)) {
    return undefined
  }

  return updateMetadataRequest
}

function getUpdatedSettings(
  settings?: DeploymentSettings,
): ExactDeploymentUpdateSettings | undefined {
  if (!settings) {
    return undefined
  }

  const updateSettingsRequest: ExactDeploymentUpdateSettings = omitBy(
    {
      observability: settings.observability,
    },
    isUndefined,
  )

  if (isEmpty(updateSettingsRequest)) {
    return undefined
  }

  return updateSettingsRequest
}

export function sanitizeUpdateRequestBeforeSend<
  T extends DeploymentCreateRequest | DeploymentUpdateRequest,
>({ deployment: editorDeployment }: { deployment: T }): T {
  const deployment = cloneDeep(editorDeployment)

  filterUnsizedResources({ deployment })
  filterUnsupportedEsTiers({ deployment })
  normalizeNodeRoles({ deployment })
  removeIllegalProperties({ deployment })
  sanitizeTransientResourceConfiguration({ deployment })
  sanitizeForAutoscaling({ deployment })

  return deployment
}

// Convenient way of getting the props needed for `ConfigurationChangeExplain`
export function explainChangeDiff({
  deployment,
  currentState,
}: {
  deployment: StackDeployment | null
  currentState: DeploymentUpdateRequest | null
}) {
  const initialState = getChangeDiffInitialState({ deployment })

  return {
    ...getChangeDiffDeploymentProps({ deployment }),
    ...getChangeDiffProps({ editorState: initialState, planSourceKeySuffix: 'PlanPrevSource' }),
    ...getChangeDiffProps({ editorState: currentState, planSourceKeySuffix: 'PlanSource' }),
  }
}

function getChangeDiffInitialState({
  deployment,
}: {
  deployment: StackDeployment | null
}): DeploymentUpdateRequest | null {
  if (!deployment) {
    return null
  }

  const rawInitialState = createUpdateRequestFromGetResponse({
    deployment,
    planSourceState: `current`,
  })

  const initialState = sanitizeUpdateRequestBeforeSend({
    deployment: rawInitialState,
  })

  return initialState
}

function getChangeDiffDeploymentProps({ deployment }: { deployment: StackDeployment | null }) {
  if (!deployment) {
    return {}
  }

  const regionId = getRegionId({ deployment })!
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    return {
      regionId,
    }
  }

  return {
    regionId,
    elasticsearchClusterId: esCluster.id,
  }
}

function getChangeDiffProps({
  editorState,
  planSourceKeySuffix,
}: {
  editorState: DeploymentUpdateRequest | null
  planSourceKeySuffix: 'PlanSource' | 'PlanPrevSource'
}) {
  if (!editorState) {
    return {}
  }

  const { resources } = editorState

  if (!resources) {
    return {}
  }

  const sliderPlans: SliderPlanTuple[] = getSupportedSliderInstanceTypes()
    .map(getSliderPlan)
    .filter(isNonNull)

  const sliderPlanSources = fromPairs(sliderPlans)

  return sliderPlanSources

  function getSliderPlan(sliderInstanceType: SliderInstanceType): SliderPlanTuple | null {
    const sliderResources = resources![sliderInstanceType]

    if (!sliderResources || sliderResources.length === 0) {
      return null
    }

    const [sliderResource] = sliderResources
    const sliderPlan = sliderResource.plan

    return [`${sliderInstanceType}${planSourceKeySuffix}`, sliderPlan]
  }
}

export function getCancelMonitoringPayload({
  hidePrunedOrphans,
}: {
  hidePrunedOrphans: boolean
}): DeploymentUpdateRequest {
  const payload: DeploymentUpdateRequest = {
    prune_orphans: hidePrunedOrphans,
    settings: {
      observability: {},
    },
  }

  return payload
}

export function updateMonitoringPayload({
  monitoringDeploymentId,
  refId,
  logsMonitoring,
  metricsMonitoring,
  hidePrunedOrphans,
}: {
  monitoringDeploymentId: string
  refId: string | null
  logsMonitoring: boolean
  metricsMonitoring: boolean
  hidePrunedOrphans: boolean
}): DeploymentUpdateRequest {
  const loggingInfo = logsMonitoring
    ? {
        destination: {
          deployment_id: monitoringDeploymentId,
          ref_id: refId,
        },
      }
    : null

  const metricsInfo = metricsMonitoring
    ? {
        destination: {
          deployment_id: monitoringDeploymentId,
          ref_id: refId,
        },
      }
    : null

  const observability = {
    observability: {
      metrics: metricsInfo,
      logging: loggingInfo,
    },
  }

  const payload: DeploymentUpdateRequest = {
    prune_orphans: hidePrunedOrphans,
    // @ts-ignore - observability is not yet available, part of log-delivery updates
    settings: observability,
  }

  return payload
}
