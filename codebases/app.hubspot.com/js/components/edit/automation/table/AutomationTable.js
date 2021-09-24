'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFlows, selectFlowIds } from 'SequencesUI/selectors/flowSelectors';
import { sequenceIdSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import { canViewWorkflows } from 'SequencesUI/lib/permissions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITable from 'UIComponents/table/UITable';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import DefaultSequenceAutomation from './DefaultSequenceAutomation';
import AutomationTableRow from './AutomationTableRow';
import DeleteWorkflowModal from './DeleteWorkflowModal';

var AutomationTable = function AutomationTable(_ref) {
  var openFlowPanel = _ref.openFlowPanel;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isDeleteModalOpen = _useState2[0],
      setDeleteModalOpen = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      currentFlowId = _useState4[0],
      setCurrentFlowId = _useState4[1];

  var handleDeleteWorkflow = function handleDeleteWorkflow(flowId) {
    setCurrentFlowId(flowId);
    setDeleteModalOpen(true);
  };

  var sequenceId = useSelector(sequenceIdSelector);
  var flowIds = useSelector(selectFlowIds);
  var flows = useSelector(selectFlows);
  var loading = !flowIds || !flows;
  return /*#__PURE__*/_jsxs("div", {
    style: {
      position: 'relative'
    },
    children: [isDeleteModalOpen && /*#__PURE__*/_jsx(DeleteWorkflowModal, {
      setDeleteModalOpen: setDeleteModalOpen,
      currentFlowId: currentFlowId
    }), canViewWorkflows() && loading && sequenceId !== 'new' && /*#__PURE__*/_jsx(UILoadingOverlay, {
      contextual: true
    }), /*#__PURE__*/_jsxs(UITable, {
      "data-test-id": !loading && 'contextual-automation-table',
      children: [/*#__PURE__*/_jsxs("colgroup", {
        children: [/*#__PURE__*/_jsx("col", {
          style: {
            width: '50%'
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: '50%'
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        })]
      }), /*#__PURE__*/_jsx("thead", {
        children: /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx("th", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequencesAutomation.table.header.trigger"
            })
          }), /*#__PURE__*/_jsx("th", {
            colSpan: 2,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequencesAutomation.table.header.action"
            })
          })]
        })
      }), /*#__PURE__*/_jsxs("tbody", {
        children: [/*#__PURE__*/_jsx(DefaultSequenceAutomation, {}), !loading && flowIds.map(function (flowId) {
          return /*#__PURE__*/_jsx(AutomationTableRow, {
            flowId: flowId,
            openFlowPanel: openFlowPanel,
            handleDeleteClick: handleDeleteWorkflow
          }, flowId);
        })]
      })]
    })]
  });
};

AutomationTable.propTypes = {
  openFlowPanel: PropTypes.func.isRequired
};
export default AutomationTable;