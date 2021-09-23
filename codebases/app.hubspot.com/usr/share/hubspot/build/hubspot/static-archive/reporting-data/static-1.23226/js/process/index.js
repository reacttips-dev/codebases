'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap, List } from 'immutable';
import { reduce } from '../lib/batch';
import { PROCESS } from '../constants/phases';
import { connectedPhase } from '../redux/resolve/connected';
import * as ProcessorTypes from '../constants/processorTypes';
import accumulate from './accumulate';
import currency from './currency';
import created from './bucket/created';
import dealprogress from './bucket/dealprogress';
import lifecyclestage from './bucket/lifecyclestage';
import groupTeams from './groupTeams';
import zeroDimensionalMetricFunnel from './zeroDimensionalMetricFunnel';
import negativeLost from './negativeLost';
var processorMap = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, ProcessorTypes.ACCUMULATE, accumulate), _defineProperty(_ImmutableMap, ProcessorTypes.BUCKET_CREATED, created), _defineProperty(_ImmutableMap, ProcessorTypes.BUCKET_DEALPROGRESS, dealprogress), _defineProperty(_ImmutableMap, ProcessorTypes.BUCKET_LIFECYCLESTAGE, lifecyclestage), _defineProperty(_ImmutableMap, ProcessorTypes.GROUP_TEAMS, groupTeams), _defineProperty(_ImmutableMap, ProcessorTypes.ZERO_DIMENSIONAL_METRIC_FUNNEL, zeroDimensionalMetricFunnel), _defineProperty(_ImmutableMap, ProcessorTypes.NEGATIVE_LOST, negativeLost), _ImmutableMap));

var passthrough = function passthrough(_ref) {
  var dataset = _ref.dataset;
  return Promise.resolve(dataset);
};

export var matchCurrencyProcessor = function matchCurrencyProcessor(type) {
  return type.match(/^currency-code:(.*)/);
};

var processCurrency = function processCurrency(type) {
  var matches = matchCurrencyProcessor(type);

  if (matches) {
    var _matches = _slicedToArray(matches, 2),
        currencyCode = _matches[1];

    return currency(currencyCode);
  }

  return passthrough(type);
};

export var process = function process(_ref2) {
  var _ref2$dataConfig = _ref2.dataConfig,
      dataConfig = _ref2$dataConfig === void 0 ? ImmutableMap() : _ref2$dataConfig,
      _ref2$dataset = _ref2.dataset,
      dataset = _ref2$dataset === void 0 ? List() : _ref2$dataset,
      response = _ref2.response;
  var processors = dataConfig.get('processors', List());
  return reduce(processors, function (processedPromise, type) {
    var processor = processorMap.get(type.toLowerCase(), passthrough);
    return processedPromise.then(function (processed) {
      return Promise.resolve(processor({
        dataConfig: dataConfig,
        dataset: processed
      }));
    });
  }, Promise.resolve(dataset)).then(function (processed) {
    var currencyProcessorType = processors.find(matchCurrencyProcessor);
    return currencyProcessorType ? processCurrency(currencyProcessorType)({
      dataConfig: dataConfig,
      response: response,
      dataset: processed
    }) : processed;
  }).then(function (processed) {
    return {
      dataConfig: dataConfig,
      response: response,
      dataset: processed
    };
  });
};
export var connectedProcess = connectedPhase(PROCESS, process);