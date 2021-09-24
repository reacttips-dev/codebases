'use es6';

import { Map as ImmutableMap, OrderedMap } from 'immutable';
import { ACQUIRE_IMAGE_SUCCEEDED, ARCHIVE_FILE_SUCCEEDED, BULK_DELETE_SUCCEEDED, BULK_MOVE_ATTEMPTED, BULK_MOVE_SUCCEEDED, CHANGE_FILE_ACCESSIBILITY_REQUEST_SUCCEEDED, CREATE_VIDYARD_PLAYERID_SUCCEEDED, DELETE_FILE_SUCCEEDED, DOWNLOAD_FROM_EXTERNAL_URL_ATTEMPTED, DOWNLOAD_FROM_EXTERNAL_URL_SUCCEEDED, FETCH_SINGLE_FILE_ATTEMPTED, FETCH_SINGLE_FILE_FAILED, FETCH_SINGLE_FILE_SUCCESS, GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED, MOVE_FILE_SUCCEEDED, RECALCULATE_IMAGE_DIMENSIONS_SUCCESS, REMOVE_CANVA_ID_SUCCEEDED, RENAME_FILE_ATTEMPTED, RENAME_FILE_FAILED, RENAME_FILE_SUCCEEDED, REPLACE_FILE_ATTEMPTED, REPLACE_FILE_FAILED, REPLACE_FILE_PROGRESS, REPLACE_FILE_SUCCEEDED, SAVE_EDIT_SUCCEEDED, SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED, UNARCHIVE_FILE_SUCCEEDED, UPLOAD_EDITED_IMAGE_SUCCEEDED, UPLOAD_FILE_SUCCEEDED, VIDEO_THUMBNAIL_UPDATE_SUCCEEDED, BULK_IMAGE_IMPORT_SUCCEEDED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
import { toOrderedMap } from '../utils/FoldersAndFiles';
var defaultState = ImmutableMap({
  fileDetails: ImmutableMap(),
  fetchRequestsById: ImmutableMap(),
  uploadRequestsById: OrderedMap()
});

function replaceFile(state, file) {
  if (file && file.get('id')) {
    return state.setIn(['fileDetails', file.get('id')], file);
  }

  return state;
}

function mergeFiles(state, files) {
  return state.update('fileDetails', function (fileDetails) {
    return fileDetails.merge(toOrderedMap(files));
  });
}

function deleteFileIds(state, fileIds) {
  fileIds.forEach(function (id) {
    state = state.deleteIn(['fileDetails', id]);
  });
  return state;
}

function updateFileName(state, file) {
  if (state.getIn(['fileDetails', file.get('id')])) {
    return state.setIn(['fileDetails', file.get('id'), 'name'], file.get('name'));
  }

  return state;
}

export default function FileDetails() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      fileId = action.fileId,
      file = action.file,
      progress = action.progress,
      data = action.data;
  var existingFile = state.get('fileDetails').get(fileId);
  var timestamp = new Date().getTime();

  switch (type) {
    case FETCH_SINGLE_FILE_ATTEMPTED:
      return state.mergeIn(['fetchRequestsById', fileId], {
        status: RequestStatus.PENDING
      });

    case FETCH_SINGLE_FILE_FAILED:
      return state.mergeIn(['fetchRequestsById', fileId], {
        status: RequestStatus.FAILED
      });

    case FETCH_SINGLE_FILE_SUCCESS:
      return state.setIn(['fileDetails', fileId], file).mergeIn(['fetchRequestsById', fileId], {
        status: RequestStatus.SUCCEEDED
      });

    case UPLOAD_FILE_SUCCEEDED:
      return state.setIn(['fileDetails', file.get('id')], file).mergeIn(['uploadRequestsById', file.get('id')], {
        status: RequestStatus.SUCCEEDED,
        timestamp: timestamp
      });

    case CREATE_VIDYARD_PLAYERID_SUCCEEDED:
    case SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED:
    case REPLACE_FILE_SUCCEEDED:
    case CHANGE_FILE_ACCESSIBILITY_REQUEST_SUCCEEDED:
    case REPLACE_FILE_FAILED:
    case REMOVE_CANVA_ID_SUCCEEDED:
    case UPLOAD_EDITED_IMAGE_SUCCEEDED:
    case VIDEO_THUMBNAIL_UPDATE_SUCCEEDED:
    case GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED:
    case SAVE_EDIT_SUCCEEDED:
    case RECALCULATE_IMAGE_DIMENSIONS_SUCCESS:
      return replaceFile(state, file);

    case MOVE_FILE_SUCCEEDED:
    case ARCHIVE_FILE_SUCCEEDED:
    case UNARCHIVE_FILE_SUCCEEDED:
    case RENAME_FILE_SUCCEEDED:
      return replaceFile(state, data);

    case RENAME_FILE_ATTEMPTED:
    case RENAME_FILE_FAILED:
      return updateFileName(state, data);

    case ACQUIRE_IMAGE_SUCCEEDED:
      state = replaceFile(state, data);
      return state.mergeIn(['uploadRequestsById', data.get('id')], {
        status: RequestStatus.SUCCEEDED,
        timestamp: timestamp
      });

    case REPLACE_FILE_ATTEMPTED:
      if (existingFile) {
        return replaceFile(state, existingFile.merge(Object.assign({
          replaced: true,
          size: action.tempFile.size,
          tempUrl: action.tempUrl,
          progress: progress
        }, action.dimensions)));
      }

      return state;

    case REPLACE_FILE_PROGRESS:
      if (existingFile) {
        return replaceFile(state, existingFile.merge({
          progress: progress
        }));
      }

      return state;

    case BULK_MOVE_ATTEMPTED:
      return deleteFileIds(state, action.files.map(function (f) {
        return f.get('id');
      }));

    case BULK_MOVE_SUCCEEDED:
      if (action.updatedFiles) {
        return mergeFiles(state, action.updatedFiles);
      }

      return state;

    case DELETE_FILE_SUCCEEDED:
      return deleteFileIds(state, [fileId]);

    case BULK_DELETE_SUCCEEDED:
      return deleteFileIds(state, action.files.map(function (f) {
        return f.get('id');
      }));

    case DOWNLOAD_FROM_EXTERNAL_URL_ATTEMPTED:
      return state.set('downloadFromExternalUrlStatus', RequestStatus.PENDING);

    case DOWNLOAD_FROM_EXTERNAL_URL_SUCCEEDED:
      state = replaceFile(state, file);
      state = state.mergeIn(['uploadRequestsById', file.get('id')], {
        status: RequestStatus.SUCCEEDED,
        timestamp: timestamp
      });
      return state.set('downloadFromExternalUrlStatus', RequestStatus.SUCCEEDED);

    case BULK_IMAGE_IMPORT_SUCCEEDED:
      {
        var results = action.payload.results;
        results.map(function (fileMeta) {
          state = state.mergeIn(['uploadRequestsById', fileMeta.get('id')], {
            status: RequestStatus.SUCCEEDED,
            timestamp: timestamp
          });
          return state;
        });
        return mergeFiles(state, results);
      }

    default:
      return state;
  }
}