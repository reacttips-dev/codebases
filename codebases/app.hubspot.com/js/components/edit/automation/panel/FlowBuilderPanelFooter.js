'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { withFlowEditorContext } from './FlowEditorContext';
import { isTriggerValid } from '../lib/Triggers';
import { isActionValid } from '../lib/Actions';
import { FlowBuilderPanelStepIndex } from '../lib/WizardSteps';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';

var getDoneButton = function getDoneButton(_ref) {
  var stagedTrigger = _ref.stagedTrigger,
      stagedAction = _ref.stagedAction,
      flowIdBeingEdited = _ref.flowIdBeingEdited,
      onClickDone = _ref.onClickDone;

  if (!canEditSequencesContextualWorkflows()) {
    return null;
  }

  var doneButtonEnabled = stagedAction && isActionValid(stagedAction) || stagedTrigger && isTriggerValid(stagedTrigger);
  var doneLabelMessage = flowIdBeingEdited === undefined ? 'sequencesAutomation.button.create' : 'sequencesAutomation.button.save';
  return /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onClickDone,
    disabled: !doneButtonEnabled,
    "data-test-id": "panel-done-button",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: doneLabelMessage
    })
  });
};

var getGoToActionButton = function getGoToActionButton(_ref2) {
  var stagedTrigger = _ref2.stagedTrigger,
      onClickNext = _ref2.onClickNext;
  var nextButtonEnabled = isTriggerValid(stagedTrigger);
  return /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onClickNext,
    disabled: !nextButtonEnabled,
    "data-test-id": "go-to-action-step",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: canEditSequencesContextualWorkflows() ? 'sequencesAutomation.panel.footer.goToActionStep' : 'sequencesAutomation.panel.footer.viewActionStep'
    })
  });
};

var FlowBuilderPanelFooter = function FlowBuilderPanelFooter(_ref3) {
  var stagedTrigger = _ref3.stagedTrigger,
      stagedAction = _ref3.stagedAction,
      isLastStep = _ref3.isLastStep,
      onClickCancel = _ref3.onClickCancel,
      onClickDone = _ref3.onClickDone,
      onClickNext = _ref3.onClickNext,
      stepIndex = _ref3.stepIndex,
      flowIdBeingEdited = _ref3.wizardProps.flowIdBeingEdited;
  var primaryButton;

  if (stepIndex === FlowBuilderPanelStepIndex.TRIGGER_CONFIG_STEP) {
    var isCreate = !flowIdBeingEdited;
    primaryButton = isCreate ? getGoToActionButton({
      stagedTrigger: stagedTrigger,
      onClickNext: onClickNext
    }) : getDoneButton({
      stagedTrigger: stagedTrigger,
      flowIdBeingEdited: flowIdBeingEdited,
      onClickDone: onClickDone
    });
  } else if (isLastStep) {
    primaryButton = getDoneButton({
      stagedAction: stagedAction,
      flowIdBeingEdited: flowIdBeingEdited,
      onClickDone: onClickDone
    });
  }

  return /*#__PURE__*/_jsxs(UIDialogFooter, {
    children: [primaryButton, /*#__PURE__*/_jsx(UIButton, {
      onClick: onClickCancel,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.button.cancel"
      })
    })]
  });
};

FlowBuilderPanelFooter.propTypes = {
  stagedTrigger: PropTypes.object.isRequired,
  stagedAction: PropTypes.object.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  onClickDone: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  stepIndex: PropTypes.number.isRequired,
  wizardProps: PropTypes.shape({
    flowIdBeingEdited: PropTypes.number
  }).isRequired
};
export default withFlowEditorContext(FlowBuilderPanelFooter);