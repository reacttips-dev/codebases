'use es6';

import { createAction } from 'flux-actions';
import { identity } from 'underscore';
import actionTypes from './actionTypes';
import ScheduleManager from '../../data/ScheduleManager';
import Schedule from '../../data/model/Schedule';
var scheduleManager = ScheduleManager.getInstance();
export var fetchSchedule = function fetchSchedule() {
  return function (dispatch) {
    dispatch({
      type: actionTypes.SCHEDULE_FETCH,
      apiRequest: function apiRequest() {
        return scheduleManager.fetchSchedule().then(function (data) {
          return Schedule.createFrom(data);
        });
      }
    });
  };
};
export var saveSchedule = function saveSchedule() {
  return function (dispatch, getState) {
    var schedule = getState().schedule;
    dispatch({
      type: actionTypes.SCHEDULE_SAVE,
      apiRequest: function apiRequest() {
        return scheduleManager.saveSchedule(schedule.serialize()).then(function (data) {
          return Schedule.createFrom(data);
        });
      }
    });
  };
};
export var updateSchedule = createAction(actionTypes.SCHEDULE_UPDATE, identity);
export var removeScheduledTimes = createAction(actionTypes.SCHEDULE_REMOVE_TIMES, identity);
export var addScheduledTimes = createAction(actionTypes.SCHEDULE_ADD_TIMES, identity);