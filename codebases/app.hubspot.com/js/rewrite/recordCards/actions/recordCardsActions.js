'use es6';

import { RECORD_CARD_FETCH_FAILED, RECORD_CARD_FETCH_STARTED, RECORD_CARD_FETCH_SUCCEEDED } from './recordCardsActionTypes';
import { getRecordCard } from '../api/recordCardsAPI';
export var getRecordCardAction = function getRecordCardAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      location = _ref.location;
  return function (dispatch) {
    dispatch({
      type: RECORD_CARD_FETCH_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        location: location
      }
    });
    return getRecordCard({
      objectTypeId: objectTypeId,
      location: location
    }).then(function (data) {
      dispatch({
        type: RECORD_CARD_FETCH_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          location: location,
          data: data
        }
      });
    }).catch(function (error) {
      dispatch({
        type: RECORD_CARD_FETCH_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          location: location
        }
      });
      throw error;
    });
  };
};