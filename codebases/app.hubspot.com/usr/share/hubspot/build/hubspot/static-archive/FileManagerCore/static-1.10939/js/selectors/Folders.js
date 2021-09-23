'use es6';

import { createSelector } from 'reselect';
import { getAncestors, getParentFolder, makeFolderTree } from '../utils/FoldersAndFiles';
import { RequestStatus } from '../Constants';
export var findFolderByPath = function findFolderByPath(folders, path) {
  if (!path) {
    return null;
  }

  return folders.find(function (folder) {
    return folder.get('full_path') === path;
  });
};
export var getFolders = function getFolders(state) {
  return state.folders.get('objects').toList();
};
export var getFoldersById = function getFoldersById(state) {
  return state.folders.get('objects');
};
export var getFoldersCount = function getFoldersCount(state) {
  return state.folders.get('total');
};
export var getSelectedFolder = function getSelectedFolder(state, props) {
  return props.selectedFolder;
};
export var getFileFromProps = function getFileFromProps(state, props) {
  return props.file;
};
export var getParentFolderForFile = createSelector([getFileFromProps], getParentFolder);
export var getSelectedFolderAncestors = createSelector([getSelectedFolder, getFoldersById], getAncestors);
export var getFolderTree = createSelector([getFoldersById], makeFolderTree);
export var getFolderRequestInfo = function getFolderRequestInfo(state, requestType, requestLookupKey) {
  return state.folders.getIn(['requests', requestType, requestLookupKey]);
};
export var hasFolderRequestSucceeded = function hasFolderRequestSucceeded(state, requestType, requestLookupKey) {
  var requestInfo = getFolderRequestInfo(state, requestType, requestLookupKey);
  return requestInfo && requestInfo.get('status') === RequestStatus.SUCCEEDED;
};
export var hasFolderRequestInitialized = function hasFolderRequestInitialized(state, requestType, requestLookupKey) {
  var requestInfo = getFolderRequestInfo(state, requestType, requestLookupKey);
  return requestInfo && [RequestStatus.SUCCEEDED, RequestStatus.PENDING].includes(requestInfo.get('status'));
};