'use es6';

import { CALL, EMAIL, LINKED_IN_CONNECT, LINKED_IN_MESSAGE, TODO } from 'customer-data-objects/engagement/TaskTypes';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import I18n from 'I18n';
import { fromJS } from 'immutable';
import memoize from 'transmute/memoize';
import once from 'transmute/once'; // Delay load to allow I18n.text to be ready

export var getPropertyAttributes = once(function () {
  return fromJS({
    hs_task_type: {
      label: I18n.text('taskFormsLib.input.type.label'),
      options: [PropertyOptionRecord({
        value: TODO,
        label: 'To do'
      }), PropertyOptionRecord({
        value: CALL,
        label: 'Call'
      }), PropertyOptionRecord({
        value: EMAIL,
        label: 'Email'
      }), PropertyOptionRecord({
        value: LINKED_IN_MESSAGE,
        label: 'LinkedIn Sales Navigator Send InMail'
      }), PropertyOptionRecord({
        value: LINKED_IN_CONNECT,
        label: 'LinkedIn Sales Navigator Connection Request'
      })]
    },
    hs_task_subject: {
      label: I18n.text('taskFormsLib.input.taskTitle.label')
    },
    hs_timestamp: {
      label: I18n.text('taskFormsLib.input.dueDate.label')
    },
    hubspot_owner_id: {
      label: I18n.text('taskFormsLib.input.owner.label')
    },
    hs_task_priority: {
      label: I18n.text('taskFormsLib.input.priority.label')
    },
    hs_queue_membership_ids: {
      label: I18n.text('taskFormsLib.input.queueMembershipIds.label')
    }
  });
});
var transformTaskPropertiesForForms = memoize(function (properties) {
  return properties.map(function (property) {
    var propertyAttributes = getPropertyAttributes();

    if (property && propertyAttributes.has(property.name)) {
      return property.merge(propertyAttributes.get(property.name));
    }

    return property;
  });
});
export default transformTaskPropertiesForForms;