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

import { find, isEmpty, size, some, uniqBy } from 'lodash'

import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  ElasticsearchClusterSettings,
  DeploymentTemplateInfoV2,
  ClusterCurationSpec,
} from '../api/v1/types'

import { DeploymentTemplateInstanceTemplateConfig, ElasticsearchCluster } from '../../types'

export enum IndexCurationValidationErrors {
  MISSING_HOT = 'MISSING_HOT',
  MISSING_WARM = 'MISSING_WARM',
  SAME_CONFIGURATION_HOT_WARM = 'SAME_CONFIGURATION_HOT_WARM',
  NO_INDEX_PATTERNS = 'NO_INDEX_PATTERNS',
  EMPTY_INDEX_PATTERN = 'EMPTY_INDEX_PATTERN',
}

export type IndexHalflife = {
  amount: number
  type: 'hours' | 'days' | 'weeks' | 'months'
}

type DataConfigurationParams = {
  dataNodeConfigurations: ElasticsearchClusterTopologyElement[]
  instanceConfigurations: InstanceConfiguration[]
}

export function getCurationConfigurationOptions({
  dataNodeConfigurations,
  instanceConfigurations,
}: DataConfigurationParams): Array<{
  id: string
  name: string
}> {
  const nonEmptyDataConfigurations = dataNodeConfigurations.filter(isNotEmpty)
  const uniqueDataConfigurations = uniqBy(nonEmptyDataConfigurations, `instance_configuration_id`)

  return uniqueDataConfigurations.map((nodeConfiguration) => {
    const { instance_configuration_id } = nodeConfiguration

    const instanceConfiguration = find(instanceConfigurations, {
      id: instance_configuration_id,
    })

    const { id = ``, name = `` } = instanceConfiguration || {}

    return {
      id,
      name,
    }
  })
}

/* Here, we check whether we *could* configure index curation,
   It is assumed that later validation ensures the user picks
   different from/to configurations and at least one non-empty
   index pattern.
*/
export function couldHaveCuration({
  dataNodeConfigurations,
  instanceConfigurations,
}: DataConfigurationParams): boolean {
  const options = getCurationConfigurationOptions({
    dataNodeConfigurations,
    instanceConfigurations,
  })

  return options.length >= 2
}

function isNotEmpty(nodeConfiguration): boolean {
  return nodeConfiguration.size && nodeConfiguration.size.value !== 0
}

export function getIndexHalflifeFromSeconds(seconds: number): IndexHalflife {
  const minutes = seconds / 60
  const hours = Math.max(minutes / 60, 1)
  const days = hours / 24

  const months = days / 30

  if (months % 1 === 0) {
    return {
      amount: months,
      type: `months`,
    }
  }

  const weeks = days / 7

  if (weeks % 1 === 0) {
    return {
      amount: weeks,
      type: `weeks`,
    }
  }

  if (days % 1 === 0) {
    return {
      amount: days,
      type: `days`,
    }
  }

  return {
    amount: Math.ceil(hours),
    type: `hours`,
  }
}

export function getCurationFields({
  deploymentTemplate,
  settings,
}: {
  deploymentTemplate: DeploymentTemplateInfoV2
  settings: ElasticsearchClusterSettings
}): {
  hotInstanceConfigurationId: string | undefined
  warmInstanceConfigurationId: string | undefined
  indexPatterns: ClusterCurationSpec[]
} {
  const esResource = deploymentTemplate.deployment_template.resources.elasticsearch?.[0]
  const curationPlan = esResource?.plan.elasticsearch.curation

  const hotInstanceConfigurationId = curationPlan?.from_instance_configuration_id
  const warmInstanceConfigurationId = curationPlan?.to_instance_configuration_id

  return {
    hotInstanceConfigurationId,
    warmInstanceConfigurationId,
    indexPatterns: settings.curation?.specs || [],
  }
}

export function validateIndexCuration(
  deploymentTemplate: Partial<DeploymentTemplateInstanceTemplateConfig> | null,
): IndexCurationValidationErrors[] {
  const errors: IndexCurationValidationErrors[] = []

  if (deploymentTemplate === null) {
    return errors
  }

  const { indexPatterns, hotInstanceConfigurationId, warmInstanceConfigurationId } =
    deploymentTemplate

  if (size(indexPatterns) < 1) {
    errors.push(IndexCurationValidationErrors.NO_INDEX_PATTERNS)
  }

  if (some(indexPatterns, (pattern) => isEmpty(pattern.index_pattern.trim()))) {
    errors.push(IndexCurationValidationErrors.EMPTY_INDEX_PATTERN)
  }

  if (!hotInstanceConfigurationId) {
    errors.push(IndexCurationValidationErrors.MISSING_HOT)
  }

  if (!warmInstanceConfigurationId) {
    errors.push(IndexCurationValidationErrors.MISSING_WARM)
  }

  if (
    hotInstanceConfigurationId &&
    warmInstanceConfigurationId &&
    hotInstanceConfigurationId === warmInstanceConfigurationId
  ) {
    errors.push(IndexCurationValidationErrors.SAME_CONFIGURATION_HOT_WARM)
  }

  return errors
}

export function isCurationEnabled(cluster: ElasticsearchCluster): boolean {
  const {
    curation: {
      plan: { from_instance_configuration_id, to_instance_configuration_id },
    },
  } = cluster

  const enabled = from_instance_configuration_id && to_instance_configuration_id

  return enabled
}
