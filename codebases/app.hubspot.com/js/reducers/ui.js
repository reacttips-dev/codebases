'use es6';

import { Map as ImmutableMap } from 'immutable';
import { LOADING } from 'SalesContentIndexUI/data/constants/TableContentState';
import { SET_TABLE_CONTENT_STATE } from 'SequencesUI/constants/UIActionTypes';
var initialState = ImmutableMap({
  tableContentState: LOADING
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SET_TABLE_CONTENT_STATE:
      return state.set('tableContentState', action.payload);

    default:
      return state;
  }
});