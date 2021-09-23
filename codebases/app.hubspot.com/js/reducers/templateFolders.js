'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
import * as TemplateActionTypes from '../constants/TemplateActionTypes';
var initialState = ImmutableMap({
  requestStatus: RequestStatusTypes.LOADING,
  results: null
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TemplateActionTypes.FOLDERS_FETCH_SUCCESS:
      return state.merge({
        results: action.payload,
        requestStatus: RequestStatusTypes.SUCCEEDED
      });

    case TemplateActionTypes.FOLDERS_FETCH_FAILED:
      return state.merge({
        requestStatus: RequestStatusTypes.FAILED
      });

    default:
      return state;
  }
});