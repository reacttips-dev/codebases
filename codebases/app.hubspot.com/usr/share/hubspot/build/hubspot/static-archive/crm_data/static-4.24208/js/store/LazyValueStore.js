'use es6';

import { FETCH } from '../actions/ActionVerbs';
import { dispatchImmediate, dispatchQueue } from '../dispatch/Dispatch';
import { defineFactory } from 'general-store';
import identity from 'transmute/identity';
import { Record } from 'immutable';
import { makeAsyncActionTypes } from '../actions/MakeActions';
import { EMPTY, LOADING } from '../constants/LoadingStatus';
export var LazyValueState = Record({
  promise: null,
  value: LOADING
}, 'LazyValueState');
export function defineLazyValueStore(_ref) {
  var fetch = _ref.fetch,
      namespace = _ref.namespace,
      _ref$responseTransfor = _ref.responseTransform,
      responseTransform = _ref$responseTransfor === void 0 ? identity : _ref$responseTransfor,
      _ref$getterTransform = _ref.getterTransform,
      getterTransform = _ref$getterTransform === void 0 ? function (_ref2) {
    var value = _ref2.value;
    return value;
  } : _ref$getterTransform;

  var _makeAsyncActionTypes = makeAsyncActionTypes(namespace, FETCH),
      QUEUED = _makeAsyncActionTypes.QUEUED,
      STARTED = _makeAsyncActionTypes.STARTED,
      FAILED = _makeAsyncActionTypes.FAILED,
      SUCCEEDED = _makeAsyncActionTypes.SUCCEEDED;

  return defineFactory().defineName(namespace + "_LazyValueStore").defineGetInitialState(LazyValueState).defineGet(function (state, options) {
    if (options && options.forceRefresh) {
      dispatchQueue(QUEUED, options);
    } else if (!state.promise) {
      dispatchQueue(QUEUED);
    }

    return getterTransform({
      value: state.value,
      options: options
    });
  }).defineResponseTo(QUEUED, function (state) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (state.promise && !options.forceRefresh) {
      return state;
    }

    var promise = fetch();
    dispatchQueue(STARTED);
    promise.then(function (value) {
      return dispatchImmediate(SUCCEEDED, value);
    }, function () {
      return dispatchImmediate(FAILED);
    }).done();
    return state.set('promise', promise);
  }).defineResponseTo(SUCCEEDED, function (state, value) {
    return state.set('value', responseTransform(value));
  }).defineResponseTo(FAILED, function (state) {
    return state.set('value', EMPTY);
  });
}