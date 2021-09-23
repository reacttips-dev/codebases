'use es6';

import { fromJS, List } from 'immutable';
import pick from 'transmute/pick';
import identity from 'transmute/identity';
import { LOADING } from 'crm_data/constants/LoadingStatus';
import derefSearchText from 'crm_data/dependencies/derefSearchText';
import { elasticSearchApiInfo } from 'crm_data/elasticSearch/api/ElasticSearchAPIInfo';
import ElasticSearchStore from 'crm_data/elasticSearch/ElasticSearchStore';
import { parseValue, toMatch } from './SearchResults';
import SearchAPIQuery from 'crm_data/elasticSearch/api/SearchAPIQuery';
var CACHE_TIME = 5000;
var COUNT = 20;
var options = {
  cacheTimeout: CACHE_TIME
};
var pickSearchQueryOptions = pick(['count', 'filterGroups', 'sorts']);

var parseMatches = function parseMatches(matches, toMatchFn) {
  if (!matches) {
    return [];
  }

  return matches.map(toMatchFn).toArray();
};

export default function makeElasticSearchSelectDependency(SubjectStore) {
  var searchQueryOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _searchQueryOptions = searchQueryOptions,
      _searchQueryOptions$p = _searchQueryOptions.parseMatchValue,
      parseMatchValue = _searchQueryOptions$p === void 0 ? parseValue : _searchQueryOptions$p,
      _searchQueryOptions$p2 = _searchQueryOptions.processMatchesFunc,
      processMatchesFunc = _searchQueryOptions$p2 === void 0 ? identity : _searchQueryOptions$p2,
      _searchQueryOptions$t = _searchQueryOptions.toMatchFunc,
      toMatchFunc = _searchQueryOptions$t === void 0 ? toMatch : _searchQueryOptions$t;
  searchQueryOptions = pickSearchQueryOptions(searchQueryOptions);
  return {
    stores: [ElasticSearchStore, SubjectStore],
    deref: function deref(props) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var filterFunc = props.filterFunc,
          objectType = props.objectType,
          parseFunc = props.parseFunc,
          value = props.value;
      var searchText = derefSearchText(props, state);

      if (!searchText) {
        if (!value) return LOADING;
        var values = Array.isArray(value) ? List(value) : List.of(value);
        var parsedValues = values.map(parseMatchValue);

        if (parsedValues.some(function (parsedValue) {
          return !parsedValue.id;
        })) {
          return LOADING;
        }

        var valueMatches = parsedValues.reduce(function (acc, _ref) {
          var id = _ref.id;
          return acc.concat(List.of(SubjectStore.get(id)));
        }, List()).filter(identity);
        if (valueMatches.isEmpty()) return LOADING;
        var processedMatches = processMatchesFunc(valueMatches, {
          value: parsedValues
        });
        return parseMatches(processedMatches, toMatchFunc);
      }

      var searchQuery = SearchAPIQuery.default(fromJS(Object.assign({
        query: searchText,
        count: COUNT
      }, searchQueryOptions)), objectType);
      var ids = ElasticSearchStore.get({
        objectType: objectType,
        searchQuery: searchQuery,
        options: options
      });

      if (!ids) {
        return LOADING;
      }

      var dataAttribute = elasticSearchApiInfo(objectType).dataKey;
      var matches = SubjectStore.get(ids.get(dataAttribute));

      if (processMatchesFunc) {
        matches = processMatchesFunc(matches, {
          searchText: searchText
        });
      }

      matches = parseMatches(matches, toMatchFunc);

      if (filterFunc) {
        matches = matches.filter(filterFunc);
      }

      if (parseFunc) {
        matches = parseFunc(matches);
      }

      return matches;
    }
  };
}