'use es6';

import partial from '../utils/partial';
import { dispatchImmediate, dispatchQueue } from '../dispatch/Dispatch';
import { defineFactory } from 'general-store';
import ObjectTypesStoreState from './ObjectTypesStoreState';

function needsFetching(_ref, _ref2) {
  var fetching = _ref.fetching,
      data = _ref.data,
      error = _ref.error;
  var cache = _ref2.cache,
      objectType = _ref2.objectType;
  return !cache || data.get(objectType) === undefined && !fetching.has(objectType) && !error.get(objectType);
}

function get(_ref3, state, objectType) {
  var STARTED = _ref3.STARTED;
  var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var data = state.data;

  if (!objectType) {
    return data;
  }

  if (needsFetching(state, {
    cache: cache,
    objectType: objectType
  })) {
    dispatchQueue(STARTED, {
      cache: cache,
      objectType: objectType
    }).done();
  }

  return data.get(objectType);
}

function getInitialState() {
  return ObjectTypesStoreState();
}

function handleStarted(_ref4, state, payload) {
  var fetch = _ref4.fetch,
      SUCCEEDED = _ref4.SUCCEEDED,
      FAILED = _ref4.FAILED;

  if (!needsFetching(state, payload)) {
    return state;
  }

  var objectType = payload.objectType;
  fetch(payload).then(function (data) {
    return dispatchImmediate(SUCCEEDED, {
      objectType: objectType,
      data: data
    });
  }, function () {
    return dispatchImmediate(FAILED, {
      objectType: objectType
    });
  }).done();
  return state.updateIn(['fetching'], function (f) {
    return f.add(objectType);
  });
}

function handleSucceeded(_ref5, state, _ref6) {
  var fetchParse = _ref5.fetchParse;
  var objectType = _ref6.objectType,
      data = _ref6.data;
  return state.updateIn(['fetching'], function (f) {
    return f.remove(objectType);
  }).deleteIn(['error', objectType]).setIn(['data', objectType], fetchParse(data, objectType));
}

function handleFailed(state, _ref7) {
  var objectType = _ref7.objectType;
  return state.updateIn(['fetching'], function (f) {
    return f.remove(objectType);
  }).setIn(['error', objectType], true);
}

function handleUpdated(_ref8, state, _ref9) {
  var fetchParse = _ref8.fetchParse;
  var objectType = _ref9.objectType,
      data = _ref9.data;
  return state.setIn(['data', objectType], fetchParse(data, objectType));
}

export default function defineObjectTypeStore(_ref10) {
  var actionTypePrefix = _ref10.actionTypePrefix,
      fetch = _ref10.fetch,
      _ref10$fetchParse = _ref10.fetchParse,
      fetchParse = _ref10$fetchParse === void 0 ? function (arg) {
    return arg;
  } : _ref10$fetchParse;
  var context = {
    fetch: fetch,
    fetchParse: fetchParse,
    STARTED: actionTypePrefix + "_FETCH_STARTED",
    SUCCEEDED: actionTypePrefix + "_FETCH_SUCCEEDED",
    FAILED: actionTypePrefix + "_FETCH_FAILED",
    UPDATED: actionTypePrefix + "_UPDATE_SUCCEEDED"
  };
  return defineFactory().defineGet(partial(get, context)).defineName(actionTypePrefix + "_defineObjectTypeStore").defineGetInitialState(getInitialState).defineResponseTo(context.STARTED, partial(handleStarted, context)).defineResponseTo(context.SUCCEEDED, partial(handleSucceeded, context)).defineResponseTo(context.FAILED, handleFailed).defineResponseTo(context.UPDATED, partial(handleUpdated, context));
}