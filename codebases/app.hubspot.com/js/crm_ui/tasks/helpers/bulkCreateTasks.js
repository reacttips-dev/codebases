'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import QueuesStore from 'crm_data/queues/QueuesStore';
import { InspectStore } from 'general-store';
import { fromJS, List } from 'immutable';
import * as QueuesActionsMediator from '../../queues/QueuesActionsMediator';
import { batchCreate } from 'crm_data/engagements/EngagementsActions';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import links from 'crm-legacy-links/links';
import I18n from 'I18n';
import { TODO } from '../../constants/taskTypes';
import { TASK } from 'customer-data-objects/engagement/EngagementTypes';
import { NOT_STARTED } from 'customer-data-objects/engagement/EngagementStatusTypes';
import ObjectAssociationTypes from 'customer-data-objects/constants/ObjectAssociationTypes';
export var bulkCreateTasks = function bulkCreateTasks(_ref) {
  var objectType = _ref.objectType,
      queueId = _ref.queueId,
      selected = _ref.selected,
      draft = _ref.draft;
  var queues = InspectStore.getState(QueuesStore);
  var newTasks = selected.reduce(function (acc, obj) {
    var subject;
    var id = obj.id,
        name = obj.name;
    var title = draft.get('metadata.subject');
    var taskType = draft.get('metadata.taskType');
    var priority = draft.get('metadata.priority');
    taskType = taskType === TODO ? null : taskType;
    var reminders = draft.get('metadata.reminders', List()).first();
    var sendDefaultReminder = String(draft.get('sendDefaultReminder', false));

    if (title.get('isSmartTitle')) {
      var keyPrefix = 'tasksV2.taskPropertyInputSmartTitle.defaultSmartTitle';
      var typeKey = I18n.text(keyPrefix + ".type." + title.get('type'));
      subject = typeKey + " " + name;
    } else {
      subject = title.get('value');
    }

    var attributes = fromJS({
      engagement: {
        ownerId: draft.get('engagement.ownerId'),
        timestamp: draft.get('engagement.timestamp'),
        type: TASK
      },
      metadata: {
        subject: subject,
        taskType: taskType,
        priority: priority,
        reminders: reminders,
        sendDefaultReminder: sendDefaultReminder,
        status: NOT_STARTED
      },
      associations: _defineProperty({}, ObjectAssociationTypes[objectType], [id])
    });
    acc.push(attributes);
    return acc;
  }, []);
  return batchCreate(newTasks).then(function (tasks) {
    var link = queueId ? links.tasksQueue(queueId, {
      noBaseUrl: false
    }) : links.tasks('all', {
      noBaseUrl: false
    });
    Alerts.addSuccess('tasksV2.batchCreateTasks.success', {
      number: tasks.size,
      link: link
    }, {
      timeout: 8000,
      'data-test-id': 'bulk-create-success'
    });

    if (!queueId) {
      return;
    }

    var queue = queues.get(parseInt(queueId, 10));
    QueuesActionsMediator.addToQueue(queue, tasks.keySeq().toArray());
  });
};