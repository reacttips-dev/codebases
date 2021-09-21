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

import { reportMissingSliderType } from '../helpers'

import { SliderInstanceType, SliderNodeType } from '../../../types'
import {
  SliderDefinition,
  SliderInstanceDefinition,
  DynamicSliderInstanceDefinition,
  DynamicSliderInstanceDefinitionParams,
  SliderNodeDefinition,
} from '../types'

import agent from './agent'
import apm from './apm'
import appSearch from './appsearch'
import appSearchAppserver from './appsearch.appserver'
import appSearchWorker from './appsearch.worker'
import elasticsearch from './elasticsearch'
import elasticsearchCoordinator from './elasticsearch.coordinator'
import elasticsearchData from './elasticsearch.data'
import elasticsearchDataContent from './elasticsearch.data_content'
import elasticsearchDataHot from './elasticsearch.data_hot'
import elasticsearchDataWarm from './elasticsearch.data_warm'
import elasticsearchDataCold from './elasticsearch.data_cold'
import elasticsearchDataFrozen from './elasticsearch.data_frozen'
import elasticsearchIngest from './elasticsearch.ingest'
import elasticsearchMaster from './elasticsearch.master'
import elasticsearchMl from './elasticsearch.ml'
import enterpriseSearch from './enterprise_search'
import enterpriseSearchAppserver from './enterprise_search.appserver'
import enterpriseSearchConnector from './enterprise_search.connector'
import enterpriseSearchWorker from './enterprise_search.worker'
import kibana from './kibana'
import { mergeDeep } from '../../immutability-helpers'

const definitions: { [id: string]: SliderDefinition | DynamicSliderInstanceDefinition } = {
  agent,
  apm,
  appsearch: appSearch,
  'appsearch.appserver': appSearchAppserver,
  'appsearch.worker': appSearchWorker,
  elasticsearch,
  'elasticsearch.coordinator': elasticsearchCoordinator,
  'elasticsearch.data': elasticsearchData,
  'elasticsearch.data_content': elasticsearchDataContent,
  'elasticsearch.data_hot': elasticsearchDataHot,
  'elasticsearch.data_warm': elasticsearchDataWarm,
  'elasticsearch.data_cold': elasticsearchDataCold,
  'elasticsearch.data_frozen': elasticsearchDataFrozen,
  'elasticsearch.ingest': elasticsearchIngest,
  'elasticsearch.master': elasticsearchMaster,
  'elasticsearch.ml': elasticsearchMl,
  enterprise_search: enterpriseSearch,
  'enterprise_search.appserver': enterpriseSearchAppserver,
  'enterprise_search.connector': enterpriseSearchConnector,
  'enterprise_search.worker': enterpriseSearchWorker,
  kibana,
}

// Overloads as follows:

// instance type only => instance definition
function getSliderDefinition(
  args: DynamicSliderInstanceDefinitionParams & {
    sliderInstanceType: SliderInstanceType
  },
): SliderInstanceDefinition

// instance and node type => node definition
function getSliderDefinition(
  args: DynamicSliderInstanceDefinitionParams & {
    sliderInstanceType: SliderInstanceType
    sliderNodeType: SliderNodeType
  },
): SliderNodeDefinition

// instance and node type that may be undefined at runtime => could be either
function getSliderDefinition(
  args: DynamicSliderInstanceDefinitionParams & {
    sliderInstanceType: SliderInstanceType
    sliderNodeType?: SliderNodeType
  },
): SliderInstanceDefinition | SliderNodeDefinition

function getSliderDefinition({
  sliderInstanceType,
  sliderNodeType,
  ...dynamicSliderInstanceDefinitionParams
}: DynamicSliderInstanceDefinitionParams & {
  sliderInstanceType: SliderInstanceType
  sliderNodeType?: SliderNodeType
}): SliderDefinition {
  if (sliderNodeType == null) {
    const definition = definitions[sliderInstanceType]

    if (definition == null) {
      reportMissingSliderType({
        sliderInstanceType,
        sliderNodeType,
      })
      // avoid having function return value be nullable as this should be caught
      // before runtime
      return {} as SliderInstanceDefinition
    }

    // merge in partial definitions as long as their test function passes
    if (Array.isArray(definition)) {
      const [base, ...partials] = definition

      return partials.reduce(
        (acc, { testFn, ...partial }) =>
          !testFn || testFn(dynamicSliderInstanceDefinitionParams) ? mergeDeep(acc, partial) : acc,
        base,
      )
    }

    return definition as SliderInstanceDefinition
  }

  return definitions[`${sliderInstanceType}.${sliderNodeType}`] as SliderNodeDefinition
}

export { getSliderDefinition }
export default definitions
