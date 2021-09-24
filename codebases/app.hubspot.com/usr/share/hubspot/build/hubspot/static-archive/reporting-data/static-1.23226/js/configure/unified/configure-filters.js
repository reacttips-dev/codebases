'use es6';

import { List } from 'immutable';
import { UNIFIED_SEARCH_ANALYTICS_PAGES, UNIFIED_SEARCH_ANALYTICS_QUERIES, ANALYTICS_CAMPAIGNS } from '../../constants/dataTypes';
import { TIME_SERIES } from '../../constants/configTypes';
import { MissingIntegrationException, MissingSeriesException } from '../../exceptions';
export var configure = function configure(config) {
  var dataType = config.get('dataType');

  if ((dataType === UNIFIED_SEARCH_ANALYTICS_PAGES || dataType === UNIFIED_SEARCH_ANALYTICS_QUERIES) && !config.getIn(['filters', 'custom'], List()).some(function (filter) {
    return filter.get('property') === 'site';
  })) {
    throw new MissingIntegrationException();
  }

  if (dataType === ANALYTICS_CAMPAIGNS && config.get('configType') === TIME_SERIES && !config.getIn(['filters', 'custom'], List()).some(function (filter) {
    return filter.get('property') === 'filters' || filter.get('property') === 'd1';
  })) {
    throw new MissingSeriesException();
  }

  return config;
};