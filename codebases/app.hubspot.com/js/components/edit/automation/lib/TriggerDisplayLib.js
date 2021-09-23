'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { TriggerTypes } from './TriggerDefinitions';
import { getTriggerTypeFromTrigger } from './Triggers';
/*****************************************************************
 * Constants for panel UI
 ****************************************************************/

export var CONTACT_ACTIVITY_TRIGGER_TYPES = [{
  value: TriggerTypes.FORM_SUBMISSION,
  iconName: 'forms',
  titleMessage: 'sequencesAutomation.trigger.formSubmission.buttonLabel',
  'data-test-id': 'trigger-type-form-submission'
}, {
  value: TriggerTypes.PAGEVIEW,
  iconName: 'website',
  titleMessage: 'sequencesAutomation.trigger.pageView.buttonLabel',
  'data-test-id': 'trigger-type-pageview'
}];
export var getMessagesForTrigger = function getMessagesForTrigger(trigger) {
  var triggerType = getTriggerTypeFromTrigger(trigger);

  if (triggerType === TriggerTypes.FORM_SUBMISSION) {
    return {
      LABEL: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.trigger.formSubmission.objectSelectionForm.label"
      }),
      OPTION_ANY: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.trigger.formSubmission.objectSelectionForm.options.any"
      }),
      OPTION_SPECIFIC: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.trigger.formSubmission.objectSelectionForm.options.specific"
      })
    };
  }

  if (triggerType === TriggerTypes.PAGEVIEW) {
    return {
      LABEL: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.trigger.pageView.config.label"
      })
    };
  }

  return {};
};