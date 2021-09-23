'use es6';

import I18n from 'I18n';
import { List, Map as ImmutableMap } from 'immutable';
import { CRM_OBJECT } from '../../constants/dataTypes';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
import { PERCENTILES } from '../../constants/metricTypes';
import { CURRENCY, DURATION, ENUMERATION, ID, NUMBER, PERCENT } from '../../constants/property-types';
import { getReferenceLabeler } from '../../crmObjects/references';
import propertyValueFormatter, { formatEnumeration } from '../../hydrate/propertyFormatter';
import { filterOutEmptySearchValues } from '../../lib/normalizeEmptiness';
import { shouldBeSmallScale } from '../../lib/smallScale';
import { LINKS_FIELD } from '../dataset/constants/index';
import { defaultDatasetBuildOptions } from './datasetBuildOptions';

var formatData = function formatData(reportingApiDataset, options) {
  var typesByProperty = reportingApiDataset.get('header').map(function (prop) {
    return prop.getIn(['format', 'type']);
  });
  var typeIsNumeric = reportingApiDataset.get('header').map(function (prop) {
    var type = prop.getIn(['format', 'type']);

    if (type === NUMBER && options.isSearch) {
      return prop.getIn(['format', 'isFormatted']);
    }

    return [PERCENT, NUMBER, CURRENCY, DURATION].includes(type === ID ? prop.getIn(['format', 'subType']) : type);
  });
  return reportingApiDataset.get('data').map(function (row, rowNum) {
    if (options.isSearch) {
      row = filterOutEmptySearchValues(row, typesByProperty);
    }

    var excludeFinalConversions = options.removeLastRowPercentiles && rowNum === reportingApiDataset.get('data').count() - 1;
    return row.reduce(function (obj, value, key) {
      var url = reportingApiDataset.getIn(['identifiers', key, value, 'references', 'url']);

      if (url) {
        obj = obj.setIn([LINKS_FIELD, key, value], url);
      }

      if (!typeIsNumeric.get(key)) {
        return obj.set(key, value);
      }

      if (excludeFinalConversions && options.isMeasure(key) && options.getMeasureType(key) === PERCENTILES && value === GLOBAL_NULL) {
        return obj;
      }

      var parsedValue = !isNaN(value) && value !== null && value !== '' ? parseFloat(value) : value;
      var adjustedValue = parsedValue === GLOBAL_NULL && options.isMeasure(key) ? null : parsedValue;
      return obj.set(key, adjustedValue);
    }, ImmutableMap({}));
  });
};

var formatPagination = function formatPagination(reportingApiDataset) {
  return reportingApiDataset.getIn(['pagination', 'total']);
};

var hydrateValue = function hydrateValue(row, value, propertyInfo, identifiers) {
  var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
      _ref$smallScale = _ref.smallScale,
      smallScale = _ref$smallScale === void 0 ? false : _ref$smallScale;

  if (propertyInfo.getIn(['format', 'type']) === ID || propertyInfo.hasIn(['format', 'referenceMeta'])) {
    var referenceType = propertyInfo.getIn(['format', 'referenceMeta', 'referenceType']) === CRM_OBJECT ? propertyInfo.getIn(['format', 'referenceMeta', 'objectTypeId']) : propertyInfo.getIn(['format', 'referenceMeta', 'referenceType']);
    return getReferenceLabeler(referenceType)(identifiers.getIn([String(value), 'references'], ImmutableMap()), String(value));
  }

  if (value === GLOBAL_NULL) {
    return I18n.text('reporting-data.missing.value');
  }

  if (propertyInfo.getIn(['format', 'type']) === NUMBER && !propertyInfo.getIn(['format', 'isFormatted'])) {
    return value;
  }

  if (propertyInfo.getIn(['format', 'type']) === ENUMERATION) {
    return propertyInfo.getIn(['format', 'options', String(value), 'label'], formatEnumeration(value));
  }

  propertyInfo = propertyInfo.set('name', propertyInfo.get('field')).set('type', propertyInfo.getIn(['format', 'type']));
  var currencyCodeColumnName = propertyInfo.getIn(['format', 'currencyCodeColumnName']);
  var currencyCode = row.get(currencyCodeColumnName);
  return propertyValueFormatter(value, propertyInfo, {
    currencyCode: currencyCode === GLOBAL_NULL ? null : currencyCode,
    frequency: propertyInfo.getIn(['format', 'frequency']),
    smallScale: smallScale
  });
};

var getReferenceHydrator = function getReferenceHydrator(response) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$smallScaleMetri = _ref2.smallScaleMetrics,
      smallScaleMetrics = _ref2$smallScaleMetri === void 0 ? ImmutableMap() : _ref2$smallScaleMetri;

  var options = arguments.length > 2 ? arguments[2] : undefined;
  var header = response.get('header');
  var identifiers = response.get('identifiers');
  return function (obj, refs, refKey, value, currencyCodeColumnName) {
    if (value === null || value === undefined) {
      return refs;
    }

    var label = hydrateValue(obj, value, header.get(refKey), identifiers && identifiers.get(refKey) ? identifiers.get(refKey) : ImmutableMap(), {
      smallScale: options.isSearch || smallScaleMetrics.get(refKey)
    });
    var url = identifiers && identifiers.getIn([refKey, value, 'references', 'url']);
    var referenceKey = currencyCodeColumnName && options.isSearch ? obj.get(currencyCodeColumnName) + "|" + String(value) : String(value);
    return refs.set(referenceKey, ImmutableMap({
      label: String(label !== null ? label : value)
    })).update(referenceKey, function (reference) {
      return url ? reference.set('link', url) : reference;
    });
  };
};

var formatProperties = function formatProperties(reportingApiDataset, options) {
  var header = reportingApiDataset.get('header');
  var data = formatData(reportingApiDataset, options);
  var smallScaleMetrics = shouldBeSmallScale(ImmutableMap({
    data: data,
    properties: header.reduce(function (acc, property, propertyName) {
      return acc.setIn([propertyName, 'type'], property.getIn(['format', 'type']));
    }, ImmutableMap())
  }), List(header.filter(function (property) {
    return property.get('columnType') === 'METRIC';
  }).keys()));
  var hydrateReferences = getReferenceHydrator(reportingApiDataset, {
    smallScaleMetrics: smallScaleMetrics
  }, options);
  return header.reduce(function (headerProperty, value, key) {
    var format = value.get('format', ImmutableMap());
    var lastRow = data.get(-1, ImmutableMap());
    var currencyCodeColumnName = format.get('currencyCodeColumnName'); // https://git.hubteam.com/HubSpot/reporting/pull/8071#discussion_r1400868

    var rowCurrency = !options.hasCurrencyDimension(currencyCodeColumnName) ? lastRow.get(currencyCodeColumnName, GLOBAL_NULL) : GLOBAL_NULL;
    var optionalFields = {};

    if (smallScaleMetrics.get(key)) {
      optionalFields.shouldBeSmallScale = true;
    }

    if (value.get('scripted', false)) {
      optionalFields.scripted = true;
    }

    return headerProperty.set(key, ImmutableMap(Object.assign({
      format: currencyCodeColumnName ? format.set('currencyCode', rowCurrency === GLOBAL_NULL ? null : rowCurrency) : format,
      label: value.get('label'),
      type: format.get('type') === ID && format.get('subType') !== 'number' ? format.get('subType') : format.get('type'),
      name: value.get('field'),
      references: data.reduce(function (referenceMap, referenceObject) {
        var referenceKey = referenceObject.get(key);

        if (List.isList(referenceKey)) {
          return referenceKey.reduce(function (listReferenceMap, listReferenceKey) {
            return hydrateReferences(referenceObject, listReferenceMap, String(key), listReferenceKey, currencyCodeColumnName);
          }, referenceMap);
        }

        return hydrateReferences(referenceObject, referenceMap, String(key), referenceKey, currencyCodeColumnName);
      }, ImmutableMap())
    }, optionalFields)));
  }, ImmutableMap());
};

export var buildDataset = function buildDataset(reportingApiDataset) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDatasetBuildOptions;
  return {
    data: formatData(reportingApiDataset, options),
    paginationSize: formatPagination(reportingApiDataset),
    properties: formatProperties(reportingApiDataset, options)
  };
};