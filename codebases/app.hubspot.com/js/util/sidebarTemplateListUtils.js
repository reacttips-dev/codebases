'use es6';

import * as EditorFolderTypes from 'SequencesUI/constants/EditorFolderTypes';
export var isRealFolder = function isRealFolder(folderId) {
  return folderId !== 0 && folderId !== EditorFolderTypes.CREATED_BY_ME && folderId !== EditorFolderTypes.CREATED_BY_MY_TEAM && folderId !== EditorFolderTypes.ALL_TEMPLATES;
};
export var viewingAllTemplates = function viewingAllTemplates(_ref) {
  var folderId = _ref.folderId,
      searchTerm = _ref.searchTerm;
  return isRealFolder(folderId) && searchTerm === '';
};