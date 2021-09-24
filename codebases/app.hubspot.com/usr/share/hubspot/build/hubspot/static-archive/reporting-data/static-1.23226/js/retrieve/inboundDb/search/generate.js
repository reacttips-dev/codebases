'use es6';

import { fromJS, Set as ImmutableSet, List } from 'immutable';
import getfilterGroupsExtractor from '../common/extractors/filterGroups';
import getSortsExtractor from '../common/extractors/sorts';
import mapSortProperties from './mapSortProperties';
import { getPropertiesMap } from '../../../properties/getProperty';
import { DESC } from '../../../constants/sortOrder';
import { IN } from '../../../constants/operators';
import { STRING } from '../../../constants/property-types';
import * as DataTypes from '../../../constants/dataTypes';
var DEFAULT_ROW_COUNT = 5;
export var generate = function generate(config, idProperty) {
  var filterGroupsExtractor = getfilterGroupsExtractor();
  var dataType = config.get('dataType');
  var extractedFilterGroups = fromJS(filterGroupsExtractor(config));
  var filterProperties = extractedFilterGroups.reduce(function (memo, filterGroup) {
    return filterGroup.get('filters').reduce(function (innerMemo, filter) {
      return innerMemo.add(filter.get('property'));
    }, memo);
  }, ImmutableSet());
  var propertiesPromise = getPropertiesMap(dataType, filterProperties);
  var filterGroupsPromise = propertiesPromise.then(function (properties) {
    return extractedFilterGroups.map(function (filterGroup) {
      return filterGroup.update('filters', function () {
        var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
        return filters.map(function (filter) {
          var property = properties.get(filter.get('property'));

          if (filter.get('operator') === IN && property.get('type') === STRING) {
            return filter.set('propertySuffix', 'raw');
          }

          return filter;
        });
      });
    });
  });
  var sortsExtractor = getSortsExtractor();
  var sorts = sortsExtractor(config);

  if (sorts.length === 0 && config.getIn(['filters', 'dateRange', 'property'])) {
    sorts.push({
      property: config.getIn(['filters', 'dateRange', 'property']),
      order: DESC
    });
  }

  if (idProperty) {
    sorts.push({
      property: dataType === DataTypes.CROSS_OBJECT ? idProperty : 'hs_object_id',
      order: DESC
    });
  }

  return filterGroupsPromise.then(function (filterGroups) {
    return fromJS({
      count: config.get('limit') || DEFAULT_ROW_COUNT,
      offset: config.get('offset') || 0,
      filterGroups: filterGroups,
      sorts: mapSortProperties(config, sorts)
    });
  });
};