'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import getIn from 'transmute/getIn';
import map from 'transmute/map';
import Status from '../../common-message-format/records/Status';
import { MESSAGE_DELETED_STATUS, STATUS } from '../constants/updateTypes';
export var buildUpdates = function buildUpdates() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var updates = fromJS(getIn(['updates'], properties));
  var updateMap = ImmutableMap();

  if (updates && updates.size) {
    map(function (update, id) {
      update.keySeq().forEach(function (updateType) {
        switch (updateType) {
          case STATUS:
            updateMap = updateMap.setIn([id, STATUS], Status(getIn([STATUS], update)));
            break;

          case MESSAGE_DELETED_STATUS:
            updateMap = updateMap.setIn([id, MESSAGE_DELETED_STATUS], getIn([MESSAGE_DELETED_STATUS], update));
            break;

          default:
            break;
        }
      });
    }, updates);
  }

  return updateMap;
};