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

import { Props } from './explainChanges'
import { AnyClusterPlanInfo, AnyPlan, SliderInstanceType } from '../../../types'

export function getPropsToExplainChangeFromAttempt({
  planAttempt,
  prevPlan,
  sliderInstanceType,
}: {
  planAttempt: AnyClusterPlanInfo
  prevPlan: AnyPlan | null
  sliderInstanceType: SliderInstanceType
}): Partial<Props> {
  const attribution = getSupportedSliderInstanceTypes().find(
    (instanceType) => instanceType === sliderInstanceType,
  )

  if (!attribution) {
    throw new Error(`Unexpected kind of plan attempt: ${sliderInstanceType}`)
  }

  const planExplainProps: Partial<Props> = {
    [`${attribution}PlanAttribution`]: planAttempt.source,
    [`${attribution}PlanSource`]: planAttempt.plan,
    [`${attribution}PlanPrevSource`]: prevPlan,
  }

  return planExplainProps
}
