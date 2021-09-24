'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { setSelectedForm, getSelectedForm } from '../../lib/Triggers';
import { FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER } from '../../lib/TriggerDefinitions';
import { getMessagesForTrigger } from '../../lib/TriggerDisplayLib';
import { withFlowEditorContext } from '../FlowEditorContext';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import FormReferenceInput from './FormReferenceInput';
export var FormSubmissionConfig = function FormSubmissionConfig(_ref) {
  var stagedTrigger = _ref.stagedTrigger,
      setStagedTrigger = _ref.setStagedTrigger;
  var messages = getMessagesForTrigger(stagedTrigger);
  var selectedForm = getSelectedForm(stagedTrigger);
  var formReferenceInputValue = selectedForm === FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER ? '' : selectedForm;
  var onChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setStagedTrigger(setSelectedForm(stagedTrigger, value));
  }, [stagedTrigger, setStagedTrigger]);
  var readOnly = !canEditSequencesContextualWorkflows();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIFormControl, {
      help: messages.HELP,
      label: messages.LABEL,
      "data-test-id": "form-submission-config",
      children: /*#__PURE__*/_jsxs(UIToggleGroup, {
        name: "object-selection-input",
        children: [/*#__PURE__*/_jsx(UIRadioInput, {
          name: "object-selection-input",
          onChange: onChange,
          value: '',
          checked: selectedForm === '',
          readOnly: readOnly,
          "data-test-id": "form-submission-option-any",
          children: messages.OPTION_ANY
        }), /*#__PURE__*/_jsx(UIRadioInput, {
          name: "object-selection-input",
          onChange: onChange,
          value: FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER,
          checked: !!selectedForm,
          readOnly: readOnly,
          children: messages.OPTION_SPECIFIC
        })]
      })
    }), selectedForm && /*#__PURE__*/_jsx(FormReferenceInput, {
      onChange: onChange,
      value: formReferenceInputValue
    })]
  });
};
FormSubmissionConfig.propTypes = {
  stagedTrigger: PropTypes.object.isRequired,
  setStagedTrigger: PropTypes.func.isRequired
};
export default withFlowEditorContext(FormSubmissionConfig);