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

import { get, isEmpty, set, uniqBy } from 'lodash'

import {
  getUpsertVersion,
  getEsPlanFromGet,
  getVersion,
  getVersionOnCreate,
  isSystemOwned,
  getEsNodeConfigurationsFromGet,
  supportsNodeRoles,
  isData,
  getDeploymentSettings,
  getEsNodeConfigurations,
  getFirstEsCluster,
  getEsClusterConfigurationsFromDeploymentRequest,
  getFirstEsResourceFromTemplate,
} from './selectors'

import { doNodeAttributesExist, getInstancesWithoutNodeAttributes } from '../ilm'

import { lt, satisfies } from '../semver'

import { isFeatureActivated } from '../../store'
import { getIlmMigrationLsKey } from '../../constants/localStorageKeys'

import Feature from '../feature'

import {
  DeploymentTemplateInfoV2,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
} from '../api/v1/types'

import {
  InstanceTemplateConfig,
  DeploymentTemplateInstanceTemplateConfig,
  StackDeployment,
  PlainHashMap,
} from '../../types'

export function getCurationFields({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}) {
  const esResources = deployment.resources?.elasticsearch

  if (!esResources) {
    return null
  }

  const [firstEs] = esResources

  const curationPath = [`plan`, `elasticsearch`, `curation`]
  const curationPlan = get(firstEs, curationPath)

  const hotInstanceConfigurationId = get(curationPlan, [`from_instance_configuration_id`])
  const warmInstanceConfigurationId = get(curationPlan, [`to_instance_configuration_id`])

  const settings = getDeploymentSettings({ deployment })
  const indexPatterns = settings && settings.curation ? settings.curation.specs : []

  return {
    hotInstanceConfigurationId,
    warmInstanceConfigurationId,
    indexPatterns,
  }
}

/* Here, we check whether we *could* configure index curation,
   It is assumed that later validation ensures the user picks
   different from/to configurations and at least one non-empty
   index pattern.
*/
export function couldHaveCuration({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): boolean {
  const version = getVersionOnCreate({ deployment })

  // We're not supporting deployments with node roles to be created with index curation
  if (supportsNodeRoles({ version })) {
    return false
  }

  const esNodes = getEsNodeConfigurations({ deployment })
  const esData = esNodes.filter((topologyElement) => isData({ topologyElement }))
  const uniqInstanceConfigs = uniqBy(esData, `instance_configuration_id`)

  return uniqInstanceConfigs.length >= 2
}

export function isIndexCurationTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate: DeploymentTemplateInfoV2
}): boolean {
  const esResource = getFirstEsResourceFromTemplate({
    deploymentTemplate: deploymentTemplate.deployment_template,
  })
  const curationPlan = esResource?.plan.elasticsearch.curation
  const hotInstanceConfigurationId = curationPlan?.from_instance_configuration_id
  const warmInstanceConfigurationId = curationPlan?.to_instance_configuration_id

  return Boolean(hotInstanceConfigurationId && warmInstanceConfigurationId)
}

export { validateIndexCuration } from '../curation'

export const doNodeAttributesExistOnDeployment = (
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest,
): boolean => {
  const dataConfigurations = getEsClusterConfigurationsFromDeploymentRequest({ deployment })
  return dataConfigurations.some((node) => {
    if (!node.elasticsearch) {
      return false
    }

    return !isEmpty(node.elasticsearch.node_attributes)
  })
}

export const hasIlmNodeAttributes = (dataInstances: InstanceTemplateConfig[]): boolean =>
  dataInstances.every(doNodeAttributesExistOnInstance)

function doNodeAttributesExistOnInstance(dataInstance: InstanceTemplateConfig): boolean {
  const { nodeAttributes } = dataInstance
  return !isEmpty(nodeAttributes)
}

export function ensureCorrectIndexManagementSettings({
  deployment,
  deploymentTemplate,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  deploymentTemplate: DeploymentTemplateInfoV2
}): void {
  const esCluster = getFirstEsCluster({ deployment })

  if (!esCluster) {
    return
  }

  const ilmFeature = isFeatureActivated(Feature.ilmFeature)
  const ilmNodeAttributesExist = doNodeAttributesExist(deploymentTemplate)
  const ilmNodeAttributesExistOnDeployment = doNodeAttributesExistOnDeployment(deployment)

  if (!ilmNodeAttributesExist) {
    return
  }

  const version = getUpsertVersion({ deployment })
  const versionIlmCompatible = satisfies(version!, `>=6.7`)
  const ilmCompatible = ilmFeature && versionIlmCompatible

  if (!ilmCompatible) {
    // If the selection is NOT ILM compatible, but ILM node_attributes exist
    // in the template, we need to remove the node_attributes from the
    // template plan to avoid having both ILM and index curation sent with
    // the plan
    const nodeConfigurations = getInstancesWithoutNodeAttributes(deploymentTemplate)

    esCluster.plan.cluster_topology = nodeConfigurations
    return
  }

  // If the deployment has node attributes, we need to remove index curation
  // settings so that ILM is the default index management option
  if (ilmNodeAttributesExistOnDeployment) {
    delete esCluster.plan.elasticsearch.curation
    set(esCluster, [`settings`, `curation`, `specs`], [])
  }
}

export function isPureIndexCurationTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate: DeploymentTemplateInfoV2
}) {
  if (doNodeAttributesExist(deploymentTemplate)) {
    return false
  }

  return isIndexCurationTemplate({ deploymentTemplate })
}

// Not ideal that we have multiple DeploymentTemplate types floating around
// This should be deleted once we have a new deployment templates API
export function isPureIndexCurationDerivedTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate: DeploymentTemplateInstanceTemplateConfig
}) {
  // If nodeAttributes exist
  const dataConfigurations = get(deploymentTemplate, [`data`])

  if (dataConfigurations && dataConfigurations.every((data) => !isEmpty(data.nodeAttributes))) {
    return false
  }

  // If this template has index curation
  return (
    deploymentTemplate.hotInstanceConfigurationId && deploymentTemplate.warmInstanceConfigurationId
  )
}

export function hasIndexCuration({ deployment }: { deployment: StackDeployment }): boolean {
  const plan = getEsPlanFromGet({ deployment })

  if (!plan || !plan.elasticsearch) {
    return false
  }

  const {
    elasticsearch: { curation },
  } = plan

  return Boolean(curation)
}

export function shouldMigrateToIlm({ deployment }: { deployment: StackDeployment }) {
  const version = getVersion({ deployment })

  if (!version) {
    return false
  }

  if (lt(version, `6.7.0`)) {
    return false
  }

  if (isSystemOwned({ deployment })) {
    return false
  }

  if (!hasIndexCuration({ deployment })) {
    return false
  }

  if (localStorage.getItem(getIlmMigrationLsKey({ deploymentId: deployment!.id })) === `true`) {
    return false
  }

  return true
}

export function getNodeAttributesOnWarmNodes({
  deployment,
}: {
  deployment: StackDeployment
}): PlainHashMap[] {
  const plan = getEsPlanFromGet({ deployment })

  if (!plan || !plan.elasticsearch) {
    return []
  }

  const esClusterConfigs = getEsNodeConfigurationsFromGet({ deployment, nodeType: 'data' })
  const {
    elasticsearch: { curation },
  } = plan

  if (!curation) {
    return []
  }

  return esClusterConfigs
    .filter((config) => config.instance_configuration_id === curation.to_instance_configuration_id)
    .map((config) => config?.elasticsearch?.node_attributes || [])
}
