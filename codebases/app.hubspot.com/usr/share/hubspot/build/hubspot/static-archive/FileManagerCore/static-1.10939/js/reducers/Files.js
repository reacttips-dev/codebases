'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import Immutable from 'immutable';
import { ARCHIVE_FILE_SUCCEEDED, BULK_DELETE_ATTEMPTED, BULK_DELETE_FAILED, BULK_MOVE_ATTEMPTED, BULK_MOVE_FAILED, BULK_IMAGE_IMPORT_SUCCEEDED, DELETE_FILE_SUCCEEDED, FETCH_FILES_ATTEMPTED, FETCH_FILES_FAILED, FETCH_FILES_SUCCEEDED, FETCH_MORE_FILES_ATTEMPTED, FETCH_MORE_FILES_SUCCEEDED, FETCH_MORE_FILES_FAILED, MOVE_FILE_SUCCEEDED, RENAME_FILE_ATTEMPTED, RENAME_FILE_FAILED, RENAME_FILE_SUCCEEDED, REPLACE_FILE_ATTEMPTED, REPLACE_FILE_PROGRESS, REPLACE_FILE_SUCCEEDED, REPLACE_FILE_FAILED, SAVE_EDIT_SUCCEEDED, UNARCHIVE_FILE_SUCCEEDED, UPLOAD_FILE_SUCCEEDED, CREATE_VIDYARD_PLAYERID_SUCCEEDED, CREATE_VIDYARD_PLAYERID_ATTEMPTED, SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED, CREATE_VIDYARD_PLAYERID_FAILED, SOFT_DELETE_VIDYARD_PLAYERID_FAILED, DOWNLOAD_FROM_CANVA_SUCCEEDED, DOWNLOAD_FROM_DROPBOX_SUCCEEDED, DOWNLOAD_FROM_DRIVE_SUCCEEDED, VIDEO_THUMBNAIL_UPDATE_SUCCEEDED, GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED, SELECT_FILE, UPLOAD_EDITED_IMAGE_SUCCEEDED, CHANGE_FILE_ACCESSIBILITY_REQUEST_SUCCEEDED, REMOVE_CANVA_ID_SUCCEEDED, SEARCH_FILES_SUCCESS, SEARCH_FILES_ATTEMPTED, RECALCULATE_IMAGE_DIMENSIONS_SUCCESS } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
import { toOrderedMap } from '../utils/FoldersAndFiles';
var defaultState = Immutable.Map({
  objects: new Immutable.List(),
  total: 0,
  query: Immutable.Map(),
  status: RequestStatus.UNINITIALIZED,
  timestamp: null,
  videoPlayerRequestStatus: RequestStatus.UNINITIALIZED,
  fetchingMore: false
});

function findIndex(state, fileId) {
  return state.get('objects').findIndex(function (item) {
    return item.get('id') === fileId;
  });
}

function replaceFile(state, file) {
  var index = findIndex(state, file.get('id'));

  if (index === -1) {
    return state;
  }

  return state.setIn(['objects', index], file);
}

function updateFile(state, fileId, updates) {
  var index = findIndex(state, fileId);

  if (index === -1) {
    return state;
  }

  var file = state.getIn(['objects', index]);
  file = file.merge(updates);
  return state.setIn(['objects', index], file);
}

function removeFile(state, fileId) {
  var index = findIndex(state, fileId);
  var objects = state.get('objects');
  return state.merge({
    objects: objects.delete(index),
    total: state.get('total') - 1
  });
}

function removeAll(state, files) {
  var nextState = state;
  files.forEach(function (file) {
    nextState = removeFile(nextState, file.get('id'));
  });
  return nextState;
}

function addAll(state, files) {
  if (files.count() === 0) {
    return state;
  }

  return state.merge({
    objects: state.get('objects').concat(files),
    total: state.get('total') + files.count()
  });
}

export default function Files() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      status = action.status,
      query = action.query,
      data = action.data,
      file = action.file,
      files = action.files,
      fileId = action.fileId,
      tempFile = action.tempFile,
      tempUrl = action.tempUrl,
      progress = action.progress,
      dimensions = action.dimensions,
      fetchingMore = action.fetchingMore;
  var timestamp = new Date().getTime();

  switch (type) {
    case FETCH_FILES_ATTEMPTED:
    case FETCH_FILES_FAILED:
      return state.merge({
        objects: new Immutable.List(),
        total: 0,
        query: query,
        status: status
      });

    case SEARCH_FILES_ATTEMPTED:
      state = state.merge({
        query: query,
        fetchingMore: fetchingMore
      });

      if (!fetchingMore) {
        state = state.merge({
          status: status,
          objects: Immutable.List()
        });
      }

      return state;

    case SEARCH_FILES_SUCCESS:
      {
        var objects = data.get('objects');

        if (fetchingMore) {
          objects = toOrderedMap(state.get('objects')).concat(toOrderedMap(objects)).toList();
        }

        return state.merge({
          objects: objects,
          total: data.get('total'),
          query: query,
          status: status,
          fetchingMore: false,
          timestamp: timestamp
        });
      }

    case FETCH_FILES_SUCCEEDED:
      return state.merge({
        objects: data.get('objects'),
        total: data.get('total_count'),
        query: query,
        status: status,
        timestamp: timestamp
      });

    case FETCH_MORE_FILES_SUCCEEDED:
      {
        var _objects = toOrderedMap(state.get('objects')).concat(toOrderedMap(data.get('objects'))).toList();

        return state.merge({
          objects: _objects,
          total: data.get('total_count'),
          fetchingMore: false
        });
      }

    case FETCH_MORE_FILES_ATTEMPTED:
      return state.set('fetchingMore', true);

    case FETCH_MORE_FILES_FAILED:
      return state.set('fetchingMore', false);

    case DOWNLOAD_FROM_DRIVE_SUCCEEDED:
    case DOWNLOAD_FROM_CANVA_SUCCEEDED:
    case DOWNLOAD_FROM_DROPBOX_SUCCEEDED:
    case UPLOAD_FILE_SUCCEEDED:
    case SAVE_EDIT_SUCCEEDED:
    case UPLOAD_EDITED_IMAGE_SUCCEEDED:
      return state.merge({
        objects: state.get('objects').unshift(file),
        total: state.get('total') + 1
      });

    case BULK_IMAGE_IMPORT_SUCCEEDED:
      {
        var _state$get;

        var results = action.payload.results;
        return state.merge({
          objects: (_state$get = state.get('objects')).unshift.apply(_state$get, _toConsumableArray(results)),
          total: state.get('total') + results.length
        });
      }

    case REPLACE_FILE_PROGRESS:
      return updateFile(state, fileId, {
        progress: progress
      });

    case REPLACE_FILE_ATTEMPTED:
      return updateFile(state, fileId, Object.assign({
        replaced: true,
        size: tempFile.size,
        tempUrl: tempUrl,
        progress: progress
      }, dimensions));

    case MOVE_FILE_SUCCEEDED:
      if (state.hasIn(['query', 'folder_id'])) {
        return removeFile(state, data.get('id'));
      }

      return replaceFile(state, data);

    case DELETE_FILE_SUCCEEDED:
      return removeFile(state, fileId);

    case REPLACE_FILE_SUCCEEDED:
    case CHANGE_FILE_ACCESSIBILITY_REQUEST_SUCCEEDED:
    case REPLACE_FILE_FAILED:
    case REMOVE_CANVA_ID_SUCCEEDED:
    case RECALCULATE_IMAGE_DIMENSIONS_SUCCESS:
      return replaceFile(state, file);

    case RENAME_FILE_ATTEMPTED:
    case RENAME_FILE_SUCCEEDED:
    case RENAME_FILE_FAILED:
      return replaceFile(state, data);

    case ARCHIVE_FILE_SUCCEEDED:
    case UNARCHIVE_FILE_SUCCEEDED:
      return removeFile(state, data.get('id'));

    case BULK_DELETE_ATTEMPTED:
    case BULK_MOVE_ATTEMPTED:
      return removeAll(state, files);

    case BULK_DELETE_FAILED:
    case BULK_MOVE_FAILED:
      return addAll(state, files);

    case CREATE_VIDYARD_PLAYERID_ATTEMPTED:
      return state.merge({
        videoPlayerRequestStatus: RequestStatus.PENDING
      });

    case CREATE_VIDYARD_PLAYERID_SUCCEEDED:
    case SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED:
      return replaceFile(state, file).merge({
        videoPlayerRequestStatus: RequestStatus.SUCCEEDED
      });

    case CREATE_VIDYARD_PLAYERID_FAILED:
    case SOFT_DELETE_VIDYARD_PLAYERID_FAILED:
      return state.merge({
        videoPlayerRequestStatus: RequestStatus.FAILED
      });

    case SELECT_FILE:
      return state.merge({
        videoPlayerRequestStatus: RequestStatus.UNINITIALIZED
      });

    case VIDEO_THUMBNAIL_UPDATE_SUCCEEDED:
    case GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED:
      return replaceFile(state, file);

    default:
      return state;
  }
}