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

import { sortBy } from 'lodash'

import { getExtraSupportedSliderInstanceTypes } from './sliders'

import { SliderInstanceType, SliderNodeType, EsNodeType, SliderType } from '../../types'

const POSITIONS = 4
const LETTERS = `abcdefghijklmnopqrstuvwxyz`.split(``)
const EXTRA_TYPE_STEP = Math.pow(10, Math.ceil(Math.log10(Math.pow(27, POSITIONS)))) // smallest power of ten required to step past largest possible extra subtype weight

/*
 * Instance types without explicit weighting inherit their order from the
 * `EXTRA_SUPPORTED_INSTANCE_TYPES` env var.
 */
function getExtraSliderInstanceTypeWeight(sliderType: SliderInstanceType): number {
  const sliderIndex = getExtraSupportedSliderInstanceTypes().indexOf(sliderType)
  return EXTRA_TYPE_STEP * (sliderIndex >= 0 ? sliderIndex + 1 : 1000)
}

/* Node types without explicit weighting are ordered alphabetically by the first
 * four letters (a compromise between being useful and not blowing the resulting
 * numeric score out to ridiculous proportions).
 *
 * Each position needs to completely outweigh the next one down so that you get:
 *
 * - a
 * - bzzz
 * - c
 *
 * With 4 positions factored in, maximum return value for `zzzz` is 531440.
 */
function getExtraSliderNodeTypeWeight(sliderNodeType: SliderNodeType): number {
  return sliderNodeType
    .toLowerCase() // sanity
    .split(``)
    .slice(0, POSITIONS)
    .reduce((acc: number, letter: string, i: number) => {
      const positionWeight = Math.pow(27, POSITIONS - i - 1) // for 4 positions: 19683, 729, 27, 1
      const letterWeight = LETTERS.indexOf(letter) + 1 // 1-26, or 0 if non-alpha
      return acc + positionWeight * letterWeight
    }, 0)
}

/*
 * Returns a ordering score/weight for a slider instance type and, optionally,
 * node type.
 */
export function getSliderWeight(
  sliderInstanceType: SliderInstanceType,
  sliderNodeType?: SliderNodeType,
): number {
  /* eslint-disable default-case */
  let weight = 0

  switch (sliderInstanceType) {
    case `elasticsearch`:
      switch (sliderNodeType) {
        case `data`:
          break
        case `data_content`:
          weight += 1
          break
        case `data_hot`:
          weight += 2
          break
        case `data_warm`:
          weight += 3
          break
        case `data_cold`:
          weight += 4
          break
        case `data_frozen`:
          weight += 5
          break
        case `master`:
          weight += 6
          break
        case `ingest`:
          weight += 7
          break
        case `ml`:
          weight += 200
          break
      }

      break
    case `kibana`:
      weight += 100
      break
    case `apm`:
      weight += 300
      break
    case `agent`:
      weight += 350
      break
    case `appsearch`:
      weight += 400

      switch (sliderNodeType) {
        case `appserver`:
          break
        case `worker`:
          weight += 1
          break
      }

      break
    case `enterprise_search`:
      weight += 500

      switch (sliderNodeType) {
        case `appserver`:
          break
        case `connector`:
          weight += 1
          break
        case `worker`:
          weight += 2
          break
      }

      break
    default:
      const sliderInstanceTypeWeight = getExtraSliderInstanceTypeWeight(sliderInstanceType)
      const sliderNodeTypeWeight = sliderNodeType ? getExtraSliderNodeTypeWeight(sliderNodeType) : 0
      weight += sliderInstanceTypeWeight + sliderNodeTypeWeight
  }

  return weight
}

export function sortSliderTypes(sliderTypes: SliderType[]) {
  return sortBy(sliderTypes, ({ sliderInstanceType, sliderNodeType }) =>
    getSliderWeight(sliderInstanceType, sliderNodeType),
  )
}

// the below is deprecated, to be removed when lib/deployments/architecture is reworked to be SliderType-aware

type NodeType = SliderInstanceType | EsNodeType

// Interleaves ES node types with Slider types for our ideal display order
export const sortedNodeTypes: NodeType[] = [
  `data`,
  `master`,
  `ingest`,
  `kibana`,
  `ml`,
  `apm`,
  `appsearch`,
  `enterprise_search`,
]

export const sortNodeTypes = (a: NodeType, b: NodeType) =>
  sortedNodeTypes.indexOf(a) - sortedNodeTypes.indexOf(b)
