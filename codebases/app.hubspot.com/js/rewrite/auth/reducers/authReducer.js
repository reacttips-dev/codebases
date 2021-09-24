'use es6';

import { fromJS, Set as ImmutableSet } from 'immutable';
import { APP_INIT } from '../../init/actions/initActionTypes';
var initialState = fromJS({});
export var authReducer = function authReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case APP_INIT:
      {
        var auth = action.payload.auth;
        return fromJS(Object.assign({}, auth, {
          gates: auth.gates.reduce(function (gatesSet, gate) {
            return gatesSet.add(gate);
          }, ImmutableSet()),
          scopes: auth.user.scopes.reduce(function (scopesSet, scope) {
            return scopesSet.add(scope);
          }, ImmutableSet())
        }));
      }

    default:
      {
        return state;
      }
  }
};