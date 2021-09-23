'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { isVisibleGridProperty } from 'crm_data/properties/GridProperties';
import ScopesContainer from '../../../containers/ScopesContainer';
import ViewsActions from '../../flux/views/ViewsActions';
import CustomPropertyHelper from '../../utils/CustomPropertyHelper';
import HiddenProperties from '../../utils/HiddenProperties';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import { DEFAULT, TEMP } from 'customer-data-objects/view/ViewTypes';
import { is, List, Map as ImmutableMap, OrderedSet, fromJS } from 'immutable';
import get from 'transmute/get';
import Raven from 'Raven';
import { normalizeTypeId } from '../../../utils/normalizeTypeId';
import { replaceInvalidAssociationColumnByName } from '../../../rewrite/associations/utils/replaceInvalidAssociationColumnByName';
import { parseAssociationIdFromColumnName } from '../../../rewrite/associations/utils/associationIdUtils';
import { isSupportedGridAssociation } from '../../../rewrite/associations/utils/isSupportedGridAssociation';

var filterAndAdd = function filterAndAdd(columns, name) {
  if (columns.indexOf(name) === -1) {
    return columns.unshift(name);
  }

  return columns;
};

var getJsonColumns = function getJsonColumns(value) {
  if (!value) {
    return List();
  }

  try {
    return fromJS(JSON.parse(decodeURIComponent(value)));
  } catch (err) {
    Raven.captureException('Failed to parse grid column query param JSON', {
      extra: {
        err: err,
        value: value
      }
    });
    return List();
  }
};

var mergeDefaultViewColumns = function mergeDefaultViewColumns() {
  var queryParamsColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var favoriteColumns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : List();
  var queryParamsColumnsArray = List.isList(queryParamsColumns) ? queryParamsColumns.toArray() : [];
  var favoriteColumnsArray = List.isList(favoriteColumns) ? favoriteColumns.toArray() : [];
  return OrderedSet([].concat(_toConsumableArray(queryParamsColumnsArray), _toConsumableArray(favoriteColumnsArray))).toList();
};

export var buildRouteParams = function buildRouteParams(_ref) {
  var associations = _ref.associations,
      _ref$dispatchSafe = _ref.dispatchSafe,
      dispatchSafe = _ref$dispatchSafe === void 0 ? false : _ref$dispatchSafe,
      favoriteColumns = _ref.favoriteColumns,
      isNewAssociationsUngated = _ref.isNewAssociationsUngated,
      isFlexibleAssociationsUngated = _ref.isFlexibleAssociationsUngated,
      _ref$normalizedQuery = _ref.normalizedQuery,
      normalizedQuery = _ref$normalizedQuery === void 0 ? {} : _ref$normalizedQuery,
      objectType = _ref.objectType,
      properties = _ref.properties,
      query = _ref.query,
      _ref$requiredColumns = _ref.requiredColumns,
      requiredColumns = _ref$requiredColumns === void 0 ? [] : _ref$requiredColumns,
      view = _ref.view,
      viewId = _ref.viewId;
  var viewType = view.get('type');
  var columns = view.get('columns').map(get('name'));
  var isDefaultOrTempView = view.get('type') === DEFAULT || view.get('type') === TEMP;
  var queryParamColumns = getJsonColumns(normalizedQuery.columns);
  var hasDefaultViewColumns = favoriteColumns && favoriteColumns.size > 0 || queryParamColumns && queryParamColumns.size > 0;
  var defaultViewColumns = hasDefaultViewColumns ? mergeDefaultViewColumns(queryParamColumns, favoriteColumns) : List();
  var initialColumns = isDefaultOrTempView && hasDefaultViewColumns ? defaultViewColumns : columns;
  var allColumns = requiredColumns.reduce(filterAndAdd, initialColumns);
  var allColumnsWithAssociationColumns = allColumns.reduce(function (newColumns, columnName) {
    return newColumns.concat(List(replaceInvalidAssociationColumnByName(columnName, normalizeTypeId(objectType), isNewAssociationsUngated, isFlexibleAssociationsUngated)));
  }, OrderedSet()).toList();

  var isAssociation = function isAssociation(columnName) {
    var associationId = parseAssociationIdFromColumnName(columnName);
    var associationDefinition = get(associationId, associations);

    if (associationDefinition) {
      if (!isNewAssociationsUngated) {
        return false;
      }

      return isSupportedGridAssociation(associationDefinition);
    }

    return false;
  };

  var isProperty = function isProperty(columnName) {
    var property = properties.get(columnName);
    return property && isVisibleGridProperty(ScopesContainer.get(), property);
  };

  var isCustom = function isCustom(columnName) {
    var customProperty = CustomPropertyHelper.get(objectType, columnName);
    return customProperty.size > 0;
  };

  var isValidColumnName = function isValidColumnName(columnName) {
    return (isProperty(columnName) || isCustom(columnName) || isAssociation(columnName)) && !HiddenProperties.hasIn([objectType, columnName]);
  };

  var newColumns = allColumnsWithAssociationColumns.filter(isValidColumnName);
  var oldColumns = get('columns', view) || List();
  var viewColumns = newColumns.map(function (propertyName) {
    var existingColumn = oldColumns.find(function (column) {
      return column.get('name') === propertyName;
    });
    return existingColumn || ImmutableMap({
      name: propertyName
    });
  });
  var sortedColumns = viewColumns.map(function (column, index) {
    var preOrder = CustomPropertyHelper.get(objectType, column.get('name')).get('order');
    var columnOrder = isNaN(column.get('order')) ? index : parseInt(column.get('order'), 10);
    return column.set('order', preOrder || columnOrder);
  }).sortBy(function (column) {
    return column.get('order');
  });

  if (!is(newColumns, columns)) {
    ViewsActions.changeColumns(ImmutableMap({
      updateCachedView: true,
      dispatchSafe: dispatchSafe,
      objectType: objectType,
      viewId: viewId,
      columns: sortedColumns
    }));
  }

  return {
    query: query,
    objectType: objectType,
    viewId: viewId,
    viewType: viewType,
    pageType: INDEX,
    viewColumns: sortedColumns
  };
};