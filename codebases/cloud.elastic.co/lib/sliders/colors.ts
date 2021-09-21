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

import { getThemeColors } from '../../lib/theme'

import { SliderInstanceType, EsNodeType } from '../../types'

const colors = getThemeColors()

export function getSliderColor(sliderInstanceType: SliderInstanceType): string {
  switch (sliderInstanceType) {
    case `elasticsearch`:
      return colors.euiColorPrimary
    case `kibana`:
      return colors.euiColorSecondary
    case `apm`:
      return colors.euiColorAccent
    case `appsearch`:
      return colors.euiColorWarning
    case `enterprise_search`:
      return colors.euiColorWarning
    default:
      return colors.euiColorMediumShade
  }
}

/* This function is only meant for when we explicitly need to discriminate
 * between slider node types, such as in the Deployment Architecture Viz */
export function getSliderInstanceColor(
  sliderInstanceType: SliderInstanceType | EsNodeType,
  index?: number,
): string {
  switch (sliderInstanceType) {
    // Sliders
    case `elasticsearch`:
      return colors.euiColorVis0
    case `kibana`:
      return colors.euiColorVis2
    case `apm`:
    case 'agent':
      return colors.euiColorVis9
    case `appsearch`:
      return colors.euiColorVis7
    case `enterprise_search`:
      return colors.euiColorVis6

    // ES Node types
    case `master`:
      return colors.euiColorPrimary
    case `ml`:
      return colors.euiColorSecondary
    case `ingest`:
      return colors.euiColorVis0
    case `data`:
    case `data_content`:
    case `data_hot`:
    case `data_warm`:
    case `data_cold`:
    case `data_frozen`:
      const dataNodeColors = [
        colors.euiColorVis5,
        colors.euiColorVis4,
        colors.euiColorVis3,
        colors.euiColorVis7,
      ]
      return dataNodeColors[(index || 0) % dataNodeColors.length]
    default:
      return colors.euiColorMediumShade
  }
}
