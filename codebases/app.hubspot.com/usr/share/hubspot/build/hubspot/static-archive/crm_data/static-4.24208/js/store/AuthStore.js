'use es6';

import { defineFactory } from 'general-store';
import invariant from 'react-utils/invariant';
import identity from 'transmute/identity';
import * as ActionTypes from 'crm_data/actions/ActionTypes';
import always from 'transmute/always';
import devLogger from 'react-utils/devLogger';
import Raven from 'Raven';
import enviro from 'enviro';
export var defineAuthStore = function defineAuthStore(_ref) {
  var _ref$getter = _ref.getter,
      getter = _ref$getter === void 0 ? identity : _ref$getter,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? [] : _ref$initialState,
      name = _ref.name,
      onAuthLoad = _ref.onAuthLoad;
  invariant(typeof name === 'string' && name !== '', 'Name for auth store must be provided');
  invariant(typeof onAuthLoad === 'function', 'onAuthLoad must be provided and be a function');
  var getInitialState = always({
    isAuthLoaded: false,
    authData: initialState
  });
  return defineFactory().defineName("Auth-" + name).defineGetInitialState(getInitialState).defineGet(function (state) {
    var isAuthLoaded = state.isAuthLoaded,
        authData = state.authData;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!isAuthLoaded) {
      if (enviro.isProd()) {
        Raven.captureMessage('Attempted to access an Auth store without dispatching an AUTH_LOADED action', {
          extra: {
            args: args,
            name: name
          },
          level: 'info'
        });
      }

      devLogger.warn({
        message: 'Attempted to access an Auth store without dispatching an AUTH_LOADED action'
      });
    }

    return getter.apply(void 0, [authData].concat(args));
  }).defineResponseTo(ActionTypes.AUTH_LOADED, function (_, auth) {
    return {
      isAuthLoaded: true,
      authData: onAuthLoad(auth)
    };
  });
};