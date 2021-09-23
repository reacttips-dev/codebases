'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Immutable$Map;

import Immutable from 'immutable';
import * as ActionTypes from '../actions/ActionTypes';
import { Limits, RequestStatus, FileTypes } from '../Constants';
import { countUploadingFilesByType, updateAttemptedVideoUploads, getDecreasedQuantityUsed, getIncreasedQuantityUsed } from '../utils/Limits';
import { isHubLVideo } from '../utils/hubLVideo';
var LimitsDefaultState = Immutable.Map((_Immutable$Map = {}, _defineProperty(_Immutable$Map, Limits.EMBEDDABLE_VIDEO, Immutable.Map({
  quantityAllowed: 50,
  quantityUsed: 0,
  attemptedVideoUploads: 0
})), _defineProperty(_Immutable$Map, "requestStatus", RequestStatus.UNINITIALIZED), _Immutable$Map));
export default function limitsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LimitsDefaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      limits = action.limits,
      uploadingFiles = action.uploadingFiles,
      videoCount = action.videoCount,
      file = action.file;

  switch (type) {
    case ActionTypes.FETCH_LIMITS_SUCCEEDED:
      return state.merge(_defineProperty({
        requestStatus: RequestStatus.SUCCEEDED
      }, Limits.EMBEDDABLE_VIDEO, Immutable.Map({
        quantityAllowed: limits.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityAllowed']),
        quantityUsed: limits.getIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed']),
        attemptedVideoUploads: 0
      })));

    case ActionTypes.BULK_UPLOAD_FILES_ATTEMPTED:
      return state.merge(_defineProperty({}, Limits.EMBEDDABLE_VIDEO, updateAttemptedVideoUploads(state, countUploadingFilesByType(uploadingFiles, FileTypes.MOVIE))));

    case ActionTypes.CONFIRM_VIDEO_UPLOAD_WITHOUT_EMBED:
      return state.merge(_defineProperty({}, Limits.EMBEDDABLE_VIDEO, updateAttemptedVideoUploads(state, 0)));

    case ActionTypes.DECREASE_VIDEO_QUANTITY_USED:
      return state.setIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed'], getDecreasedQuantityUsed(state, videoCount));

    case ActionTypes.CREATE_VIDYARD_PLAYERID_SUCCEEDED:
      return state.setIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed'], getIncreasedQuantityUsed(state, 1));

    case ActionTypes.UPLOAD_FILE_SUCCEEDED:
      if (isHubLVideo(file.toJS())) {
        return state.setIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed'], getIncreasedQuantityUsed(state, 1));
      }

      return state;

    case ActionTypes.SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED:
      return state.setIn([Limits.EMBEDDABLE_VIDEO, 'quantityUsed'], getDecreasedQuantityUsed(state, 1));

    default:
      return state;
  }
}