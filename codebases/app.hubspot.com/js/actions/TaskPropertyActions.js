'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import * as SequenceEditorActionTypes from 'SequencesUI/constants/SequenceEditorActionTypes';
import { fetchProperties } from 'SequencesUI/api/TaskPropertiesApi';
var fetchTaskPropertiesStarted = createAction(SequenceEditorActionTypes.TASK_PROPERTIES_FETCH_STARTED, identity);
var fetchTaskPropertiesSucceeded = createAction(SequenceEditorActionTypes.TASK_PROPERTIES_FETCH_SUCCEEDED, identity);
var fetchTaskPropertiesFailed = createAction(SequenceEditorActionTypes.TASK_PROPERTIES_FETCH_FAILED, identity);
var _currentlyFetchingTaskProperties = false;
export var fetchTaskProperties = function fetchTaskProperties() {
  return function (dispatch) {
    if (!_currentlyFetchingTaskProperties) {
      _currentlyFetchingTaskProperties = true;
      dispatch(fetchTaskPropertiesStarted());
      fetchProperties().then(function (properties) {
        return dispatch(fetchTaskPropertiesSucceeded(properties));
      }, function () {
        return dispatch(fetchTaskPropertiesFailed());
      }).finally(function () {
        _currentlyFetchingTaskProperties = false;
      });
    }
  };
};