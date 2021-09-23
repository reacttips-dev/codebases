'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { getDefaultFirstTrigger } from 'SequencesUI/components/edit/automation/lib/TriggerDefinitions';
import { getAdditionalSequencesTriggers, getReEnrollmentTriggerSetsForTrigger } from 'SequencesUI/components/edit/automation/lib/Triggers';
import { getDefaultFirstAction } from 'SequencesUI/components/edit/automation/lib/ActionDefinitions';
import { getActionTypeFromAction } from 'SequencesUI/components/edit/automation/lib/Actions';
/*****************************************************************
 * Flow Triggers / Filters
 ****************************************************************/

export var getFirstTrigger = function getFirstTrigger(flow) {
  // Workflows uses customer-data-filters to handle filtering,
  // but we don't because our UI differs significantly from that of the library.
  // This trigger is in the List Seg Classic format, but specifically for stagedTrigger we take it down to the smallest item.
  if (!flow || !flow.classicEnrollmentSettings || !flow.classicEnrollmentSettings.segmentCriteria || !flow.classicEnrollmentSettings.segmentCriteria[0]) {
    return getDefaultFirstTrigger();
  } // Assumes the first trigger is the one customizable by users,
  // and is not any of the "hidden" sequences triggers


  return flow.classicEnrollmentSettings.segmentCriteria[0][0];
};
/*****************************************************************
 * Flow Actions
 ****************************************************************/

export var getFirstAction = function getFirstAction(flow) {
  if (!flow || !flow.actions) {
    return getDefaultFirstAction();
  }

  return flow.actions[flow.firstActionId] || getDefaultFirstAction();
};
/*****************************************************************
 * Flow Object
 ****************************************************************/

var getActionId = function getActionId(_ref) {
  var flow = _ref.flow,
      stagedAction = _ref.stagedAction;
  var originalAction = getFirstAction(flow);

  if (getActionTypeFromAction(originalAction) === getActionTypeFromAction(stagedAction)) {
    return originalAction.actionId;
  } else {
    // Workflows BE does not allow changing the actionType in place
    return flow.nextAvailableActionId;
  }
};

var formatSingleAction = function formatSingleAction(action) {
  var actionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return {
    firstActionId: actionId,
    actions: _defineProperty({}, actionId, Object.assign({}, action, {
      actionId: actionId
    }))
  };
};

var getDefaultFlow = function getDefaultFlow() {
  return Object.assign({}, formatSingleAction(getDefaultFirstAction(), 1), {
    nextAvailableActionId: 1,
    classicEnrollmentSettings: {
      enrollmentFilters: null,
      segmentCriteria: [[getDefaultFirstTrigger()]]
    },
    flowObjectType: 'CONTACT',
    objectTypeId: '0-1',
    isClassicWorkflow: true,
    isEnabled: true
  });
};

export var buildUpdatedFlow = function buildUpdatedFlow(_ref2) {
  var _ref2$flow = _ref2.flow,
      flow = _ref2$flow === void 0 ? getDefaultFlow() : _ref2$flow,
      stagedAction = _ref2.stagedAction,
      stagedTrigger = _ref2.stagedTrigger,
      sequenceId = _ref2.sequenceId;
  return Object.assign({}, flow, {}, formatSingleAction(stagedAction, getActionId({
    flow: flow,
    stagedAction: stagedAction
  })), {
    shouldReenroll: true,
    enrollOnCriteriaUpdate: false,
    classicEnrollmentSettings: Object.assign({}, flow.classicEnrollmentSettings, {
      allowContactToTriggerMultipleTimes: true,
      enrollmentFilters: null,
      // See workflows for reason -- https://git.hubteam.com/HubSpot/WorkflowsReactUI/blob/9ff7e308f1254df037ee0ceac74432e9a658359d/WorkflowsReactUI/static/js/platform/api-client/actions/FlowActions.js#L1019-L1035
      segmentCriteria: [[stagedTrigger].concat(_toConsumableArray(getAdditionalSequencesTriggers(stagedTrigger, stagedAction, sequenceId)))],
      reEnrollmentTriggerSets: _toConsumableArray(getReEnrollmentTriggerSetsForTrigger(stagedTrigger))
    })
  });
};