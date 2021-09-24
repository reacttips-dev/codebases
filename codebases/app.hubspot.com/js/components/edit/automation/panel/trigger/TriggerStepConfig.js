'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isFormSubmissionTrigger } from '../../lib/Triggers';
import { getDefaultFirstTrigger } from '../../lib/TriggerDefinitions';
import { withFlowEditorContext } from '../FlowEditorContext';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISection from 'UIComponents/section/UISection';
import UIBackButton from 'UIComponents/nav/UIBackButton';
import UILink from 'UIComponents/link/UILink';
import TriggerStepHeader from './TriggerStepHeader';
import FormSubmissionConfig from '../config/FormSubmissionConfig';
import PageviewConfig from '../config/PageviewConfig';
export var TriggerStepConfig = function TriggerStepConfig(_ref) {
  var stagedTrigger = _ref.stagedTrigger,
      setStagedTrigger = _ref.setStagedTrigger,
      onStepIndexChange = _ref.onStepIndexChange;
  var onBack = useCallback(function () {
    setStagedTrigger(getDefaultFirstTrigger());
    onStepIndexChange({
      target: {
        value: 0
      }
    });
  }, [setStagedTrigger, onStepIndexChange]);
  var formComponent = isFormSubmissionTrigger(stagedTrigger) ? /*#__PURE__*/_jsx(FormSubmissionConfig, {}) : /*#__PURE__*/_jsx(PageviewConfig, {});
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TriggerStepHeader, {}), /*#__PURE__*/_jsxs(UISection, {
      children: [/*#__PURE__*/_jsx(UIBackButton, {
        className: "flex-shrink-0",
        children: /*#__PURE__*/_jsx(UILink, {
          onClick: onBack,
          disabled: !canEditSequencesContextualWorkflows(),
          "data-test-id": "back-to-trigger-type-select",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.button.back"
          })
        })
      }), formComponent]
    })]
  });
};
TriggerStepConfig.propTypes = {
  stagedTrigger: PropTypes.object.isRequired,
  setStagedTrigger: PropTypes.func.isRequired,
  onStepIndexChange: PropTypes.func.isRequired
};
export default withFlowEditorContext(TriggerStepConfig);