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

import { size } from 'lodash'

import { getSliderDefinition } from './definitions'

import { SliderNodeType, SliderInstanceType } from '../../types'
import { SliderTrialLimit, SliderInstanceDefinition } from './types'

export function getSliderTrialLimit({
  inTrial,
  sliderInstanceType,
  sliderNodeTypes,
}: {
  inTrial?: boolean
  sliderInstanceType: SliderInstanceType
  sliderNodeTypes: SliderNodeType[] | undefined
}): SliderTrialLimit | undefined {
  if (!inTrial) {
    return
  }

  // if node types are specified...
  if (size(sliderNodeTypes) > 0) {
    // ...provide the most generous limit
    const limits = sliderNodeTypes!
      .map(
        (sliderNodeType) => getSliderDefinition({ sliderInstanceType, sliderNodeType })?.trialLimit,
      )
      .filter(Boolean) as Array<SliderInstanceDefinition['trialLimit']>

    if (size(limits) > 0) {
      return {
        memorySize: Math.max(...limits.map((x) => x.memorySize)),
        zoneCount: Math.max(...limits.map((x) => x.zoneCount)),
      }
    }
  }

  // without node types or without node-specific limits, go with the instance limit (or nothing)
  return getSliderDefinition({ sliderInstanceType })?.trialLimit
}
