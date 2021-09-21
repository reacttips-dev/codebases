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

import { getSupportedSliderInstanceTypes } from '../../../lib/sliders'

import { getSliderPlan, getSliderPlanFromGet } from '../../../lib/stackDeployments'

import { Props } from './explainChanges'
import { StackDeployment } from '../../../types'
import { DeploymentUpdateRequest } from '../../../lib/api/v1/types'

export function getPropsToExplainChangeFromPreviousDeployment({
  newDeployment,
  oldDeployment,
}: {
  newDeployment: DeploymentUpdateRequest
  oldDeployment: StackDeployment
}): Partial<Props> {
  const props = {}

  for (const sliderInstanceType of getSupportedSliderInstanceTypes()) {
    const newPlan = getSliderPlan({ deployment: newDeployment, sliderInstanceType })
    const oldPlan = getSliderPlanFromGet({ deployment: oldDeployment, sliderInstanceType })

    if (newPlan == null && oldPlan == null) {
      // avoid no-op messaging for absent sliders
      continue
    }

    props[`${sliderInstanceType}PlanSource`] = newPlan
    props[`${sliderInstanceType}PlanPrevSource`] = oldPlan
  }

  return props
}
