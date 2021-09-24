'use es6';

import * as SequenceEditorActionTypes from 'SequencesUI/constants/SequenceEditorActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SequenceEditorActionTypes.PROPERTIES_FETCH_SUCCEEDED:
      return action.payload.properties;

    default:
      return state;
  }
});