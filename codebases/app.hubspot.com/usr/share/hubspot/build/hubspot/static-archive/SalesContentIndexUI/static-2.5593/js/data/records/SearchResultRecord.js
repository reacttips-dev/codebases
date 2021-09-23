'use es6';

import text from 'I18n/utils/unescapedText';
import { Record } from 'immutable';
import UserViewRecord from './UserViewRecord';
var SearchResultRecord = Record({
  id: null,
  contentId: null,
  contentType: null,
  createdAt: null,
  documentId: null,
  folderId: null,
  name: null,
  portalId: null,
  shortcut: null,
  updatedAt: null,
  lastUsedAt: null,
  userId: null,
  metadata: null,
  userView: UserViewRecord(),
  publicationStage: null
}, 'SearchResultRecord');

SearchResultRecord.init = function (searchResult) {
  var contentType = searchResult.get('contentType');
  var contentId = searchResult.get('contentId');
  return SearchResultRecord(searchResult.set('id', contentType + "_" + contentId));
};

SearchResultRecord.initFromJS = function (resultJSON) {
  return SearchResultRecord.init(SearchResultRecord(resultJSON));
};

SearchResultRecord.appendCopy = function (searchResult) {
  return searchResult.update('name', function (name) {
    return text('salesContentIndexUI.copy', {
      name: name
    });
  });
};

export default SearchResultRecord;