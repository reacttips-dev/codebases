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

import { getSupportedSliderInstanceTypes } from '../../../../lib/sliders'

import { SliderInstanceType } from '../../../../types'

import { DeploymentUpdateRequest } from '../../../../lib/api/v1/types'

export default function transformBeforeSave(
  deployment: DeploymentUpdateRequest,
  sliderInstanceType: SliderInstanceType,
): DeploymentUpdateRequest {
  if (!deployment.resources) {
    return deployment
  }

  const sliderInstanceTypes = getSupportedSliderInstanceTypes()

  for (const type of sliderInstanceTypes) {
    if (type === sliderInstanceType) {
      continue
    }

    delete deployment.resources[type]
  }

  return deployment
}
