'use es6';

import { Set as ImmutableSet } from 'immutable';
import { selectionActions } from '../actions/selectionActions';

var _defaultInitialState = new ImmutableSet();

export default function selectionReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaultInitialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case selectionActions.SELECTION_ADD:
      return state.union(action.ids);

    case selectionActions.SELECTION_REMOVE:
      return state.subtract(action.ids);

    case selectionActions.SELECTION_CLEAR:
      return state.clear();

    default:
      return state;
  }
}