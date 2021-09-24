'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _fromJS;

import { fromJS, Map as ImmutableMap, List } from 'immutable';
import flatten from 'transmute/flatten';
import { ENGAGEMENT_ID, LAST_MODIFIED_DATE, MODIFIED_BY, OWNER_ID, ALL_ACCESSIBLE_TEAM_IDS, ENGAGEMENT_TIMESTAMP, ENGAGEMENT_TYPE, CREATED_BY, AT_MENTIONED_OWNERS } from 'crm_data/engagements/inboundDbProperties/inboundDbBaseEngagementPropertiesConstants';
import { REPEAT_INTERVAL } from 'customer-data-objects/task/TaskPropertyNames';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import { TASK, ENGAGEMENT } from 'customer-data-objects/constants/ObjectTypes';
import { TASK_BODY, TASK_STATUS, TASK_SUBJECT, TASK_TYPE, TASK_REMINDERS, SEND_DEFAULT_REMINDER, QUEUE_MEMBERSHIP_IDS, TASK_PRIORITY, TASK_COMPLETION_DATE, TASK_SEQUENCE_STEP_ENROLLMENT_ID } from 'crm_data/engagements/inboundDbProperties/inboundDbTaskPropertiesConstants';
import convertToInt from 'customer-data-properties/utils/convertToInt';
var TYPES_WITH_SPECIFIC_FIELDS = [TASK];
var propertyNameConversionTable = fromJS((_fromJS = {}, _defineProperty(_fromJS, TASK, {
  'metadata.body': TASK_BODY,
  'metadata.reminders': TASK_REMINDERS,
  'engagement.timestamp': ENGAGEMENT_TIMESTAMP,
  'metadata.completionDate': TASK_COMPLETION_DATE,
  'metadata.taskType': TASK_TYPE,
  'engagement.type': ENGAGEMENT_TYPE,
  'metadata.subject': TASK_SUBJECT,
  'engagement.createdBy': CREATED_BY,
  'metadata.status': TASK_STATUS,
  'metadata.priority': TASK_PRIORITY,
  'engagement.ownerId': OWNER_ID,
  'engagement.queueMembershipIds': QUEUE_MEMBERSHIP_IDS,
  'metadata.sequenceStepEnrollmentId': TASK_SEQUENCE_STEP_ENROLLMENT_ID,
  'metadata.repeatInterval': REPEAT_INTERVAL
}), _defineProperty(_fromJS, ENGAGEMENT, {
  'engagement.timestamp': ENGAGEMENT_TIMESTAMP,
  'engagement.type': ENGAGEMENT_TYPE,
  'engagement.createdBy': CREATED_BY,
  'engagement.ownerId': OWNER_ID
}), _fromJS));
var inversePropertyNameConversionTable = propertyNameConversionTable.map(function (group) {
  return group.reduce(function (properties, inboundDbPropertyName, engagementPropertyName) {
    return properties.set(inboundDbPropertyName, engagementPropertyName);
  }, ImmutableMap());
});
export var mapV1toInboundPropertyName = function mapV1toInboundPropertyName(objectType, v1PropertyNames) {
  var conversionTable = propertyNameConversionTable.get(objectType);
  return v1PropertyNames.reduce(function (acc, value) {
    var converted = conversionTable.get(value);

    if (!converted) {
      return acc;
    }

    acc.push(converted);
    return acc;
  }, []);
};
/*
 * Transforms a Map of properties with InboundDB Property names into
 * a map of properties with Engagements V1 property names */

export var inboundDbPropertiesToEngagementsProperties = function inboundDbPropertiesToEngagementsProperties(objectType, inboundDbProperties) {
  var conversionTable = inversePropertyNameConversionTable.get(objectType);
  return inboundDbProperties.reduce(function (engagementProperties, inboundProperty) {
    if (!conversionTable.has(inboundProperty.get('name'))) {
      return engagementProperties;
    }

    var engagementProperty = inboundProperty.update('name', function (name) {
      return conversionTable.get(name);
    });
    return engagementProperties.set(engagementProperty.name, engagementProperty);
  }, ImmutableMap());
};
/*
 * Transforms a Map of properties with Engagements V1 Property names into
 * a map of properties with Inbound DB property names */

export var engagementPropertiesToInboundDbProperties = function engagementPropertiesToInboundDbProperties(objectType, engagementProperties) {
  var conversionTable = propertyNameConversionTable.get(objectType);
  return engagementProperties.reduce(function (inboundDbProperties, engagementProperty) {
    if (!conversionTable.has(engagementProperty.get('name'))) {
      return inboundDbProperties;
    }

    var inboundDbProperty = engagementProperty.update('name', function (name) {
      return conversionTable.get(name);
    });
    return inboundDbProperties.set(inboundDbProperty.get('name'), inboundDbProperty);
  }, ImmutableMap());
};
export var convertTypeSpecificFieldsToInboundProperties = function convertTypeSpecificFieldsToInboundProperties(engagementType, engagement) {
  var metadata = engagement.get('metadata', ImmutableMap());

  switch (engagementType) {
    case TASK:
      return fromJS([{
        name: TASK_BODY,
        value: metadata.get('body')
      }, {
        name: TASK_REMINDERS,
        value: metadata.get('reminders')
      }, {
        name: SEND_DEFAULT_REMINDER,
        value: metadata.get('sendDefaultReminder')
      }, {
        name: TASK_STATUS,
        value: metadata.get('status')
      }, {
        name: TASK_SUBJECT,
        value: metadata.get('subject')
      }, {
        name: TASK_TYPE,
        value: metadata.get('taskType')
      }, {
        name: QUEUE_MEMBERSHIP_IDS,
        value: engagement.getIn(['engagement', 'queueMembershipIds', 0])
      }, {
        name: TASK_PRIORITY,
        value: metadata.get('priority')
      }, {
        name: TASK_SEQUENCE_STEP_ENROLLMENT_ID,
        value: metadata.get('sequenceStepEnrollmentId')
      }]).filter(function (property) {
        return property.get('value') != null;
      });

    default:
      return List();
  }
};

var getValue = function getValue(property) {
  return property && property.get('value');
};

export var convertCommonFieldsToInboundProperties = function convertCommonFieldsToInboundProperties(engagement) {
  var baseProperties = engagement.get('engagement', ImmutableMap());
  return fromJS([// TODO: This ENGAGEMENT_ID is defined as hs_unique_id which isn't the same as engagement.id or objectId/hs_object_id
  // It's actually a foreign key to a _thing_ like a sequence or workflow that the engagement originated from
  // not sure what the impact of changing this to hs_object_id is right now
  {
    name: ENGAGEMENT_ID,
    value: baseProperties.get('id')
  }, {
    name: LAST_MODIFIED_DATE,
    value: baseProperties.get('lastUpdated')
  }, {
    name: MODIFIED_BY,
    value: baseProperties.get('modifiedBy')
  }, {
    name: OWNER_ID,
    value: baseProperties.get('ownerId')
  }, {
    name: ENGAGEMENT_TIMESTAMP,
    value: baseProperties.get('timestamp')
  }, {
    name: ENGAGEMENT_TYPE,
    value: baseProperties.get('type')
  }, {
    name: ALL_ACCESSIBLE_TEAM_IDS,
    value: baseProperties.get('allAccessibleTeamIds')
  }]).filter(getValue);
};
export var engagementUpdatesToInboundDbProperties = function engagementUpdatesToInboundDbProperties(updates) {
  // try to convert data for each type, if it doesn't exist we won't send it
  return TYPES_WITH_SPECIFIC_FIELDS.reduce(function (properties, type) {
    return properties.concat(convertTypeSpecificFieldsToInboundProperties(type, updates));
  }, List()).concat(convertCommonFieldsToInboundProperties(updates)).filter(getValue);
};
export var engagementToInboundDbObject = function engagementToInboundDbObject(engagement) {
  var type = engagement.getIn(['engagement', 'type']);
  var associations = engagement.get('associations', ImmutableMap());
  var convertedObject = fromJS({
    object: {
      properties: convertCommonFieldsToInboundProperties(engagement)
    },
    associations: {
      ENGAGEMENT_TO_CONTACT: associations.get('contactIds') || List(),
      ENGAGEMENT_TO_COMPANY: associations.get('companyIds') || List(),
      ENGAGEMENT_TO_DEAL: associations.get('dealIds') || List(),
      ENGAGEMENT_TO_TICKET: associations.get('ticketIds') || List()
    }
  });
  return convertedObject.updateIn(['object', 'properties'], function (properties) {
    return properties.concat(convertTypeSpecificFieldsToInboundProperties(type, engagement)).filter(getValue);
  });
};

var getTypeSpecificFieldsFromInboundProperties = function getTypeSpecificFieldsFromInboundProperties(properties) {
  switch (getValue(properties.get(ENGAGEMENT_TYPE))) {
    case TASK:
      {
        var rawRemindersValue = getValue(properties.get(TASK_REMINDERS));
        return fromJS({
          body: getValue(properties.get(TASK_BODY)),
          reminders: rawRemindersValue && flatten(List.of(rawRemindersValue)).map(convertToInt),
          sendDefaultReminder: getValue(properties.get(SEND_DEFAULT_REMINDER)),
          status: getValue(properties.get(TASK_STATUS)),
          subject: getValue(properties.get(TASK_SUBJECT)),
          taskType: getValue(properties.get(TASK_TYPE)),
          priority: getValue(properties.get(TASK_PRIORITY))
        }).filter(function (property) {
          return property != null;
        });
      }

    default:
      return ImmutableMap();
  }
};

export var engagementFromInboundDbObject = function engagementFromInboundDbObject(inboundDbObject) {
  var properties = inboundDbObject.get('properties');
  var timestamp = convertToInt(getValue(properties.get(ENGAGEMENT_TIMESTAMP)));
  var queueMembershipId = getValue(properties.get(QUEUE_MEMBERSHIP_IDS));
  var baseEngagementProperties = fromJS({
    id: inboundDbObject.get('objectId'),
    lastUpdated: getValue(properties.get(LAST_MODIFIED_DATE)),
    modifiedBy: getValue(properties.get(MODIFIED_BY)),
    ownerId: getValue(properties.get(OWNER_ID)),
    timestamp: timestamp,
    type: getValue(properties.get(ENGAGEMENT_TYPE)),
    queueMembershipIds: queueMembershipId && flatten(List.of(queueMembershipId)).map(convertToInt)
  }).filter(function (property) {
    return property != null;
  });
  return ImmutableMap({
    engagement: baseEngagementProperties,
    metadata: getTypeSpecificFieldsFromInboundProperties(properties)
  });
};
/* Converts the legacy representation of owner mentions in a task note from an
 * `associations` key to an inbound DB property representation and returns the
 * task with that property added and the association key removed
 * @param {TaskRecord} task
 * @returns {TaskRecord}
 */

export var updateTaskLegacyOwnerMentions = function updateTaskLegacyOwnerMentions(task) {
  var ownerMentionsValue = task.getIn(['associations', 'ownerIds'], List()).toJS().join(';');
  return task.setIn(['properties', AT_MENTIONED_OWNERS], PropertyValueRecord({
    name: AT_MENTIONED_OWNERS,
    value: ownerMentionsValue
  })).deleteIn(['associations', 'ownerIds']);
}; // temporary adapter function for reformatting a task during the recurring tasks
// rollout

export var cleanTaskForRecurring = function cleanTaskForRecurring(task, isUngatedForRecurringTasks) {
  return isUngatedForRecurringTasks ? updateTaskLegacyOwnerMentions(task) : task.deleteIn(['properties', 'hs_queue_membership_ids']).deleteIn(['associations', 'ownerIds']);
};