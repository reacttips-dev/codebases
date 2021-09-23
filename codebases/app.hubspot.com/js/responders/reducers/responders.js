'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { getSendFrom } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import { getResponder } from '../../threads/operators/threadGetters';
import { handleActions } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { FETCH_AGENT_RESPONDER } from '../constants/asyncActionTypes';
import { buildResponderKeyFromRequest, buildResponderKeyFromResponder } from '../operators/buildResponderKey';
import { responderKeyInvariant } from '../operators/responderKeyInvariant';
var initialState = IndexedAsyncData({
  name: 'responders',
  idInvariant: responderKeyInvariant,
  idTransform: function idTransform(id) {
    return id;
  },
  notSetValue: AsyncData({
    data: Responder()
  })
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionTypes.GET_WIDGET_DATA_SUCCEEDED, function (responders, action) {
  var payload = action.payload;
  var allResponders = getSendFrom(payload);
  return allResponders.reduce(function (respondersMap, newResponder) {
    var id = buildResponderKeyFromResponder(newResponder);
    return updateEntry(id, requestSucceededWithOperator(function () {
      return newResponder;
    }), respondersMap);
  }, responders);
}), _defineProperty(_handleActions, ActionTypes.GET_VISITOR_THREADS_SUCCESS, function (responders, action) {
  var threads = action.payload.threads;
  var threadResponders = [];
  threads.forEach(function (thread) {
    var responder = getResponder(thread);

    if (responder) {
      threadResponders.push(responder);
    }
  });
  return threadResponders.reduce(function (respondersMap, newResponder) {
    var id = buildResponderKeyFromResponder(newResponder);
    return updateEntry(id, requestSucceededWithOperator(function () {
      return newResponder;
    }), respondersMap);
  }, responders);
}), _defineProperty(_handleActions, FETCH_AGENT_RESPONDER.STARTED, function (responders, _ref) {
  var payload = _ref.payload;
  var id = buildResponderKeyFromRequest(payload.requestArgs);
  return updateEntry(id, requestStarted, responders);
}), _defineProperty(_handleActions, FETCH_AGENT_RESPONDER.FAILED, function (responders, _ref2) {
  var payload = _ref2.payload;
  var id = buildResponderKeyFromRequest(payload.requestArgs);
  return updateEntry(id, requestFailed, responders);
}), _defineProperty(_handleActions, FETCH_AGENT_RESPONDER.SUCCEEDED, function (responders, _ref3) {
  var payload = _ref3.payload;
  var id = buildResponderKeyFromRequest(payload.requestArgs);
  return updateEntry(id, requestSucceededWithOperator(function () {
    return payload.data;
  }), responders);
}), _handleActions), initialState);