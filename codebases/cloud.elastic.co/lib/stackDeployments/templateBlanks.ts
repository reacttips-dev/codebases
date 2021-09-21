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

import { isSliderInstanceTypeSupportedInTemplate } from '../sliders'
import { replaceIn } from '../immutability-helpers'
import { getFirstSliderResourceFromTemplate } from '../stackDeployments/selectors'

import { SliderInstanceType, VersionNumber, AnyPlan } from '../../types'
import { DeploymentTemplateInfoV2 } from '../api/v1/types'

export const getBlankNodeConfigurationPerTemplate = ({
  sliderInstanceType,
  deploymentTemplate,
  version,
}: {
  sliderInstanceType: SliderInstanceType
  deploymentTemplate: DeploymentTemplateInfoV2
  version?: VersionNumber
}): AnyPlan | null => {
  if (!isSliderInstanceTypeSupportedInTemplate(sliderInstanceType, deploymentTemplate)) {
    return null
  }

  const resource = getFirstSliderResourceFromTemplate({
    deploymentTemplate: deploymentTemplate.deployment_template,
    sliderInstanceType,
  })

  const templatePlan = resource?.plan

  if (!templatePlan) {
    return null
  }

  const versionedPlan = replaceIn(templatePlan, [sliderInstanceType, `version`], version)
  const blankPlan = getBlankPlan({ plan: versionedPlan })

  return blankPlan
}

export const getBlankPlan = ({ plan }) => {
  const blankPlan = replaceIn(plan, [`cluster_topology`, `0`, `size`, `value`], 0)

  return blankPlan
}
