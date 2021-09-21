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

import { cloneDeep, merge, isEmpty } from 'lodash'

import { getBlankPlan, getBlankNodeConfigurationPerTemplate } from './templateBlanks'
import { getPlanInfo, PlanState, getFirstSliderResourceFromTemplate } from './selectors'
import { setDefaultStrategy } from './strategies'

import { AnyPlan, AnyNonEsResourceInfo, SliderInstanceType, SliderPayload } from '../../types'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterPlan,
  ElasticsearchPayload,
  ElasticsearchResourceInfo,
} from '../api/v1/types'

type GetPlanAttemptEs = {
  sliderInstanceType: 'elasticsearch'
  planAttemptSliderInstanceType: SliderInstanceType
  planAttemptUnderRetry?: AnyPlan | null
}

type GetPlanAttempt = {
  sliderInstanceType: SliderInstanceType
  planAttemptSliderInstanceType: SliderInstanceType
  planAttemptUnderRetry?: AnyPlan | null
}

export function getElasticsearchPayloadFromResource({
  resource,
  planSourceState = `best_effort`,
  planAttemptUnderRetry,
  planAttemptSliderInstanceType = `elasticsearch`,
}: {
  resource: ElasticsearchResourceInfo
  planSourceState?: PlanState
  planAttemptUnderRetry?: AnyPlan | null
  planAttemptSliderInstanceType?: SliderInstanceType
}): ElasticsearchPayload | null {
  const { region } = resource
  const esPlan = getEsPlan()

  if (esPlan === null) {
    return null
  }

  return {
    region,
    ref_id: resource.ref_id,
    plan: esPlan,
  }

  function getEsPlan(): ElasticsearchClusterPlan | null {
    const planAttempt = getPlanAttempt({
      sliderInstanceType: `elasticsearch`,
      planAttemptSliderInstanceType,
      planAttemptUnderRetry,
    })

    if (planAttempt) {
      const plan = cloneDeep(planAttempt)
      return plan
    }

    const planInfo = getPlanInfo({
      resource,
      state: planSourceState,
    })

    if (!planInfo) {
      return null
    }

    const { plan } = planInfo

    if (!plan) {
      return null
    }

    delete plan.transient

    setDefaultStrategy({ plan })

    return plan as ElasticsearchClusterPlan
  }
}

export function getSliderPayload({
  sliderInstanceType,
  deploymentTemplate,
  resource,
  planSourceState = `best_effort`,
  planAttemptUnderRetry,
  planAttemptSliderInstanceType,
  templateBlank = false,
  firstEsResource,
}: {
  sliderInstanceType: SliderInstanceType
  deploymentTemplate?: DeploymentTemplateInfoV2
  resource?: AnyNonEsResourceInfo
  planSourceState?: PlanState
  planAttemptUnderRetry?: AnyPlan | null
  planAttemptSliderInstanceType: SliderInstanceType
  templateBlank?: boolean
  firstEsResource?: ElasticsearchPayload
}): SliderPayload | null {
  if (templateBlank) {
    return getBlankTemplatePlan()
  }

  return getClusterUpdatePlan()

  function getBlankTemplatePlan(): SliderPayload | null {
    if (!deploymentTemplate) {
      return null
    }

    const sliderResource = getFirstSliderResourceFromTemplate({
      deploymentTemplate: deploymentTemplate.deployment_template,
      sliderInstanceType,
    })

    if (!sliderResource) {
      return null
    }

    const { plan: templatePlan } = sliderResource

    const basePlan = getBlankPlan({ plan: templatePlan })
    const plan = getSliderPlan(basePlan)

    if (plan === null) {
      return null
    }

    const { region, ref_id } = firstEsResource!

    return {
      region,
      ref_id: `main-${sliderInstanceType}`,
      elasticsearch_cluster_ref_id: ref_id,
      plan,
    }
  }

  function getClusterUpdatePlan(): SliderPayload | null {
    const { region, ref_id, elasticsearch_cluster_ref_id } = resource!
    const basePlanInfo = getPlanInfo({
      resource: resource!,
      state: planSourceState,
    })

    if (!basePlanInfo) {
      return null
    }

    const basePlan = basePlanInfo.plan
    const plan = getSliderPlan(basePlan)

    if (plan === null) {
      return null
    }

    return {
      region,
      ref_id,
      elasticsearch_cluster_ref_id,
      plan,
    }
  }

  function getSliderPlan(basePlan: AnyPlan | null = null): AnyPlan | null {
    const planAttempt = getPlanAttempt({
      sliderInstanceType,
      planAttemptSliderInstanceType,
      planAttemptUnderRetry,
    })

    if (planAttempt) {
      return cloneDeep(planAttempt)
    }

    if (basePlan) {
      delete basePlan.transient

      setDefaultStrategy({ plan: basePlan })

      if (
        sliderInstanceType !== `kibana` &&
        deploymentTemplate &&
        isEmpty(basePlan.cluster_topology)
      ) {
        merge(
          basePlan,
          getBlankNodeConfigurationPerTemplate({
            sliderInstanceType,
            deploymentTemplate,
          }),
        )
      }
    }

    return basePlan
  }
}

function getPlanAttempt({
  sliderInstanceType,
  planAttemptSliderInstanceType,
  planAttemptUnderRetry,
}: GetPlanAttemptEs): ElasticsearchClusterPlan | null | undefined
function getPlanAttempt({
  sliderInstanceType,
  planAttemptSliderInstanceType,
  planAttemptUnderRetry,
}: GetPlanAttempt): AnyPlan | null | undefined
function getPlanAttempt({
  sliderInstanceType,
  planAttemptSliderInstanceType,
  planAttemptUnderRetry,
}: GetPlanAttempt): AnyPlan | null | undefined {
  if (planAttemptSliderInstanceType !== sliderInstanceType) {
    return null
  }

  return planAttemptUnderRetry
}
