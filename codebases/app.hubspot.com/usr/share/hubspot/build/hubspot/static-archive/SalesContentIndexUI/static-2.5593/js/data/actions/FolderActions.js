'use es6';

import { OrderedMap } from 'immutable';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';

var searchResultsToMap = function searchResultsToMap(results) {
  return results.reduce(function (searchResultsMap, result) {
    var searchResult = SearchResultRecord.init(result);
    return searchResultsMap.set(searchResult.id, searchResult);
  }, OrderedMap());
};

var getActions = function getActions(searchFetch) {
  return {
    search: function search(folderSearchQuery) {
      return searchFetch(folderSearchQuery).then(function (resultsData) {
        return {
          hasMore: resultsData.get('hasMore'),
          results: searchResultsToMap(resultsData.get('results'))
        };
      });
    }
  };
};

var FolderActions = {
  create: function create() {
    var _actions;

    return {
      init: function init(searchFetch) {
        if (!_actions) {
          _actions = getActions(searchFetch);
        }
      },
      get: function get(action) {
        if (!_actions) {
          throw new Error('Must call init on FolderActions before retrieving actions');
        }

        return action ? _actions[action] : _actions;
      }
    };
  }
};
export default FolderActions.create();