'use es6';

import { createSelector } from 'reselect';
import { getIsFileBeingReplaced } from '../utils/file';
export var getFiles = function getFiles(state) {
  return state.files.get('objects');
};
export var getFilesTotal = function getFilesTotal(state) {
  return state.files.get('total');
};
export var getFetchFilesRequestStatus = function getFetchFilesRequestStatus(state) {
  return state.files.get('status');
};
export var getFilesQuery = function getFilesQuery(state) {
  return state.files.get('query');
};
export var getSearchQuery = createSelector([getFilesQuery], function (query) {
  return query.get('search');
});
export var getSearchExtension = createSelector([getFilesQuery], function (query) {
  return query.get('extension');
});
export var getIsSearching = createSelector([getSearchQuery], function (search) {
  return Boolean(search);
});
export var getIsFilteringArchived = createSelector([getFilesQuery], function (query) {
  return Boolean(query.get('archived'));
});
export var getIsFilteringType = createSelector([getFilesQuery], function (query) {
  return Boolean(query.get('type'));
});
export var getIsFilteringExtension = createSelector([getFilesQuery], function (query) {
  return Boolean(query.get('extension'));
});
export var getFetchFilesTimestamp = function getFetchFilesTimestamp(state) {
  return state.files.get('timestamp');
};
export var getVideoPlayerRequestStatus = function getVideoPlayerRequestStatus(state) {
  return state.files.get('videoPlayerRequestStatus');
};
export var getAreFilesBeingReplaced = createSelector([getFiles], function (files) {
  return files.some(getIsFileBeingReplaced);
});