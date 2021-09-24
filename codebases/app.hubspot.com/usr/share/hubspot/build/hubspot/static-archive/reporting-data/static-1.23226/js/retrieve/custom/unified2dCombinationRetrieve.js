'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { TIME_SERIES } from '../../constants/configTypes';
import * as dataTypes from '../../constants/dataTypes';
import { injectCombination } from '../../dataset/inject-combination';
import { get as isUnified } from '../unified/supported';
import { retrieve as baseRetrieve } from '../baseRetrieve';
var valid2DCombinationDataTypes = [dataTypes.ANALYTICS_SOURCES, dataTypes.ANALYTICS_UTM_CAMPAIGNS, dataTypes.ANALYTICS_UTM_CONTENTS, dataTypes.ANALYTICS_UTM_MEDIUMS, dataTypes.ANALYTICS_UTM_SOURCES, dataTypes.ANALYTICS_UTM_TERMS];
export default {
  match: function match(config) {
    return isUnified(config.get('dataType')) && valid2DCombinationDataTypes.includes(config.get('dataType')) && config.get('configType') === TIME_SERIES && config.get('dimensions').size === 2 && config.get('metrics').size === 2;
  },
  retrieve: function retrieve(config, debug) {
    var flattenedConfig = config.update('dimensions', function (dimensions) {
      return dimensions.pop();
    });
    return Promise.all([baseRetrieve(config, debug), baseRetrieve(flattenedConfig, debug)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          primaryRetreive = _ref2[0],
          combinationRetrieve = _ref2[1];

      return Object.assign({}, primaryRetreive, {
        dataset: injectCombination(primaryRetreive.dataset, combinationRetrieve.dataset, config.getIn(['metrics', 1, 'property']))
      });
    });
  }
};