'use es6';

import { defineFactory } from 'general-store';
import { dispatchSafe } from '../dispatch/Dispatch';
export var PAUSE_BOARD_REFRESH = 'PAUSE_BOARD_REFRESH';
export var RESUME_BOARD_REFRESH = 'RESUME_BOARD_REFRESH';
var BoardRefreshStoreFactory = defineFactory().defineName('BoardRefreshStore').defineGetInitialState(function () {
  return false;
}).defineResponseTo(PAUSE_BOARD_REFRESH, function () {
  return true;
}).defineResponseTo(RESUME_BOARD_REFRESH, function () {
  return false;
});
var BoardRefreshStore = BoardRefreshStoreFactory.register();
export var BoardRefreshActions = {
  pause: function pause() {
    return dispatchSafe(PAUSE_BOARD_REFRESH);
  },
  resume: function resume() {
    return dispatchSafe(RESUME_BOARD_REFRESH);
  }
};
export var isBoardRefreshPausedDep = BoardRefreshStore;
export default BoardRefreshStore;