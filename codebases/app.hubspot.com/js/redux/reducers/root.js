'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import { INITIAL_REQUESTS } from '../../lib/constants';
import actionTypes from '../actions/actionTypes';
import entities from './entities';
import postsReducer from '../../posts/reducer';
import analyzeReducer from '../../analyze/reducer';
import requests from './requests';
import accounts, { DEFAULT_ACCOUNTS_STATE } from './accounts';
import notificationsReducer from 'ReduxMessenger/reducers/Notifications';
import { clone } from 'underscore';
import { handleActions } from 'flux-actions';
import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import { treatments } from './treatments';
import { userAttributes } from './userAttributes';
var routeReducer = handleActions(_defineProperty({}, actionTypes.SET_ROUTE, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var route = clone(action.payload.routes[action.payload.routes.length - 1]);
  route.params = action.payload.params;
  return {
    current: route,
    previous: state.current
  };
}));

var requestReducer = function requestReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap(INITIAL_REQUESTS);
  var action = arguments.length > 1 ? arguments[1] : undefined;

  if (action.type === actionTypes.REQUEST_UPDATE) {
    state = state.set(action.payload.requestName, action.payload.status);
  }

  return requests(state, action);
};

var initialQuery = function initialQuery(state, action) {
  if (!state && action.type === LOCATION_CHANGE && action.payload.query) {
    return action.payload.query;
  }

  return state;
}; // this is purely for a nicer alphabetical display in redux tools


var sortStateKeys = function sortStateKeys(state) {
  var keysSorted = Object.keys(state).sort(function (a, b) {
    return a.localeCompare(b);
  });
  var newState = keysSorted.reduce(function (acc, key) {
    acc[key] = state[key];
    return acc;
  }, {});
  return newState;
};

export var mergeWithEntitiesAndAccounts = function mergeWithEntitiesAndAccounts(state, action) {
  var entitiesReducers = entities(state, action); // A workaround. Seems like "merge" function converts nested collections
  // into immutable objects which is what our application expects
  // so had to use the "merge" function to preserve the type of the nested fields.

  state = new ImmutableMap(state).merge(entitiesReducers);
  state = state.toObject(); // accounts keeps track of both accounts and channels

  state = accounts(state, action);
  return sortStateKeys(state);
};
export default (function (state, action) {
  state = Object.assign({}, DEFAULT_ACCOUNTS_STATE, {}, state, {
    auth: state.auth,
    portal: state.portal,
    user: state.user,
    gates: state.gates,
    treatments: treatments(state.treatments, action),
    analyze: analyzeReducer(state.analyze, action),
    posts: postsReducer(state.posts, action),
    requests: requestReducer(state.requests, action),
    route: routeReducer(state.route, action) || {},
    routing: routerReducer(state.routing, action),
    initialQuery: initialQuery(state.initialQuery, action),
    notifications: notificationsReducer(state.notifications, action),
    userAttributes: userAttributes(state.userAttributes, action)
  });
  return mergeWithEntitiesAndAccounts(state, action);
});