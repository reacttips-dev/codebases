'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _stageToPropertyForDa, _generateStageFilters, _generateStageFilters2;

import { Map as ImmutableMap, List } from 'immutable';
import { slug } from '../../../../lib/slug';
import { CONTACTS, DEALS } from '../../../../constants/dataTypes';
import { PIPELINE, FUNNEL } from '../../../../constants/configTypes';
import getDateRangeExtractor from '../../common/extractors/date-range';
import generateSearchFilter from './search-filter';
var defaultContactStages = {
  last_visit: 'hs_analytics_last_visit_timestamp',
  recent_conversion: 'recent_conversion_date',
  email_last_open: 'hs_email_last_open_date',
  email_last_click: 'hs_email_last_click_date',
  feedback_last_survey: 'hs_feedback_last_survey_date'
};

var contactStageToProperty = function contactStageToProperty(stage) {
  return defaultContactStages[stage] || "hs_lifecyclestage_" + stage + "_date";
};

var dealStageToProperty = function dealStageToProperty(stage) {
  return "dealstages." + slug(stage) + "_entered";
};

var stageToPropertyForDataType = (_stageToPropertyForDa = {}, _defineProperty(_stageToPropertyForDa, CONTACTS, contactStageToProperty), _defineProperty(_stageToPropertyForDa, DEALS, dealStageToProperty), _stageToPropertyForDa);

var stageToProperty = function stageToProperty(dataType, stage) {
  return stage === 'create' ? 'createdate' : stageToPropertyForDataType[dataType](stage);
};

var generateStageFilter = function generateStageFilter(dataType, dateRange, stage) {
  return generateSearchFilter(stageToProperty(dataType, stage), dateRange);
};

var generateFunnelStageFilters = function generateFunnelStageFilters(dataType, dateRange, stages, index) {
  return stages.take(index + 1).reduce(function (reduction, stage) {
    return reduction.push(generateStageFilter(dataType, dateRange, stage));
  }, List());
};

var generatePipelineStageFilters = function generatePipelineStageFilters(dataType, dateRange, stages, index) {
  return List.of(generateStageFilter(dataType, dateRange, stages.get(index)));
};

var generateStageFiltersByConfigType = (_generateStageFilters = {}, _defineProperty(_generateStageFilters, PIPELINE, generatePipelineStageFilters), _defineProperty(_generateStageFilters, FUNNEL, generateFunnelStageFilters), _generateStageFilters);
var generateStageFiltersSpecificToDataType = (_generateStageFilters2 = {}, _defineProperty(_generateStageFilters2, CONTACTS, function () {
  return List();
}), _defineProperty(_generateStageFilters2, DEALS, function (pipelineId) {
  return List.of(ImmutableMap({
    property: 'pipeline',
    operator: 'EQ',
    value: pipelineId
  }));
}), _generateStageFilters2);

var generateFilters = function generateFilters(dataType, configType, dateRange, pipelineId, stages, index) {
  return (// add the common filters
    generateStageFiltersByConfigType[configType](dataType, dateRange, stages, index) // add the dataType specific filters
    .concat(generateStageFiltersSpecificToDataType[dataType](pipelineId))
  );
};

export default (function (config, dataType, stages, pipelineId) {
  var configType = config.get('configType');
  var dateRange = getDateRangeExtractor()(config).get('value');
  return stages.map(function (stage, index, entire) {
    return ImmutableMap({
      filterGroups: List.of(ImmutableMap({
        filters: generateFilters(dataType, configType, dateRange, pipelineId, entire, index).concat(config.getIn(['filters', 'custom'], List()))
      }))
    });
  });
});