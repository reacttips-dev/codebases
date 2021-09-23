'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sequenceIdSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import { createFlow, updateFlow } from 'SequencesUI/actions/FlowActions';
import { buildUpdatedFlow, getFirstTrigger, getFirstAction } from 'SequencesUI/util/automation/flowUtils';
import { FlowBuilderPanelStepIndex } from '../lib/WizardSteps';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIWizard from 'UIComponents/dialog/UIWizard';
import UIWizardStep from 'UIComponents/dialog/UIWizardStep';
import FlowBuilderPanelHeader from './FlowBuilderPanelHeader';
import FlowBuilderPanelFooter from './FlowBuilderPanelFooter';
import TriggerStepSelectType from './trigger/TriggerStepSelectType';
import TriggerStepConfig from './trigger/TriggerStepConfig';
import ActionStep from './action/ActionStep';
import { FlowEditorProvider } from './FlowEditorContext';

var FlowBuilderPanel = function FlowBuilderPanel(_ref) {
  var onClose = _ref.onClose,
      onConfirm = _ref.onConfirm,
      _ref$initialStepIndex = _ref.initialStepIndex,
      initialStepIndex = _ref$initialStepIndex === void 0 ? FlowBuilderPanelStepIndex.TRIGGER_SELECT_STEP : _ref$initialStepIndex,
      flowIdBeingEdited = _ref.flowIdBeingEdited;

  var _useState = useState(initialStepIndex),
      _useState2 = _slicedToArray(_useState, 2),
      stepIndex = _useState2[0],
      setStepIndex = _useState2[1];

  var onStepIndexChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setStepIndex(value);
  }, []);
  return /*#__PURE__*/_jsx(UIModalPanel, {
    "data-test-id": "automation-side-panel",
    children: /*#__PURE__*/_jsxs(UIWizard, {
      headerComponent: FlowBuilderPanelHeader,
      onReject: onClose,
      onConfirm: onConfirm,
      onStepIndexChange: onStepIndexChange,
      stepIndex: stepIndex,
      footerComponent: FlowBuilderPanelFooter,
      flowIdBeingEdited: flowIdBeingEdited,
      children: [/*#__PURE__*/_jsx(UIWizardStep, {
        name: I18n.text('sequencesAutomation.panel.triggerStep.stepName'),
        "data-test-id": "select-trigger-type",
        children: /*#__PURE__*/_jsx(TriggerStepSelectType, {
          onStepIndexChange: onStepIndexChange
        })
      }), /*#__PURE__*/_jsx(UIWizardStep, {
        name: I18n.text('sequencesAutomation.panel.triggerStep.stepName'),
        "data-test-id": "trigger-config",
        children: /*#__PURE__*/_jsx(TriggerStepConfig, {
          onStepIndexChange: onStepIndexChange
        })
      }), /*#__PURE__*/_jsx(UIWizardStep, {
        name: I18n.text('sequencesAutomation.panel.actionStep.stepName'),
        "data-test-id": "action-config",
        children: /*#__PURE__*/_jsx(ActionStep, {})
      })]
    })
  });
};

FlowBuilderPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  initialStepIndex: PropTypes.number.isRequired,
  flowIdBeingEdited: PropTypes.number
};

var FlowBuilderPanelContainer = function FlowBuilderPanelContainer(props) {
  var flow = useSelector(selectFlowById(props.flowIdBeingEdited));

  var _useState3 = useState(getFirstTrigger(flow)),
      _useState4 = _slicedToArray(_useState3, 2),
      stagedTrigger = _useState4[0],
      setStagedTrigger = _useState4[1];

  var _useState5 = useState(getFirstAction(flow)),
      _useState6 = _slicedToArray(_useState5, 2),
      stagedAction = _useState6[0],
      setStagedAction = _useState6[1];

  useEffect(function () {
    setStagedTrigger(getFirstTrigger(flow));
    setStagedAction(getFirstAction(flow));
  }, [flow, props.flowIdBeingEdited]);
  var flowIdBeingEdited = props.flowIdBeingEdited,
      onClose = props.onClose;
  var sequenceId = useSelector(sequenceIdSelector);
  var dispatch = useDispatch();
  var createOrUpdateFlow = useCallback(function () {
    var updatedFlow = buildUpdatedFlow({
      flow: flow,
      stagedAction: stagedAction,
      stagedTrigger: stagedTrigger,
      sequenceId: sequenceId
    });

    if (flowIdBeingEdited) {
      dispatch(updateFlow({
        flow: updatedFlow
      }));
    } else {
      dispatch(createFlow({
        flow: updatedFlow
      }));
    }

    onClose();
  }, [flowIdBeingEdited, onClose, dispatch, flow, stagedAction, stagedTrigger, sequenceId]);
  return /*#__PURE__*/_jsx(FlowEditorProvider, {
    value: {
      stagedTrigger: stagedTrigger,
      setStagedTrigger: setStagedTrigger,
      stagedAction: stagedAction,
      setStagedAction: setStagedAction
    },
    children: /*#__PURE__*/_jsx(FlowBuilderPanel, Object.assign({}, props, {
      onConfirm: createOrUpdateFlow
    }))
  });
};

FlowBuilderPanelContainer.InnerComponent = FlowBuilderPanel;
export default FlowBuilderPanelContainer;