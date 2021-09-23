'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import partial from 'transmute/partial';
import { useCallback } from 'react';
import { CONTACT_ACTIVITY_TRIGGER_TYPES } from '../../lib/TriggerDisplayLib';
import { Triggers } from '../../lib/TriggerDefinitions';
import { withFlowEditorContext } from '../FlowEditorContext';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H7 from 'UIComponents/elements/headings/H7';
import UISection from 'UIComponents/section/UISection';
import TriggerStepHeader from './TriggerStepHeader';
import SelectableBoxWithIcon from '../SelectableBoxWithIcon';
export var TriggerStepSelectType = function TriggerStepSelectType(_ref) {
  var setStagedTrigger = _ref.setStagedTrigger,
      onStepIndexChange = _ref.onStepIndexChange;
  var handleSelectTriggerType = useCallback(function (triggerType) {
    setStagedTrigger(Triggers[triggerType]);
    onStepIndexChange({
      target: {
        value: 1
      }
    });
  }, [setStagedTrigger, onStepIndexChange]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TriggerStepHeader, {}), /*#__PURE__*/_jsxs(UISection, {
      children: [/*#__PURE__*/_jsx(H7, {
        "aria-level": 3,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.trigger.section.contactActivities"
        })
      }), CONTACT_ACTIVITY_TRIGGER_TYPES.map(function (option) {
        return /*#__PURE__*/_jsx(SelectableBoxWithIcon, Object.assign({
          onClick: partial(handleSelectTriggerType, option.value),
          readOnly: !canEditSequencesContextualWorkflows()
        }, option), option.value);
      })]
    })]
  });
};
TriggerStepSelectType.propTypes = {
  setStagedTrigger: PropTypes.func.isRequired,
  onStepIndexChange: PropTypes.func.isRequired
};
export default withFlowEditorContext(TriggerStepSelectType);