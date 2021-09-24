'use es6';

import memoize from 'transmute/memoize';
import http from 'hub-http/clients/apiClient';
import get from 'transmute/get';
import { createCustomObjectGetter } from 'reference-resolvers/formatters/formatCustomObjects';
import { createFetchSearchPage, createFetchByIds } from './CrmSearchAPI';
var createSearchOptions = memoize(function (nameProperty) {
  return {
    requestOptions: {
      includeAllValues: true
    },
    filterGroups: [{
      filters: []
    }],
    sorts: [{
      property: nameProperty,
      order: 'ASC'
    }]
  };
});
var crmObjectFormatterOptions = memoize(function (uniqueIdProperty, nameProperty) {
  return {
    getters: {
      getId: createCustomObjectGetter(uniqueIdProperty),
      getDescription: createCustomObjectGetter(uniqueIdProperty),
      getLabel: createCustomObjectGetter(nameProperty)
    }
  };
});
export var createFetchCrmObjectsByIds = function createFetchCrmObjectsByIds(options) {
  return function (objectType, uniqueIdProperty, nameProperty) {
    var fetchByIds = createFetchByIds(options)(objectType, {
      searchOptions: createSearchOptions(nameProperty),
      formatterOptions: crmObjectFormatterOptions(uniqueIdProperty, nameProperty)
    });
    return function (ids) {
      return fetchByIds({
        idPropName: uniqueIdProperty
      }, ids).then(get('results'));
    };
  };
};
export var fetchCrmObjectsByIds = createFetchCrmObjectsByIds({
  httpClient: http
});
export var createFetchCrmObjectsSearchPage = function createFetchCrmObjectsSearchPage(options) {
  return function (objectType, uniqueIdProperty, nameProperty) {
    return createFetchSearchPage(options)(objectType, {
      searchOptions: createSearchOptions(nameProperty),
      formatterOptions: crmObjectFormatterOptions(uniqueIdProperty, nameProperty)
    });
  };
};
export var fetchCrmObjectsSearchPage = createFetchCrmObjectsSearchPage({
  httpClient: http
});