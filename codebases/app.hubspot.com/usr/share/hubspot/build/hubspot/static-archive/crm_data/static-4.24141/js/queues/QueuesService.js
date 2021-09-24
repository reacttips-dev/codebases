'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handlers;

import { QUEUES_CACHE_UPDATED, QUEUES_FETCH_STARTED, QUEUES_FETCH_SETTLED } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { fetch } from 'crm_data/queues/QueuesAPI';
import registerService from 'crm_data/flux/registerService';
import { Map as ImmutableMap } from 'immutable';
var pending = false;
var handlers = (_handlers = {}, _defineProperty(_handlers, QUEUES_FETCH_STARTED, function (state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ownerId = options.ownerId;

  if (pending) {
    return state;
  }

  pending = true;
  fetch(ownerId).then(function (results) {
    dispatchImmediate(QUEUES_CACHE_UPDATED, results);
    dispatchQueue(QUEUES_FETCH_SETTLED);
  }, function () {
    dispatchImmediate(QUEUES_FETCH_SETTLED);
  });
  return state;
}), _defineProperty(_handlers, QUEUES_FETCH_SETTLED, function (state) {
  pending = false;
  return state;
}), _handlers);
registerService(ImmutableMap(), handlers);