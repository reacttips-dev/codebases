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
import { isEmpty, size } from 'lodash'

import { hasNodeType } from './stackDeployments/selectors'
import { getTopologiesFromTemplate } from './deploymentTemplates/getTopologiesFromTemplate'

import { DeploymentTemplateInfoV2, ElasticsearchClusterTopologyElement } from '../lib/api/v1/types'
import { DeploymentTemplateInstanceTemplateConfig } from '../types'

export const getInstancesWithoutNodeAttributes = (
  deploymentTemplate?: DeploymentTemplateInfoV2 | null,
): ElasticsearchClusterTopologyElement[] => {
  if (!deploymentTemplate) {
    return []
  }

  const nodeConfigurations = getTopologiesFromTemplate({
    deploymentTemplate: deploymentTemplate?.deployment_template,
    sliderInstanceType: `elasticsearch`,
  })

  nodeConfigurations.forEach((nodeConfiguration) => {
    if (hasNodeType(nodeConfiguration, `data`) && nodeConfiguration.elasticsearch) {
      nodeConfiguration.elasticsearch.node_attributes = {}
    }
  })

  return nodeConfigurations
}

export const doNodeAttributesExist = (deploymentTemplate?: DeploymentTemplateInfoV2): boolean => {
  if (!deploymentTemplate) {
    return false
  }

  const nodeConfigurations = getTopologiesFromTemplate({
    deploymentTemplate: deploymentTemplate?.deployment_template,
    sliderInstanceType: `elasticsearch`,
  })

  const dataConfigurations = nodeConfigurations.filter((instance) => hasNodeType(instance, `data`))

  return dataConfigurations.some((node) => {
    if (!node.elasticsearch) {
      return false
    }

    return !isEmpty(node.elasticsearch.node_attributes)
  })
}

export enum ILMValidationErrors {
  MISSING_NODE_ATTRIBUTES = 'MISSING_NODE_ATTRIBUTES',
}

export function validateILM(
  deploymentTemplate: Partial<DeploymentTemplateInstanceTemplateConfig> | null,
): ILMValidationErrors[] {
  const errors: ILMValidationErrors[] = []

  if (deploymentTemplate === null) {
    return errors
  }

  const { data } = deploymentTemplate

  if (!data) {
    return errors
  }

  let numberNodeAttributesMissing = 0
  data.forEach((dataInstance) => {
    const { nodeAttributes } = dataInstance

    if (size(nodeAttributes) < 1) {
      numberNodeAttributesMissing = numberNodeAttributesMissing + 1
    }
  })

  if (numberNodeAttributesMissing > 0) {
    errors.push(ILMValidationErrors.MISSING_NODE_ATTRIBUTES)
  }

  return errors
}
