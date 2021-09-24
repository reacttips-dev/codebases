'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sequenceIdSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import { selectFlowIds, selectFlows } from 'SequencesUI/selectors/flowSelectors';
import { fetchFlowIdsForSequence, fetchFlows } from 'SequencesUI/actions/FlowActions';
import { canWrite, canViewWorkflows, canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import { FlowBuilderPanelStepIndex } from './lib/WizardSteps';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UISection from 'UIComponents/section/UISection';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import AutomationTable from './table/AutomationTable';
import PanelErrorBoundary from './panel/PanelErrorBoundary';
import FlowBuilderPanel from './panel/FlowBuilderPanel';
import DisableWorkFlowTooltip from './DisableWorkFlowTooltip';
import WorkflowPermissionTooltip from './table/WorkflowPermissionTooltip';

function wrapWithTooltip(childNode, sequenceId) {
  if (sequenceId === 'new') {
    return /*#__PURE__*/_jsx(DisableWorkFlowTooltip, {
      children: childNode
    });
  } else if (!canWrite()) {
    return /*#__PURE__*/_jsx(EditSequenceTooltip, {
      children: childNode
    });
  } else {
    return /*#__PURE__*/_jsx(WorkflowPermissionTooltip, {
      disabled: canViewWorkflows() && canEditSequencesContextualWorkflows(),
      children: childNode
    });
  }
}

var AutomationTabContent = function AutomationTabContent() {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      flowIdBeingEdited = _useState2[0],
      setFlowIdBeingEdited = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isFlowPanelOpen = _useState4[0],
      setFlowPanelOpen = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      initialStepIndex = _useState6[0],
      setInitialStepIndex = _useState6[1];

  var openPanel = useCallback(function (_initialStepIndex, flowId) {
    setFlowIdBeingEdited(flowId);
    setFlowPanelOpen(true);
    setInitialStepIndex(_initialStepIndex);
  }, []);
  var closePanel = useCallback(function () {
    return setFlowPanelOpen(false);
  }, []);
  var handleCreateClick = useCallback(function () {
    return openPanel(FlowBuilderPanelStepIndex.TRIGGER_SELECT_STEP);
  }, [openPanel]);
  var dispatch = useDispatch();
  var flowIds = useSelector(selectFlowIds);
  var flows = useSelector(selectFlows);
  var sequenceId = useSelector(sequenceIdSelector);
  useEffect(function () {
    if (canViewWorkflows() && !flowIds && sequenceId !== 'new') dispatch(fetchFlowIdsForSequence(sequenceId));
  }, [flowIds, sequenceId, dispatch]);
  useEffect(function () {
    if (canViewWorkflows() && flowIds && !flows) dispatch(fetchFlows(flowIds));
  }, [flows, flowIds, dispatch]);
  var disableCreateWorkflowButton = !canWrite() || !canViewWorkflows() || !canEditSequencesContextualWorkflows() || sequenceId === 'new';
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [isFlowPanelOpen && /*#__PURE__*/_jsx(PanelErrorBoundary, {
      onClose: closePanel,
      flowIdBeingEdited: flowIdBeingEdited,
      children: /*#__PURE__*/_jsx(FlowBuilderPanel, {
        onClose: closePanel,
        flowIdBeingEdited: flowIdBeingEdited,
        initialStepIndex: initialStepIndex
      })
    }), /*#__PURE__*/_jsx(UISection, {
      children: /*#__PURE__*/_jsxs(UIFlex, {
        justify: "between",
        align: "center",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(H4, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequencesAutomation.sectionHeader"
            })
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.sectionDescription"
          })]
        }), wrapWithTooltip( /*#__PURE__*/_jsx(UIButton, {
          use: "tertiary",
          onClick: handleCreateClick,
          disabled: disableCreateWorkflowButton,
          "data-test-id": "create-workflow-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.button.createWorkflow"
          })
        }), sequenceId)]
      })
    }), /*#__PURE__*/_jsx(UISection, {
      children: /*#__PURE__*/_jsx(AutomationTable, {
        flowIds: flowIds,
        openFlowPanel: openPanel
      })
    })]
  });
};

export default AutomationTabContent;