'use es6';

import { Set as ImmutableSet, List } from 'immutable';
import './QueuesService';
import { QUEUES_FETCH_STARTED, QUEUES_CACHE_UPDATED, QUEUES_SET_QUEUE, QUEUES_QUEUE_DELETED, QUEUES_MERGE_QUEUES, ADD_ENGAGEMENTS_TO_QUEUES, ADD_USERS_TO_QUEUE, REMOVE_USERS_FROM_QUEUE } from 'crm_data/actions/ActionTypes';
import { dispatchQueue } from 'crm_data/dispatch/Dispatch';
import dispatcher from 'dispatcher/dispatcher';
import { defineFactory } from 'general-store';
export default defineFactory().defineName('QueuesStore').defineGetInitialState(function () {
  return null;
}).defineGet(function (state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var forceFetch = options.forceFetch,
      ownerId = options.ownerId;

  if (!state || forceFetch) {
    dispatchQueue(QUEUES_FETCH_STARTED, {
      ownerId: ownerId
    }).done();
  }

  return state;
}).defineResponseTo(QUEUES_CACHE_UPDATED, function (state, results) {
  return results;
}).defineResponseTo(QUEUES_SET_QUEUE, function (state, results) {
  var key = results.key,
      value = results.value;
  return state.set(key, value);
}).defineResponseTo(ADD_ENGAGEMENTS_TO_QUEUES, function (state, result) {
  var queueId = result.queueId,
      engagementIds = result.engagementIds;
  return state.updateIn([queueId, 'engagementIds'], function (queueEngagementIds) {
    return queueEngagementIds.concat(engagementIds);
  });
}).defineResponseTo(QUEUES_MERGE_QUEUES, function (state, results) {
  return state.merge(results);
}).defineResponseTo(QUEUES_QUEUE_DELETED, function (state, queueId) {
  return state.remove(queueId);
}).defineResponseTo(ADD_USERS_TO_QUEUE, function (state, result) {
  var queueId = result.queueId,
      userIds = result.userIds;
  return state.updateIn([queueId, 'userParticipants'], function (userParticipants) {
    return userParticipants ? ImmutableSet(userParticipants).union(ImmutableSet(userIds)).toList() : userIds;
  });
}).defineResponseTo(REMOVE_USERS_FROM_QUEUE, function (state, result) {
  var queueId = result.queueId,
      userIds = result.userIds;
  return state.updateIn([queueId, 'userParticipants'], function (userParticipants) {
    return userParticipants ? ImmutableSet(userParticipants).subtract(ImmutableSet(userIds)).toList() : List();
  });
}).register(dispatcher);