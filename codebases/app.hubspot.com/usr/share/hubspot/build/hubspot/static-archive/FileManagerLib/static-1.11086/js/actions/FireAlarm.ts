import http from 'hub-http/clients/apiClient';
import { FETCH_FIREALARM_EMPTY, FETCH_FIREALARM_FAILED, FETCH_FIREALARM_SUCCESS } from './ActionTypes';
import FireAlarm from '../records/FireAlarm';
var APP_NAME = 'file-picker';
export var fetchFireAlarm = function fetchFireAlarm() {
  return function (dispatch) {
    http.get("firealarm/v2/alarm/" + APP_NAME).then(function (resp) {
      if (resp && resp.length) {
        dispatch({
          type: FETCH_FIREALARM_SUCCESS,
          data: new FireAlarm(resp[0])
        });
      } else {
        dispatch({
          type: FETCH_FIREALARM_EMPTY
        });
      }
    }).catch(function (err) {
      console.error(err);
      dispatch({
        type: FETCH_FIREALARM_FAILED
      });
    });
  };
};