'use es6';

import Immutable from 'immutable';
import { CANVA_INIT_ATTEMPTED, CANVA_INIT_SUCCEEDED, CANVA_INIT_FAILED, DOWNLOAD_FROM_CANVA_ATTEMPTED, DOWNLOAD_FROM_CANVA_SUCCEEDED, DOWNLOAD_FROM_CANVA_FAILED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var defaultState = Immutable.Map({
  downloadStatus: RequestStatus.UNINITIALIZED,
  initStatus: RequestStatus.UNINITIALIZED
});
export default function Canva() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type;

  switch (type) {
    case CANVA_INIT_ATTEMPTED:
      return state.set('initStatus', RequestStatus.PENDING);

    case CANVA_INIT_SUCCEEDED:
      return state.set('initStatus', RequestStatus.SUCCEEDED);

    case CANVA_INIT_FAILED:
      return state.set('initStatus', RequestStatus.FAILED);

    case DOWNLOAD_FROM_CANVA_ATTEMPTED:
      return state.merge({
        downloadStatus: RequestStatus.PENDING
      });

    case DOWNLOAD_FROM_CANVA_SUCCEEDED:
      return state.merge({
        downloadStatus: RequestStatus.SUCCEEDED
      });

    case DOWNLOAD_FROM_CANVA_FAILED:
      return state.merge({
        downloadStatus: RequestStatus.FAILED
      });

    default:
      return state;
  }
}