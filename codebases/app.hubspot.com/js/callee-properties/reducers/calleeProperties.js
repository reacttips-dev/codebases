'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _calleePropertiesRedu;

import { Map as ImmutableMap, Seq } from 'immutable';
import { handleActions } from 'redux-actions';
import invariant from 'react-utils/invariant';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { CALLEE_PROPERTIES } from '../actions/asyncActionTypes';
import { updateEntries } from 'conversations-async-data/indexed-async-data/operators/updateEntries';
var initialState = new IndexedAsyncData({
  idInvariant: function idInvariant(id) {
    return invariant(typeof id === 'string', "expected id to include a contact or company type id, recieved: " + id);
  },
  idTransform: function idTransform(id) {
    return id;
  },
  notSetValue: AsyncData({
    data: ImmutableMap()
  })
});
var calleePropertiesReducer = (_calleePropertiesRedu = {}, _defineProperty(_calleePropertiesRedu, CALLEE_PROPERTIES.STARTED, function (state, _ref) {
  var requestArgs = _ref.payload.requestArgs;
  return updateEntries(Seq(requestArgs.keys), function (__id, asyncData) {
    return requestStarted(asyncData);
  }, state);
}), _defineProperty(_calleePropertiesRedu, CALLEE_PROPERTIES.SUCCEEDED, function (state, _ref2) {
  var _ref2$payload = _ref2.payload,
      requestArgs = _ref2$payload.requestArgs,
      data = _ref2$payload.data;
  return updateEntries(Seq(requestArgs.keys), function (id, asyncData) {
    return requestSucceededWithOperator(function () {
      return data && data.get(id) || null;
    }, asyncData);
  }, state);
}), _defineProperty(_calleePropertiesRedu, CALLEE_PROPERTIES.FAILED, function (state, _ref3) {
  var requestArgs = _ref3.payload.requestArgs;
  return updateEntries(Seq(requestArgs.keys), function (__id, asyncData) {
    return requestFailed(asyncData);
  }, state);
}), _calleePropertiesRedu);
export default handleActions(calleePropertiesReducer, initialState);