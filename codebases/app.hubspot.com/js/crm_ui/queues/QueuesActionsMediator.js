'use es6';

import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import * as QueuesActions from './data/QueuesActions';
import { List, fromJS } from 'immutable';
import { MAX_QUEUES_PER_OWNER_EXCEEDED, NON_EXISTENT_TASK, OWNED_BY_OTHER_USER, QUEUE_MAX } from 'crm_data/queues/QueueConstants';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';

var _parseError = function _parseError(error) {
  var response = {};

  try {
    response = JSON.parse(error.data);
  } catch (e) {
    /* eslint-disable no-empty */
  }

  return response;
};

export function updateEngagements(queue, engagementIds) {
  QueuesActions.updateEngagements(queue, engagementIds).catch(function (error) {
    var response = _parseError(error);

    if (response.errorType === OWNED_BY_OTHER_USER) {
      addError('queues.notifications.notTaskOwner');
    } else {
      addError('queues.notifications.genericError');
    }
  });
}

function handleAddToQueueError(error) {
  var response = _parseError(error);

  if (response.errorType === OWNED_BY_OTHER_USER) {
    addError('queues.notifications.notTaskOwner');
  } else if (response.message === NON_EXISTENT_TASK) {
    addError('queues.notifications.nonExistentTask');
    CrmLogger.logError(TASK, {
      action: 'Use task queues',
      type: 'NON_EXISTENT_TASK'
    });
  } else {
    addError('queues.notifications.genericError');
  }

  rethrowError(error);
}

export function addToQueue(queue, selected) {
  CrmLogger.logIndexInteraction(TASK, {
    action: 'Use task queues',
    subAction: 'Add task to queue'
  });
  return QueuesActions.addToQueue(queue, selected).catch(handleAddToQueueError);
}
export function addToQueueById(queueId, engagementIds) {
  CrmLogger.logIndexInteraction(TASK, {
    action: 'Use task queues',
    subAction: 'Add task to queue'
  });
  return QueuesActions.addToQueueById(queueId, engagementIds).catch(handleAddToQueueError);
}
export function swapQueue(prevQueue, nextQueue, engagementIds) {
  return QueuesActions.swapQueue(prevQueue, nextQueue, engagementIds).catch(function (error) {
    addError('queues.notifications.genericError');
    rethrowError(error);
  });
}
export function batchRemoveFromQueues(engagementIds, ownerId, queues) {
  var updatedQueues = queues.reduce(function (acc, queue) {
    var prevIds = queue.get('engagementIds');
    var nextIds = QueuesActions.getIdDifference(queue, engagementIds);

    if (prevIds.hashCode() === nextIds.hashCode()) {
      return acc;
    }

    return acc.push(fromJS({
      queue: queue,
      nextIds: nextIds
    }));
  }, List());
  updatedQueues.forEach(function (queue) {
    QueuesActions.removeFromQueue(queue.get('queue'), queue.get('nextIds'));
  });
}
export function updateQueueOrder(prevQueues, nextQueues) {
  QueuesActions.updateQueueOrder(prevQueues, nextQueues).catch(function () {
    return addError('queues.notifications.genericError');
  });
}
export function renameQueue(queue, value) {
  CrmLogger.logIndexInteraction(TASK, {
    action: 'Use task queues',
    subAction: 'Rename queue'
  });
  QueuesActions.updateDefinition(queue, {
    name: value,
    accessType: queue.get('accessType')
  }).catch(function () {
    return addError('queues.notifications.genericError');
  });
}
export function create(name, accessType) {
  CrmLogger.logIndexInteraction(TASK, {
    action: 'Use task queues',
    subAction: 'Create queue'
  });
  return QueuesActions.create(name, accessType).catch(function (error) {
    var response = _parseError(error);

    if (response.errorType === MAX_QUEUES_PER_OWNER_EXCEEDED) {
      addError('queues.notifications.maxQueuesReached', {
        maxQueues: QUEUE_MAX
      });
    }

    throw error;
  });
}
export function deleteQueue(queue) {
  CrmLogger.logIndexInteraction(TASK, {
    action: 'Use task queues',
    subAction: 'Delete queue'
  });
  return QueuesActions.deleteQueue(queue).catch(function () {
    return addError('queues.notifications.deleteError');
  });
}
export function updateQueueAssignment(prevQueue, nextQueue, engagementId) {
  var selected = parseInt(engagementId, 10); // Swap queue assignment

  if (prevQueue && nextQueue) {
    return swapQueue(prevQueue, nextQueue, [selected]);
  } // No current queue, add to the queue


  if (!prevQueue && nextQueue) {
    return addToQueue(nextQueue, [selected]);
  }

  return QueuesActions.removeFromQueue(prevQueue, [selected]);
}