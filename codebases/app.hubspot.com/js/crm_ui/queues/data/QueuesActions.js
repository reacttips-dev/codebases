'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import get from 'transmute/get';
import { QUEUES_CACHE_UPDATED, QUEUES_SET_QUEUE, QUEUES_QUEUE_DELETED, QUEUES_MERGE_QUEUES, ADD_ENGAGEMENTS_TO_QUEUES, ADD_USERS_TO_QUEUE, REMOVE_USERS_FROM_QUEUE } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
import { Iterable, Map as ImmutableMap, OrderedMap } from 'immutable';
import invariant from 'react-utils/invariant';
import * as QueuesAPI from 'crm_data/queues/QueuesAPI';
import QueueRecord from 'crm_schema/queues/QueueRecord';
import { transact } from 'crm_data/flux/transact';
import { QUEUE_ACCESS_TYPE_SHARED, QUEUE_ACCESS_TYPE_PRIVATE } from 'crm_schema/constants/QueueConstants';
import Raven from 'Raven';

var logSentryIfNotQueueRecord = function logSentryIfNotQueueRecord(queue) {
  var optionsAndExtra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isQueueRecord = queue instanceof QueueRecord;

  if (!isQueueRecord) {
    var _optionsAndExtra$leve = optionsAndExtra.level,
        level = _optionsAndExtra$leve === void 0 ? 'error' : _optionsAndExtra$leve,
        extraData = _objectWithoutProperties(optionsAndExtra, ["level"]);

    Raven.captureMessage('TASKS_QUEUE_ERROR_QUEUE_IS_NOT_RECORD', {
      level: level,
      extra: Object.assign({}, extraData, {
        queue: queue
      })
    });
  }
};

var ADD = 'ADD';
var REMOVE = 'REMOVE';
export function addQueueToStore(queue) {
  dispatchImmediate(QUEUES_SET_QUEUE, {
    key: get('id', queue),
    value: QueueRecord(queue)
  });
}
export function create(name, accessType) {
  invariant(typeof name === 'string', 'expected `name` to be a string but got `%s`', name);
  invariant(accessType === QUEUE_ACCESS_TYPE_SHARED || accessType === QUEUE_ACCESS_TYPE_PRIVATE, "expected `accessType` to be either " + QUEUE_ACCESS_TYPE_PRIVATE + " or " + QUEUE_ACCESS_TYPE_SHARED + " but got `%s`", accessType);
  return QueuesAPI.create({
    name: name,
    accessType: accessType
  }).then(function (queue) {
    dispatchImmediate(QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: queue
    });
    return queue;
  });
}
export function updateDefinition(queue, _ref) {
  var name = _ref.name,
      accessType = _ref.accessType,
      userParticipants = _ref.userParticipants;
  logSentryIfNotQueueRecord(queue, {
    name: name,
    accessType: accessType,
    userParticipants: userParticipants
  });
  invariant(queue instanceof QueueRecord, 'updateDefinition expected `queue` to be a QueueRecord but got `%s`', queue);
  invariant(typeof name === 'string', 'updateDefinition expected name to be a string but got `%s`', name);
  invariant(Array.isArray(userParticipants) || Iterable.isIterable(userParticipants) || !userParticipants, 'updateDefinition expected `userIds` to be an Array or Iterable, but got `%s`', userParticipants);
  invariant(accessType === QUEUE_ACCESS_TYPE_SHARED || accessType === QUEUE_ACCESS_TYPE_PRIVATE, "updateDefinition expected `accessType` to be either " + QUEUE_ACCESS_TYPE_PRIVATE + " or " + QUEUE_ACCESS_TYPE_SHARED + " but got `%s`", accessType);
  return transact({
    operation: function operation() {
      return QueuesAPI.updateDefinition(queue.get('id'), {
        name: name,
        accessType: accessType // TODO: uncomment once the update definition endpoint supports editing participants
        // userParticipants

      });
    },
    commit: [QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: queue.setIn(['name'], name).setIn(['accessType'], accessType) // TODO: uncomment once the update definition endpoint supports editing participants
      // .setIn(['userParticipants'], userParticipants),

    }],
    rollback: [QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: queue
    }]
  });
}
export function getIdUnion(_ref2) {
  var queue = _ref2.queue,
      selected = _ref2.selected;

  if (!selected) {
    return queue.get('engagementIds');
  }

  return queue.get('engagementIds').toOrderedSet().union(selected).toList();
}
export function getIdDifference(queue, selected) {
  if (!selected) {
    return queue.get('engagementIds');
  }

  return queue.get('engagementIds').toOrderedSet().subtract(selected).toList();
}
export function getUpdatedQueue(queue, engagementIds, type) {
  var updatedEngagementIds = engagementIds;

  if (type === ADD) {
    updatedEngagementIds = getIdUnion({
      queue: queue,
      selected: engagementIds
    });
  } else if (type === REMOVE) {
    updatedEngagementIds = getIdDifference(queue, engagementIds);
  }

  return queue.set('engagementIds', updatedEngagementIds);
}
export function dispatchQueueSwap(_ref3) {
  var prevQueue = _ref3.prevQueue,
      nextQueue = _ref3.nextQueue,
      engagementIds = _ref3.engagementIds;
  var nextQueueId = parseInt(nextQueue.get('id'), 10);
  var prevQueueId = parseInt(prevQueue.get('id'), 10);
  dispatchImmediate(QUEUES_MERGE_QUEUES, ImmutableMap().merge(ImmutableMap([[nextQueueId, getUpdatedQueue(nextQueue, engagementIds, ADD)], [prevQueueId, getUpdatedQueue(prevQueue, engagementIds, REMOVE)]])));

  var rollback = function rollback() {
    dispatchImmediate(QUEUES_MERGE_QUEUES, ImmutableMap().merge(ImmutableMap([[nextQueueId, nextQueue.set('engagementIds', nextQueue.get('engagementIds'))], [prevQueueId, prevQueue.set('engagementIds', prevQueue.get('engagementIds'))]])));
  };

  return QueuesAPI.addEngagements(nextQueueId, engagementIds).then(null, function (error) {
    rollback(error);
    QueuesAPI.addEngagements(prevQueueId, engagementIds);
    throw error;
  });
}
export function swapQueue(prevQueue, nextQueue, engagementIds) {
  invariant(Array.isArray(engagementIds) || Iterable.isIterable(engagementIds), 'expected engagementId to be an Array or Iterable, but got `%s`', engagementIds);
  logSentryIfNotQueueRecord(prevQueue, {
    prevQueue: prevQueue,
    nextQueue: nextQueue,
    engagementIds: engagementIds
  });
  invariant(prevQueue instanceof QueueRecord, 'swapQueue expected `prevQueue` to be a QueueRecord but got `%s`', prevQueue);
  logSentryIfNotQueueRecord(nextQueue, {
    prevQueue: prevQueue,
    nextQueue: nextQueue,
    engagementIds: engagementIds
  });
  invariant(nextQueue instanceof QueueRecord, 'swapQueue expected `nextQueue` to be a QueueRecord but got `%s`', nextQueue);
  return dispatchQueueSwap({
    engagementIds: engagementIds,
    nextQueue: nextQueue,
    prevQueue: prevQueue
  });
}
export function updateQueueOrder(prevQueues, nextQueues) {
  invariant(prevQueues instanceof OrderedMap, 'updateQueueOrder expected `prevQueues` to be a OrderedMap, but got `%s`', prevQueues);
  invariant(Iterable.isIterable(nextQueues), 'updateQueueOrder expected `nextQueues` to be an Iterable, but got `%s`', nextQueues);
  var nextQueuesPayload = nextQueues.reduce(function (acc, queueRecord) {
    return acc.set(queueRecord.get('id'), queueRecord);
  }, OrderedMap());
  return transact({
    operation: function operation() {
      return QueuesAPI.updateQueueOrder(nextQueues.map(function (queue) {
        return queue.get('id');
      }));
    },
    commit: [QUEUES_CACHE_UPDATED, nextQueuesPayload],
    rollback: [QUEUES_CACHE_UPDATED, prevQueues]
  });
}
export function deleteQueue(queue) {
  logSentryIfNotQueueRecord(queue);
  invariant(queue instanceof QueueRecord, 'deleteQueue expected `queue` to be a QueueRecord but got `%s`', queue);
  return transact({
    operation: function operation() {
      return QueuesAPI.deleteQueue(queue.get('id'));
    },
    commit: [QUEUES_QUEUE_DELETED, queue.get('id')],
    rollback: [QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: queue
    }]
  });
}

function getQueueAPIMethod(type) {
  if (type === ADD) {
    return QueuesAPI.addEngagements;
  } else if (type === REMOVE) {
    return QueuesAPI.removeEngagements;
  }

  return QueuesAPI.updateEngagements;
}

export function updateEngagements(queue, engagementIds, type) {
  logSentryIfNotQueueRecord(queue, {
    engagementIds: engagementIds,
    type: type
  });
  invariant(queue instanceof QueueRecord, 'updateEngagements expected `queue` to be a QueueRecord but got `%s`', queue);
  invariant(Array.isArray(engagementIds) || Iterable.isIterable(engagementIds), 'updateEngagements expected `engagementIds` to be an Array or Iterable, but got `%s`', engagementIds);
  var QueueAPIMethod = getQueueAPIMethod(type);
  return transact({
    operation: function operation() {
      return QueueAPIMethod(queue.get('id'), engagementIds);
    },
    commit: [QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: getUpdatedQueue(queue, engagementIds, type)
    }],
    rollback: [QUEUES_SET_QUEUE, {
      key: queue.get('id'),
      value: queue
    }]
  });
}
export function removeFromQueue(queue, engagementIds) {
  return updateEngagements(queue, engagementIds, REMOVE);
}
export function addToQueue(queue, engagementIds) {
  return updateEngagements(queue, engagementIds, ADD);
}
export function addToQueueById(queueId, engagementIds) {
  invariant(!!queueId, 'queueId is required');
  invariant(Array.isArray(engagementIds) || Iterable.isIterable(engagementIds), 'expected `engagementIds` to be an Array or Iterable, but got `%s`', engagementIds);
  return QueuesAPI.addEngagements(queueId, engagementIds).then(function () {
    dispatchImmediate(ADD_ENGAGEMENTS_TO_QUEUES, {
      queueId: queueId,
      engagementIds: engagementIds
    });
  });
}
export function addUsersToQueueById(queueId, userIds) {
  invariant(!!queueId, 'queueId is required');
  invariant(Array.isArray(userIds) || Iterable.isIterable(userIds), 'expected `userIds` to be an Array or Iterable, but got `%s`', userIds);
  return QueuesAPI.addUsersToQueueById(queueId, userIds).then(function () {
    dispatchImmediate(ADD_USERS_TO_QUEUE, {
      queueId: queueId,
      userIds: userIds
    });
  });
}
export function removeUsersFromQueueById(queueId, userIds) {
  invariant(!!queueId, 'queueId is required');
  invariant(Array.isArray(userIds) || Iterable.isIterable(userIds), 'expected `userIds` to be an Array or Iterable, but got `%s`', userIds);
  return QueuesAPI.removeUsersFromQueueById(queueId, userIds).then(function () {
    dispatchImmediate(REMOVE_USERS_FROM_QUEUE, {
      queueId: queueId,
      userIds: userIds
    });
  });
}