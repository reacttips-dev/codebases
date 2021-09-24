'use es6';

import I18n from 'I18n';
import formatShortMonthYear from 'I18n/utils/formatShortMonthYear';
import formatShortQuarterYear from 'I18n/utils/formatShortQuarterYear';
import { List } from 'immutable';
import { SEARCH } from '../constants/configTypes';
import * as InboundDataTypes from '../constants/dataTypes/inboundDb';
import { DEFAULT_NULL_VALUES } from '../constants/defaultNullValues';
import { COUNT, DISTINCT_APPROX } from '../constants/metricTypes';
import * as NumberDisplayHints from '../constants/numberDisplayHints';
import * as PropertyTypes from '../constants/property-types';
import { OWNER } from '../constants/referencedObjectTypes';
import { HUBSPOT_OWNER_ID } from '../constants/referenceTypes';
import { debug } from '../lib/debug';
import { getGuidLabel, isKnownGuid } from '../lib/guids';
import { has } from '../lib/has';
import prefix from '../lib/prefix';
import { extractPropertyNamespace } from '../properties/namespaceProperty';
import { formatForScientificNotation } from '../v2/dataset/utils';
import { currency, duration, number, percent } from './numberFormatter';
var NULL = '–';
var DATE_FORMATS = {
  DAY: 'l',
  WEEK: 'l',
  MONTH: 'short-m-y',
  QUARTER: 'short-q-y',
  YEAR: 'YYYY'
};
export var formatDate = function formatDate(value, format) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'portalTz';

  if (!value) {
    return NULL;
  }

  var typeSafeValue = isNaN(Number(value)) ? value : Number(value);

  if (format === 'short-m-y') {
    return formatShortMonthYear(typeSafeValue, method);
  } else if (format === 'short-q-y') {
    return formatShortQuarterYear(typeSafeValue, method);
  }

  return I18n.moment[method](typeSafeValue).format(format);
};
var OWNER_PROPERTIES = [HUBSPOT_OWNER_ID, 'engagement.createdBy', 'engagement.modifiedBy', 'engagement.createdBy', 'engagement.ownerId'];
var missing = prefix('reporting-data.missing');
var included = prefix('reporting-data.properties.common.buckets');

var boolean = function boolean(value) {
  if (value === undefined || value === null) {
    return value;
  }

  var normalized;

  if (value === 'true') {
    normalized = true;
  } else if (value === 'false') {
    normalized = false;
  } else if (typeof value === 'string') {
    // RA-1704: Handles '0' and '1', also worth noting that other strings are considered true
    normalized = Boolean(Number(value));
  } else {
    normalized = value;
  }

  return included(normalized ? 'included' : 'excluded');
}; // ID properties shouldn't be formatted as such if they're actually used for counting


var isActualCountMetric = function isActualCountMetric(_ref) {
  var metricType = _ref.metricType,
      configType = _ref.configType,
      dataType = _ref.dataType;
  return [COUNT, DISTINCT_APPROX].includes(metricType) && configType !== SEARCH && has(InboundDataTypes, dataType);
};

var getOption = function getOption(propertyInfo, value) {
  return propertyInfo.get('options', List()).find(function (option) {
    return option.get('value') === value;
  });
};

export var getFallback = function getFallback(propertyInfo, value) {
  var property = propertyInfo.get('name');

  if (value === DEFAULT_NULL_VALUES.STRING) {
    // RA-1704: Handle bool mistyped as enumeration
    var isEnumeratedBoolean = propertyInfo.get('type') === PropertyTypes.ENUMERATION && propertyInfo.get('fieldType') === 'booleancheckbox';

    if (isEnumeratedBoolean) {
      return missing('value');
    }

    return OWNER_PROPERTIES.includes(property) ? missing('unassigned') : missing('value');
  }

  if (OWNER_PROPERTIES.includes(property) || propertyInfo.get('type') === PropertyTypes.ENUMERATION && (propertyInfo.get('fieldType') === OWNER || propertyInfo.get('referencedObjectType') === OWNER)) {
    return !value || value === '0' ? missing('unassigned') : missing('unknown.owner', {
      id: value
    });
  }

  return null;
};
export var formatEnumeration = function formatEnumeration(value) {
  return value === '' ? missing('value') : value;
};
export var getPropertyTypeFromDisplayHint = function getPropertyTypeFromDisplayHint(displayHint) {
  switch (displayHint) {
    case NumberDisplayHints.CURRENCY:
      return PropertyTypes.CURRENCY;

    case NumberDisplayHints.DURATION:
      return PropertyTypes.DURATION;

    case NumberDisplayHints.PERCENTAGE:
      return PropertyTypes.PERCENT;

    case NumberDisplayHints.FORMATTED:
    case NumberDisplayHints.UNFORMATTED:
    default:
      return PropertyTypes.NUMBER;
  }
};
export default (function (value, propertyInfo) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      currencyCode = _ref2.currencyCode,
      frequency = _ref2.frequency,
      metricType = _ref2.metricType,
      configType = _ref2.configType,
      dataType = _ref2.dataType,
      smallScale = _ref2.smallScale;

  var type = propertyInfo.get('type');
  var durationUnit = propertyInfo.get('durationUnit');

  if (isKnownGuid(value)) {
    return getGuidLabel(value);
  } // RA-2483: try semicolon delimited list


  if (typeof value === 'string' && value.indexOf(';') >= 0 && propertyInfo.get('fieldType') === 'checkbox') {
    value = List(value.split(';')).map(function (val) {
      return val.trim();
    });
  }

  if (List.isList(value)) {
    return value.isEmpty() ? List.of(NULL) : value.map(function (val) {
      var option = getOption(propertyInfo, String(val));
      return option && option.has('label') ? option.get('label') : getFallback(propertyInfo, val) || formatEnumeration(val);
    });
  }

  if (type === 'number' || type === 'id' || type === 'enumeration' && propertyInfo.get('externalOptions') === true && propertyInfo.get('referencedObjectType') !== null) {
    value = formatForScientificNotation(value);
  }

  if (!isActualCountMetric({
    metricType: metricType,
    configType: configType,
    dataType: dataType
  })) {
    var option = getOption(propertyInfo, String(value));

    if (option != null && option.has('label')) {
      // NOTE: https://issues.hubspotcentral.com/browse/RA-1444
      var _extractPropertyNames = extractPropertyNamespace(propertyInfo.get('name')),
          propertyName = _extractPropertyNames.propertyName;

      return propertyName === 'hs_persona' ? option.get('description') : option.get('label');
    }
  }

  var fallback = getFallback(propertyInfo, value);

  if (fallback !== null) {
    return fallback;
  }

  var numberDisplayHint = propertyInfo.get('numberDisplayHint');

  switch (type === PropertyTypes.NUMBER ? getPropertyTypeFromDisplayHint(numberDisplayHint) : type) {
    case PropertyTypes.ENUMERATION:
      return formatEnumeration(value);

    case PropertyTypes.STRING:
    case PropertyTypes.BUCKETS:
      return value;

    case PropertyTypes.DATE:
      return formatDate(value, DATE_FORMATS[frequency] || 'l', 'utc');

    case PropertyTypes.DATE_TIME:
      return formatDate(value, DATE_FORMATS[frequency] || 'l', 'userTz');

    case PropertyTypes.TIMESTAMP:
      return formatDate(value, 'lll', 'userTz');

    case PropertyTypes.NUMBER:
      return numberDisplayHint === NumberDisplayHints.UNFORMATTED ? value : number(value);

    case PropertyTypes.PERCENT:
      return percent(value * 100);

    case PropertyTypes.CURRENCY:
      return currency(value, {
        currencyCode: currencyCode
      });

    case PropertyTypes.DURATION:
      return duration(value, {
        durationUnit: durationUnit,
        smallScale: smallScale
      });

    case PropertyTypes.BOOLEAN:
      return boolean(value);

    case PropertyTypes.UNKNOWN:
    default:
      debug.once('hydrate/propertyFormatter', "unknown type for " + value);
      return value;
  }
});