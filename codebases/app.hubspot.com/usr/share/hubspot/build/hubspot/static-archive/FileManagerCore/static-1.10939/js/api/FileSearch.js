'use es6';

import http from 'hub-http/clients/apiClient';
import pick from '../utils/pick';
import { ObjectCategory } from '../Constants';
import { FOLDER_SEARCH_REQUEST_LIMIT } from '../constants/Api';
import { containsDoubleByteUnicode } from '../utils/stringUtils';
export var BASE_URI = 'file-manager-search/v2/search';
var DEFAULT_QUERY = {
  category: ObjectCategory.FILE
};
export function shouldUseExactContains(searchTerm) {
  return !containsDoubleByteUnicode(searchTerm);
}
export var translateLegacyOptions = function translateLegacyOptions(legacyOptions, isUngatedForFuzzyUnicodeSearch) {
  var options = pick(legacyOptions, ['archived', 'limit', 'offset', 'extension']);

  if (legacyOptions.type) {
    options.fileType = legacyOptions.type;
  }

  if (legacyOptions.search) {
    options.name = legacyOptions.search;

    if (!isUngatedForFuzzyUnicodeSearch || shouldUseExactContains(legacyOptions.search)) {
      options.searchType = 'contains';
      options.mimicContains = true;
    }
  } else {
    if (legacyOptions.folder_id) {
      options.folderId = legacyOptions.folder_id;

      if (options.folderId === 'None') {
        options.folderId = 0;
      }
    }
  }

  if (legacyOptions.order_by) {
    options.orderBy = legacyOptions.order_by.replace('updated', 'updatedAt');
  }

  return options;
};
export var fetchFilesFromSearch = function fetchFilesFromSearch(legacyOptions, isUngatedForFuzzyUnicodeSearch) {
  var options = translateLegacyOptions(legacyOptions, isUngatedForFuzzyUnicodeSearch);
  var query = Object.assign({}, DEFAULT_QUERY, {}, options);
  return http.get(BASE_URI, {
    query: query
  });
};
export var fetchFoldersFromSearch = function fetchFoldersFromSearch(legacyOptions) {
  var options = translateLegacyOptions(legacyOptions);
  var query = Object.assign({}, DEFAULT_QUERY, {}, options, {
    category: ObjectCategory.FOLDER,
    limit: FOLDER_SEARCH_REQUEST_LIMIT
  });
  return http.get(BASE_URI, {
    query: query
  });
};