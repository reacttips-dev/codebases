'use es6';

import { INITIALIZE_AUTH } from '../actions/ActionTypes';
import { fromJS, Map as ImmutableMap } from 'immutable';

var auth = function auth() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case INITIALIZE_AUTH:
      return fromJS({
        user: action.user,
        gates: action.gates,
        portal: action.portal
      });

    default:
      return state;
  }
};

export default auth;