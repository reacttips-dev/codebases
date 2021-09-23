'use es6';

import Immutable from 'immutable';
import { VIDEO_THUMBNAIL_UPDATE_SUCCEEDED, GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED } from 'FileManagerCore/actions/ActionTypes';
import { FETCH_FILE_FOR_EDITING_ATTEMPTED, FETCH_FILE_FOR_EDITING_FAILED, FETCH_FILE_FOR_EDITING_SUCCEEDED, SAVE_FILE_EDIT_ATTEMPTED, SAVE_FILE_EDIT_SUCCEEDED, SAVE_FILE_EDIT_FAILED, CLEAR_FILE_FOR_EDITING } from '../actions/ActionTypes';
import { RequestStatus } from 'FileManagerCore/Constants';
var defaultState = Immutable.Map({
  file: null,
  fetchRequestStatus: RequestStatus.UNINITIALIZED,
  updateRequestStatus: RequestStatus.UNINITIALIZED
});
export default function EditFile() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      file = action.file;

  switch (type) {
    case FETCH_FILE_FOR_EDITING_ATTEMPTED:
      return state.set('fetchRequestStatus', RequestStatus.PENDING);

    case FETCH_FILE_FOR_EDITING_SUCCEEDED:
      return state.merge({
        file: file,
        fetchRequestStatus: RequestStatus.SUCCEEDED
      });

    case FETCH_FILE_FOR_EDITING_FAILED:
      return state.set('fetchRequestStatus', RequestStatus.FAILED);

    case SAVE_FILE_EDIT_ATTEMPTED:
      return state.set('updateRequestStatus', RequestStatus.PENDING);

    case SAVE_FILE_EDIT_SUCCEEDED:
      return state.merge({
        file: file,
        updateRequestStatus: RequestStatus.SUCCEEDED
      });

    case SAVE_FILE_EDIT_FAILED:
      return state.set('updateRequestStatus', RequestStatus.FAILED);

    case VIDEO_THUMBNAIL_UPDATE_SUCCEEDED:
    case GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED:
      return state.set('file', file);

    case CLEAR_FILE_FOR_EDITING:
      return defaultState;

    default:
      return state;
  }
}