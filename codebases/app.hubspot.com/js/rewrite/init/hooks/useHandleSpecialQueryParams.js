'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import get from 'transmute/get';
import has from 'transmute/has';
import { fromJS } from 'immutable';
import { useEffect, useMemo } from 'react';
import { useQueryParams } from '../../../router/useQueryParams';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { useViewActions } from '../../views/hooks/useViewActions';
import { getJsonColumns } from '../utils/getJsonColumns';
import { FiltersQueryParam, ColumnsQueryParam, SpecificPropertyFilterQueryParams, DenormalizedPropertyFilterQueryParamMapping } from '../constants/QueryParamsThatRequireParsing';
import { mergeViewFiltersWithQueryParamFilters } from '../utils/mergeViewFiltersWithQueryParamFilters';
import { normalizeQueryParams } from '../utils/normalizeQueryParams'; // Setting params to undefined will remove them from the url

var queryWithoutParsedParams = [FiltersQueryParam, ColumnsQueryParam].concat(_toConsumableArray(SpecificPropertyFilterQueryParams), _toConsumableArray(Object.keys(DenormalizedPropertyFilterQueryParamMapping))).reduce(function (query, param) {
  query[param] = undefined;
  return query;
}, {});
export var hasQueryParamsThatMakeFilters = function hasQueryParamsThatMakeFilters(params) {
  return has(FiltersQueryParam, params) || SpecificPropertyFilterQueryParams.some(function (param) {
    return has(param, params);
  });
};
export var useHandleSpecialQueryParams = function useHandleSpecialQueryParams() {
  var rawParams = useQueryParams();
  var params = useMemo(function () {
    return normalizeQueryParams(rawParams);
  }, [rawParams]);

  var _useCurrentView = useCurrentView(),
      viewFilters = _useCurrentView.filters,
      viewColumns = _useCurrentView.columns;

  var hasParamsThatMakeFilters = useMemo(function () {
    return hasQueryParamsThatMakeFilters(params);
  }, [params]);
  var hasParamsThatMakeColumns = has(ColumnsQueryParam, params);

  var _useViewActions = useViewActions(),
      onFiltersChanged = _useViewActions.onFiltersChanged,
      onColumnsChanged = _useViewActions.onColumnsChanged;

  var navigate = useNavigate();
  useEffect(function () {
    if (hasParamsThatMakeFilters) {
      var mergedFilters = mergeViewFiltersWithQueryParamFilters({
        filtersFromView: viewFilters.toJS(),
        params: params
      });
      onFiltersChanged(mergedFilters);
    }

    if (hasParamsThatMakeColumns) {
      var parsedColumns = getJsonColumns(get(ColumnsQueryParam, params));

      if (parsedColumns) {
        var mergedColumns = fromJS(parsedColumns.map(function (name) {
          return {
            name: name
          };
        })).concat(viewColumns);
        onColumnsChanged(mergedColumns, false);
      }
    }

    if (hasParamsThatMakeFilters || hasParamsThatMakeColumns) {
      navigate({
        query: queryWithoutParsedParams
      });
    }
  }, [viewColumns, viewFilters, hasParamsThatMakeColumns, hasParamsThatMakeFilters, navigate, onColumnsChanged, onFiltersChanged, params]);
  return !hasParamsThatMakeFilters && !hasParamsThatMakeColumns;
};