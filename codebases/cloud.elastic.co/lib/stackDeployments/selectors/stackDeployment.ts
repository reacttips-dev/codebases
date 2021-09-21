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

import { isEmpty, get, size } from 'lodash'

import { getScriptingFromPlan } from '../../deployments/plan'

import { AnyTopologyElement, SliderInstanceType, AnyPlan, Scripting } from '../../../types'

import {
  ApmPlan,
  DeploymentCreateRequest,
  DeploymentGetResponse,
  DeploymentUpdateRequest,
  ElasticsearchClusterPlan,
  ElasticsearchClusterSettings,
  ElasticsearchPayload,
  KibanaClusterPlan,
} from '../../api/v1/types'

export function getFirstSliderCluster({
  deployment,
  sliderInstanceType,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType: SliderInstanceType
}) {
  if (isEmpty(deployment.resources![sliderInstanceType])) {
    return null
  }

  const [firstCluster] = deployment.resources![sliderInstanceType]

  return firstCluster || null
}

export function getFirstEsCluster({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): ElasticsearchPayload | null {
  return getFirstSliderCluster({ deployment, sliderInstanceType: `elasticsearch` })
}

export function getSliderPlan({
  deployment,
  sliderInstanceType,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType: SliderInstanceType
}) {
  const cluster = getFirstSliderCluster({ deployment, sliderInstanceType })

  if (cluster === null) {
    return null
  }

  return cluster.plan
}

export function getEsPlan({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): ElasticsearchClusterPlan | null {
  return getSliderPlan({ deployment, sliderInstanceType: `elasticsearch` })
}

export function getKibPlan({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): KibanaClusterPlan | null {
  return getSliderPlan({ deployment, sliderInstanceType: `kibana` })
}

export function getApmPlan({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): ApmPlan | null {
  return getSliderPlan({ deployment, sliderInstanceType: `apm` })
}

export function getDeploymentSettings({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): ElasticsearchClusterSettings | null {
  const esCluster = getFirstEsCluster({ deployment })

  if (esCluster === null) {
    return null
  }

  return esCluster.settings || null
}

export function getGettingStartedType({
  deployment,
}: {
  deployment: DeploymentGetResponse
}): SliderInstanceType {
  const enterpriseSearch = get(deployment, [`resources`, `enterprise_search`])
  const appSearch = get(deployment, [`resources`, `appsearch`])
  const kibana = get(deployment, [`resources`, `kibana`])

  // If a deployment contains enterprise_search, we show them an enterprise_search gif
  if (!isEmpty(enterpriseSearch)) {
    return `enterprise_search`
  }

  // If a deployment contains appSearch, we show them an appSearch gif
  if (!isEmpty(appSearch)) {
    return `appsearch`
  }

  // Otherwise, show Kibana
  if (!isEmpty(kibana)) {
    return `kibana`
  }

  // For all other cases (ECE), we'll show the ES experience
  return `elasticsearch`
}

export function getSliderUserSettings({
  sliderInstanceType,
  plan,
  nodeConfiguration,
}: {
  sliderInstanceType: SliderInstanceType
  plan: AnyPlan
  nodeConfiguration: AnyTopologyElement
}): string | undefined {
  // right now we're handling appsearch as if it doesn't have nodes for
  // the purposes of settings -- this will change to
  // doesSliderInstanceTypeHaveNodeTypes(sliderInstanceType) when we amend
  // the UI to handle nodes separately for appsearch
  const hasNodes = sliderInstanceType === `elasticsearch`

  if (hasNodes) {
    // use node-level configuration object
    return (nodeConfiguration[sliderInstanceType] || {}).user_settings_yaml
  }

  // use plan-level configuration object
  return (plan[sliderInstanceType] || {}).user_settings_yaml
}

export function getPlugins({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): string[] {
  const plan = getEsPlan({ deployment })

  if (!plan) {
    return []
  }

  // Assumption: plugins are always identical across instance configurations.
  for (const nodeConfiguration of plan.cluster_topology) {
    const plugins =
      nodeConfiguration.elasticsearch && nodeConfiguration.elasticsearch.enabled_built_in_plugins

    if (size(plugins) > 0) {
      return plugins!
    }
  }

  return []
}

export function getScripting({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): Scripting {
  const plan = getEsPlan({ deployment })!
  return getScriptingFromPlan(plan)
}
