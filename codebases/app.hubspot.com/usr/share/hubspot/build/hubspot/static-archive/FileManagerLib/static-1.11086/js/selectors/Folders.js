'use es6';

import { createSelector } from 'reselect';
import { getFolders } from 'FileManagerCore/selectors/Folders';
import { getFilteredByKeyword } from 'FileManagerCore/utils/FoldersAndFiles';

var getSearchQuery = function getSearchQuery(state) {
  return state.panel.getIn(['present', 'searchQuery']);
};

var getSelectedFolderFromPanel = function getSelectedFolderFromPanel(state) {
  return state.panel.getIn(['present', 'selectedFolder']);
};

var getSelectedFolderId = createSelector([getSelectedFolderFromPanel], function (selectedFolder) {
  return selectedFolder && selectedFolder.get('id');
});
export var getChildFolders = createSelector([getFolders, getSelectedFolderId], function (folders, selectedFolderId) {
  var parentId = !selectedFolderId ? null : selectedFolderId.toString();
  return folders.filter(function (folder) {
    return folder.get('parent_folder_id') === parentId;
  });
});
export var getFilteredFolders = createSelector([getFolders, getSearchQuery], getFilteredByKeyword);