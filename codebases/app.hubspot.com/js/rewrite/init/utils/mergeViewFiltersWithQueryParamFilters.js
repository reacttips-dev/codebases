'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import get from 'transmute/get';
import pluck from 'transmute/pluck';
import { FiltersQueryParam, SpecificPropertyFilterQueryParams } from '../constants/QueryParamsThatRequireParsing';
import { getJsonFilters } from './getJsonFilters';
export var getFilterForSpecificPropertyParam = function getFilterForSpecificPropertyParam(property, value) {
  return property === 'formSubmissions.formId' ? {
    operator: 'IN',
    property: property,
    values: [value]
  } : {
    operator: 'EQ',
    property: property,
    value: value
  };
};
export var mergeViewFiltersWithQueryParamFilters = function mergeViewFiltersWithQueryParamFilters(_ref) {
  var filtersFromView = _ref.filtersFromView,
      params = _ref.params;
  // Extract and parse 'filters' query param
  var filtersFromFiltersParam = getJsonFilters(get(FiltersQueryParam, params) || '[]'); // Extract specific property filter query params and merge them into a single set of filters

  var filtersFromSpecificPropertyParams = SpecificPropertyFilterQueryParams.reduce(function (filtersFromParams, specificPropertyName) {
    var value = get(specificPropertyName, params);

    if (value) {
      filtersFromParams.push(getFilterForSpecificPropertyParam(specificPropertyName, value));
    }

    return filtersFromParams;
  }, []); // We only want to dedupe later "groups" (filters param, specific property params, and views)
  // of filters from earlier groups. It is fine if a filter appears more than once in a given "group",
  // we just want to ensure that later groups do not override earlier groups.

  var propertiesInFiltersParam = pluck('property', filtersFromFiltersParam);
  var propertiesInBothParamTypes = [].concat(_toConsumableArray(propertiesInFiltersParam), _toConsumableArray(pluck('property', filtersFromSpecificPropertyParams)));
  var dedupedSpecificPropertyFilters = filtersFromSpecificPropertyParams.filter(function (_ref2) {
    var property = _ref2.property;
    return !propertiesInFiltersParam.includes(property);
  });
  var dedupedViewFilters = filtersFromView.filter(function (_ref3) {
    var property = _ref3.property;
    return !propertiesInBothParamTypes.includes(property);
  });
  return [].concat(_toConsumableArray(filtersFromFiltersParam), _toConsumableArray(dedupedSpecificPropertyFilters), _toConsumableArray(dedupedViewFilters));
};