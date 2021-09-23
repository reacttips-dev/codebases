'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { TriggerTypes, HiddenTriggers, ReEnrollmentTriggers, FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER } from './TriggerDefinitions';
import { PageviewOperators } from './Operators';
import { splitProtocolAndDomain, valueContainsProtocol, HTTPS_PROTOCOL } from './PageviewURLUtils';
import { isEnrollInSequenceAction } from 'SequencesUI/components/edit/automation/lib/Actions';
/*****************************************************************
 * Convert between trigger and trigger type
 ****************************************************************/

export var getTriggerTypeFromTrigger = function getTriggerTypeFromTrigger(trigger) {
  var filterFamily = trigger && trigger.filterFamily;

  switch (filterFamily) {
    case 'FormSubmission':
      return TriggerTypes.FORM_SUBMISSION;

    case 'PageView':
      return TriggerTypes.PAGEVIEW;

    default:
      return undefined;
  }
};
export var isFormSubmissionTrigger = function isFormSubmissionTrigger(trigger) {
  return getTriggerTypeFromTrigger(trigger) === TriggerTypes.FORM_SUBMISSION;
};
/*****************************************************************
 * Read & modify triggers
 ****************************************************************/

export var getSelectedForm = function getSelectedForm(trigger) {
  return trigger && trigger.form;
};
export var setSelectedForm = function setSelectedForm(trigger, value) {
  return Object.assign({}, trigger, {
    form: value
  });
};
export var getPropertyValue = function getPropertyValue(trigger) {
  if (trigger) {
    return trigger.value;
  }

  return undefined;
};
export var setPropertyValue = function setPropertyValue(trigger, value) {
  return Object.assign({}, trigger, {
    value: value
  });
};
export var getPageviewOperator = function getPageviewOperator(trigger) {
  if (trigger) {
    return trigger.operator;
  }

  return undefined;
};
export var setPageviewOperator = function setPageviewOperator(trigger, operator) {
  var pageviewURLValue = getPropertyValue(trigger);

  if (operator === PageviewOperators.HAS_PAGEVIEW_EQUAL && !valueContainsProtocol(pageviewURLValue)) {
    pageviewURLValue = "" + HTTPS_PROTOCOL + (pageviewURLValue || '');
  }

  return Object.assign({}, trigger, {
    operator: operator,
    value: pageviewURLValue
  });
};
export var isTriggerValid = function isTriggerValid(trigger) {
  var triggerType = getTriggerTypeFromTrigger(trigger);

  if (triggerType === TriggerTypes.FORM_SUBMISSION) {
    var form = getSelectedForm(trigger);
    if (form === undefined) return false; // has not chosen any option on FormSubmissionConfig

    if (form === FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER) return false; // "Specific form" option but needs to choose a form

    if (form === '') return true; // "Any form" option

    return true; // `form` is some form ID
  }

  if (triggerType === TriggerTypes.PAGEVIEW) {
    var operator = getPageviewOperator(trigger);
    var value = getPropertyValue(trigger);

    if (operator === PageviewOperators.HAS_PAGEVIEW_CONTAINS) {
      return !!value;
    } else if (operator === PageviewOperators.HAS_PAGEVIEW_EQUAL) {
      var _splitProtocolAndDoma = splitProtocolAndDomain(value),
          _splitProtocolAndDoma2 = _slicedToArray(_splitProtocolAndDoma, 2),
          protocol = _splitProtocolAndDoma2[0],
          domain = _splitProtocolAndDoma2[1];

      return !!protocol && !!domain;
    }
  }

  return false;
};
/*****************************************************************
 * Additional triggers when constructing final flow object
 ****************************************************************/

export var getAdditionalSequencesTriggers = function getAdditionalSequencesTriggers(trigger, action, sequenceId) {
  var triggerType = getTriggerTypeFromTrigger(trigger);
  var isEnrollAction = isEnrollInSequenceAction(action);

  if (triggerType === TriggerTypes.FORM_SUBMISSION) {
    if (isEnrollAction) {
      return [];
    } else {
      return [HiddenTriggers.RecentConversionDate, HiddenTriggers.NowInSequenceTrue, HiddenTriggers.getLastSequenceEnrolled(sequenceId)];
    }
  }

  if (getTriggerTypeFromTrigger(trigger) === TriggerTypes.PAGEVIEW) {
    if (isEnrollAction) {
      return [];
    } else {
      return [HiddenTriggers.getPageviewTrigger(getPageviewOperator(trigger), getPropertyValue(trigger)), HiddenTriggers.PageviewTimeLastSeen, HiddenTriggers.NowInSequenceTrue, HiddenTriggers.getLastSequenceEnrolled(sequenceId)];
    }
  }

  return [];
};
export var getReEnrollmentTriggerSetsForTrigger = function getReEnrollmentTriggerSetsForTrigger(trigger) {
  if (isFormSubmissionTrigger(trigger)) {
    return [ReEnrollmentTriggers.getForm(getSelectedForm(trigger))];
  }

  if (getTriggerTypeFromTrigger(trigger) === TriggerTypes.PAGEVIEW) {
    return [ReEnrollmentTriggers.getPageview(getPageviewOperator(trigger), getPropertyValue(trigger))];
  }

  return [];
};