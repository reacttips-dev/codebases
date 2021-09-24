'use es6';

import { fromJS } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var initialState = fromJS({
  properties: null,
  flattenedProperties: null,
  error: null
});
export default function properties() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case ActionTypes.FETCH_PROPERTIES_STARTED:
      return initialState;

    case ActionTypes.FETCH_PROPERTIES_SUCCESS:
      return state.set('properties', action.payload.properties).set('flattenedProperties', action.payload.flattenedProperties).set('error', false);

    case ActionTypes.FETCH_PROPERTIES_ERROR:
      return state.set('error', true);

    default:
      return state;
  }
}