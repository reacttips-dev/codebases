'use es6';

import { searchFolders } from 'SalesContentIndexUI/api/FoldersApi';
export function loadFolderOptions(folderContentType, searchInput, callback) {
  return searchFolders({
    folderContentType: folderContentType,
    searchInput: searchInput
  }).then(function (resp) {
    return resp.results.map(function (folderResult) {
      return {
        text: folderResult.name,
        value: folderResult.contentId
      };
    });
  }).then(function (options) {
    return callback(null, {
      options: options
    });
  });
}