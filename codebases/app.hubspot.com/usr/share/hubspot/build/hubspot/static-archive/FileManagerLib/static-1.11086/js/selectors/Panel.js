'use es6';

import { createSelector } from 'reselect';
import { List } from 'immutable';
import { getFoldersById } from 'FileManagerCore/selectors/Folders';
import { getAncestors, getHomeFolder, getParentFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import { getSingleFileDetails } from 'FileManagerCore/selectors/FileDetails';
import { addSupportInfoToFiles } from '../utils/fileFiltering';
import { getFilter } from './Filter';
import { getIsHostAppContextPrivate } from './Configuration';
export var getPanelType = function getPanelType(state, props) {
  return props.type;
};

var getPanel = function getPanel(state) {
  return state.panel.get('present');
};

export var getPreviousPanel = function getPreviousPanel(state) {
  return state.panel.get('past').last();
};
export var getActivePanel = function getActivePanel(state) {
  return state.panel.getIn(['present', 'activePanel']);
};
export var getSelectedFolderInPanel = function getSelectedFolderInPanel(state) {
  return state.panel.getIn(['present', 'selectedFolder']);
};
var getSelectedFile = createSelector([getPanel], function (panel) {
  return panel.get('selectedFile');
});
export var getSearchQuery = createSelector([getPanel], function (panel) {
  return panel.get('searchQuery');
});
export var getSelectedFileId = createSelector([getPanel], function (panel) {
  return panel.getIn(['selectedFile', 'id']);
});
export var getSelectedFileInPanel = createSelector([getSelectedFile, getSingleFileDetails, getFilter, getIsHostAppContextPrivate], function (selectedFile, singleFileDetails, filter, isHostAppContextPrivate) {
  if (!selectedFile) {
    return null;
  }

  var selectedFileId = selectedFile.get('id');
  var full_path = selectedFile.get('full_path');
  var file = singleFileDetails.get(selectedFileId) || selectedFile;
  return addSupportInfoToFiles(List.of(file.merge({
    full_path: full_path
  })), filter, isHostAppContextPrivate).first();
});
export var getSelectedStockFile = function getSelectedStockFile(state) {
  return state.panel.getIn(['present', 'selectedStockFile']);
};
export var getParentFolderForSelectFile = createSelector([getSelectedFileInPanel, getFoldersById], function (selectedFile, folders) {
  return getParentFolder(selectedFile, folders);
});
export var getIsBrowsingFolder = createSelector([getSelectedFolderInPanel], function (selectedFolder) {
  return Boolean(selectedFolder && selectedFolder.get('id'));
});
export var getSelectedFolderWithAncestors = createSelector([getSelectedFolderInPanel, getFoldersById], function (selectedFolder, folders) {
  if (!selectedFolder) {
    return List();
  }

  if (!selectedFolder.get('id')) {
    return List.of(getHomeFolder());
  }

  return List.of(getHomeFolder()).concat(getAncestors(selectedFolder, folders).toList());
});