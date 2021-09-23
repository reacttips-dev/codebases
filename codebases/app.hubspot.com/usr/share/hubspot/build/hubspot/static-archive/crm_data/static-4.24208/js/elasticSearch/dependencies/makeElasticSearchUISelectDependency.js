'use es6';

import { elasticSearchApiInfo } from 'crm_data/elasticSearch/api/ElasticSearchAPIInfo';
import ElasticSearchStore from 'crm_data/elasticSearch/ElasticSearchStore';
import derefSearchText from 'crm_data/dependencies/derefSearchText';
import { parseMatches } from 'crm_data/associations/AssociationOptionsDependencyHelpers';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { fromJS } from 'immutable';
import SearchAPIQuery from 'crm_data/elasticSearch/api/SearchAPIQuery';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { isCjkCharacterContained } from 'crm_data/elasticSearch/ElasticSearchValidation';
import emptyFunction from 'react-utils/emptyFunction';

var makeElasticSearchUISelectDependency = function makeElasticSearchUISelectDependency(SubjectStore, objectType) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var getSearchText = opts.getSearchText || derefSearchText;
  var stores = opts.stores || [];
  var minimumSearchLength = opts.minimumSearchLength || MIN_SEARCH_LENGTH;
  var getFilterGroups = opts.getFilterGroups || emptyFunction;
  return {
    stores: stores.concat([SubjectStore, ElasticSearchStore]),
    deref: function deref(props, state) {
      var searchText = getSearchText(props, state);
      var overrideMinimumSearch = props.state && props.state.overrideMinimumSearch;

      if (!searchText || !isCjkCharacterContained(searchText) && !overrideMinimumSearch && searchText.length < minimumSearchLength) {
        // TODO if this is EMPTY, the dropdown closes :facepalm:
        return LOADING;
      }

      var searchQuery = SearchAPIQuery.default(fromJS({
        query: searchText,
        count: 25
      }), objectType);
      var filterGroups = getFilterGroups(props.objectType);

      if (filterGroups) {
        searchQuery = searchQuery.set('filterGroups', filterGroups);
      }

      var options = {
        cacheTimeout: 5000
      };
      var ids = ElasticSearchStore.get({
        objectType: objectType,
        searchQuery: searchQuery,
        options: options,
        overrideMinimumSearch: overrideMinimumSearch
      });

      var _elasticSearchApiInfo = elasticSearchApiInfo(objectType),
          dataKey = _elasticSearchApiInfo.dataKey;

      if (!ids || !ids.get(dataKey)) {
        return LOADING;
      }

      return parseMatches(SubjectStore.get(ids.get(dataKey)));
    }
  };
};

export default makeElasticSearchUISelectDependency;