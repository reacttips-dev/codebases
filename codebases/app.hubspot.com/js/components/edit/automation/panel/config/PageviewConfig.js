'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { getPageviewOperator, setPageviewOperator } from '../../lib/Triggers';
import { getMessagesForTrigger } from '../../lib/TriggerDisplayLib';
import { withFlowEditorContext } from '../FlowEditorContext';
import { ORDERED_PAGEVIEW_OPERATORS, PAGEVIEW_OPERATORS_LABELS } from '../../lib/Operators';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import PageviewURLInput from './PageviewURLInput';
export var OperatorInput = function OperatorInput(_ref) {
  var onChange = _ref.onChange,
      value = _ref.value,
      selectedOperator = _ref.selectedOperator,
      readOnly = _ref.readOnly;
  var checked = selectedOperator === value;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIRadioInput, {
      onChange: onChange,
      value: value,
      checked: checked,
      name: "pageview-input",
      readOnly: readOnly,
      "data-test-id": "pageview-option-" + value,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: PAGEVIEW_OPERATORS_LABELS[value]
      })
    }), checked && /*#__PURE__*/_jsx(PageviewURLInput, {
      selectedOperator: selectedOperator
    })]
  });
};
export var PageviewConfig = function PageviewConfig(_ref2) {
  var stagedTrigger = _ref2.stagedTrigger,
      setStagedTrigger = _ref2.setStagedTrigger;
  var messages = getMessagesForTrigger(stagedTrigger);
  var selectedOperator = getPageviewOperator(stagedTrigger);
  var onChangeOperator = useCallback(function (_ref3) {
    var value = _ref3.target.value;
    setStagedTrigger(setPageviewOperator(stagedTrigger, value));
  }, [stagedTrigger, setStagedTrigger]);
  var readOnly = !canEditSequencesContextualWorkflows();
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: messages.LABEL,
    "data-test-id": "pageview-config",
    children: /*#__PURE__*/_jsx(UIToggleGroup, {
      name: "pageview-input",
      children: ORDERED_PAGEVIEW_OPERATORS.map(function (value) {
        return /*#__PURE__*/_jsx(OperatorInput, {
          value: value,
          onChange: onChangeOperator,
          selectedOperator: selectedOperator,
          readOnly: readOnly
        }, value);
      })
    })
  });
};
PageviewConfig.propTypes = {
  stagedTrigger: PropTypes.object.isRequired,
  setStagedTrigger: PropTypes.func.isRequired
};
export default withFlowEditorContext(PageviewConfig);