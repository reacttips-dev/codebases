'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function searchFolders(_ref) {
  var folderContentType = _ref.folderContentType,
      searchInput = _ref.searchInput;
  return apiClient.post('/salescontentsearch/v2/search', {
    data: {
      filters: [{
        field: 'content_type',
        values: [folderContentType]
      }],
      limit: 20,
      offset: 0,
      query: searchInput
    }
  });
}