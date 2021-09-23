'use es6';

import Immutable from 'immutable';
import { BACK, CLEAR_HISTORY } from '../actions/ActionTypes';
export default function withHistory(reducer) {
  var ignoredActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var initialState = Immutable.Map({
    past: new Immutable.List(),
    present: reducer(undefined, {})
  });
  return function History() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var type = action.type;
    var present = state.get('present');
    var past = state.get('past');

    switch (type) {
      case BACK:
        {
          var nextPresent = past.last();
          return state.merge({
            past: past.pop(),
            present: nextPresent
          });
        }

      case CLEAR_HISTORY:
        return initialState;

      default:
        {
          var _nextPresent = reducer(present, action);

          if (_nextPresent === present) {
            return state;
          }

          if (ignoredActions.includes(type)) {
            return state.set('present', _nextPresent);
          }

          return state.merge({
            past: past.push(present),
            present: _nextPresent
          });
        }
    }
  };
}