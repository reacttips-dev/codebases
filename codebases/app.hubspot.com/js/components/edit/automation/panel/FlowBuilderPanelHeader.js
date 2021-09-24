'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import styled from 'styled-components';
import { OLAF } from 'HubStyleTokens/colors';
import { FlowBuilderPanelStepIndex, getStepIndicatorStepNames } from '../lib/WizardSteps';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIStepIndicator from 'UIComponents/connectedStep/UIStepIndicator';
import H4 from 'UIComponents/elements/headings/H4';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIDialogBackButton from 'UIComponents/dialog/UIDialogBackButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader'; // Taken from UIPanelHeader

var BackButtonWrapper = styled.div.withConfig({
  displayName: "FlowBuilderPanelHeader__BackButtonWrapper",
  componentId: "sc-1ykfxdq-0"
})(["position:relative;left:-12px;margin-right:28px;&::after{background-color:", ";content:'';height:32px;opacity:0.5;position:absolute;right:-21px;top:50%;transform:translateY(-50%);width:1px;}"], OLAF);

function getHeaderMessage(isActionStep, isCreate) {
  if (!canEditSequencesContextualWorkflows()) {
    return isActionStep ? 'sequencesAutomation.panel.header.actionReadOnly' : 'sequencesAutomation.panel.header.triggerReadOnly';
  } else if (isCreate) {
    return isActionStep ? 'sequencesAutomation.panel.header.action' : 'sequencesAutomation.panel.header.trigger';
  } else {
    return isActionStep ? 'sequencesAutomation.panel.header.actionEdit' : 'sequencesAutomation.panel.header.triggerEdit';
  }
}

var FlowBuilderPanelHeader = function FlowBuilderPanelHeader(props) {
  var stepProps = props.stepProps,
      wizardProps = props.wizardProps;
  var onReject = wizardProps.onReject,
      onStepIndexChange = wizardProps.onStepIndexChange,
      stepIndex = wizardProps.stepIndex,
      flowIdBeingEdited = wizardProps.flowIdBeingEdited;
  var isCreate = !flowIdBeingEdited;
  var stepNames = getStepIndicatorStepNames();
  var currentStepName = stepProps.name;
  var isActionStep = stepIndex === FlowBuilderPanelStepIndex.ACTION_STEP;
  var onBack = useCallback(function () {
    return onStepIndexChange({
      target: {
        value: stepIndex - 1
      }
    });
  }, [onStepIndexChange, stepIndex]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
      onClick: onReject,
      "data-wizard-action-name": "close"
    }), /*#__PURE__*/_jsxs(UIDialogHeader, {
      className: "uiWizardHeader",
      children: [isCreate && isActionStep && /*#__PURE__*/_jsx(BackButtonWrapper, {
        children: /*#__PURE__*/_jsx(UIDialogBackButton, {
          onClick: onBack
        })
      }), /*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getHeaderMessage(isActionStep, isCreate)
        })
      })]
    }), isCreate && /*#__PURE__*/_jsx(UIPanelSection, {
      className: "p-top-5 m-bottom-0",
      children: /*#__PURE__*/_jsx(UIFlex, {
        children: /*#__PURE__*/_jsx(UIStepIndicator, {
          direction: "horizontal",
          stepIndex: stepNames.indexOf(currentStepName),
          stepNames: stepNames
        })
      })
    })]
  });
};

FlowBuilderPanelHeader.propTypes = {
  stepProps: PropTypes.object.isRequired,
  wizardProps: PropTypes.object.isRequired
};
export default FlowBuilderPanelHeader;