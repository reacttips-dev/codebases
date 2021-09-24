'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import UIButton from 'UIComponents/button/UIButton';
import { deleteFlow } from 'SequencesUI/actions/FlowActions';

var DeleteWorkflowModal = function DeleteWorkflowModal(_ref) {
  var setDeleteModalOpen = _ref.setDeleteModalOpen,
      currentFlowId = _ref.currentFlowId;
  var dispatch = useDispatch();
  var handleDeleteClick = useCallback(function () {
    dispatch(deleteFlow(currentFlowId));
    setDeleteModalOpen(false);
  }, [dispatch, currentFlowId, setDeleteModalOpen]);
  return /*#__PURE__*/_jsxs(UIModal, {
    use: "danger",
    "data-test-id": "delete-flow-modal",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.modal.deleteWorkflow.title"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: function onClick() {
          return setDeleteModalOpen(false);
        }
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "sequencesAutomation.modal.deleteWorkflow.body"
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "danger",
        onClick: function onClick() {
          return handleDeleteClick();
        },
        "data-test-id": "confirm-delete",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.button.delete"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        onClick: function onClick() {
          return setDeleteModalOpen(false);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.button.cancel"
        })
      })]
    })]
  });
};

export default DeleteWorkflowModal;