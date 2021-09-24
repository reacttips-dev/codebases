'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS } from 'immutable';
import I18n from 'I18n';
import invariant from '../../../../lib/invariant';
import { RANGE_TYPES } from '../../../../constants/dateRangeTypes';
import { EQ, LT, GT } from '../../../../constants/operators';
import { endOf, startOf } from '../../../../lib/dateUtils';
export default (function (property, dateRange) {
  invariant(property, 'property must be defined');
  var rangeType = dateRange.get('rangeType');
  var rollingDays = dateRange.get('rollingDays');
  var startDate = dateRange.get('startDate');
  var endDate = dateRange.get('endDate');
  var entireCurrentUnit = dateRange.get('entireCurrentUnit');
  var date = dateRange.get('date');

  switch (rangeType) {
    case RANGE_TYPES.ALL:
      return fromJS({
        property: property,
        operator: 'HAS_PROPERTY'
      });

    case RANGE_TYPES.CUSTOM:
      return fromJS({
        property: property,
        operator: 'BETWEEN',
        dateTimeFormat: 'DATE',
        value: I18n.moment.portalTz(startDate, 'YYYYMMDD').format('YYYY-MM-DD'),
        highValue: I18n.moment.portalTz(endDate, 'YYYYMMDD').format('YYYY-MM-DD')
      });

    case RANGE_TYPES.ROLLING:
      return fromJS({
        property: property,
        operator: 'ROLLING_DATE_RANGE',
        inclusive: false,
        timeUnitCount: parseInt(rollingDays || 7, 10),
        timeUnit: 'DAY'
      });

    case RANGE_TYPES.IS_EQUAL_TO:
      return fromJS({
        property: property,
        operator: EQ,
        dateTimeFormat: 'DATE',
        value: I18n.moment.portalTz(date, 'YYYYMMDD').format('YYYY-MM-DD')
      });

    case RANGE_TYPES.IS_BEFORE_DATE:
      return fromJS({
        property: property,
        operator: LT,
        dateTimeFormat: 'DATE',
        value: I18n.moment.portalTz(date, 'YYYYMMDD').format('YYYY-MM-DD')
      });

    case RANGE_TYPES.IS_AFTER_DATE:
      return fromJS({
        property: property,
        operator: GT,
        dateTimeFormat: 'DATE',
        value: I18n.moment.portalTz(date, 'YYYYMMDD').format('YYYY-MM-DD')
      });

    default:
      break;
  }

  var _rangeType$split = rangeType.split('_'),
      _rangeType$split2 = _slicedToArray(_rangeType$split, 2),
      timeValue = _rangeType$split2[0],
      dateValue = _rangeType$split2[1];

  if (timeValue === 'CUSTOM') {
    return fromJS({
      property: property,
      operator: 'BETWEEN',
      dateTimeFormat: 'DATE',
      value: startOf({
        date: I18n.moment.portalTz(date),
        frequency: dateValue
      }).format('YYYY-MM-DD'),
      highValue: endOf({
        date: I18n.moment.portalTz(date),
        frequency: dateValue
      }).format('YYYY-MM-DD')
    });
  }

  var inclusive = timeValue === 'THIS';
  var operator = inclusive && !entireCurrentUnit ? 'TIME_UNIT_TO_DATE' : 'ROLLING_DATE_RANGE';
  return fromJS({
    operator: operator,
    inclusive: inclusive,
    property: property,
    timeUnitCount: 1,
    timeUnit: dateValue,
    rollForward: timeValue === 'NEXT'
  });
});