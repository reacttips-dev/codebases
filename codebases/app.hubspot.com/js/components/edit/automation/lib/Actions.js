'use es6';

import { ActionTypes, ExtensionDefinitionIds } from './ActionDefinitions';
/*****************************************************************
 * Convert between action and action type
 ****************************************************************/

export var getActionTypeFromAction = function getActionTypeFromAction(action) {
  var extensionDefinitionId = action && action.metadata && action.metadata.extensionInstance && action.metadata.extensionInstance.extensionDefinitionId;

  switch (extensionDefinitionId) {
    case ExtensionDefinitionIds[ActionTypes.UNENROLL_FROM_SEQUENCE]['PROD']:
    case ExtensionDefinitionIds[ActionTypes.UNENROLL_FROM_SEQUENCE]['QA']:
      return ActionTypes.UNENROLL_FROM_SEQUENCE;

    case ExtensionDefinitionIds[ActionTypes.ENROLL_IN_SEQUENCE]['PROD']:
    case ExtensionDefinitionIds[ActionTypes.ENROLL_IN_SEQUENCE]['QA']:
      return ActionTypes.ENROLL_IN_SEQUENCE;

    default:
      return undefined;
  }
};
export var isEnrollInSequenceAction = function isEnrollInSequenceAction(action) {
  return getActionTypeFromAction(action) === ActionTypes.ENROLL_IN_SEQUENCE;
};
/*****************************************************************
 * Read & modify actions
 ****************************************************************/

export var isActionValid = function isActionValid(action) {
  var actionType = getActionTypeFromAction(action);

  switch (actionType) {
    case ActionTypes.UNENROLL_FROM_SEQUENCE:
      return true;

    case ActionTypes.ENROLL_IN_SEQUENCE:
      {
        return action.metadata.extensionInstance.fields.every(function (field) {
          return !!field.fieldValue.value;
        });
      }

    default:
      return false;
  }
};
export var getExtensionInstanceFieldValue = function getExtensionInstanceFieldValue(action, fieldKey) {
  if (action && action.metadata && action.metadata.extensionInstance && action.metadata.extensionInstance.fields) {
    var field = action.metadata.extensionInstance.fields.find(function (_field) {
      return _field.fieldKey === fieldKey;
    });
    return field && field.fieldValue && field.fieldValue.value;
  }

  return undefined;
};
export var setExtensionInstanceFieldValue = function setExtensionInstanceFieldValue(action, fieldKey, value) {
  var updatedFields = action.metadata.extensionInstance.fields.map(function (field) {
    if (field.fieldKey === fieldKey) {
      return Object.assign({}, field, {
        fieldValue: Object.assign({}, field.fieldValue, {
          value: value
        })
      });
    }

    return field;
  });
  return Object.assign({}, action, {
    metadata: Object.assign({}, action.metadata, {
      extensionInstance: Object.assign({}, action.metadata.extensionInstance, {
        fields: updatedFields
      })
    })
  });
};