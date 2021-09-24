'use es6';

import { fromJS } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var initialState = fromJS({
  usage: null
});
export default function templateUsage() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (action.type === ActionTypes.FETCH_USAGE_SUCCESS) {
    return state.set('usage', fromJS({
      count: action.payload.get('currentUsage'),
      limit: action.payload.get('limit'),
      userLimit: action.payload.get('userLimit')
    }));
  }

  return state;
}