'use es6';

import { Map as ImmutableMap } from 'immutable';
import { TASK_PROPERTIES_FETCH_STARTED, TASK_PROPERTIES_FETCH_SUCCEEDED, TASK_PROPERTIES_FETCH_FAILED } from 'SequencesUI/constants/SequenceEditorActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TASK_PROPERTIES_FETCH_STARTED:
      return null;

    case TASK_PROPERTIES_FETCH_SUCCEEDED:
      return action.payload;

    case TASK_PROPERTIES_FETCH_FAILED:
      return ImmutableMap();

    default:
      return state;
  }
});