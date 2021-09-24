'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ExtensionDefinitionI;

import enviro from 'enviro';
import memoize from 'hs-lodash/memoize';
/*****************************************************************
 * Constants
 ****************************************************************/

export var ActionTypes = {
  UNENROLL_FROM_SEQUENCE: 'UNENROLL_FROM_SEQUENCE',
  ENROLL_IN_SEQUENCE: 'ENROLL_IN_SEQUENCE'
};
export var ExtensionDefinitionIds = (_ExtensionDefinitionI = {}, _defineProperty(_ExtensionDefinitionI, ActionTypes.UNENROLL_FROM_SEQUENCE, {
  PROD: 4702372,
  QA: 4404497
}), _defineProperty(_ExtensionDefinitionI, ActionTypes.ENROLL_IN_SEQUENCE, {
  PROD: 3174832,
  QA: 4404496
}), _ExtensionDefinitionI);
export var getDefaultFirstAction = function getDefaultFirstAction() {
  return {};
};
var UnenrollFromSequence = {
  actionType: 'AUTOMATION_EXTENSION',
  metadata: {
    actionType: 'AUTOMATION_EXTENSION',
    extensionInstance: {
      extensionDefinitionId: enviro.isQa() ? ExtensionDefinitionIds[ActionTypes.UNENROLL_FROM_SEQUENCE]['QA'] : ExtensionDefinitionIds[ActionTypes.UNENROLL_FROM_SEQUENCE]['PROD'],
      extensionDefinitionVersion: null,
      // Legacy field that's still required, but its value is ignored. Workflows always uses the latest version.
      fields: []
    }
  }
};

var EnrollInSequence = function EnrollInSequence(sequenceId) {
  return {
    actionType: 'AUTOMATION_EXTENSION',
    metadata: {
      actionType: 'AUTOMATION_EXTENSION',
      extensionInstance: {
        extensionDefinitionId: enviro.isQa() ? ExtensionDefinitionIds[ActionTypes.ENROLL_IN_SEQUENCE]['QA'] : ExtensionDefinitionIds[ActionTypes.ENROLL_IN_SEQUENCE]['PROD'],
        extensionDefinitionVersion: null,
        // Legacy field but still required, but its value is ignored. Workflows always uses the latest version.
        fields: [{
          fieldKey: 'sequenceId',
          fieldValue: {
            valueType: 'EXTERNAL',
            value: sequenceId,
            effectiveValueType: 'SINGLE'
          }
        }, {
          fieldKey: 'userId',
          fieldValue: {
            valueType: 'EXTERNAL',
            value: null,
            effectiveValueType: 'SINGLE'
          }
        }, {
          fieldKey: 'fromAndInboxAddress',
          fieldValue: {
            valueType: 'EXTERNAL',
            value: null,
            effectiveValueType: 'SINGLE'
          }
        }]
      }
    }
  };
};

export var getActions = memoize(function (sequenceId) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, ActionTypes.UNENROLL_FROM_SEQUENCE, UnenrollFromSequence), _defineProperty(_ref, ActionTypes.ENROLL_IN_SEQUENCE, EnrollInSequence(sequenceId)), _ref;
});