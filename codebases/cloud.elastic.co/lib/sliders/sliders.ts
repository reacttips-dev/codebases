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

import { intersection, uniq } from 'lodash'

import { getConfigForKey } from '../../store'

import { SliderType, SliderInstanceType } from '../../types'

type AppSubdomainDef = {
  unaliased: string | null
  aliased: string
}

export const allKnownSliderTypes: SliderType[] = [
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data_content` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data_hot` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data_warm` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data_cold` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `data_frozen` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `ingest` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `master` },
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `ml` },
  { sliderInstanceType: `kibana` },
  { sliderInstanceType: `apm` },
  { sliderInstanceType: `agent` },
  { sliderInstanceType: `appsearch`, sliderNodeType: `appserver` },
  { sliderInstanceType: `appsearch`, sliderNodeType: `worker` },
  { sliderInstanceType: `enterprise_search`, sliderNodeType: `appserver` },
  { sliderInstanceType: `enterprise_search`, sliderNodeType: `connector` },
  { sliderInstanceType: `enterprise_search`, sliderNodeType: `worker` },
]

export const allKnownSliderInstanceTypes: SliderInstanceType[] = uniq(
  allKnownSliderTypes.map((sliderType) => sliderType.sliderInstanceType),
)

export const alwaysSupportedSliderInstanceTypes: SliderInstanceType[] = [
  `elasticsearch`,
  `kibana`,
  `apm`,
  `appsearch`,
  `enterprise_search`,
]

export const appSubdomainDefinitions: Record<string, AppSubdomainDef> = {
  elasticsearch: { unaliased: null, aliased: 'es' },
  kibana: { unaliased: null, aliased: 'kb' },
  apm: { unaliased: 'apm', aliased: 'apm' },
  fleet: { unaliased: 'fleet', aliased: 'fleet' },
  appsearch: { unaliased: 'ent-search', aliased: 'ent' },
  enterprise_search: { unaliased: 'ent-search', aliased: 'ent' },
}

export function getAllKnownSliderTypes(): SliderType[] {
  return allKnownSliderTypes
}

export function getAllKnownSliderInstanceTypes(): SliderInstanceType[] {
  return allKnownSliderInstanceTypes
}

export function getExtraSupportedSliderInstanceTypes(): SliderInstanceType[] {
  const extrasConfigInput = getConfigForKey(`EXTRA_SUPPORTED_INSTANCE_TYPES`)
  const extras = Array.isArray(extrasConfigInput) ? extrasConfigInput : []

  return intersection(getAllKnownSliderInstanceTypes(), extras)
}
