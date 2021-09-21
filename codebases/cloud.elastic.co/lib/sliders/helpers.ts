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

import { getConfigForKey } from '../../store/store'
import { SliderType } from '../../types'

export const reportMissingSliderType = function (sliderType: SliderType) {
  if (getConfigForKey(`NODE_ENV`) !== `development`) {
    return
  }

  const { sliderInstanceType, sliderNodeType } = sliderType

  const messages = [
    `Unknown slider type; inspect stack trace for source.`,
    `Instance type: ${sliderInstanceType}.`,
  ]

  if (sliderNodeType != null) {
    messages.push(`Node type: ${sliderNodeType}.`)
  }

  throw new Error(messages.join(` `))
}
