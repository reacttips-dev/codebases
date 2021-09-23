'use es6';

import { Map as ImmutableMap } from 'immutable';
import { SEQUENCE_FETCH_SUCCEEDED, SEQUENCE_FETCH_FAILED, SEQUENCE_UPDATE_NAME } from '../constants/SequenceActionTypes';
import * as SequenceEditorActionTypes from '../constants/SequenceEditorActionTypes';
var initialState = {
  sequencesById: ImmutableMap()
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        sequencesById: state.sequencesById.set(action.payload.sequenceId, action.payload.sequence)
      });

    case SEQUENCE_FETCH_FAILED:
      return Object.assign({}, state, {
        sequencesById: state.sequencesById.set(action.payload.sequenceId, null)
      });

    case SEQUENCE_UPDATE_NAME:
      return Object.assign({}, state, {
        sequencesById: state.sequencesById.setIn([action.payload.sequenceId, 'name'], action.payload.name)
      });

    case SequenceEditorActionTypes.SAVE_SUCCESS:
      {
        var sequenceId = action.payload.get('id');
        return Object.assign({}, state, {
          sequencesById: state.sequencesById.set(sequenceId, action.payload)
        });
      }

    default:
      return state;
  }
});