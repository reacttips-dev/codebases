'use es6';

import { getTrackingMeta } from '../actions/tracking';
import { getSearchQuery, getIsSearching, getSearchExtension } from '../selectors/Files';
import { isFile } from '../utils/FoldersAndFiles';
export var getSearchType = function getSearchType(name, query) {
  var searchType = 'contains';
  var lowerCaseName = name ? name.toLowerCase() : '';
  var lowerCaseQuery = query ? query.toLowerCase() : '';

  if (lowerCaseName.indexOf(lowerCaseQuery) === 0 && lowerCaseName.length > lowerCaseQuery.length) {
    searchType = 'startsWith';
  } else if (lowerCaseQuery === lowerCaseName) {
    searchType = 'equals';
  } else if (lowerCaseName.endsWith(lowerCaseQuery)) {
    searchType = 'endsWith';
  } else if (lowerCaseName.indexOf(lowerCaseQuery) === -1) {
    searchType = 'other';
  }

  return searchType;
};
export var experimentalTrackSearchType = function experimentalTrackSearchType(state, fileOrFolder, dispatch) {
  var fileOrFolderName = fileOrFolder.get('name');
  var searchQueryWithoutExtension = getSearchQuery(state);
  var systemRecognizedFileExtension = getSearchExtension(state);
  var isSearchActive = getIsSearching(state);

  if (isSearchActive) {
    var searchType = getSearchType(fileOrFolderName, searchQueryWithoutExtension);
    dispatch({
      type: 'TRACK_SEARCH_TYPE',
      meta: getTrackingMeta('fileManagerSearchEfficiency', 'select', {
        searchType: searchType,
        objectType: isFile(fileOrFolder) ? 'file' : 'folder',
        extension: systemRecognizedFileExtension,
        selectedObjectName: fileOrFolderName,
        searchQueryWithoutExtension: searchQueryWithoutExtension
      })
    });
  }
};