'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap, fromJS } from 'immutable';
import I18n from 'I18n';
import { Config } from './config';
import makeDateRangeByType from './lib/makeDateRangeByType';
import { RANGE_TYPES } from './constants/dateRangeTypes';
import { TIME_SERIES, AGGREGATION } from './constants/configTypes';
import { endOf } from './lib/dateUtils';
var DATE_FORMAT = 'YYYYMMDD';
var DURATION_ROLLBACK_RANGE_TYPES = [RANGE_TYPES.ALL, RANGE_TYPES.IS_AFTER_DATE, RANGE_TYPES.ROLLING, RANGE_TYPES.CUSTOM];

function createCustomDateRange(start, end) {
  return ImmutableMap({
    rangeType: 'CUSTOM',
    endDate: end.format(DATE_FORMAT),
    startDate: start.format(DATE_FORMAT),
    entireCurrentUnit: true
  });
}

export function getLastYearFilter(filter) {
  var start = I18n.moment.portalTz(filter.get('startDate'));
  var end = I18n.moment.portalTz(filter.get('endDate'));
  var highValue = end.subtract(1, 'years').format(DATE_FORMAT);
  var value = start.subtract(1, 'years').format(DATE_FORMAT);
  return filter.set('endDate', highValue).set('startDate', value).set('rangeType', 'CUSTOM');
}
export function getPriorPeriodFilter(filter, dataType) {
  var entireCurrentUnit = filter.get('entireCurrentUnit');
  var rangeType = filter.get('rangeType');
  var start = I18n.moment.portalTz(filter.get('startDate'));
  var end = I18n.moment.portalTz(filter.get('endDate'));

  if (DURATION_ROLLBACK_RANGE_TYPES.includes(rangeType)) {
    var duration = end.diff(start, 'days');

    var _priorEnd = start.clone().subtract(1, 'days');

    var _priorStart = start.clone().subtract(duration + 1, 'days');

    return createCustomDateRange(_priorStart, _priorEnd);
  }

  var _rangeType$split = rangeType.split('_'),
      _rangeType$split2 = _slicedToArray(_rangeType$split, 2),
      dateUnit = _rangeType$split2[1];

  var priorStart = start.subtract(1, dateUnit);
  var priorEnd = end.subtract(1, dateUnit);

  if (entireCurrentUnit) {
    priorEnd = endOf({
      date: priorEnd,
      frequency: dateUnit,
      dataType: dataType
    });
  }

  return createCustomDateRange(priorStart, priorEnd);
}
export var isComparisonConfig = function isComparisonConfig(config) {
  return config.get('compare') && (config.get('configType') === TIME_SERIES || config.get('configType') === AGGREGATION) && config.getIn(['filters', 'dateRange']);
};
export var compareLabel = function compareLabel(compare, metricLabel) {
  if (!metricLabel) {
    return compare === 'PRIOR_YEAR' ? I18n.text('reporting-data.compare.priorYear') : I18n.text('reporting-data.compare.priorPeriod');
  }

  return compare === 'PRIOR_YEAR' ? I18n.text('reporting-data.compare.priorYearAndLabel', {
    metricLabel: metricLabel
  }) : I18n.text('reporting-data.compare.priorPeriodAndLabel', {
    metricLabel: metricLabel
  });
};
export var splitConfig = function splitConfig(config) {
  var dataType = config.get('dataType');
  var compare = config.get('compare');
  var base = config.delete('compare');
  var filter = config.getIn(['filters', 'dateRange']);
  var baseDateRange = filter.get('value');
  var fullDateRange = fromJS(makeDateRangeByType(baseDateRange.toJS(), DATE_FORMAT, dataType));
  var compareFilter = compare === 'PRIOR_YEAR' ? getLastYearFilter(fullDateRange) : getPriorPeriodFilter(fullDateRange, config.get('dataType'));
  var compareConfig = Config(base.setIn(['filters', 'dateRange', 'value'], compareFilter));
  return {
    config: base,
    compareConfig: compareConfig,
    compareLabel: compareLabel(compare)
  };
};