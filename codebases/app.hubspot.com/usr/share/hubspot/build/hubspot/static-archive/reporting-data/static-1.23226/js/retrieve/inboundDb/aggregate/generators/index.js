'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import basic from './basic';
import pipelineFunnel from './pipeline-funnel';
import * as ConfigTypes from '../../../../constants/configTypes';
var requestGeneratorByConfigType = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, ConfigTypes.AGGREGATION, basic), _defineProperty(_ImmutableMap, ConfigTypes.TIME_SERIES, basic), _defineProperty(_ImmutableMap, ConfigTypes.PIPELINE, pipelineFunnel), _defineProperty(_ImmutableMap, ConfigTypes.FUNNEL, pipelineFunnel), _ImmutableMap));
export default (function (config) {
  return requestGeneratorByConfigType.get(config.get('configType'), function () {
    throw new Error('unsupported config type');
  });
});