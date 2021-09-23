'use es6';

import apiClient from 'hub-http/clients/apiClient';
import { TASK_FETCH_STARTED, TASK_FETCH_SUCCEEDED, TASK_FETCH_FAILED } from '../actionTypes';
export var fetchTask = function fetchTask(taskId) {
  return function (dispatch) {
    dispatch({
      type: TASK_FETCH_STARTED,
      payload: {
        taskId: taskId
      }
    });
    apiClient.get("/engagements/v1/engagements/" + taskId).then(function (task) {
      return dispatch({
        type: TASK_FETCH_SUCCEEDED,
        payload: {
          task: task,
          taskId: taskId
        }
      });
    }).catch(function (err) {
      dispatch({
        type: TASK_FETCH_FAILED,
        payload: {
          taskId: taskId
        }
      });
      throw err;
    });
  };
};