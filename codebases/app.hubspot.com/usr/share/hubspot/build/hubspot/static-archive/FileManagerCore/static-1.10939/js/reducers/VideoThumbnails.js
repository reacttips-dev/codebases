'use es6';

import Immutable from 'immutable';
import * as ActionTypes from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var defaultState = Immutable.Map({
  updateThumbnailRequestStatus: RequestStatus.UNINITIALIZED,
  generateAndUpdateThumbnailRequestStatus: RequestStatus.UNINITIALIZED
});
export default function VideoThumbnail() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type;

  switch (type) {
    case ActionTypes.VIDEO_THUMBNAIL_UPDATE_ATTEMPTED:
      return state.set('updateThumbnailRequestStatus', RequestStatus.PENDING);

    case ActionTypes.VIDEO_THUMBNAIL_UPDATE_FAILED:
      return state.set('updateThumbnailRequestStatus', RequestStatus.FAILED);

    case ActionTypes.VIDEO_THUMBNAIL_UPDATE_SUCCEEDED:
      return state.set('updateThumbnailRequestStatus', RequestStatus.SUCCEEDED);

    case ActionTypes.GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_ATTEMPTED:
      return state.set('generateAndUpdateThumbnailRequestStatus', RequestStatus.PENDING);

    case ActionTypes.GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_FAILED:
      return state.set('generateAndUpdateThumbnailRequestStatus', RequestStatus.FAILED);

    case ActionTypes.GENERATE_AND_UPDATE_VIDEO_THUMBNAIL_SUCCEEDED:
      return state.set('generateAndUpdateThumbnailRequestStatus', RequestStatus.SUCCEEDED);

    default:
      return state;
  }
}