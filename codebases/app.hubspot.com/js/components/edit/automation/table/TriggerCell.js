'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { canWrite, canDeleteWorkflows, canEditSequencesContextualWorkflows, canDeleteSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import { FlowBuilderPanelStepIndex } from '../lib/WizardSteps';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UITableHoverCell from 'UIComponents/table/UITableHoverCell';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import TriggerCellLabel from './TriggerCellLabel';
import WorkflowPermissionTooltip from './WorkflowPermissionTooltip';

var DeleteButtonTooltip = function DeleteButtonTooltip(_ref) {
  var children = _ref.children;

  if (!canWrite()) {
    return /*#__PURE__*/_jsx(EditSequenceTooltip, {
      placement: "right",
      children: children
    });
  }

  if (!canDeleteWorkflows()) {
    return /*#__PURE__*/_jsx(WorkflowPermissionTooltip, {
      disabled: canDeleteWorkflows(),
      placement: "right",
      children: children
    });
  }

  return children;
};

var TriggerCell = function TriggerCell(_ref2) {
  var flowId = _ref2.flowId,
      openFlowPanel = _ref2.openFlowPanel,
      handleDeleteClick = _ref2.handleDeleteClick;
  var openPanelTriggerStep = useCallback(function () {
    openFlowPanel(FlowBuilderPanelStepIndex.TRIGGER_CONFIG_STEP, flowId);
  }, [openFlowPanel, flowId]);
  var openPanelActionStep = useCallback(function () {
    openFlowPanel(FlowBuilderPanelStepIndex.ACTION_STEP, flowId);
  }, [openFlowPanel, flowId]);
  return /*#__PURE__*/_jsx(UITableHoverCell, {
    hoverContent: /*#__PURE__*/_jsx(UIDropdown, {
      buttonSize: "small",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesAutomation.tableActions.actions"
      }),
      "data-test-id": "actions-dropdown-" + flowId,
      children: /*#__PURE__*/_jsxs(UIList, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          onClick: openPanelTriggerStep,
          "data-test-id": "flow-edit-trigger",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: canEditSequencesContextualWorkflows() ? 'sequencesAutomation.tableActions.editTrigger' : 'sequencesAutomation.tableActions.viewTrigger'
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          onClick: openPanelActionStep,
          "data-test-id": "flow-edit-action",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: canEditSequencesContextualWorkflows() ? 'sequencesAutomation.tableActions.editAction' : 'sequencesAutomation.tableActions.viewAction'
          })
        }), /*#__PURE__*/_jsx(DeleteButtonTooltip, {
          children: /*#__PURE__*/_jsx(UIButton, {
            responsive: false,
            onClick: function onClick() {
              return handleDeleteClick(flowId);
            },
            disabled: !canDeleteSequencesContextualWorkflows(),
            "data-test-id": "flow-delete",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequencesAutomation.button.delete"
            })
          })
        })]
      })
    }),
    children: /*#__PURE__*/_jsx(TriggerCellLabel, {
      flowId: flowId
    })
  });
};

TriggerCell.propTypes = {
  flowId: PropTypes.number.isRequired,
  openFlowPanel: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired
};
export default TriggerCell;